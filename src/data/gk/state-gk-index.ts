/**
 * State GK Summary Index
 * Authoritative facts for all 28 States and 8 Union Territories (36 entries).
 */

export interface StateSummaryItem {
  id: string;
  type: "state" | "ut";
  name: string;
  capital: string;
  formationDate: string;
  areaSqKm: number;
  districtsCount: number;
  officialLanguages: string[];
  chiefMinister?: string | null;
  governorOrLtGovernor: string;
  governorTitle: "Governor" | "Lieutenant Governor" | "Administrator";
  lastVerified: string;
  summary: string;
  subtopicCount: number;
  mcqCount: number;
}

export const ALL_STATES_SUMMARY: StateSummaryItem[] = [
  {
    "id": "andhra_pradesh",
    "type": "state",
    "name": "Andhra Pradesh",
    "capital": "Amaravati",
    "formationDate": "1 November 1956",
    "areaSqKm": 162968,
    "districtsCount": 26,
    "officialLanguages": [
      "Telugu"
    ],
    "chiefMinister": "N. Chandrababu Naidu",
    "governorOrLtGovernor": "S. Abdul Nazeer",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "First state formed on a linguistic basis in India (1953). Known as the 'Rice Bowl of India', home to Sriharikota spaceport (SDSC SHAR) and the Tirumala Venkateswara Temple.",
    "subtopicCount": 6,
    "mcqCount": 4
  },
  {
    "id": "arunachal_pradesh",
    "type": "state",
    "name": "Arunachal Pradesh",
    "capital": "Itanagar",
    "formationDate": "20 February 1987",
    "areaSqKm": 83743,
    "districtsCount": 26,
    "officialLanguages": [
      "English"
    ],
    "chiefMinister": "Pema Khandu",
    "governorOrLtGovernor": "Lt. Gen. Kaiwalya Trivikram Parnaik",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Known as the 'Land of Dawn-Lit Mountains', India's easternmost state bordering China, Bhutan, and Myanmar. Home to Tawang Monastery, India's largest Buddhist monastery.",
    "subtopicCount": 6,
    "mcqCount": 3
  },
  {
    "id": "assam",
    "type": "state",
    "name": "Assam",
    "capital": "Dispur",
    "formationDate": "26 January 1950",
    "areaSqKm": 78438,
    "districtsCount": 35,
    "officialLanguages": [
      "Assamese",
      "Bodo",
      "Bengali"
    ],
    "chiefMinister": "Himanta Biswa Sarma",
    "governorOrLtGovernor": "Lakshman Prasad Acharya",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "World-famous for Assam tea, Muga golden silk, petroleum (Digboi is Asia's oldest refinery), and Kaziranga National Park, the sanctuary of the Great Indian One-Horned Rhinoceros.",
    "subtopicCount": 6,
    "mcqCount": 3
  },
  {
    "id": "bihar",
    "type": "state",
    "name": "Bihar",
    "capital": "Patna",
    "formationDate": "22 March 1912",
    "areaSqKm": 94163,
    "districtsCount": 38,
    "officialLanguages": [
      "Hindi",
      "Urdu"
    ],
    "chiefMinister": "Nitish Kumar",
    "governorOrLtGovernor": "Rajendra Arlekar",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Birthplace of Buddhism and Jainism. Seat of ancient empires (Magadha, Maurya, Gupta) and world-renowned ancient universities (Nalanda and Vikramashila). Celebrates Chhath Puja.",
    "subtopicCount": 6,
    "mcqCount": 3
  },
  {
    "id": "chhattisgarh",
    "type": "state",
    "name": "Chhattisgarh",
    "capital": "Raipur",
    "formationDate": "1 November 2000",
    "areaSqKm": 135192,
    "districtsCount": 33,
    "officialLanguages": [
      "Chhattisgarhi",
      "Hindi"
    ],
    "chiefMinister": "Vishnu Deo Sai",
    "governorOrLtGovernor": "Ramen Deka",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Known as the 'Rice Bowl of Central India'. Rich in mineral resources (Tin, Coal, Iron Ore). Home to the Chitrakote Falls ('Niagara of India') on the Indravati river.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "goa",
    "type": "state",
    "name": "Goa",
    "capital": "Panaji",
    "formationDate": "30 May 1987",
    "areaSqKm": 3702,
    "districtsCount": 2,
    "officialLanguages": [
      "Konkani"
    ],
    "chiefMinister": "Pramod Sawant",
    "governorOrLtGovernor": "P. S. Sreedharan Pillai",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "India's smallest state by area. Liberated from Portuguese colonial rule on 19 December 1961 (Operation Vijay). World-renowned for beaches, churches, and cashew feni.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "gujarat",
    "type": "state",
    "name": "Gujarat",
    "capital": "Gandhinagar",
    "formationDate": "1 May 1960",
    "areaSqKm": 196024,
    "districtsCount": 33,
    "officialLanguages": [
      "Gujarati"
    ],
    "chiefMinister": "Bhupendra Patel",
    "governorOrLtGovernor": "Acharya Devvrat",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Has the longest coastline of any Indian state (approx 1,600 km). Birthplace of Mahatma Gandhi and Sardar Vallabhbhai Patel. Sole global home of the wild Asiatic lion in Gir National Park.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "haryana",
    "type": "state",
    "name": "Haryana",
    "capital": "Chandigarh",
    "formationDate": "1 November 1966",
    "areaSqKm": 44212,
    "districtsCount": 22,
    "officialLanguages": [
      "Hindi"
    ],
    "chiefMinister": "Nayab Singh Saini",
    "governorOrLtGovernor": "Bandaru Dattatreya",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Land of the epic Mahabharata battle of Kurukshetra. Major industrial and automobile powerhouse (Gurugram, Maruti Suzuki), and India's top Olympic sports medal-producing state.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "himachal_pradesh",
    "type": "state",
    "name": "Himachal Pradesh",
    "capital": "Shimla (Summer), Dharamshala (Winter)",
    "formationDate": "25 January 1971",
    "areaSqKm": 55673,
    "districtsCount": 12,
    "officialLanguages": [
      "Hindi"
    ],
    "chiefMinister": "Sukhvinder Singh Sukhu",
    "governorOrLtGovernor": "Shiv Pratap Shukla",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Known as 'Dev Bhoomi' (Land of the Gods). Features high-altitude Himalayan terrain, fruit cultivation ('Apple State of India'), and Dalai Lama's central residence at McLeod Ganj.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "jharkhand",
    "type": "state",
    "name": "Jharkhand",
    "capital": "Ranchi",
    "formationDate": "15 November 2000",
    "areaSqKm": 79716,
    "districtsCount": 24,
    "officialLanguages": [
      "Hindi"
    ],
    "chiefMinister": "Hemant Soren",
    "governorOrLtGovernor": "Santosh Kumar Gangwar",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Formed on the birth anniversary of tribal freedom icon Bhagwan Birsa Munda. Known as the 'Land of Forests' (Vananchal) and holds over 40% of India's mineral reserves.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "karnataka",
    "type": "state",
    "name": "Karnataka",
    "capital": "Bengaluru",
    "formationDate": "1 November 1956",
    "areaSqKm": 191791,
    "districtsCount": 31,
    "officialLanguages": [
      "Kannada (Classical Language)"
    ],
    "chiefMinister": "Siddaramaiah",
    "governorOrLtGovernor": "Thawar Chand Gehlot",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Bengaluru is India's 'Silicon Valley'. Renowned for coffee, sandalwood, ISRO headquarters, and UNESCO World Heritage Sites at Hampi, Pattadakal, and the Sacred Ensembles of the Hoysalas.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "kerala",
    "type": "state",
    "name": "Kerala",
    "capital": "Thiruvananthapuram",
    "formationDate": "1 November 1956",
    "areaSqKm": 38863,
    "districtsCount": 14,
    "officialLanguages": [
      "Malayalam (Classical Language)"
    ],
    "chiefMinister": "Pinarayi Vijayan",
    "governorOrLtGovernor": "Arif Mohammed Khan",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Branded as 'God's Own Country'. Highest literacy rate and highest Human Development Index (HDI) in India. World-famous backwaters, spices, Ayurveda, and Kathakali.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "madhya_pradesh",
    "type": "state",
    "name": "Madhya Pradesh",
    "capital": "Bhopal",
    "formationDate": "1 November 1956",
    "areaSqKm": 308252,
    "districtsCount": 55,
    "officialLanguages": [
      "Hindi"
    ],
    "chiefMinister": "Mohan Yadav",
    "governorOrLtGovernor": "Mangubhai C. Patel",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Known as the 'Heart of India' and 'Tiger State of India' (785 tigers). Home to 3 UNESCO World Heritage Sites: Khajuraho temples, Sanchi Stupa, and Bhimbetka Rock Shelters.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "maharashtra",
    "type": "state",
    "name": "Maharashtra",
    "capital": "Mumbai (Summer), Nagpur (Winter)",
    "formationDate": "1 May 1960",
    "areaSqKm": 307713,
    "districtsCount": 36,
    "officialLanguages": [
      "Marathi (Classical Language)"
    ],
    "chiefMinister": "Devendra Fadnavis",
    "governorOrLtGovernor": "C. P. Radhakrishnan",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "India's largest state economy. Mumbai is India's financial capital. Home to the Maratha Empire under Chhatrapati Shivaji Maharaj, Ajanta & Ellora caves, and Lonar impact crater lake.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "manipur",
    "type": "state",
    "name": "Manipur",
    "capital": "Imphal",
    "formationDate": "21 January 1972",
    "areaSqKm": 22327,
    "districtsCount": 16,
    "officialLanguages": [
      "Manipuri (Meitei)"
    ],
    "chiefMinister": "N. Biren Singh",
    "governorOrLtGovernor": "Lakshman Prasad Acharya (Addl. Charge)",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Known as the 'Jewel of India'. Home to Loktak Lake, the largest freshwater lake in Northeast India, featuring floating islands ('Phumdis') and Keibul Lamjao, the world's only floating national park.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "meghalaya",
    "type": "state",
    "name": "Meghalaya",
    "capital": "Shillong",
    "formationDate": "21 January 1972",
    "areaSqKm": 22429,
    "districtsCount": 12,
    "officialLanguages": [
      "English",
      "Khasi",
      "Garo"
    ],
    "chiefMinister": "Conrad Sangma",
    "governorOrLtGovernor": "C. H. Vijayashankar",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Known as the 'Abode of Clouds'. Home to Mawsynram (the wettest place on Earth), living root bridges handmade by Khasi tribes, and a matrilineal social lineage system.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "mizoram",
    "type": "state",
    "name": "Mizoram",
    "capital": "Aizawl",
    "formationDate": "20 February 1987",
    "areaSqKm": 21081,
    "districtsCount": 11,
    "officialLanguages": [
      "Mizo",
      "English"
    ],
    "chiefMinister": "Lalduhoma",
    "governorOrLtGovernor": "Hari Babu Kambhampati",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Known as the 'Land of the Hill People'. Boasts the highest percentage of forest cover among Indian states (over 85%). Famous for its Cheraw (bamboo dance) and peaceful Mizo Accord (1986).",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "nagaland",
    "type": "state",
    "name": "Nagaland",
    "capital": "Kohima",
    "formationDate": "1 December 1963",
    "areaSqKm": 16579,
    "districtsCount": 16,
    "officialLanguages": [
      "English"
    ],
    "chiefMinister": "Neiphiu Rio",
    "governorOrLtGovernor": "La. Ganesan",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Known as the 'Land of Festivals'. Home to 16 recognized indigenous major tribes, famous for the world-renowned Hornbill Festival celebrated annually from December 1 to 10.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "odisha",
    "type": "state",
    "name": "Odisha",
    "capital": "Bhubaneswar",
    "formationDate": "1 April 1936",
    "areaSqKm": 155707,
    "districtsCount": 30,
    "officialLanguages": [
      "Odia (Classical Language)"
    ],
    "chiefMinister": "Mohan Charan Majhi",
    "governorOrLtGovernor": "Raghubar Das",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Originally Kalinga, whose battlefield converted Emperor Ashoka to Buddhism (261 BCE). Home to Sun Temple Konark, Jagannath Temple Puri, Chilika Lake, and Olive Ridley sea turtle nesting.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "punjab",
    "type": "state",
    "name": "Punjab",
    "capital": "Chandigarh",
    "formationDate": "1 November 1966",
    "areaSqKm": 50362,
    "districtsCount": 23,
    "officialLanguages": [
      "Punjabi"
    ],
    "chiefMinister": "Bhagwant Mann",
    "governorOrLtGovernor": "Gulab Chand Kataria",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Land of the Five Rivers. Cradle of the Sikh faith, Granary of India, pivotal in the Green Revolution. Home to Sri Harmandir Sahib (Golden Temple), Jallianwala Bagh, and Wagah Border.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "rajasthan",
    "type": "state",
    "name": "Rajasthan",
    "capital": "Jaipur (Pink City)",
    "formationDate": "30 March 1949",
    "areaSqKm": 342239,
    "districtsCount": 50,
    "officialLanguages": [
      "Hindi"
    ],
    "chiefMinister": "Bhajan Lal Sharma",
    "governorOrLtGovernor": "Haribhau Bagade",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "India's largest state by geographic area (10.4% of country). Home to the Thar Desert, Aravalli Range (world's oldest fold mountains), Hill Forts of Rajasthan (UNESCO), and rich Rajput history.",
    "subtopicCount": 6,
    "mcqCount": 36
  },
  {
    "id": "sikkim",
    "type": "state",
    "name": "Sikkim",
    "capital": "Gangtok",
    "formationDate": "16 May 1975",
    "areaSqKm": 7096,
    "districtsCount": 6,
    "officialLanguages": [
      "English",
      "Nepali",
      "Bhutia",
      "Lepcha"
    ],
    "chiefMinister": "Prem Singh Tamang (Golay)",
    "governorOrLtGovernor": "Om Prakash Mathur",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "India's first 100% organic state. Home to Mount Kangchenjunga (8,586m, India's highest peak). Joined the Indian Union via the 36th Constitutional Amendment Act 1975.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "tamil_nadu",
    "type": "state",
    "name": "Tamil Nadu",
    "capital": "Chennai",
    "formationDate": "26 January 1950",
    "areaSqKm": 130058,
    "districtsCount": 38,
    "officialLanguages": [
      "Tamil (Classical Language)"
    ],
    "chiefMinister": "M. K. Stalin",
    "governorOrLtGovernor": "R. N. Ravi",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Home to one of the world's oldest surviving classical civilizations and languages. Masterpieces of Dravidian temple architecture (Great Living Chola Temples), automobile capital of India ('Detroit of South Asia').",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "telangana",
    "type": "state",
    "name": "Telangana",
    "capital": "Hyderabad",
    "formationDate": "2 June 2014",
    "areaSqKm": 112077,
    "districtsCount": 33,
    "officialLanguages": [
      "Telugu (Classical Language)",
      "Urdu"
    ],
    "chiefMinister": "A. Revanth Reddy",
    "governorOrLtGovernor": "Jishnu Dev Varma",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "India's 28th state, formed on 2 June 2014. Hyderabad is an IT powerhouse ('Cyberabad'), pharmaceuticals capital ('Vaccine Capital of the World'), and historic city of pearls.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "tripura",
    "type": "state",
    "name": "Tripura",
    "capital": "Agartala",
    "formationDate": "21 January 1972",
    "areaSqKm": 10491,
    "districtsCount": 8,
    "officialLanguages": [
      "Bengali",
      "Kokborok",
      "English"
    ],
    "chiefMinister": "Manik Saha",
    "governorOrLtGovernor": "N. Indrasena Reddy",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Surrounded on three sides by Bangladesh. Ruled for centuries by the Manikya dynasty. Home to Ujjayanta Palace, the colossal rock-cut carvings of Unakoti ('Angkor Wat of North-East'), and Queen pineapple.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "uttar_pradesh",
    "type": "state",
    "name": "Uttar Pradesh",
    "capital": "Lucknow",
    "formationDate": "24 January 1950",
    "areaSqKm": 240928,
    "districtsCount": 75,
    "officialLanguages": [
      "Hindi",
      "Urdu"
    ],
    "chiefMinister": "Yogi Adityanath",
    "governorOrLtGovernor": "Anandiben Patel",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "India's most populous state (over 24 crore citizens, sends 80 MPs to Lok Sabha). Cultural core of Indo-Aryan civilization: Varanasi (world's oldest living city), Ayodhya, Mathura, Prayagraj Kumbh Mela, and the Taj Mahal.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "uttarakhand",
    "type": "state",
    "name": "Uttarakhand",
    "capital": "Dehradun (Winter), Gairsain (Summer)",
    "formationDate": "9 November 2000",
    "areaSqKm": 53483,
    "districtsCount": 13,
    "officialLanguages": [
      "Hindi",
      "Sanskrit"
    ],
    "chiefMinister": "Pushkar Singh Dhami",
    "governorOrLtGovernor": "Lt. Gen. Gurmit Singh",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Known as 'Dev Bhoomi'. Source of the holy rivers Ganga (Gangotri) and Yamuna (Yamunotri). Home to the sacred Char Dham (Badrinath, Kedarnath, Gangotri, Yamunotri) and India's first Uniform Civil Code (UCC).",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "west_bengal",
    "type": "state",
    "name": "West Bengal",
    "capital": "Kolkata",
    "formationDate": "26 January 1950",
    "areaSqKm": 88752,
    "districtsCount": 23,
    "officialLanguages": [
      "Bengali (Classical Language)",
      "English"
    ],
    "chiefMinister": "Mamata Banerjee",
    "governorOrLtGovernor": "C. V. Ananda Bose",
    "governorTitle": "Governor",
    "lastVerified": "2026-01-01",
    "summary": "Cultural and intellectual heartland of modern India. Birthplace of Rabindranath Tagore, Swami Vivekananda, and Netaji Subhas Chandra Bose. Home to the Sundarbans (world's largest delta) and Darjeeling Himalayan Railway.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "andaman_and_nicobar",
    "type": "ut",
    "name": "Andaman and Nicobar Islands",
    "capital": "Port Blair (Sri Vijaya Puram)",
    "formationDate": "1 November 1956",
    "areaSqKm": 8249,
    "districtsCount": 3,
    "officialLanguages": [
      "Hindi",
      "English"
    ],
    "chiefMinister": null,
    "governorOrLtGovernor": "Admiral D. K. Joshi",
    "governorTitle": "Lieutenant Governor",
    "lastVerified": "2026-01-01",
    "summary": "Archipelago of 572 islands in the Bay of Bengal and Andaman Sea. Home to the historic Cellular Jail (Kala Pani), Barren Island (South Asia's only active volcano), and indigenous tribes (Sentinelese, Jarawa, Onge, Shompen).",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "chandigarh",
    "type": "ut",
    "name": "Chandigarh",
    "capital": "Chandigarh",
    "formationDate": "1 November 1966",
    "areaSqKm": 114,
    "districtsCount": 1,
    "officialLanguages": [
      "English",
      "Hindi",
      "Punjabi"
    ],
    "chiefMinister": null,
    "governorOrLtGovernor": "Gulab Chand Kataria",
    "governorTitle": "Administrator",
    "lastVerified": "2026-01-01",
    "summary": "India's first planned modern city post-independence, designed by Swiss-French architect Le Corbusier. Serves as the joint capital of Punjab and Haryana while functioning as a Union Territory.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "dadra_and_nagar_haveli_daman_diu",
    "type": "ut",
    "name": "Dadra and Nagar Haveli and Daman and Diu",
    "capital": "Daman",
    "formationDate": "26 January 2020",
    "areaSqKm": 603,
    "districtsCount": 3,
    "officialLanguages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "chiefMinister": null,
    "governorOrLtGovernor": "Praful Patel",
    "governorTitle": "Administrator",
    "lastVerified": "2026-01-01",
    "summary": "Merged on 26 January 2020 into a single Union Territory. Former Portuguese enclaves liberated in 1954 (Dadra & Nagar Haveli) and 1961 (Daman & Diu). Renowned for coastal forts and tribal culture.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "delhi",
    "type": "ut",
    "name": "Delhi (NCT)",
    "capital": "New Delhi",
    "formationDate": "1 February 1992 (as NCT via 69th Amendment)",
    "areaSqKm": 1484,
    "districtsCount": 11,
    "officialLanguages": [
      "Hindi",
      "English",
      "Urdu",
      "Punjabi"
    ],
    "chiefMinister": "Atishi Marlena",
    "governorOrLtGovernor": "Vinai Kumar Saxena",
    "governorTitle": "Lieutenant Governor",
    "lastVerified": "2026-01-01",
    "summary": "National Capital Territory of India. Seat of the Union Government, Parliament of India, and Supreme Court. Historic city built and rebuilt over millennia (Seven Historical Cities of Delhi).",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "jammu_and_kashmir",
    "type": "ut",
    "name": "Jammu and Kashmir",
    "capital": "Srinagar (Summer), Jammu (Winter)",
    "formationDate": "31 October 2019",
    "areaSqKm": 42241,
    "districtsCount": 20,
    "officialLanguages": [
      "Kashmiri",
      "Dogri",
      "Urdu",
      "Hindi",
      "English"
    ],
    "chiefMinister": "Omar Abdullah",
    "governorOrLtGovernor": "Manoj Sinha",
    "governorTitle": "Lieutenant Governor",
    "lastVerified": "2026-01-01",
    "summary": "Reorganized as a Union Territory with a Legislative Assembly on 31 October 2019. Celebrated worldwide as the 'Paradise on Earth'. Renowned for Dal Lake, saffron (Kashmiri Mongra), Pashmina wool, and Vaishno Devi shrine.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "ladakh",
    "type": "ut",
    "name": "Ladakh",
    "capital": "Leh",
    "formationDate": "31 October 2019",
    "areaSqKm": 59146,
    "districtsCount": 2,
    "officialLanguages": [
      "Ladakhi",
      "Tibetan",
      "Hindi",
      "English"
    ],
    "chiefMinister": null,
    "governorOrLtGovernor": "Brig. (Dr.) B. D. Mishra",
    "governorTitle": "Lieutenant Governor",
    "lastVerified": "2026-01-01",
    "summary": "India's highest cold desert plateau, created as a Union Territory without legislature on 31 October 2019. Home to Pangong Tso lake, Hemis National Park, Umling La (world's highest motorable pass, 19,024 ft), and Siachen Glacier.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "lakshadweep",
    "type": "ut",
    "name": "Lakshadweep",
    "capital": "Kavaratti",
    "formationDate": "1 November 1956",
    "areaSqKm": 32,
    "districtsCount": 1,
    "officialLanguages": [
      "Malayalam",
      "English",
      "Mahl (in Minicoy)"
    ],
    "chiefMinister": null,
    "governorOrLtGovernor": "Praful Patel",
    "governorTitle": "Administrator",
    "lastVerified": "2026-01-01",
    "summary": "India's smallest Union Territory (32 sq km), an archipelago of 36 coral atolls and submerged sand banks in the Arabian Sea. Renowned for pristine turquoise lagoons, coconut cultivation, and tuna fishing.",
    "subtopicCount": 6,
    "mcqCount": 2
  },
  {
    "id": "puducherry",
    "type": "ut",
    "name": "Puducherry",
    "capital": "Puducherry",
    "formationDate": "16 August 1962 (De Jure transfer from France)",
    "areaSqKm": 492,
    "districtsCount": 4,
    "officialLanguages": [
      "Tamil",
      "French",
      "Telugu",
      "Malayalam",
      "English"
    ],
    "chiefMinister": "N. Rangasamy",
    "governorOrLtGovernor": "K. Kailashnathan",
    "governorTitle": "Lieutenant Governor",
    "lastVerified": "2026-01-01",
    "summary": "Comprises 4 non-contiguous geographical enclaves: Puducherry & Karaikal (in Tamil Nadu), Yanam (in Andhra Pradesh), and Mahe (in Kerala). Former French colonial capital; home to Sri Aurobindo Ashram and experimental global township Auroville.",
    "subtopicCount": 6,
    "mcqCount": 2
  }
];
