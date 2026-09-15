import requests
import re

STOPWORDS = {
    "the", "is", "am", "and", "for", "of", "to", "my", "me", "what", "how",
    "should", "take", "with", "food", "before", "after", "can", "have", "has",
    "will", "would", "could", "does", "did", "was", "were", "are", "this",
    "that", "when", "where", "why", "who", "which", "your", "you", "i",
    "feeling", "feel", "since", "days", "day", "week", "weeks",
    "months", "month", "year", "years", "old", "male", "female", "patient",
    "doctor", "hello", "hi", "please", "thanks", "thank", "help"
}

def extract_candidate_words(text):
    """Extract likely drug-name candidates from patient text."""
    words = re.findall(r'\b[a-zA-Z]+\b', text)
    candidates = []
    seen = set()
    for w in words:
        w_lower = w.lower()
        if len(w) > 3 and w_lower not in STOPWORDS and w_lower not in seen:
            candidates.append(w_lower)
            seen.add(w_lower)
    return candidates

def _query_fda(field, value, exact=True):
    """Query openFDA. exact=True uses .exact matching, otherwise loose matching."""
    url = "https://api.fda.gov/drug/label.json"
    field_query = f"openfda.{field}.exact" if exact else f"openfda.{field}"
    params = {"search": f'{field_query}:"{value}"', "limit": 5}
    try:
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if "results" in data and len(data["results"]) > 0:
                return data["results"]
    except Exception:
        pass
    return None

def get_drug_info(drug_name):
    """
    Look up a drug by generic name first, then brand name.
    Prefers results where the drug appears alone (not in combination products).
    Returns a dict of verified facts, or None if not found.
    """
    for field in ["generic_name", "brand_name"]:
        results = _query_fda(field, drug_name, exact=False)
        if results:
            best = min(results, key=lambda r: len(str(r.get("openfda", {}).get(field, [""]))))
            return {
                "matched_name": drug_name,
                "matched_field": field,
                "dosage": best.get("dosage_and_administration", ["Not available"])[0],
                "warnings": best.get("warnings", ["Not available"])[0],
                "interactions": best.get("drug_interactions", ["Not available"])[0],
                "usage": best.get("indications_and_usage", ["Not available"])[0],
            }
    return None

def find_drug_in_text(text, max_candidates=8):
    """
    Scan patient text for a real drug name using openFDA as the source of truth.
    Stops at the first confirmed match. Limits checks to avoid excessive API calls.
    Returns (drug_name, drug_info) or (None, None).
    """
    candidates = extract_candidate_words(text)[:max_candidates]
    for word in candidates:
        info = get_drug_info(word)
        if info:
            return word, info
    return None, None
