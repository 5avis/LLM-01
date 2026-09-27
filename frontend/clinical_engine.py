"""
MedHub Clinical Engine
Provides:
1. Drug-Drug Interaction (DDI) Safety Radar Analysis
2. Clinical Emergency Triage Urgency Classification (ESI Protocol)
3. Structured S.O.A.P. / S.B.A.R. Clinical Note Synthesis
4. Professional Hospital-Grade SOAP PDF Generation via ReportLab
"""

import re
import os
from datetime import datetime
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


# ---------------------------------------------------------------------------
# 1. DRUG DICTIONARY & ALIASES
# ---------------------------------------------------------------------------

KNOWN_DRUGS = {
    # NSAIDs & Analgesics
    "aspirin": {"generic": "Aspirin", "class": "NSAID / Antiplatelet"},
    "ibuprofen": {"generic": "Ibuprofen", "class": "NSAID"},
    "advil": {"generic": "Ibuprofen", "class": "NSAID"},
    "motrin": {"generic": "Ibuprofen", "class": "NSAID"},
    "naproxen": {"generic": "Naproxen", "class": "NSAID"},
    "aleve": {"generic": "Naproxen", "class": "NSAID"},
    "paracetamol": {"generic": "Acetaminophen", "class": "Analgesic / Antipyretic"},
    "acetaminophen": {"generic": "Acetaminophen", "class": "Analgesic / Antipyretic"},
    "tylenol": {"generic": "Acetaminophen", "class": "Analgesic / Antipyretic"},
    "diclofenac": {"generic": "Diclofenac", "class": "NSAID"},
    "voltaren": {"generic": "Diclofenac", "class": "NSAID"},
    "celecoxib": {"generic": "Celecoxib", "class": "COX-2 Inhibitor"},
    "celebrex": {"generic": "Celecoxib", "class": "COX-2 Inhibitor"},
    "tramadol": {"generic": "Tramadol", "class": "Opioid Analgesic"},
    "ultram": {"generic": "Tramadol", "class": "Opioid Analgesic"},
    "morphine": {"generic": "Morphine", "class": "Opioid Analgesic"},
    "oxycodone": {"generic": "Oxycodone", "class": "Opioid Analgesic"},

    # Anticoagulants & Antiplatelets
    "warfarin": {"generic": "Warfarin", "class": "Anticoagulant (Vitamin K Antagonist)"},
    "coumadin": {"generic": "Warfarin", "class": "Anticoagulant"},
    "clopidogrel": {"generic": "Clopidogrel", "class": "Antiplatelet"},
    "plavix": {"generic": "Clopidogrel", "class": "Antiplatelet"},
    "apixaban": {"generic": "Apixaban", "class": "DOAC Anticoagulant"},
    "eliquis": {"generic": "Apixaban", "class": "DOAC Anticoagulant"},
    "rivaroxaban": {"generic": "Rivaroxaban", "class": "DOAC Anticoagulant"},
    "xarelto": {"generic": "Rivaroxaban", "class": "DOAC Anticoagulant"},
    "heparin": {"generic": "Heparin", "class": "Anticoagulant"},

    # Cardiovascular & Antihypertensives
    "lisinopril": {"generic": "Lisinopril", "class": "ACE Inhibitor"},
    "prinivil": {"generic": "Lisinopril", "class": "ACE Inhibitor"},
    "enalapril": {"generic": "Enalapril", "class": "ACE Inhibitor"},
    "losartan": {"generic": "Losartan", "class": "ARB Antihypertensive"},
    "cozaar": {"generic": "Losartan", "class": "ARB Antihypertensive"},
    "valsartan": {"generic": "Valsartan", "class": "ARB Antihypertensive"},
    "amlodipine": {"generic": "Amlodipine", "class": "Calcium Channel Blocker"},
    "norvasc": {"generic": "Amlodipine", "class": "Calcium Channel Blocker"},
    "metoprolol": {"generic": "Metoprolol", "class": "Beta Blocker"},
    "lopressor": {"generic": "Metoprolol", "class": "Beta Blocker"},
    "toprol": {"generic": "Metoprolol", "class": "Beta Blocker"},
    "atenolol": {"generic": "Atenolol", "class": "Beta Blocker"},
    "spironolactone": {"generic": "Spironolactone", "class": "Potassium-Sparing Diuretic"},
    "aldactone": {"generic": "Spironolactone", "class": "Potassium-Sparing Diuretic"},
    "furosemide": {"generic": "Furosemide", "class": "Loop Diuretic"},
    "lasix": {"generic": "Furosemide", "class": "Loop Diuretic"},
    "digoxin": {"generic": "Digoxin", "class": "Cardiac Glycoside"},
    "nitroglycerin": {"generic": "Nitroglycerin", "class": "Nitrate Vasodilator"},
    "nitro": {"generic": "Nitroglycerin", "class": "Nitrate Vasodilator"},

    # Antidiabetic
    "metformin": {"generic": "Metformin", "class": "Biguanide Antidiabetic"},
    "glucophage": {"generic": "Metformin", "class": "Biguanide Antidiabetic"},
    "glipizide": {"generic": "Glipizide", "class": "Sulfonylurea"},
    "insulin": {"generic": "Insulin", "class": "Hormone / Antidiabetic"},
    "semaglutide": {"generic": "Semaglutide", "class": "GLP-1 Receptor Agonist"},
    "ozempic": {"generic": "Semaglutide", "class": "GLP-1 Receptor Agonist"},
    "wegovy": {"generic": "Semaglutide", "class": "GLP-1 Receptor Agonist"},
    "jardiance": {"generic": "Empagliflozin", "class": "SGLT2 Inhibitor"},
    "empagliflozin": {"generic": "Empagliflozin", "class": "SGLT2 Inhibitor"},

    # Antibiotics & Antifungals
    "amoxicillin": {"generic": "Amoxicillin", "class": "Penicillin Antibiotic"},
    "augmentin": {"generic": "Amoxicillin-Clavulanate", "class": "Antibiotic Combination"},
    "azithromycin": {"generic": "Azithromycin", "class": "Macrolide Antibiotic"},
    "zithromax": {"generic": "Azithromycin", "class": "Macrolide Antibiotic"},
    "ciprofloxacin": {"generic": "Ciprofloxacin", "class": "Fluoroquinolone Antibiotic"},
    "cipro": {"generic": "Ciprofloxacin", "class": "Fluoroquinolone Antibiotic"},
    "levofloxacin": {"generic": "Levofloxacin", "class": "Fluoroquinolone Antibiotic"},
    "levaquin": {"generic": "Levofloxacin", "class": "Fluoroquinolone Antibiotic"},
    "doxycycline": {"generic": "Doxycycline", "class": "Tetracycline Antibiotic"},
    "cephalexin": {"generic": "Cephalexin", "class": "Cephalosporin Antibiotic"},
    "keflex": {"generic": "Cephalexin", "class": "Cephalosporin Antibiotic"},
    "ketoconazole": {"generic": "Ketoconazole", "class": "Antifungal (CYP3A4 Inhibitor)"},
    "fluconazole": {"generic": "Fluconazole", "class": "Antifungal"},
    "diflucan": {"generic": "Fluconazole", "class": "Antifungal"},

    # Antidepressants & Psychotropics
    "sertraline": {"generic": "Sertraline", "class": "SSRI Antidepressant"},
    "zoloft": {"generic": "Sertraline", "class": "SSRI Antidepressant"},
    "fluoxetine": {"generic": "Fluoxetine", "class": "SSRI Antidepressant"},
    "prozac": {"generic": "Fluoxetine", "class": "SSRI Antidepressant"},
    "escitalopram": {"generic": "Escitalopram", "class": "SSRI Antidepressant"},
    "lexapro": {"generic": "Escitalopram", "class": "SSRI Antidepressant"},
    "duloxetine": {"generic": "Duloxetine", "class": "SNRI Antidepressant"},
    "cymbalta": {"generic": "Duloxetine", "class": "SNRI Antidepressant"},
    "alprazolam": {"generic": "Alprazolam", "class": "Benzodiazepine"},
    "xanax": {"generic": "Alprazolam", "class": "Benzodiazepine"},
    "lorazepam": {"generic": "Lorazepam", "class": "Benzodiazepine"},
    "ativan": {"generic": "Lorazepam", "class": "Benzodiazepine"},

    # Statins & Cholesterol
    "atorvastatin": {"generic": "Atorvastatin", "class": "HMG-CoA Reductase Inhibitor"},
    "lipitor": {"generic": "Atorvastatin", "class": "HMG-CoA Reductase Inhibitor"},
    "simvastatin": {"generic": "Simvastatin", "class": "HMG-CoA Reductase Inhibitor"},
    "zocor": {"generic": "Simvastatin", "class": "HMG-CoA Reductase Inhibitor"},
    "rosuvastatin": {"generic": "Rosuvastatin", "class": "HMG-CoA Reductase Inhibitor"},
    "crestor": {"generic": "Rosuvastatin", "class": "HMG-CoA Reductase Inhibitor"},

    # Antacids / PPIs
    "omeprazole": {"generic": "Omeprazole", "class": "Proton Pump Inhibitor"},
    "prilosec": {"generic": "Omeprazole", "class": "Proton Pump Inhibitor"},
    "pantoprazole": {"generic": "Pantoprazole", "class": "Proton Pump Inhibitor"},
    "protonix": {"generic": "Pantoprazole", "class": "Proton Pump Inhibitor"},

    # Other common interactions
    "sildenafil": {"generic": "Sildenafil", "class": "PDE5 Inhibitor"},
    "viagra": {"generic": "Sildenafil", "class": "PDE5 Inhibitor"},
    "tadalafil": {"generic": "Tadalafil", "class": "PDE5 Inhibitor"},
    "cialis": {"generic": "Tadalafil", "class": "PDE5 Inhibitor"},
    "alcohol": {"generic": "Alcohol / Ethanol", "class": "CNS Depressant / Toxin"},
    "potassium": {"generic": "Potassium Supplement", "class": "Electrolyte Supplement"},
}

# ---------------------------------------------------------------------------
# 2. DRUG INTERACTION RULES MATRIX
# ---------------------------------------------------------------------------

DDI_RULES = [
    {
        "pair": {"Aspirin", "Ibuprofen"},
        "severity": "danger",
        "title": "Severe GI Bleed & Loss of Cardioprotection",
        "description": "Dual NSAID use causes synergistic gastric mucosal toxicity and significantly multiplies gastrointestinal bleeding risks. Ibuprofen may also competitively inhibit aspirin's antiplatelet cardioprotective action.",
        "action": "Avoid concurrent use. Consult doctor for gastroprotective PPI or single-agent therapy."
    },
    {
        "pair": {"Aspirin", "Naproxen"},
        "severity": "danger",
        "title": "Severe Gastrointestinal Ulceration & Hemorrhage Risk",
        "description": "Combining multiple NSAIDs exacerbates gastrointestinal erosion and renal perfusion impairment without additive analgesic efficacy.",
        "action": "Avoid concurrent administration. Discontinue one agent under medical supervision."
    },
    {
        "pair": {"Warfarin", "Aspirin"},
        "severity": "danger",
        "title": "Critical Major Hemorrhage Alert",
        "description": "Combining vitamin K antagonists with platelet aggregation inhibitors drastically elevates systemic bleeding, GI hemorrhage, and intracranial hematoma risk.",
        "action": "Requires strict hematology / cardiology supervision and intensive INR monitoring."
    },
    {
        "pair": {"Warfarin", "Ibuprofen"},
        "severity": "danger",
        "title": "Severe Hemorrhagic Risk & Gastric Bleeding",
        "description": "NSAIDs damage GI mucosa and displace warfarin from plasma proteins, sharply increasing free anticoagulant levels and bleeding hazards.",
        "action": "Contraindicated. Acetaminophen preferred for mild pain if approved by prescribing doctor."
    },
    {
        "pair": {"Warfarin", "Naproxen"},
        "severity": "danger",
        "title": "Severe Hemorrhagic Risk & Gastric Bleeding",
        "description": "Profound synergistic bleeding danger due to anticoagulation combined with platelet inhibition and mucosal irritation.",
        "action": "Avoid combination. Seek immediate physician guidance."
    },
    {
        "pair": {"Metformin", "Alcohol / Ethanol"},
        "severity": "danger",
        "title": "Severe Lactic Acidosis Warning",
        "description": "Ethanol impairs hepatic gluconeogenesis and exacerbates metformin's inhibition of mitochondrial respiration, precipitating life-threatening lactic acidosis.",
        "action": "Strictly refrain from consuming alcoholic beverages during metformin therapy."
    },
    {
        "pair": {"Acetaminophen", "Alcohol / Ethanol"},
        "severity": "danger",
        "title": "Acute Hepatic Necrosis & Liver Injury",
        "description": "Chronic or binge alcohol intake induces CYP2E1 enzymes, accelerating conversion of acetaminophen to hepatotoxic NAPQI while depleting protective glutathione.",
        "action": "Do not exceed 2,000 mg/day of acetaminophen and completely avoid alcohol co-ingestion."
    },
    {
        "pair": {"Sildenafil", "Nitroglycerin"},
        "severity": "danger",
        "title": "Fatal Hypotension & Cardiovascular Collapse",
        "description": "PDE5 inhibitors markedly potentiate nitric oxide-mediated cGMP smooth muscle relaxation, precipitating catastrophic, refractory blood pressure crashes.",
        "action": "Strictly contraindicated. Never co-administer nitrates with PDE5 inhibitors within 24-48 hours."
    },
    {
        "pair": {"Tadalafil", "Nitroglycerin"},
        "severity": "danger",
        "title": "Fatal Hypotension & Cardiovascular Collapse",
        "description": "Profound systemic arterial vasodilation producing life-threatening syncope, myocardial infarction, or stroke.",
        "action": "Absolute clinical contraindication. Allow at least 48 hours clearance."
    },
    {
        "pair": {"Sertraline", "Tramadol"},
        "severity": "danger",
        "title": "Life-Threatening Serotonin Syndrome",
        "description": "Concurrent serotonergic agents induce toxic hyperstimulation of central and peripheral 5-HT receptors, risking hyperthermia, clonus, delirium, and seizures.",
        "action": "Avoid combination. Seek immediate emergency evaluation if tremors, fever, or agitation arise."
    },
    {
        "pair": {"Fluoxetine", "Tramadol"},
        "severity": "danger",
        "title": "Life-Threatening Serotonin Syndrome",
        "description": "Elevated central serotonin levels combined with CYP2D6 inhibition causes toxic drug accumulation and hyperthermic crisis.",
        "action": "Avoid combination. Seek medical alternative for pain management."
    },
    {
        "pair": {"Lisinopril", "Spironolactone"},
        "severity": "warning",
        "title": "Potentially Severe Hyperkalemia",
        "description": "Both agents decrease renal potassium excretion through renin-angiotensin-aldosterone axis inhibition, which can trigger cardiac dysrhythmias.",
        "action": "Monitor serum potassium (K+) and creatinine periodically under physician oversight."
    },
    {
        "pair": {"Lisinopril", "Potassium Supplement"},
        "severity": "warning",
        "title": "Elevated Serum Potassium (Hyperkalemia) Risk",
        "description": "ACE inhibitors reduce aldosterone production, leading to retention of exogenous potassium supplements.",
        "action": "Avoid unmonitored potassium supplementation while on ACE inhibitor therapy."
    },
    {
        "pair": {"Atorvastatin", "Ketoconazole"},
        "severity": "warning",
        "title": "Rhabdomyolysis & Statin Toxicity Risk",
        "description": "Potent CYP3A4 inhibition prevents statin clearance, escalating plasma concentrations and skeletal muscle myopathy/rhabdomyolysis risk.",
        "action": "Temporarily suspend statin or adjust dosage under physician guidance."
    },
    {
        "pair": {"Simvastatin", "Ketoconazole"},
        "severity": "danger",
        "title": "Critical Rhabdomyolysis & Acute Renal Injury",
        "description": "Major CYP3A4 drug accumulation leading to severe skeletal muscle breakdown and myoglobinuric renal failure.",
        "action": "Contraindicated. Discontinue simvastatin during azole antifungal course."
    },
    {
        "pair": {"Ciprofloxacin", "Calcium Supplement"},
        "severity": "warning",
        "title": "Chelation & Impaired Antibiotic Absorption",
        "description": "Polyvalent cations form insoluble chelate complexes with fluoroquinolones, cutting drug bioavailability and therapeutic efficacy.",
        "action": "Space oral doses by at least 2 hours before or 4 hours after calcium ingestion."
    }
]

# ---------------------------------------------------------------------------
# 3. EXTRACTION AND INTERACTION ANALYSIS
# ---------------------------------------------------------------------------

def extract_all_drugs(text: str) -> list:
    """Extracts all unique medications identified in text and maps to generic names."""
    if not text:
        return []
    text_lower = text.lower()
    found_drugs = {}

    # Check for direct word boundaries of known drugs
    for term, data in KNOWN_DRUGS.items():
        pattern = r'\b' + re.escape(term) + r'\b'
        if re.search(pattern, text_lower):
            gen = data["generic"]
            if gen not in found_drugs:
                found_drugs[gen] = data

    return list(found_drugs.values())

def check_drug_interactions(drugs_list: list) -> dict:
    """
    Evaluates drug interaction safety across all extracted drugs.
    Returns structured DDI status: { status, level, interactions, active_drugs }
    """
    if not drugs_list or len(drugs_list) == 0:
        return {
            "status": "clear",
            "level": "safe",
            "badge": "No Active Medications Detected",
            "title": "DDI Radar Clear",
            "description": "No active pharmaceutical conflicts identified in current consultation context.",
            "interactions": [],
            "active_drugs": []
        }

    generic_names = {d["generic"] for d in drugs_list}
    matched_interactions = []
    has_danger = False
    has_warning = False

    for rule in DDI_RULES:
        if rule["pair"].issubset(generic_names):
            matched_interactions.append({
                "drugs": list(rule["pair"]),
                "severity": rule["severity"],
                "title": rule["title"],
                "description": rule["description"],
                "action": rule["action"]
            })
            if rule["severity"] == "danger":
                has_danger = True
            elif rule["severity"] == "warning":
                has_warning = True

    if has_danger:
        overall_level = "danger"
        badge = "High Danger Alert"
        title = "Severe Pharmacological Conflict Detected"
        desc = "Critical drug-drug interaction flagged. Immediate clinical review is required before co-administration."
    elif has_warning:
        overall_level = "warning"
        badge = "Moderate Caution"
        title = "Interaction Precaution Advised"
        desc = "Potential cross-reactivity or altered bioavailability identified. Monitor patient symptoms or dosage spacing."
    elif len(drugs_list) >= 2:
        overall_level = "safe"
        badge = "Verified Safe"
        title = "No Major Negative Interactions Found"
        desc = f"Active agents ({', '.join(generic_names)}) evaluated against the clinical conflict matrix with no critical contradictions."
    else:
        overall_level = "safe"
        badge = "Monitored"
        title = "Single Agent Under Evaluation"
        desc = f"Evaluating {list(generic_names)[0]}. Add concurrent medications to perform multi-drug cross-reactivity screening."

    return {
        "status": overall_level,
        "level": overall_level,
        "badge": badge,
        "title": title,
        "description": desc,
        "interactions": matched_interactions,
        "active_drugs": [d["generic"] for d in drugs_list]
    }

# ---------------------------------------------------------------------------
# 4. EMERGENCY TRIAGE CLASSIFICATION (ESI PROTOCOL)
# ---------------------------------------------------------------------------

EMERGENCY_SIGNS = [
    "chest pain", "chest tightness", "chest pressure", "heart attack",
    "shortness of breath", "can't breathe", "difficulty breathing", "suffocating",
    "stroke", "facial droop", "slurred speech", "numbness on one side", "paralysis",
    "unconscious", "passed out", "blacked out", "seizure", "convulsions",
    "poison", "overdose", "swallowed pills", "toxic ingestion",
    "suicide", "suicidal", "kill myself", "end my life", "severe bleeding",
    "hemorrhage", "anaphylaxis", "throat closing", "swollen tongue", "cyanosis", "blue lips"
]

URGENT_SIGNS = [
    "high fever", "fever over 102", "fever above 39", "severe vomiting",
    "dehydration", "deep cut", "stitches", "broken bone", "fracture",
    "severe abdominal pain", "stomach cramps", "blood in urine", "blood in stool",
    "migraine with aura", "asthma attack", "wheezing", "severe burn",
    "ear infection", "kidney pain", "flank pain", "stiff neck with fever"
]

def evaluate_triage(user_query: str, ai_response: str = "") -> dict:
    """
    Evaluates clinical urgency according to the Emergency Severity Index (ESI) framework.
    Returns: { score, level, esi_label, color, title, recommendation, urgent_keywords }
    """
    combined_text = (user_query + " " + ai_response).lower()

    found_emergency = [k for k in EMERGENCY_SIGNS if k in combined_text]
    if found_emergency:
        return {
            "score": 1,
            "level": "emergency",
            "esi_label": "ESI Level 1 • Immediate Resuscitation / ER Alert",
            "badge": "CRITICAL EMERGENCY",
            "color": "#ef4444",
            "title": "Immediate Emergency Medical Attention Required",
            "recommendation": "Call 911 (or local emergency services) immediately. Do not attempt to drive yourself to the emergency department.",
            "triggers": found_emergency[:3]
        }

    found_urgent = [k for k in URGENT_SIGNS if k in combined_text]
    if found_urgent:
        return {
            "score": 2,
            "level": "urgent",
            "esi_label": "ESI Level 2-3 • Urgent Care (Within 24-48 Hours)",
            "badge": "URGENT CLINIC VISIT",
            "color": "#f59e0b",
            "title": "Prompt Clinical Evaluation Recommended",
            "recommendation": "Schedule an urgent outpatient clinic appointment or visit a walk-in urgent care center within 24 to 48 hours.",
            "triggers": found_urgent[:3]
        }

    return {
        "score": 3,
        "level": "routine",
        "esi_label": "ESI Level 4-5 • Non-Urgent / Routine Home Care",
        "badge": "ROUTINE CARE",
        "color": "#10b981",
        "title": "Standard Supportive Home Care & Monitoring",
        "recommendation": "Maintain adequate rest, hydration, and monitor symptoms. Consult your healthcare provider if symptoms persist beyond 5-7 days.",
        "triggers": []
    }

# ---------------------------------------------------------------------------
# 5. MULTILINGUAL DICTIONARY & FONT REGISTRATION (EN, TA, ML, TE, KN, HI)
# ---------------------------------------------------------------------------

FONTS_DIR = os.path.join(os.path.dirname(__file__), "fonts")
FREE_SERIF_PATH = os.path.join(FONTS_DIR, "FreeSerif.ttf")
FREE_SERIF_BOLD_PATH = os.path.join(FONTS_DIR, "FreeSerifBold.ttf")
LOHIT_TELUGU_PATH = os.path.join(FONTS_DIR, "Lohit-Telugu.ttf")

_FONTS_REGISTERED = False

def register_clinical_fonts():
    global _FONTS_REGISTERED
    if _FONTS_REGISTERED:
        return
    try:
        if os.path.exists(FREE_SERIF_PATH):
            pdfmetrics.registerFont(TTFont('FreeSerif', FREE_SERIF_PATH))
        if os.path.exists(FREE_SERIF_BOLD_PATH):
            pdfmetrics.registerFont(TTFont('FreeSerifBold', FREE_SERIF_BOLD_PATH))
        if os.path.exists(LOHIT_TELUGU_PATH):
            pdfmetrics.registerFont(TTFont('LohitTelugu', LOHIT_TELUGU_PATH))
        _FONTS_REGISTERED = True
    except Exception as e:
        print(f"Warning registering clinical TrueType fonts: {e}")

def get_font_family_for_lang(lang: str):
    register_clinical_fonts()
    lang = (lang or "en").lower().strip()
    if lang == "te":
        return "LohitTelugu", "LohitTelugu"
    elif lang in ("ta", "ml", "kn", "hi"):
        return "FreeSerif", "FreeSerifBold"
    else:
        return "Helvetica", "Helvetica-Bold"

SOAP_TRANSLATIONS = {
    "en": {
        "lang_name": "English",
        "doc_title": "MEDHUB CLINICAL INTELLIGENCE SYSTEM",
        "doc_subtitle": "S.O.A.P. Consultation Summary & S.B.A.R. Clinical Transfer Note",
        "badge_hipaa": "HIPAA Privacy Protected • Air-Gapped Local Inference Engine (NVIDIA B200 178GB)",
        "patient_name_label": "Patient Name:",
        "consult_date_label": "Consultation Date:",
        "triage_urgency_label": "Triage Urgency:",
        "ddi_radar_label": "DDI Safety Radar:",
        "facility_label": "Facility / Node:",
        "facility_value": "On-Premise Clinical AI Vault",
        "grounding_label": "Grounding Source:",
        "grounding_value": "US FDA Label Database",
        "sec_s_title": "S — SUBJECTIVE (Patient Reported Complaint & History)",
        "sec_o_title": "O — OBJECTIVE (Clinical Observations & Triage Classification)",
        "sec_a_title": "A — ASSESSMENT (Diagnostic Impression & Drug Interaction Safety)",
        "sec_p_title": "P — PLAN (Action Steps, Triage Guidance & Follow-up)",
        "lbl_chief_complaint": "Chief Complaint & Patient Report:",
        "lbl_symptoms": "Flagged Symptom Indicators:",
        "lbl_triage_proto": "Triage Protocol:",
        "lbl_active_meds": "Active Medications Identified:",
        "lbl_no_meds": "None detected",
        "lbl_fda_ref": "Verified FDA Reference:",
        "lbl_fda_local": "Cross-referenced with local clinical knowledge matrix",
        "lbl_clinical_urgency": "Clinical Urgency:",
        "lbl_ddi_status": "Pharmacological DDI Status:",
        "lbl_conflict": "Conflict Note:",
        "lbl_primary_rec": "Primary Recommendation:",
        "lbl_ai_guidance": "Clinical AI Guidance:",
        "lbl_safety_precaution": "Safety Precaution: Ensure review by licensed physician or pharmacist before changing pharmacotherapy.",
        "ddi_table_title": "IDENTIFIED PHARMACOLOGICAL INTERACTIONS:",
        "col_pair": "Medication Pair",
        "col_severity": "Severity",
        "col_mechanism": "Clinical Mechanism & Management",
        "col_action": "Action:",
        "sign_ai": "AI Attending System: MedHub Clinical 14B LoRA (Verified)",
        "sign_physician": "Attending Physician Review: ___________________________",
        "sign_hash": "Electronic Signature Hash:",
        "sign_license": "Medical License / NPI: ___________________________",
        "disclaimer": "CONFIDENTIAL MEDICAL RECORD: This document was synthesized by the MedHub Clinical Intelligence System for clinical decision support. It does not replace professional medical judgment. In emergencies, call 911 or visit the nearest emergency department."
    },
    "ta": {
        "lang_name": "Tamil (தமிழ்)",
        "doc_title": "மெட்ஹப் மருத்துவ நுண்ணறிவு தளம்",
        "doc_subtitle": "S.O.A.P. மருத்துவ கலந்தாய்வு சுருக்கம் & மருத்துவ பரிமாற்ற அறிக்கை",
        "badge_hipaa": "HIPAA தனியுரிமை பாதுகாக்கப்பட்டது • உள்ளூர் முனையம் (NVIDIA B200 178GB)",
        "patient_name_label": "நோயாளி பெயர்:",
        "consult_date_label": "பரிசோதனை தேதி:",
        "triage_urgency_label": "முதலுதவி முன்னுரிமை:",
        "ddi_radar_label": "மருந்து இடைவினை ரேடார் (DDI):",
        "facility_label": "மருத்துவ பிரிவு:",
        "facility_value": "உள்ளூர் மருத்துவ பாதுகாப்பு பெட்டகம்",
        "grounding_label": "மருந்து தகவல் ஆதாரம்:",
        "grounding_value": "FDA மருந்து தரவுத்தளம் & நெறிமுறைகள்",
        "sec_s_title": "S — அகநிலை (நோயாளி தெரிவித்த அறிகுறிகள் மற்றும் வரலாறு)",
        "sec_o_title": "O — புறநிலை (மருத்துவ அவதானிப்புகள் மற்றும் முன்னுரிமை மதிப்பீடு)",
        "sec_a_title": "A — மதிப்பீடு (நோயறிதல் கணிப்பு மற்றும் மருந்து பாதுகாப்பு ஆய்வு)",
        "sec_p_title": "P — திட்டம் (செயல் திட்டங்கள், முதலுதவி வழிகாட்டுதல் மற்றும் மருத்துவ ஆலோசனை)",
        "lbl_chief_complaint": "முக்கிய புகார் & நோயாளியின் விவரம்:",
        "lbl_symptoms": "கண்டறியப்பட்ட தீவிர அறிகுறிகள்:",
        "lbl_triage_proto": "முதலுதவி முன்னுரிமை நெறிமுறை:",
        "lbl_active_meds": "பயன்பாட்டில் உள்ள மருந்துகள்:",
        "lbl_no_meds": "குறிப்பிட்ட மருந்துகள் ஏதும் கண்டறியப்படவில்லை",
        "lbl_fda_ref": "சரிபார்க்கப்பட்ட FDA தரவு:",
        "lbl_fda_local": "உள்ளூர் மருத்துவ நெறிமுறைகளுடன் சரிபார்க்கப்பட்டது",
        "lbl_clinical_urgency": "மருத்துவ அவசரம்:",
        "lbl_ddi_status": "மருந்து இடைவினை பாதுகாப்பு நிலை:",
        "lbl_conflict": "மருந்து முரண்பாடு:",
        "lbl_primary_rec": "முக்கிய பரிந்துரை:",
        "lbl_ai_guidance": "மருத்துவ AI வழிகாட்டல்:",
        "lbl_safety_precaution": "பாதுகாப்பு எச்சரிக்கை: மருந்துகளில் மாற்றங்களைச் செய்வதற்கு முன் உரிமம் பெற்ற மருத்துவரை அணுகவும்.",
        "ddi_table_title": "கண்டறியப்பட்ட மருந்து இடைவினைகள் மற்றும் முரண்பாடுகள்:",
        "col_pair": "மருந்து இணைகள்",
        "col_severity": "தீவிரத்தன்மை",
        "col_mechanism": "மருத்துவ விளைவு மற்றும் மேலாண்மை",
        "col_action": "பரிந்துரைக்கப்பட்ட நடவடிக்கை:",
        "sign_ai": "AI மருத்துவ அமைப்பு: மெட்ஹப் கிளினிக்கல் 14B LoRA (சரிபார்க்கப்பட்டது)",
        "sign_physician": "மருத்துவரின் கையொப்பம் மற்றும் மதிப்பாய்வு: ___________________________",
        "sign_hash": "மின்னணு கையொப்ப குறியீடு:",
        "sign_license": "மருத்துவ பதிவு எண் (Reg No / NPI): ___________________________",
        "disclaimer": "ரகசிய மருத்துவ ஆவணம்: இந்த அறிக்கை மெட்ஹப் மருத்துவ நுண்ணறிவு அமைப்பால் மருத்துவ முடிவெடுக்கும் ஆதரவிற்காக தயாரிக்கப்பட்டது. இது ஒரு தகுதிவாய்ந்த மருத்துவரின் நேரடி பரிசோதனைக்கு மாற்றாகாது. அவசர காலங்களில் உடனடியாக 108 அல்லது அவசர சிகிச்சை பிரிவை அணுகவும்."
    },
    "ml": {
        "lang_name": "Malayalam (മലയാളം)",
        "doc_title": "മെഡ്ഹബ് ക്ലിനിക്കൽ ഇന്റലിജൻസ് സിസ്റ്റം",
        "doc_subtitle": "S.O.A.P. മെഡിക്കൽ കൺസൾട്ടേഷൻ സംഗ്രഹം & ക്ലിനിക്കൽ ട്രാൻസ്ഫർ കുറിപ്പ്",
        "badge_hipaa": "HIPAA സ്വകാര്യത പരിരക്ഷിക്കപ്പെട്ടത് • ലോക്കൽ എൻജിൻ (NVIDIA B200 178GB)",
        "patient_name_label": "രോഗിയുടെ പേര്:",
        "consult_date_label": "പരിശോധന തീയതി:",
        "triage_urgency_label": "ട്രയേജ് മുൻഗണന:",
        "ddi_radar_label": "മരുന്ന് പ്രതിപ്രവർത്തന റഡാർ (DDI):",
        "facility_label": "ക്ലിനിക്കൽ യൂണിറ്റ്:",
        "facility_value": "ഓൺ-പ്രെമിസ് ക്ലിനിക്കൽ വോൾട്ട്",
        "grounding_label": "വിവര സ്രോതസ്സ്:",
        "grounding_value": "യു.എസ്. FDA ഡ്രഗ് ഡാറ്റാബേസ്",
        "sec_s_title": "S — സബ്ജക്റ്റീവ് (രോഗി വ്യക്തമാക്കിയ ലക്ഷണങ്ങളും മുൻവിവരങ്ങളും)",
        "sec_o_title": "O — ഒബ്ജക്റ്റീവ് (ക്ലിനിക്കൽ നിരീക്ഷണങ്ങളും ട്രയേജ് വർഗ്ഗീകരണവും)",
        "sec_a_title": "A — അസസ്സ്മെന്റ് (രോഗനിർണ്ണയ അനുമാനം & ഔഷധ സുരക്ഷാ വിലയിരുത്തൽ)",
        "sec_p_title": "P — പ്ലാൻ (ചികിത്സാ നടപടികൾ, മാർഗ്ഗനിർദ്ദേശങ്ങൾ & തുടർപരിശോധന)",
        "lbl_chief_complaint": "പ്രധാന ബുദ്ധിമുട്ടും രോഗിയുടെ വിവരവും:",
        "lbl_symptoms": "കണ്ടെത്തിയ ഗുരുതര ലക്ഷണങ്ങൾ:",
        "lbl_triage_proto": "ട്രയേജ് പ്രോട്ടോക്കോൾ:",
        "lbl_active_meds": "ഉപയോഗത്തിലുള്ള മരുന്നുകൾ:",
        "lbl_no_meds": "മരുന്നുകളൊന്നും കണ്ടെത്തിയില്ല",
        "lbl_fda_ref": "സ്ഥിരീകരിച്ച FDA റഫറൻസ്:",
        "lbl_fda_local": "പ്രാദേശിക ക്ലിനിക്കൽ മാട്രിക്സ് പ്രകാരം പരിശോധിച്ചു",
        "lbl_clinical_urgency": "ചികിത്സാ അടിയന്തിരാവസ്ഥ:",
        "lbl_ddi_status": "മരുന്ന് പ്രതിപ്രവർത്തന സ്ഥിതി:",
        "lbl_conflict": "പ്രതിപ്രവർത്തന കുറിപ്പ്:",
        "lbl_primary_rec": "പ്രധാന നിർദ്ദേശം:",
        "lbl_ai_guidance": "ക്ലിനിക്കൽ AI മാർഗ്ഗനിർദ്ദേശം:",
        "lbl_safety_precaution": "സുരക്ഷാ മുൻകരുതൽ: മരുന്നുകളിൽ മാറ്റം വരുത്തുന്നതിന് മുമ്പ് ഡോക്ടറുടെയോ ഫാർമസിസ്റ്റിന്റെയോ അനുമതി തേടുക.",
        "ddi_table_title": "കണ്ടെത്തിയ ഔഷധ പ്രതിപ്രവർത്തനങ്ങൾ:",
        "col_pair": "മരുന്നുകളുടെ ജോഡി",
        "col_severity": "തീവ്രത",
        "col_mechanism": "ക്ലിനിക്കൽ പ്രത്യാഘാതവും പരിഹാരവും",
        "col_action": "നടപടി:",
        "sign_ai": "AI അറ്റൻഡിംഗ് സിസ്റ്റം: മെഡ്ഹബ് 14B LoRA (സ്ഥിരീകരിച്ചത്)",
        "sign_physician": "ഡോക്ടറുടെ ഒപ്പും പരിശോധനയും: ___________________________",
        "sign_hash": "ഇലക്ട്രോണിക് സിഗ്നേച്ചർ ഹാഷ്:",
        "sign_license": "മെഡിക്കൽ രജിസ്ട്രേഷൻ നമ്പർ: ___________________________",
        "disclaimer": "രഹസ്യ മെഡിക്കൽ രേഖ: ഈ രേഖ മെഡ്ഹബ് ക്ലിനിക്കൽ ഇന്റലിജൻസ് സിസ്റ്റം തയ്യാറാക്കിയതാണ്. ഇത് ഡോക്ടറുടെ നേരിട്ടുള്ള പരിശോധനയ്ക്ക് പകരമാവില്ല. അടിയന്തിര സാഹചര്യങ്ങളിൽ ഉടൻ 108 വിളിക്കുകയോ ആശുപത്രിയിൽ എത്തുകയോ ചെയ്യുക."
    },
    "te": {
        "lang_name": "Telugu (తెలుగు)",
        "doc_title": "మెడ్‌హబ్ క్లినికల్ ఇంటెలిజెన్స్ సిస్టమ్",
        "doc_subtitle": "S.O.A.P. వైద్య సంప్రదింపుల సారాంశం & క్లినికల్ బదిలీ నోట్",
        "badge_hipaa": "HIPAA గోప్యతా రక్షణ • స్థానిక కంప్యూటింగ్ ఇంజిన్ (NVIDIA B200 178GB)",
        "patient_name_label": "రోగి పేరు:",
        "consult_date_label": "సంప్రదింపుల తేదీ:",
        "triage_urgency_label": "ట్రయాజ్ అత్యవసరత:",
        "ddi_radar_label": "మందుల పరస్పర చర్య రాడార్ (DDI):",
        "facility_label": "క్లినికల్ విభాగం:",
        "facility_value": "ఆన్-ప్రామిస్ క్లినికల్ వాల్ట్",
        "grounding_label": "సమాచార మూలం:",
        "grounding_value": "US FDA ఔషధ డేటాబేస్ & మార్గదర్శకాలు",
        "sec_s_title": "S — సబ్జెక్టివ్ (రోగి తెలిపిన లక్షణాలు మరియు ఆరోగ్య చరిత్ర)",
        "sec_o_title": "O — ఆబ్జెక్టివ్ (క్లినికల్ పరిశీలనలు మరియు ట్రయాజ్ వర్గీకరణ)",
        "sec_a_title": "A — అసెస్మెంట్ (రోగనిర్ధారణ అభిప్రాయం & మందుల పరస్పర భద్రత)",
        "sec_p_title": "P — ప్రణాళిక (చికిత్సా ప్రణాళిక, మార్గదర్శకాలు మరియు తదుపరి సంప్రదింపు)",
        "lbl_chief_complaint": "ప్రధాన ఫిర్యాదు & రోగి వివరాలు:",
        "lbl_symptoms": "గుర్తించిన కీలక లక్షణాలు:",
        "lbl_triage_proto": "ట్రయాజ్ ప్రోటోకాల్:",
        "lbl_active_meds": "వాడుకలో ఉన్న మందులు:",
        "lbl_no_meds": "ఎటువంటి మందులు గుర్తించబడలేదు",
        "lbl_fda_ref": "ధృవీకరించబడిన FDA వివరాలు:",
        "lbl_fda_local": "స్థానిక వైద్య మార్గదర్శకాలతో సరిపోల్చబడింది",
        "lbl_clinical_urgency": "క్లినికల్ అత్యవసరత:",
        "lbl_ddi_status": "ఔషధ పరస్పర చర్య స్థితి:",
        "lbl_conflict": "సంఘర్షణ గమనిక:",
        "lbl_primary_rec": "ప్రధాన సిఫార్సు:",
        "lbl_ai_guidance": "క్లినికల్ AI మార్గదర్శకత్వం:",
        "lbl_safety_precaution": "భద్రతా జాగ్రత్త: మందులలో ఎటువంటి మార్పులు చేసే ముందైనా వైద్యుడిని లేదా ఫార్మసిస్ట్‌ను సంప్రదించండి.",
        "ddi_table_title": "గుర్తించబడిన ఔషధ పరస్పర చర్యలు:",
        "col_pair": "ఔషధ జంట",
        "col_severity": "తీవ్రత",
        "col_mechanism": "క్లినికల్ ప్రభావం మరియు నిర్వహణ",
        "col_action": "చర్య:",
        "sign_ai": "AI అటెండింగ్ సిస్టమ్: మెడ్‌హబ్ 14B LoRA (ధృవీకరించబడింది)",
        "sign_physician": "వైద్యుని సంతకం & సమీక్ష: ___________________________",
        "sign_hash": "ఎలక్ట్రానిక్ సంతకం సంఖ్య:",
        "sign_license": "వైద్య రిజిస్ట్రేషన్ సంఖ్య: ___________________________",
        "disclaimer": "రహస్య వైద్య నివేదిక: ఈ పత్రం మెడ్‌హబ్ క్లినికల్ ఇంటెలిజెన్స్ సిస్టమ్ ద్వారా రూపొందించబడింది. ఇది వైద్యుని ప్రత్యక్ష సలహాకు ప్రత్యామ్నాయం కాదు. అత్యవసర సమయాల్లో వెంటనే 108 కు కాల్ చేయండి లేదా ఆసుపత్రికి వెళ్లండి."
    },
    "kn": {
        "lang_name": "Kannada (ಕನ್ನಡ)",
        "doc_title": "ಮೆಡ್‌ಹಬ್ ಕ್ಲಿನಿಕಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಸಿಸ್ಟಮ್",
        "doc_subtitle": "S.O.A.P. ವೈದ್ಯಕೀಯ ಸಮಾಲೋಚನೆ ಸಾರಾಂಶ & ಕ್ಲಿನಿಕಲ್ ವರ್ಗಾವಣೆ ಟಿಪ್ಪಣಿ",
        "badge_hipaa": "HIPAA ಗೌಪ್ಯತೆ ರಕ್ಷಿತ • ಸ್ಥಳೀಯ ಕಂಪ್ಯೂಟಿಂಗ್ ಎಂಜಿನ್ (NVIDIA B200 178GB)",
        "patient_name_label": "ರೋಗಿಯ ಹೆಸರು:",
        "consult_date_label": "ಸಮಾಲೋಚನೆ ದಿನಾಂಕ:",
        "triage_urgency_label": "ಟ್ರಯಾಜ್ ತುರ್ತುಸ್ಥಿತಿ:",
        "ddi_radar_label": "ಔಷಧ ಪರಸ್ಪರ ಕ್ರಿಯೆ ರಾಡಾರ್ (DDI):",
        "facility_label": "ಕ್ಲಿನಿಕಲ್ ವಿಭಾಗ:",
        "facility_value": "ಆನ್-ಪ್ರಿಮೈಸ್ ಕ್ಲಿನಿಕಲ್ ವಾಲ್ಟ್",
        "grounding_label": "ಮಾಹಿತಿ ಮೂಲ:",
        "grounding_value": "ಯುಎಸ್ ಎಫ್‌ಡಿಎ ಔಷಧ ಡೇಟಾಬೇಸ್",
        "sec_s_title": "S — ಸಬ್ಜೆಕ್ಟಿವ್ (ರೋಗಿ ತಿಳಿಸಿದ ರೋಗಲಕ್ಷಣಗಳು ಮತ್ತು ಇತಿಹಾಸ)",
        "sec_o_title": "O — ಆಬ್ಜೆಕ್ಟಿವ್ (ಕ್ಲಿನಿಕಲ್ ಅವಲೋಕನಗಳು ಮತ್ತು ಟ್ರಯಾಜ್ ವರ್ಗೀಕರಣ)",
        "sec_a_title": "A — ಮೌಲ್ಯಮಾಪನ (ರೋಗನಿರ್ಣಯದ ಅನಿಸಿಕೆ & ಔಷಧ ಸುರಕ್ಷತೆ)",
        "sec_p_title": "P — ಯೋಜನೆ (ಕಾರ್ಯ ಕ್ರಮಗಳು, ಮಾರ್ಗದರ್ಶನ & ಮುಂದಿನ ಭೇಟಿ)",
        "lbl_chief_complaint": "ಮುಖ್ಯ ದೂರು & ರೋಗಿಯ ಮಾಹಿತಿ:",
        "lbl_symptoms": "ಗುರುತಿಸಲಾದ ಲಕ್ಷಣಗಳು:",
        "lbl_triage_proto": "ಟ್ರಯಾಜ್ ಪ್ರೋಟೋಕಾಲ್:",
        "lbl_active_meds": "ಬಳಕೆಯಲ್ಲಿರುವ ಔಷಧಗಳು:",
        "lbl_no_meds": "ಯಾವುದೇ ಔಷಧಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
        "lbl_fda_ref": "ಪರಿಶೀಲಿಸಲಾದ ಎಫ್‌ಡಿಎ ಉಲ್ಲೇಖ:",
        "lbl_fda_local": "ಸ್ಥಳೀಯ ಕ್ಲಿನಿಕಲ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಮೂಲಕ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
        "lbl_clinical_urgency": "ಕ್ಲಿನಿಕಲ್ ತುರ್ತುಸ್ಥಿತಿ:",
        "lbl_ddi_status": "ಔಷಧ ಪರಸ್ಪರ ಕ್ರಿಯೆಯ ಸ್ಥಿತಿ:",
        "lbl_conflict": "ಸಂಘರ್ಷದ ಟಿಪ್ಪಣಿ:",
        "lbl_primary_rec": "ಮುಖ್ಯ ಶಿಫಾರಸು:",
        "lbl_ai_guidance": "ಕ್ಲಿನಿಕಲ್ AI ಮಾರ್ಗದರ್ಶನ:",
        "lbl_safety_precaution": "ಸುರಕ್ಷತಾ ಮುನ್ನೆಚ್ಚರಿಕೆ: ಔಷಧಿಗಳಲ್ಲಿ ಯಾವುದೇ ಬದಲಾವಣೆ ಮಾಡುವ ಮೊದಲು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
        "ddi_table_title": "ಗುರುತಿಸಲಾದ ಔಷಧ ಪರಸ್ಪರ ಕ್ರಿಯೆಗಳು:",
        "col_pair": "ಔಷಧ ಜೋಡಿ",
        "col_severity": "ತೀವ್ರತೆ",
        "col_mechanism": "ಕ್ಲಿನಿಕಲ್ ಪರಿಣಾಮ ಮತ್ತು ನಿರ್ವಹಣೆ",
        "col_action": "ಕ್ರಮ:",
        "sign_ai": "AI ಅಟೆಂಡಿಂಗ್ ಸಿಸ್ಟಮ್: ಮೆಡ್‌ಹಬ್ 14B LoRA (ಪರಿಶೀಲಿಸಲಾಗಿದೆ)",
        "sign_physician": "ವೈದ್ಯರ ಸಹಿ ಮತ್ತು ಪರಿಶೀಲನೆ: ___________________________",
        "sign_hash": "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಹಿ ಹ್ಯಾಶ್:",
        "sign_license": "ವೈದ್ಯಕೀಯ ನೋಂದಣಿ ಸಂಖ್ಯೆ: ___________________________",
        "disclaimer": "ಗೌಪ್ಯ ವೈದ್ಯಕೀಯ ದಾಖಲೆ: ಈ ವರದಿಯನ್ನು ಮೆಡ್‌ಹಬ್ ಕ್ಲಿನಿಕಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಸಿಸ್ಟಮ್ ಸಿದ್ಧಪಡಿಸಿದೆ. ಇದು ವೈದ್ಯರ ನೇರ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ತಕ್ಷಣ 108 ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ."
    },
    "hi": {
        "lang_name": "Hindi (हिन्दी)",
        "doc_title": "मेදහब क्लिनिकल इंटेलिजेंस सिस्टम",
        "doc_subtitle": "S.O.A.P. नैदानिक परामर्श सारांश एवं क्लीनिकल ट्रांसफर नोट",
        "badge_hipaa": "HIPAA गोपनीयता संरक्षित • सुरक्षित स्थानीय कंप्यूटिंग इंजन (NVIDIA B200 178GB)",
        "patient_name_label": "रोगी का नाम:",
        "consult_date_label": "परामर्श तिथि:",
        "triage_urgency_label": "ट्राइएज प्राथमिकता:",
        "ddi_radar_label": "औषधि परस्पर क्रिया रडार (DDI):",
        "facility_label": "चिकित्सा इकाई:",
        "facility_value": "ऑन-प्रिमाइसेस क्लीनिकल सुरक्षित वॉल्ट",
        "grounding_label": "सत्यापन स्रोत:",
        "grounding_value": "यूएस एफडीए औषधि डेटाबेस एवं नैदानिक मैट्रिक्स",
        "sec_s_title": "S — व्यक्तिपरक (रोगी द्वारा व्यक्त मुख्य शिकायत एवं इतिहास)",
        "sec_o_title": "O — वस्तुपरक (नैदानिक अवलोकन एवं ट्राइएज वर्गीकरण)",
        "sec_a_title": "A — मूल्यांकन (रोगनिदान विश्लेषण एवं औषधि सुरक्षा मूल्यांकन)",
        "sec_p_title": "P — उपचार योजना (कार्यवाही कदम, ट्राइएज मार्गदर्शन एवं अनुवर्ती परामर्श)",
        "lbl_chief_complaint": "मुख्य समस्या एवं रोगी का विवरण:",
        "lbl_symptoms": "चिह्नित रोग लक्षण:",
        "lbl_triage_proto": "ट्राइएज प्रोटोकॉल:",
        "lbl_active_meds": "पहचानी गई औषधियां:",
        "lbl_no_meds": "कोई ज्ञात औषधि नहीं पाई गई",
        "lbl_fda_ref": "सत्यापित एफडीए संदर्भ:",
        "lbl_fda_local": "स्थानीय नैदानिक नियमावली से सत्यापित",
        "lbl_clinical_urgency": "नैदानिक अनिवार्यता:",
        "lbl_ddi_status": "औषधि परस्पर क्रिया स्थिति:",
        "lbl_conflict": "अंतर्क्रिया विवरण:",
        "lbl_primary_rec": "मुख्य सलाह / अनुशंसा:",
        "lbl_ai_guidance": "नैदानिक AI परामर्श:",
        "lbl_safety_precaution": "सुरक्षा सावधानी: किसी भी दवा को बदलने या बंद करने से पहले चिकित्सक या फार्मासिस्ट से परामर्श अवश्य लें।",
        "ddi_table_title": "पहचानी गई औषधीय अंतर्क्रियाएं एवं जोखिम:",
        "col_pair": "औषधि संयोजन",
        "col_severity": "गंभीरता",
        "col_mechanism": "नैदानिक प्रभाव एवं प्रबंधन उपाय",
        "col_action": "कार्यवाही:",
        "sign_ai": "AI सहायक प्रणाली: मेडहब क्लीनिकल 14B LoRA (सत्यापित)",
        "sign_physician": "चिकित्सक हस्ताक्षर एवं सत्यापन: ___________________________",
        "sign_hash": "इलेक्ट्रॉनिक हस्ताक्षर कोड:",
        "sign_license": "चिकित्सा पंजीकरण क्रमांक (NPI): ___________________________",
        "disclaimer": "गोपनीय चिकित्सा रिकॉर्ड: यह दस्तावेज़ मेडहब क्लीनिकल इंटेलिजेंस सिस्टम द्वारा तैयार किया गया है। यह किसी अधिकृत चिकित्सक के प्रत्यक्ष परामर्श का विकल्प नहीं है। आपात स्थिति में तत्काल 108 पर कॉल करें या आपातकालीन चिकित्सा विभाग से संपर्क करें।"
    }
}

TRIAGE_LOCALIZED = {
    "emergency": {
        "badge": {
            "en": "CRITICAL EMERGENCY",
            "ta": "தீவிர அவசரநிலை (உடனடி உதவி)",
            "ml": "ഗുരുതരമായ അടിയന്തരാവസ്ഥ",
            "te": "తీవ్ర అత్యవసర పరిస్థితి",
            "kn": "ತೀವ್ರ ತುರ್ತುಸ್ಥಿತಿ",
            "hi": "गंभीर आपातकाल"
        },
        "title": {
            "en": "Immediate Emergency Medical Attention Required",
            "ta": "உடனடி அவசர மருத்துவ சிகிச்சை தேவை",
            "ml": "ഉടനടി അടിയന്തിര വൈദ്യസഹായം ആവശ്യമാണ്",
            "te": "వెంటనే అత్యవసర వైద్య సంరక్షణ అవసరం",
            "kn": "ತಕ್ಷಣದ ತುರ್ತು ವೈದ್ಯಕೀಯ ನೆರವು ಅಗತ್ಯವಿದೆ",
            "hi": "तत्काल आपातकालीन चिकित्सा सहायता आवश्यक"
        },
        "rec": {
            "en": "Call 911 (or local emergency 108) immediately. Do not attempt to drive yourself.",
            "ta": "உடனடியாக 108 அவசர ஆம்புலன்ஸ் சேவையை அழைக்கவும். நீங்களாக வாகனம் ஓட்ட வேண்டாம்.",
            "ml": "ഉടൻ തന്നെ 108/ആംബുലൻസ് വിളിക്കുക. സ്വയം വാഹനം ഓടിച്ച് പോകരുത്.",
            "te": "వెంటనే 108/అత్యవసర సేవలకు కాల్ చేయండి. మీరే స్వయంగా డ్రైవ్ చేయవద్దు.",
            "kn": "ತಕ್ಷಣವೇ 108 ತುರ್ತು ಸೇವೆಗೆ ಕರೆ ಮಾಡಿ. ನೀವೇ ವಾಹನ ಚಾಲನೆ ಮಾಡಬೇಡಿ.",
            "hi": "तुरंत आपातकालीन एम्बुलेंस (108) को कॉल करें। स्वयं वाहन न चलाएं।"
        }
    },
    "urgent": {
        "badge": {
            "en": "URGENT CLINIC VISIT",
            "ta": "அவசர மருத்துவ சந்திப்பு (24-48 மணி நேரம்)",
            "ml": "അടിയന്തിര ക്ലിനിക് സന്ദർശനം",
            "te": "అత్యవసర క్లినిక్ సందర్శన",
            "kn": "ತುರ್ತು ಕ್ಲಿನಿಕ್ ಭೇಟಿ",
            "hi": "त्वरित क्लिनिक परामर्श"
        },
        "title": {
            "en": "Prompt Clinical Evaluation Recommended",
            "ta": "விரைவான மருத்துவ பரிசோதனை பரிந்துரைக்கப்படுகிறது",
            "ml": "ഉടൻ തന്നെ ഡോക്ടറെ കണ്ട് പരിശോധന നടത്തുക",
            "te": "త్వరిత క్లినికల్ మూల్యాంకనం సిఫార్సు చేయబడింది",
            "kn": "ಶೀಘ್ರ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
            "hi": "शीघ्र चिकित्सकीय परामर्श की सिफारिश की जाती है"
        },
        "rec": {
            "en": "Schedule an urgent outpatient clinic appointment within 24 to 48 hours.",
            "ta": "24 முதல் 48 மணி நேரத்திற்குள் மருத்துவரை அல்லது மருத்துவமனையை அணுகவும்.",
            "ml": "24 മുതൽ 48 മണിക്കൂറിനുള്ളിൽ ക്ലിനിക്കിലോ ആശുപത്രിയിലോ പരിശോധന നടത്തുക.",
            "te": "24 నుండి 48 గంటల్లో క్లినిక్ లేదా ఆసుపత్రిని సందర్శించండి.",
            "kn": "24 ರಿಂದ 48 ಗಂಟೆಗಳ ಒಳಗೆ ಕ್ಲಿನಿಕ್ ಅಥವಾ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.",
            "hi": "24 से 48 घंटों के भीतर किसी क्लिनिक या डॉक्टर से परामर्श अवश्य लें।"
        }
    },
    "routine": {
        "badge": {
            "en": "ROUTINE CARE",
            "ta": "வழக்கமான பராமரிப்பு (வீட்டு பராமரிப்பு)",
            "ml": "സാധാരണ പരിചരണം",
            "te": "సాధారణ సంరక్షణ",
            "kn": "ವಾಡಿಕೆಯ ಆರೈಕೆ",
            "hi": "नियमित देखभाल"
        },
        "title": {
            "en": "Standard Supportive Home Care & Monitoring",
            "ta": "வழக்கமான வீட்டுப் பராமரிப்பு மற்றும் கண்காணிப்பு",
            "ml": "സാധാരണ വീട്ടിലെ പരിചരണവും നിരീക്ഷണവും",
            "te": "సాధారణ గృహ సంరక్షణ మరియు పర్యవేక్షణ",
            "kn": "ವಾಡಿಕೆಯ ಮನೆ ಆರೈಕೆ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ",
            "hi": "सामान्य घरेलू देखभाल एवं निगरानी"
        },
        "rec": {
            "en": "Maintain adequate rest, hydration, and monitor symptoms. Consult doctor if symptoms persist.",
            "ta": "போதுமான ஓய்வு, நீர்ச்சத்து எடுத்துக்கொண்டு அறிகுறிகளைக் கண்காணிக்கவும். தொடர்ந்தால் மருத்துவரை அணுகவும்.",
            "ml": "വിശ്രമം, വെള്ളം എന്നിവ ഉറപ്പാക്കി ലക്ഷണങ്ങൾ നിരീക്ഷിക്കുക. തുടർന്നാൽ ഡോക്ടറെ കാണുക.",
            "te": "తగినంత విశ్రాంతి, ద్రవ పదార్థాలు తీసుకుంటూ లక్షణాలను గమనించండి. కొనసాగితే వైద్యుడిని సంప్రదించండి.",
            "kn": "ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ, ನೀರು ಸೇವಿಸಿ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಿ. ಮುಂದುವರಿದರೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.",
            "hi": "उचित विश्राम, पर्याप्त जलपान लें और लक्षणों पर नजर रखें। जारी रहने पर डॉक्टर से परामर्श लें।"
        }
    }
}

DDI_BADGE_LOCALIZED = {
    "safe": {
        "en": "Radar Clear (Safe)",
        "ta": "பாதுகாப்பானது (முரண்பாடுகள் இல்லை)",
        "ml": "സുരക്ഷിതം (പ്രതികൂല ഇടപെടലുകളില്ല)",
        "te": "సురక్షితం (సంఘర్షణలు లేవు)",
        "kn": "ಸುರಕ್ಷಿತ (ಯಾವುದೇ ಸಂಘರ್ಷವಿಲ್ಲ)",
        "hi": "सुरक्षित (कोई अंतर्क्रिया नहीं)"
    },
    "warning": {
        "en": "Clinical Caution (Moderate)",
        "ta": "மருத்துவ எச்சரிக்கை (மிதமானது)",
        "ml": "ശ്രദ്ധിക്കുക (മിതമായ പ്രതിപ്രവർത്തനം)",
        "te": "క్లినికల్ జాగ్రత్త (మితమైనది)",
        "kn": "ಕ್ಲಿನಿಕಲ್ ಎಚ್ಚರಿಕೆ (ಮಧ್ಯಮ)",
        "hi": "नैदानिक सावधानी (मध्यम)"
    },
    "danger": {
        "en": "HIGH DANGER ALERT (Severe)",
        "ta": "ஆபத்து எச்சரிக்கை (கடுமையானது)",
        "ml": "ഗുരുതരമായ മുന്നറിയിപ്പ് (അപകടകരം)",
        "te": "తీవ్ర హెచ్చరిక (ప్రమాదకరం)",
        "kn": "ತೀವ್ರ ಎಚ್ಚರಿಕೆ (ಅಪಾಯಕಾರಿ)",
        "hi": "गंभीर चेतावनी (घातक)"
    }
}

# ---------------------------------------------------------------------------
# 6. S.O.A.P. / S.B.A.R. CLINICAL NOTE BUILDER
# ---------------------------------------------------------------------------

def build_soap_note(user_query: str, ai_response: str, triage_data: dict, ddi_data: dict, fda_info: dict = None, lang: str = "en") -> dict:
    """Synthesizes structured Subjective, Objective, Assessment, Plan (SOAP) clinical record."""
    lang = (lang or "en").lower().strip()
    t = SOAP_TRANSLATIONS.get(lang, SOAP_TRANSLATIONS["en"])

    triage_lvl = triage_data.get("level", "routine")
    triage_loc = TRIAGE_LOCALIZED.get(triage_lvl, TRIAGE_LOCALIZED["routine"])
    triage_title = triage_loc["title"].get(lang, triage_data.get("title", ""))
    triage_rec = triage_loc["rec"].get(lang, triage_data.get("recommendation", ""))

    ddi_lvl = ddi_data.get("severity", "safe")
    ddi_badge_loc = DDI_BADGE_LOCALIZED.get(ddi_lvl, DDI_BADGE_LOCALIZED["safe"]).get(lang, ddi_data.get("badge", "Safe"))

    # Subjective
    subj_lines = [f"{t['lbl_chief_complaint']} \"{user_query.strip()}\""]
    if triage_data.get("triggers"):
        subj_lines.append(f"{t['lbl_symptoms']} {', '.join(triage_data['triggers'])}")

    # Objective
    active_drugs_str = ", ".join(ddi_data["active_drugs"]) if ddi_data.get("active_drugs") else t["lbl_no_meds"]
    obj_lines = [
        f"{t['lbl_triage_proto']} {triage_data.get('esi_label', 'ESI Protocol')} (Score: {triage_data.get('score', 3)})",
        f"{t['lbl_active_meds']} {active_drugs_str}"
    ]
    if fda_info and fda_info.get("verified"):
        obj_lines.append(f"{t['lbl_fda_ref']} {fda_info.get('drug_name', 'N/A').title()} (NDC Grounded)")
    else:
        obj_lines.append(f"{t['lbl_fda_ref']} {t['lbl_fda_local']}")

    # Assessment
    assess_lines = [
        f"{t['lbl_clinical_urgency']} {triage_title}",
        f"{t['lbl_ddi_status']} {ddi_data.get('title', '')} ({ddi_badge_loc})"
    ]
    if ddi_data.get("interactions"):
        for inter in ddi_data["interactions"]:
            assess_lines.append(f"{t['lbl_conflict']} {inter.get('title', '')} — {inter.get('description', '')}")

    # Plan
    ai_guidance_snippet = ai_response.strip()
    if len(ai_guidance_snippet) > 400:
        ai_guidance_snippet = ai_guidance_snippet[:400] + "..."
    plan_lines = [
        f"{t['lbl_primary_rec']} {triage_rec}",
        f"{t['lbl_ai_guidance']} {ai_guidance_snippet}",
        t["lbl_safety_precaution"]
    ]

    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "lang": lang,
        "query": user_query.strip(),
        "ai_guidance": ai_response.strip(),
        "subjective": "\n".join(subj_lines),
        "objective": "\n".join(obj_lines),
        "assessment": "\n".join(assess_lines),
        "plan": "\n".join(plan_lines),
        "triage": triage_data,
        "ddi": ddi_data
    }

# ---------------------------------------------------------------------------
# 7. MULTILINGUAL S.O.A.P. / S.B.A.R. PDF REPORT GENERATOR
# ---------------------------------------------------------------------------

def generate_soap_pdf(soap_data: dict, patient_name: str = "Anonymous Patient", lang: str = None) -> BytesIO:
    """
    Renders an elegant, audit-grade 1-page S.O.A.P. & S.B.A.R. Medical Consultation Summary
    in the requested language (en, ta, ml, te, kn, hi) with native Unicode fonts and clinical typography.
    """
    if not lang:
        lang = soap_data.get("lang", "en")
    lang = (lang or "en").lower().strip()
    if lang not in SOAP_TRANSLATIONS:
        lang = "en"

    t = SOAP_TRANSLATIONS[lang]
    font_reg, font_bold = get_font_family_for_lang(lang)

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=28,
        bottomMargin=28
    )

    styles = getSampleStyleSheet()

    # Custom typography tuned for each language script
    is_indic = (lang != "en")
    header_style = ParagraphStyle(
        'DocHeader',
        parent=styles['Heading1'],
        fontName=font_bold,
        fontSize=14 if is_indic else 16,
        leading=18 if is_indic else 20,
        textColor=colors.HexColor('#064e3b')
    )

    sub_header_style = ParagraphStyle(
        'SubHeader',
        parent=styles['Normal'],
        fontName=font_reg,
        fontSize=8 if is_indic else 8.5,
        leading=11 if is_indic else 12,
        textColor=colors.HexColor('#4b5563')
    )

    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName=font_bold,
        fontSize=9.5 if is_indic else 10.5,
        leading=13 if is_indic else 14,
        textColor=colors.HexColor('#065f46')
    )

    body_style = ParagraphStyle(
        'SoapBody',
        parent=styles['Normal'],
        fontName=font_reg,
        fontSize=8 if is_indic else 8.5,
        leading=12 if is_indic else 12.5,
        textColor=colors.HexColor('#1f2937')
    )

    elements = []

    # Title & Hospital Header
    elements.append(Paragraph(t["doc_title"], header_style))
    elements.append(Paragraph(t["doc_subtitle"], sub_header_style))
    elements.append(Paragraph(t["badge_hipaa"], sub_header_style))
    elements.append(Spacer(1, 8))

    # Meta Info Table
    triage_info = soap_data.get("triage", {})
    triage_lvl = triage_info.get("level", "routine")
    triage_loc = TRIAGE_LOCALIZED.get(triage_lvl, TRIAGE_LOCALIZED["routine"])
    triage_label = triage_loc["badge"].get(lang, triage_info.get("badge", "ROUTINE CARE"))
    triage_color = triage_info.get("color", "#10b981")

    ddi_info = soap_data.get("ddi", {})
    ddi_lvl = ddi_info.get("severity", "safe")
    ddi_badge = DDI_BADGE_LOCALIZED.get(ddi_lvl, DDI_BADGE_LOCALIZED["safe"]).get(lang, ddi_info.get("badge", "Safe"))

    consult_ts = soap_data.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M UTC'))

    meta_table_data = [
        [
            Paragraph(f"<b>{t['patient_name_label']}</b>", body_style),
            Paragraph(f"{patient_name.capitalize()}", body_style),
            Paragraph(f"<b>{t['consult_date_label']}</b>", body_style),
            Paragraph(f"{consult_ts}", body_style)
        ],
        [
            Paragraph(f"<b>{t['triage_urgency_label']}</b>", body_style),
            Paragraph(f'<b><font color="{triage_color}">{triage_label}</font></b>', body_style),
            Paragraph(f"<b>{t['ddi_radar_label']}</b>", body_style),
            Paragraph(f"<b>{ddi_badge}</b>", body_style)
        ],
        [
            Paragraph(f"<b>{t['facility_label']}</b>", body_style),
            Paragraph(t["facility_value"], body_style),
            Paragraph(f"<b>{t['grounding_label']}</b>", body_style),
            Paragraph(t["grounding_value"], body_style)
        ]
    ]

    meta_table = Table(meta_table_data, colWidths=[115, 155, 115, 155])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0fdf4')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#a7f3d0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#d1fae5')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 8))

    # Re-localize SOAP content if data was generated in a different language
    subj_content = soap_data.get("subjective", "")
    obj_content = soap_data.get("objective", "")
    assess_content = soap_data.get("assessment", "")
    plan_content = soap_data.get("plan", "")

    # If soap_data has query or lang differs, build precise localized sections
    if soap_data.get("lang") != lang or not subj_content:
        query_text = soap_data.get("query", "")
        if not query_text and subj_content:
            m = re.search(r'"([^"]+)"', subj_content)
            query_text = m.group(1) if m else subj_content.split("\n")[0]
        rec_text = triage_loc["rec"].get(lang, triage_info.get("recommendation", ""))
        title_text = triage_loc["title"].get(lang, triage_info.get("title", ""))

        triggers = triage_info.get("triggers", [])
        active_drugs = ddi_info.get("active_drugs", [])
        active_str = ", ".join(active_drugs) if active_drugs else t["lbl_no_meds"]

        s_lines = [f"{t['lbl_chief_complaint']} \"{query_text}\""]
        if triggers:
            s_lines.append(f"{t['lbl_symptoms']} {', '.join(triggers)}")
        subj_content = "\n".join(s_lines)

        o_lines = [
            f"{t['lbl_triage_proto']} {triage_info.get('esi_label', 'ESI Protocol')} (Score: {triage_info.get('score', 3)})",
            f"{t['lbl_active_meds']} {active_str}",
            f"{t['lbl_fda_ref']} {t['lbl_fda_local']}"
        ]
        obj_content = "\n".join(o_lines)

        a_lines = [
            f"{t['lbl_clinical_urgency']} {title_text}",
            f"{t['lbl_ddi_status']} {ddi_info.get('title', '')} ({ddi_badge})"
        ]
        if ddi_info.get("interactions"):
            for inter in ddi_info["interactions"]:
                a_lines.append(f"{t['lbl_conflict']} {inter.get('title', '')} — {inter.get('description', '')}")
        assess_content = "\n".join(a_lines)

        ai_guide = soap_data.get("ai_guidance", "")
        if not ai_guide and plan_content:
            ai_guide = plan_content.split("\n")[1] if len(plan_content.split("\n")) > 1 else plan_content
        if len(ai_guide) > 350:
            ai_guide = ai_guide[:350] + "..."
        p_lines = [
            f"{t['lbl_primary_rec']} {rec_text}",
            f"{t['lbl_ai_guidance']} {ai_guide}",
            t["lbl_safety_precaution"]
        ]
        plan_content = "\n".join(p_lines)

    # SOAP Sections
    sections = [
        (t["sec_s_title"], subj_content, "#ecfdf5", "#059669"),
        (t["sec_o_title"], obj_content, "#f0fdfa", "#0d9488"),
        (t["sec_a_title"], assess_content, "#f7fee7", "#65a30d"),
        (t["sec_p_title"], plan_content, "#f8fafc", "#475569"),
    ]

    for title, content, bg_col, border_col in sections:
        sec_header = Paragraph(f"<b>{title}</b>", section_title_style)
        sec_body = Paragraph(content.replace("\n", "<br/><br/>"), body_style)

        box_table = Table([[sec_header], [sec_body]], colWidths=[540])
        box_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor(bg_col)),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor(border_col)),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(box_table)
        elements.append(Spacer(1, 6))

    # Active Medications & DDI Table (if any)
    if ddi_info.get("interactions"):
        inter_rows = [[
            Paragraph(f"<b>{t['col_pair']}</b>", body_style),
            Paragraph(f"<b>{t['col_severity']}</b>", body_style),
            Paragraph(f"<b>{t['col_mechanism']}</b>", body_style)
        ]]
        for item in ddi_info["interactions"]:
            inter_rows.append([
                Paragraph(" + ".join(item.get("drugs", [])), body_style),
                Paragraph(f"<font color='red'><b>{item.get('severity', 'warning').upper()}</b></font>", body_style),
                Paragraph(f"<b>{item.get('title', '')}:</b> {item.get('description', '')}<br/><i>{t['col_action']}</i> {item.get('action', '')}", body_style)
            ])
        inter_table = Table(inter_rows, colWidths=[120, 70, 350])
        inter_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#fee2e2')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#fca5a5')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#fecaca')),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(Spacer(1, 2))
        elements.append(Paragraph(f"<b>{t['ddi_table_title']}</b>", section_title_style))
        elements.append(Spacer(1, 3))
        elements.append(inter_table)
        elements.append(Spacer(1, 6))

    # Physician Sign-Off & Verification Block
    sign_table_data = [
        [
            Paragraph(f"<b>{t['sign_ai']}</b>", sub_header_style),
            Paragraph(f"<b>{t['sign_physician']}</b>", sub_header_style)
        ],
        [
            Paragraph(f"<b>{t['sign_hash']}</b> " + datetime.now().strftime("%f-%y%m%d%H%M%S"), sub_header_style),
            Paragraph(f"<b>{t['sign_license']}</b>", sub_header_style)
        ]
    ]
    sign_table = Table(sign_table_data, colWidths=[270, 270])
    sign_table.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 0.5, colors.HexColor('#9ca3af')),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    elements.append(Spacer(1, 4))
    elements.append(sign_table)

    # Footer Disclaimer
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(t["disclaimer"], ParagraphStyle('Disc', fontName=font_reg, parent=styles['Normal'], fontSize=6.5 if is_indic else 7, leading=8.5 if is_indic else 9, textColor=colors.HexColor('#6b7280'))))

    doc.build(elements)
    buffer.seek(0)
    return buffer

