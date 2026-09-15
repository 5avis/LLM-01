from vllm import LLM, SamplingParams
from gpu_utils import get_safe_gpu_utilization
import json
from datetime import datetime

base_model = "Qwen/Qwen2.5-14B-Instruct"

print("Loading model with vLLM...")
safe_util = get_safe_gpu_utilization(gpu_id=0)
llm = LLM(model=base_model, dtype="bfloat16", gpu_memory_utilization=safe_util)
sampling_params = SamplingParams(max_tokens=200, temperature=0.7)

def log_conversation(user_input, response):
    with open("mh1_logs.jsonl", "a") as f:
        entry = {"timestamp": datetime.now().isoformat(), "patient": user_input, "doctor": response}
        f.write(json.dumps(entry) + "\n")

print("Model loaded! Type your questions (type 'exit' to quit).\n")

while True:
    user_input = input("Patient: ")
    if user_input.lower() in ["exit", "quit"]:
        break

    messages = [{"role": "user", "content": user_input}]
    output = llm.chat(messages, sampling_params)
    response = output[0].outputs[0].text
    print(f"MedHub: {response}\n")

    log_conversation(user_input, response)
