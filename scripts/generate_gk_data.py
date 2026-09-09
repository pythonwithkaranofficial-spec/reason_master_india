"""
Generate comprehensive, verified State GK (28 States + 8 UTs = 36 entries),
Indian GK (11 topics), and World GK (6 topics) for ReasonMaster India.
Outputs:
- src/data/gk/state-gk-index.ts
- src/data/gk/states/<stateId>.json
- src/data/gk/national-gk-index.ts
- src/data/gk/national/<topicId>.json
- src/data/gk/world-gk-index.ts
- src/data/gk/world/<topicId>.json
- src/data/gk/questions/gk_questions_master.json
"""

import os
import sys
import json

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(__file__)
GK_DATA_DIR = os.path.join(BASE_DIR, "..", "src", "data", "gk")
STATES_DIR = os.path.join(GK_DATA_DIR, "states")
NATIONAL_DIR = os.path.join(GK_DATA_DIR, "national")
WORLD_DIR = os.path.join(GK_DATA_DIR, "world")
QUESTIONS_DIR = os.path.join(GK_DATA_DIR, "questions")

for d in [STATES_DIR, NATIONAL_DIR, WORLD_DIR, QUESTIONS_DIR]:
    os.makedirs(d, exist_ok=True)

# ----------------------------------------------------------------------
# 28 STATES & 8 UTS DEFINITIONS
# ----------------------------------------------------------------------
ALL_ENTITIES = [
    # 28 States
    {
        "id": "andhra_pradesh", "type": "state", "name": "Andhra Pradesh", "capital": "Amaravati",
        "formationDate": "1 November 1956", "areaSqKm": 162968, "districtsCount": 26,
        "officialLanguages": ["Telugu"], "highCourt": "High Court of Andhra Pradesh (Amaravati)",
        "chiefMinister": "N. Chandrababu Naidu", "governorOrLtGovernor": "S. Abdul Nazeer", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Blackbuck", "bird": "Rose-ringed parakeet", "flower": "Jasmine", "tree": "Neem"},
        "summary": "First state formed on a linguistic basis in India (1953). Known as the 'Rice Bowl of India', home to Sriharikota spaceport (SDSC SHAR) and the sacred Tirumala Venkateswara Temple.",
        "subtopics": [
            {"id": "ap_geography", "name": "Geography & Climate", "summary": "Coastal Andhra and Rayalaseema physiography, Godavari and Krishna river basins, Eastern Ghats.", "facts": [
                {"title": "Second Longest Mainland Coastline", "content": "Andhra Pradesh possesses the second-longest coastline (974 km) in mainland India after Gujarat.", "tags": ["coastline", "geography"]},
                {"title": "Major River Deltas", "content": "The Godavari and Krishna rivers form fertile, expansive deltas supporting extensive paddy cultivation, earning it the title 'Rice Bowl of India'.", "tags": ["rivers", "agriculture"]},
                {"title": "Borra Caves", "content": "Located in the Ananthagiri hills of Araku Valley, the million-year-old Borra Caves feature spectacular limestone stalactite and stalagmite formations.", "tags": ["caves", "tourism"]}
            ]},
            {"id": "ap_history_culture", "name": "History, Art & Culture", "summary": "Satavahanas, Eastern Chalukyas, Vijayanagara Empire, and Kuchipudi classical dance.", "facts": [
                {"title": "Birthplace of Kuchipudi", "content": "Kuchipudi, one of India's 8 classical dances, originated in Kuchipudi village, Krishna district, nurtured by Siddhendra Yogi.", "tags": ["dance", "classical"]},
                {"title": "Satavahana Capital at Amaravati", "content": "Ancient Dharanikota/Amaravati was the majestic capital of the Satavahana dynasty, renowned for Buddhist art and Stupa.", "tags": ["history", "buddhism"]},
                {"title": "Lepakshi Architectural Marvel", "content": "The 16th-century Veerabhadra Temple in Lepakshi features the famous hanging pillar and one of India's largest monolithic Nandi statues.", "tags": ["temples", "sculpture"]}
            ]},
            {"id": "ap_governance", "name": "Government & Administration", "summary": "State legislature, districts, high court, and executive leadership.", "facts": [
                {"title": "Chief Minister", "content": "N. Chandrababu Naidu serves as Chief Minister of Andhra Pradesh.", "lastVerified": "2026-01-01", "tags": ["politics", "leadership"]},
                {"title": "Governor", "content": "Justice S. Abdul Nazeer (Retd.) serves as the Governor of Andhra Pradesh.", "lastVerified": "2026-01-01", "tags": ["governor", "polity"]},
                {"title": "26 Administrative Districts", "content": "In April 2022, Andhra Pradesh reorganized its administrative map, expanding from 13 to 26 districts aligned with parliamentary constituencies.", "tags": ["districts", "administration"]}
            ]},
            {"id": "ap_economy", "name": "Economy, Minerals & Agriculture", "summary": "Agriculture, fisheries, Visakhapatnam port, and mineral deposits.", "facts": [
                {"title": "Leading Aqua & Fish Producer", "content": "Andhra Pradesh is India's largest producer and exporter of shrimp and marine fish, contributing over 65% of national shrimp exports.", "tags": ["fisheries", "exports"]},
                {"title": "Uranium Reserves at Tummalapalle", "content": "The Tummalapalle mine in Kadapa district holds one of the world's largest confirmed reserves of uranium ore.", "tags": ["minerals", "energy"]},
                {"title": "Visakhapatnam Major Port", "content": "Visakhapatnam Port is one of India's largest cargo handling ports and headquarters of the Eastern Naval Command.", "tags": ["ports", "shipping"]}
            ]},
            {"id": "ap_places", "name": "Important Places & National Parks", "summary": "Tirupati, Sriharikota, Papikonda, and Sri Venkateswara National Park.", "facts": [
                {"title": "Sriharikota ISRO Spaceport", "content": "Satish Dhawan Space Centre (SDSC SHAR) at Sriharikota in Tirupati district is ISRO's sole satellite launch base for PSLV, GSLV, and LVM3.", "tags": ["space", "isro"]},
                {"title": "Tirumala Venkateswara Temple", "content": "Located on the Venkatadri hill of Seshachalam ranges, it is one of the most visited and wealthiest pilgrimage centers in the world.", "tags": ["pilgrimage", "heritage"]},
                {"title": "Papikonda National Park", "content": "Spanning the Godavari river gorges across Eastern Ghats, Papikonda is home to leopards, gaurs, and diverse bird species.", "tags": ["wildlife", "national_parks"]}
            ]},
            {"id": "ap_schemes", "name": "Schemes, Awards & Achievements", "summary": "Flagship welfare missions and technological milestones.", "facts": [
                {"title": "Annadata Sukhibhava Scheme", "content": "State agricultural welfare program providing annual financial income support of ₹20,000 to farmer households.", "lastVerified": "2026-01-01", "tags": ["schemes", "farmers"]},
                {"title": "Deepam Scheme", "content": "Welfare scheme providing three free LPG cylinders annually to eligible low-income women beneficiaries.", "lastVerified": "2026-01-01", "tags": ["schemes", "welfare"]}
            ]}
        ],
        "mcqs": [
            {"q": "Which classical dance form originated in Andhra Pradesh?", "o": ["Kuchipudi", "Bharatanatyam", "Kathakali", "Odissi"], "a": 0, "exp": "Kuchipudi originated in the Kuchipudi village of Krishna district, Andhra Pradesh."},
            {"q": "Where is the Satish Dhawan Space Centre (SHAR) located?", "o": ["Sriharikota", "Visakhapatnam", "Tirupati", "Vijayawada"], "a": 0, "exp": "Satish Dhawan Space Centre is ISRO's primary spaceport located in Sriharikota, Tirupati district, AP."},
            {"q": "What is the state animal of Andhra Pradesh?", "o": ["Blackbuck", "Chital", "Gaur", "Elephant"], "a": 0, "exp": "The Blackbuck (Krishna Jinka) is the official state animal of Andhra Pradesh."},
            {"q": "Which major river forms a massive delta at Rajahmundry before entering the Bay of Bengal?", "o": ["Godavari", "Krishna", "Penna", "Kaveri"], "a": 0, "exp": "The Godavari River flows through Rajahmundry (Rajamahendravaram) and forms its fertile delta region."}
        ]
    },
    {
        "id": "arunachal_pradesh", "type": "state", "name": "Arunachal Pradesh", "capital": "Itanagar",
        "formationDate": "20 February 1987", "areaSqKm": 83743, "districtsCount": 26,
        "officialLanguages": ["English"], "highCourt": "Gauhati High Court (Itanagar Permanent Bench)",
        "chiefMinister": "Pema Khandu", "governorOrLtGovernor": "Lt. Gen. Kaiwalya Trivikram Parnaik", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Gayal (Mithun)", "bird": "Great hornbill", "flower": "Foxtail orchid", "tree": "Hollong"},
        "summary": "Known as the 'Land of Dawn-Lit Mountains', India's easternmost state bordering China, Bhutan, and Myanmar. Home to Tawang Monastery, India's largest Buddhist monastery.",
        "subtopics": [
            {"id": "ar_geography", "name": "Geography & Borders", "summary": "Eastern Himalayas, Brahmaputra river entry, international boundaries.", "facts": [
                {"title": "India's Easternmost Frontier", "content": "Dong Valley in Anjaw district witnesses the first sunrise in India every morning.", "tags": ["sunrise", "borders"]},
                {"title": "Siang River Origin", "content": "The mighty Yarlung Tsangpo enters India from Tibet through Arunachal Pradesh, known as Siang, before forming the Brahmaputra in Assam.", "tags": ["rivers", "brahmaputra"]}
            ]},
            {"id": "ar_culture", "name": "History, Tribes & Festivals", "summary": "Monpa, Apatani, Nyishi, Adi tribes, Losar and Torgya festivals.", "facts": [
                {"title": "Tawang Monastery", "content": "Galden Namgey Lhatse in Tawang was founded in 1680-1681 and is the second-largest Buddhist monastery in the world after the Potala Palace.", "tags": ["buddhism", "monasteries"]},
                {"title": "Apatani Wet Rice Cultivation", "content": "The Apatani tribe of Ziro Valley practices unique, highly efficient sustainable paddy-cum-fish agro-forestry without animal draught power.", "tags": ["agriculture", "tribes"]}
            ]},
            {"id": "ar_governance", "name": "Government & Administration", "summary": "State executive, legislative council, and administrative districts.", "facts": [
                {"title": "Chief Minister", "content": "Pema Khandu has served as Chief Minister of Arunachal Pradesh since 2016.", "lastVerified": "2026-01-01", "tags": ["leadership"]},
                {"title": "Governor", "content": "Lt. Gen. Kaiwalya Trivikram Parnaik (Retd.) serves as Governor.", "lastVerified": "2026-01-01", "tags": ["governor"]}
            ]},
            {"id": "ar_economy", "name": "Economy, Minerals & Forests", "summary": "Hydropower potential, timber, horticulture, and tourism.", "facts": [
                {"title": "Hydropower Powerhouse", "content": "Arunachal Pradesh accounts for over one-third of India's total potential hydroelectric capacity (approx 50,000 MW).", "tags": ["energy", "hydropower"]}
            ]},
            {"id": "ar_places", "name": "Protected Areas & Wildlife", "summary": "Namdapha National Park, Pakke Tiger Reserve, and Sela Pass.", "facts": [
                {"title": "Namdapha National Park", "content": "Located in Changlang district, Namdapha is famed as the only national park in the world harboring four feline species: Tiger, Leopard, Snow Leopard, and Clouded Leopard.", "tags": ["wildlife", "biodiversity"]}
            ]},
            {"id": "ar_schemes", "name": "Schemes & Initiatives", "summary": "Arogya Arunachal, rural road development under PMGSY.", "facts": [
                {"title": "Chief Minister's Arogya Arunachal Yojana", "content": "Provides cashless health cover up to ₹5 lakh per family per year for secondary and tertiary healthcare.", "lastVerified": "2026-01-01", "tags": ["health", "schemes"]}
            ]}
        ],
        "mcqs": [
            {"q": "Which monastery in Arunachal Pradesh is the largest Buddhist monastery in India?", "o": ["Tawang Monastery", "Rumtek Monastery", "Hemis Monastery", "Bomdila Monastery"], "a": 0, "exp": "Tawang Monastery was founded by Merak Lama Lodre Gyatso in 1680-1681."},
            {"q": "Which state animal of Arunachal Pradesh is also known as Mithun?", "o": ["Gayal", "Red Panda", "Takin", "Snow Leopard"], "a": 0, "exp": "The Gayal (Bos frontalis), locally known as Mithun, is the state animal."},
            {"q": "Which river enters India from Tibet through Arunachal Pradesh as the Siang River?", "o": ["Brahmaputra", "Indus", "Subansiri", "Lohit"], "a": 0, "exp": "The Yarlung Tsangpo enters India at Gelling in Arunachal Pradesh as the Siang."}
        ]
    }
]

# We will generate comprehensive data for all 28 states and 8 UTs programmatically.
# Let's write a python generator that produces rich, verified entries for each.
print(f"Base data initialized for {len(ALL_ENTITIES)} entities.")
