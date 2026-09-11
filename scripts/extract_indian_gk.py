# -*- coding: utf-8 -*-
"""
Script to extract, verify, translate, synthesize 4-option MCQs for Indian National GK
Sources:
  - Indian GK Questions and Answers English and Hindi Part 2.docx (100 MCQs)
  - Books and Authors English & Hindi PDFs
  - Nobel Prize Winners from India PDF
  - Famous Personalities in English & Hindi PDFs
  - World Heritage Sites in India PDF
  - 100 Easy General Knowledge Questions and Answers about India.docx
"""

import os, sys, re, json, docx

sys.stdout.reconfigure(encoding='utf-8')

# Let's define the comprehensive enrichment map for the 100 questions from Part 2
# Each question has its verified English translation, options EN, exp EN & HI, hint EN & HI, and target topicId.

def parse_indian_gk_part2():
    docx_path = r'C:\Users\offic\Downloads\Indian GK Questions\Indian GK Questions and Answers English and Hindi Part 2.docx'
    doc = docx.Document(docx_path)
    paras = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

    raw_mcqs = []
    cur_q = None
    cur_section = "Indian Polity & Constitution"

    for p in paras:
        m_head = re.search(r'(Indian Polity|Indian History|Indian Geography|Science|Mixed)', p)
        if m_head:
            cur_section = p
            continue
        m_q = re.match(r'^(\d+)\.\s*(.+)', p)
        if m_q:
            if cur_q:
                raw_mcqs.append(cur_q)
            cur_q = {
                'num': int(m_q.group(1)),
                'section': cur_section,
                'qHi': m_q.group(2).strip(),
                'optionsHi': [],
                'ansLetter': None
            }
            continue
        m_opt = re.match(r'^([A-D])\)\s*(.+)', p)
        if m_opt and cur_q:
            cur_q['optionsHi'].append(m_opt.group(2).strip())
            continue
        m_ans = re.search(r'(?:उत्तर|Answer):\s*([A-D])', p)
        if m_ans and cur_q:
            cur_q['ansLetter'] = m_ans.group(1).upper()

    if cur_q:
        raw_mcqs.append(cur_q)

    letter_to_idx = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
    for q in raw_mcqs:
        q['correctIndex'] = letter_to_idx.get(q['ansLetter'], 0)

    print(f"Parsed {len(raw_mcqs)} raw MCQs from Part 2 docx.")
    return raw_mcqs

if __name__ == '__main__':
    mcqs = parse_indian_gk_part2()
    with open('scratch_indian_part2_raw.json', 'w', encoding='utf-8') as f:
        json.dump(mcqs, f, ensure_ascii=False, indent=2)
    print("Saved scratch_indian_part2_raw.json")
