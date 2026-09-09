import os
import json

WORKSPACE_DIR = r"k:\Android App Files\PLAYSTORE APPS\Reasoning\website_reason_master"
MASTER_JSON_PATH = os.path.join(WORKSPACE_DIR, "public", "data", "extracted_reasoning_questions_master.json")
QUESTIONS_DIR = os.path.join(WORKSPACE_DIR, "src", "data", "questions")
OUTPUT_TOPIC_DIR = os.path.join(WORKSPACE_DIR, "src", "data", "extracted_by_topic")

def main():
    with open(MASTER_JSON_PATH, "r", encoding="utf-8") as f:
        master_data = json.load(f)
        
    master_qs = master_data.get("questions", [])
    print(f"Master questions: {len(master_qs)}")
    
    # Group by topicId
    by_topic = {}
    for q in master_qs:
        tid = q["topicId"]
        if tid not in by_topic:
            by_topic[tid] = []
        by_topic[tid].append(q)
        
    # Write to extracted_by_topic
    for tid, qlist in by_topic.items():
        tpath = os.path.join(OUTPUT_TOPIC_DIR, f"{tid}.json")
        with open(tpath, "w", encoding="utf-8") as f:
            json.dump({
                "topicId": tid,
                "topicName": qlist[0].get("topic", tid),
                "totalQuestions": len(qlist),
                "questions": qlist
            }, f, indent=2, ensure_ascii=False)
            
    # Clean and sync questions in src/data/questions/
    all_authentic_ids_for_topic = {tid: set(q["id"] for q in qlist) for tid, qlist in by_topic.items()}
    all_authentic_ids_global = set(q["id"] for q in master_qs)
    
    for fname in os.listdir(QUESTIONS_DIR):
        if not fname.endswith(".json"):
            continue
        tid = fname.replace(".json", "")
        fpath = os.path.join(QUESTIONS_DIR, fname)
        
        with open(fpath, "r", encoding="utf-8") as f:
            bank = json.load(f)
            
        existing_qs = bank.get("questions", [])
        
        # Keep synthetic questions (which are not in all_authentic_ids_global)
        synth_qs = [q for q in existing_qs if q["id"] not in all_authentic_ids_global]
        # Canonical authentic questions for this topic
        auth_qs = by_topic.get(tid, [])
        
        # Combined
        final_qs = auth_qs + synth_qs
        bank["totalQuestions"] = len(final_qs)
        bank["questions"] = final_qs
        
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(bank, f, indent=2, ensure_ascii=False)
            
        print(f"Synced {fname:<35}: {len(final_qs)} total ({len(auth_qs)} authentic)")

if __name__ == "__main__":
    main()
