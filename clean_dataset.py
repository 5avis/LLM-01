import json

def clean_text(text):
    replacements = ["Chat Doctor", "ChatDoctor", "Chat Doctor.", "chat doctor"]
    for r in replacements:
        text = text.replace(r, "MedHub")
    return text

# Clean HealthCareMagic (uses "output" key)
with open("HealthCareMagic-100k.json") as f:
    data1 = json.load(f)
for item in data1:
    item["output"] = clean_text(item["output"])
with open("HealthCareMagic-100k_cleaned.json", "w") as f:
    json.dump(data1, f, indent=2)
print("Cleaned HealthCareMagic-100k.json")

# Clean iCliniq (uses "answer_icliniq" key)
with open("iCliniq.json") as f:
    data2 = json.load(f)
for item in data2:
    if "answer_icliniq" in item:
        item["answer_icliniq"] = clean_text(item["answer_icliniq"])
    if "answer_chatgpt" in item:
        item["answer_chatgpt"] = clean_text(item["answer_chatgpt"])
with open("iCliniq_cleaned.json", "w") as f:
    json.dump(data2, f, indent=2)
print("Cleaned iCliniq.json")
