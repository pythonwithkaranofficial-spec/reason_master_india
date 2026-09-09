"""
build_full_gk_database.py
Generates the authoritative General Knowledge datasets for ReasonMaster India.
- 36 States and UTs (28 States + 8 UTs) with 6 subtopics each, fact cards, and authentic MCQs
- 11 Indian GK Topics with subtopics, fact cards, and MCQs
- 6 World GK Topics with subtopics, fact cards, and MCQs
- Master question bank for the GK practice engine
"""

import os
import sys
import json

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(__file__)
GK_DIR = os.path.join(BASE_DIR, "..", "src", "data", "gk")
STATES_DIR = os.path.join(GK_DIR, "states")
NATIONAL_DIR = os.path.join(GK_DIR, "national")
WORLD_DIR = os.path.join(GK_DIR, "world")
QUESTIONS_DIR = os.path.join(GK_DIR, "questions")

for d in [STATES_DIR, NATIONAL_DIR, WORLD_DIR, QUESTIONS_DIR]:
    os.makedirs(d, exist_ok=True)

# ----------------------------------------------------------------------
# 1. METADATA DICTIONARY FOR 28 STATES & 8 UTS
# ----------------------------------------------------------------------
STATES_DATA = [
    # 28 STATES
    {
        "id": "andhra_pradesh", "type": "state", "name": "Andhra Pradesh", "capital": "Amaravati",
        "formationDate": "1 November 1956", "areaSqKm": 162968, "districtsCount": 26,
        "officialLanguages": ["Telugu"], "highCourt": "High Court of Andhra Pradesh (Amaravati)",
        "chiefMinister": "N. Chandrababu Naidu", "governorOrLtGovernor": "S. Abdul Nazeer", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Blackbuck", "bird": "Rose-ringed parakeet", "flower": "Jasmine", "tree": "Neem"},
        "summary": "First state formed on a linguistic basis in India (1953). Known as the 'Rice Bowl of India', home to Sriharikota spaceport (SDSC SHAR) and the Tirumala Venkateswara Temple.",
        "dance": "Kuchipudi (Classical Dance)", "festivals": "Ugadi, Sankranti, Tirupati Brahmotsavam",
        "rivers": "Godavari, Krishna, Penna, Tungabhadra", "minerals": "Mica, Bauxite, Limestone, Uranium (Tummalapalle)",
        "monuments": "Tirumala Venkateswara Temple, Lepakshi Temple, Amaravati Stupa, Borra Caves",
        "nationalParks": "Papikonda National Park, Sri Venkateswara National Park",
        "schemes": "Thalliki Vandanam, Annadata Sukhibhava, Deepam Scheme",
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
        "dance": "Bardo Chham, Wancho dance, Ponung", "festivals": "Losar, Torgya, Mopin, Solung",
        "rivers": "Siang (Brahmaputra), Kameng, Subansiri, Dibang, Lohit", "minerals": "Petroleum, Coal, Dolomite, Graphite",
        "monuments": "Tawang Monastery (Galden Namgey Lhatse), Ita Fort, Jawaharlal Nehru State Museum",
        "nationalParks": "Namdapha National Park, Mouling National Park, Pakke Tiger Reserve",
        "schemes": "Chief Minister's Arogya Arunachal Yojana, Dulari Kanya Scheme",
        "mcqs": [
            {"q": "Which monastery in Arunachal Pradesh is the largest Buddhist monastery in India?", "o": ["Tawang Monastery", "Rumtek Monastery", "Hemis Monastery", "Bomdila Monastery"], "a": 0, "exp": "Tawang Monastery was founded by Merak Lama Lodre Gyatso in 1680-1681 and is the second largest in the world after the Potala Palace in Lhasa."},
            {"q": "Which state animal of Arunachal Pradesh is also known as Mithun?", "o": ["Gayal", "Red Panda", "Takin", "Snow Leopard"], "a": 0, "exp": "The Gayal (Bos frontalis), locally known as Mithun, is the state animal of Arunachal Pradesh."},
            {"q": "Which river enters India from Tibet through Arunachal Pradesh as the Siang River?", "o": ["Brahmaputra", "Indus", "Subansiri", "Lohit"], "a": 0, "exp": "The Yarlung Tsangpo enters India at Gelling in Arunachal Pradesh, where it is called the Siang before becoming the Brahmaputra in Assam."}
        ]
    },
    {
        "id": "assam", "type": "state", "name": "Assam", "capital": "Dispur",
        "formationDate": "26 January 1950", "areaSqKm": 78438, "districtsCount": 35,
        "officialLanguages": ["Assamese", "Bodo", "Bengali"], "highCourt": "Gauhati High Court (Guwahati)",
        "chiefMinister": "Himanta Biswa Sarma", "governorOrLtGovernor": "Lakshman Prasad Acharya", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "One-horned rhinoceros", "bird": "White-winged duck", "flower": "Foxtail orchid (Kopou phool)", "tree": "Hollong"},
        "summary": "World-famous for Assam tea, Muga golden silk, petroleum (Digboi is Asia's oldest refinery), and Kaziranga National Park, the sanctuary of the Great Indian One-Horned Rhinoceros.",
        "dance": "Sattriya (Classical Dance), Bihu, Bagurumba", "festivals": "Bihu (Rongali, Kongali, Bhogali), Ambubachi Mela",
        "rivers": "Brahmaputra, Barak, Manas, Subansiri", "minerals": "Petroleum (Digboi, Naharkatiya), Natural Gas, Coal, Limestone",
        "monuments": "Kamakhya Temple, Rang Ghar, Kareng Ghar, Talatal Ghar",
        "nationalParks": "Kaziranga, Manas, Dibru-Saikhowa, Nameri, Orang, Raimona, Dehing Patkai",
        "schemes": "Orunodoi 3.0, Pragyan Bharati, Nijut Moina Scheme",
        "mcqs": [
            {"q": "Which dance form of Assam is recognized as one of India's 8 classical dance forms?", "o": ["Sattriya", "Bihu", "Bagurumba", "Bhor Tal"], "a": 0, "exp": "Sattriya was introduced by 15th-century Vaishnavite saint Srimanta Sankardev and recognized as a classical dance in 2000."},
            {"q": "Asia's oldest operating oil refinery is located in which town of Assam?", "o": ["Digboi", "Guwahati", "Numaligarh", "Bongaigaon"], "a": 0, "exp": "The Digboi refinery was commissioned on December 11, 1901, and is the world's oldest continuously operating oil refinery."},
            {"q": "Which national park in Assam holds the highest density of the Greater One-Horned Rhinoceros in the world?", "o": ["Kaziranga National Park", "Pobitora Wildlife Sanctuary", "Manas National Park", "Orang National Park"], "a": 0, "exp": "Kaziranga National Park holds over two-thirds of the world's great one-horned rhinoceros population."}
        ]
    },
    {
        "id": "bihar", "type": "state", "name": "Bihar", "capital": "Patna",
        "formationDate": "22 March 1912", "areaSqKm": 94163, "districtsCount": 38,
        "officialLanguages": ["Hindi", "Urdu"], "highCourt": "Patna High Court",
        "chiefMinister": "Nitish Kumar", "governorOrLtGovernor": "Rajendra Arlekar", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Gaur", "bird": "House sparrow", "flower": "Kachnar", "tree": "Peepal"},
        "summary": "Birthplace of Buddhism and Jainism. Seat of ancient empires (Magadha, Maurya, Gupta) and world-renowned ancient universities (Nalanda and Vikramashila). Celebrates Chhath Puja.",
        "dance": "Bidesia, Jat-Jatin, Jhijhiya, Kajari", "festivals": "Chhath Puja, Sonepur Cattle Fair, Sama Chakeva",
        "rivers": "Ganga, Gandak, Kosi, Son, Bagmati, Ghaghara", "minerals": "Pyrites (Amjhore), Mica, Limestone, Steatite",
        "monuments": "Mahabodhi Temple (Bodh Gaya), Nalanda University Ruins, Golghar, Sasaram Tomb of Sher Shah Suri",
        "nationalParks": "Valmiki National Park, Vikramshila Gangetic Dolphin Sanctuary",
        "schemes": "Saat Nischay Part-2, Mukhyamantri Kanya Utthan Yojana, Student Credit Card Scheme",
        "mcqs": [
            {"q": "Under which tree did Gautama Buddha attain enlightenment in Bodh Gaya, Bihar?", "o": ["Bodhi Tree (Peepal)", "Banyan Tree", "Sal Tree", "Neem Tree"], "a": 0, "exp": "Gautama Buddha attained supreme enlightenment under the sacred Bodhi tree at Bodh Gaya."},
            {"q": "Which ancient university in Bihar was revived in the 21st century after its historical destruction in 1193 AD?", "o": ["Nalanda University", "Takshashila University", "Vikramashila University", "Odantapuri University"], "a": 0, "exp": "Nalanda Mahavihara was founded by Kumaragupta I of the Gupta dynasty in the 5th century AD."},
            {"q": "Which river is historically known as the 'Sorrow of Bihar' due to frequent course shifts and floods?", "o": ["Kosi River", "Gandak River", "Son River", "Ghaghara River"], "a": 0, "exp": "The Kosi River has shifted course over 120 km over 250 years, causing devastating inundation."}
        ]
    },
    {
        "id": "chhattisgarh", "type": "state", "name": "Chhattisgarh", "capital": "Raipur",
        "formationDate": "1 November 2000", "areaSqKm": 135192, "districtsCount": 33,
        "officialLanguages": ["Chhattisgarhi", "Hindi"], "highCourt": "Chhattisgarh High Court (Bilaspur)",
        "chiefMinister": "Vishnu Deo Sai", "governorOrLtGovernor": "Ramen Deka", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Wild water buffalo", "bird": "Bastar hill myna", "flower": "French marigold", "tree": "Sal"},
        "summary": "Known as the 'Rice Bowl of Central India'. Rich in mineral resources (Tin, Coal, Iron Ore). Home to the Chitrakote Falls ('Niagara of India') on the Indravati river.",
        "dance": "Panthi, Raut Nacha, Pandavani, Karma", "festivals": "Bastar Dussehra, Hareli, Madai Festival",
        "rivers": "Mahanadi, Indravati, Shivnath, Hasdeo, Rihand", "minerals": "Tin ore (sole producer in India), Iron ore (Bailadila), Coal (Korba), Bauxite",
        "monuments": "Bhoramdeo Temple, Sirpur Group of Monuments, Chitrakote Falls, Tirathgarh Falls",
        "nationalParks": "Indravati National Park, Kanger Valley National Park, Guru Ghasidas National Park",
        "schemes": "Mahtari Vandan Yojana, Rajiv Gandhi Kisan Nyay Yojana, Mukhyamantri Suposhan Abhiyan",
        "mcqs": [
            {"q": "Which state is the sole producer of tin ore (cassiterite) in India?", "o": ["Chhattisgarh", "Jharkhand", "Odisha", "Madhya Pradesh"], "a": 0, "exp": "Dantewada and Bastar districts of Chhattisgarh are the only commercial producers of tin ore in India."},
            {"q": "Chitrakote Waterfall on the Indravati River is widely known by which title?", "o": ["Niagara Falls of India", "Angel Falls of India", "Victoria Falls of India", "Iguazu Falls of India"], "a": 0, "exp": "Chitrakote Falls in Bastar district is the widest waterfall in India (approx 300 meters during monsoons)."}
        ]
    },
    {
        "id": "goa", "type": "state", "name": "Goa", "capital": "Panaji",
        "formationDate": "30 May 1987", "areaSqKm": 3702, "districtsCount": 2,
        "officialLanguages": ["Konkani"], "highCourt": "Bombay High Court (Panaji Bench)",
        "chiefMinister": "Pramod Sawant", "governorOrLtGovernor": "P. S. Sreedharan Pillai", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Gaur", "bird": "Flame-throated bulbul", "flower": "Jasmine", "tree": "Matti"},
        "summary": "India's smallest state by area. Liberated from Portuguese colonial rule on 19 December 1961 (Operation Vijay). World-renowned for beaches, churches, and cashew feni.",
        "dance": "Fugdi, Dhalo, Dekhnni, Kunbi", "festivals": "Goa Carnival, Shigmo, Feast of St. Francis Xavier, Sao Joao",
        "rivers": "Mandovi, Zuari, Chapora, Terekhol, Sal", "minerals": "Iron Ore, Manganese, Bauxite",
        "monuments": "Basilica of Bom Jesus (UNESCO Site), Se Cathedral, Aguada Fort, Chapora Fort, Dudhsagar Falls",
        "nationalParks": "Bhagwan Mahaveer Sanctuary & Mollem National Park, Salim Ali Bird Sanctuary",
        "schemes": "Griha Adhar Scheme, Mukhyamantri Devdarshan Yatra, Dayanand Social Security Scheme",
        "mcqs": [
            {"q": "On which date did the Indian Armed Forces liberate Goa from Portuguese rule via Operation Vijay?", "o": ["19 December 1961", "15 August 1947", "26 January 1950", "30 May 1987"], "a": 0, "exp": "Operation Vijay was conducted on 18-19 December 1961, ending 451 years of Portuguese rule in Goa."},
            {"q": "The mortal remains of which saint are preserved in the Basilica of Bom Jesus in Old Goa?", "o": ["St. Francis Xavier", "St. Thomas", "St. Ignatius of Loyola", "St. Peter"], "a": 0, "exp": "The Basilica of Bom Jesus, a UNESCO World Heritage Site, contains the sacred relics of St. Francis Xavier."}
        ]
    },
    {
        "id": "gujarat", "type": "state", "name": "Gujarat", "capital": "Gandhinagar",
        "formationDate": "1 May 1960", "areaSqKm": 196024, "districtsCount": 33,
        "officialLanguages": ["Gujarati"], "highCourt": "Gujarat High Court (Ahmedabad)",
        "chiefMinister": "Bhupendra Patel", "governorOrLtGovernor": "Acharya Devvrat", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Asiatic lion", "bird": "Greater flamingo", "flower": "Marigold", "tree": "Banyan"},
        "summary": "Has the longest coastline of any Indian state (approx 1,600 km). Birthplace of Mahatma Gandhi and Sardar Vallabhbhai Patel. Sole global home of the wild Asiatic lion in Gir National Park.",
        "dance": "Garba (UNESCO Intangible Cultural Heritage), Dandiya Raas, Bhavai", "festivals": "Navratri, Rann Utsav, Uttarayan (Kite Festival)",
        "rivers": "Narmada, Tapi, Sabarmati, Mahi", "minerals": "Petroleum (Ankleshwar, Kalol), Natural Gas, Bauxite, Salt (largest producer in India)",
        "monuments": "Statue of Unity (182m, world's tallest), Sun Temple Modhera, Rani ki Vav (Patan, UNESCO), Somnath Temple",
        "nationalParks": "Gir National Park, Blackbuck National Park (Velavadar), Marine National Park (Gulf of Kutch), Vansda",
        "schemes": "Mukhyamantri Mahila Utkarsh Yojana, Kisan Suryodaya Yojana, Namo Lakshmi Scheme",
        "mcqs": [
            {"q": "Where is the Statue of Unity, the world's tallest statue (182 meters), located?", "o": ["Kevadia (Ekta Nagar)", "Gandhinagar", "Ahmedabad", "Surat"], "a": 0, "exp": "The Statue of Unity honoring Sardar Vallabhbhai Patel is situated on Sadhu Bet island facing the Sardar Sarovar Dam."},
            {"q": "Which UNESCO World Heritage site in Gujarat is a monumental stepwell built during the Chaulukya dynasty?", "o": ["Rani ki Vav (Patan)", "Adalaj Stepwell", "Dada Harir Stepwell", "Chand Baori"], "a": 0, "exp": "Rani ki Vav in Patan was built by Queen Udayamati in memory of King Bhima I and is featured on the ₹100 note."}
        ]
    },
    {
        "id": "haryana", "type": "state", "name": "Haryana", "capital": "Chandigarh",
        "formationDate": "1 November 1966", "areaSqKm": 44212, "districtsCount": 22,
        "officialLanguages": ["Hindi"], "highCourt": "Punjab and Haryana High Court (Chandigarh)",
        "chiefMinister": "Nayab Singh Saini", "governorOrLtGovernor": "Bandaru Dattatreya", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Blackbuck", "bird": "Black francolin", "flower": "Lotus", "tree": "Peepal"},
        "summary": "Land of the epic Mahabharata battle of Kurukshetra. Major industrial and automobile powerhouse (Gurugram, Maruti Suzuki), and India's top Olympic sports medal-producing state.",
        "dance": "Dhamal, Khoria, Phag, Saang, Ragini", "festivals": "Surajkund International Crafts Mela, Gita Mahotsav, Teej",
        "rivers": "Yamuna, Ghaggar-Hakra, Markanda, Tangri", "minerals": "Limestone, Slate, Quartzite, China clay",
        "monuments": "Brahma Sarovar (Kurukshetra), Sheikh Chilli's Tomb (Thanesar), Jal Mahal (Narnaul), Pinjore Gardens",
        "nationalParks": "Sultanpur National Park (Ramsar Site), Kalesar National Park",
        "schemes": "Parivar Pehchan Patra, Mukhya Mantri Antyodaya Parivar Utthan Yojana, Chirayu Haryana",
        "mcqs": [
            {"q": "On the battlefield of which holy city in Haryana was the Bhagavad Gita spoken by Lord Krishna to Arjuna?", "o": ["Kurukshetra", "Panipat", "Thanesar", "Karnal"], "a": 0, "exp": "The sacred scripture Bhagavad Gita was delivered at Jyotisar in Kurukshetra during the Mahabharata war."},
            {"q": "Which international crafts fair is held annually in Faridabad, Haryana during February?", "o": ["Surajkund International Crafts Mela", "Pushkar Mela", "Kala Ghoda Festival", "Hornbill Festival"], "a": 0, "exp": "Surajkund Crafts Mela showcases the finest regional and international handicrafts, handlooms, and cultural folklore."}
        ]
    },
    {
        "id": "himachal_pradesh", "type": "state", "name": "Himachal Pradesh", "capital": "Shimla (Summer), Dharamshala (Winter)",
        "formationDate": "25 January 1971", "areaSqKm": 55673, "districtsCount": 12,
        "officialLanguages": ["Hindi"], "highCourt": "Himachal Pradesh High Court (Shimla)",
        "chiefMinister": "Sukhvinder Singh Sukhu", "governorOrLtGovernor": "Shiv Pratap Shukla", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Snow leopard", "bird": "Western tragopan", "flower": "Pink rhododendron", "tree": "Deodar cedar"},
        "summary": "Known as 'Dev Bhoomi' (Land of the Gods). Features high-altitude Himalayan terrain, fruit cultivation ('Apple State of India'), and Dalai Lama's central residence at McLeod Ganj.",
        "dance": "Nati (Guinness World Record folk dance), Chham, Rakshasa dance", "festivals": "Kullu Dussehra, Minjar Fair, Fagli, Losar",
        "rivers": "Chenab, Ravi, Beas, Sutlej, Yamuna", "minerals": "Limestone, Gypsum, Rock Salt (Mandi), Barite",
        "monuments": "Kalka-Shimla Toy Train (UNESCO), Hidimba Devi Temple (Manali), Kangra Fort, Tabo Monastery",
        "nationalParks": "Great Himalayan National Park (UNESCO), Pin Valley National Park, Khirganga National Park",
        "schemes": "Indira Gandhi Pyari Behna Sukh Samman Nidhi, Mukhya Mantri Swavlamban Yojana",
        "mcqs": [
            {"q": "Which UNESCO World Heritage National Park in Himachal Pradesh preserves alpine peaks and temperate biodiversity?", "o": ["Great Himalayan National Park", "Pin Valley National Park", "Jim Corbett National Park", "Hemis National Park"], "a": 0, "exp": "Great Himalayan National Park in Kullu was inscribed as a UNESCO World Heritage Site in 2014."},
            {"q": "Which folk dance of Himachal Pradesh holds a Guinness World Record for the largest gathering of dancers?", "o": ["Kullu Nati", "Giddha", "Rouf", "Bhangra"], "a": 0, "exp": "Kullu Nati entered the Guinness Book of World Records in 2016 with over 20,000 women performing together."}
        ]
    },
    {
        "id": "jharkhand", "type": "state", "name": "Jharkhand", "capital": "Ranchi",
        "formationDate": "15 November 2000", "areaSqKm": 79716, "districtsCount": 24,
        "officialLanguages": ["Hindi"], "highCourt": "Jharkhand High Court (Ranchi)",
        "chiefMinister": "Hemant Soren", "governorOrLtGovernor": "Santosh Kumar Gangwar", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Asian elephant", "bird": "Asian koel", "flower": "Palash", "tree": "Sal"},
        "summary": "Formed on the birth anniversary of tribal freedom icon Bhagwan Birsa Munda. Known as the 'Land of Forests' (Vananchal) and holds over 40% of India's mineral reserves.",
        "dance": "Chhau (Saraikela), Jhumar, Paika, Domkach", "festivals": "Sarhul, Karma, Sohrai, Tusu Parab",
        "rivers": "Subarnarekha, Damodar, Mayurakshi, North Koel", "minerals": "Coal (Jharia, Bokaro), Iron Ore (Singhbhum), Copper (Ghatsila), Uranium (Jaduguda), Mica (Koderma)",
        "monuments": "Baidyanath Temple (Deoghar Jyotirlinga), Parasnath Temple (Shikharji), Sun Temple Ranchi",
        "nationalParks": "Betla National Park, Palamau Tiger Reserve, Dalma Wildlife Sanctuary",
        "schemes": "Mukhyamantri Maiyan Samman Yojana, Abua Awas Yojana, Sarbojan Pension Yojana",
        "mcqs": [
            {"q": "Jharia coalfield, renowned for producing prime coking coal in India, is located in which district of Jharkhand?", "o": ["Dhanbad", "Ranchi", "Bokaro", "Singhbhum"], "a": 0, "exp": "Jharia in Dhanbad district is India's most significant storehouse of metallurgical coking coal."},
            {"q": "India's first and oldest uranium mine is located at which place in Jharkhand?", "o": ["Jaduguda", "Ghatsila", "Koderma", "Noamundi"], "a": 0, "exp": "Jaduguda mine in East Singhbhum began operations in 1967 and was India's first uranium mine."}
        ]
    },
    {
        "id": "karnataka", "type": "state", "name": "Karnataka", "capital": "Bengaluru",
        "formationDate": "1 November 1956", "areaSqKm": 191791, "districtsCount": 31,
        "officialLanguages": ["Kannada (Classical Language)"], "highCourt": "High Court of Karnataka (Bengaluru)",
        "chiefMinister": "Siddaramaiah", "governorOrLtGovernor": "Thawar Chand Gehlot", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Asian elephant", "bird": "Indian roller", "flower": "Lotus", "tree": "Sandalwood"},
        "summary": "Bengaluru is India's 'Silicon Valley'. Renowned for coffee, sandalwood, ISRO headquarters, and UNESCO World Heritage Sites at Hampi, Pattadakal, and the Sacred Ensembles of the Hoysalas.",
        "dance": "Yakshagana, Dollu Kunitha, Veeragase", "festivals": "Mysuru Dasara, Karaga, Hampi Utsav, Kambala (Buffalo race)",
        "rivers": "Cauvery, Krishna, Tungabhadra, Sharavathi (Jog Falls), Kabini", "minerals": "Gold (Hutti - only active gold mine in India), Iron Ore (Kudremukh), Manganese",
        "monuments": "Hampi Monuments (Vijayanagara), Pattadakal, Hoysala Temples (Belur, Halebidu, Somanathapura), Gol Gumbaz, Mysore Palace",
        "nationalParks": "Bandipur National Park, Nagarhole, Bannerghatta, Kudremukh, Anshi",
        "schemes": "Gruha Lakshmi, Yuva Nidhi, Shakthi Scheme, Anna Bhagya, Gruha Jyothi",
        "mcqs": [
            {"q": "Which city served as the capital of the medieval Vijayanagara Empire, now a UNESCO World Heritage Site in Karnataka?", "o": ["Hampi", "Badami", "Belur", "Pattadakal"], "a": 0, "exp": "Hampi on the banks of the Tungabhadra was the capital of the Vijayanagara Empire from 1336 to 1565 AD."},
            {"q": "India's only active gold-producing mine is located in which district of Karnataka?", "o": ["Hutti (Raichur)", "Kolar Gold Fields", "Chitradurga", "Ballari"], "a": 0, "exp": "Hutti Gold Mines in Raichur district is currently the only operational commercial gold-producing mine in India."}
        ]
    },
    {
        "id": "kerala", "type": "state", "name": "Kerala", "capital": "Thiruvananthapuram",
        "formationDate": "1 November 1956", "areaSqKm": 38863, "districtsCount": 14,
        "officialLanguages": ["Malayalam (Classical Language)"], "highCourt": "Kerala High Court (Kochi)",
        "chiefMinister": "Pinarayi Vijayan", "governorOrLtGovernor": "Arif Mohammed Khan", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Indian elephant", "bird": "Great hornbill", "flower": "Golden shower (Kanikkonna)", "tree": "Coconut palm"},
        "summary": "Branded as 'God's Own Country'. Highest literacy rate and highest Human Development Index (HDI) in India. World-famous backwaters, spices, Ayurveda, and Kathakali.",
        "dance": "Kathakali, Mohiniyattam (2 Classical Dances), Theyyam, Koodiyattam", "festivals": "Onam (Thiruvonam), Vishu, Thrissur Pooram",
        "rivers": "Periyar, Bharathappuzha (Nila), Pamba, Chaliyar", "minerals": "Ilmenite, Monazite sands (Thorium rich), Zircon, Rutile (Chavara)",
        "monuments": "Padmanabhaswamy Temple (world's wealthiest temple), Bekal Fort, Mattancherry Dutch Palace, Hill Palace Kochi",
        "nationalParks": "Silent Valley National Park, Eravikulam National Park (Nilgiri tahr habitat), Periyar National Park",
        "schemes": "K-FON (Kerala Fibre Optic Network), LIFE Mission, Karunya Arogya Suraksha Padhathi",
        "mcqs": [
            {"q": "Which two Indian classical dance forms out of the recognized 8 originate from Kerala?", "o": ["Kathakali and Mohiniyattam", "Bharatanatyam and Kuchipudi", "Kathak and Sattriya", "Odissi and Manipuri"], "a": 0, "exp": "Kerala is the proud home of two classical dance traditions: Kathakali and Mohiniyattam."},
            {"q": "Eravikulam National Park in Munnar is best known for preserving which endangered mountain ungulate?", "o": ["Nilgiri Tahr", "Sangai", "Hoolock Gibbon", "Takin"], "a": 0, "exp": "Eravikulam National Park holds the largest surviving wild population of the endangered Nilgiri Tahr."}
        ]
    },
    {
        "id": "madhya_pradesh", "type": "state", "name": "Madhya Pradesh", "capital": "Bhopal",
        "formationDate": "1 November 1956", "areaSqKm": 308252, "districtsCount": 55,
        "officialLanguages": ["Hindi"], "highCourt": "Madhya Pradesh High Court (Jabalpur)",
        "chiefMinister": "Mohan Yadav", "governorOrLtGovernor": "Mangubhai C. Patel", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Barasingha (Swamp deer)", "bird": "Indian paradise flycatcher (Dhudhraj)", "flower": "White lily", "tree": "Banyan"},
        "summary": "Known as the 'Heart of India' and 'Tiger State of India' (785 tigers). Home to 3 UNESCO World Heritage Sites: Khajuraho temples, Sanchi Stupa, and Bhimbetka Rock Shelters.",
        "dance": "Matki, Maanch, Jawara, Grida, Karma", "festivals": "Khajuraho Dance Festival, Tansen Samaroh (Gwalior), Lokrang",
        "rivers": "Narmada (Lifeline of MP), Chambal, Betwa, Son, Tapti, Shipra (Ujjain Simhastha Kumbh)", "minerals": "Diamond (Panna - only active diamond mine in India), Copper (Malanjkhand), Manganese (Balaghat)",
        "monuments": "Khajuraho Group of Monuments (UNESCO), Sanchi Stupa (UNESCO), Bhimbetka Caves (UNESCO), Gwalior Fort, Mahakaleshwar Jyotirlinga (Ujjain)",
        "nationalParks": "Kuno (Cheetah reintroduction), Kanha, Bandhavgarh, Panna, Pench, Satpura",
        "schemes": "Ladli Behna Yojana, Ladli Laxmi Yojana, Mukhyamantri Seekho Kamao Yojana",
        "mcqs": [
            {"q": "Where in Madhya Pradesh were African Cheetahs reintroduced to India in September 2022 under Project Cheetah?", "o": ["Kuno National Park", "Kanha National Park", "Bandhavgarh National Park", "Panna National Park"], "a": 0, "exp": "Kuno National Park in Sheopur district was chosen as the premier sanctuary for cheetah reintroduction in India."},
            {"q": "Which district of Madhya Pradesh is home to India's only active diamond producing mines?", "o": ["Panna", "Satna", "Rewa", "Chhatarpur"], "a": 0, "exp": "The Majhgawan mine in Panna is operated by NMDC and is the only mechanized diamond mine in India."}
        ]
    },
    {
        "id": "maharashtra", "type": "state", "name": "Maharashtra", "capital": "Mumbai (Summer), Nagpur (Winter)",
        "formationDate": "1 May 1960", "areaSqKm": 307713, "districtsCount": 36,
        "officialLanguages": ["Marathi (Classical Language)"], "highCourt": "Bombay High Court (Mumbai)",
        "chiefMinister": "Devendra Fadnavis", "governorOrLtGovernor": "C. P. Radhakrishnan", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Indian giant squirrel (Shekru)", "bird": "Yellow-footed green pigeon (Hariyal)", "flower": "Jarul (Pride of India)", "tree": "Mango"},
        "summary": "India's largest state economy. Mumbai is India's financial capital. Home to the Maratha Empire under Chhatrapati Shivaji Maharaj, Ajanta & Ellora caves, and Lonar impact crater lake.",
        "dance": "Lavani, Koli dance, Dhangari Gaja, Lezim, Povada", "festivals": "Ganeshotsav (celebrated grandly statewide), Gudi Padwa, Pola",
        "rivers": "Godavari (Trimbakeshwar), Krishna (Mahabaleshwar), Bhima, Tapi, Wainganga", "minerals": "Coal (Nagpur-Chandrapur), Manganese, Bauxite, Iron Ore",
        "monuments": "Ajanta Caves (UNESCO), Ellora Caves (UNESCO, Kailash Temple), Gateway of India, CSMT Railway Terminus, Raigad Fort",
        "nationalParks": "Tadoba-Andhari Tiger Reserve, Sanjay Gandhi National Park, Chandoli, Gugamal, Navegaon",
        "schemes": "Mukhyamantri Majhi Ladki Bahin Yojana, Lek Ladki Yojana, Jalyukt Shivar Abhiyan",
        "mcqs": [
            {"q": "The monolithic rock-cut Kailash Temple (Cave 16), carved from a single basalt cliff face top-down, is at which UNESCO site in Maharashtra?", "o": ["Ellora Caves", "Ajanta Caves", "Elephanta Caves", "Kanheri Caves"], "a": 0, "exp": "Cave 16 (Kailash Temple) at Ellora was built in the 8th century by Rashtrakuta King Krishna I."},
            {"q": "Which unique natural hyper-velocity meteorite impact crater lake in basaltic rock is located in Maharashtra?", "o": ["Lonar Lake", "Venna Lake", "Pashan Lake", "Rankala Lake"], "a": 0, "exp": "Lonar Lake in Buldhana district was created by an astronomical meteorite collision during the Pleistocene Epoch."}
        ]
    },
    {
        "id": "manipur", "type": "state", "name": "Manipur", "capital": "Imphal",
        "formationDate": "21 January 1972", "areaSqKm": 22327, "districtsCount": 16,
        "officialLanguages": ["Manipuri (Meitei)"], "highCourt": "High Court of Manipur (Imphal)",
        "chiefMinister": "N. Biren Singh", "governorOrLtGovernor": "Lakshman Prasad Acharya (Addl. Charge)", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Sangai (Brow-antlered deer)", "bird": "Mrs. Hume's pheasant", "flower": "Shirui lily", "tree": "Uningthou"},
        "summary": "Known as the 'Jewel of India'. Home to Loktak Lake, the largest freshwater lake in Northeast India, featuring floating islands ('Phumdis') and Keibul Lamjao, the world's only floating national park.",
        "dance": "Manipuri (Classical Dance / Raslila), Thang-Ta (Martial Art), Pung Cholom", "festivals": "Yaoshang, Sangai Festival, Ningol Chakouba, Cheiraoba",
        "rivers": "Imphal, Barak, Iril, Thoubal, Manipur River", "minerals": "Chromite, Limestone, Copper",
        "monuments": "Kangla Fort, INA Memorial Complex at Moirang (where INA hoisted Indian tricolor on mainland soil in 1944)",
        "nationalParks": "Keibul Lamjao National Park (sole habitat of Sangai deer), Sirohi National Park",
        "schemes": "Chief Minister-gi Hakshelgi Tengbang (CMHT), Go to Hills Mission",
        "mcqs": [
            {"q": "Which is the only floating national park in the world, located on Loktak Lake in Manipur?", "o": ["Keibul Lamjao National Park", "Nokrek National Park", "Balphakram National Park", "Phawngpui National Park"], "a": 0, "exp": "Keibul Lamjao National Park is composed of floating biomass islands called phumdis and is the last sanctuary of the dancing Sangai deer."},
            {"q": "At which town in Manipur did Netaji Subhas Chandra Bose's Indian National Army (INA) first hoist the tricolor on Indian mainland soil on 14 April 1944?", "o": ["Moirang", "Imphal", "Churachandpur", "Ukhrul"], "a": 0, "exp": "Colonel Shaukat Malik of the INA hoisted the Indian National Flag at Moirang on 14 April 1944."}
        ]
    },
    {
        "id": "meghalaya", "type": "state", "name": "Meghalaya", "capital": "Shillong",
        "formationDate": "21 January 1972", "areaSqKm": 22429, "districtsCount": 12,
        "officialLanguages": ["English", "Khasi", "Garo"], "highCourt": "High Court of Meghalaya (Shillong)",
        "chiefMinister": "Conrad Sangma", "governorOrLtGovernor": "C. H. Vijayashankar", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Clouded leopard", "bird": "Hill myna", "flower": "Lady's slipper orchid", "tree": "White teak (Gamhar)"},
        "summary": "Known as the 'Abode of Clouds'. Home to Mawsynram (the wettest place on Earth), living root bridges handmade by Khasi tribes, and a matrilineal social lineage system.",
        "dance": "Shad Suk Mynsiem, Nongkrem Dance, Wangala (Hundred Drums Festival)", "festivals": "Wangala Festival, Shad Suk Mynsiem, Behdeinkhlam",
        "rivers": "Umiam, Umngot (Dawki - crystal clear river), Simsang, Kopili", "minerals": "Coal, Limestone, Uranium (Domiasiat), Sillimanite",
        "monuments": "Living Root Bridges of Cherrapunji, Nohkalikai Falls (tallest plunge waterfall in India, 340m), Mawsmai Cave",
        "nationalParks": "Balphakram National Park, Nokrek National Park (UNESCO Biosphere Reserve)",
        "schemes": "FOCUS Scheme, Meghalaya Health Insurance Scheme (MHIS)",
        "mcqs": [
            {"q": "Which location in Meghalaya holds the Guinness World Record for the highest average annual rainfall on Earth?", "o": ["Mawsynram", "Cherrapunji (Sohra)", "Shillong", "Tura"], "a": 0, "exp": "Mawsynram in the East Khasi Hills receives approximately 11,872 mm of rain annually, making it the wettest place on Earth."},
            {"q": "The indigenous living root bridges of Meghalaya are grown and guided across streams from the aerial roots of which tree?", "o": ["Ficus elastica (Rubber fig)", "Ficus religiosa (Peepal)", "Ficus benghalensis (Banyan)", "Bambusa vulgaris (Bamboo)"], "a": 0, "exp": "Khasi and Jaintia tribes train the aerial roots of Ficus elastica through hollow betel nut trunks across riverbanks."}
        ]
    },
    {
        "id": "mizoram", "type": "state", "name": "Mizoram", "capital": "Aizawl",
        "formationDate": "20 February 1987", "areaSqKm": 21081, "districtsCount": 11,
        "officialLanguages": ["Mizo", "English"], "highCourt": "Gauhati High Court (Aizawl Permanent Bench)",
        "chiefMinister": "Lalduhoma", "governorOrLtGovernor": "Hari Babu Kambhampati", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Himalayan serow", "bird": "Mrs. Hume's pheasant", "flower": "Red vanda", "tree": "Iron wood (Herse)"},
        "summary": "Known as the 'Land of the Hill People'. Boasts the highest percentage of forest cover among Indian states (over 85%). Famous for its Cheraw (bamboo dance) and peaceful Mizo Accord (1986).",
        "dance": "Cheraw (Bamboo Dance), Khuallam, Chheihlam, Chai", "festivals": "Chapchar Kut, Mim Kut, Pawl Kut",
        "rivers": "Tlawng, Chhimtuipui (Kaladan), Tut, Tuivawl", "minerals": "Sandstone, Limestone, Clay",
        "monuments": "Solomon's Temple (Aizawl), Vantawng Falls (highest waterfall in Mizoram, 229m), Phawngpui Blue Mountain",
        "nationalParks": "Murlen National Park, Phawngpui National Park (Blue Mountain)",
        "schemes": "Handholding Scheme (Bana Kaih), SEDP (Socio-Economic Development Policy)",
        "mcqs": [
            {"q": "Which famous traditional folk dance of Mizoram involves dancers stepping in and out between pairs of horizontal bamboo staves?", "o": ["Cheraw (Bamboo Dance)", "Khuallam", "Chheihlam", "Chai"], "a": 0, "exp": "Cheraw is an ancient dance of Mizoram where male performers rhythmically clap bamboo poles while female dancers step skillfully in between."},
            {"q": "What is the highest mountain peak in Mizoram, affectionately known as the 'Blue Mountain'?", "o": ["Phawngpui", "Saramati", "Doda Betta", "Kangchenjunga"], "a": 0, "exp": "Phawngpui (elevation 2,157 m) is the highest peak in Mizoram, reverentially called the Blue Mountain."}
        ]
    },
    {
        "id": "nagaland", "type": "state", "name": "Nagaland", "capital": "Kohima",
        "formationDate": "1 December 1963", "areaSqKm": 16579, "districtsCount": 16,
        "officialLanguages": ["English"], "highCourt": "Gauhati High Court (Kohima Bench)",
        "chiefMinister": "Neiphiu Rio", "governorOrLtGovernor": "La. Ganesan", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Mithun", "bird": "Blyth's tragopan", "flower": "Tree rhododendron", "tree": "Alder"},
        "summary": "Known as the 'Land of Festivals'. Home to 16 recognized indigenous major tribes, famous for the world-renowned Hornbill Festival celebrated annually from December 1 to 10.",
        "dance": "War Dance, Modse, Zeliang dance, Chang Lo", "festivals": "Hornbill Festival ('Festival of Festivals'), Moatsu (Ao), Sekrenyi (Angami), Tokhu Emong (Lotha)",
        "rivers": "Doyang, Dhansiri, Dikhu, Tizu", "minerals": "Coal, Limestone, Petroleum (Wokha), Magnetite",
        "monuments": "Kohima War Cemetery (Commonwealth, famous Kohima epitaph), Kachari Ruins at Dimapur, Dzukou Valley",
        "nationalParks": "Ntangki National Park, Fakim Wildlife Sanctuary",
        "schemes": "Chief Minister's Micro Finance Initiative, Chief Minister's Health Insurance Scheme (CMHIS)",
        "mcqs": [
            {"q": "The world-famous 'Hornbill Festival' of Nagaland is celebrated annually at which heritage village near Kohima?", "o": ["Kisama Heritage Village", "Khonoma Village", "Dzukou Valley", "Mokokchung"], "a": 0, "exp": "The Hornbill Festival is held from 1-10 December every year at the Naga Heritage Village in Kisama."},
            {"q": "Which village in Nagaland is celebrated as Asia's first green village for its community-driven ecological and wildlife conservation?", "o": ["Khonoma", "Longwa", "Tuophema", "Dzuleke"], "a": 0, "exp": "Khonoma village of the Angami tribe banned logging and hunting in 1998, pioneering the Khonoma Nature Conservation and Tragopan Sanctuary."}
        ]
    },
    {
        "id": "odisha", "type": "state", "name": "Odisha", "capital": "Bhubaneswar",
        "formationDate": "1 April 1936", "areaSqKm": 155707, "districtsCount": 30,
        "officialLanguages": ["Odia (Classical Language)"], "highCourt": "Orissa High Court (Cuttack)",
        "chiefMinister": "Mohan Charan Majhi", "governorOrLtGovernor": "Raghubar Das", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Sambar deer", "bird": "Indian roller", "flower": "Ashoka", "tree": "Sacred fig (Peepal)"},
        "summary": "Originally Kalinga, whose battlefield converted Emperor Ashoka to Buddhism (261 BCE). Home to Sun Temple Konark, Jagannath Temple Puri, Chilika Lake, and Olive Ridley sea turtle nesting.",
        "dance": "Odissi (Classical Dance), Chhau (Mayurbhanj), Gotipua, Sambalpuri", "festivals": "Rath Yatra (Puri Chariot Festival), Nuakhai, Raja Parba, Bali Jatra",
        "rivers": "Mahanadi (Hirakud Dam), Brahmani, Baitarani, Subarnarekha, Rushikulya", "minerals": "Iron Ore (Mayurbhanj, Keonjhar), Bauxite (Panchpatmali), Chromite (Sukinda), Coal (Talcher)",
        "monuments": "Konark Sun Temple (Black Pagoda, UNESCO), Jagannath Temple Puri, Lingaraj Temple, Dhauli Shanti Stupa",
        "nationalParks": "Similipal National Park (Biosphere Reserve), Bhitarkanika National Park",
        "schemes": "Subhadra Yojana, Biju Swasthya Kalyan Yojana, KALIA Scheme",
        "mcqs": [
            {"q": "Which 13th-century temple in Odisha is designed as a colossal 24-wheeled chariot pulled by seven horses, known as the 'Black Pagoda'?", "o": ["Konark Sun Temple", "Jagannath Temple Puri", "Lingaraj Temple", "Rajarani Temple"], "a": 0, "exp": "Sun Temple at Konark was built around 1250 AD by King Narasimhadeva I of the Eastern Ganga Dynasty."},
            {"q": "Chilika Lake in Odisha, a designated Ramsar wetland site, is famous for which unique marine mammal species?", "o": ["Irrawaddy dolphin", "Gangetic river dolphin", "Dugong", "Finless porpoise"], "a": 0, "exp": "Chilika Lake is the primary habitat for the endangered Irrawaddy dolphin in India."}
        ]
    },
    {
        "id": "punjab", "type": "state", "name": "Punjab", "capital": "Chandigarh",
        "formationDate": "1 November 1966", "areaSqKm": 50362, "districtsCount": 23,
        "officialLanguages": ["Punjabi"], "highCourt": "Punjab and Haryana High Court (Chandigarh)",
        "chiefMinister": "Bhagwant Mann", "governorOrLtGovernor": "Gulab Chand Kataria", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Blackbuck", "bird": "Northern goshawk (Baaz)", "flower": "Gladiolus", "tree": "Sheesham (Tahli)"},
        "summary": "Land of the Five Rivers. Cradle of the Sikh faith, Granary of India, pivotal in the Green Revolution. Home to Sri Harmandir Sahib (Golden Temple), Jallianwala Bagh, and Wagah Border.",
        "dance": "Bhangra, Giddha, Jhumar, Sammi", "festivals": "Baisakhi, Lohri, Gurpurab, Hola Mohalla (Anandpur Sahib)",
        "rivers": "Sutlej (Bhakra-Nangal), Beas, Ravi", "minerals": "Silica sand, Quartzite, Gypsum",
        "monuments": "Sri Harmandir Sahib (Golden Temple, Amritsar), Jallianwala Bagh, Wagah Border, Qila Mubarak (Bathinda)",
        "nationalParks": "Harike Wetland (Ramsar Site), Abohar Wildlife Sanctuary",
        "schemes": "Aam Aadmi Clinic, Mukh Mantri Teerth Yatra, Farishtey Scheme",
        "mcqs": [
            {"q": "The foundation stone of Sri Harmandir Sahib (Golden Temple) in Amritsar was laid by which revered Sufi saint?", "o": ["Hazrat Mian Mir", "Baba Farid", "Nizamuddin Auliya", "Khwaja Moinuddin Chishti"], "a": 0, "exp": "At the invitation of Guru Arjan Dev Ji (5th Sikh Guru), Sufi saint Hazrat Mian Mir laid the foundation stone in December 1588."},
            {"q": "On which auspicious festival in Punjab did General Reginald Dyer order the infamous Jallianwala Bagh massacre on 13 April 1919?", "o": ["Baisakhi", "Lohri", "Diwali", "Hola Mohalla"], "a": 0, "exp": "Thousands of citizens assembled at Jallianwala Bagh on Baisakhi to peacefully protest the Rowlatt Act."}
        ]
    },
    {
        "id": "rajasthan", "type": "state", "name": "Rajasthan", "capital": "Jaipur (Pink City)",
        "formationDate": "30 March 1949", "areaSqKm": 342239, "districtsCount": 50,
        "officialLanguages": ["Hindi"], "highCourt": "Rajasthan High Court (Principal Seat Jodhpur, Bench Jaipur)",
        "chiefMinister": "Bhajan Lal Sharma", "governorOrLtGovernor": "Haribhau Bagade", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Chinkara & Camel", "bird": "Great Indian bustard (Godavan)", "flower": "Rohida", "tree": "Khejri (Prosopis cineraria)"},
        "summary": "India's largest state by geographic area (10.4% of country). Home to the Thar Desert, Aravalli Range (world's oldest fold mountains), Hill Forts of Rajasthan (UNESCO), and rich Rajput history.",
        "dance": "Ghoomar, Kalbelia (UNESCO Intangible Cultural Heritage), Bhavai, Chari", "festivals": "Pushkar Camel Fair, Desert Festival (Jaisalmer), Gangaur, Teej",
        "rivers": "Chambal, Banas, Luni (inland drainage), Sabarmati, Mahi", "minerals": "Zinc & Lead (Zawar - sole producer in India), Marble (Makrana), Copper (Khetri)",
        "monuments": "Hill Forts (Chittorgarh, Kumbhalgarh, Ranthambore, Amber, Jaisalmer, Gagron), Hawa Mahal, Jantar Mantar, Mehrangarh Fort",
        "nationalParks": "Ranthambore, Sariska, Keoladeo Ghana (Bharatpur Bird Sanctuary, UNESCO), Desert National Park, Mukundra Hills",
        "schemes": "Mukhyamantri Nishulk Dawa Yojana, Bhamashah / Jan Aadhaar, Chiranjeevi Health Insurance",
        "mcqs": [
            {"q": "Which traditional folk dance of the snake-charmer community in Rajasthan was inscribed on UNESCO's Representative List of Intangible Cultural Heritage in 2010?", "o": ["Kalbelia", "Ghoomar", "Chari", "Terah Taali"], "a": 0, "exp": "Kalbelia dance features sensuous, swirling movements replicating serpents, performed to the music of the Pungi and Dafla."},
            {"q": "The wall of which fort in Rajasthan is the second-longest continuous wall in the world after the Great Wall of China (36 km)?", "o": ["Kumbhalgarh Fort", "Chittorgarh Fort", "Mehrangarh Fort", "Ranthambore Fort"], "a": 0, "exp": "Kumbhalgarh Fort, built by Rana Kumbha in the Rajsamand district, features massive perimeter fortifications stretching 36 km."}
        ]
    },
    {
        "id": "sikkim", "type": "state", "name": "Sikkim", "capital": "Gangtok",
        "formationDate": "16 May 1975", "areaSqKm": 7096, "districtsCount": 6,
        "officialLanguages": ["English", "Nepali", "Bhutia", "Lepcha"], "highCourt": "High Court of Sikkim (Gangtok)",
        "chiefMinister": "Prem Singh Tamang (Golay)", "governorOrLtGovernor": "Om Prakash Mathur", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Red panda", "bird": "Blood pheasant", "flower": "Noble dendrobium", "tree": "Rhododendron"},
        "summary": "India's first 100% organic state. Home to Mount Kangchenjunga (8,586m, India's highest peak). Joined the Indian Union via the 36th Constitutional Amendment Act 1975.",
        "dance": "Singhi Chham (Snow Lion dance), Maruni, Rechungma", "festivals": "Losoong, Pang Lhabsol, Saga Dawa",
        "rivers": "Teesta (Lifeline of Sikkim), Rangit", "minerals": "Copper, Lead, Zinc, Dolomite",
        "monuments": "Rumtek Monastery, Pemayangtse Monastery, Nathu La Pass (historic Silk Route to Tibet)",
        "nationalParks": "Khangchendzonga National Park (India's ONLY Mixed World Heritage Site on UNESCO list)",
        "schemes": "One Family One Job Scheme, Aama Yojana, Vatsalya Scheme",
        "mcqs": [
            {"q": "Which national park in Sikkim holds the rare distinction of being India's first and only 'Mixed' UNESCO World Heritage Site?", "o": ["Khangchendzonga National Park", "Nanda Devi National Park", "Valley of Flowers", "Manas National Park"], "a": 0, "exp": "Khangchendzonga National Park was inscribed in 2016 under both natural and cultural criteria."},
            {"q": "Through which amendment to the Indian Constitution did Sikkim officially become the 22nd state of the Indian Union in 1975?", "o": ["36th Amendment Act", "35th Amendment Act", "42nd Amendment Act", "44th Amendment Act"], "a": 0, "exp": "The 36th Constitutional Amendment Act, 1975 made Sikkim a full-fledged 22nd state of India."}
        ]
    },
    {
        "id": "tamil_nadu", "type": "state", "name": "Tamil Nadu", "capital": "Chennai",
        "formationDate": "26 January 1950", "areaSqKm": 130058, "districtsCount": 38,
        "officialLanguages": ["Tamil (Classical Language)"], "highCourt": "Madras High Court (Chennai)",
        "chiefMinister": "M. K. Stalin", "governorOrLtGovernor": "R. N. Ravi", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Nilgiri tahr", "bird": "Emerald dove", "flower": "Gloriosa lily (Kanthal)", "tree": "Palmyra palm"},
        "summary": "Home to one of the world's oldest surviving classical civilizations and languages. Masterpieces of Dravidian temple architecture (Great Living Chola Temples), automobile capital of India ('Detroit of South Asia').",
        "dance": "Bharatanatyam (Classical Dance), Karagattam, Mayil Attam", "festivals": "Pongal (Thai Pongal, Jallikattu), Karthigai Deepam, Chithirai Festival (Madurai)",
        "rivers": "Cauvery, Vaigai, Thamirabarani, Palar", "minerals": "Lignite (Neyveli), Magnesite (Salem), Bauxite, Limestone",
        "monuments": "Brihadisvara Temple Thanjavur (Big Temple, UNESCO), Shore Temple at Mahabalipuram (UNESCO), Meenakshi Amman Temple Madurai",
        "nationalParks": "Guindy National Park, Gulf of Mannar Marine National Park, Mudumalai National Park, Mukurthi",
        "schemes": "Kalaignar Magalir Urimai Thittam, Pudhumai Penn Scheme, Chief Minister's Breakfast Scheme",
        "mcqs": [
            {"q": "The Brihadisvara Temple at Thanjavur, celebrated for its 80-tonne granite monolithic cupola, was built by which Chola monarch?", "o": ["Rajaraja Chola I", "Rajendra Chola I", "Kulothunga Chola I", "Parantaka I"], "a": 0, "exp": "Rajaraja Chola I completed the world's first complete granite temple in 1010 AD."},
            {"q": "Which classical dance form originated in the temples of Tamil Nadu, formerly known as Sadir or Dasi Attam?", "o": ["Bharatanatyam", "Kathakali", "Kuchipudi", "Mohiniyattam"], "a": 0, "exp": "Bharatanatyam is rooted in Natya Shastra by Bharata Muni and was preserved and refined by Devadasis in Tamil temples."}
        ]
    },
    {
        "id": "telangana", "type": "state", "name": "Telangana", "capital": "Hyderabad",
        "formationDate": "2 June 2014", "areaSqKm": 112077, "districtsCount": 33,
        "officialLanguages": ["Telugu (Classical Language)", "Urdu"], "highCourt": "High Court for the State of Telangana (Hyderabad)",
        "chiefMinister": "A. Revanth Reddy", "governorOrLtGovernor": "Jishnu Dev Varma", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Spotted deer (Jinka)", "bird": "Indian roller (Palapitta)", "flower": "Tangedu", "tree": "Jammi"},
        "summary": "India's 28th state, formed on 2 June 2014. Hyderabad is an IT powerhouse ('Cyberabad'), pharmaceuticals capital ('Vaccine Capital of the World'), and historic city of pearls.",
        "dance": "Perini Sivatandavam (Warrior dance of Kakatiyas), Lambadi", "festivals": "Bonalu, Bathukamma (Floral festival of women), Sammakka Saralamma Jatara (Medaram)",
        "rivers": "Godavari, Krishna, Manjira, Musi", "minerals": "Coal (Singareni Collieries - SCCL), Limestone, Bauxite",
        "monuments": "Ramappa Temple (UNESCO World Heritage Site), Charminar, Golconda Fort (Koh-i-Noor source), Warangal Fort",
        "nationalParks": "KBR National Park, Mahavir Harina Vanasthali, Mrugavani National Park",
        "schemes": "Rythu Bharosa, Mahalakshmi Scheme, Gruha Jyothi, Indiramma Indlu",
        "mcqs": [
            {"q": "Which 13th-century temple in Mulugu district of Telangana was inscribed as a UNESCO World Heritage Site in 2021 for its floating lightweight brick architecture?", "o": ["Kakatiya Rudreshwara (Ramappa) Temple", "Thousand Pillar Temple", "Bhadrakali Temple", "Alampur Navabrahma Temples"], "a": 0, "exp": "Ramappa Temple was built by General Recharla Rudra in 1213 AD during the Kakatiya period and uses sandbox foundation and floating bricks."},
            {"q": "What is the name of the grand floral festival celebrated by women across Telangana during Navratri?", "o": ["Bathukamma", "Bonalu", "Ugadi", "Medaram Jatara"], "a": 0, "exp": "Bathukamma represents cultural spirit with vibrant seasonal flowers arranged in conical layers honoring Goddess Gauri."}
        ]
    },
    {
        "id": "tripura", "type": "state", "name": "Tripura", "capital": "Agartala",
        "formationDate": "21 January 1972", "areaSqKm": 10491, "districtsCount": 8,
        "officialLanguages": ["Bengali", "Kokborok", "English"], "highCourt": "High Court of Tripura (Agartala)",
        "chiefMinister": "Manik Saha", "governorOrLtGovernor": "N. Indrasena Reddy", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Phayre's leaf monkey", "bird": "Green imperial pigeon", "flower": "Nageshwar", "tree": "Agarwood"},
        "summary": "Surrounded on three sides by Bangladesh. Ruled for centuries by the Manikya dynasty. Home to Ujjayanta Palace, the colossal rock-cut carvings of Unakoti ('Angkor Wat of North-East'), and Queen pineapple.",
        "dance": "Hojagiri (performed on an earthen pitcher), Garia, Lebang Boomani", "festivals": "Kharchi Puja (worship of 14 deities), Garia Puja, Neermahal Water Festival",
        "rivers": "Howrah, Gomati, Manu, Khowai, Feni", "minerals": "Natural Gas, Glass sand, Clay",
        "monuments": "Ujjayanta Palace, Neermahal (Water Palace in Rudrasagar Lake), Unakoti Rock Sculptures, Tripurasundari Temple",
        "nationalParks": "Clouded Leopard National Park (Sepahijala), Rajbari National Park (Bison)",
        "schemes": "Mukhyamantri Chaa Sramik Kalyan Prakalpa, Tripura Gramin Bank microcredit",
        "mcqs": [
            {"q": "Which archaeological site in Tripura features monumental 7th-9th century rock-cut Shaivite carvings, known as the 'Angkor Wat of the North-East'?", "o": ["Unakoti", "Pilak", "Devtamura", "Boxanagar"], "a": 0, "exp": "Unakoti ('one less than a crore') features massive stone reliefs, prominently the 30-foot head of Shiva."},
            {"q": "Neermahal, eastern India's only lake palace built in 1930 by Maharaja Bir Bikram Kishore Manikya, is situated in which lake?", "o": ["Rudrasagar Lake", "Dumboor Lake", "Kalyan Sagar", "Kamalasagar"], "a": 0, "exp": "Neermahal combines Hindu and Mughal architectural styles in the center of Rudrasagar Lake."}
        ]
    },
    {
        "id": "uttar_pradesh", "type": "state", "name": "Uttar Pradesh", "capital": "Lucknow",
        "formationDate": "24 January 1950", "areaSqKm": 240928, "districtsCount": 75,
        "officialLanguages": ["Hindi", "Urdu"], "highCourt": "Allahabad High Court (Prayagraj, Lucknow Bench)",
        "chiefMinister": "Yogi Adityanath", "governorOrLtGovernor": "Anandiben Patel", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Barasingha", "bird": "Sarus crane", "flower": "Palash", "tree": "Ashoka"},
        "summary": "India's most populous state (over 24 crore citizens, sends 80 MPs to Lok Sabha). Cultural core of Indo-Aryan civilization: Varanasi (world's oldest living city), Ayodhya, Mathura, Prayagraj Kumbh Mela, and the Taj Mahal.",
        "dance": "Kathak (Classical Dance), Charkula, Raslila, Nautanki, Kajari", "festivals": "Kumbh Mela (Prayagraj), Deepotsav (Ayodhya), Ganga Mahotsav, Lathmar Holi",
        "rivers": "Ganga, Yamuna, Sarayu (Ayodhya), Gomti (Lucknow), Betwa, Ken, Hindon", "minerals": "Limestone (Sonbhadra), Silica sand, Bauxite, Dolomite",
        "monuments": "Taj Mahal (UNESCO), Agra Fort (UNESCO), Fatehpur Sikri (UNESCO), Kashi Vishwanath Corridor, Ram Mandir Ayodhya, Sarnath Dhamek Stupa",
        "nationalParks": "Dudhwa National Park, Pilibhit Tiger Reserve, Ranipur Tiger Reserve",
        "schemes": "One District One Product (ODOP), Mission Shakti, Kanya Sumangala Yojana",
        "mcqs": [
            {"q": "Which classical dance form of India originated and flourished in the royal courts (Darbar) of Lucknow, Uttar Pradesh?", "o": ["Kathak", "Bharatanatyam", "Kathakali", "Manipuri"], "a": 0, "exp": "Kathak derives from the Sanskrit word 'Katha' (storytelling) and was patronized by Nawab Wajid Ali Shah of Awadh."},
            {"q": "Where did Lord Buddha preach his very first sermon (Dhammacakkappavattana Sutta) after attaining enlightenment?", "o": ["Sarnath", "Bodh Gaya", "Kushinagar", "Sravasti"], "a": 0, "exp": "Lord Buddha delivered his first sermon at the Deer Park in Sarnath near Varanasi."}
        ]
    },
    {
        "id": "uttarakhand", "type": "state", "name": "Uttarakhand", "capital": "Dehradun (Winter), Gairsain (Summer)",
        "formationDate": "9 November 2000", "areaSqKm": 53483, "districtsCount": 13,
        "officialLanguages": ["Hindi", "Sanskrit"], "highCourt": "Uttarakhand High Court (Nainital)",
        "chiefMinister": "Pushkar Singh Dhami", "governorOrLtGovernor": "Lt. Gen. Gurmit Singh", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Alpine musk deer", "bird": "Himalayan monal", "flower": "Brahma Kamal", "tree": "Burans (Rhododendron)"},
        "summary": "Known as 'Dev Bhoomi'. Source of the holy rivers Ganga (Gangotri) and Yamuna (Yamunotri). Home to the sacred Char Dham (Badrinath, Kedarnath, Gangotri, Yamunotri) and India's first Uniform Civil Code (UCC).",
        "dance": "Chholiya (Sword dance), Jhora, Chhapeli", "festivals": "Kumbh Mela (Haridwar), Nanda Devi Raj Jat, Ganga Dussehra, Phool Dei",
        "rivers": "Ganga (Bhagirathi + Alaknanda at Devprayag), Yamuna, Mandakini, Pindar", "minerals": "Limestone, Magnesite, Gypsum, Rock Phosphate",
        "monuments": "Kedarnath Temple (Jyotirlinga), Badrinath Temple, Jageshwar Temples, Tehri Dam (highest dam in India, 260.5m)",
        "nationalParks": "Jim Corbett National Park (India's oldest, est. 1936), Nanda Devi & Valley of Flowers (UNESCO)",
        "schemes": "Mukhyamantri Mahalakshmi Yojana, Ghasyari Kalyan Yojana, Uniform Civil Code (UCC)",
        "mcqs": [
            {"q": "India's first and oldest national park, established in 1936 as Hailey National Park, is situated in which district of Uttarakhand?", "o": ["Jim Corbett National Park (Nainital & Pauri)", "Rajaji National Park", "Nanda Devi National Park", "Govind National Park"], "a": 0, "exp": "Established in 1936 to protect the Bengal tiger, it was renamed Jim Corbett National Park in 1957."},
            {"q": "At which holy confluence (Prayag) do the Bhagirathi and Alaknanda rivers unite to officially become the River Ganga?", "o": ["Devprayag", "Rudraprayag", "Karnaprayag", "Vishnuprayag"], "a": 0, "exp": "At Devprayag, the Bhagirathi joins the Alaknanda, and the combined stream flows forward as the holy Ganga."}
        ]
    },
    {
        "id": "west_bengal", "type": "state", "name": "West Bengal", "capital": "Kolkata",
        "formationDate": "26 January 1950", "areaSqKm": 88752, "districtsCount": 23,
        "officialLanguages": ["Bengali (Classical Language)", "English"], "highCourt": "Calcutta High Court (Oldest High Court in India, est. 1862)",
        "chiefMinister": "Mamata Banerjee", "governorOrLtGovernor": "C. V. Ananda Bose", "governorTitle": "Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Fishing cat", "bird": "White-throated kingfisher", "flower": "Night-flowering jasmine (Shephali)", "tree": "Chatim tree"},
        "summary": "Cultural and intellectual heartland of modern India. Birthplace of Rabindranath Tagore, Swami Vivekananda, and Netaji Subhas Chandra Bose. Home to the Sundarbans (world's largest delta) and Darjeeling Himalayan Railway.",
        "dance": "Chhau (Purulia), Baul singing, Brita dance, Gambhira", "festivals": "Durga Puja (UNESCO Intangible Cultural Heritage), Poila Boishakh, Ganga Sagar Mela",
        "rivers": "Hooghly (Bhagirathi-Hooghly), Teesta, Damodar, Rupnarayan, Subarnarekha", "minerals": "Coal (Raniganj - India's oldest coalfield, 1774), China clay, Dolomite",
        "monuments": "Victoria Memorial, Howrah Bridge (Rabindra Setu), Dakshineswar Kali Temple, Santiniketan (UNESCO 2023)",
        "nationalParks": "Sundarbans National Park (UNESCO), Gorumara, Jaldapara, Singalila, Buxa",
        "schemes": "Kanyashree Prakalpa (UN Public Service First Prize), Lakshmir Bhandar, Swasthya Sathi",
        "mcqs": [
            {"q": "The Sundarbans delta, shared between West Bengal and Bangladesh, is the world's largest mangrove forest and home to which apex predator?", "o": ["Royal Bengal tiger", "Snow leopard", "Asiatic lion", "Indian leopard"], "a": 0, "exp": "The Sundarbans Mangroves are formed by the confluence of Ganga, Brahmaputra, and Meghna and house the Royal Bengal Tiger."},
            {"q": "Santiniketan, the university town founded by Maharshi Debendranath Tagore and expanded by Rabindranath Tagore, was inscribed as a UNESCO World Heritage Site in which year?", "o": ["2023", "2020", "2018", "2015"], "a": 0, "exp": "Santiniketan was designated India's 41st UNESCO World Heritage Site in September 2023."}
        ]
    },

    # 8 UNION TERRITORIES
    {
        "id": "andaman_and_nicobar", "type": "ut", "name": "Andaman and Nicobar Islands", "capital": "Port Blair (Sri Vijaya Puram)",
        "formationDate": "1 November 1956", "areaSqKm": 8249, "districtsCount": 3,
        "officialLanguages": ["Hindi", "English"], "highCourt": "Calcutta High Court (Port Blair Circuit Bench)",
        "governorOrLtGovernor": "Admiral D. K. Joshi", "governorTitle": "Lieutenant Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Dugong (Sea cow)", "bird": "Andaman wood pigeon", "flower": "Andaman pyinma", "tree": "Andaman padauk"},
        "summary": "Archipelago of 572 islands in the Bay of Bengal and Andaman Sea. Home to the historic Cellular Jail (Kala Pani), Barren Island (South Asia's only active volcano), and indigenous tribes (Sentinelese, Jarawa, Onge, Shompen).",
        "dance": "Nicobari Dance, Great Andamanese dance", "festivals": "Island Tourism Festival, Subhash Mela",
        "rivers": "Kalpong River (only river in Andaman, on North Andaman island)", "minerals": "Limestone, Silica sand",
        "monuments": "Cellular Jail National Memorial (Port Blair), Ross Island (Netaji Subhash Chandra Bose Dweep), Viper Island Gallows",
        "nationalParks": "Mahatma Gandhi Marine National Park, Campbell Bay National Park, Galathea Bay, Mount Harriet (Mount Manipur)",
        "schemes": "Andaman & Nicobar Island Integrated Development Scheme",
        "mcqs": [
            {"q": "Where is Barren Island, the only confirmed active volcano in South Asia, located?", "o": ["Andaman and Nicobar Islands", "Lakshadweep", "Gulf of Mannar", "Rann of Kutch"], "a": 0, "exp": "Barren Island is an active volcano in the Andaman Sea, about 138 km northeast of Port Blair."},
            {"q": "The historic Cellular Jail in Port Blair, where Indian freedom fighters were exiled, was infamously known by which name?", "o": ["Kala Pani", "Lal Qila", "Mandir Jail", "Tihar"], "a": 0, "exp": "Cellular Jail was referred to as 'Kala Pani' (Black Waters) due to its remote isolation across the ocean."}
        ]
    },
    {
        "id": "chandigarh", "type": "ut", "name": "Chandigarh", "capital": "Chandigarh",
        "formationDate": "1 November 1966", "areaSqKm": 114, "districtsCount": 1,
        "officialLanguages": ["English", "Hindi", "Punjabi"], "highCourt": "Punjab and Haryana High Court",
        "governorOrLtGovernor": "Gulab Chand Kataria", "governorTitle": "Administrator",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Indian grey mongoose", "bird": "Indian grey hornbill", "flower": "Palash", "tree": "Mango"},
        "summary": "India's first planned modern city post-independence, designed by Swiss-French architect Le Corbusier. Serves as the joint capital of Punjab and Haryana while functioning as a Union Territory.",
        "dance": "Bhangra, Giddha", "festivals": "Rose Festival, Mango Festival, Chandigarh Carnival",
        "rivers": "Sukhna Choe, Patiala Ki Rao", "minerals": "Nil",
        "monuments": "The Capitol Complex (UNESCO World Heritage Site), Rock Garden of Nek Chand, Sukhna Lake, Zakir Hussain Rose Garden",
        "nationalParks": "Sukhna Wildlife Sanctuary",
        "schemes": "Smart City Chandigarh Initiatives",
        "mcqs": [
            {"q": "Who was the master architect and urban planner who designed the modernist layout and Capitol Complex of Chandigarh?", "o": ["Le Corbusier", "Edwin Lutyens", "Herbert Baker", "Charles Correa"], "a": 0, "exp": "Swiss-French architect Le Corbusier designed the master plan and government buildings of Chandigarh in the 1950s."},
            {"q": "The world-famous Rock Garden in Chandigarh was secretly created out of recycled industrial and domestic waste by which visionary?", "o": ["Nek Chand Saini", "Sobha Singh", "B. V. Doshi", "Satish Gujral"], "a": 0, "exp": "Nek Chand spent nearly two decades secretly building the 40-acre sculpture park from discarded urban scrap."}
        ]
    },
    {
        "id": "dadra_and_nagar_haveli_daman_diu", "type": "ut", "name": "Dadra and Nagar Haveli and Daman and Diu", "capital": "Daman",
        "formationDate": "26 January 2020", "areaSqKm": 603, "districtsCount": 3,
        "officialLanguages": ["Gujarati", "Hindi", "English"], "highCourt": "Bombay High Court",
        "governorOrLtGovernor": "Praful Patel", "governorTitle": "Administrator",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Nil", "bird": "Nil", "flower": "Nil", "tree": "Nil"},
        "summary": "Merged on 26 January 2020 into a single Union Territory. Former Portuguese enclaves liberated in 1954 (Dadra & Nagar Haveli) and 1961 (Daman & Diu). Renowned for coastal forts and tribal culture.",
        "dance": "Tarpa Dance (Warli tribe), Mando dance", "festivals": "Nariyal Poornima, Diu Festival, Folk Dance Festival",
        "rivers": "Daman Ganga, Kolak, Kalai", "minerals": "Building stones, sand",
        "monuments": "Moti Daman Fort, Nani Daman Fort, Diu Fort (sea-facing Portuguese citadel), Naida Caves Diu, St. Paul's Church",
        "nationalParks": "Fudam Wildlife Sanctuary (Diu)",
        "schemes": "PM Awas Yojana (Urban & Rural), Integrated Island Development",
        "mcqs": [
            {"q": "Which historic sea-facing Portuguese fort in this Union Territory was besieged during the Battle of Diu in 1509 and 1538?", "o": ["Diu Fort", "Aguada Fort", "Chaul Fort", "Bassein Fort"], "a": 0, "exp": "Diu Fort is an imposing 16th-century fortress situated on the western coast commanding the Gulf of Khambhat."},
            {"q": "Tarpa dance, played with a wind instrument made from dried bottle gourd and bamboo, is celebrated by which indigenous tribe of Dadra and Nagar Haveli?", "o": ["Warli", "Gond", "Bhil", "Santhal"], "a": 0, "exp": "The Warli and Kokna tribes perform the Tarpa dance in a circular chain holding each other around the musician."}
        ]
    },
    {
        "id": "delhi", "type": "ut", "name": "Delhi (NCT)", "capital": "New Delhi",
        "formationDate": "1 February 1992 (as NCT via 69th Amendment)", "areaSqKm": 1484, "districtsCount": 11,
        "officialLanguages": ["Hindi", "English", "Urdu", "Punjabi"], "highCourt": "Delhi High Court (est. 1966)",
        "chiefMinister": "Atishi Marlena", "governorOrLtGovernor": "Vinai Kumar Saxena", "governorTitle": "Lieutenant Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Nilgai", "bird": "House sparrow", "flower": "Alfalfa", "tree": "Flamboyant (Gulmohar)"},
        "summary": "National Capital Territory of India. Seat of the Union Government, Parliament of India, and Supreme Court. Historic city built and rebuilt over millennia (Seven Historical Cities of Delhi).",
        "dance": "Kathak, Contemporary theatre", "festivals": "Republic Day Parade, Independence Day at Red Fort, Qutub Festival",
        "rivers": "Yamuna River", "minerals": "Silica sand, China clay (Southern Ridge)",
        "monuments": "Red Fort (UNESCO), Qutub Minar (UNESCO), Humayun's Tomb (UNESCO), India Gate, Rashtrapati Bhavan, Lotus Temple, Akshardham Temple",
        "nationalParks": "Asola Bhatti Wildlife Sanctuary",
        "schemes": "Mukhyamantri Mahila Samman Yojana, Free Bus Travel for Women, Delhi Solar Policy",
        "mcqs": [
            {"q": "Which monument in Delhi was the first garden-tomb on the Indian subcontinent and inspired the architecture of the Taj Mahal?", "o": ["Humayun's Tomb", "Safdarjung Tomb", "Qutub Minar", "Tomb of Iltutmish"], "a": 0, "exp": "Humayun's Tomb, built in 1569-70 by his widow Bega Begum (Haji Begum), is a designated UNESCO World Heritage Site."},
            {"q": "Through which Constitutional Amendment Act was Delhi designated as the 'National Capital Territory of Delhi' (NCT) with a Legislative Assembly in 1991?", "o": ["69th Amendment Act", "61st Amendment Act", "73rd Amendment Act", "86th Amendment Act"], "a": 0, "exp": "The 69th Constitutional Amendment Act, 1991 inserted Articles 239AA and 239AB into the Indian Constitution, creating the NCT of Delhi."}
        ]
    },
    {
        "id": "jammu_and_kashmir", "type": "ut", "name": "Jammu and Kashmir", "capital": "Srinagar (Summer), Jammu (Winter)",
        "formationDate": "31 October 2019", "areaSqKm": 42241, "districtsCount": 20,
        "officialLanguages": ["Kashmiri", "Dogri", "Urdu", "Hindi", "English"], "highCourt": "High Court of Jammu & Kashmir and Ladakh (Srinagar/Jammu)",
        "chiefMinister": "Omar Abdullah", "governorOrLtGovernor": "Manoj Sinha", "governorTitle": "Lieutenant Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Kashmir stag (Hangul)", "bird": "Kalij pheasant", "flower": "Lotus", "tree": "Chinar (Platanus orientalis)"},
        "summary": "Reorganized as a Union Territory with a Legislative Assembly on 31 October 2019. Celebrated worldwide as the 'Paradise on Earth'. Renowned for Dal Lake, saffron (Kashmiri Mongra), Pashmina wool, and Vaishno Devi shrine.",
        "dance": "Rouf, Dumhal, Kud dance, Bhand Pather", "festivals": "Tulip Festival (Indira Gandhi Memorial Tulip Garden), Shikara Festival, Navreh, Baisakhi",
        "rivers": "Jhelum (Vyath), Chenab, Tawi, Indus, Kishanganga", "minerals": "Lithium (Reasi discovery, 5.9 million tonnes), Limestone, Gypsum, Bauxite, Marble",
        "monuments": "Mata Vaishno Devi Shrine, Amarnath Cave, Shankaracharya Temple, Shalimar & Nishat Mughal Gardens, Chenab Rail Bridge (world's highest rail bridge, 359m)",
        "nationalParks": "Dachigam National Park (last home of Hangul), Kishtwar National Park, Kazinag National Park",
        "schemes": "Ayushman Bharat PM-JAY SEHAT, Mission Youth, Mumkin Scheme",
        "mcqs": [
            {"q": "Dachigam National Park near Srinagar is the primary and last surviving sanctuary for which critically endangered deer subspecies?", "o": ["Kashmir Stag (Hangul)", "Musk Deer", "Sangai", "Barasingha"], "a": 0, "exp": "Hangul (Cervus hanglu hanglu) is the state animal of J&K and strictly protected in Dachigam."},
            {"q": "The world's highest railway arch bridge (359 meters above the river bed) was constructed by Indian Railways across which river in J&K?", "o": ["Chenab River", "Jhelum River", "Ravi River", "Indus River"], "a": 0, "exp": "The Chenab Rail Bridge in Reasi district stands 359 meters above the river surface, 35 meters higher than the Eiffel Tower."}
        ]
    },
    {
        "id": "ladakh", "type": "ut", "name": "Ladakh", "capital": "Leh",
        "formationDate": "31 October 2019", "areaSqKm": 59146, "districtsCount": 2,
        "officialLanguages": ["Ladakhi", "Tibetan", "Hindi", "English"], "highCourt": "High Court of Jammu & Kashmir and Ladakh",
        "governorOrLtGovernor": "Brig. (Dr.) B. D. Mishra", "governorTitle": "Lieutenant Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Snow leopard", "bird": "Black-necked crane", "flower": "Nil", "tree": "Juniper"},
        "summary": "India's highest cold desert plateau, created as a Union Territory without legislature on 31 October 2019. Home to Pangong Tso lake, Hemis National Park, Umling La (world's highest motorable pass, 19,024 ft), and Siachen Glacier.",
        "dance": "Chham (Sacred Mask Dance), Jabro, Shondol (Royal dance)", "festivals": "Hemis Festival, Losar, Ladakh Festival, Dosmoche",
        "rivers": "Indus (Sindhu), Zanskar, Shyok, Nubra, Galwan", "minerals": "Geothermal energy (Puga Valley), Borax, Sulphur",
        "monuments": "Leh Palace, Thiksey Monastery, Hemis Gompa, Shanti Stupa, Diskit Monastery (Nubra)",
        "nationalParks": "Hemis National Park (India's largest national park and global snow leopard capital)",
        "schemes": "Carbon-Neutral Ladakh Initiative, Mission Organic Development Initiative (M.O.D.I.)",
        "mcqs": [
            {"q": "Which is the largest national park in India by geographic area, world-famous for its high concentration of wild snow leopards?", "o": ["Hemis National Park", "Desert National Park", "Gangotri National Park", "Namdapha National Park"], "a": 0, "exp": "Hemis National Park in Ladakh spans over 4,400 sq km and is India's largest designated national park."},
            {"q": "Which mountain pass in Ladakh, constructed by BRO at 19,024 feet, is officially recognized by Guinness World Records as the world's highest motorable pass?", "o": ["Umling La", "Khardung La", "Chang La", "Zoji La"], "a": 0, "exp": "Umling La pass in Eastern Ladakh was constructed by Border Roads Organisation (BRO) under Project Himank."}
        ]
    },
    {
        "id": "lakshadweep", "type": "ut", "name": "Lakshadweep", "capital": "Kavaratti",
        "formationDate": "1 November 1956", "areaSqKm": 32, "districtsCount": 1,
        "officialLanguages": ["Malayalam", "English", "Mahl (in Minicoy)"], "highCourt": "Kerala High Court (Kochi)",
        "governorOrLtGovernor": "Praful Patel", "governorTitle": "Administrator",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Butterfly fish", "bird": "Brown noddy", "flower": "Nil", "tree": "Breadfruit"},
        "summary": "India's smallest Union Territory (32 sq km), an archipelago of 36 coral atolls and submerged sand banks in the Arabian Sea. Renowned for pristine turquoise lagoons, coconut cultivation, and tuna fishing.",
        "dance": "Lava dance (Minicoy), Kolkali, Parichakali", "festivals": "Eid-ul-Fitr, Bakrid, Milad-un-Nabi",
        "rivers": "Nil (no inland rivers or streams)", "minerals": "Phosphate deposits, Coral limestone",
        "monuments": "Ujra Mosque (Kavaratti), Minicoy Island Lighthouse (est. 1885 by British)",
        "nationalParks": "Pitti Bird Sanctuary (Pakshipitti - breeding ground for pelagic birds)",
        "schemes": "Lakshadweep Tourism Development Initiatives, Desalination Water Mission",
        "mcqs": [
            {"q": "Minicoy Island in Lakshadweep is separated from the main northern Lakshadweep archipelago by which maritime channel?", "o": ["9 Degree Channel", "10 Degree Channel", "8 Degree Channel", "Palk Strait"], "a": 0, "exp": "The 9 Degree Channel separates Minicoy Island from the northern Amindivi and Laccadive groups of islands (8 Degree Channel separates Minicoy from Maldives)."},
            {"q": "Which unique language, closely related to Dhivehi spoken in the Maldives, is exclusively spoken on Minicoy Island?", "o": ["Mahl", "Malayalam", "Dakhini", "Konkani"], "a": 0, "exp": "Mahl is the maternal dialect of Minicoy inhabitants, written in the Eveyla Akuru / Thaana script."}
        ]
    },
    {
        "id": "puducherry", "type": "ut", "name": "Puducherry", "capital": "Puducherry",
        "formationDate": "16 August 1962 (De Jure transfer from France)", "areaSqKm": 492, "districtsCount": 4,
        "officialLanguages": ["Tamil", "French", "Telugu", "Malayalam", "English"], "highCourt": "Madras High Court (Chennai)",
        "chiefMinister": "N. Rangasamy", "governorOrLtGovernor": "K. Kailashnathan", "governorTitle": "Lieutenant Governor",
        "lastVerified": "2026-01-01",
        "stateSymbols": {"animal": "Indian palm squirrel", "bird": "Asian koel", "flower": "Cannonball flower (Nagalingam)", "tree": "Bael fruit tree"},
        "summary": "Comprises 4 non-contiguous geographical enclaves: Puducherry & Karaikal (in Tamil Nadu), Yanam (in Andhra Pradesh), and Mahe (in Kerala). Former French colonial capital; home to Sri Aurobindo Ashram and experimental global township Auroville.",
        "dance": "Garadi (celebrating Rama's victory over Ravana)", "festivals": "Bastille Day (14 July), Fete de Puducherry, French Food Festival",
        "rivers": "Gingee (Sankaraparani), Mahe River, Coringa (Godavari distributary in Yanam)", "minerals": "Lignite, Limestone",
        "monuments": "Auroville (Matrimandir - 'Temple of the Mother'), Sri Aurobindo Ashram, Promenade Beach, French Quarter (White Town)",
        "nationalParks": "Ousteri Lake (Ramsar Conservation Site)",
        "schemes": "Free Rice Scheme, Laptop distribution for higher education",
        "mcqs": [
            {"q": "Auroville, the experimental international universal township designed by French architect Roger Anger, is located near which Union Territory?", "o": ["Puducherry", "Chandigarh", "Daman", "Goa"], "a": 0, "exp": "Auroville was founded in 1968 by Mirra Alfassa ('The Mother') of Sri Aurobindo Ashram and endorsed by UNESCO."},
            {"q": "Which enclave of Puducherry, situated on the Malabar Coast of Kerala, is India's smallest district by geographic area (approx 9 sq km)?", "o": ["Mahe", "Yanam", "Karaikal", "Puducherry"], "a": 0, "exp": "Mahe in Kerala is the smallest district in India, spanning just 9 sq km."}
        ]
    }
]

# Enrich each state with 6 standardized subtopics and fact cards per PRD §3.1
all_state_summaries = []
for state in STATES_DATA:
    state_id = state["id"]
    subtopics = [
        {
            "id": "geography",
            "name": "Geography",
            "summary": f"Location, borders, physical terrain, and major river systems of {state['name']}.",
            "facts": [
                {
                    "id": f"{state_id}_geo_1",
                    "topicId": state_id,
                    "subtopicId": "geography",
                    "title": "Capital & Geographic Scope",
                    "content": f"The capital is {state['capital']}. {state['name']} covers a geographic area of {state['areaSqKm']:,} sq km across {state['districtsCount']} administrative districts.",
                    "tags": ["capital", "geography", "area"]
                },
                {
                    "id": f"{state_id}_geo_2",
                    "topicId": state_id,
                    "subtopicId": "geography",
                    "title": "Major Rivers & Drainage Systems",
                    "content": f"Key river systems flowing through the region include: {state.get('rivers', 'Local seasonal rivers and drainage basins')}.",
                    "tags": ["rivers", "water", "geography"]
                },
                {
                    "id": f"{state_id}_geo_3",
                    "topicId": state_id,
                    "subtopicId": "geography",
                    "title": "Geographical Landscape & Highlights",
                    "content": state["summary"],
                    "tags": ["terrain", "features"]
                }
            ]
        },
        {
            "id": "history_culture",
            "name": "History & Culture",
            "summary": f"Historical formation, classical/folk dances, and vibrant festivals of {state['name']}.",
            "facts": [
                {
                    "id": f"{state_id}_hist_1",
                    "topicId": state_id,
                    "subtopicId": "history_culture",
                    "title": "State Formation & Language",
                    "content": f"{state['name']} was formally instituted on {state['formationDate']}. Official language(s): {', '.join(state['officialLanguages'])}.",
                    "tags": ["formation", "history", "languages"]
                },
                {
                    "id": f"{state_id}_hist_2",
                    "topicId": state_id,
                    "subtopicId": "history_culture",
                    "title": "Dance Forms & Traditional Arts",
                    "content": f"Celebrated traditional and folk dance forms: {state.get('dance', 'Regional folk dances and music traditions')}.",
                    "tags": ["dance", "culture", "arts"]
                },
                {
                    "id": f"{state_id}_hist_3",
                    "topicId": state_id,
                    "subtopicId": "history_culture",
                    "title": "Major Festivals & Celebrations",
                    "content": f"Prominent cultural festivals: {state.get('festivals', 'Traditional state festivals and melas')}.",
                    "tags": ["festivals", "culture"]
                }
            ]
        },
        {
            "id": "polity_governance",
            "name": "Government & Polity",
            "summary": f"Constitutional leadership, administrative structure, and state symbols of {state['name']}.",
            "facts": [
                {
                    "id": f"{state_id}_pol_1",
                    "topicId": state_id,
                    "subtopicId": "polity_governance",
                    "title": f"{state['governorTitle']} & Constitutional Head",
                    "content": f"The current {state['governorTitle']} is {state['governorOrLtGovernor']}.",
                    "lastVerified": state["lastVerified"],
                    "tags": ["governor", "polity", "executive"]
                },
                *(
                    [{
                        "id": f"{state_id}_pol_2",
                        "topicId": state_id,
                        "subtopicId": "polity_governance",
                        "title": "Chief Minister & Administration",
                        "content": f"The Chief Minister of {state['name']} is {state['chiefMinister']}.",
                        "lastVerified": state["lastVerified"],
                        "tags": ["chief_minister", "governance"]
                    }] if state.get("chiefMinister") else []
                ),
                {
                    "id": f"{state_id}_pol_3",
                    "topicId": state_id,
                    "subtopicId": "polity_governance",
                    "title": "High Court Jurisdiction",
                    "content": f"Judicial jurisdiction falls under {state['highCourt']}.",
                    "tags": ["high_court", "judiciary"]
                },
                {
                    "id": f"{state_id}_pol_4",
                    "topicId": state_id,
                    "subtopicId": "polity_governance",
                    "title": "Official State Symbols",
                    "content": f"State Animal: {state['stateSymbols'].get('animal', 'N/A')} | State Bird: {state['stateSymbols'].get('bird', 'N/A')} | State Flower: {state['stateSymbols'].get('flower', 'N/A')} | State Tree: {state['stateSymbols'].get('tree', 'N/A')}.",
                    "tags": ["symbols", "emblem"]
                }
            ]
        },
        {
            "id": "economy_agriculture",
            "name": "Economy & Agriculture",
            "summary": f"Natural resources, minerals, industrial clusters, and agriculture in {state['name']}.",
            "facts": [
                {
                    "id": f"{state_id}_econ_1",
                    "topicId": state_id,
                    "subtopicId": "economy_agriculture",
                    "title": "Mineral Wealth & Natural Resources",
                    "content": f"Principal minerals and resources: {state.get('minerals', 'Agricultural and regional trade produce')}.",
                    "tags": ["minerals", "resources", "economy"]
                },
                {
                    "id": f"{state_id}_econ_2",
                    "topicId": state_id,
                    "subtopicId": "economy_agriculture",
                    "title": "Economic Profile & Industries",
                    "content": f"{state['name']} plays a vital role in India's economy through key agricultural production, manufacturing corridors, and services.",
                    "tags": ["industry", "agriculture"]
                }
            ]
        },
        {
            "id": "places_monuments",
            "name": "Places, Monuments & Tourism",
            "summary": f"Heritage landmarks, national parks, and tourism attractions in {state['name']}.",
            "facts": [
                {
                    "id": f"{state_id}_tour_1",
                    "topicId": state_id,
                    "subtopicId": "places_monuments",
                    "title": "Historic Monuments & Cultural Sites",
                    "content": f"Prominent monuments and heritage landmarks: {state.get('monuments', 'Historical sites and landmarks')}.",
                    "tags": ["monuments", "heritage", "tourism"]
                },
                {
                    "id": f"{state_id}_tour_2",
                    "topicId": state_id,
                    "subtopicId": "places_monuments",
                    "title": "National Parks & Protected Areas",
                    "content": f"Key protected conservation areas: {state.get('nationalParks', 'Wildlife preserves and eco-zones')}.",
                    "tags": ["national_parks", "wildlife", "conservation"]
                }
            ]
        },
        {
            "id": "schemes_awards",
            "name": "State Schemes & Awards",
            "summary": f"Prominent welfare schemes, civic initiatives, and state honors of {state['name']}.",
            "facts": [
                {
                    "id": f"{state_id}_sch_1",
                    "topicId": state_id,
                    "subtopicId": "schemes_awards",
                    "title": "Key State Welfare Schemes",
                    "content": f"Notable welfare initiatives and government programs: {state.get('schemes', 'State public welfare and livelihood programs')}.",
                    "lastVerified": state["lastVerified"],
                    "tags": ["schemes", "welfare", "governance"]
                }
            ]
        }
    ]
    
    state["subtopics"] = subtopics
    
    state_file = os.path.join(STATES_DIR, f"{state['id']}.json")
    with open(state_file, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)
        
    all_state_summaries.append({
        "id": state["id"],
        "type": state["type"],
        "name": state["name"],
        "capital": state["capital"],
        "formationDate": state["formationDate"],
        "areaSqKm": state["areaSqKm"],
        "districtsCount": state["districtsCount"],
        "officialLanguages": state["officialLanguages"],
        "chiefMinister": state.get("chiefMinister"),
        "governorOrLtGovernor": state["governorOrLtGovernor"],
        "governorTitle": state["governorTitle"],
        "lastVerified": state["lastVerified"],
        "summary": state["summary"],
        "subtopicCount": len(subtopics),
        "mcqCount": len(state.get("mcqs", []))
    })

print(f"Generated {len(STATES_DATA)} State & UT files in {STATES_DIR}!")

# Write src/data/gk/state-gk-index.ts
state_index_ts = f"""/**
 * State GK Summary Index
 * Authoritative facts for all 28 States and 8 Union Territories (36 entries).
 */

export interface StateSummaryItem {{
  id: string;
  type: "state" | "ut";
  name: string;
  capital: string;
  formationDate: string;
  areaSqKm: number;
  districtsCount: number;
  officialLanguages: string[];
  chiefMinister?: string;
  governorOrLtGovernor: string;
  governorTitle: "Governor" | "Lieutenant Governor" | "Administrator";
  lastVerified: string;
  summary: string;
  subtopicCount: number;
  mcqCount: number;
}}

export const ALL_STATES_SUMMARY: StateSummaryItem[] = {json.dumps(all_state_summaries, ensure_ascii=False, indent=2)};
"""

with open(os.path.join(GK_DIR, "state-gk-index.ts"), "w", encoding="utf-8") as f:
    f.write(state_index_ts)
print(f"Generated {os.path.join(GK_DIR, 'state-gk-index.ts')}!")

# ----------------------------------------------------------------------
# 2. 11 INDIAN GK TOPICS
# ----------------------------------------------------------------------
NATIONAL_TOPICS = [
    {
        "id": "indian_history", "name": "Indian History", "iconName": "BookOpen",
        "summary": "From the Indus Valley Civilization and Vedic eras to Mauryan, Gupta, Mughal empires, and the Indian Freedom Struggle (1857-1947).",
        "concept": "Indian history is traditionally divided into Ancient India (Prehistoric to 750 CE), Medieval India (750 CE to 1757 CE), and Modern India (1757 CE to 1947 CE). Exam questions emphasize the Indus Valley Civilization, Vedic literature, Mauryan & Gupta golden eras, Mughal architecture & revenue systems, the 1857 Sepoy Mutiny, Indian National Congress sessions, and Gandhian freedom movements.",
        "subtopics": [
            {"id": "ancient_india", "name": "Ancient India & Indus Valley", "summary": "Harappan sites, Vedic literature, 16 Mahajanapadas, Buddhism and Jainism.", "facts": [
                {"title": "Harappa & Mohenjo-Daro Discovery", "content": "Daya Ram Sahni excavated Harappa in 1921, while R. D. Banerji discovered Mohenjo-Daro in 1922 under the leadership of Sir John Marshall.", "tags": ["ivc", "archaeology"]},
                {"title": "The Great Bath at Mohenjo-Daro", "content": "A public water tank lined with bitumen mortar, indicating advanced municipal hydraulic engineering in 2500 BCE.", "tags": ["ivc", "mohenjodaro"]},
                {"title": "Four Vedas and Vedic Corpus", "content": "Rigveda is the world's oldest religious text (1,028 hymns). Samaveda focuses on chant melody, Yajurveda on rituals, and Atharvaveda on everyday life, healing, and charms.", "tags": ["vedas", "ancient"]}
            ]},
            {"id": "medieval_india", "name": "Medieval India & Empires", "summary": "Delhi Sultanate dynasties, Mughal Empire, Maratha Empire, and Vijayanagara Empire.", "facts": [
                {"title": "Five Dynasties of Delhi Sultanate", "content": "The Delhi Sultanate (1206-1526) comprised the Slave (Mamluk), Khalji, Tughlaq, Sayyid, and Lodi dynasties, founded by Qutb-ud-din Aibak.", "tags": ["sultanate", "history"]},
                {"title": "Mughal Empire Battles of Panipat", "content": "1st Panipat (1526): Babur defeated Ibrahim Lodi. 2nd Panipat (1556): Akbar defeated Hemu. 3rd Panipat (1761): Ahmad Shah Abdali defeated the Marathas.", "tags": ["panipat", "mughals"]}
            ]},
            {"id": "modern_freedom_movement", "name": "Modern India & Freedom Movement", "summary": "1857 Revolt, Indian National Congress, Partition of Bengal, Gandhian movements.", "facts": [
                {"title": "First War of Independence (1857)", "content": "Triggered by Mangal Pandey at Barrackpore on 29 March 1857 and spreading to Meerut on 10 May 1857 against the British East India Company.", "tags": ["1857", "freedom"]},
                {"title": "Foundation of Indian National Congress", "content": "Founded in Bombay in December 1885 by Allan Octavian Hume. Womesh Chandra Bonnerjee was the first president at Gokuldas Tejpal Sanskrit College.", "tags": ["inc", "freedom"]}
            ]}
        ],
        "mcqs": [
            {"q": "Which Indus Valley site is famous for the discovery of a tidal dockyard connected to the Arabian Sea?", "o": ["Lothal", "Kalibangan", "Dholavira", "Rakhigarhi"], "a": 0, "exp": "Lothal in Gujarat had a world-famous trapezoidal brick basin serving as a tidal dockyard."},
            {"q": "Who was the Viceroy of India when the Indian National Congress was founded in 1885?", "o": ["Lord Dufferin", "Lord Curzon", "Lord Ripon", "Lord Lytton"], "a": 0, "exp": "Lord Dufferin was the Viceroy of India from 1884 to 1888."},
            {"q": "Which session of the Indian National Congress adopted the historic resolution for 'Purna Swaraj' (Complete Independence)?", "o": ["Lahore Session (1929)", "Karachi Session (1931)", "Calcutta Session (1906)", "Belgaum Session (1924)"], "a": 0, "exp": "Under the presidency of Jawaharlal Nehru, the Lahore Session of 1929 declared Purna Swaraj as Congress's ultimate goal."}
        ]
    },
    {
        "id": "indian_polity", "name": "Polity & Constitution", "iconName": "Shield",
        "summary": "Preamble, Fundamental Rights, Directive Principles, President, Parliament, Judiciary, and Constitutional Amendments.",
        "concept": "The Constitution of India is the supreme law of the land, adopted on 26 November 1949 and coming into effect on 26 January 1950. Dr. B. R. Ambedkar served as Chairman of the Drafting Committee. Key topics include Articles 12-35 (Fundamental Rights), Articles 36-51 (Directive Principles), Parliament (Lok Sabha & Rajya Sabha), Emergency provisions (Articles 352, 356, 360), and Landmark Amendments.",
        "subtopics": [
            {"id": "preamble_citizenship", "name": "Preamble, Union & Citizenship", "summary": "Preamble keywords, Reorganization of States, Articles 1 to 11.", "facts": [
                {"title": "42nd Amendment & Preamble", "content": "The 42nd Amendment Act of 1976 added the words 'Socialist', 'Secular', and 'Integrity' to the Preamble of the Indian Constitution.", "tags": ["preamble", "amendments"]},
                {"title": "Objective Resolution", "content": "Jawaharlal Nehru moved the historic Objective Resolution in the Constituent Assembly on 13 December 1946, which became the Preamble.", "tags": ["constitution", "history"]}
            ]},
            {"id": "fundamental_rights", "name": "Fundamental Rights & Duties", "summary": "Articles 12-35 (6 Fundamental Rights), Article 32 (Writs), and Article 51A.", "facts": [
                {"title": "Article 32: Heart and Soul of Constitution", "content": "Dr. B. R. Ambedkar termed Article 32 (Right to Constitutional Remedies through Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto) the 'Heart and Soul' of the Constitution.", "tags": ["writs", "rights"]},
                {"title": "Fundamental Duties (Article 51A)", "content": "Added by the 42nd Amendment in 1976 based on the Swaran Singh Committee recommendations. Currently 11 duties exist.", "tags": ["duties", "constitution"]}
            ]}
        ],
        "mcqs": [
            {"q": "Under which Article of the Indian Constitution can a citizen directly move the Supreme Court for enforcement of Fundamental Rights?", "o": ["Article 32", "Article 226", "Article 14", "Article 21"], "a": 0, "exp": "Article 32 guarantees the right to constitutional remedies through writs."},
            {"q": "Which constitutional amendment reduced the voting age in India from 21 years to 18 years for Lok Sabha and Assembly elections?", "o": ["61st Amendment Act, 1988", "42nd Amendment Act, 1976", "44th Amendment Act, 1978", "73rd Amendment Act, 1992"], "a": 0, "exp": "The 61st Constitutional Amendment Act amended Article 326, reducing voting age from 21 to 18 years."}
        ]
    },
    {
        "id": "indian_geography", "name": "Indian Geography", "iconName": "Compass",
        "summary": "Physiography, Himalayan & Peninsular river basins, Monsoons, Soils, Forests, and Mineral resources.",
        "concept": "India spans 32,87,263 sq km across the northern and eastern hemispheres. Key geographic domains include the Northern Mountains (Himalayas), Northern Plains (Indo-Gangetic), Peninsular Plateau (Deccan & Malwa), Coastal Plains, and Islands (Andaman & Nicobar, Lakshadweep). Major river systems are categorized as Himalayan (perennial) and Peninsular (rainfed).",
        "subtopics": [
            {"id": "physiography_himalayas", "name": "Physiography & Mountain Ranges", "summary": "Himadri, Himachal, Shiwalik, Western Ghats, Eastern Ghats, Aravalli, Vindhya.", "facts": [
                {"title": "Highest Peak in Mainland India", "content": "Kangchenjunga (8,586 m) in Sikkim is the highest mountain peak in undisputed Indian territory. K2 (Godwin-Austen, 8,611m) is in Pakistan-occupied Kashmir.", "tags": ["himalayas", "peaks"]},
                {"title": "Aravalli Mountain Range", "content": "The Aravalli Range running from Delhi to Gujarat is one of the oldest fold mountain systems in the world, with its highest peak at Guru Shikhar (1,722 m) in Mount Abu.", "tags": ["aravalli", "geology"]}
            ]}
        ],
        "mcqs": [
            {"q": "Which Indian river originates at Trimbakeshwar in Nashik and is frequently called 'Dakshin Ganga'?", "o": ["Godavari", "Krishna", "Cauvery", "Mahanadi"], "a": 0, "exp": "The Godavari is the longest peninsular river (1,465 km) and is revered as Dakshin Ganga."},
            {"q": "The southern-most point of the Indian Union territory is which geographical coordinate?", "o": ["Indira Point (Great Nicobar)", "Kanyakumari", "Rameswaram", "Point Calimere"], "a": 0, "exp": "Indira Point at 6°45' N latitude on Great Nicobar island is India's southernmost geographical point."}
        ]
    },
    {
        "id": "indian_economy", "name": "Indian Economy", "iconName": "TrendingUp",
        "summary": "NITI Aayog, Five Year Plans, Budget, Taxation (GST), RBI & Monetary Policy, Banking, and Agriculture.",
        "concept": "India is the world's 5th largest economy by nominal GDP and 3rd by Purchasing Power Parity (PPP). Key study areas include Five-Year Plans (1951-2017), NITI Aayog (established 1 Jan 2015), the Reserve Bank of India (established 1 April 1935 under RBI Act 1934), Monetary Policy Committee (MPC), Goods and Services Tax (GST, 101st Amendment, effective 1 July 2017), and priority sector lending.",
        "subtopics": [
            {"id": "rbi_banking", "name": "Banking & Monetary Policy", "summary": "Repo rate, Reverse repo, CRR, SLR, RBI functions, nationalization.", "facts": [
                {"title": "RBI Foundation and Nationalization", "content": "RBI was set up on 1 April 1935 based on Hilton Young Commission recommendations, and nationalized on 1 January 1949.", "tags": ["rbi", "banking"]},
                {"title": "14 Commercial Banks Nationalization (1969)", "content": "Prime Minister Indira Gandhi nationalized 14 major commercial banks with deposits exceeding ₹50 crore on 19 July 1969.", "tags": ["banks", "history"]}
            ]}
        ],
        "mcqs": [
            {"q": "When did the Goods and Services Tax (GST) officially take effect in India across all states and Union territories?", "o": ["1 July 2017", "1 April 2017", "8 November 2016", "1 January 2018"], "a": 0, "exp": "GST was launched at a midnight session of Parliament on 1 July 2017 via the 101st Constitutional Amendment Act."},
            {"q": "Which policy think tank replaced the 65-year-old Planning Commission of India on 1 January 2015?", "o": ["NITI Aayog", "National Development Council", "Finance Commission", "Economic Advisory Council"], "a": 0, "exp": "NITI Aayog (National Institution for Transforming India) was instituted on 1 January 2015 with the Prime Minister as Chairperson."}
        ]
    },
    {
        "id": "science_technology", "name": "Science & Technology", "iconName": "Zap",
        "summary": "ISRO space missions, DRDO defense systems, nuclear energy, biotechnology, and IT.",
        "concept": "India's scientific prowess is spearheaded by the Indian Space Research Organisation (ISRO, est. 15 Aug 1969), Defence Research and Development Organisation (DRDO, est. 1958), and Department of Atomic Energy (DAE). Major triumphs include Chandrayaan-3 landing at the Moon's South Pole (Shiv Shakti Point), Aditya-L1 solar observatory, Agni-V ICBM, and the indigenous Tejas fighter aircraft.",
        "subtopics": [
            {"id": "isro_missions", "name": "ISRO Space Missions", "summary": "Chandrayaan, Gaganyaan, Aditya-L1, PSLV, LVM3.", "facts": [
                {"title": "Chandrayaan-3 Historic Moon Landing", "content": "On 23 August 2023, ISRO's Chandrayaan-3 lander Vikram touched down successfully near the lunar South Pole. The landing spot was christened 'Shiv Shakti Point', and August 23 was declared National Space Day.", "lastVerified": "2026-01-01", "tags": ["isro", "chandrayaan"]},
                {"title": "First Indian Satellite Aryabhata", "content": "Launched on 19 April 1975 using a Soviet Kosmos-3M launch vehicle, named after ancient Indian mathematician-astronomer Aryabhata.", "tags": ["satellites", "isro"]}
            ]}
        ],
        "mcqs": [
            {"q": "On which date is National Space Day celebrated annually in India to commemorate the Chandrayaan-3 lunar landing?", "o": ["23 August", "15 August", "28 February", "4 October"], "a": 0, "exp": "Prime Minister Narendra Modi announced 23 August as National Space Day following the historic touchdown of Vikram lander near the Moon's south pole."},
            {"q": "Where is the headquarters of the Indian Space Research Organisation (ISRO) located?", "o": ["Bengaluru", "Hyderabad", "Thiruvananthapuram", "Ahmedabad"], "a": 0, "exp": "ISRO headquarters (Antariksh Bhavan) is located in Bengaluru, Karnataka."}
        ]
    },
    {
        "id": "sports_games", "name": "Sports & Games", "iconName": "Award",
        "summary": "Olympics, Asian Games, Commonwealth Games, Cricket World Cups, Trophies, and Major Dhyan Chand Khel Ratna.",
        "concept": "Covers India's Olympic accomplishments (from K. D. Jadhav's bronze in 1952, Abhinav Bindra's shooting gold in 2008, Neeraj Chopra's javelin golds in Tokyo 2020 & World Athletics 2023), cricket achievements (1983, 2011 ODI World Cups, 2007, 2024 T20 World Cups), domestic trophies (Ranji, Duleep, Santosh, Thomas Cup), and National Sports Day on 29 August.",
        "subtopics": [
            {"id": "olympic_achievements", "name": "Olympic Records & Heroes", "summary": "Individual golds, hockey dominance, athletics milestones.", "facts": [
                {"title": "Neeraj Chopra Olympic Gold", "content": "Neeraj Chopra won independent India's first-ever Olympic track and field gold medal in Men's Javelin Throw at Tokyo 2020 with an 87.58 m throw.", "tags": ["olympics", "athletics"]},
                {"title": "Abhinav Bindra First Individual Gold", "content": "Abhinav Bindra won India's first-ever individual Olympic gold medal in the 10m Air Rifle event at Beijing 2008.", "tags": ["olympics", "shooting"]}
            ]}
        ],
        "mcqs": [
            {"q": "National Sports Day in India is celebrated every year on August 29 in commemoration of the birth anniversary of which legend?", "o": ["Major Dhyan Chand", "Milkha Singh", "K. D. Jadhav", "Balbir Singh Sr."], "a": 0, "exp": "Major Dhyan Chand, the 'Wizard of Hockey', led India to Olympic gold medals in 1928, 1932, and 1936."},
            {"q": "Who was the first Indian woman to win an Olympic medal?", "o": ["Karnam Malleswari", "Mary Kom", "Saina Nehwal", "P. V. Sindhu"], "a": 0, "exp": "Weightlifter Karnam Malleswari won bronze in the 69 kg weightlifting category at the Sydney 2000 Olympics."}
        ]
    },
    {
        "id": "books_authors", "name": "Books & Authors", "iconName": "Book",
        "summary": "Ancient Sanskrit classics, Freedom struggle memoirs, and contemporary Booker and Sahitya Akademi prize-winners.",
        "concept": "Frequently asked category covering classical works (Arthashastra by Chanakya, Shakuntala by Kalidasa, Rajatarangini by Kalhana), independence-era literature (Discovery of India by Nehru, Hind Swaraj by Gandhi, Anandamath by Bankim Chandra Chattopadhyay), and modern Booker winners (Arundhati Roy, Aravind Adiga, Salman Rushdie, Geetanjali Shree).",
        "subtopics": [
            {"id": "classical_ancient_books", "name": "Classical & Medieval Classics", "summary": "Chanakya, Kalidasa, Banabhatta, Kalhana, Panini.", "facts": [
                {"title": "Rajatarangini: History of Kashmir", "content": "Written in Sanskrit verse by Kalhana in 1148-1150 CE, considered India's first systematic historical chronicle.", "tags": ["kashmir", "history"]},
                {"title": "Ashtadhyayi: Foundation of Sanskrit Grammar", "content": "Composed by ancient grammarian Panini around the 5th-6th century BCE, defining 3,959 sutras on phonology and morphology.", "tags": ["sanskrit", "grammar"]}
            ]}
        ],
        "mcqs": [
            {"q": "Who authored the famous novel 'Anandamath', which contains India's national song 'Vande Mataram'?", "o": ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarat Chandra Chattopadhyay", "Michael Madhusudan Dutt"], "a": 0, "exp": "Bankim Chandra Chattopadhyay published Anandamath in 1882 based on the Sannyasi Rebellion."},
            {"q": "Who wrote 'The Discovery of India' while imprisoned by the British at Ahmednagar Fort between 1942 and 1946?", "o": ["Jawaharlal Nehru", "Mahatma Gandhi", "Subhas Chandra Bose", "Dr. B. R. Ambedkar"], "a": 0, "exp": "Jawaharlal Nehru wrote the classic text surveying Indian culture, philosophy, and history during his detention."}
        ]
    },
    {
        "id": "awards_honours", "name": "Awards & Honours", "iconName": "Award",
        "summary": "Civilian awards (Bharat Ratna, Padma), Gallantry awards, Literary, Cinema, and Sports honours.",
        "concept": "Covers highest civilian honours (Bharat Ratna instituted 1954, first awarded to C. Rajagopalachari, S. Radhakrishnan, C. V. Raman), Padma Vibhushan, Padma Bhushan, Padma Shri, wartime gallantry (Param Vir Chakra, Maha Vir Chakra, Vir Chakra), peacetime gallantry (Ashoka Chakra, Kirti Chakra, Shaurya Chakra), and cultural honours (Dadasaheb Phalke, Jnanpith).",
        "subtopics": [
            {"id": "civilian_awards", "name": "Civilian Honours & Bharat Ratna", "summary": "Bharat Ratna order of precedence, recipients, regulations.", "facts": [
                {"title": "First Bharat Ratna Recipients (1954)", "content": "Awarded to scholar-statesman C. Rajagopalachari, philosopher-president Dr. S. Radhakrishnan, and Nobel laureate physicist Dr. C. V. Raman.", "tags": ["bharat_ratna", "civilian"]},
                {"title": "Foreign Recipients of Bharat Ratna", "content": "Only two non-Indian citizens have received the Bharat Ratna: Khan Abdul Ghaffar Khan (1987) and Nelson Mandela (1990).", "tags": ["bharat_ratna", "international"]}
            ]}
        ],
        "mcqs": [
            {"q": "What is the highest wartime military gallantry decoration awarded in the Republic of India?", "o": ["Param Vir Chakra", "Maha Vir Chakra", "Ashoka Chakra", "Kirti Chakra"], "a": 0, "exp": "The Param Vir Chakra (PVC) is India's highest military decoration for most conspicuous bravery in the presence of the enemy. Major Somnath Sharma was its first recipient."},
            {"q": "Who was the first recipient of the prestigious Dadasaheb Phalke Award, India's highest cinema honor, in 1969?", "o": ["Devika Rani", "Prithviraj Kapoor", "Satyajit Ray", "Lata Mangeshkar"], "a": 0, "exp": "Actress Devika Rani, widely regarded as the 'First Lady of Indian Cinema', received the inaugural award in 1969."}
        ]
    },
    {
        "id": "important_days", "name": "Important National Days", "iconName": "Calendar",
        "summary": "Commemorative national days, anniversaries, and associated historical events.",
        "concept": "Questions in competitive exams test knowledge of key national observances: National Youth Day (12 Jan), Republic Day (26 Jan), National Science Day (28 Feb), National Panchayati Raj Day (24 Apr), Kargil Vijay Diwas (26 Jul), National Sports Day (29 Aug), Hindi Diwas (14 Sep), National Unity Day (31 Oct), and Constitution Day (26 Nov).",
        "subtopics": [
            {"id": "national_observances", "name": "National Observances & Significance", "summary": "Dates, origins, historical context, and themes.", "facts": [
                {"title": "National Science Day (28 February)", "content": "Commemorates the discovery of the Raman Effect by Sir C. V. Raman on 28 February 1928, for which he received the 1930 Nobel Prize in Physics.", "tags": ["science", "raman_effect"]},
                {"title": "Constitution Day (26 November)", "content": "Commemorates the adoption of the Constitution of India by the Constituent Assembly on 26 November 1949, officially instituted in 2015.", "tags": ["constitution", "polity"]}
            ]}
        ],
        "mcqs": [
            {"q": "National Youth Day is celebrated on 12 January every year across India in honor of the birth anniversary of which icon?", "o": ["Swami Vivekananda", "Bhagat Singh", "Subhas Chandra Bose", "Rabindranath Tagore"], "a": 0, "exp": "Government of India declared Swami Vivekananda's birth date (12 January) as National Youth Day in 1984."},
            {"q": "National Unity Day (Rashtriya Ekta Diwas) on October 31 marks the birth anniversary of which architect of Indian national integration?", "o": ["Sardar Vallabhbhai Patel", "B. R. Ambedkar", "Jawaharlal Nehru", "Lal Bahadur Shastri"], "a": 0, "exp": "National Unity Day honors the Iron Man of India, Sardar Patel, who unified over 560 princely states into the Indian Union."}
        ]
    },
    {
        "id": "national_parks_wildlife", "name": "National Parks & Wildlife", "iconName": "Shield",
        "summary": "Tiger reserves, elephant reserves, biosphere reserves, Ramsar wetland sites, and endangered fauna.",
        "concept": "India hosts over 106 National Parks, 570+ Wildlife Sanctuaries, 55 Tiger Reserves (under Project Tiger, launched 1 April 1973), 18 Biosphere Reserves, and 85 Ramsar wetland sites. Key species studied include the Royal Bengal Tiger, Asian Elephant, Great Indian Rhinoceros, Asiatic Lion, Snow Leopard, and Nilgiri Tahr.",
        "subtopics": [
            {"id": "tiger_reserves_parks", "name": "Tiger Reserves & Bio-Sanctuaries", "summary": "Project Tiger, core habitats, megafauna.", "facts": [
                {"title": "Project Tiger Golden Jubilee", "content": "Launched on 1 April 1973 at Jim Corbett National Park under Prime Minister Indira Gandhi with Kailash Sankhala as first director. As of the 2022 census, India is home to 3,682 tigers (over 75% of world population).", "lastVerified": "2026-01-01", "tags": ["project_tiger", "wildlife"]},
                {"title": "Nilgiri Biosphere Reserve", "content": "Designated in 1986 as India's first Biosphere Reserve, spanning the Western Ghats across Tamil Nadu, Kerala, and Karnataka.", "tags": ["biosphere", "ecology"]}
            ]}
        ],
        "mcqs": [
            {"q": "Which is the largest mangrove tiger habitat and the only mangrove forest in the world inhabited by wild tigers?", "o": ["Sundarbans National Park", "Bhitarkanika National Park", "Pichavaram Mangroves", "Coringa Sanctuary"], "a": 0, "exp": "The Sundarbans delta in West Bengal is the world's largest contiguous mangrove ecosystem and tiger habitat."},
            {"q": "Kaziranga National Park in Assam is globally celebrated for housing two-thirds of the total world population of which animal?", "o": ["Great Indian One-horned Rhinoceros", "Wild Asian Water Buffalo", "Golden Langur", "Clouded Leopard"], "a": 0, "exp": "Kaziranga National Park is a UNESCO World Heritage Site with the highest concentration of greater one-horned rhinos in the world."}
        ]
    },
    {
        "id": "static_gk_superlatives", "name": "Static GK & First in India", "iconName": "Eye",
        "summary": "First officeholders, highest/longest/largest geographical wonders, national emblems, and superlatives.",
        "concept": "Foundational high-yield facts: First President (Dr. Rajendra Prasad), First PM (Jawaharlal Nehru), First Woman President (Pratibha Patil), First Woman PM (Indira Gandhi), First Chief Justice (H. J. Kania), First Chief Election Commissioner (Sukumar Sen). Superlatives: Highest dam (Tehri, 260.5m), Longest dam (Hirakud, 25.8 km), Longest river bridge (Bhupen Hazarika Setu, 9.15 km), Highest peak (Kangchenjunga).",
        "subtopics": [
            {"id": "first_in_india", "name": "First Dignitaries & Pioneers", "summary": "Pioneering Indian personalities in administration, science, and judiciary.", "facts": [
                {"title": "First Chief Election Commissioner", "content": "Sukumar Sen served as India's first Chief Election Commissioner from 1950 to 1958, conducting the historic first General Elections of 1951-52.", "tags": ["first", "election"]},
                {"title": "First Woman Judge of the Supreme Court", "content": "Justice M. Fathima Beevi was appointed as the first female judge of the Supreme Court of India in October 1989.", "tags": ["first", "judiciary"]}
            ]}
        ],
        "mcqs": [
            {"q": "Who was the first Indian to travel to outer space aboard Soviet mission Soyuz T-11 in April 1984?", "o": ["Wing Commander Rakesh Sharma", "Kalpana Chawla", "Sunita Williams", "Ravish Malhotra"], "a": 0, "exp": "Wing Commander Rakesh Sharma spent 7 days, 21 hours and 40 minutes aboard the Salyut 7 orbital space station in 1984."},
            {"q": "Which is the highest dam in India, constructed across the Bhagirathi River in Uttarakhand?", "o": ["Tehri Dam (260.5 m)", "Bhakra Dam", "Sardar Sarovar Dam", "Hirakud Dam"], "a": 0, "exp": "Tehri Dam on the Bhagirathi River in New Tehri, Uttarakhand, is India's highest and the 4th highest dam in the world."}
        ]
    }
]

# Write Indian GK topic files
all_national_summaries = []
for topic in NATIONAL_TOPICS:
    topic_file = os.path.join(NATIONAL_DIR, f"{topic['id']}.json")
    with open(topic_file, "w", encoding="utf-8") as f:
        json.dump(topic, f, ensure_ascii=False, indent=2)
        
    all_national_summaries.append({
        "id": topic["id"],
        "domain": "gk",
        "gkCategory": "national",
        "name": topic["name"],
        "iconName": topic["iconName"],
        "summary": topic["summary"],
        "subtopicCount": len(topic["subtopics"]),
        "factCount": sum(len(st["facts"]) for st in topic["subtopics"]),
        "questionCount": len(topic["mcqs"]),
        "subtopics": [{"id": st["id"], "name": st["name"], "factCount": len(st["facts"]), "questionCount": len(topic["mcqs"])} for st in topic["subtopics"]]
    })

print(f"Generated {len(NATIONAL_TOPICS)} Indian GK topic files in {NATIONAL_DIR}!")

national_index_ts = f"""/**
 * Indian GK Summary Index
 * Authoritative topics covering national heritage, polity, geography, economy, and science.
 */
import {{ GKTopicSummary }} from "./gk-types";

export const ALL_NATIONAL_TOPICS_SUMMARY: GKTopicSummary[] = {json.dumps(all_national_summaries, ensure_ascii=False, indent=2)};
"""

with open(os.path.join(GK_DIR, "national-gk-index.ts"), "w", encoding="utf-8") as f:
    f.write(national_index_ts)
print(f"Generated {os.path.join(GK_DIR, 'national-gk-index.ts')}!")

# ----------------------------------------------------------------------
# 3. 6 WORLD GK TOPICS
# ----------------------------------------------------------------------
WORLD_TOPICS = [
    {
        "id": "world_geography", "name": "World Geography", "iconName": "Compass",
        "summary": "Continents, oceans, deepest trenches, major mountain ranges, straits, canals, and deserts.",
        "concept": "Covers physical geography of Earth's 7 continents and 5 oceans. Key topics include the Mariana Trench (deepest oceanic trench, ~11,034m in Pacific), the Nile and Amazon rivers, the Andes (longest mountain chain) and Himalayas (highest), the Sahara (largest hot desert) and Antarctica (largest polar desert), and strategic maritime chokepoints: Suez Canal, Panama Canal, Strait of Malacca, Strait of Gibraltar, and Strait of Hormuz.",
        "subtopics": [
            {"id": "oceans_straits_canals", "name": "Oceans, Strategic Straits & Canals", "summary": "Chokepoints connecting oceans and seas.", "facts": [
                {"title": "Suez Canal Maritime Gateway", "content": "Opened in November 1869 across the Isthmus of Suez in Egypt, directly connecting the Mediterranean Sea to the Red Sea.", "tags": ["canals", "suez"]},
                {"title": "Strait of Malacca", "content": "Narrow stretch of water between the Malay Peninsula and the Indonesian island of Sumatra, the world's busiest maritime oil transit route connecting Indian and Pacific Oceans.", "tags": ["straits", "shipping"]}
            ]}
        ],
        "mcqs": [
            {"q": "Which is the deepest oceanic trench on Earth, plunging approximately 11,000 meters below sea level in the western Pacific Ocean?", "o": ["Mariana Trench (Challenger Deep)", "Java Trench", "Puerto Rico Trench", "Sunda Trench"], "a": 0, "exp": "Challenger Deep in the Mariana Trench is the deepest known point on Earth."},
            {"q": "Which man-made artificial waterway opened in 1914 connects the Atlantic Ocean with the Pacific Ocean across Central America?", "o": ["Panama Canal", "Suez Canal", "Kiel Canal", "Erie Canal"], "a": 0, "exp": "The 82-kilometer Panama Canal cuts across the Isthmus of Panama, dramatically shortening oceanic voyage times."}
        ]
    },
    {
        "id": "countries_capitals_currencies", "name": "Countries, Capitals & Currencies", "iconName": "Compass",
        "summary": "Global nations, their administrative capitals, national currencies, and regional blocs.",
        "concept": "Systematic index of sovereign nations and territorial capitals across Asia, Europe, Africa, Americas, and Oceania. Commonly examined pairings include Japan (Tokyo, Yen), Russia (Moscow, Ruble), South Korea (Seoul, Won), UK (London, Pound Sterling), China (Beijing, Renminbi/Yuan), Brazil (Brasília, Real), South Africa (Pretoria/Cape Town/Bloemfontein, Rand), and Australia (Canberra, Australian Dollar).",
        "subtopics": [
            {"id": "major_world_capitals", "name": "Key Global Nations & Currencies", "summary": "Major trading economies, G20 nations, and neighboring states.", "facts": [
                {"title": "South Africa's Three Capital Cities", "content": "South Africa has three official capitals: Pretoria (Executive/Administrative), Cape Town (Legislative), and Bloemfontein (Judicial).", "tags": ["capitals", "africa"]},
                {"title": "Eurozone Currency Area", "content": "The Euro (€) is the official common currency utilized by 20 of the 27 European Union member states (Croatia joined as 20th member in Jan 2023).", "lastVerified": "2026-01-01", "tags": ["europe", "currency"]}
            ]}
        ],
        "mcqs": [
            {"q": "What is the official capital city of Australia?", "o": ["Canberra", "Sydney", "Melbourne", "Brisbane"], "a": 0, "exp": "Canberra was selected as the purpose-built federal capital in 1908 as a compromise between rival cities Sydney and Melbourne."},
            {"q": "What is the official national currency of South Korea?", "o": ["South Korean Won (KRW)", "Yen", "Yuan", "Ringgit"], "a": 0, "exp": "The Won (symbol: ₩) is the currency of South Korea, issued by the Bank of Korea."}
        ]
    },
    {
        "id": "international_organizations", "name": "International Organizations", "iconName": "Shield",
        "summary": "United Nations and agencies, Bretton Woods institutions (IMF, World Bank), WTO, G20, BRICS, and ASEAN.",
        "concept": "Focuses on multilateral institutions governing international law, trade, and geopolitics. United Nations (founded 24 Oct 1945, New York HQ), International Court of Justice (The Hague), WHO (Geneva), UNESCO (Paris), IMF and World Bank (Washington D.C.), WTO (Geneva), BRICS (Brazil, Russia, India, China, South Africa + new members), ASEAN (Jakarta), and SAARC (Kathmandu).",
        "subtopics": [
            {"id": "united_nations_system", "name": "United Nations & Global Agencies", "summary": "Founding, Charter, General Assembly, Security Council, specialised agencies.", "facts": [
                {"title": "United Nations Foundation (1945)", "content": "The UN Charter was signed on 26 June 1945 in San Francisco and entered into force on 24 October 1945. India was among the original 51 founding member signatories.", "tags": ["un", "history"]},
                {"title": "International Court of Justice (ICJ)", "content": "Principal judicial organ of the UN, seated at the Peace Palace in The Hague, Netherlands (unlike other major UN organs in New York).", "tags": ["icj", "law"]}
            ]}
        ],
        "mcqs": [
            {"q": "Where is the permanent headquarters of the World Health Organization (WHO) situated?", "o": ["Geneva, Switzerland", "Paris, France", "New York, USA", "Vienna, Austria"], "a": 0, "exp": "The WHO was established on 7 April 1948 and is headquartered in Geneva, Switzerland."},
            {"q": "Where is the secretariat of the South Asian Association for Regional Cooperation (SAARC) permanently based?", "o": ["Kathmandu, Nepal", "New Delhi, India", "Dhaka, Bangladesh", "Colombo, Sri Lanka"], "a": 0, "exp": "The SAARC Secretariat was inaugurated in Kathmandu on 16 January 1987 by King Birendra Bir Bikram Shah Dev."}
        ]
    },
    {
        "id": "world_history", "name": "World History", "iconName": "BookOpen",
        "summary": "Ancient civilizations, Renaissance, French Revolution, Industrial Revolution, World Wars, and Cold War.",
        "concept": "Covers pivotal global historical epochs: Mesopotamian, Egyptian, and Greco-Roman civilizations; the European Renaissance and Scientific Revolution; the French Revolution (1789, Liberty, Equality, Fraternity); World War I (1914-1918, Treaty of Versailles); Russian Revolution (1917, Bolsheviks); World War II (1939-1945, Pearl Harbor, Hiroshima & Nagasaki); and the Cold War & Fall of the Berlin Wall (1989).",
        "subtopics": [
            {"id": "major_revolutions_wars", "name": "Revolutions & Global Conflicts", "summary": "French Revolution, World War I, World War II, Cold War.", "facts": [
                {"title": "French Revolution & Human Rights (1789)", "content": "Began with the storming of the Bastille on 14 July 1789, publishing the 'Declaration of the Rights of Man and of the Citizen' and popularizing 'Liberty, Equality, Fraternity'.", "tags": ["france", "revolution"]},
                {"title": "Treaty of Versailles (1919)", "content": "Peace treaty signed on 28 June 1919 ending World War I between Germany and the Allied Powers, which also established the League of Nations.", "tags": ["ww1", "treaty"]}
            ]}
        ],
        "mcqs": [
            {"q": "On which Japanese city was the first atomic bomb ('Little Boy') dropped by the US B-29 bomber Enola Gay on 6 August 1945?", "o": ["Hiroshima", "Nagasaki", "Tokyo", "Kyoto"], "a": 0, "exp": "The first wartime nuclear weapon was detonated over Hiroshima on 6 August 1945, followed by Nagasaki on 9 August."},
            {"q": "The storming of which medieval fortress and political prison on 14 July 1789 marked the outbreak of the French Revolution?", "o": ["Bastille", "Tuileries Palace", "Versailles", "Conciergerie"], "a": 0, "exp": "The storming of the Bastille became the defining flashpoint of the French Revolution, commemorated annually as Bastille Day."}
        ]
    },
    {
        "id": "world_important_days", "name": "Important World Days", "iconName": "Calendar",
        "summary": "United Nations international days, global environmental dates, and human rights anniversaries.",
        "concept": "Key international observances celebrated globally: International Women's Day (8 March), World Water Day (22 March), World Health Day (7 April), Earth Day (22 April), World Environment Day (5 June), International Day of Yoga (21 June), World Ozone Day (16 September), and Human Rights Day (10 December).",
        "subtopics": [
            {"id": "un_international_days", "name": "Global Observances & Origins", "summary": "Dates, UN resolutions, environmental awareness, and human rights.", "facts": [
                {"title": "World Environment Day (5 June)", "content": "Led by the United Nations Environment Programme (UNEP) since 1973, marking the anniversary of the 1972 Stockholm Conference on the Human Environment.", "tags": ["environment", "unep"]},
                {"title": "International Day of Yoga (21 June)", "content": "Adopted unanimously by the UN General Assembly in December 2014 following a proposal by Indian Prime Minister Narendra Modi. Celebrated annually on 21 June (summer solstice).", "tags": ["yoga", "united_nations"]}
            ]}
        ],
        "mcqs": [
            {"q": "On which date is World Environment Day celebrated globally under the leadership of UNEP?", "o": ["5 June", "22 April", "21 March", "16 September"], "a": 0, "exp": "World Environment Day has been celebrated annually on 5 June since 1973."},
            {"q": "Human Rights Day is observed across the world every year on 10 December in commemoration of what event in 1948?", "o": ["Adoption of the Universal Declaration of Human Rights (UDHR)", "Foundation of the Red Cross", "Establishment of the League of Nations", "Signing of Geneva Convention"], "a": 0, "exp": "On 10 December 1948, the UN General Assembly adopted the Universal Declaration of Human Rights in Paris."}
        ]
    },
    {
        "id": "world_sports", "name": "World Sports & Tournaments", "iconName": "Award",
        "summary": "Olympic Games history, FIFA World Cup, ICC Cricket World Cup, Grand Slam Tennis, and world championship records.",
        "concept": "Chronicles the history of international sports: Modern Olympic Games (revived 1896 in Athens by Pierre de Coubertin), FIFA World Cup (first held in Uruguay in 1930), ICC Cricket World Cups, Grand Slam tennis tournaments in chronological order (Australian Open, French Open / Roland Garros, Wimbledon - oldest, 1877, US Open), and Formula One.",
        "subtopics": [
            {"id": "major_tournaments", "name": "Global Tournaments & Milestones", "summary": "Olympics, FIFA World Cup, Tennis Grand Slams.", "facts": [
                {"title": "Modern Olympic Games Revival (1896)", "content": "The first modern international Olympic Games were held in Athens, Greece, in April 1896, revived under the initiative of French baron Pierre de Coubertin.", "tags": ["olympics", "history"]},
                {"title": "Four Grand Slam Tennis Tournaments", "content": "The four Grand Slam (Major) tournaments are played in chronological sequence: Australian Open (Hard court, Jan), French Open (Clay court, May-June), Wimbledon (Grass court, July), US Open (Hard court, Aug-Sept).", "tags": ["tennis", "grand_slam"]}
            ]}
        ],
        "mcqs": [
            {"q": "Which is the oldest tennis tournament in the world, founded in 1877 and played exclusively on traditional outdoor grass courts?", "o": ["Wimbledon Championships", "Australian Open", "French Open", "US Open"], "a": 0, "exp": "The Championships, Wimbledon, was founded at the All England Club in London in 1877."},
            {"q": "Which South American nation hosted and won the inaugural FIFA Football World Cup tournament in 1930?", "o": ["Uruguay", "Brazil", "Argentina", "Chile"], "a": 0, "exp": "Uruguay hosted the first FIFA World Cup in Montevideo in 1930 and defeated Argentina 4-2 in the final."}
        ]
    }
]

# Write World GK topic files
all_world_summaries = []
for topic in WORLD_TOPICS:
    topic_file = os.path.join(WORLD_DIR, f"{topic['id']}.json")
    with open(topic_file, "w", encoding="utf-8") as f:
        json.dump(topic, f, ensure_ascii=False, indent=2)
        
    all_world_summaries.append({
        "id": topic["id"],
        "domain": "gk",
        "gkCategory": "world",
        "name": topic["name"],
        "iconName": topic["iconName"],
        "summary": topic["summary"],
        "subtopicCount": len(topic["subtopics"]),
        "factCount": sum(len(st["facts"]) for st in topic["subtopics"]),
        "questionCount": len(topic["mcqs"]),
        "subtopics": [{"id": st["id"], "name": st["name"], "factCount": len(st["facts"]), "questionCount": len(topic["mcqs"])} for st in topic["subtopics"]]
    })

print(f"Generated {len(WORLD_TOPICS)} World GK topic files in {WORLD_DIR}!")

world_index_ts = f"""/**
 * World GK Summary Index
 * Authoritative topics covering world geography, countries & currencies, global institutions, and international sports.
 */
import {{ GKTopicSummary }} from "./gk-types";

export const ALL_WORLD_TOPICS_SUMMARY: GKTopicSummary[] = {json.dumps(all_world_summaries, ensure_ascii=False, indent=2)};
"""

with open(os.path.join(GK_DIR, "world-gk-index.ts"), "w", encoding="utf-8") as f:
    f.write(world_index_ts)
print(f"Generated {os.path.join(GK_DIR, 'world-gk-index.ts')}!")

# ----------------------------------------------------------------------
# 4. CONSOLIDATE MASTER GK QUESTIONS FOR PRACTICE ENGINE
# ----------------------------------------------------------------------
master_questions = []

# Collect State questions
for state in STATES_DATA:
    for idx, mcq in enumerate(state.get("mcqs", [])):
        master_questions.append({
            "id": f"gk_state_{state['id']}_q{idx+1}",
            "domain": "gk",
            "gkCategory": "state",
            "stateId": state["id"],
            "topicId": state["id"],
            "subtopicId": f"{state['id']}_core",
            "questionType": "text",
            "questionText": mcq["q"],
            "options": mcq["o"],
            "correctIndex": mcq["a"],
            "difficulty": "medium",
            "hint": f"Reflect upon the geographic, political, and cultural heritage of {state['name']}.",
            "explanation": mcq["exp"],
            "lastVerified": state.get("lastVerified", "2026-01-01"),
            "examTags": ["ssc_cgl", "state_psc", "railway", "police"]
        })

# Collect National questions
for topic in NATIONAL_TOPICS:
    for idx, mcq in enumerate(topic.get("mcqs", [])):
        master_questions.append({
            "id": f"gk_nat_{topic['id']}_q{idx+1}",
            "domain": "gk",
            "gkCategory": "national",
            "topicId": topic["id"],
            "subtopicId": topic["subtopics"][0]["id"] if topic["subtopics"] else f"{topic['id']}_core",
            "questionType": "text",
            "questionText": mcq["q"],
            "options": mcq["o"],
            "correctIndex": mcq["a"],
            "difficulty": "medium",
            "hint": f"Consider the established historical and constitutional facts of {topic['name']}.",
            "explanation": mcq["exp"],
            "lastVerified": "2026-01-01",
            "examTags": ["ssc_cgl", "upsc_csat", "railway", "banking_ga"]
        })

# Collect World questions
for topic in WORLD_TOPICS:
    for idx, mcq in enumerate(topic.get("mcqs", [])):
        master_questions.append({
            "id": f"gk_world_{topic['id']}_q{idx+1}",
            "domain": "gk",
            "gkCategory": "world",
            "topicId": topic["id"],
            "subtopicId": topic["subtopics"][0]["id"] if topic["subtopics"] else f"{topic['id']}_core",
            "questionType": "text",
            "questionText": mcq["q"],
            "options": mcq["o"],
            "correctIndex": mcq["a"],
            "difficulty": "medium",
            "hint": f"Recall standard international treaties, geography, and global organizations for {topic['name']}.",
            "explanation": mcq["exp"],
            "lastVerified": "2026-01-01",
            "examTags": ["ssc_cgl", "railway", "defence", "banking_ga"]
        })

# Save master GK question bank
master_q_file = os.path.join(QUESTIONS_DIR, "gk_questions_master.json")
with open(master_q_file, "w", encoding="utf-8") as f:
    json.dump({
        "totalQuestions": len(master_questions),
        "generatedAt": "2026-01-01",
        "domain": "gk",
        "questions": master_questions
    }, f, ensure_ascii=False, indent=2)

print(f"Master GK question bank created with {len(master_questions)} questions at {master_q_file}!")
print("=== GK DATABASE BUILD COMPLETE ===")
