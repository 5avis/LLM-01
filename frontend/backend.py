import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
import json
import io
import hashlib
import secrets
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
    sampling_params = SamplingParams(max_tokens=200, temperature=0.2)
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
    "You are MedHub, a direct and concise AI medical assistant. "
    "Your purpose is strictly to assist with health, symptoms, illnesses, medications, first aid, and health schedules.\n"
    "1. Strict Medical Scope & Refusal: You strictly answer ONLY health, medical, symptom, medication, and clinical schedule questions. If the user asks ANY non-medical question (such as coding, math, history, politics, sports, general knowledge, recipes, movies, or casual chit-chat), you MUST refuse in ONE short sentence: 'I am MedHub, a medical assistant. Please ask me only health, symptom, medication, or medical schedule-related questions.'\n"
    "2. Strict Brevity & Conciseness: Keep answers SHORT, DIRECT, and strictly under 3-4 bullet points or short sentences. Do NOT write long paragraphs, generic essays, or unsolicited filler advice.\n"
    "3. Greetings: For simple greetings (like 'hi' or 'hello'), reply in ONE short sentence: 'Hello! I am MedHub, your medical assistant. How can I assist with your health or medications today?'\n"
    "4. Answer Only What is Asked: Answer ONLY the specific question asked. Do NOT invent routines or extra unsolicited plans.\n"
    "5. Format Schedules as Table: ONLY if explicitly asked for a schedule, medication plan, or routine, format it as a compact markdown table.\n"
    "6. Dosage Safety: Only state specific numeric dosages if verified FDA info is explicitly provided below; otherwise advise consulting a doctor or pharmacist.\n"
    "7. Doctor Guidance: For medical concerns, provide brief, accurate guidance and recommend consulting a healthcare professional if symptoms persist."
)

import re

REFUSAL_MESSAGE = "I am MedHub, a medical assistant. Please ask me only health, symptom, medication, or medical schedule-related questions."
REFUSAL_MESSAGE_SUBSEQUENT = "Please ask me only health, symptom, medication, or medical schedule-related questions."

def strip_repeated_intro(text: str) -> str:
    """Strips repetitive greetings and self-introductions (e.g. 'Hello! I am MedHub...') from follow-up messages."""
    pattern = r'^(?:\s*(?:hello|hi|hey|greetings)[\s,!.]*)*(?:I(?:\'m|\s+am)\s+MedHub[^\.\n]*[\.\!\:\-]?\s*|As\s+MedHub[^\.\n]*[\.\!\:\-]?\s*)'
    cleaned = re.sub(pattern, '', text.strip(), flags=re.IGNORECASE).strip()
    return cleaned if cleaned else text

EXPLICIT_NON_MEDICAL_KEYWORDS = [
    "write code", "write a python", "write python", "write a script", "create a function",
    "write a program", "reverse a list", "reverse a string", "bubble sort", "binary search",
    "capital of", "who won the", "who was the first president", "who is the president of",
    "tell me a joke", "write an essay", "write a poem", "solve the equation", "solve this math",
    "recipe for", "how to cook", "how to bake", "weather in", "weather forecast",
    "who is the ceo", "stock price", "crypto", "bitcoin", "football", "cricket", "basketball",
    "car", "bike", "game", "gaming", "translate to", "history of", "summarize the book",
    "recommend a movie", "recommend a song", "lyrics of", "how to make money", "politics"
]

def is_explicitly_non_medical(text):
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in EXPLICIT_NON_MEDICAL_KEYWORDS)

def sanitize_response(user_input, response, is_first_message=True):
    if any(code_tag in response for code_tag in ["```python", "```javascript", "```java", "```c", "```cpp", "```html", "```sql"]):
        return REFUSAL_MESSAGE if is_first_message else REFUSAL_MESSAGE_SUBSEQUENT
    if not is_first_message:
        response = strip_repeated_intro(response)
    return response

def is_emotionally_sensitive(text):
    return any(k in text.lower() for k in EMOTIONAL_KEYWORDS)

def is_emergency(text):
    return any(k in text.lower() for k in EMERGENCY_KEYWORDS)

def build_prompt(user_input, is_first_message=True):
    instruction = BASE_SAFETY_INSTRUCTION
    if not is_first_message:
        instruction += "\nCRITICAL: DO NOT introduce yourself. Do NOT say 'I am MedHub' or 'Hello'. Jump directly into the medical facts and answer."
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

USER_DATA_DIR = os.path.join(BASE_DIR, "user_data")
USERS_DB_FILE = os.path.join(USER_DATA_DIR, "users.json")
os.makedirs(USER_DATA_DIR, exist_ok=True)

def sanitize_username(username: str) -> str:
    """Returns a sanitized username containing only alphanumeric, hyphen, and underscore characters."""
    if not username:
        return ""
    return "".join(c for c in username.strip() if c.isalnum() or c in ("-", "_"))

def load_users():
    if not os.path.exists(USERS_DB_FILE):
        return {}
    try:
        with open(USERS_DB_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}

def save_users(users):
    os.makedirs(USER_DATA_DIR, exist_ok=True)
    with open(USERS_DB_FILE, "w") as f:
        json.dump(users, f, indent=2)

def hash_password(password: str, salt: str = "") -> str:
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

def get_user_dir(username: str) -> str:
    safe = sanitize_username(username)
    return os.path.join(USER_DATA_DIR, safe)

def get_user_log_path(username: str) -> str:
    safe = sanitize_username(username)
    return os.path.join(get_user_dir(safe), f"{safe}.jsonl")

def init_user_storage(username: str):
    """Ensures user directory and username.jsonl exist; recreates if deleted."""
    safe = sanitize_username(username)
    if not safe:
        return None
    user_dir = get_user_dir(safe)
    os.makedirs(user_dir, exist_ok=True)
    log_path = get_user_log_path(safe)
    if not os.path.exists(log_path):
        with open(log_path, "w") as f:
            pass
    return log_path

def log_user_conversation(username: str, user_input: str, bot_response: str):
    """Logs conversation to the user's personal log file. Recreates folder & file if deleted."""
    safe = sanitize_username(username)
    if not safe:
        safe = "guest"
    try:
        log_path = init_user_storage(safe)
        if log_path:
            with open(log_path, "a") as f:
                record = {
                    "timestamp": datetime.now().isoformat(),
                    "username": safe,
                    "patient": user_input,
                    "doctor": bot_response
                }
                f.write(json.dumps(record) + "\n")
    except Exception as e:
        print(f"Error logging for user {safe}: {e}")

def get_user_history(username: str):
    """Reads user's conversation history. Returns [] without error if file was deleted."""
    safe = sanitize_username(username)
    if not safe:
        return []
    log_path = get_user_log_path(safe)
    if not os.path.exists(log_path):
        return []
    history = []
    try:
        with open(log_path, "r") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        history.append(json.loads(line))
                    except Exception:
                        continue
    except Exception as e:
        print(f"Error reading history for {safe}: {e}")
        return []
    return history

def log_conversation(user_input, response):
    logs_dir = os.path.join(BASE_DIR, "logs")
    os.makedirs(logs_dir, exist_ok=True)
    with open(os.path.join(logs_dir, "app_logs.jsonl"), "a") as f:
        f.write(json.dumps({"timestamp": datetime.now().isoformat(), "patient": user_input, "doctor": response}) + "\n")

def extract_text_from_file(file_bytes, filename):
    try:
        if not file_bytes or len(file_bytes) == 0:
            return ""
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
    except Exception as e:
        print(f"File extraction error for {filename}: {e}")
        return ""

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

def apply_api_polisher_if_available(text: str, user_query: str = "", enabled: bool = False, is_first_message: bool = True) -> str:
    """
    Dynamically loads and invokes api_polisher.py if it exists on disk.
    If the file is deleted or disabled, returns text immediately with zero downtime and zero errors.
    """
    if not enabled:
        return strip_repeated_intro(text) if not is_first_message else text
    polisher_file = os.path.join(BASE_DIR, "api_polisher.py")
    if not os.path.exists(polisher_file):
        return strip_repeated_intro(text) if not is_first_message else text
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location("api_polisher", polisher_file)
        if spec and spec.loader:
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
            if hasattr(mod, "polish_text"):
                res = mod.polish_text(text, user_query, is_first_message=is_first_message)
                return strip_repeated_intro(res) if not is_first_message else res
    except Exception:
        pass
    return strip_repeated_intro(text) if not is_first_message else text

app = FastAPI()

class AuthRequest(BaseModel):
    username: str
    password: str

class ChatRequest(BaseModel):
    message: str
    username: str = "guest"
    enhance: bool = False
    is_first_message: bool = True

@app.post("/api/signup")
def signup(req: AuthRequest):
    username = sanitize_username(req.username)
    if not username or len(username) < 2:
        return {"success": False, "error": "Username must be at least 2 characters (letters, numbers, hyphens, underscores)."}
    if not req.password or len(req.password) < 3:
        return {"success": False, "error": "Password must be at least 3 characters."}

    users = load_users()
    if username.lower() in {u.lower(): u for u in users}:
        return {"success": False, "error": "Username already exists. Please choose another username or sign in."}

    salt = secrets.token_hex(8)
    users[username] = {
        "password_hash": hash_password(req.password, salt),
        "salt": salt,
        "created_at": datetime.now().isoformat()
    }
    save_users(users)
    init_user_storage(username)
    return {"success": True, "username": username}

@app.post("/api/login")
def login(req: AuthRequest):
    username = sanitize_username(req.username)
    if not username:
        return {"success": False, "error": "Please enter a valid username."}

    users = load_users()
    matched_user = None
    for u in users:
        if u.lower() == username.lower():
            matched_user = u
            break

    if not matched_user:
        return {"success": False, "error": "User does not exist. Please sign up first."}

    user_info = users[matched_user]
    salt = user_info.get("salt", "")
    expected_hash = user_info.get("password_hash", "")
    if hash_password(req.password, salt) != expected_hash:
        return {"success": False, "error": "Incorrect password. Please try again."}

    # Recreate folder and file if they were deleted directly
    init_user_storage(matched_user)
    return {"success": True, "username": matched_user}

@app.get("/api/history")
def history(username: str):
    return {"history": get_user_history(username)}

@app.post("/api/chat")
def chat(req: ChatRequest):
    user = sanitize_username(req.username) or "guest"
    refusal_msg = REFUSAL_MESSAGE if req.is_first_message else REFUSAL_MESSAGE_SUBSEQUENT
    if is_explicitly_non_medical(req.message):
        log_conversation(req.message, refusal_msg)
        log_user_conversation(user, req.message, refusal_msg)
        return {"response": refusal_msg}

    prompt = build_prompt(req.message, is_first_message=req.is_first_message)
    output = llm.generate(prompt, sampling_params, lora_request=lora_request)
    response = sanitize_response(req.message, output[0].outputs[0].text.strip(), is_first_message=req.is_first_message)

    if req.enhance and response != refusal_msg and response != REFUSAL_MESSAGE:
        response = apply_api_polisher_if_available(response, req.message, enabled=True, is_first_message=req.is_first_message)

    log_conversation(req.message, response)
    log_user_conversation(user, req.message, response)
    return {"response": response}

def apply_file_polisher_if_available(file_bytes: bytes, filename: str, mime_type: str = "", user_query: str = "", is_first_message: bool = True) -> str:
    """
    Dynamically loads and invokes process_file_with_gemini from api_polisher.py if it exists on disk.
    If deleted or fails, returns empty string to trigger local fallback.
    """
    polisher_file = os.path.join(BASE_DIR, "api_polisher.py")
    if not os.path.exists(polisher_file):
        return ""
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location("api_polisher", polisher_file)
        if spec and spec.loader:
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
            if hasattr(mod, "process_file_with_gemini"):
                res = mod.process_file_with_gemini(file_bytes, filename, mime_type, user_query, is_first_message=is_first_message)
                return strip_repeated_intro(res) if not is_first_message else res
    except Exception:
        pass
    return ""

@app.post("/api/chat-with-file")
async def chat_with_file(
    message: str = Form(...),
    username: str = Form("guest"),
    file: UploadFile = File(None),
    enhance: str = Form("false"),
    is_first_message: str = Form("true")
):
    user = sanitize_username(username) or "guest"
    is_enhanced = str(enhance).strip().lower() in ("true", "1", "yes")
    is_first = str(is_first_message).strip().lower() in ("true", "1", "yes")
    refusal_msg = REFUSAL_MESSAGE if is_first else REFUSAL_MESSAGE_SUBSEQUENT

    if is_explicitly_non_medical(message):
        log_conversation(message, refusal_msg)
        log_user_conversation(user, message, refusal_msg)
        return {"response": refusal_msg}

    file_bytes = None
    if file:
        file_bytes = await file.read()

    # If enhanced mode is active and file was uploaded, try direct multimodal file analysis
    if file and file_bytes and is_enhanced:
        api_resp = apply_file_polisher_if_available(file_bytes, file.filename, file.content_type or "", message, is_first_message=is_first)
        if api_resp and len(api_resp.strip()) > 10:
            log_title = f"{message} [Uploaded file: {file.filename}]" if message else f"[Uploaded file: {file.filename}]"
            log_conversation(log_title, api_resp)
            log_user_conversation(user, log_title, api_resp)
            return {"response": api_resp}

    full_message = message
    if file and file_bytes:
        extracted_text = extract_text_from_file(file_bytes, file.filename)
        if extracted_text and is_explicitly_non_medical(extracted_text):
            log_conversation(message, refusal_msg)
            log_user_conversation(user, message, refusal_msg)
            return {"response": refusal_msg}

        if not extracted_text or extracted_text == "Could not extract text from image.":
            full_message += f"\n\n[Uploaded document/image: {file.filename}. Note: Text could not be automatically extracted from this file. Inform the user kindly and advise them to type out the relevant medical details or consult a doctor.]"
        else:
            full_message += f"\n\n[Extracted text from uploaded file ({file.filename})]:\n{extracted_text}"

    prompt = build_prompt(full_message, is_first_message=is_first)
    output = llm.generate(prompt, sampling_params, lora_request=lora_request)
    response = sanitize_response(full_message, output[0].outputs[0].text.strip(), is_first_message=is_first)

    if is_enhanced and response != refusal_msg and response != REFUSAL_MESSAGE:
        response = apply_api_polisher_if_available(response, full_message, enabled=True, is_first_message=is_first)

    log_conversation(full_message, response)
    log_user_conversation(user, full_message, response)
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
    print(" Remote URL: http://192.168.4.99:7860")
    print("=" * 60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=7860)
