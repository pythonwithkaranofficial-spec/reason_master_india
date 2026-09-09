import sys
import os
import re
import fitz

sys.stdout.reconfigure(encoding='utf-8')
PDF_DIR = r"C:\Users\offic\Downloads\Reasoning Questions"

def test_hindi_pdf(fname):
    path = os.path.join(PDF_DIR, fname)
    doc = fitz.open(path)
    text = "\n".join([doc[p].get_text() for p in range(len(doc))])
    # Find questions Q1, Q 1, 1., etc.
    q_matches = re.findall(r'(?:^|\n)\s*(?:Q\s*\.?\s*(\d+)[\.\):]?|(\d+)\.\s+)', text)
    nums = set(int(m[0] or m[1]) for m in q_matches if (m[0] or m[1]))
    print(f"{fname:<55} | Pages: {len(doc):<3} | Found Q-nums: {len(nums)} | Min: {min(nums) if nums else 0} | Max: {max(nums) if nums else 0}")

hindi_files = [
    "SSC-Blood-Relation-Questions-Hindi.pdf",
    "Coding-and-decoding-questions-for-ssc-exams-in-hindi.pdf",
    "SSC_Dice_Reasoning_100Q_Hindi.pdf",
    "ssc-venn-diagram-100q-hindi.pdf",
    "Missing_Number_100_Questions_Hindi.pdf",
    "SSC_Classification_100_Questions_Hindi.pdf",
    "SSC_Alphanumeric_Series_100_Questions_Hindi.pdf",
    "SSC_Number_Series_100_Questions_Hindi.pdf",
    "SSC_Order_and_Ranking_100_Questions_Hindi.pdf",
    "Statement_and_Assumption_100_Questions_Hindi.pdf",
    "Word_Formation_100_Questions_Hindi.pdf",
    "Cause_and_Effect_Questions_SSC_Hindi.pdf",
    "Calendar Reasoning Questions for SSC Exams - Hindi.pdf",
    "SSC-CGL-Direction-Sense-100-Questions-Hindi.pdf",
    "ssc-cgl-analogy-100-questions-hindi.pdf"
]

for hf in hindi_files:
    test_hindi_pdf(hf)
