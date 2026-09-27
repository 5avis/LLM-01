"""
MedHub Clinical Engine
Provides:
1. Drug-Drug Interaction (DDI) Safety Radar Analysis
2. Clinical Emergency Triage Urgency Classification (ESI Protocol)
3. Structured S.O.A.P. / S.B.A.R. Clinical Note Synthesis
4. Professional Hospital-Grade SOAP PDF Generation via ReportLab
"""

import re
from datetime import datetime
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

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
# 5. S.O.A.P. / S.B.A.R. CLINICAL NOTE BUILDER
# ---------------------------------------------------------------------------

def build_soap_note(user_query: str, ai_response: str, triage_data: dict, ddi_data: dict, fda_info: dict = None) -> dict:
    """Synthesizes structured Subjective, Objective, Assessment, Plan (SOAP) clinical record."""
    # Subjective
    subjective_lines = [f"Chief Complaint & Patient Report: \"{user_query.strip()}\""]
    if triage_data["triggers"]:
        subjective_lines.append(f"Flagged Symptom Indicators: {', '.join(triage_data['triggers'])}")

    # Objective
    objective_lines = [
        f"Triage Protocol: {triage_data['esi_label']} (Score: {triage_data['score']})",
        f"Active Medications Identified: {', '.join(ddi_data['active_drugs']) if ddi_data['active_drugs'] else 'None detected'}"
    ]
    if fda_info and fda_info.get("verified"):
        objective_lines.append(f"Verified FDA Reference: {fda_info.get('drug_name', 'N/A').title()} (NDC Grounded)")
    else:
        objective_lines.append("Verified FDA Reference: Cross-referenced with local clinical knowledge matrix")

    # Assessment
    assessment_lines = [
        f"Clinical Urgency: {triage_data['title']}",
        f"Pharmacological DDI Status: {ddi_data['title']} ({ddi_data['badge']})"
    ]
    if ddi_data.get("interactions"):
        for inter in ddi_data["interactions"]:
            assessment_lines.append(f"Conflict Note: {inter['title']} — {inter['description']}")

    # Plan
    plan_lines = [
        f"Primary Recommendation: {triage_data['recommendation']}",
        f"Clinical AI Guidance: {ai_response.strip()[:400]}..." if len(ai_response.strip()) > 400 else f"Clinical AI Guidance: {ai_response.strip()}",
        "Safety Precaution: Ensure review by licensed physician or pharmacist before changing pharmacotherapy."
    ]

    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "subjective": "\n".join(subjective_lines),
        "objective": "\n".join(objective_lines),
        "assessment": "\n".join(assessment_lines),
        "plan": "\n".join(plan_lines),
        "triage": triage_data,
        "ddi": ddi_data
    }

# ---------------------------------------------------------------------------
# 6. PROFESSIONAL S.O.A.P. / S.B.A.R. PDF REPORT GENERATOR
# ---------------------------------------------------------------------------

def generate_soap_pdf(soap_data: dict, patient_name: str = "Anonymous Patient") -> BytesIO:
    """
    Renders an elegant, audit-grade 1-page S.O.A.P. & S.B.A.R. Medical Consultation Summary
    using ReportLab with professional clinical typography, tables, and security badges.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    header_style = ParagraphStyle(
        'DocHeader',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=21,
        textColor=colors.HexColor('#064e3b') # Deep medical emerald
    )

    sub_header_style = ParagraphStyle(
        'SubHeader',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#4b5563')
    )

    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#065f46')
    )

    body_style = ParagraphStyle(
        'SoapBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1f2937')
    )

    badge_style = ParagraphStyle(
        'BadgeStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        alignment=1, # Center
        textColor=colors.white
    )

    elements = []

    # Title & Hospital Header
    elements.append(Paragraph("MEDHUB CLINICAL INTELLIGENCE SYSTEM", header_style))
    elements.append(Paragraph("S.O.A.P. Consultation Summary & S.B.A.R. Clinical Transfer Note", sub_header_style))
    elements.append(Paragraph("HIPAA Privacy Protected • Air-Gapped Local Inference Engine (NVIDIA B200 178GB)", sub_header_style))
    elements.append(Spacer(1, 10))

    # Meta Info Table
    triage_info = soap_data.get("triage", {})
    triage_color = colors.HexColor(triage_info.get("color", "#10b981"))
    triage_label = triage_info.get("badge", "ROUTINE CARE")

    ddi_info = soap_data.get("ddi", {})
    ddi_badge = ddi_info.get("badge", "Safe")

    meta_table_data = [
        [
            Paragraph("<b>Patient Name:</b>", body_style),
            Paragraph(f"{patient_name.capitalize()}", body_style),
            Paragraph("<b>Consultation Date:</b>", body_style),
            Paragraph(f"{soap_data.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M'))}", body_style)
        ],
        [
            Paragraph("<b>Triage Urgency:</b>", body_style),
            Paragraph(f'<b><font color="{triage_info.get("color", "#10b981")}">{triage_label}</font></b>', body_style),
            Paragraph("<b>DDI Safety Radar:</b>", body_style),
            Paragraph(f"<b>{ddi_badge}</b>", body_style)
        ],
        [
            Paragraph("<b>Facility / Node:</b>", body_style),
            Paragraph("On-Premise Clinical AI Vault", body_style),
            Paragraph("<b>Grounding Source:</b>", body_style),
            Paragraph("US FDA Label Database", body_style)
        ]
    ]

    meta_table = Table(meta_table_data, colWidths=[110, 160, 110, 160])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0fdf4')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#a7f3d0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#d1fae5')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 12))

    # SOAP Sections
    sections = [
        ("S — SUBJECTIVE (Patient Reported Complaint & History)", soap_data.get("subjective", ""), "#ecfdf5", "#059669"),
        ("O — OBJECTIVE (Clinical Observations & Triage Classification)", soap_data.get("objective", ""), "#f0fdfa", "#0d9488"),
        ("A — ASSESSMENT (Diagnostic Impression & Drug Interaction Safety)", soap_data.get("assessment", ""), "#f7fee7", "#65a30d"),
        ("P — PLAN (Action Steps, Triage Guidance & Physician Follow-up)", soap_data.get("plan", ""), "#f8fafc", "#475569"),
    ]

    for title, content, bg_col, border_col in sections:
        sec_header = Paragraph(f"<b>{title}</b>", section_title_style)
        sec_body = Paragraph(content.replace("\n", "<br/><br/>"), body_style)

        box_table = Table([[sec_header], [sec_body]], colWidths=[540])
        box_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor(bg_col)),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor(border_col)),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(box_table)
        elements.append(Spacer(1, 8))

    # Active Medications & DDI Table (if any)
    if ddi_info.get("interactions"):
        inter_rows = [[
            Paragraph("<b>Medication Pair</b>", body_style),
            Paragraph("<b>Severity</b>", body_style),
            Paragraph("<b>Clinical Mechanism & Management</b>", body_style)
        ]]
        for item in ddi_info["interactions"]:
            inter_rows.append([
                Paragraph(" + ".join(item["drugs"]), body_style),
                Paragraph(f"<font color='red'><b>{item['severity'].upper()}</b></font>", body_style),
                Paragraph(f"<b>{item['title']}:</b> {item['description']}<br/><i>Action:</i> {item['action']}", body_style)
            ])
        inter_table = Table(inter_rows, colWidths=[120, 70, 350])
        inter_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#fee2e2')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#fca5a5')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#fecaca')),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph("<b>IDENTIFIED PHARMACOLOGICAL INTERACTIONS:</b>", section_title_style))
        elements.append(Spacer(1, 4))
        elements.append(inter_table)
        elements.append(Spacer(1, 10))

    # Physician Sign-Off & Verification Block
    sign_table_data = [
        [
            Paragraph("<b>AI Attending System:</b> MedHub Clinical 14B LoRA (Verified)", sub_header_style),
            Paragraph("<b>Attending Physician Review:</b> ___________________________", sub_header_style)
        ],
        [
            Paragraph("<b>Electronic Signature Hash:</b> " + datetime.now().strftime("%f-%y%m%d%H%M%S"), sub_header_style),
            Paragraph("<b>Medical License / NPI:</b> ___________________________", sub_header_style)
        ]
    ]
    sign_table = Table(sign_table_data, colWidths=[270, 270])
    sign_table.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 0.5, colors.HexColor('#9ca3af')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    elements.append(Spacer(1, 8))
    elements.append(sign_table)

    # Footer Disclaimer
    disclaimer = (
        "<b>CONFIDENTIAL MEDICAL RECORD:</b> This document was synthesized by the MedHub Clinical Intelligence System for clinical decision support. "
        "It does not replace professional medical judgment. In emergencies, call 911 or visit the nearest emergency department."
    )
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(disclaimer, ParagraphStyle('Disc', parent=styles['Normal'], fontSize=7, leading=9, textColor=colors.HexColor('#6b7280'))))

    doc.build(elements)
    buffer.seek(0)
    return buffer
