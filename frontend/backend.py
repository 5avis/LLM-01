import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
import json
import io
import requests as req_lib
from datetime import datetime
from pypdf import PdfReader

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from io import BytesIO

class FastAPIFileResponse(Response):
    """File response supporting in-memory BytesIO buffers or file paths for FastAPI."""
    def __init__(self, content, media_type="application/pdf", filename="medhub_schedule.pdf", **kwargs):
        if hasattr(content, "getvalue"):
            data = content.getvalue()
        elif isinstance(content, (bytes, bytearray)):
            data = bytes(content)
        else:
            with open(content, "rb") as f:
                data = f.read()
        headers = kwargs.get("headers", {})
        headers["Content-Disposition"] = f'attachment; filename="{filename}"'
        kwargs["headers"] = headers
        super().__init__(content=data, media_type=media_type, **kwargs)

from gpu_utils import get_safe_gpu_utilization
from vllm import LLM, SamplingParams
from vllm.lora.request import LoRARequest
from fda_lookup import find_drug_in_text

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(FRONTEND_DIR, "static")

base_model = "Qwen/Qwen2.5-14B-Instruct"
lora_path = os.path.join(BASE_DIR, "medical_assistant_model")

import multiprocessing

if multiprocessing.current_process().name == "MainProcess":
    print("Loading model...")
    safe_util = get_safe_gpu_utilization(gpu_id=0)
    llm = LLM(
        model=base_model,
        dtype="bfloat16",
        gpu_memory_utilization=safe_util,
        enable_lora=True,
        max_lora_rank=8,
        max_model_len=2048,
        enforce_eager=True
    )
    lora_request = LoRARequest("medical_assistant", 1, lora_path)
    sampling_params = SamplingParams(max_tokens=300, temperature=0.3)
    print("Model loaded!")
else:
    llm = None
    lora_request = None
    sampling_params = None

OCR_SPACE_API_KEY = "K82648358988957"

EMOTIONAL_KEYWORDS = ["terminal", "dying", "died", "death", "grief", "loss",
    "diagnosed with cancer", "given months to live", "passed away", "hospice",
    "end of life", "devastated", "heartbroken", "palliative", "stage 4"]

EMERGENCY_KEYWORDS = ["chest pain", "chest tightness", "can't breathe",
    "difficulty breathing", "shortness of breath", "swallowed", "poison",
    "overdose", "unconscious", "seizure", "stroke", "suicidal", "kill myself",
    "self harm", "want to die"]

BASE_SAFETY_INSTRUCTION = (
    "You are MedHub, a general medical assistant, not a specialist. "
    "Always respond in the SAME language the patient used to ask their question. "
    "If asked for a schedule, medication plan, or timeline: FORMAT AS A TABLE with columns like Time/Day | Activity/Medication | Notes. "
    "Keep answers SHORT and DIRECT — give only the best recommendation, no alternatives. "
    "If asked for a schedule or plan, give ONE clear, simple schedule only. "
    "Use bullet points or numbered lists for clarity. "
    "Only state a dosage if verified FDA information is explicitly provided below "
    "AND it covers the patient's specific case. Otherwise say to consult a doctor."
)

def is_emotionally_sensitive(text):
    return any(k in text.lower() for k in EMOTIONAL_KEYWORDS)

def is_emergency(text):
    return any(k in text.lower() for k in EMERGENCY_KEYWORDS)

def build_prompt(user_input):
    instruction = BASE_SAFETY_INSTRUCTION
    fda_context = ""
    drug_name, drug_info = find_drug_in_text(user_input)
    if drug_info:
        fda_context = f"\n\nVerified FDA info about {drug_name}:\nDosage: {drug_info['dosage'][:800]}\nWarnings: {drug_info['warnings'][:500]}\n"
        instruction += " Use the verified FDA info below if it answers the question."
    if is_emergency(user_input):
        instruction += " This may be an emergency — clearly tell the patient to call emergency services immediately."
    if is_emotionally_sensitive(user_input):
        instruction += " Respond with genuine empathy first, acknowledging their feelings before giving guidance."
    return f"### Instruction:\n{instruction}{fda_context}\n\n### Patient:\n{user_input}\n\n### Doctor:\n"

def log_conversation(user_input, response):
    logs_dir = os.path.join(BASE_DIR, "logs")
    os.makedirs(logs_dir, exist_ok=True)
    with open(os.path.join(logs_dir, "app_logs.jsonl"), "a") as f:
        f.write(json.dumps({"timestamp": datetime.now().isoformat(), "patient": user_input, "doctor": response}) + "\n")

def extract_text_from_file(file_bytes, filename):
    if filename.lower().endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text.strip()
    else:
        response = req_lib.post(
            "https://api.ocr.space/parse/image",
            files={"file": (filename, file_bytes)},
            data={"apikey": OCR_SPACE_API_KEY, "language": "eng"},
            timeout=30
        )
        result = response.json()
        try:
            return result["ParsedResults"][0]["ParsedText"].strip()
        except (KeyError, IndexError):
            return "Could not extract text from image."

def generate_schedule_pdf(schedule_text):
    """Convert schedule text/table to PDF"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    elements = []
    styles = getSampleStyleSheet()

    # Add title
    title = Paragraph("MedHub Schedule", styles['Heading1'])
    elements.append(title)
    elements.append(Spacer(1, 10))

    lines = schedule_text.strip().split('\n')
    pre_table = []
    table_lines = []
    post_table = []
    in_table = False

    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        if '|' in line:
            stripped = line.strip('|').strip()
            if all(c in '-: |' for c in stripped):
                in_table = True
                continue
            table_lines.append(line)
            in_table = True
        elif in_table:
            post_table.append(line)
        else:
            pre_table.append(line)

    for text in pre_table:
        elements.append(Paragraph(text, styles['Normal']))
        elements.append(Spacer(1, 6))

    table_data = []
    if table_lines:
        for line in table_lines:
            cols = [c.strip() for c in line.strip('|').split('|')]
            table_data.append(cols)
    else:
        table_data = [line.split('|') for line in lines if line.strip()]

    if table_data and len(table_data) > 0 and len(table_data[0]) > 1:
        max_cols = max(len(r) for r in table_data)
        normalized_data = []
        for r_idx, row in enumerate(table_data):
            padded = row + [''] * (max_cols - len(row))
            row_elements = []
            for col in padded:
                if r_idx == 0:
                    p = Paragraph(f'<b><font color="white">{col}</font></b>', styles['Normal'])
                else:
                    p = Paragraph(col, styles['Normal'])
                row_elements.append(p)
            normalized_data.append(row_elements)

        col_width = (doc.width) / max_cols
        table = Table(normalized_data, colWidths=[col_width] * max_cols)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#374151')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#f3f4f6'), colors.white]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#9ca3af'))
        ]))
        elements.append(table)
        elements.append(Spacer(1, 10))
    elif table_data:
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(table)
    else:
        elements.append(Paragraph(schedule_text, styles['Normal']))

    for text in post_table:
        elements.append(Paragraph(text, styles['Normal']))
        elements.append(Spacer(1, 6))

    doc.build(elements)
    buffer.seek(0)
    return buffer

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat(req: ChatRequest):
    prompt = build_prompt(req.message)
    output = llm.generate(prompt, sampling_params, lora_request=lora_request)
    response = output[0].outputs[0].text.strip()
    log_conversation(req.message, response)
    return {"response": response}

@app.post("/api/chat-with-file")
async def chat_with_file(message: str = Form(...), file: UploadFile = File(None)):
    full_message = message
    if file:
        file_bytes = await file.read()
        extracted_text = extract_text_from_file(file_bytes, file.filename)
        full_message += f"\n\n[Extracted text from uploaded file]:\n{extracted_text}"

    prompt = build_prompt(full_message)
    output = llm.generate(prompt, sampling_params, lora_request=lora_request)
    response = output[0].outputs[0].text.strip()
    log_conversation(full_message, response)
    return {"response": response}

@app.post("/api/generate-schedule-pdf")
async def generate_schedule_pdf_endpoint(message: str = Form(...), schedule_text: str = Form(None)):
    if schedule_text and schedule_text.strip():
        response = schedule_text.strip()
    elif "|" in message and "\n" in message:
        response = message
    else:
        prompt = build_prompt(message)
        output = llm.generate(prompt, sampling_params, lora_request=lora_request)
        response = output[0].outputs[0].text.strip()
        log_conversation(message, response)

    # Generate PDF
    pdf_buffer = generate_schedule_pdf(response)

    return FastAPIFileResponse(
        pdf_buffer,
        media_type="application/pdf",
        filename="medhub_schedule.pdf"
    )

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 60)
    print(" MedHub AI Assistant is live and ready!")
    print(" Network URL: http://192.168.4.99:7860")
    print(" Local URL:   http://localhost:7860")
    print("=" * 60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=7860)
