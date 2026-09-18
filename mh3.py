from gpu_utils import get_safe_gpu_utilization
from vllm import LLM, SamplingParams
from vllm.lora.request import LoRARequest
from fda_lookup import find_drug_in_text
import json
from datetime import datetime

base_model = "Qwen/Qwen2.5-14B-Instruct"
lora_path = "./medical_assistant_model"

print("Loading model with vLLM (LoRA enabled)...")
safe_util = get_safe_gpu_utilization(gpu_id=0)

llm = LLM(
    model=base_model,
    dtype="bfloat16",
    gpu_memory_utilization=safe_util,
    enable_lora=True,
    max_lora_rank=8,
    max_model_len=4096
)


lora_request = LoRARequest("medical_assistant", 1, lora_path)
sampling_params = SamplingParams(max_tokens=300, temperature=0.3)

EMOTIONAL_KEYWORDS = [
    "terminal", "dying", "died", "death", "grief", "loss", "diagnosed with cancer",
    "given months to live", "given weeks to live", "how do i cope", "process this",
    "losing my", "passed away", "hospice", "end of life", "how do i tell",
    "devastated", "heartbroken", "don't know what to do", "scared he will die",
    "scared she will die", "palliative", "final stage", "stage 4"
]

EMERGENCY_KEYWORDS = [
    "chest pain", "chest tightness", "radiating to my arm", "radiating to left arm",
    "can't breathe", "difficulty breathing", "shortness of breath", "swallowed",
    "poison", "overdose", "unconscious", "unresponsive", "seizure", "stroke",
    "sudden weakness", "confused", "confusion", "slurred speech", "severe bleeding",
    "suicidal", "ending my life", "kill myself", "self harm", "want to die"
]

BASE_SAFETY_INSTRUCTION = (
    "You are MedHub, a general medical assistant. You are not a specialist and must "
    "never claim to be one. "
    "CRITICAL RULE: You must NEVER state any numeric dosage value from your own knowledge. "
    "Only state a dosage if verified FDA information is explicitly provided below, AND that "
    "information directly covers the patient's specific case (e.g., their age group). "
    "If the FDA information does NOT cover their specific case (for example, it says "
    "'ask a doctor' for their age group, or doesn't mention their situation), you MUST say "
    "so clearly and tell them to consult a doctor — do NOT invent, estimate, or calculate "
    "a dosage yourself under any circumstances."
)

def is_emotionally_sensitive(text):
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in EMOTIONAL_KEYWORDS)

def is_emergency(text):
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in EMERGENCY_KEYWORDS)

def build_prompt(user_input):
    instruction = BASE_SAFETY_INSTRUCTION
    fda_context = ""

    drug_name, drug_info = find_drug_in_text(user_input)
    if drug_info:
        fda_context = (
            f"\n\nVerified FDA information about {drug_name}:\n"
            f"Dosage: {drug_info['dosage'][:800]}\n"
            f"Warnings: {drug_info['warnings'][:500]}\n"
            f"Usage: {drug_info['usage'][:500]}\n"
        )
        instruction += (
            " Verified FDA information is provided below. Carefully check if it actually "
            "answers the patient's specific question before using it. Simplify the language "
            "naturally — do not copy the FDA text directly."
        )

    if is_emergency(user_input):
        instruction += (
            " This message describes a potential medical emergency. You MUST clearly "
            "and explicitly tell the patient to call emergency services or go to the "
            "nearest emergency room immediately, before giving any other advice."
        )

    if is_emotionally_sensitive(user_input):
        instruction += (
            " The person is dealing with a difficult, emotionally heavy situation "
            "involving serious illness, loss, or grief. Begin your response by genuinely "
            "acknowledging their feelings with warmth and empathy — do not say 'don't worry' "
            "or minimize their concern. Then gently offer helpful, practical guidance. "
            "Keep your tone caring and human throughout, not purely clinical."
        )

    if not is_emotionally_sensitive(user_input) and not is_emergency(user_input) and not drug_info:
        instruction += (
            " Answer the medical question based on the patient's description in a warm, "
            "clear, doctor-like manner."
        )

    return f"### Instruction:\n{instruction}{fda_context}\n\n### Patient:\n{user_input}\n\n### Doctor:\n"

def log_conversation(user_input, response):
    with open("mh3_logs.jsonl", "a") as f:
        entry = {"timestamp": datetime.now().isoformat(), "patient": user_input, "doctor": response}
        f.write(json.dumps(entry) + "\n")

print("Model loaded! Type your questions (type 'exit' to quit).\n")

while True:
    user_input = input("Patient: ")
    if user_input.lower() in ["exit", "quit"]:
        break

    prompt = build_prompt(user_input)

    output = llm.generate(prompt, sampling_params, lora_request=lora_request)
    response = output[0].outputs[0].text
    print(f"MedHub: {response}\n")

    log_conversation(user_input, response)
