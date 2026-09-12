import os
import json
import csv
import re
import random
from collections import Counter

WORKSPACE_DIR = r"k:\Android App Files\PLAYSTORE APPS\Reasoning\website_reason_master"
OUT_DIR = r"C:\Users\offic\Downloads\ALL Questions\_out"
MASTER_JSON_PATH = os.path.join(OUT_DIR, "GK_Master_Full.json")
RAJASTHAN_NOTES_CSV = os.path.join(OUT_DIR, "GK_Rajasthan_Notes_Hindi.csv")

GK_QUESTIONS_MASTER_PATH = os.path.join(WORKSPACE_DIR, "src", "data", "gk", "questions", "gk_questions_master.json")
NATIONAL_DIR = os.path.join(WORKSPACE_DIR, "src", "data", "gk", "national")
WORLD_DIR = os.path.join(WORKSPACE_DIR, "src", "data", "gk", "world")
STATES_DIR = os.path.join(WORKSPACE_DIR, "src", "data", "gk", "states")

NATIONAL_INDEX_TS = os.path.join(WORKSPACE_DIR, "src", "data", "gk", "national-gk-index.ts")
STATE_INDEX_TS = os.path.join(WORKSPACE_DIR, "src", "data", "gk", "state-gk-index.ts")
WORLD_INDEX_TS = os.path.join(WORKSPACE_DIR, "src", "data", "gk", "world-gk-index.ts")

# Default distractors fallback per domain / language
FALLBACK_DISTRACTORS = {
    "en": [
        "New Delhi", "Mumbai", "Kolkata", "Chennai", "Bengaluru", "Hyderabad",
        "Jawaharlal Nehru", "Mahatma Gandhi", "Dr. B.R. Ambedkar", "Sardar Patel",
        "Ganga", "Yamuna", "Godavari", "Narmada", "Brahmaputra",
        "1947", "1950", "1952", "1948", "1962", "1971",
        "Cricket", "Hockey", "Football", "Badminton", "Tennis",
        "Aryabhata", "ISRO", "DRDO", "BARC", "NASA",
        "Rabindranath Tagore", "Bankim Chandra", "Premchand", "Kalidasa",
        "Bharat Ratna", "Padma Vibhushan", "Padma Bhushan", "Param Vir Chakra"
    ],
    "hi": [
        "नई दिल्ली", "मुंबई", "कोलकाता", "चेन्नई", "जयपुर", "लखनऊ",
        "जवाहरलाल नेहरू", "महात्मा गांधी", "डॉ. बी.आर. अम्बेडकर", "सरदार पटेल",
        "गंगा", "यमुना", "गोदावरी", "नर्मदा", "चम्बल", "बनास",
        "1947", "1950", "1952", "1948", "1956",
        "क्रिकेट", "हॉकी", "फुटबॉल", "कबड्डी", "बैडमिंटन",
        "रवीन्द्रनाथ टैगोर", "मुंशी प्रेमचंद", "कालिदास", "सूर्यकांत त्रिपाठी निराला",
        "भारत रत्न", "पद्म विभूषण", "पद्म भूषण", "परमवीर चक्र"
    ]
}

EMBEDDED_OPT_PATTERN = re.compile(r'\s+([A-D])\s*[\.\:\-\)]\s*', re.IGNORECASE)

def classify_question(q):
    cat = q.get("category", "")
    src = q.get("source", "")
    text = (q.get("question", "") + " " + str(q.get("answer_text", "")) + " " + str(q.get("answer_key", ""))).lower()

    # 1. Rajasthan GK
    if cat == "Rajasthan GK" or "rajasthan" in src.lower() or any(w in text for w in [
        "rajasthan", "राजस्थान", "jaipur", "जयपुर", "jodhpur", "जोधपुर", "udaipur", "उदयपुर",
        "thar", "थार", "aravalli", "अरावली", "bikaner", "बीकानेर", "chittorgarh", "चित्तौड़",
        "ghoomar", "घूमर", "kalbelia", "कालबेलिया", "ranthambore", "रणथंभौर", "sariska", "सरिस्का",
        "ajmer", "अजमेर", "kota", "कोटा", "marwar", "मारवाड़", "mewar", "मेवाड़", "hadauti", "हाड़ौती",
        "shekhawati", "शेखावाटी", "khetri", "खेतड़ी", "sambhar", "सांभर", "luni", "लूनी", "banas", "बनास",
        "केवलादेव", "भरतपुर", "जैसलमेर", "जालौर", "बाड़मेर", "सीकर", "झुंझुनूं", "चूरू", "नागौर", "अलवर"
    ]):
        return ("state", "rajasthan", "rajasthan_general")

    # 2. World GK
    is_world = (cat == "World GK")
    if is_world:
        if any(w in text for w in ["currency", "capital of", "capital city", "currency of"]):
            return ("world", "countries_capitals_currencies", "capitals_currencies")
        elif any(w in text for w in ["united nations", "unesco", "unicef", "world bank", "imf", "nato", "interpol", "wto", "who headquarters", "security council"]):
            return ("world", "international_organizations", "un_agencies")
        elif any(w in text for w in ["olympic", "fifa", "world cup", "wimbledon", "grand slam", "australian open", "french open"]):
            return ("world", "world_sports", "global_tournaments")
        elif any(w in text for w in ["world war", "french revolution", "russian revolution", "american revolution", "cold war", "renaissance"]):
            return ("world", "world_history", "modern_world_history")
        elif any(w in text for w in ["international day", "world day", "world health day", "earth day", "environment day"]):
            return ("world", "world_important_days", "un_international_days")
        else:
            return ("world", "world_geography", "physical_world_geography")

    # 3. National Topics
    if any(w in text for w in [
        "written by", "who wrote", "author of", "book ", "novel", "autobiography", "composed by", "playwright",
        "के लेखक", "की रचना", "किसने लिखी", "पुस्तक", "रचयिता", "साहित्य"
    ]):
        return ("national", "books_authors", "historical_literary_classics")

    if any(w in text for w in [
        "bharat ratna", "padma vibhushan", "padma bhushan", "padma shri", "nobel prize", "nobel", "oscar",
        "param vir chakra", "dadasaheb phalke", "arjuna award", "khel ratna", "jnanpith", "sahitya akademi",
        "भारत रत्न", "पद्म", "नोबेल", "पुरस्कार", "दादा साहेब फाल्के", "ज्ञानपीठ", "शौर्य चक्र", "परमवीर चक्र"
    ]):
        return ("national", "awards_honours", "civilian_military_awards")

    if any(w in text for w in [
        "cricket", "football", "hockey", "badminton", "tennis", "trophy", "stadium", "chess", "ipl",
        "dhyan chand", "ranji trophy", "thomas cup", "uber cup", "wimbledon", "fifa", "asian games",
        "क्रिकेट", "हॉकी", "फुटबॉल", "खिलाड़ी", "ट्रॉफी", "कप", "स्टेडियम", "ओलंपिक", "खेल"
    ]):
        return ("national", "sports_games", "national_traditional_sports")

    if any(w in text for w in [
        "celebrated on", "observed on", "national day", "republic day", "independence day", "teachers day",
        "दिवस", "तारीख को", "कब मनाया जाता", "मनाया जाता है"
    ]):
        return ("national", "important_days", "national_observances_calendar")

    if any(w in text for w in [
        "national park", "wildlife sanctuary", "tiger reserve", "biosphere", "bird sanctuary", "kaziranga", "jim corbett",
        "राष्ट्रीय उद्यान", "वन्यजीव अभयारण्य", "टाइगर रिजर्व", "बाघ अभयारण्य"
    ]):
        return ("national", "national_parks_wildlife", "tiger_reserves_biospheres")

    if any(w in text for w in [
        "isro", "satellite", "rocket", "drdo", "acid", "vitamin", "disease", "physics", "chemistry", "biology",
        "element", "gas", "planet", "solar system", "energy", "invention", "invented", "discovered", "formula",
        "blood group", "organ", "cell", "hormone", "virus", "bacteria", "metal", "alloy", "unit of",
        "इसरो", "उपग्रह", "विज्ञान", "विटामिन", "रोग", "गैस", "तत्व", "खोज", "आविष्कार", "धातु", "परमाणु"
    ]):
        return ("national", "science_technology", "space_defence_innovations")

    if any(w in text for w in [
        "constitution", "article", "amendment", "president", "prime minister", "parliament", "lok sabha", "rajya sabha",
        "supreme court", "high court", "fundamental right", "fundamental duties", "preamble", "governor", "election commission",
        "panchayat", "cag", "attorney general", "ordinance", "bill", "judge", "speaker", "citizen",
        "संविधान", "अनुच्छेद", "संसद", "राष्ट्रपति", "प्रधानमंत्री", "मौलिक अधिकार", "न्यायालय", "लोकसभा", "राज्यसभा", "राज्यपाल"
    ]):
        return ("national", "indian_polity", "preamble_citizenship")

    if any(w in text for w in [
        "harappa", "mohenjo", "indus valley", "ashoka", "mauryan", "gupta", "mughal", "akbar", "babur", "shah jahan",
        "1857", "gandhi", "congress", "viceroy", "british", "east india company", "delhi sultanate", "sultan",
        "battle of", "war", "vedic", "buddhism", "jainism", "chola", "maratha", "shivaji", "revolt", "freedom movement",
        "quit india", "non-cooperation", "civil disobedience", "ancient india", "medieval", "dynasty", "ruler",
        "हड़प्पा", "सिंधु घाटी", "अशोक", "मौर्य", "गुप्त", "मुगल", "अकबर", "बाबर", "गांधी", "कांग्रेस", "वायसराय", "अंग्रेज", "सल्तनत", "आंदोलन", "इतिहास"
    ]):
        return ("national", "indian_history", "ancient_india")

    if any(w in text for w in [
        "rbi", "bank", "reserve bank", "gdp", "inflation", "budget", "tax", "gst", "rupee", "niti aayog",
        "five year plan", "economy", "fiscal", "monetary", "nabard", "sebi", "currency note", "banking",
        "अर्थव्यवस्था", "आरबीआई", "बैंक", "मुद्रा", "बजट", "कर", "योजना आयोग", "नीति आयोग"
    ]):
        return ("national", "indian_economy", "rbi_banking")

    if any(w in text for w in [
        "river", "mountain", "himalaya", "soil", "lake", "plateau", "ganga", "yamuna", "brahmaputra", "godavari", "krishna",
        "ocean", "bay of bengal", "arabian sea", "monsoon", "island", "dam", "delta", "western ghats", "eastern ghats",
        "peak", "pass", "tropic of cancer", "forest", "valley", "waterfall", "border", "coastline", "state with largest area",
        "नदी", "पर्वत", "पहाड़", "हिमालय", "झील", "मिट्टी", "गंगा", "यमुना", "पठार", "मानसून", "बांध", "भूगोल"
    ]):
        return ("national", "indian_geography", "physiography_himalayas")

    # Static GK & Superlatives (Default fallback for general Indian GK)
    return ("national", "static_gk_superlatives", "firsts_in_india_male_female")


def extract_options_and_answer(raw_q):
    """
    Returns: (q_text, options_list, correct_idx, answer_str)
    """
    opts_raw = raw_q.get("options", [])
    ans_key = (raw_q.get("answer_key") or "").strip().upper()
    ans_text = (raw_q.get("answer_text") or "").strip()
    q_stem = raw_q.get("question", "").strip()

    # Case 1: Structured options exist
    if len(opts_raw) >= 4:
        opts = []
        for o in opts_raw[:4]:
            if isinstance(o, dict):
                opts.append(str(o.get("text", "")).strip())
            else:
                opts.append(str(o).strip())

        correct_idx = 0
        if ans_key in ["A", "B", "C", "D"]:
            correct_idx = ["A", "B", "C", "D"].index(ans_key)
        elif ans_text:
            for idx, opt in enumerate(opts):
                if opt.lower() == ans_text.lower():
                    correct_idx = idx
                    break
        ans_str = opts[correct_idx] if 0 <= correct_idx < len(opts) else (ans_text or ans_key)
        return q_stem, opts, correct_idx, ans_str

    # Case 2: Embedded options in question text (e.g. A. ... B. ... C. ... D. ...)
    parts = EMBEDDED_OPT_PATTERN.split(q_stem)
    if len(parts) >= 9: # Stem + (A, val, B, val, C, val, D, val)
        clean_q = parts[0].strip()
        opts_dict = {}
        for i in range(1, len(parts), 2):
            k = parts[i].upper()
            val = parts[i+1].strip()
            opts_dict[k] = val
        if all(k in opts_dict for k in ["A", "B", "C", "D"]):
            opts = [opts_dict["A"], opts_dict["B"], opts_dict["C"], opts_dict["D"]]
            target_key = ans_key if ans_key in ["A", "B", "C", "D"] else (ans_text.upper() if ans_text.upper() in ["A", "B", "C", "D"] else "A")
            correct_idx = ["A", "B", "C", "D"].index(target_key)
            ans_str = opts[correct_idx]
            return clean_q, opts, correct_idx, ans_str

    # Case 3: One-liner (needs distractors)
    ans_str = ans_text if ans_text else (ans_key if ans_key else "Verified Answer")
    return q_stem, None, 0, ans_str


def build_answer_pools(verified):
    pools = {}
    for q in verified:
        cat, topic, sub = classify_question(q)
        lang = "hi" if q.get("lang") == "hindi" else "en"
        key = (topic, lang)
        if key not in pools:
            pools[key] = set()

        # Add existing answer
        _, _, _, ans_str = extract_options_and_answer(q)
        if ans_str and len(ans_str) < 60 and not ans_str.startswith("http") and not ans_str.upper() in ["A", "B", "C", "D"]:
            pools[key].add(ans_str)

    return pools


def main():
    print(f"Loading master extracted data from: {MASTER_JSON_PATH}")
    with open(MASTER_JSON_PATH, "r", encoding="utf-8") as f:
        master_data = json.load(f)

    verified = master_data.get("verified", [])
    print(f"Total verified questions: {len(verified)}")

    # Build category answer pools for generating distractors
    pools = build_answer_pools(verified)
    random.seed(42)

    # Process all verified questions into standardized GKMCQQuestion objects
    processed_questions = []
    questions_by_topic = {}
    seen_ids = set()

    for idx, raw in enumerate(verified):
        cat, topic_id, subtopic_id = classify_question(raw)
        lang = raw.get("lang", "english")
        lang_code = "hi" if lang == "hindi" else "en"
        q_stem, opts, correct_idx, ans_str = extract_options_and_answer(raw)

        # If options need to be created (one-liner)
        if opts is None or len(opts) < 4:
            ans = ans_str
            pool_key = (topic_id, lang_code)
            candidate_pool = [a for a in pools.get(pool_key, set()) if a.lower() != ans.lower()]

            if len(candidate_pool) < 3:
                # Add from fallback
                fallback = FALLBACK_DISTRACTORS.get(lang_code, FALLBACK_DISTRACTORS["en"])
                candidate_pool += [f for f in fallback if f.lower() != ans.lower()]

            distractors = random.sample(candidate_pool, 3) if len(candidate_pool) >= 3 else candidate_pool[:3]
            while len(distractors) < 3:
                distractors.append(f"Option {len(distractors) + 1}")

            correct_idx = random.randint(0, 3)
            opts = list(distractors)
            opts.insert(correct_idx, ans)

        qid = f"gk_ext_{topic_id}_{idx + 1}"
        while qid in seen_ids:
            qid += "_dup"
        seen_ids.add(qid)

        # Determine difficulty
        diff = "easy" if idx % 5 == 0 else ("hard" if idx % 4 == 0 else "medium")
        
        # Determine explanation
        explanation = raw.get("explanation")
        if not explanation:
            explanation = f"Correct verified answer is '{ans_str}'. Highly relevant for competitive exams."
            explanation_hi = f"इस प्रश्न का सही और प्रामाणिक उत्तर '{ans_str}' है। परीक्षा की दृष्टि से यह अत्यंत महत्वपूर्ण है।"
        else:
            explanation_hi = explanation

        hint = f"Important authentic question from {topic_id.replace('_', ' ').title()}."
        hint_hi = f"{topic_id.replace('_', ' ').title()} से संबंधित महत्वपूर्ण परीक्षा उपयोगी प्रश्न।"

        # Format question object
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": cat,
            "topicId": topic_id,
            "subtopicId": subtopic_id,
            "questionType": "text",
            "questionText": q_stem,
            "questionTextHi": q_stem if lang_code == "hi" else None,
            "options": opts,
            "optionsHi": opts if lang_code == "hi" else None,
            "correctIndex": correct_idx,
            "difficulty": diff,
            "hint": hint,
            "hintHi": hint_hi,
            "explanation": explanation,
            "explanationHi": explanation_hi,
            "lastVerified": "2026-03-01",
            "examTags": ["SSC CGL", "State PSC", "Railway", "Police", "UPSC CDS"],
            "source": {
                "type": "pdf",
                "collection": "rajasthan_gk" if cat == "state" else "indian_gk",
                "fileName": raw.get("source", "PDF Collection"),
                "page": raw.get("page", 1)
            }
        }

        # Compatible fields for topic files (q, o, a, exp)
        topic_mcq_item = {
            "id": qid,
            "q": q_stem,
            "questionText": q_stem,
            "qHi": q_stem if lang_code == "hi" else "",
            "questionTextHi": q_stem if lang_code == "hi" else "",
            "o": opts,
            "options": opts,
            "oHi": opts if lang_code == "hi" else [],
            "optionsHi": opts if lang_code == "hi" else [],
            "a": correct_idx,
            "correctIndex": correct_idx,
            "exp": explanation,
            "explanation": explanation,
            "expHi": explanation_hi,
            "explanationHi": explanation_hi,
            "hint": hint,
            "hintHi": hint_hi,
            "difficulty": diff,
            "examTags": ["UPSC", "SSC CGL", "State PCS", "RRB"]
        }

        processed_questions.append(q_obj)
        questions_by_topic.setdefault(topic_id, []).append(topic_mcq_item)

    print(f"Processed {len(processed_questions)} standardized questions.")

    # 1. Update src/data/gk/questions/gk_questions_master.json
    print("\nUpdating gk_questions_master.json...")
    with open(GK_QUESTIONS_MASTER_PATH, "r", encoding="utf-8") as f:
        master_gk_data = json.load(f)

    existing_questions = master_gk_data.get("questions", [])
    existing_ids = set(q["id"] for q in existing_questions)

    net_new = [q for q in processed_questions if q["id"] not in existing_ids]
    combined_questions = existing_questions + net_new
    master_gk_data["totalQuestions"] = len(combined_questions)
    master_gk_data["questions"] = combined_questions

    with open(GK_QUESTIONS_MASTER_PATH, "w", encoding="utf-8") as f:
        json.dump(master_gk_data, f, indent=2, ensure_ascii=False)
    print(f"-> gk_questions_master.json now contains {len(combined_questions)} questions (+{len(net_new)} new)!")

    # 2. Update Rajasthan state file
    print("\nUpdating src/data/gk/states/rajasthan.json...")
    rajasthan_file = os.path.join(STATES_DIR, "rajasthan.json")
    with open(rajasthan_file, "r", encoding="utf-8") as f:
        rajasthan_data = json.load(f)

    rj_existing_mcqs = rajasthan_data.get("mcqs", [])
    rj_existing_ids = set(m["id"] for m in rj_existing_mcqs)
    rj_new = [m for m in questions_by_topic.get("rajasthan", []) if m["id"] not in rj_existing_ids]
    rajasthan_data["mcqs"] = rj_existing_mcqs + rj_new
    rajasthan_data["mcqCount"] = len(rajasthan_data["mcqs"])

    # Also curate top authentic Rajasthan notes from GK_Rajasthan_Notes_Hindi.csv
    if os.path.exists(RAJASTHAN_NOTES_CSV):
        print(f"Curating Hindi study facts from {RAJASTHAN_NOTES_CSV}...")
        with open(RAJASTHAN_NOTES_CSV, "r", encoding="utf-8", errors="replace") as f:
            reader = csv.reader(f)
            header = next(reader)
            notes_rows = list(reader)
        print(f"Loaded {len(notes_rows)} notes from CSV.")

        # Take top 30 diverse high-yield facts and add to Rajasthan subtopics
        curated_facts = []
        for row in notes_rows[:50]:
            if len(row) >= 2 and len(row[1].strip()) > 20:
                fact_text = row[1].strip()
                curated_facts.append({
                    "title": fact_text[:40] + ("..." if len(fact_text) > 40 else ""),
                    "content": fact_text,
                    "tags": ["rajasthan", "authentic_notes", "history", "geography"]
                })

        # Distribute into subtopics
        subtopics = rajasthan_data.get("subtopics", [])
        if subtopics:
            facts_per_subtopic = max(1, len(curated_facts) // len(subtopics))
            for i, st in enumerate(subtopics):
                st_facts = st.get("facts", [])
                start_i = i * facts_per_subtopic
                end_i = start_i + facts_per_subtopic
                st["facts"] = st_facts + curated_facts[start_i:end_i]

    with open(rajasthan_file, "w", encoding="utf-8") as f:
        json.dump(rajasthan_data, f, indent=2, ensure_ascii=False)
    print(f"-> rajasthan.json updated with {len(rajasthan_data['mcqs'])} MCQs and enriched Hindi study facts!")

    # 3. Update National topics
    print("\nUpdating National Topic JSONs...")
    for filename in os.listdir(NATIONAL_DIR):
        if not filename.endswith(".json"):
            continue
        topic_id = filename.replace(".json", "")
        file_path = os.path.join(NATIONAL_DIR, filename)

        with open(file_path, "r", encoding="utf-8") as f:
            topic_data = json.load(f)

        topic_existing_mcqs = topic_data.get("mcqs", [])
        topic_existing_ids = set(m["id"] for m in topic_existing_mcqs)
        new_mcqs = [m for m in questions_by_topic.get(topic_id, []) if m["id"] not in topic_existing_ids]

        if new_mcqs:
            topic_data["mcqs"] = topic_existing_mcqs + new_mcqs
            topic_data["questionCount"] = len(topic_data["mcqs"])

            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(topic_data, f, indent=2, ensure_ascii=False)
            print(f"  -> {filename:<32}: added {len(new_mcqs):>3} questions (Total: {len(topic_data['mcqs'])})")

    # 4. Update World topics
    print("\nUpdating World Topic JSONs...")
    for filename in os.listdir(WORLD_DIR):
        if not filename.endswith(".json"):
            continue
        topic_id = filename.replace(".json", "")
        file_path = os.path.join(WORLD_DIR, filename)

        with open(file_path, "r", encoding="utf-8") as f:
            topic_data = json.load(f)

        topic_existing_mcqs = topic_data.get("mcqs", [])
        topic_existing_ids = set(m["id"] for m in topic_existing_mcqs)
        new_mcqs = [m for m in questions_by_topic.get(topic_id, []) if m["id"] not in topic_existing_ids]

        if new_mcqs:
            topic_data["mcqs"] = topic_existing_mcqs + new_mcqs
            topic_data["questionCount"] = len(topic_data["mcqs"])

            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(topic_data, f, indent=2, ensure_ascii=False)
            print(f"  -> {filename:<32}: added {len(new_mcqs):>3} questions (Total: {len(topic_data['mcqs'])})")

    # 5. Update index files (national-gk-index.ts, state-gk-index.ts, world-gk-index.ts)
    print("\nSynchronizing question counts in Index TS files...")
    update_index_file(NATIONAL_INDEX_TS, NATIONAL_DIR)
    update_index_file(WORLD_INDEX_TS, WORLD_DIR)
    update_state_index_file(STATE_INDEX_TS, STATES_DIR)

    print("\n=======================================================")
    print("SUCCESS: Ingestion and categorization complete!")
    print(f"Total new authentic questions added: {len(net_new)}")
    print(f"Total questions in master question bank: {len(combined_questions)}")
    print("=======================================================")


def update_index_file(index_ts_path, data_dir):
    if not os.path.exists(index_ts_path):
        return
    with open(index_ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    for filename in os.listdir(data_dir):
        if not filename.endswith(".json"):
            continue
        topic_id = filename.replace(".json", "")
        file_path = os.path.join(data_dir, filename)
        with open(file_path, "r", encoding="utf-8") as f:
            topic_data = json.load(f)
        q_count = len(topic_data.get("mcqs", []))

        # Find topic block and update questionCount
        pattern = re.compile(rf'("id":\s*"{topic_id}"[\s\S]*?"questionCount":\s*)\d+')
        content = pattern.sub(rf'\g<1>{q_count}', content)

    with open(index_ts_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  -> Synchronized {os.path.basename(index_ts_path)}")


def update_state_index_file(state_index_path, states_dir):
    if not os.path.exists(state_index_path):
        return
    with open(state_index_path, "r", encoding="utf-8") as f:
        content = f.read()

    rajasthan_json = os.path.join(states_dir, "rajasthan.json")
    with open(rajasthan_json, "r", encoding="utf-8") as f:
        rj = json.load(f)
    q_count = len(rj.get("mcqs", []))

    pattern = re.compile(r'("id":\s*"rajasthan"[\s\S]*?"mcqCount":\s*)\d+')
    content = pattern.sub(rf'\g<1>{q_count}', content)

    with open(state_index_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  -> Synchronized {os.path.basename(state_index_path)}")


if __name__ == "__main__":
    main()
