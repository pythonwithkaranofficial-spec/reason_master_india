import sys
import os
import glob
import json
import re
import fitz
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_DIR = r"k:\Android App Files\PLAYSTORE APPS\Reasoning\website_reason_master"
PDF_DIR = r"C:\Users\offic\Downloads\Reasoning Questions"
PUBLIC_IMG_DIR = os.path.join(WORKSPACE_DIR, "public", "images", "questions")
PUBLIC_DATA_DIR = os.path.join(WORKSPACE_DIR, "public", "data")
OUTPUT_TOPIC_DIR = os.path.join(WORKSPACE_DIR, "src", "data", "extracted_by_topic")

os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)
os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)
os.makedirs(OUTPUT_TOPIC_DIR, exist_ok=True)

# Map letter/number to index 0..3
def ans_to_index(ans_str):
    if not ans_str:
        return 0
    ans_clean = re.sub(r'[^A-D1-4a-d]', '', str(ans_str)).upper()
    if not ans_clean:
        return 0
    char = ans_clean[0]
    mapping = {'A': 0, 'B': 1, 'C': 2, 'D': 3, '1': 0, '2': 1, '3': 2, '4': 3}
    return mapping.get(char, 0)

def normalize_options(opts, default_opts=None):
    clean = []
    for o in opts:
        # Strip leading (a), (b), 1., etc.
        s = re.sub(r'^\s*(?:\([A-Da-d1-4]\)|[A-Da-d1-4][\.\)]|\bOption\s+[A-Da-d1-4][:\.\)]?)\s*', '', o).strip()
        clean.append(s)
    while len(clean) < 4:
        if default_opts and len(clean) < len(default_opts):
            clean.append(default_opts[len(clean)])
        else:
            clean.append(f"Option {len(clean) + 1}")
    return clean[:4]

# ----------------------------------------------------------------------
# 1. EXTRACT DICE QUESTIONS (SSC_Dice_Reasoning_100Q_English.pdf)
# ----------------------------------------------------------------------
def extract_dice():
    pdf_path = os.path.join(PDF_DIR, "SSC_Dice_Reasoning_100Q_English.pdf")
    if not os.path.exists(pdf_path):
        print("Dice PDF not found!")
        return []
    
    doc = fitz.open(pdf_path)
    img_out_dir = os.path.join(PUBLIC_IMG_DIR, "dice")
    os.makedirs(img_out_dir, exist_ok=True)
    
    # 1. Parse Answer Key from pages 37-38
    ans_key = {}
    for pno in [36, 37]:
        if pno < len(doc):
            text = doc[pno].get_text()
            matches = re.findall(r'Q(\d+)[:\s]+([1-4])', text)
            for qn, ans in matches:
                ans_key[int(qn)] = int(ans)
                
    questions = []
    
    for pno in range(1, len(doc) - 2):
        page = doc[pno]
        blocks = page.get_text("blocks")
        # Find images on this page (excluding watermarks/footers)
        img_infos = page.get_image_info()
        valid_imgs = [
            info for info in img_infos 
            if info['width'] > 200 and info['height'] > 100 and info['bbox'][1] < 750 and info['bbox'][0] > 50
        ]
        # Sort images by y0
        valid_imgs.sort(key=lambda x: x['bbox'][1])
        
        # Combine text
        full_text = page.get_text()
        # Find questions on this page: Q\d+\.
        q_splits = list(re.finditer(r'(?:^|\n)\s*Q(\d+)\.\s+(.*?)(?=(?:\n\s*Q\d+\.|$))', full_text, re.S))
        
        for idx, q_match in enumerate(q_splits):
            q_num = int(q_match.group(1))
            chunk = q_match.group(2).strip()
            
            # Extract options (1. ..., 2. ...)
            lines = [l.strip() for l in chunk.split('\n') if l.strip()]
            q_text_lines = []
            options = []
            
            for l in lines:
                opt_m = re.match(r'^[1-4]\.\s*(.*)', l)
                if opt_m:
                    options.append(opt_m.group(1).strip())
                elif not options:
                    q_text_lines.append(l)
                    
            q_text = " ".join(q_text_lines).strip()
            # Crop corresponding diagram
            diagram_url = None
            if idx < len(valid_imgs):
                bbox = valid_imgs[idx]['bbox']
                # expand bbox slightly for clear view
                pad = 4
                crop_rect = fitz.Rect(max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(page.rect.width, bbox[2]+pad), min(page.rect.height, bbox[3]+pad))
                pix = page.get_pixmap(clip=crop_rect, dpi=150)
                img_name = f"dice_q{q_num}.png"
                pix.save(os.path.join(img_out_dir, img_name))
                diagram_url = f"/images/questions/dice/{img_name}"
                
            ans_digit = ans_key.get(q_num, 1)
            correct_idx = ans_digit - 1
            if options and correct_idx < len(options):
                ans_str = options[correct_idx]
            else:
                ans_str = str(ans_digit)
                
            questions.append({
                "id": f"ssc_dice_q{q_num}",
                "topicId": "cubes_and_dice",
                "subtopicId": "cubes_and_dice_core",
                "questionType": "figure" if diagram_url else "text",
                "question": q_text,
                "questionText": q_text,
                "options": normalize_options(options, ["Option 1", "Option 2", "Option 3", "Option 4"]),
                "correctAnswer": ans_str,
                "correctIndex": correct_idx,
                "difficulty": "medium",
                "hint": "Identify the common face between both positions and rotate clockwise.",
                "explanation": f"When two positions of a dice share one common face, moving clockwise from that common face gives the pairs of opposite faces. Here, the face opposite is {ans_str}.",
                "solutionSteps": [
                    "Step 1: Identify the common face between Position I and Position II.",
                    "Step 2: List the numbers/letters moving clockwise from the common face.",
                    f"Step 3: The element directly opposite to the target face is {ans_str}."
                ],
                "subject": "General Intelligence & Reasoning",
                "topic": "Cubes and Dice",
                "examCategory": "ssc",
                "examTags": ["ssc_cgl", "ssc_chsl", "ssc_mts", "ssc_cpo"],
                "pageNumber": pno + 1,
                "sourcePdf": "SSC_Dice_Reasoning_100Q_English.pdf",
                "figureUrl": diagram_url,
                "figureData": diagram_url
            })
            
    print(f"Extracted {len(questions)} Dice questions with diagrams.")
    return questions

# ----------------------------------------------------------------------
# 2. EXTRACT NON-VERBAL REASONING (Non_Verbal_Reasoning_SSC_200_Questions.pdf)
# ----------------------------------------------------------------------
def extract_non_verbal():
    pdf_path = os.path.join(PDF_DIR, "Non_Verbal_Reasoning_SSC_200_Questions.pdf")
    if not os.path.exists(pdf_path):
        print("Non-Verbal PDF not found!")
        return []
        
    doc = fitz.open(pdf_path)
    img_out_dir = os.path.join(PUBLIC_IMG_DIR, "non_verbal")
    os.makedirs(img_out_dir, exist_ok=True)
    
    # 1. Parse Answer Key from pages 108-110
    ans_key = {}
    for pno in [107, 108, 109]:
        if pno < len(doc):
            text = doc[pno].get_text()
            pairs = re.findall(r'(\d+)\s*\n\s*\(([1-4])\)', text)
            for qn, ans in pairs:
                ans_key[int(qn)] = int(ans)
                
    questions = []
    current_topic_name = "Non-Verbal Series"
    current_topic_id = "nonverbal_series"
    
    for pno in range(1, 107):
        page = doc[pno]
        text = page.get_text()
        
        # Check if new section header on page
        header_m = re.search(r'^\s*(\d+\.\s+[^-\n]+)', text, re.M)
        if header_m:
            hdr = header_m.group(1).lower()
            if "series" in hdr or "missing figure" in hdr:
                current_topic_name = "Non-Verbal Series"
                current_topic_id = "nonverbal_series"
            elif "analogy" in hdr:
                current_topic_name = "Figure Analogy"
                current_topic_id = "analogy"
            elif "classification" in hdr or "odd" in hdr:
                current_topic_name = "Odd Figure Out"
                current_topic_id = "odd_figure_out"
            elif "mirror" in hdr or "water" in hdr:
                current_topic_name = "Mirror & Water Images"
                current_topic_id = "mirror_images"
            elif "paper" in hdr:
                current_topic_name = "Paper Folding & Cutting"
                current_topic_id = "paper_cutting"
            elif "embedded" in hdr:
                current_topic_name = "Embedded Figures"
                current_topic_id = "embedded_figures"
            elif "completion" in hdr:
                current_topic_name = "Figure Completion"
                current_topic_id = "figure_completion"
                
        # Get valid question diagrams on page (width >= 300, height >= 150)
        img_infos = page.get_image_info()
        valid_imgs = [
            i for i in img_infos 
            if i['width'] >= 300 and i['height'] >= 150 and i['bbox'][1] < 750 and i['bbox'][0] > 50
        ]
        valid_imgs.sort(key=lambda x: x['bbox'][1])
        
        # Match questions Q\d+\.
        q_matches = list(re.finditer(r'Q(\d+)\.\s*(.*?)(?=(?:\n\s*Q\d+\.|$))', text, re.S))
        for idx, qm in enumerate(q_matches):
            q_num = int(qm.group(1))
            raw_text = qm.group(2).strip()
            # clean text
            cleaned_text = re.sub(r'Non-Verbal Reasoning.*', '', raw_text, flags=re.I).strip()
            cleaned_text = re.sub(r'Free e-book.*', '', cleaned_text, flags=re.I).strip()
            cleaned_text = " ".join(cleaned_text.split())
            if not cleaned_text or len(cleaned_text) < 10:
                cleaned_text = "Select the figure from the given options that follows the pattern or completes the figure."
                
            diagram_url = None
            if idx < len(valid_imgs):
                bbox = valid_imgs[idx]['bbox']
                pad = 4
                crop_rect = fitz.Rect(max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(page.rect.width, bbox[2]+pad), min(page.rect.height, bbox[3]+pad))
                pix = page.get_pixmap(clip=crop_rect, dpi=150)
                img_name = f"nonverbal_q{q_num}.png"
                pix.save(os.path.join(img_out_dir, img_name))
                diagram_url = f"/images/questions/non_verbal/{img_name}"
                
            ans_digit = ans_key.get(q_num, 1)
            correct_idx = ans_digit - 1
            
            questions.append({
                "id": f"ssc_nv_q{q_num}",
                "topicId": current_topic_id,
                "subtopicId": f"{current_topic_id}_core",
                "questionType": "figure",
                "question": cleaned_text,
                "questionText": cleaned_text,
                "options": ["Figure (1)", "Figure (2)", "Figure (3)", "Figure (4)"],
                "correctAnswer": f"Figure ({ans_digit})",
                "correctIndex": correct_idx,
                "difficulty": "medium",
                "hint": "Analyze rotation, shifting of elements, and changes in symbols sequentially.",
                "explanation": f"Examining the pattern of transformation across the figures, Figure ({ans_digit}) correctly satisfies the sequential rules and spatial orientation.",
                "solutionSteps": [
                    "Step 1: Track the movement or rotation of each individual element.",
                    "Step 2: Note the alternating patterns (shading, inversion, addition of lines).",
                    f"Step 3: Option ({ans_digit}) is the only figure conforming to all conditions."
                ],
                "subject": "General Intelligence & Reasoning",
                "topic": current_topic_name,
                "examCategory": "ssc",
                "examTags": ["ssc_cgl", "ssc_chsl", "ssc_mts", "ssc_cpo"],
                "pageNumber": pno + 1,
                "sourcePdf": "Non_Verbal_Reasoning_SSC_200_Questions.pdf",
                "figureUrl": diagram_url,
                "figureData": diagram_url
            })
            
    print(f"Extracted {len(questions)} Non-Verbal questions with diagrams.")
    return questions

# ----------------------------------------------------------------------
# 3. EXTRACT LOGICAL VENN DIAGRAMS (ssc-venn-diagram-100q-english.pdf)
# ----------------------------------------------------------------------
def extract_venn():
    pdf_path = os.path.join(PDF_DIR, "ssc-venn-diagram-100q-english.pdf")
    if not os.path.exists(pdf_path):
        print("Venn Diagram PDF not found!")
        return []
        
    doc = fitz.open(pdf_path)
    img_out_dir = os.path.join(PUBLIC_IMG_DIR, "venn")
    os.makedirs(img_out_dir, exist_ok=True)
    
    # 1. Parse Answer Key from page 35
    ans_key = {}
    if len(doc) >= 35:
        ans_text = doc[34].get_text() + "\n" + doc[33].get_text()
        matches = re.findall(r'(?:Q\s*\.?\s*)?(\d+)[\.\s:=-]+([A-Da-d1-4])', ans_text)
        for qn, ans in matches:
            ans_key[int(qn)] = ans.upper()
            
    questions = []
    
    for pno in range(1, len(doc) - 2):
        page = doc[pno]
        text = page.get_text()
        
        # In this PDF, Q3, Q4, etc. appear
        q_matches = list(re.finditer(r'Q(\d+)\.\s*(.*?)(?=(?:\n\s*Q\d+\.|$))', text, re.S))
        img_infos = page.get_image_info()
        valid_imgs = [i for i in img_infos if i['width'] > 60 and i['height'] > 60 and i['bbox'][1] < 750]
        
        for qm in q_matches:
            q_num = int(qm.group(1))
            raw_text = qm.group(2).strip()
            
            # Split statement and options
            lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
            q_text_lines = []
            options = []
            
            for l in lines:
                if re.match(r'^[A-D]\b', l) or re.match(r'^\([A-D]\)', l):
                    options.append(l)
                elif not options and "Free e-book" not in l and "Oliveboard" not in l and "www.oliveboard.in" not in l:
                    q_text_lines.append(l)
                    
            q_text = " ".join(q_text_lines).strip()
            if not q_text:
                q_text = "Select the Venn diagram that best represents the relationship between the given classes."
                
            # If Q1-Q50, options A-D are 4 diagrams arranged in 2x2 grid. Crop that area!
            diagram_url = None
            if q_num <= 50:
                # Find all images corresponding to this question vertical span
                # Usually 2 questions per page
                page_mid = page.rect.height / 2
                is_top = (qm.start() < len(text) / 2)
                y_min = 80 if is_top else 350
                y_max = 340 if is_top else 660
                crop_rect = fitz.Rect(90, y_min, 505, y_max)
                pix = page.get_pixmap(clip=crop_rect, dpi=150)
                img_name = f"venn_q{q_num}.png"
                pix.save(os.path.join(img_out_dir, img_name))
                diagram_url = f"/images/questions/venn/{img_name}"
                options = ["Venn Diagram (A)", "Venn Diagram (B)", "Venn Diagram (C)", "Venn Diagram (D)"]
            else:
                # Options are textual or single diagram in question
                if valid_imgs:
                    top_img = min(valid_imgs, key=lambda x: abs(x['bbox'][1] - 200))
                    bbox = top_img['bbox']
                    crop_rect = fitz.Rect(max(0, bbox[0]-4), max(0, bbox[1]-4), min(page.rect.width, bbox[2]+4), min(page.rect.height, bbox[3]+4))
                    pix = page.get_pixmap(clip=crop_rect, dpi=150)
                    img_name = f"venn_q{q_num}.png"
                    pix.save(os.path.join(img_out_dir, img_name))
                    diagram_url = f"/images/questions/venn/{img_name}"
                    
            ans_char = ans_key.get(q_num, 'A')
            c_idx = ans_to_index(ans_char)
            
            questions.append({
                "id": f"ssc_venn_q{q_num}",
                "topicId": "logical_venn_diagrams",
                "subtopicId": "logical_venn_diagrams_core",
                "questionType": "figure" if diagram_url else "text",
                "question": q_text,
                "questionText": q_text,
                "options": normalize_options(options, ["Diagram A", "Diagram B", "Diagram C", "Diagram D"]),
                "correctAnswer": f"Option ({ans_char})",
                "correctIndex": c_idx,
                "difficulty": "easy" if q_num <= 30 else ("medium" if q_num <= 70 else "hard"),
                "hint": "Determine whether each pair of items has an 'All', 'Some', or 'No' relationship.",
                "explanation": f"Analyze mutual inclusion: determine if any entity is entirely contained within another or if they are disjoint. The diagram in Option ({ans_char}) accurately represents the set relationship.",
                "solutionSteps": [
                    "Step 1: Test relationship between Element 1 and Element 2 (All, Some, or None).",
                    "Step 2: Test relationship between Element 2 and Element 3.",
                    "Step 3: Test relationship between Element 1 and Element 3.",
                    f"Step 4: Combine into a composite Venn diagram, giving Option ({ans_char})."
                ],
                "subject": "General Intelligence & Reasoning",
                "topic": "Venn Diagrams",
                "examCategory": "ssc",
                "examTags": ["ssc_cgl", "ssc_chsl", "ssc_mts", "ssc_cpo"],
                "pageNumber": pno + 1,
                "sourcePdf": "ssc-venn-diagram-100q-english.pdf",
                "figureUrl": diagram_url,
                "figureData": diagram_url
            })
            
    print(f"Extracted {len(questions)} Venn Diagram questions.")
    return questions

# ----------------------------------------------------------------------
# 4. EXTRACT STATEMENTS & ARGUMENTS (100_Statements_and_Arguments_Questions_for_SSC_Exams.pdf)
# ----------------------------------------------------------------------
def extract_statements_arguments():
    pdf_path = os.path.join(PDF_DIR, "100_Statements_and_Arguments_Questions_for_SSC_Exams.pdf")
    if not os.path.exists(pdf_path):
        return []
        
    doc = fitz.open(pdf_path)
    # Parse answers from page 23
    ans_key = {}
    ans_text = doc[22].get_text()
    matches = re.findall(r'(\d+)\s*\n\s*([A-D])', ans_text)
    for qn, ans in matches:
        ans_key[int(qn)] = ans.upper()
        
    # Parse explanations from pages 24-27
    expl_map = {}
    for p in range(23, len(doc)):
        txt = doc[p].get_text()
        ex_matches = re.findall(r'Q(\d+)\.\s*(.*?)(?=(?:Q\d+\.|$))', txt, re.S)
        for qn, ex in ex_matches:
            clean_ex = " ".join(ex.replace("Free e-book", "").split()).strip()
            expl_map[int(qn)] = clean_ex
            
    questions = []
    
    for pno in range(1, 22):
        page = doc[pno]
        text = page.get_text()
        q_matches = list(re.finditer(r'Q(\d+)\.\s*(.*?)(?=(?:\n\s*Q\d+\.|$))', text, re.S))
        
        for qm in q_matches:
            q_num = int(qm.group(1))
            chunk = qm.group(2).strip()
            
            # Extract options (a), (b), (c), (d)
            opt_matches = re.findall(r'\(([a-d])\)\s*([^(\n]+)', chunk)
            options = []
            if opt_matches:
                for o_letter, o_text in opt_matches:
                    options.append(o_text.strip())
            else:
                options = [
                    "Only Argument I is strong",
                    "Only Argument II is strong",
                    "Both Arguments I and II are strong",
                    "Neither Argument I nor II is strong"
                ]
                
            # Question statement text
            q_body = re.sub(r'\([a-d]\).*', '', chunk, flags=re.S).strip()
            q_body = " ".join(q_body.replace("Free e-book", "").replace("100 Statements and Arguments Questions for SSC Exams", "").split())
            
            ans_char = ans_key.get(q_num, 'A')
            c_idx = ans_to_index(ans_char)
            expl = expl_map.get(q_num, f"Argument evaluation shows Option ({ans_char}) is valid based on logical consistency and practical feasibility.")
            
            questions.append({
                "id": f"ssc_sa_q{q_num}",
                "topicId": "statement_argument",
                "subtopicId": "statement_argument_core",
                "questionType": "text",
                "question": q_body,
                "questionText": q_body,
                "options": normalize_options(options, [
                    "Only Argument I is strong",
                    "Only Argument II is strong",
                    "Both Arguments I and II are strong",
                    "Neither Argument I nor II is strong"
                ]),
                "correctAnswer": f"Option ({ans_char})",
                "correctIndex": c_idx,
                "difficulty": "medium",
                "hint": "A strong argument must be logically sound, practical, and directly address the core issue.",
                "explanation": expl,
                "solutionSteps": [
                    "Step 1: Analyze whether Argument I addresses the issue objectively without being vague or emotional.",
                    "Step 2: Analyze whether Argument II presents a valid practical viewpoint.",
                    f"Step 3: Conclusion: {expl}"
                ],
                "subject": "General Intelligence & Reasoning",
                "topic": "Statement and Argument",
                "examCategory": "ssc",
                "examTags": ["ssc_cgl", "ssc_chsl", "ssc_cpo"],
                "pageNumber": pno + 1,
                "sourcePdf": "100_Statements_and_Arguments_Questions_for_SSC_Exams.pdf"
            })
            
    print(f"Extracted {len(questions)} Statement & Argument questions.")
    return questions

# ----------------------------------------------------------------------
# 5. EXTRACT INLINE QUESTIONS (Counting Figures, Clock, Blood Relations, Coding, Direction, etc.)
# ----------------------------------------------------------------------
def extract_inline_pdf(filename, topic_id, topic_name, exam_tags=None):
    pdf_path = os.path.join(PDF_DIR, filename)
    if not os.path.exists(pdf_path):
        return []
        
    doc = fitz.open(pdf_path)
    questions = []
    
    # Extract text from all pages
    full_text_by_page = [(pno + 1, doc[pno].get_text()) for pno in range(len(doc))]
    
    # Regex to split questions
    # Matches Q1. or Q 1. or 1. or Q1)
    q_re = re.compile(r'(?:^|\n)\s*(?:Q\s*\.?\s*(\d+)[\.\):]|(\d+)\.\s+)', re.M)
    
    all_chunks = []
    current_q_num = None
    current_chunk = []
    current_pno = 1
    
    for pno, text in full_text_by_page:
        lines = text.split('\n')
        for line in lines:
            m = q_re.match(line)
            if m:
                qnum = int(m.group(1) or m.group(2))
                if current_q_num is not None and current_chunk:
                    all_chunks.append((current_q_num, current_pno, "\n".join(current_chunk)))
                current_q_num = qnum
                current_pno = pno
                current_chunk = [line]
            elif current_q_num is not None:
                current_chunk.append(line)
                
    if current_q_num is not None and current_chunk:
        all_chunks.append((current_q_num, current_pno, "\n".join(current_chunk)))
        
    for q_num, pno, raw_chunk in all_chunks:
        # Ignore non-question headers
        if len(raw_chunk.strip()) < 15:
            continue
            
        # Parse Answer / Solution
        ans_m = re.search(r'(?:Answer|Correct\s*Answer)[:\s]+(?:Option\s+)?(?:\(?([A-Da-d1-4])\)?|\b([A-Da-d1-4])\b|[^\n]+)', raw_chunk, re.I)
        expl_m = re.search(r'(?:Solution|Explanation)[:\s]+([^\n]+(?:\n[^\n]+)?)', raw_chunk, re.I)
        
        ans_char = 'A'
        if ans_m:
            match_str = ans_m.group(0)
            letter_m = re.search(r'\b([A-Da-d1-4])\b', match_str)
            if letter_m:
                ans_char = letter_m.group(1).upper()
                
        # Parse options
        opt_matches = re.findall(r'(?:^|\n)\s*(?:\([a-d1-4]\)|[a-d1-4][\.\)])\s*([^\n]+)', raw_chunk, re.I)
        options = [o.strip() for o in opt_matches if not re.match(r'^(?:Answer|Correct|Solution)', o, re.I)]
        
        # Clean question text (remove options and answers from chunk)
        q_lines = []
        for l in raw_chunk.split('\n'):
            l_strip = l.strip()
            if not l_strip:
                continue
            if re.match(r'^(?:Free e-book|Oliveboard|www\.|Answer|Correct Answer|Solution)', l_strip, re.I):
                break
            if re.match(r'^(?:\([a-d1-4]\)|[a-d1-4][\.\)])', l_strip, re.I):
                break
            q_lines.append(l_strip)
            
        q_text = " ".join(q_lines).strip()
        # Remove question number prefix
        q_text = re.sub(r'^(?:Q\s*\.?\s*\d+[\.\):]?|\d+\.\s*)', '', q_text).strip()
        
        if not q_text or len(q_text) < 5:
            continue
            
        c_idx = ans_to_index(ans_char)
        explanation = expl_m.group(1).strip() if expl_m else f"The correct answer is Option ({ans_char}). Applying the fundamental rules of {topic_name} leads to this result."
        
        questions.append({
            "id": f"ssc_{topic_id}_q{q_num}",
            "topicId": topic_id,
            "subtopicId": f"{topic_id}_core",
            "questionType": "text",
            "question": q_text,
            "questionText": q_text,
            "options": normalize_options(options, ["Option A", "Option B", "Option C", "Option D"]),
            "correctAnswer": f"Option ({ans_char})",
            "correctIndex": c_idx,
            "difficulty": "easy" if q_num <= 30 else ("medium" if q_num <= 75 else "hard"),
            "hint": f"Focus on standard concepts and formulas of {topic_name}.",
            "explanation": explanation,
            "solutionSteps": [
                f"Step 1: Identify the given information in the problem.",
                f"Step 2: Apply the logical deduction rules for {topic_name}.",
                f"Step 3: {explanation}"
            ],
            "subject": "General Intelligence & Reasoning",
            "topic": topic_name,
            "examCategory": "ssc",
            "examTags": exam_tags or ["ssc_cgl", "ssc_chsl", "ssc_mts"],
            "pageNumber": pno,
            "sourcePdf": filename
        })
        
    print(f"Extracted {len(questions)} questions from {filename} ({topic_name}).")
    return questions

# ----------------------------------------------------------------------
# 6. EXTRACT SEPARATE ANSWER KEY PDF (Missing Number, Direction, Classification, Analogy, etc.)
# ----------------------------------------------------------------------
def extract_separate_ans_key_pdf(filename, topic_id, topic_name, ans_page_start, has_matrix=False):
    pdf_path = os.path.join(PDF_DIR, filename)
    if not os.path.exists(pdf_path):
        return []
        
    doc = fitz.open(pdf_path)
    # Parse answer key
    ans_key = {}
    for p in range(ans_page_start - 1, len(doc)):
        txt = doc[p].get_text()
        matches = re.findall(r'(?:^|\n)\s*(?:Q\s*\.?\s*)?(\d+)[\.\s:=-]+(?:\(?([A-Da-d1-4])\)?|\b([A-Da-d1-4])\b)', txt)
        for qn, a1, a2 in matches:
            ans = a1 or a2
            if qn and ans:
                ans_key[int(qn)] = ans.upper()
                
    questions = []
    
    for pno in range(1, ans_page_start - 1):
        page = doc[pno]
        text = page.get_text()
        
        # Match questions Q\d+\. or \d+\.
        q_matches = list(re.finditer(r'(?:^|\n)\s*(?:Q\s*\.?\s*(\d+)[\.:]|(\d+)\.\s+)(.*?)(?=(?:\n\s*(?:Q\s*\.?\s*\d+[\.:]|\d+\.\s+)|$))', text, re.S))
        
        for qm in q_matches:
            q_num = int(qm.group(1) or qm.group(2))
            chunk = qm.group(3).strip()
            
            # Options
            opt_matches = re.findall(r'(?:^|\n)\s*(?:\([A-Da-d1-4]\)|[A-Da-d1-4][\.\)])\s*([^\n]+)', chunk)
            options = [o.strip() for o in opt_matches]
            
            # Question lines before options
            q_lines = []
            for l in chunk.split('\n'):
                l_strip = l.strip()
                if not l_strip or "Free e-book" in l_strip or "Oliveboard" in l_strip:
                    continue
                if re.match(r'^(?:\([A-Da-d1-4]\)|[A-Da-d1-4][\.\)])', l_strip):
                    break
                q_lines.append(l_strip)
                
            q_text = " ".join(q_lines).strip()
            if not q_text:
                continue
                
            ans_char = ans_key.get(q_num, 'A')
            c_idx = ans_to_index(ans_char)
            
            questions.append({
                "id": f"ssc_{topic_id}_q{q_num}",
                "topicId": topic_id,
                "subtopicId": f"{topic_id}_core",
                "questionType": "text",
                "question": q_text,
                "questionText": q_text,
                "options": normalize_options(options, ["Option A", "Option B", "Option C", "Option D"]),
                "correctAnswer": f"Option ({ans_char})",
                "correctIndex": c_idx,
                "difficulty": "easy" if q_num <= 30 else ("medium" if q_num <= 75 else "hard"),
                "hint": f"Follow the established pattern and relational rules for {topic_name}.",
                "explanation": f"Analyzing the relationship in the problem: Option ({ans_char}) consistently satisfies the mathematical and logical sequence.",
                "solutionSteps": [
                    "Step 1: Identify the underlying pattern or transformation.",
                    "Step 2: Check each option systematically against the pattern.",
                    f"Step 3: Option ({ans_char}) satisfies all given criteria."
                ],
                "subject": "General Intelligence & Reasoning",
                "topic": topic_name,
                "examCategory": "ssc",
                "examTags": ["ssc_cgl", "ssc_chsl", "ssc_mts", "ssc_cpo"],
                "pageNumber": pno + 1,
                "sourcePdf": filename
            })
            
    print(f"Extracted {len(questions)} questions from {filename} ({topic_name}).")
    return questions

# ----------------------------------------------------------------------
# 7. EXTRACT TIER 2 WITH SOLUTIONS (100-Reasoning-Questions-With-Solutions-for-SSC-CGL-Tier-2-Exam.pdf)
# ----------------------------------------------------------------------
def extract_tier2():
    pdf_path = os.path.join(PDF_DIR, "100-Reasoning-Questions-With-Solutions-for-SSC-CGL-Tier-2-Exam.pdf")
    if not os.path.exists(pdf_path):
        return []
        
    doc = fitz.open(pdf_path)
    # Parse solutions from pages 16 to 20
    sol_map = {}
    for p in range(15, len(doc)):
        txt = doc[p].get_text()
        s_matches = re.findall(r'S(\d+)[\.\s]+Ans\.?\(?([a-d])\)?\s*(.*?)(?=(?:S\d+[\.\s]|$))', txt, re.S | re.I)
        for qn, ans, sol in s_matches:
            clean_sol = " ".join(sol.replace("Sol.", "").replace("www.teachersadda.com", "").split()).strip()
            sol_map[int(qn)] = (ans.upper(), clean_sol)
            
    questions = []
    
    for pno in range(0, 15):
        page = doc[pno]
        text = page.get_text()
        q_matches = list(re.finditer(r'Q(\d+)\.\s*(.*?)(?=(?:\n\s*Q\d+\.|$))', text, re.S))
        
        for qm in q_matches:
            q_num = int(qm.group(1))
            chunk = qm.group(2).strip()
            
            # Options (a), (b), (c), (d)
            opt_matches = re.findall(r'\(([a-d])\)\s*([^\n]+)', chunk)
            options = [o[1].strip() for o in opt_matches]
            
            q_lines = []
            for l in chunk.split('\n'):
                l_strip = l.strip()
                if not l_strip or "www.teachersadda.com" in l_strip:
                    continue
                if re.match(r'^\([a-d]\)', l_strip):
                    break
                q_lines.append(l_strip)
                
            q_text = " ".join(q_lines).strip()
            if not q_text:
                continue
                
            ans_info = sol_map.get(q_num, ('A', 'Detailed logical explanation.'))
            ans_char = ans_info[0]
            explanation = ans_info[1]
            c_idx = ans_to_index(ans_char)
            
            # Topic classification heuristic for Tier 2
            topic_id = "analytical_reasoning"
            topic_name = "Analytical Reasoning"
            if "triangle" in q_text.lower() or "figure" in q_text.lower():
                topic_id = "counting_figures"
                topic_name = "Counting Figures"
            elif "series" in q_text.lower() or "?" in q_text:
                topic_id = "series_completion"
                topic_name = "Series Completion"
            elif "code" in q_text.lower() or "coded" in q_text.lower():
                topic_id = "coding_decoding"
                topic_name = "Coding and Decoding"
            elif "relation" in q_text.lower() or "brother" in q_text.lower() or "sister" in q_text.lower():
                topic_id = "blood_relations"
                topic_name = "Blood Relations"
            elif "statement" in q_text.lower() or "conclusion" in q_text.lower():
                topic_id = "statement_conclusion"
                topic_name = "Statement and Conclusion"
                
            questions.append({
                "id": f"ssc_tier2_q{q_num}",
                "topicId": topic_id,
                "subtopicId": f"{topic_id}_core",
                "questionType": "text",
                "question": q_text,
                "questionText": q_text,
                "options": normalize_options(options, ["Option (a)", "Option (b)", "Option (c)", "Option (d)"]),
                "correctAnswer": f"Option ({ans_char})",
                "correctIndex": c_idx,
                "difficulty": "hard",
                "hint": "Tier 2 questions require multi-stage arithmetic and logical deductions.",
                "explanation": explanation,
                "solutionSteps": [
                    "Step 1: Set up the algebraic or deductive relationships.",
                    "Step 2: Solve step-by-step for the unknown variable.",
                    f"Step 3: {explanation}"
                ],
                "subject": "General Intelligence & Reasoning",
                "topic": topic_name,
                "examCategory": "ssc",
                "examTags": ["ssc_cgl_tier2", "ssc_cgl"],
                "pageNumber": pno + 1,
                "sourcePdf": "100-Reasoning-Questions-With-Solutions-for-SSC-CGL-Tier-2-Exam.pdf"
            })
            
    print(f"Extracted {len(questions)} SSC CGL Tier-2 questions with full solutions.")
    return questions

# ----------------------------------------------------------------------
# MAIN ORCHESTRATOR
# ----------------------------------------------------------------------
def main():
    print("=== STARTING COMPREHENSIVE REASONING QUESTION EXTRACTION ===")
    all_extracted = []
    
    # 1. Dice
    all_extracted.extend(extract_dice())
    # 2. Non-Verbal
    all_extracted.extend(extract_non_verbal())
    # 3. Venn Diagrams
    all_extracted.extend(extract_venn())
    # 4. Statements & Arguments
    all_extracted.extend(extract_statements_arguments())
    # 5. Inline topics
    all_extracted.extend(extract_inline_pdf("counting-figure-questions.pdf", "counting_figures", "Counting Figures"))
    all_extracted.extend(extract_inline_pdf("clock-reasoning-questions.pdf", "mathematical_operations", "Clock Reasoning"))
    all_extracted.extend(extract_inline_pdf("coding-and-decoding-questions.pdf", "coding_decoding", "Coding and Decoding"))
    all_extracted.extend(extract_inline_pdf("input-output-questions.pdf", "input_output", "Input Output"))
    all_extracted.extend(extract_inline_pdf("statements-and-course-of-action.pdf", "course_of_action", "Course of Action"))
    all_extracted.extend(extract_inline_pdf("Statement_and_Conclusion_Questions.pdf", "statement_conclusion", "Statement and Conclusion"))
    all_extracted.extend(extract_inline_pdf("SSC-Blood-Relation-Questions.pdf", "blood_relations", "Blood Relations"))
    all_extracted.extend(extract_inline_pdf("Calendar Reasoning Questions for SSC Exams - English.pdf", "mathematical_operations", "Calendar Reasoning"))
    
    # 6. Separate answer keys
    all_extracted.extend(extract_separate_ans_key_pdf("SSC-CGL-Direction-Sense-100-Questions-English.pdf", "direction_sense", "Direction Sense", 23))
    all_extracted.extend(extract_separate_ans_key_pdf("Missing_Number_100_Questions_English.pdf", "missing_character", "Missing Number", 25))
    all_extracted.extend(extract_separate_ans_key_pdf("SSC_Classification_100_Questions_English.pdf", "classification", "Classification", 20))
    all_extracted.extend(extract_separate_ans_key_pdf("SSC_Alphanumeric_Series_100_Questions_English.pdf", "alphabet_test", "Alphanumeric Series", 24))
    all_extracted.extend(extract_separate_ans_key_pdf("SSC_Number_Series_100_Questions_English.pdf", "series_completion", "Number Series", 14))
    all_extracted.extend(extract_separate_ans_key_pdf("SSC_Order_and_Ranking_100_Questions_English.pdf", "ranking_order", "Order and Ranking", 21))
    all_extracted.extend(extract_separate_ans_key_pdf("Statement_and_Assumption_100_Questions_English.pdf", "statement_assumption", "Statement and Assumption", 18))
    all_extracted.extend(extract_separate_ans_key_pdf("Cause_and_Effect_Questions_SSC_English.pdf", "cause_and_effect", "Cause and Effect", 24))
    all_extracted.extend(extract_separate_ans_key_pdf("Word_Formation_100_Questions_English.pdf", "alphabet_test", "Word Formation", 19))
    all_extracted.extend(extract_separate_ans_key_pdf("ssc-cgl-analogy-100-questions-english.pdf", "analogy", "Analogy", 29))
    
    # 7. Tier 2
    all_extracted.extend(extract_tier2())
    
    print(f"\n=======================================================")
    print(f"TOTAL QUESTIONS EXTRACTED: {len(all_extracted)}")
    print(f"=======================================================\n")
    
    # Save Master JSON
    master_json_path = os.path.join(PUBLIC_DATA_DIR, "extracted_reasoning_questions_master.json")
    with open(master_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "totalQuestions": len(all_extracted),
            "generatedAt": "2026-09-09",
            "subject": "General Intelligence & Reasoning",
            "examCategory": "Staff Selection Commission (SSC)",
            "questions": all_extracted
        }, f, indent=2, ensure_ascii=False)
    print(f"Saved Master JSON to: {master_json_path} ({os.path.getsize(master_json_path)} bytes)")
    
    # Group by topicId
    by_topic = {}
    for q in all_extracted:
        tid = q["topicId"]
        if tid not in by_topic:
            by_topic[tid] = []
        by_topic[tid].append(q)
        
    print("\nBreakdown by Topic:")
    for tid, qlist in sorted(by_topic.items()):
        topic_path = os.path.join(OUTPUT_TOPIC_DIR, f"{tid}.json")
        with open(topic_path, "w", encoding="utf-8") as f:
            json.dump({
                "topicId": tid,
                "topicName": qlist[0]["topic"],
                "totalQuestions": len(qlist),
                "questions": qlist
            }, f, indent=2, ensure_ascii=False)
        print(f"  {tid:<30} : {len(qlist)} questions -> {topic_path}")

if __name__ == "__main__":
    main()
