import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json
import io
import requests as req_lib
from datetime import datetime
from pypdf import PdfReader

from vllm import LLM, SamplingParams
from vllm.lora.request import LoRARequest
from gpu_utils import get_safe_gpu_utilization
from fda_lookup import find_drug_in_text

base_model = "Qwen/Qwen2.5-14B-Instruct"
lora_path = "../medical_assistant_model"

print("Loading model...")
safe_util = get_safe_gpu_utilization(gpu_id=0)
llm = LLM(
    model=base_model,
    dtype="bfloat16",
    gpu_memory_utilization=safe_util,
    enable_lora=True,
    max_lora_rank=8,
    max_model_len=8192
)
lora_request = LoRARequest("medical_assistant", 1, lora_path)
sampling_params = SamplingParams(max_tokens=300, temperature=0.3)
print("Model loaded!")

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
    os.makedirs("../logs", exist_ok=True)
    with open("../logs/app_logs.jsonl", "a") as f:
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

@app.get("/")
def serve_index():
    return FileResponse("static/index.html")

app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
