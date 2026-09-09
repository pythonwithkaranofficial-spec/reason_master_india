import sys
import os
import glob
import json
import re
import fitz

sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r"C:\Users\offic\Downloads\Reasoning Questions"

def analyze_pdf(pdf_path):
    fname = os.path.basename(pdf_path)
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    
    # Check language
    is_hindi = "hindi" in fname.lower()
    
    # Detect total images
    total_images = sum(len(page.get_images()) for page in doc)
    
    # Search for question patterns and sections
    questions_detected = 0
    q_pattern_found = []
    
    answer_key_pages = []
    solution_pages = []
    
    for pno in range(total_pages):
        page = doc[pno]
        text = page.get_text()
        
        # Check answer key / solutions
        if re.search(r'(?:Answer\s*Key|Answers|उत्तरमाला|उत्तर कुंजी|ANSWERS)', text, re.I):
            answer_key_pages.append(pno + 1)
        if re.search(r'(?:Explanation|Solutions|व्याख्या|हल|SOLUTIONS)', text, re.I):
            solution_pages.append(pno + 1)
            
        # Detect question numbers
        q_matches = re.findall(r'(?:^|\n)\s*(?:Q\s*\.?\s*(\d+)|(\d+)\.\s+|Question\s*(\d+))', text)
        for m in q_matches:
            num = m[0] or m[1] or m[2]
            if num:
                q_pattern_found.append(int(num))
                
    max_q = max(q_pattern_found) if q_pattern_found else 0
    unique_qs = len(set(q_pattern_found)) if q_pattern_found else 0
    
    # Check first 2 question texts
    first_q_text = ""
    for pno in range(min(5, total_pages)):
        text = doc[pno].get_text()
        m = re.search(r'(?:Q\s*\.?\s*1[\.:\s]|1\.\s+)(.*?)(?:Q\s*\.?\s*2|2\.\s+|$)', text, re.S)
        if m:
            first_q_text = m.group(1).strip()[:150].replace('\n', ' ')
            break

    return {
        "file": fname,
        "pages": total_pages,
        "is_hindi": is_hindi,
        "total_images": total_images,
        "max_question_num": max_q,
        "unique_question_nums": unique_qs,
        "answer_key_pages": answer_key_pages,
        "solution_pages": solution_pages,
        "sample_q1": first_q_text
    }

def main():
    pdfs = sorted(glob.glob(os.path.join(PDF_DIR, "*.pdf")))
    results = []
    print(f"Analyzing {len(pdfs)} PDFs in {PDF_DIR}...\n")
    
    for p in pdfs:
        info = analyze_pdf(p)
        results.append(info)
        print(f"[{info['file']}] Pages: {info['pages']}, Hindi: {info['is_hindi']}, Imgs: {info['total_images']}, MaxQ: {info['max_question_num']}, UniqueQ: {info['unique_question_nums']}, AnsPgs: {info['answer_key_pages']}, SolPgs: {info['solution_pages']}")

    out_path = r"k:\Android App Files\PLAYSTORE APPS\Reasoning\website_reason_master\scripts\pdf_analysis_summary.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\nSaved analysis to {out_path}")

if __name__ == "__main__":
    main()
