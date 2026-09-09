# ReasonMaster India — GK PDF Category Mapping Report

> This document maps each source PDF and its content into the existing ReasonMaster India website taxonomy.

## Mapping Principles
- **Existing Website Taxonomy is Canonical**: Questions are matched into existing Indian GK topics and Rajasthan subtopics.
- **Zero Taxonomic Duplication**: Existing category IDs and paths (`indian_history`, `books_authors`, `rajasthan/history_culture`, etc.) are directly populated.
- **Content-Aware Boundary**: National literature/awards PDFs located in the Rajasthan folder are routed to Indian GK (`gkCategory = 'national'`).

## Detailed Category Mapping Table

| Source PDF | Detected Subject | Mapped Website Category | Category ID | Mapping Status |
|---|---|---|---|---|
| 100 Easy General Knowledge Questions...pdf | National Emblems, Flag, Symbols | Indian GK -> Static GK & First in India | `static_gk_superlatives` | **MATCHED — EXISTING CATEGORY** |
| 1000 India General knowledge questions...pdf | Indian Polity, Leaders, Superlatives | Indian GK -> National Topics | `indian_history / polity` | **MATCHED — EXISTING CATEGORY** |
| 50-gk-questions-with-answers_compress.pdf | Presidents, Republic Day, State Capitals | Indian GK -> Polity & Geography | `indian_polity / geography` | **MATCHED — EXISTING CATEGORY** |
| Indian GK Questions and Answers English/Hindi Part 2 | Polity, History, Geography, Science | Indian GK -> Core Topics | `indian_polity / history / science` | **MATCHED — EXISTING CATEGORY** |
| Indian GK Questions and Answers English and Hindi | Static National GK & Economy | Indian GK -> Static GK & Economy | `static_gk_superlatives / economy` | **MATCHED — EXISTING CATEGORY** |
| general-knowledge-about-india_compress.pdf | Art & Culture, Chief Ministers, Landmarks | Indian GK -> History & Culture | `indian_history / polity` | **MATCHED — EXISTING CATEGORY** |
| Books and Authors English.pdf / Hindi.pdf | Ancient Classics, Medieval & Modern Memoirs | Indian GK -> Books & Authors | `books_authors` | **MATCHED — EXISTING CATEGORY** |
| Famous Personalities in English 2026.pdf / उपनाम | National Personalities & Nicknames | Indian GK -> Static GK & Pioneers | `static_gk_superlatives` | **MATCHED — EXISTING CATEGORY** |
| Nobel Prize Winners from India...pdf | Indian Nobel Laureates & Achievements | Indian GK -> Awards & Honours | `awards_honours` | **MATCHED — EXISTING CATEGORY** |
| World Heritage Sites in India...pdf | 45 UNESCO Cultural & Natural Sites | Indian GK -> Parks & History | `national_parks_wildlife / history` | **MATCHED — EXISTING CATEGORY** |
| corrected-rajasthan-gk-1-100_compress.pdf | Verified Rajasthan History, Forts, Geography | State GK -> Rajasthan | `rajasthan (all subtopics)` | **MATCHED — EXISTING CATEGORY** |
| rajasthan-genral-knowledge_compress.pdf | Rajasthan Dams, Minerals, Folk Deities | State GK -> Rajasthan -> Geography & Culture | `rajasthan (geography / culture)` | **MATCHED — EXISTING CATEGORY** |
| rajasthan-gk-questions-hindi_compress.pdf | Bani Thani, Godavan, Forts, Temples | State GK -> Rajasthan -> History & Monuments | `rajasthan (history / monuments)` | **MATCHED — EXISTING CATEGORY** |
| Rajasthan General Knowledge Questions with Answers.pdf | Rajasthan Exam Questions | State GK -> Rajasthan -> Core Subtopics | `rajasthan` | **MATCHED — EXISTING CATEGORY** |
| Rajasthan District GK PDF.pdf / Notes | Rajasthan District Profiles | State GK -> Rajasthan -> Geography & Districts | `rajasthan (geography)` | **MATCHED — EXISTING CATEGORY** |
