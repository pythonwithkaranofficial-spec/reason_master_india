# -*- coding: utf-8 -*-
"""
Script to curate, verify, translate, and inject high-yield GK questions
from World GK, Indian GK, and Rajasthan GK folders into ReasonMaster India.
"""

import os, sys, re, json

sys.stdout.reconfigure(encoding='utf-8')

def get_stem(text):
    clean = re.sub(r'[^a-zA-Z0-9\u0900-\u097F]', '', text.lower())
    return clean[:35]

# ==========================================
# 1. BOOKS & AUTHORS (national/books_authors.json)
# ==========================================
BOOKS_AND_AUTHORS_MCQS = [
    {
        "q": "Who is the celebrated author of the ancient Indian collection of interrelated animal fables, 'Panchatantra'?",
        "qHi": "प्राचीन भारतीय नीतिपरक पशु-पक्षियों की अमर कथाओं के संग्रह 'पंचतंत्र' के प्रसिद्ध रचयिता कौन हैं?",
        "o": ["Vishnu Sharma", "Chanakya", "Kalidasa", "Banabhatta"],
        "oHi": ["विष्णु शर्मा", "चाणक्य", "कालिदास", "बाणभट्ट"],
        "a": 0,
        "exp": "Pandit Vishnu Sharma composed the Panchatantra in Sanskrit to impart moral values and statecraft to three princes. It is one of the most widely translated secular books in world literature.",
        "expHi": "पंडित विष्णु शर्मा ने तीन राजकुमारों को नीति, व्यवहार और राजनीति की शिक्षा देने के लिए संस्कृत में 'पंचतंत्र' की रचना की थी। यह विश्व की सर्वाधिक अनूदित पुस्तकों में से एक है।",
        "hint": "Composed in Sanskrit to educate young princes in political science and morality.",
        "hintHi": "राजकुमारों को नीतिशास्त्र सिखाने के लिए संस्कृत में रचित अमर ग्रंथ।"
    },
    {
        "q": "Who authored the foundational ancient Indian treatise on statecraft, economic policy, and military strategy titled 'Arthashastra'?",
        "qHi": "प्राचीन भारत में राजनीति, अर्थनीति, विदेश नीति एवं सैन्य रणनीति के कालजयी ग्रंथ 'अर्थशास्त्र' के रचयिता कौन हैं?",
        "o": ["Chanakya (Kautilya / Vishnugupta)", "Megasthenes", "Ashoka", "Chandragupta Maurya"],
        "oHi": ["चाणक्य (कौटिल्य / विष्णुगुप्त)", "मेगस्थनीज", "अशोक", "चंद्रगुप्त मौर्य"],
        "a": 0,
        "exp": "Chanakya (Kautilya or Vishnugupta), the prime minister and mentor of Chandragupta Maurya, authored the 15-book treatise 'Arthashastra' covering governance, taxation, and espionage.",
        "expHi": "मौर्य साम्राज्य के संस्थापक चंद्रगुप्त मौर्य के प्रधानमंत्री और गुरु चाणक्य (कौटिल्य/विष्णुगुप्त) ने 'अर्थशास्त्र' की रचना की, जिसमें सप्तांग सिद्धांत और कूटनीति का वर्णन है।",
        "hint": "Royal adviser to Chandragupta Maurya; formulated the Saptanga theory of state.",
        "hintHi": "चंद्रगुप्त मौर्य के प्रधानमंत्री; सप्तांग सिद्धांत के प्रतिपादक।"
    },
    {
        "q": "Which Sanskrit scholar composed the historical chronicle 'Rajatarangini' (River of Kings), recounting the history of Kashmir?",
        "qHi": "कश्मीर के राजाओं और उनके इतिहास का क्रमिक व प्रामाणिक विवरण प्रस्तुत करने वाले संस्कृत ग्रंथ 'राजतरंगिणी' के रचयिता कौन हैं?",
        "o": ["Kalhana (कल्हण)", "Bilhana", "Banabhatta", "Hemachandra"],
        "oHi": ["कल्हण", "बिल्हण", "बाणभट्ट", "हेमचंद्र"],
        "a": 0,
        "exp": "Kalhana composed 'Rajatarangini' (The River of Kings) in Sanskrit verse during 1148-1150 AD, regarded as India's first truly historical text adhering to objective historiography.",
        "expHi": "कल्हण ने 1148-1150 ईस्वी में 'राजतरंगिणी' की रचना की। इसे भारतीय इतिहास लेखन का प्रथम वैज्ञानिक व प्रामाणिक ग्रंथ माना जाता है।",
        "hint": "12th-century Kashmiri historian; authored 8 cantos (Tarangas).",
        "hintHi": "12वीं सदी के कश्मीरी विद्वान; 8 तरंगों में कश्मीर का इतिहास लिखा।"
    },
    {
        "q": "Who was the court poet (Asthana Kavi) of Emperor Harshavardhana who wrote 'Harshacharita' and the world's first novel 'Kadambari'?",
        "qHi": "सम्राट हर्षवर्धन के दरबारी कवि कौन थे, जिन्होंने 'हर्षचरित' और विश्व का प्रथम गद्य उपन्यास 'कादम्बरी' लिखा?",
        "o": ["Banabhatta (बाणभट्ट)", "Mayura", "Dandin", "Subandhu"],
        "oHi": ["बाणभट्ट", "मयूर", "दण्डी", "सुबंधु"],
        "a": 0,
        "exp": "Banabhatta served in the 7th-century court of King Harsha of Kannauj. He composed 'Harshacharita' (biography of Harsha) and the celebrated Sanskrit romantic prose work 'Kadambari'.",
        "expHi": "बाणभट्ट 7वीं शताब्दी में सम्राट हर्षवर्धन के राजकवि थे। इन्होंने हर्ष के जीवन पर 'हर्षचरित' तथा अमर संस्कृत गद्य काव्य 'कादम्बरी' की रचना की थी।",
        "hint": "7th-century Sanskrit scholar in the court of Kannauj ruler Harsha.",
        "hintHi": "कन्नौज नरेश सम्राट हर्ष के दरबारी कवि।"
    },
    {
        "q": "Which Bengali literary masterpiece by Bankim Chandra Chattopadhyay contains our National Song 'Vande Mataram'?",
        "qHi": "बंकिम चंद्र चट्टोपाध्याय के किस प्रसिद्ध उपन्यास में भारत का राष्ट्रीय गीत 'वन्दे मातरम्' समाहित है?",
        "o": ["Anandamath (आनंदमठ, 1882)", "Durgeshnandini", "Kapalkundala", "Devi Chaudhurani"],
        "oHi": ["आनंदमठ (1882)", "दुर्गेशनंदिनी", "कपालकुंडला", "देवी चौधरानी"],
        "a": 0,
        "exp": "Bankim Chandra Chattopadhyay wrote 'Anandamath' in 1882 against the backdrop of the Sannyasi Rebellion of 1770. It incorporates the patriotic hymn 'Vande Mataram', later adopted as India's National Song.",
        "expHi": "बंकिम चंद्र चट्टोपाध्याय ने 1882 में संन्यासी विद्रोह की पृष्ठभूमि पर 'आनंदमठ' उपन्यास लिखा, जिसमें 'वन्दे मातरम्' गीत शामिल था। इसे 24 जनवरी 1950 को राष्ट्रीय गीत का दर्जा दिया गया।",
        "hint": "Set against the backdrop of the late 18th-century Sannyasi Rebellion in Bengal.",
        "hintHi": "18वीं शताब्दी के संन्यासी विद्रोह की ऐतिहासिक पृष्ठभूमि पर रचित।"
    },
    {
        "q": "Which Indian leader penned the seminal historical work 'The Discovery of India' while imprisoned at Ahmednagar Fort (1942–1946)?",
        "qHi": "भारत के किस महान नेता ने 1942 से 1946 के दौरान अहमदनगर किले की जेल में बंदी रहते हुए प्रसिद्ध पुस्तक 'द डिस्कवरी ऑफ इंडिया' (भारत की खोज) लिखी थी?",
        "o": ["Jawaharlal Nehru", "Subhas Chandra Bose", "Mahatma Gandhi", "Dr. B. R. Ambedkar"],
        "oHi": ["जवाहरलाल नेहरू", "सुभाष चंद्र बोस", "महात्मा गांधी", "डॉ. बी.आर. आंबेडकर"],
        "a": 0,
        "exp": "Jawaharlal Nehru wrote 'The Discovery of India' during his imprisonment at Ahmednagar Fort following the Quit India Movement. It traces Indian culture, philosophy, and history from the Indus Valley Civilization.",
        "expHi": "पंडित जवाहरलाल नेहरू ने 1942 के भारत छोड़ो आंदोलन के दौरान अहमदनगर किले में कैद रहते हुए 'भारत की खोज' (The Discovery of India) पुस्तक लिखी थी।",
        "hint": "India's first Prime Minister; also wrote 'Glimpses of World History'.",
        "hintHi": "भारत के प्रथम प्रधानमंत्री; 'ग्लिम्पसेज ऑफ वर्ल्ड हिस्ट्री' के भी रचयिता।"
    },
    {
        "q": "Who wrote the autobiography 'Wings of Fire' detailing his journey from Rameswaram to the forefront of India's missile and space programs?",
        "qHi": "रामेश्वरम से लेकर भारत के मिसाइल एवं अंतरिक्ष कार्यक्रम तक की प्रेरणादायक यात्रा का वर्णन करने वाली आत्मकथा 'विंग्स ऑफ फायर' (अग्नि की उड़ान) के लेखक कौन हैं?",
        "o": ["Dr. A. P. J. Abdul Kalam", "Dr. Homi Bhabha", "Dr. Vikram Sarabhai", "Prof. Satish Dhawan"],
        "oHi": ["डॉ. ए.पी.जे. अब्दुल कलाम", "डॉ. होमी भाभा", "डॉ. विक्रम साराभाई", "प्रो. सतीश धवन"],
        "a": 0,
        "exp": "'Wings of Fire' (1999) is the autobiography of India's 'Missile Man' and 11th President, Dr. A.P.J. Abdul Kalam, co-written with Arun Tiwari.",
        "expHi": "'अग्नि की उड़ान' (Wings of Fire) भारत के मिसाइल मैन और 11वें राष्ट्रपति डॉ. ए.पी.जे. अब्दुल कलाम की प्रसिद्ध आत्मकथा है, जिसके सह-लेखक अरुण तिवारी हैं।",
        "hint": "Former President of India, renowned as the 'Missile Man'.",
        "hintHi": "भारत के 11वें राष्ट्रपति और मिसाइल मैन।"
    },
    {
        "q": "Who won the prestigious Man Booker Prize in 1997 for the debut novel 'The God of Small Things'?",
        "qHi": "1997 में अपने प्रथम उपन्यास 'द गॉड ऑफ स्मॉल थिंग्स' के लिए प्रतिष्ठित मैन बुकर पुरस्कार जीतने वाली पहली भारतीय महिला कौन थीं?",
        "o": ["Arundhati Roy (अरुंधति रॉय)", "Anita Desai", "Kiran Desai", "Jhumpa Lahiri"],
        "oHi": ["अरुंधति रॉय", "अनीता देसाई", "किरण देसाई", "झुम्पा लाहिड़ी"],
        "a": 0,
        "exp": "Arundhati Roy became the first Indian citizen to win the Booker Prize in 1997 for 'The God of Small Things', set in the village of Ayemenem in Kerala.",
        "expHi": "अरुंधति रॉय 1997 में अपने उपन्यास 'द गॉड ऑफ स्मॉल थिंग्स' (केरल के अय्यमेनम गाँव की पृष्ठभूमि पर आधारित) के लिए बुकर पुरस्कार जीतने वाली पहली भारतीय नागरिक बनीं।",
        "hint": "First Indian citizen to win the Booker Prize; novel is set in Ayemenem, Kerala.",
        "hintHi": "केरल के अय्यमेनम गाँव की पृष्ठभूमि पर रचित उपन्यास।"
    }
]

# ==========================================
# 2. NOBEL PRIZE WINNERS (national/awards_honours.json)
# ==========================================
NOBEL_PRIZE_MCQS = [
    {
        "q": "Who was the first Indian and the first Asian to be conferred the Nobel Prize, winning in Literature in 1913?",
        "qHi": "1913 में साहित्य का नोबेल पुरस्कार जीतने वाले प्रथम भारतीय तथा प्रथम एशियाई व्यक्ति कौन थे?",
        "o": ["Rabindranath Tagore", "Sir C. V. Raman", "Sarojini Naidu", "Swami Vivekananda"],
        "oHi": ["रवींद्रनाथ टैगोर", "सर सी.वी. रमन", "सरोजिनी नायडू", "स्वामी विवेकानंद"],
        "a": 0,
        "exp": "Rabindranath Tagore was awarded the Nobel Prize in Literature in 1913 for his song offering collection 'Gitanjali' (Song Offerings), becoming the first non-European and first Asian laureate.",
        "expHi": "गुरुदेव रवींद्रनाथ टैगोर को 1913 में उनकी काव्य कृति 'गीतांजलि' के लिए साहित्य का नोबेल पुरस्कार दिया गया। वे यह सम्मान पाने वाले प्रथम गैर-यूरोपीय एवं प्रथम एशियाई थे।",
        "hint": "Awarded for his spiritual poetry collection 'Gitanjali'.",
        "hintHi": "इनके कविता संग्रह 'गीतांजलि' के लिए यह सम्मान मिला था।"
    },
    {
        "q": "Sir C. V. Raman won the Nobel Prize in Physics in 1930 for which groundbreaking discovery in optics?",
        "qHi": "सर सी.वी. रमन को 1930 में भौतिकी का नोबेल पुरस्कार प्रकाशिकी में किस ऐतिहासिक खोज के लिए प्रदान किया गया था?",
        "o": ["Raman Effect (Inelastic Scattering of Light)", "Photoelectric Effect", "Cosmic Radiation", "Nuclear Fission"],
        "oHi": ["रमन प्रभाव (प्रकाश का प्रकीर्णन)", "प्रकाश विद्युत प्रभाव", "कॉस्मिक विकिरण", "नाभिकीय विखंडन"],
        "a": 0,
        "exp": "Sir Chandrasekhara Venkata Raman discovered the Raman Effect (change in wavelength of light when deflected by molecules) on 28 February 1928, celebrated in India as National Science Day.",
        "expHi": "सर सी.वी. रमन ने 28 फरवरी 1928 को 'रमन प्रभाव' की खोज की, जिसके तहत जब प्रकाश किसी पारदर्शी माध्यम से गुजरता है तो उसकी तरंगदैर्घ्य में परिवर्तन होता है। इस स्मृति में 28 फरवरी को राष्ट्रीय विज्ञान दिवस मनाया जाता है।",
        "hint": "Discovered on 28 February 1928, celebrated across India as National Science Day.",
        "hintHi": "इस खोज के उपलक्ष्य में 28 फरवरी को राष्ट्रीय विज्ञान दिवस मनाया जाता है।"
    },
    {
        "q": "For which field of study did Indian-born economist Amartya Sen win the Nobel Memorial Prize in Economic Sciences in 1998?",
        "qHi": "भारतीय अर्थशास्त्री अमर्त्य सेन को 1998 में अर्थशास्त्र का नोबेल पुरस्कार किस क्षेत्र में उनके युगांतरकारी योगदान के लिए दिया गया था?",
        "o": ["Welfare Economics & Social Choice Theory", "Monetary Economics", "Game Theory", "Econometrics"],
        "oHi": ["कल्याणकारी अर्थशास्त्र एवं सामाजिक चयन सिद्धांत", "मौद्रिक अर्थशास्त्र", "गेम थ्योरी", "इकोनोमेट्रिक्स"],
        "a": 0,
        "exp": "Amartya Sen was awarded the 1998 Nobel Prize in Economics for his contributions to welfare economics, poverty indices, famine analysis, and the Human Development Index (HDI).",
        "expHi": "प्रो. अमर्त्य सेन को कल्याणकारी अर्थशास्त्र, अकाल के कारणों के विश्लेषण तथा मानव विकास सूचकांक (HDI) की अवधारणा के विकास के लिए 1998 का अर्थशास्त्र का नोबेल पुरस्कार मिला।",
        "hint": "Renowned for pioneering research on famines, poverty indices, and human capabilities.",
        "hintHi": "अकाल, गरीबी और मानव क्षमता विकास पर शोध के लिए प्रसिद्ध।"
    },
    {
        "q": "Who shared the 2014 Nobel Peace Prize with Malala Yousafzai for spearheading the 'Bachpan Bachao Andolan' against child labor?",
        "qHi": "बाल श्रम के विरुद्ध 'बचपन बचाओ आंदोलन' का नेतृत्व करने के लिए 2014 में मलाला यूसुफजई के साथ संयुक्त रूप से शांति का नोबेल पुरस्कार किसे दिया गया?",
        "o": ["Kailash Satyarthi", "Anna Hazare", "Baba Amte", "Sundarlal Bahuguna"],
        "oHi": ["कैलाश सत्यार्थी", "अन्ना हजारे", "बाबा आमटे", "सुंदरलाल बहुगुणा"],
        "a": 0,
        "exp": "Kailash Satyarthi founded the 'Bachpan Bachao Andolan' (Save the Childhood Movement) in 1980 and has rescued over 100,000 children from trafficking and bonded labor across India.",
        "expHi": "कैलाश सत्यार्थी ने 1980 में 'बचपन बचाओ आंदोलन' की स्थापना की और एक लाख से अधिक बच्चों को बाल श्रम, दासता और तस्करी से मुक्त कराया।",
        "hint": "Founder of Bachpan Bachao Andolan in 1980.",
        "hintHi": "1980 में बचपन बचाओ आंदोलन की शुरुआत की।"
    }
]

# ==========================================
# 3. FAMOUS PERSONALITIES & NICKNAMES (national/static_gk_superlatives.json)
# ==========================================
PERSONALITIES_MCQS = [
    {
        "q": "Which Pashtun independence activist was reverently titled 'Frontier Gandhi' and 'Badshah Khan' for his nonviolent Khudai Khidmatgar movement?",
        "qHi": "अहिंसक 'खुदाई खिदमतगार' (लाल कुर्ती) आंदोलन का नेतृत्व करने वाले किस महान स्वतंत्रता सेनानी को 'सीमांत गाँधी' (Frontier Gandhi) कहा जाता है?",
        "o": ["Khan Abdul Ghaffar Khan", "Maulana Abul Kalam Azad", "Liaquat Ali Khan", "Shaukat Ali"],
        "oHi": ["खान अब्दुल गफ्फार खान", "मौलाना अबुल कलाम आजाद", "लियाकत अली खान", "शौकत अली"],
        "a": 0,
        "exp": "Khan Abdul Ghaffar Khan (Badshah Khan) organized the nonviolent Khudai Khidmatgar (Red Shirts) movement in the North-West Frontier Province. In 1987, he became the first non-Indian citizen awarded the Bharat Ratna.",
        "expHi": "खान अब्दुल गफ्फार खान (बादशाह खान) को 'सीमांत गाँधी' कहा जाता है। इन्होंने उत्तर-पश्चिम सीमांत प्रांत में अहिंसक 'खुदाई खिदमतगार' संगठन बनाया। 1987 में वे भारत रत्न पाने वाले पहले गैर-भारतीय बने।",
        "hint": "Leader of the Red Shirts (Khudai Khidmatgars); first non-Indian Bharat Ratna recipient (1987).",
        "hintHi": "लाल कुर्ती आंदोलन के नेता; 1987 में भारत रत्न से सम्मानित प्रथम विदेशी नागरिक।"
    },
    {
        "q": "Which prominent freedom fighter and educationist was honored with the title 'Mahamana' and founded Banaras Hindu University (BHU) in 1916?",
        "qHi": "महात्मा गांधी द्वारा 'महामना' की उपाधि से सम्मानित तथा 1916 में बनारस हिंदू विश्वविद्यालय (BHU) के संस्थापक महान शिक्षाविद् कौन थे?",
        "o": ["Pandit Madan Mohan Malaviya", "Gopal Krishna Gokhale", "Bal Gangadhar Tilak", "Lala Lajpat Rai"],
        "oHi": ["पंडित मदन मोहन मालवीय", "गोपाल कृष्ण गोखले", "बाल गंगाधर तिलक", "लाला लाजपत राय"],
        "a": 0,
        "exp": "Pandit Madan Mohan Malaviya was conferred the honorific 'Mahamana' by Mahatma Gandhi. He founded the Banaras Hindu University (BHU) in 1916 and was posthumously awarded the Bharat Ratna in 2014.",
        "expHi": "पंडित मदन मोहन मालवीय को 'महामना' कहा जाता है। इन्होंने 1916 में काशी हिंदू विश्वविद्यालय (BHU) की स्थापना की। इन्हें 2014 में मरणोपरांत भारत रत्न से सम्मानित किया गया।",
        "hint": "Founder of Banaras Hindu University; conferred Bharat Ratna in 2014.",
        "hintHi": "1916 में काशी हिंदू विश्वविद्यालय (BHU) के संस्थापक।"
    },
    {
        "q": "Who earned the epithet 'Grand Old Man of India' and authored 'Poverty and Un-British Rule in India', introducing the Drain of Wealth theory?",
        "qHi": "'भारत के वयोवृद्ध पुरुष' (Grand Old Man of India) कहलाने वाले तथा 'धन निष्कासन सिद्धांत' (Drain of Wealth) के प्रतिपादक कौन थे?",
        "o": ["Dadabhai Naoroji", "Surendranath Banerjee", "Pherozeshah Mehta", "Dinshaw Wacha"],
        "oHi": ["दादाभाई नौरोजी", "सुरेंद्रनाथ बनर्जी", "फिरोजशाह मेहता", "दिनशा वाचा"],
        "a": 0,
        "exp": "Dadabhai Naoroji was the first Asian to be elected to the British Parliament (House of Commons in 1892). He demonstrated the economic exploitation of India by Britain in his book 'Poverty and Un-British Rule in India'.",
        "expHi": "दादाभाई नौरोजी 1892 में ब्रिटिश संसद (हाउस ऑफ कॉमन्स) में चुने जाने वाले पहले एशियाई थे। इन्होंने 'पॉवर्टी एंड अन-ब्रिटिश रूल इन इंडिया' पुस्तक में भारत से ब्रिटेन जाने वाले धन के निष्कासन की व्याख्या की।",
        "hint": "First Asian MP in the British House of Commons (1892).",
        "hintHi": "1892 में ब्रिटिश संसद के लिए निर्वाचित होने वाले प्रथम एशियाई।"
    },
    {
        "q": "Which legendary sprint champion was conferred the moniker 'The Flying Sikh' by Pakistan's President Ayub Khan in 1960?",
        "qHi": "1960 में लाहौर में अब्दुल खालिक को पराजित करने के बाद पाकिस्तान के राष्ट्रपति अयूब खान ने किस महान धावक को 'द फ्लाइंग सिख' (The Flying Sikh) की उपाधि दी थी?",
        "o": ["Milkha Singh", "Gurbachan Singh Randhawa", "Makhan Singh", "PT Usha"],
        "oHi": ["मिल्खा सिंह", "गुरबचन सिंह रंधावा", "माखन सिंह", "पी.टी. उषा"],
        "a": 0,
        "exp": "Milkha Singh won gold medals in the 200m and 400m at the 1958 Asian Games and the 440 yards at the 1958 Commonwealth Games. In 1960, Ayub Khan proclaimed him 'The Flying Sikh'.",
        "expHi": "मिल्खा सिंह ने 1958 के राष्ट्रमंडल खेलों और एशियाई खेलों में स्वर्ण पदक जीतकर भारत का नाम रोशन किया। 1960 में पाकिस्तान में दौड़ जीतने पर राष्ट्रपति अयूब खान ने उन्हें 'द फ्लाइंग सिख' कहा।",
        "hint": "First Indian athlete to win an individual athletics gold at the Commonwealth Games (1958).",
        "hintHi": "1958 के राष्ट्रमंडल खेलों में स्वर्ण जीतने वाले प्रथम भारतीय एथलीट।"
    }
]

# ==========================================
# 4. WORLD GK (world/*.json)
# ==========================================
WORLD_GK_MCQS = [
    # Geography
    {
        "topicId": "world_geography", "subtopicId": "relief_features",
        "q": "Which is the smallest sovereign country in the world by both land area (0.49 sq km) and population?",
        "qHi": "क्षेत्रफल (मात्र 0.49 वर्ग किमी) और जनसंख्या दोनों की दृष्टि से विश्व का सबसे छोटा संप्रभु देश कौन सा है?",
        "o": ["Vatican City", "Monaco", "Nauru", "San Marino"],
        "oHi": ["वेटिकन सिटी", "मोनाको", "नाउरू", "सैन मैरिनो"],
        "a": 0,
        "exp": "Vatican City, an independent enclave surrounded entirely by Rome, Italy, covers an area of about 49 hectares (0.49 sq km), ruled by the Pope as the Holy See.",
        "expHi": "वेटिकन सिटी इटली की राजधानी रोम से घिरा हुआ एक स्वतंत्र नगर-राज्य है। इसका क्षेत्रफल मात्र 0.49 वर्ग किमी है और यह कैथोलिक चर्च का प्रशासनिक केंद्र है।",
        "hint": "An enclaved city-state surrounded completely by Rome, Italy.",
        "hintHi": "इटली की राजधानी रोम के अंदर स्थित संप्रभु नगर-राज्य।"
    },
    {
        "topicId": "world_geography", "subtopicId": "rivers_lakes",
        "q": "Which is the deepest freshwater lake in the world, holding approximately 20% of Earth's unfrozen surface freshwater?",
        "qHi": "विश्व की सबसे गहरी मीठे पानी की झील कौन सी है, जिसमें पृथ्वी के धरातलीय मीठे पानी का लगभग 20% भाग समाहित है?",
        "o": ["Lake Baikal (Russia)", "Lake Tanganyika", "Lake Superior", "Caspian Sea"],
        "oHi": ["बैकाल झील (रूस)", "टांगानिका झील", "सुपीरियर झील", "कैस्पियन सागर"],
        "a": 0,
        "exp": "Lake Baikal in southern Siberia, Russia, has a maximum depth of 1,642 meters (5,387 ft), making it the world's deepest and oldest (25 million years) freshwater lake.",
        "expHi": "रूस के दक्षिणी साइबेरिया में स्थित बैकाल झील 1,642 मीटर की गहराई के साथ विश्व की सबसे गहरी और सबसे प्राचीन मीठे पानी की झील है।",
        "hint": "Located in Siberia, Russia; reaches a maximum depth of 1,642 meters.",
        "hintHi": "रूस के साइबेरिया में स्थित 1,642 मीटर गहरी झील।"
    },
    {
        "topicId": "world_geography", "subtopicId": "rivers_lakes",
        "q": "Which is the longest river in the world, flowing northward across eastern Africa into the Mediterranean Sea?",
        "qHi": "अफ्रीका महाद्वीप से उत्तर की ओर भूमध्य सागर में गिरने वाली विश्व की सबसे लंबी नदी कौन सी है?",
        "o": ["Nile River (नील नदी, ~6,650 km)", "Amazon River", "Yangtze River", "Mississippi-Missouri"],
        "oHi": ["नील नदी (~6,650 किमी)", "अमेजन नदी", "यांग्त्से नदी", "मिसिसिपी-मिसौरी"],
        "a": 0,
        "exp": "The River Nile is traditionally recognized as the longest river in the world, stretching approximately 6,650 km (4,132 miles) through 11 African nations, historic lifeblood of Egypt.",
        "expHi": "नील नदी लगभग 6,650 किमी की लंबाई के साथ विश्व की सबसे लंबी नदी मानी जाती है। इसका उद्गम विक्टोरिया झील क्षेत्र से होता है और यह मिस्र की जीवनरेखा कहलाती है।",
        "hint": "Known historically as the lifeline and gift of Egypt.",
        "hintHi": "मिस्र की जीवनरेखा कहलाने वाली नदी।"
    },
    {
        "topicId": "world_geography", "subtopicId": "relief_features",
        "q": "Which country is internationally renowned as the 'Land of Thousand Lakes' with over 187,000 lakes?",
        "qHi": "1,87,000 से अधिक झीलों के कारण विश्व के किस नॉर्डिक देश को 'हजारों झीलों की भूमि' (Land of Thousand Lakes) कहा जाता है?",
        "o": ["Finland", "Norway", "Sweden", "Iceland"],
        "oHi": ["फिनलैंड", "नॉर्वे", "स्वीडन", "आइसलैंड"],
        "a": 0,
        "exp": "Finland contains approximately 187,888 lakes, earning it the global moniker 'The Land of a Thousand Lakes' (Suomi).",
        "expHi": "फिनलैंड में लगभग 1,87,888 झीलें स्थित हैं, जिसके कारण इसे दुनिया भर में 'हजारों झीलों का देश' कहा जाता है। इसकी राजधानी हेलसिंकी है।",
        "hint": "A Nordic country whose capital is Helsinki.",
        "hintHi": "हेलसिंकी राजधानी वाला नॉर्डिक देश।"
    },
    # International Organizations
    {
        "topicId": "international_organizations", "subtopicId": "un_agencies",
        "q": "Where is the global headquarters of UNESCO (United Nations Educational, Scientific and Cultural Organization) located?",
        "qHi": "यूनेस्को (UNESCO - संयुक्त राष्ट्र शैक्षिक, वैज्ञानिक एवं सांस्कृतिक संगठन) का वैश्विक मुख्यालय कहाँ स्थित है?",
        "o": ["Paris, France", "Geneva, Switzerland", "New York, USA", "Vienna, Austria"],
        "oHi": ["पेरिस, फ्रांस", "जिनेवा, स्विट्जरलैंड", "न्यू यॉर्क, अमेरिका", "वियना, ऑस्ट्रिया"],
        "a": 0,
        "exp": "UNESCO was established on 16 November 1945 and is headquartered on Place de Fontenoy in Paris, France, dedicated to international collaboration in education, science, culture, and heritage.",
        "expHi": "यूनेस्को की स्थापना 16 नवंबर 1945 को हुई थी तथा इसका स्थायी मुख्यालय फ्रांस की राजधानी पेरिस में स्थित है।",
        "hint": "Situated in the French capital on Place de Fontenoy.",
        "hintHi": "फ्रांस की राजधानी पेरिस में स्थित है।"
    },
    {
        "topicId": "international_organizations", "subtopicId": "un_agencies",
        "q": "The International Court of Justice (ICJ), the principal judicial organ of the UN, is seated in which city?",
        "qHi": "संयुक्त राष्ट्र का प्रधान न्यायिक अंग 'अंतरराष्ट्रीय न्यायालय' (ICJ - International Court of Justice) किस शहर में स्थित है?",
        "o": ["The Hague, Netherlands", "Geneva, Switzerland", "New York, USA", "Brussels, Belgium"],
        "oHi": ["द हेग, नीदरलैंड्स", "जिनेवा, स्विट्जरलैंड", "न्यू यॉर्क, अमेरिका", "ब्रुसेल्स, बेल्जियम"],
        "a": 0,
        "exp": "The International Court of Justice (ICJ) is the only one of the six principal organs of the United Nations not located in New York; it is seated at the Peace Palace in The Hague, Netherlands.",
        "expHi": "अंतरराष्ट्रीय न्यायालय संयुक्त राष्ट्र के 6 प्रमुख अंगों में एकमात्र ऐसा अंग है जो न्यूयॉर्क में स्थित नहीं है; यह नीदरलैंड्स के 'द हेग' के पीस पैलेस में स्थित है। इसमें 15 न्यायाधीश 9 वर्ष के लिए चुने जाते हैं।",
        "hint": "Located at the historic Peace Palace in the Netherlands.",
        "hintHi": "नीदरलैंड्स के ऐतिहासिक पीस पैलेस में स्थित।"
    },
    # World Wonders & History
    {
        "topicId": "world_history", "subtopicId": "landmarks",
        "q": "Which colossal neoclassical sculpture was gifted by the people of France to the United States in 1886 to commemorate friendship and liberty?",
        "qHi": "1886 में फ्रांस की जनता ने संयुक्त राज्य अमेरिका को स्वतंत्रता और मैत्री के प्रतीक के रूप में कौन सी विशाल प्रतिमा भेंट की थी?",
        "o": ["Statue of Liberty (न्यूयॉर्क)", "Christ the Redeemer", "Eiffel Tower", "The Thinker"],
        "oHi": ["स्टैच्यू ऑफ लिबर्टी (Statue of Liberty)", "क्राइस्ट द रिडीमर", "एफिल टॉवर", "द थिंकर"],
        "a": 0,
        "exp": "The Statue of Liberty (Liberty Enlightening the World) was sculpted by Frédéric-Auguste Bartholdi with internal framework by Gustave Eiffel and dedicated on Liberty Island in New York Harbor in 1886.",
        "expHi": "स्टैच्यू ऑफ लिबर्टी की डिजाइन मूर्तिकार फ्रेडरिक ऑगस्ट बार्थोल्डी ने बनाई थी और इसका आंतरिक ढांचा गुस्ताव एफिल ने तैयार किया था। इसे 1886 में फ्रांस ने अमेरिका को उपहार स्वरूप दिया था।",
        "hint": "Sculpted by Frédéric-Auguste Bartholdi and situated on Liberty Island in New York.",
        "hintHi": "न्यूयॉर्क हार्बर के लिबर्टी द्वीप पर स्थित विश्व प्रसिद्ध प्रतिमा।"
    },
    # World Sports
    {
        "topicId": "world_sports", "subtopicId": "tennis",
        "q": "Which legendary tennis superstar is celebrated as the 'King of Clay' for winning an unprecedented 14 French Open (Roland Garros) titles?",
        "qHi": "रोलां गैरो (फ्रेंच ओपन) में रिकॉर्ड 14 खिताब जीतने के कारण किस महान टेनिस खिलाड़ी को 'क्ले कोर्ट का राजा' (King of Clay) कहा जाता है?",
        "o": ["Rafael Nadal", "Roger Federer", "Novak Djokovic", "Carlos Alcaraz"],
        "oHi": ["राफेल नडाल (Rafael Nadal)", "रोजर फेडरर", "नोवाक जोकोविच", "कार्लोस अल्कराज"],
        "a": 0,
        "exp": "Spain's Rafael Nadal has won 14 French Open men's singles titles on the red clay courts of Roland Garros between 2005 and 2022, a record dominance unequaled in tennis history.",
        "expHi": "स्पेन के राफेल नडाल ने रोलां गैरो (पेरिस) के लाल बजरी (क्ले) कोर्ट पर 14 बार फ्रेंच ओपन पुरुष सिंगल्स का खिताब जीता है, जिस कारण उन्हें 'किंग ऑफ क्ले' कहा जाता है।",
        "hint": "Spanish tennis champion who won 22 Grand Slam men's singles titles.",
        "hintHi": "स्पेनिश टेनिस दिग्गज जिन्होंने 22 ग्रैंड स्लैम जीते हैं।"
    },
    {
        "topicId": "world_sports", "subtopicId": "badminton",
        "q": "The biennial international badminton world championship for men's national teams is known as which trophy?",
        "qHi": "बैडमिंटन में पुरुषों की विश्व टीम चैम्पियनशिप को किस नाम से जाना जाता है (जिसे भारत ने 2022 में पहली बार जीता था)?",
        "o": ["Thomas Cup (थॉमस कप)", "Uber Cup", "Sudirman Cup", "Davis Cup"],
        "oHi": ["थॉमस कप", "उबेर कप", "सुदीरमन कप", "डेविस कप"],
        "a": 0,
        "exp": "The Thomas Cup is the world men's team badminton championship founded in 1949 by Sir George Thomas. (Uber Cup is the women's team equivalent; Sudirman Cup is mixed). India won its historic first Thomas Cup in 2022 defeating Indonesia 3-0.",
        "expHi": "थॉमस कप बैडमिंटन में पुरुषों की प्रतिष्ठित विश्व टीम चैम्पियनशिप है। 2022 में भारत ने 14 बार के विजेता इंडोनेशिया को 3-0 से हराकर इतिहास में पहली बार थॉमस कप जीता था।",
        "hint": "India won its maiden title in 2022 defeating 14-time champion Indonesia.",
        "hintHi": "2022 में भारत ने इंडोनेशिया को हराकर पहली बार यह खिताब जीता था।"
    },
    # World Important Days
    {
        "topicId": "world_important_days", "subtopicId": "un_days",
        "q": "On which date is World Environment Day commemorated annually across the globe?",
        "qHi": "पर्यावरण संरक्षण और संवर्धन के प्रति वैश्विक जागरूकता बढ़ाने के लिए 'विश्व पर्यावरण दिवस' प्रतिवर्ष किस तिथि को मनाया जाता है?",
        "o": ["5 June", "22 April", "16 September", "21 March"],
        "oHi": ["5 जून", "22 अप्रैल", "16 सितंबर", "21 मार्च"],
        "a": 0,
        "exp": "World Environment Day was established by the UN General Assembly at the 1972 Stockholm Conference on the Human Environment and has been commemorated globally on 5 June every year since 1973.",
        "expHi": "1972 के स्टॉकहोम मानव पर्यावरण सम्मेलन की स्मृति में संयुक्त राष्ट्र द्वारा प्रतिवर्ष 5 जून को विश्व पर्यावरण दिवस मनाया जाता है। (22 अप्रैल पृथ्वी दिवस है और 16 सितंबर ओजोन दिवस)।",
        "hint": "Established at the 1972 Stockholm Conference; celebrated annually on 5 June.",
        "hintHi": "1972 के स्टॉकहोम सम्मेलन में स्थापित; 5 जून को मनाया जाता है।"
    }
]

def inject_all_datasets():
    # Load all compiled Rajasthan MCQs
    with open('scratch_compiled_rajasthan_mcqs.json', 'r', encoding='utf-8') as f:
        rajasthan_mcqs = json.load(f)

    # Load enriched National MCQs from Part 2
    with open('scratch_enriched_national_mcqs.json', 'r', encoding='utf-8') as f:
        national_part2_mcqs = json.load(f)

    # Load master questions
    master_path = 'src/data/gk/questions/gk_questions_master.json'
    with open(master_path, 'r', encoding='utf-8') as f:
        master_data = json.load(f)

    existing_master_qs = master_data.get('questions', [])
    seen_master_ids = {q['id'] for q in existing_master_qs}
    seen_stems = {get_stem(q.get('questionText', q.get('q', ''))) for q in existing_master_qs}

    all_new_qs = []

    # 1. Add Rajasthan questions
    for q in rajasthan_mcqs:
        stem = get_stem(q.get('questionText', q.get('q', '')))
        if stem in seen_stems and q['id'] in seen_master_ids:
            continue
        seen_stems.add(stem)
        master_q = {
            "id": q["id"],
            "domain": "gk",
            "gkCategory": "state",
            "stateId": "rajasthan",
            "topicId": q.get("topicId", "rajasthan"),
            "subtopicId": q.get("subtopicId", "general"),
            "questionType": "mcq",
            "questionText": q.get("questionText", q.get("q")),
            "questionTextHi": q.get("questionTextHi", q.get("qHi")),
            "options": q.get("options", q.get("o")),
            "optionsHi": q.get("optionsHi", q.get("oHi")),
            "correctIndex": q.get("correctIndex", q.get("a")),
            "difficulty": q.get("difficulty", "medium"),
            "hint": q.get("hint", ""),
            "hintHi": q.get("hintHi", ""),
            "explanation": q.get("explanation", q.get("exp")),
            "explanationHi": q.get("explanationHi", q.get("expHi")),
            "lastVerified": "2026-03",
            "examTags": q.get("examTags", ["RAS", "REET", "Rajasthan Police"])
        }
        all_new_qs.append(master_q)

    # 2. Add National Part 2 questions
    for q in national_part2_mcqs:
        stem = get_stem(q.get('questionText', q.get('q', '')))
        if stem in seen_stems and q['id'] in seen_master_ids:
            continue
        seen_stems.add(stem)
        all_new_qs.append(q)

    # 3. Add Books & Authors
    for idx, item in enumerate(BOOKS_AND_AUTHORS_MCQS, 1):
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_nat_books_authors_curated_{idx}"
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "national",
            "topicId": "books_authors",
            "subtopicId": "famous_literature",
            "questionType": "mcq",
            "q": item["q"],
            "questionText": item["q"],
            "qHi": item["qHi"],
            "questionTextHi": item["qHi"],
            "o": item["o"],
            "options": item["o"],
            "oHi": item["oHi"],
            "optionsHi": item["oHi"],
            "a": item["a"],
            "correctIndex": item["a"],
            "difficulty": "medium",
            "hint": item["hint"],
            "hintHi": item["hintHi"],
            "exp": item["exp"],
            "explanation": item["exp"],
            "expHi": item["expHi"],
            "explanationHi": item["expHi"],
            "lastVerified": "2026-03",
            "examTags": ["UPSC", "SSC CGL", "State PCS", "CDS", "NDA"]
        }
        all_new_qs.append(q_obj)

    # 4. Add Nobel Prize questions
    for idx, item in enumerate(NOBEL_PRIZE_MCQS, 1):
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_nat_awards_honours_nobel_{idx}"
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "national",
            "topicId": "awards_honours",
            "subtopicId": "nobel_laureates",
            "questionType": "mcq",
            "q": item["q"],
            "questionText": item["q"],
            "qHi": item["qHi"],
            "questionTextHi": item["qHi"],
            "o": item["o"],
            "options": item["o"],
            "oHi": item["oHi"],
            "optionsHi": item["oHi"],
            "a": item["a"],
            "correctIndex": item["a"],
            "difficulty": "medium",
            "hint": item["hint"],
            "hintHi": item["hintHi"],
            "exp": item["exp"],
            "explanation": item["exp"],
            "expHi": item["expHi"],
            "explanationHi": item["expHi"],
            "lastVerified": "2026-03",
            "examTags": ["UPSC", "SSC CGL", "State PCS", "CDS", "NDA"]
        }
        all_new_qs.append(q_obj)

    # 5. Add Personalities questions
    for idx, item in enumerate(PERSONALITIES_MCQS, 1):
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_nat_personalities_curated_{idx}"
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "national",
            "topicId": "static_gk_superlatives",
            "subtopicId": "famous_personalities",
            "questionType": "mcq",
            "q": item["q"],
            "questionText": item["q"],
            "qHi": item["qHi"],
            "questionTextHi": item["qHi"],
            "o": item["o"],
            "options": item["o"],
            "oHi": item["oHi"],
            "optionsHi": item["oHi"],
            "a": item["a"],
            "correctIndex": item["a"],
            "difficulty": "medium",
            "hint": item["hint"],
            "hintHi": item["hintHi"],
            "exp": item["exp"],
            "explanation": item["exp"],
            "expHi": item["expHi"],
            "explanationHi": item["expHi"],
            "lastVerified": "2026-03",
            "examTags": ["UPSC", "SSC CGL", "State PCS", "CDS", "NDA"]
        }
        all_new_qs.append(q_obj)

    # 6. Add World GK questions
    for idx, item in enumerate(WORLD_GK_MCQS, 1):
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_world_{item['topicId']}_curated_{idx}"
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "world",
            "topicId": item["topicId"],
            "subtopicId": item.get("subtopicId", "general"),
            "questionType": "mcq",
            "q": item["q"],
            "questionText": item["q"],
            "qHi": item["qHi"],
            "questionTextHi": item["qHi"],
            "o": item["o"],
            "options": item["o"],
            "oHi": item["oHi"],
            "optionsHi": item["oHi"],
            "a": item["a"],
            "correctIndex": item["a"],
            "difficulty": "medium",
            "hint": item["hint"],
            "hintHi": item["hintHi"],
            "exp": item["exp"],
            "explanation": item["exp"],
            "expHi": item["expHi"],
            "explanationHi": item["expHi"],
            "lastVerified": "2026-03",
            "examTags": ["UPSC", "SSC CGL", "State PCS", "Banking", "Railways"]
        }
        all_new_qs.append(q_obj)

    print(f"Total new unique questions to add: {len(all_new_qs)}")
    
    # Merge into master
    # First, replace existing Rajasthan state questions with enriched ones
    final_master_qs = [q for q in existing_master_qs if q.get('stateId') != 'rajasthan']
    final_master_qs.extend(all_new_qs)

    master_data['totalQuestions'] = len(final_master_qs)
    master_data['questions'] = final_master_qs

    with open(master_path, 'w', encoding='utf-8') as f:
        json.dump(master_data, f, ensure_ascii=False, indent=2)
    print(f"Successfully saved {len(final_master_qs)} questions to {master_path}")

    # Now update individual National & World topic JSON files
    update_individual_topic_files(all_new_qs)

def update_individual_topic_files(all_qs):
    # Group by topicId
    by_topic = {}
    for q in all_qs:
        tid = q.get('topicId')
        cat = q.get('gkCategory')
        if tid and cat in ('national', 'world'):
            by_topic.setdefault((cat, tid), []).append(q)

    for (cat, tid), qs in by_topic.items():
        dir_name = 'national' if cat == 'national' else 'world'
        file_path = f"src/data/gk/{dir_name}/{tid}.json"
        if not os.path.exists(file_path):
            continue
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                topic_data = json.load(f)
            
            existing_mcqs = topic_data.get('mcqs', [])
            seen_ids = {m.get('id') for m in existing_mcqs}
            seen_stems = {get_stem(m.get('questionText', m.get('q', ''))) for m in existing_mcqs}

            added = 0
            for q in qs:
                stem = get_stem(q.get('questionText', q.get('q', '')))
                if stem in seen_stems or q['id'] in seen_ids:
                    continue
                seen_stems.add(stem)
                
                # Format for topic file
                t_mcq = {
                    "id": q["id"],
                    "q": q.get("questionText", q.get("q")),
                    "questionText": q.get("questionText", q.get("q")),
                    "qHi": q.get("questionTextHi", q.get("qHi")),
                    "questionTextHi": q.get("questionTextHi", q.get("qHi")),
                    "o": q.get("options", q.get("o")),
                    "options": q.get("options", q.get("o")),
                    "oHi": q.get("optionsHi", q.get("oHi")),
                    "optionsHi": q.get("optionsHi", q.get("oHi")),
                    "a": q.get("correctIndex", q.get("a")),
                    "correctIndex": q.get("correctIndex", q.get("a")),
                    "exp": q.get("explanation", q.get("exp")),
                    "explanation": q.get("explanation", q.get("exp")),
                    "expHi": q.get("explanationHi", q.get("expHi")),
                    "explanationHi": q.get("explanationHi", q.get("expHi")),
                    "hint": q.get("hint", ""),
                    "hintHi": q.get("hintHi", ""),
                    "difficulty": q.get("difficulty", "medium"),
                    "examTags": q.get("examTags", ["UPSC", "SSC CGL"])
                }
                existing_mcqs.append(t_mcq)
                added += 1

            topic_data['mcqs'] = existing_mcqs
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(topic_data, f, ensure_ascii=False, indent=2)
            print(f"Updated {file_path}: added {added} questions (total now {len(existing_mcqs)})")
        except Exception as e:
            print(f"Error updating {file_path}: {e}")

if __name__ == '__main__':
    inject_all_datasets()
