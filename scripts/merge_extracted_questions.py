import os
import json
import glob

WORKSPACE_DIR = r"k:\Android App Files\PLAYSTORE APPS\Reasoning\website_reason_master"
MASTER_JSON_PATH = os.path.join(WORKSPACE_DIR, "public", "data", "extracted_reasoning_questions_master.json")
QUESTIONS_DIR = os.path.join(WORKSPACE_DIR, "src", "data", "questions")

def main():
    if not os.path.exists(MASTER_JSON_PATH):
        print(f"Master JSON not found at {MASTER_JSON_PATH}")
        return

    with open(MASTER_JSON_PATH, "r", encoding="utf-8") as f:
        master_data = json.load(f)

    extracted_questions = master_data.get("questions", [])
    print(f"Loaded {len(extracted_questions)} questions from master JSON.")

    # Group extracted questions by topicId
    by_topic = {}
    for q in extracted_questions:
        tid = q["topicId"]
        if tid not in by_topic:
            by_topic[tid] = []
        by_topic[tid].append(q)

    # For each topic, load existing question bank, merge, and save
    topics_updated = 0
    total_new_added = 0

    for topic_file in os.listdir(QUESTIONS_DIR):
        if not topic_file.endswith(".json"):
            continue
        tid = topic_file.replace(".json", "")
        filepath = os.path.join(QUESTIONS_DIR, topic_file)

        with open(filepath, "r", encoding="utf-8") as f:
            existing_bank = json.load(f)

        existing_questions = existing_bank.get("questions", [])
        existing_ids = set(q.get("id") for q in existing_questions)

        new_for_this_topic = by_topic.get(tid, [])
        # Filter out duplicates
        deduped_new = [q for q in new_for_this_topic if q["id"] not in existing_ids]

        if deduped_new:
            # Place authentic PDF questions first
            merged_questions = deduped_new + existing_questions
            existing_bank["totalQuestions"] = len(merged_questions)
            existing_bank["questions"] = merged_questions

            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(existing_bank, f, indent=2, ensure_ascii=False)

            topics_updated += 1
            total_new_added += len(deduped_new)
            print(f"Updated {topic_file:<35}: added {len(deduped_new)} authentic questions (Total now: {len(merged_questions)})")

    print(f"\nSuccessfully merged {total_new_added} authentic questions into {topics_updated} topic files!")

if __name__ == "__main__":
    main()
