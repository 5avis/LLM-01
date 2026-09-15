import json
from datasets import Dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model
import torch

MODEL_NAME = "Qwen/Qwen2.5-14B-Instruct"

# 1. Load cleaned datasets
print("Loading datasets...")
with open("HealthCareMagic-100k_cleaned.json") as f:
    data1 = json.load(f)
with open("iCliniq_cleaned.json") as f:
    data2 = json.load(f)

normalized_data2 = []
for item in data2:
    normalized_data2.append({
        "instruction": "If you are a doctor, please answer the medical questions based on the patient's description.",
        "input": item["input"],
        "output": item.get("answer_icliniq", item.get("answer_chatgpt", ""))
    })

all_data = data1 + normalized_data2
print(f"Total examples: {len(all_data)}")

# 2. Format into text
def format_example(example):
    text = f"### Instruction:\n{example['instruction']}\n\n### Patient:\n{example['input']}\n\n### Doctor:\n{example['output']}"
    return {"text": text}

formatted = [format_example(ex) for ex in all_data]
dataset = Dataset.from_list(formatted)

# 3. Load tokenizer and model
print("Loading model...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.bfloat16,
    device_map={"": 0}
)

# 4. Tokenize dataset
def tokenize_function(examples):
    tokens = tokenizer(examples["text"], truncation=True, max_length=512, padding="max_length")
    tokens["labels"] = tokens["input_ids"].copy()
    return tokens

tokenized_dataset = dataset.map(tokenize_function, remove_columns=["text"])

# 5. Apply LoRA
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# 6. Training settings (saves checkpoint every 2000 steps, not just per epoch)
training_args = TrainingArguments(
    output_dir="./medical_assistant_checkpoints",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    learning_rate=2e-4,
    logging_steps=10,
    save_strategy="steps",
    save_steps=2000,
    bf16=True,
    report_to="none"
)

# 7. Train fresh (no resume)
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
)

print("Starting training...")
trainer.train()

# 8. Save final model
model.save_pretrained("./medical_assistant_model")
tokenizer.save_pretrained("./medical_assistant_model")
print("Done! Model saved to ./medical_assistant_model")
