#!/usr/bin/env python3
"""
ReasonMaster India - GK Ingestion Automated Validation Script
Verifies data integrity, bilingual parity, Hindi text cleanliness, provenance, and taxonomy conformance.
"""

import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_DIR = r"k:\Android App Files\PLAYSTORE APPS\Reasoning\website_reason_master"
QUESTIONS_MASTER_PATH = os.path.join(WORKSPACE_DIR, "src", "data", "gk", "questions", "gk_questions_master.json")
RAJASTHAN_JSON_PATH = os.path.join(WORKSPACE_DIR, "src", "data", "gk", "states", "rajasthan.json")

def validate():
    print("=== Validating Ingested GK Dataset ===")
    
    if not os.path.exists(QUESTIONS_MASTER_PATH):
        print(f"FAIL: {QUESTIONS_MASTER_PATH} not found!")
        sys.exit(1)
        
    with open(QUESTIONS_MASTER_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    questions = data.get("questions", [])
    total_q = len(questions)
    print(f"Total GK Questions in master bank: {total_q}")
    
    if total_q == 0:
        print("FAIL: No questions found in master bank!")
        sys.exit(1)
        
    seen_ids = set()
    errors = []
    
    # Kruti Dev detection regex
    kruti_pattern = re.compile(r'(jktLFkku|efJe|efŒe|Ûeesefš|DeeYet|<es$e|megcesueve)')
    # Broken character replacement symbol
    broken_pattern = re.compile(r'[\ufffd\uFFFD]')
    
    bilingual_count = 0
    provenance_count = 0
    national_count = 0
    rajasthan_count = 0
    verified_date_count = 0
    
    for idx, q in enumerate(questions):
        qid = q.get("id")
        # 1. Unique ID
        if not qid:
            errors.append(f"Q#{idx}: Missing question ID")
            continue
        if qid in seen_ids:
            errors.append(f"Q#{idx}: Duplicate question ID '{qid}'")
        seen_ids.add(qid)
        
        # 2. Domain & Category
        if q.get("domain") != "gk":
            errors.append(f"Q#{qid}: domain must be 'gk', got '{q.get('domain')}'")
            
        cat = q.get("gkCategory")
        if cat not in ("national", "state", "world"):
            errors.append(f"Q#{qid}: invalid gkCategory '{cat}'")
            
        if cat == "national":
            national_count += 1
            if q.get("stateId") == "rajasthan":
                errors.append(f"Q#{qid}: National question contaminated with stateId='rajasthan'!")
        elif cat == "state":
            if q.get("stateId") == "rajasthan":
                rajasthan_count += 1
                
        # 3. Question text
        q_en = q.get("questionText", "").strip()
        q_hi = q.get("questionTextHi", "").strip()
        if not q_en:
            errors.append(f"Q#{qid}: Missing English questionText")
            
        # 4. Options
        opts_en = q.get("options", [])
        opts_hi = q.get("optionsHi", [])
        
        if len(opts_en) != 4:
            errors.append(f"Q#{qid}: options length is {len(opts_en)}, expected 4")
            
        c_idx = q.get("correctIndex")
        if not isinstance(c_idx, int) or c_idx < 0 or c_idx > 3:
            errors.append(f"Q#{qid}: Invalid correctIndex '{c_idx}'")
        else:
            if c_idx < len(opts_en) and not opts_en[c_idx].strip():
                errors.append(f"Q#{qid}: Correct option in English is empty")
                
        # 5. Bilingual Check
        if q_hi and len(opts_hi) == 4:
            bilingual_count += 1
            if c_idx < len(opts_hi) and not opts_hi[c_idx].strip():
                errors.append(f"Q#{qid}: Correct option in Hindi is empty")
                
            # Hindi quality checks
            if kruti_pattern.search(q_hi):
                errors.append(f"Q#{qid}: Hindi question contains un-decoded Kruti Dev ASCII characters!")
            if broken_pattern.search(q_hi):
                errors.append(f"Q#{qid}: Hindi question contains broken replacement glyphs (\ufffd)!")
                
            for o_hi in opts_hi:
                if kruti_pattern.search(o_hi):
                    errors.append(f"Q#{qid}: Hindi option contains un-decoded Kruti Dev ASCII: {o_hi}")
                if broken_pattern.search(o_hi):
                    errors.append(f"Q#{qid}: Hindi option contains broken replacement glyphs: {o_hi}")
                    
        # 6. Provenance Check
        src = q.get("source")
        if src:
            provenance_count += 1
            if src.get("collection") not in ("indian_gk", "rajasthan_gk"):
                errors.append(f"Q#{qid}: Invalid source collection '{src.get('collection')}'")
            if not src.get("fileName"):
                errors.append(f"Q#{qid}: Missing source fileName")
                
        # 7. Verification date check
        if q.get("lastVerified"):
            verified_date_count += 1
            
    # Check Rajasthan profile
    if os.path.exists(RAJASTHAN_JSON_PATH):
        with open(RAJASTHAN_JSON_PATH, "r", encoding="utf-8") as f:
            raj_data = json.load(f)
        raj_mcqs = raj_data.get("mcqs", [])
        print(f"Rajasthan state profile MCQs: {len(raj_mcqs)}")
        if len(raj_mcqs) < 10:
            errors.append(f"Rajasthan profile has only {len(raj_mcqs)} MCQs, expected at least 10")
            
    print("--- VALIDATION RESULTS ---")
    print(f"Total Questions Evaluated: {total_q}")
    print(f"Unique Question IDs: {len(seen_ids)}")
    print(f"National GK Questions: {national_count}")
    print(f"Rajasthan State GK Questions: {rajasthan_count}")
    print(f"Bilingual (English + Hindi) Questions: {bilingual_count}")
    print(f"Questions with Provenance: {provenance_count}")
    print(f"Questions with lastVerified: {verified_date_count}")
    print(f"Validation Errors Found: {len(errors)}")
    
    if errors:
        print("\nERRORS DETECTED:")
        for e in errors[:20]:
            print(f"  - {e}")
        sys.exit(1)
        
    print("\n✓ ALL GK INGESTION VALIDATION CHECKS PASSED (0 ERRORS)!")
    return True

if __name__ == "__main__":
    validate()
