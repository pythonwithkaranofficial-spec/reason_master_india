# -*- coding: utf-8 -*-
"""
Build Full GK Database - Master script to integrate, verify, and synchronize
all questions from World, Indian, and Rajasthan GK folders into ReasonMaster India.
"""

import os, sys, re, json

sys.stdout.reconfigure(encoding='utf-8')

def get_stem(text):
    clean = re.sub(r'[^a-zA-Z0-9\u0900-\u097F]', '', text.lower())
    return clean[:35]

# Comprehensive batch of World GK MCQs from QUIZ 2017-18
WORLD_QUIZ_MCQS = [
    # Countries, Capitals & Currencies
    {
        "topicId": "countries_capitals_currencies", "subtopicId": "capitals",
        "q": "What is the official federal capital city of Australia?",
        "qHi": "ऑस्ट्रेलिया की आधिकारिक संघीय राजधानी कौन सा शहर है?",
        "o": ["Canberra", "Sydney", "Melbourne", "Brisbane"],
        "oHi": ["कैनबरा", "सिडनी", "मेलबर्न", "ब्रिसबेन"],
        "a": 0,
        "exp": "Canberra was founded in 1913 as the purpose-built compromise capital between rival cities Sydney and Melbourne.",
        "expHi": "सिडनी और मेलबर्न के बीच प्रतिद्वंद्विता को समाप्त करने के लिए 1913 में दोनों के बीच कैनबरा को योजनाबद्ध राजधानी बनाया गया था।",
        "hint": "A purpose-built federal capital city founded in 1913.",
        "hintHi": "सिडनी या मेलबर्न नहीं, बल्कि 1913 में स्थापित एक योजनाबद्ध नगर।"
    },
    {
        "topicId": "countries_capitals_currencies", "subtopicId": "capitals",
        "q": "What is the capital city of Canada, situated on the south bank of the Ottawa River?",
        "qHi": "ओटावा नदी के दक्षिणी तट पर स्थित कनाडा की राजधानी कौन सा शहर है?",
        "o": ["Ottawa", "Toronto", "Vancouver", "Montreal"],
        "oHi": ["ओटावा", "टोरंटो", "वैंकूवर", "मॉन्ट्रियल"],
        "a": 0,
        "exp": "Queen Victoria chose Ottawa as Canada's permanent capital in 1857 because of its defensible location between French and English speaking provinces.",
        "expHi": "1857 में महारानी विक्टोरिया ने ओटावा को कनाडा की स्थायी राजधानी चुना था क्योंकि यह अंग्रेजी और फ्रेंच भाषी क्षेत्रों के मध्य स्थित सुरक्षित नगर था।",
        "hint": "Chosen as capital in 1857 by Queen Victoria.",
        "hintHi": "1857 में महारानी विक्टोरिया द्वारा चुनी गई राजधानी।"
    },
    {
        "topicId": "countries_capitals_currencies", "subtopicId": "capitals",
        "q": "What is the name of the national Parliament of Japan?",
        "qHi": "जापान की राष्ट्रीय संसद (व्यवस्थापिका) को क्या कहा जाता है?",
        "o": ["National Diet (डाइट)", "Knesset", "Duma", "Congress"],
        "oHi": ["डाइट (National Diet)", "नेसेट", "ड्यूमा", "कांग्रेस"],
        "a": 0,
        "exp": "The National Diet (Kokkai) is Japan's bicameral legislature, composed of the House of Representatives and the House of Councillors.",
        "expHi": "जापान की द्विसदनीय संसद को 'डाइट' (Diet / Kokkai) कहा जाता है। इसमें प्रतिनिधि सभा और पार्षद सभा शामिल हैं।",
        "hint": "Bicameral legislature known in Japanese as Kokkai.",
        "hintHi": "जापानी भाषा में इसे 'कोक्काई' कहा जाता है।"
    },
    {
        "topicId": "countries_capitals_currencies", "subtopicId": "currencies",
        "q": "What is the official currency of Russia?",
        "qHi": "रूस (रूसी संघ) की आधिकारिक मुद्रा कौन सी है?",
        "o": ["Russian Ruble (रूबल)", "Euro", "Yen", "Dinar"],
        "oHi": ["रूसी रूबल (Ruble)", "यूरो", "येन", "दीनार"],
        "a": 0,
        "exp": "The Russian Ruble (RUB) is the currency of the Russian Federation and the historic monetary unit used across centuries in Russia.",
        "expHi": "रूसी रूबल (RUB) रूसी संघ की आधिकारिक राष्ट्रीय मुद्रा है।",
        "hint": "Divided into 100 kopecks.",
        "hintHi": "यह 100 कोपेक में विभाजित होती है।"
    },
    {
        "topicId": "countries_capitals_currencies", "subtopicId": "capitals",
        "q": "What is the capital city of Brazil, famous for its airplane-shaped modernist masterplan designed by Oscar Niemeyer and Lúcio Costa?",
        "qHi": "ऑस्कर नीमेयर द्वारा हवाई जहाज के आकार में डिजाइन की गई ब्राजील की योजनाबद्ध राजधानी कौन सी है?",
        "o": ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
        "oHi": ["ब्रासीलिया (Brasília)", "रियो डी जनेरियो", "साओ पाउलो", "साल्वाडोर"],
        "a": 0,
        "exp": "Brasília was inaugurated as Brazil's planned federal capital on 21 April 1960, moving the seat of government inland from Rio de Janeiro.",
        "expHi": "21 अप्रैल 1960 को रियो डी जनेरियो के स्थान पर ब्रासीलिया को ब्राजील की नई और योजनाबद्ध संघीय राजधानी बनाया गया था।",
        "hint": "Replaced Rio de Janeiro as capital in 1960.",
        "hintHi": "1960 में रियो डी जनेरियो की जगह राजधानी बनी।"
    },
    # International Organizations
    {
        "topicId": "international_organizations", "subtopicId": "headquarters",
        "q": "Where is the global headquarters of the World Health Organization (WHO) located?",
        "qHi": "विश्व स्वास्थ्य संगठन (WHO - World Health Organization) का वैश्विक मुख्यालय कहाँ स्थित है?",
        "o": ["Geneva, Switzerland", "New York, USA", "Paris, France", "Rome, Italy"],
        "oHi": ["जिनेवा, स्विट्जरलैंड", "न्यू यॉर्क, अमेरिका", "पेरिस, फ्रांस", "रोम, इटली"],
        "a": 0,
        "exp": "The World Health Organization (WHO), established on 7 April 1948 (World Health Day), is headquartered in Geneva, Switzerland.",
        "expHi": "विश्व स्वास्थ्य संगठन (WHO) की स्थापना 7 अप्रैल 1948 (विश्व स्वास्थ्य दिवस) को हुई थी और इसका मुख्यालय जिनेवा, स्विट्जरलैंड में स्थित है।",
        "hint": "Founded on 7 April 1948; situated along Lake Geneva.",
        "hintHi": "7 अप्रैल 1948 को स्थापित; जिनेवा झील के किनारे स्थित।"
    },
    {
        "topicId": "international_organizations", "subtopicId": "headquarters",
        "q": "Where are the international headquarters of the International Monetary Fund (IMF) and the World Bank located?",
        "qHi": "अंतरराष्ट्रीय मुद्रा कोष (IMF) और विश्व बैंक (World Bank) का वैश्विक मुख्यालय किस शहर में स्थित है?",
        "o": ["Washington, D.C., USA", "Geneva, Switzerland", "London, UK", "New York, USA"],
        "oHi": ["वॉशिंगटन डी.सी., अमेरिका", "जिनेवा, स्विट्जरलैंड", "लंदन, ब्रिटेन", "न्यू यॉर्क, अमेरिका"],
        "a": 0,
        "exp": "Both the IMF and the World Bank were created at the Bretton Woods Conference in July 1944 and are headquartered in Washington, D.C.",
        "expHi": "1944 के ब्रेटन वुड्स सम्मेलन में स्थापित 'ब्रेटन वुड्स जुड़वाँ'—अंतरराष्ट्रीय मुद्रा कोष (IMF) और विश्व बैंक दोनों का मुख्यालय वॉशिंगटन डी.सी. में स्थित है।",
        "hint": "Known as the Bretton Woods twins, seated in the US capital.",
        "hintHi": "ब्रेटन वुड्स संस्थान; अमेरिकी राजधानी में स्थित।"
    },
    {
        "topicId": "international_organizations", "subtopicId": "headquarters",
        "q": "Where is the permanent headquarters of INTERPOL (International Criminal Police Organization) located?",
        "qHi": "इंटरपोल (INTERPOL - अंतरराष्ट्रीय आपराधिक पुलिस संगठन) का स्थायी मुख्यालय कहाँ स्थित है?",
        "o": ["Lyon, France", "Brussels, Belgium", "The Hague, Netherlands", "Vienna, Austria"],
        "oHi": ["लियोन, फ्रांस", "ब्रुसेल्स, बेल्जियम", "द हेग, नीदरलैंड्स", "वियना, ऑस्ट्रिया"],
        "a": 0,
        "exp": "INTERPOL (founded in 1923 as the International Criminal Police Commission) is headquartered in Lyon, France, facilitating worldwide police cooperation.",
        "expHi": "इंटरपोल (अंतरराष्ट्रीय पुलिस संगठन) की स्थापना 1923 में हुई थी और इसका मुख्यालय लियोन (फ्रांस) में स्थित है।",
        "hint": "Located in France's third-largest city on the Rhône river.",
        "hintHi": "फ्रांस के लियोन शहर में स्थित है।"
    },
    {
        "topicId": "international_organizations", "subtopicId": "regional_orgs",
        "q": "Where is the permanent secretariat and headquarters of the South Asian Association for Regional Cooperation (SAARC) located?",
        "qHi": "दक्षिण एशियाई क्षेत्रीय सहयोग संगठन (सार्क - SAARC) का स्थायी सचिवालय एवं मुख्यालय कहाँ स्थित है?",
        "o": ["Kathmandu, Nepal", "New Delhi, India", "Dhaka, Bangladesh", "Colombo, Sri Lanka"],
        "oHi": ["काठमांडू, नेपाल", "नई दिल्ली, भारत", "ढाका, बांग्लादेश", "कोलंबो, श्रीलंका"],
        "a": 0,
        "exp": "SAARC was founded in Dhaka on 8 December 1985. Its permanent Secretariat was established in Kathmandu, Nepal, on 16 January 1987.",
        "expHi": "सार्क (SAARC) की स्थापना 8 दिसंबर 1985 को ढाका में हुई थी, जबकि इसका स्थायी सचिवालय 16 जनवरी 1987 को काठमांडू (नेपाल) में स्थापित किया गया।",
        "hint": "Capital city of the Himalayan nation Nepal.",
        "hintHi": "हिमालयी राष्ट्र नेपाल की राजधानी में स्थित।"
    },
    # World Geography
    {
        "topicId": "world_geography", "subtopicId": "water_bodies",
        "q": "Which is the highest uninterrupted waterfall in the world, plunging 979 meters (3,212 feet)?",
        "qHi": "विश्व का सबसे ऊँचा अविरल जलप्रपात कौन सा है, जिसकी कुल ऊँचाई 979 मीटर (3,212 फीट) है?",
        "o": ["Angel Falls (Venezuela)", "Niagara Falls", "Victoria Falls", "Iguazu Falls"],
        "oHi": ["एंजेल जलप्रपात (वेनेजुएला)", "नियाग्रा जलप्रपात", "विक्टोरिया जलप्रपात", "इगुआजू जलप्रपात"],
        "a": 0,
        "exp": "Angel Falls (Salto Ángel) in the Canaima National Park, Venezuela, drops 979 meters from the Auyán-tepui mountain, making it the highest waterfall on Earth.",
        "expHi": "वेनेजुएला के कानाइमा नेशनल पार्क में औयान-टेपुई पर्वत से गिरने वाला एंजेल जलप्रपात (979 मीटर) विश्व का सबसे ऊँचा जलप्रपात है।",
        "hint": "Located in Canaima National Park, Venezuela; named after aviator Jimmie Angel.",
        "hintHi": "वेनेजुएला के कानाइमा नेशनल पार्क में स्थित।"
    },
    {
        "topicId": "world_geography", "subtopicId": "waterways",
        "q": "Which artificial waterway opened in 1869 connects the Mediterranean Sea to the Red Sea, eliminating the route around Africa?",
        "qHi": "1869 में खोला गया कौन सा कृत्रिम जलमार्ग भूमध्य सागर को लाल सागर से जोड़ता है?",
        "o": ["Suez Canal (Egypt)", "Panama Canal", "Kiel Canal", "Corinth Canal"],
        "oHi": ["स्वेज नहर (मिस्र)", "पनामा नहर", "कील नहर", "कोरिंथ नहर"],
        "a": 0,
        "exp": "The Suez Canal in Egypt, engineered by Ferdinand de Lesseps and opened on 17 November 1869, creates a direct maritime route between the North Atlantic and northern Indian oceans via the Mediterranean and Red seas.",
        "expHi": "मिस्र में स्थित 193.3 किमी लंबी स्वेज नहर 17 नवंबर 1869 को खोली गई थी। यह भूमध्य सागर और लाल सागर को जोड़कर यूरोप और एशिया के बीच की समुद्री दूरी को हजारों मील कम करती है।",
        "hint": "Engineered by Ferdinand de Lesseps in Egypt, opened in 1869.",
        "hintHi": "1869 में मिस्र में शुरू हुई विश्व प्रसिद्ध नहर।"
    },
    {
        "topicId": "world_geography", "subtopicId": "relief_features",
        "q": "Which is the largest island in the world that is not a continent?",
        "qHi": "महाद्वीपों को छोड़कर विश्व का सबसे बड़ा द्वीप कौन सा है?",
        "o": ["Greenland (ग्रनलैंड)", "New Guinea", "Borneo", "Madagascar"],
        "oHi": ["ग्रीनलैंड", "न्यू गिनी", "बोर्नियो", "मेडागास्कर"],
        "a": 0,
        "exp": "Greenland covers 2,166,086 sq km, making it the world's largest non-continental island, politically an autonomous territory within the Kingdom of Denmark.",
        "expHi": "ग्रीनलैंड लगभग 21.6 लाख वर्ग किमी क्षेत्रफल के साथ विश्व का सबसे बड़ा द्वीप है। यह भौगोलिक रूप से उत्तरी अमेरिका और राजनीतिक रूप से डेनमार्क का भाग है।",
        "hint": "An autonomous territory within the Kingdom of Denmark.",
        "hintHi": "डेनमार्क के अधीन स्वायत्त क्षेत्र।"
    },
    {
        "topicId": "world_geography", "subtopicId": "mountains",
        "q": "Which is the longest continental mountain range in the world, stretching approximately 7,000 km along western South America?",
        "qHi": "दक्षिण अमेरिका के पश्चिमी तट के समानांतर लगभग 7,000 किमी लंबी विश्व की सबसे लंबी पर्वत श्रृंखला कौन सी है?",
        "o": ["Andes Mountains", "Rocky Mountains", "Himalayas", "Alps"],
        "oHi": ["एंडीज पर्वतमाला", "रॉकी पर्वतमाला", "हिमालय", "आल्प्स"],
        "a": 0,
        "exp": "The Andes mountain range extends over 7,000 km (4,350 miles) through 7 South American countries (Venezuela, Colombia, Ecuador, Peru, Bolivia, Chile, Argentina). Highest peak is Aconcagua (6,961 m).",
        "expHi": "एंडीज पर्वतमाला दक्षिण अमेरिका के 7 देशों में 7,000 किमी लंबाई में फैली विश्व की सबसे लंबी पर्वत श्रृंखला है। इसकी सर्वोच्च चोटी एकांकागुआ (6,961 मीटर) है।",
        "hint": "Passes through 7 South American nations; Mount Aconcagua is its highest peak.",
        "hintHi": "दक्षिण अमेरिका के 7 देशों से गुजरने वाली पर्वतमाला; सर्वोच्च चोटी एकांकागुआ।"
    },
    # World History & Monuments
    {
        "topicId": "world_history", "subtopicId": "wonders",
        "q": "The ancient rose-red city of 'Petra', half-carved into sandstone cliffs, is located in which modern Middle Eastern country?",
        "qHi": "चट्टानों को तराश कर बनाई गई प्राचीन 'पेत्रा' (Petra) नगरी किस आधुनिक मध्य-पूर्वी देश में स्थित है?",
        "o": ["Jordan (जॉर्डन)", "Egypt", "Syria", "Iraq"],
        "oHi": ["जॉर्डन", "मिस्र", "सीरिया", "इराक"],
        "a": 0,
        "exp": "Petra, the historic capital of the Nabataean kingdom established around the 4th century BCE, is famous for its rock-cut architecture (such as Al-Khazneh) in modern-day Jordan.",
        "expHi": "पेत्रा जॉर्डन के मआन प्रांत में स्थित प्राचीन नबाती साम्राज्य की राजधानी थी, जिसे लाल बलुआ पत्थर की चट्टानों को तराश कर बनाया गया था। यह नवीन सात अजूबों में शामिल है।",
        "hint": "Capital of the ancient Nabataean kingdom; famous for Al-Khazneh (The Treasury).",
        "hintHi": "प्राचीन नबाती राज्य की राजधानी; अल-खजनेह (खजाना) के लिए विख्यात।"
    },
    {
        "topicId": "world_history", "subtopicId": "ancient_world",
        "q": "Which ancient wonder of the world is the only one still largely intact today?",
        "qHi": "प्राचीन विश्व के सात अजूबों में से एकमात्र कौन सा अजूबा आज भी अपने मूल स्वरूप में विद्यमान है?",
        "o": ["Great Pyramid of Giza (Egypt)", "Hanging Gardens of Babylon", "Colossus of Rhodes", "Lighthouse of Alexandria"],
        "oHi": ["गीजा का महान पिरामिड (मिस्र)", "बेबिलोन के झूलते बाग", "रोड्स की विशाल प्रतिमा", "अलेक्जेंड्रिया का प्रकाशस्तंभ"],
        "a": 0,
        "exp": "The Great Pyramid of Giza (Pyramid of Khufu), built circa 2560 BCE in ancient Egypt, is the oldest and only surviving wonder of the original Seven Wonders of the Ancient World.",
        "expHi": "मिस्र के काहिरा के पास स्थित गीजा का पिरामिड (खूफू का पिरामिड, लगभग 2560 ईसा पूर्व) प्राचीन विश्व के सात आश्चर्यों में सबसे पुराना और एकमात्र शेष बचा आश्चर्य है।",
        "hint": "Constructed around 2560 BCE during the reign of Pharaoh Khufu.",
        "hintHi": "लगभग 2560 ईसा पूर्व फिरौन खूफू के काल में निर्मित।"
    },
    # World Sports
    {
        "topicId": "world_sports", "subtopicId": "olympics",
        "q": "Where were the first modern Olympic Games held in the year 1896 under the initiative of Pierre de Coubertin?",
        "qHi": "पियरे डी कुबर्टिन के प्रयासों से 1896 में प्रथम आधुनिक ओलंपिक खेल किस ऐतिहासिक शहर में आयोजित हुए थे?",
        "o": ["Athens, Greece", "Paris, France", "London, UK", "Rome, Italy"],
        "oHi": ["एथेंस, ग्रीस (यूनान)", "पेरिस, फ्रांस", "लंदन, ब्रिटेन", "रोम, इटली"],
        "a": 0,
        "exp": "The first modern Olympic Games were organized by the International Olympic Committee (IOC) and held at the Panathenaic Stadium in Athens, Greece, from 6 to 15 April 1896.",
        "expHi": "प्रथम आधुनिक ओलंपिक खेल 6 से 15 अप्रैल 1896 के मध्य यूनान (ग्रीस) की राजधानी एथेंस के पानाथिनाइको स्टेडियम में आयोजित किए गए थे।",
        "hint": "Held at the Panathenaic Stadium in Greece.",
        "hintHi": "यूनान के ऐतिहासिक स्टेडियम में आयोजित।"
    },
    {
        "topicId": "world_sports", "subtopicId": "football",
        "q": "Which country has won the men's FIFA World Cup the highest number of times (5 titles)?",
        "qHi": "पुरुषों का फीफा विश्व कप (FIFA World Cup) सर्वाधिक बार (5 बार) किस देश ने जीता है?",
        "o": ["Brazil (1958, 1962, 1970, 1994, 2002)", "Germany", "Italy", "Argentina"],
        "oHi": ["ब्राजील (5 बार)", "जर्मनी", "इटली", "अर्जेंटीना"],
        "a": 0,
        "exp": "Brazil (Seleção) has won the FIFA World Cup a record five times: in 1958, 1962, 1970, 1994, and 2002, and is the only country to have played in every tournament.",
        "expHi": "ब्राजील ने रिकॉर्ड 5 बार (1958, 1962, 1970, 1994 और 2002) फीफा विश्व कप जीता है और वह प्रत्येक विश्व कप में भाग लेने वाला एकमात्र देश है।",
        "hint": "The Seleção won in 1958, 1962, 1970, 1994, and 2002.",
        "hintHi": "पेले और रोनाल्डो जैसे दिग्गजों का देश जिन्होंने 5 बार खिताब जीता।"
    },
    # World Days
    {
        "topicId": "world_important_days", "subtopicId": "un_days",
        "q": "When is International Women's Day celebrated worldwide to champion women's rights and equality?",
        "qHi": "महिलाओं के अधिकारों और सामाजिक-आर्थिक उपलब्धियों के सम्मान में 'अंतरराष्ट्रीय महिला दिवस' प्रतिवर्ष कब मनाया जाता है?",
        "o": ["8 March", "13 February", "24 January", "1 December"],
        "oHi": ["8 मार्च", "13 फरवरी", "24 जनवरी", "1 दिसंबर"],
        "a": 0,
        "exp": "International Women's Day is celebrated on 8 March across the world to advocate for gender parity and recognize women's socio-economic and cultural contributions.",
        "expHi": "प्रतिवर्ष 8 मार्च को अंतरराष्ट्रीय महिला दिवस मनाया जाता है (13 फरवरी भारत में राष्ट्रीय महिला दिवस है जो सरोजिनी नायडू के जन्मदिवस पर मनाया जाता है)।",
        "hint": "Observed globally on the 8th of March.",
        "hintHi": "मार्च माह की 8 तारीख को वैश्विक रूप से मनाया जाता है।"
    },
    {
        "topicId": "world_important_days", "subtopicId": "un_days",
        "q": "United Nations Day is commemorated every year on which date, marking the entry into force of the UN Charter in 1945?",
        "qHi": "1945 में संयुक्त राष्ट्र चार्टर के प्रभावी होने की स्मृति में प्रतिवर्ष 'संयुक्त राष्ट्र दिवस' (UN Day) किस तिथि को मनाया जाता है?",
        "o": ["24 October", "10 December", "15 September", "5 June"],
        "oHi": ["24 अक्टूबर", "10 दिसंबर", "15 सितंबर", "5 जून"],
        "a": 0,
        "exp": "United Nations Day has been celebrated on 24 October since 1948, marking the anniversary of the entry into force of the UN Charter on 24 October 1945.",
        "expHi": "24 अक्टूबर 1945 को संयुक्त राष्ट्र संघ (UNO) का चार्टर लागू हुआ था, इसलिए प्रतिवर्ष 24 अक्टूबर को संयुक्त राष्ट्र दिवस मनाया जाता है। (10 दिसंबर मानवाधिकार दिवस है)।",
        "hint": "Commemorates the founding of the UN on 24 October 1945.",
        "hintHi": "24 अक्टूबर 1945 को यूएन चार्टर लागू हुआ था।"
    }
]

# Additional High-Yield Indian GK from 100 Easy & National PDFs
NATIONAL_ADDITIONAL_MCQS = [
    {
        "topicId": "static_gk_superlatives", "subtopicId": "national_symbols",
        "q": "What is the official ratio of length to width of the National Flag of India (Tiranga)?",
        "qHi": "भारत के राष्ट्रीय ध्वज (तिरंगा) की लंबाई और चौड़ाई का आधिकारिक संवैधानिक अनुपात क्या है?",
        "o": ["3 : 2", "2 : 3", "4 : 3", "3 : 1"],
        "oHi": ["3 : 2", "2 : 3", "4 : 3", "3 : 1"],
        "a": 0,
        "exp": "Under the Flag Code of India, the ratio of the length to the height (width) of the National Flag shall be 3:2 (if width to length, it is 2:3).",
        "expHi": "भारतीय ध्वज संहिता के अनुसार राष्ट्रीय ध्वज की लंबाई और चौड़ाई का अनुपात 3:2 होता है (तथा चौड़ाई और लंबाई का अनुपात 2:3 होता है)।",
        "hint": "Length is 3 units for every 2 units of width.",
        "hintHi": "लंबाई 3 इकाई और चौड़ाई 2 इकाई।"
    },
    {
        "topicId": "static_gk_superlatives", "subtopicId": "national_symbols",
        "q": "How many spokes are there in the Ashoka Chakra (Dharma Chakra) in the center of the Indian National Flag?",
        "qHi": "भारतीय राष्ट्रीय ध्वज के सफेद पट्टी के केंद्र में स्थित अशोक चक्र में कितनी तीलियाँ (Spokes) होती हैं?",
        "o": ["24 Spokes (navy blue)", "20 Spokes", "22 Spokes", "26 Spokes"],
        "oHi": ["24 तीलियाँ (गहरा नीला)", "20 तीलियाँ", "22 तीलियाँ", "26 तीलियाँ"],
        "a": 0,
        "exp": "The Ashoka Chakra has 24 spokes in navy blue color, representing the 24 hours of the day and 24 ethical virtues of Dharma from Ashoka's Lion Capital of Sarnath.",
        "expHi": "सारनाथ के अशोक सिंह स्तंभ से लिए गए धर्मचक्र में 24 तीलियाँ होती हैं, जिनका रंग गहरा नीला (Navy Blue) होता है और ये निरंतर प्रगति और धर्म के 24 गुणों की प्रतीक हैं।",
        "hint": "Navy blue wheel taken from the Lion Capital of Ashoka at Sarnath.",
        "hintHi": "सारनाथ के सिंह स्तंभ से लिया गया गहरे नीले रंग का चक्र।"
    },
    {
        "topicId": "static_gk_superlatives", "subtopicId": "national_symbols",
        "q": "Who among the following designed the National Flag of independent India adopted on 22 July 1947?",
        "qHi": "22 जुलाई 1947 को संविधान सभा द्वारा अपनाए गए स्वतंत्र भारत के राष्ट्रीय ध्वज का मूल स्वरूप किसने डिजाइन किया था?",
        "o": ["Pingali Venkayya", "Rabindranath Tagore", "Bhikaji Cama", "Bankim Chandra Chattopadhyay"],
        "oHi": ["पिंगली वेंकैया", "रवींद्रनाथ टैगोर", "भीकाजी कामा", "बंकिम चंद्र चट्टोपाध्याय"],
        "a": 0,
        "exp": "Pingali Venkayya, an agriculturist and freedom fighter from Andhra Pradesh, presented the flag design to Mahatma Gandhi in 1921, which served as the foundation of the National Flag adopted in 1947.",
        "expHi": "आंध्र प्रदेश के स्वतंत्रता सेनानी पिंगली वेंकैया ने भारतीय राष्ट्रीय ध्वज का प्रारूप तैयार किया था, जिसे 22 जुलाई 1947 को संविधान सभा ने राष्ट्रीय ध्वज के रूप में स्वीकार किया।",
        "hint": "Freedom fighter from Andhra Pradesh; his design was adopted on 22 July 1947.",
        "hintHi": "आंध्र प्रदेश के स्वतंत्रता सेनानी जिन्होंने 1921 में गांधीजी को प्रारूप सौंपा था।"
    },
    {
        "topicId": "static_gk_superlatives", "subtopicId": "national_symbols",
        "q": "What is the playing time of the full standard version of the National Anthem of India, 'Jana Gana Mana'?",
        "qHi": "रवींद्रनाथ टैगोर द्वारा रचित भारत के राष्ट्रगान 'जन गण मन' के गायन की आधिकारिक मानक समयावधि कितनी है?",
        "o": ["52 Seconds (52 सेकंड)", "50 Seconds", "65 Seconds", "60 Seconds"],
        "oHi": ["52 सेकंड", "50 सेकंड", "65 सेकंड", "60 सेकंड"],
        "a": 0,
        "exp": "The full official duration of the National Anthem of India 'Jana Gana Mana' is approximately 52 seconds (short version consisting of first and last lines takes about 20 seconds).",
        "expHi": "भारत के राष्ट्रगान 'जन गण मन' को पूर्ण रूप से गाने में 52 सेकंड का समय लगता है (इसके संक्षिप्त रूप में प्रथम और अंतिम पंक्ति गाने में लगभग 20 सेकंड लगते हैं)।",
        "hint": "Exactly 52 seconds for the full version.",
        "hintHi": "राष्ट्रगान के पूरे गायन में ठीक 52 सेकंड लगते हैं।"
    },
    {
        "topicId": "static_gk_superlatives", "subtopicId": "national_symbols",
        "q": "Which river was officially declared the 'National River of India' in November 2008?",
        "qHi": "नवंबर 2008 में किस पवित्र नदी को भारत की 'राष्ट्रीय नदी' घोषित किया गया था?",
        "o": ["Ganga River", "Yamuna River", "Brahmaputra River", "Godavari River"],
        "oHi": ["गंगा नदी", "यमुना नदी", "ब्रह्मपुत्र नदी", "गोदावरी नदी"],
        "a": 0,
        "exp": "The River Ganga (2,525 km) was declared India's National River on 4 November 2008 to achieve the objectives of clean river conservation under the National Ganga River Basin Authority (NGRBA).",
        "expHi": "4 नवंबर 2008 को तत्कालीन प्रधानमंत्री डॉ. मनमोहन सिंह द्वारा गंगा नदी (लंबाई 2,525 किमी) को भारत की 'राष्ट्रीय नदी' घोषित किया गया था।",
        "hint": "India's longest river stretching 2,525 km from Gangotri to Bay of Bengal.",
        "hintHi": "गंगोत्री से बंगाल की खाड़ी तक 2,525 किमी बहने वाली भारत की सबसे लंबी नदी।"
    },
    {
        "topicId": "static_gk_superlatives", "subtopicId": "national_symbols",
        "q": "Which creature was notified as the 'National Aquatic Animal of India' in October 2009?",
        "qHi": "अक्टूबर 2009 में किस दुर्लभ स्तनधारी जीव को भारत का 'राष्ट्रीय जलीय जीव' घोषित किया गया था?",
        "o": ["Ganges River Dolphin (प्लैटानिस्ता गंगेटिका)", "Gharial", "Olive Ridley Turtle", "Dugong"],
        "oHi": ["गंगा नदी डॉल्फिन (Ganges River Dolphin)", "घड़ियाल", "ओलिव रिडले कछुआ", "डूगोंग (समुद्री गाय)"],
        "a": 0,
        "exp": "The South Asian River Dolphin (Platanista gangetica), commonly called 'Susu', was notified as the National Aquatic Animal of India on 5 October 2009, reflecting clean freshwater river health.",
        "expHi": "5 अक्टूबर 2009 को गंगा नदी में पाई जाने वाली डॉल्फिन (प्लैटानिस्ता गंगेटिका, स्थानीय नाम 'सोंस') को भारत का राष्ट्रीय जलीय जीव घोषित किया गया। प्रतिवर्ष 5 अक्टूबर को 'राष्ट्रीय डॉल्फिन दिवस' मनाया जाता है।",
        "hint": "A nearly blind freshwater dolphin species locally called 'Susu'.",
        "hintHi": "मीठे पानी की दृष्टिहीन स्तनधारी डॉल्फिन जिसे 'सोंस' भी कहते हैं।"
    },
    {
        "topicId": "national_parks_wildlife", "subtopicId": "national_parks",
        "q": "Kaziranga National Park in Assam is globally acclaimed for hosting two-thirds of the world's population of which animal?",
        "qHi": "असम का काजीरंगा राष्ट्रीय उद्यान किस संकटग्रस्त वन्यजीव की विश्व की दो-तिहाई आबादी का संरक्षण करने के लिए प्रसिद्ध है?",
        "o": ["Great One-horned Rhinoceros (एक सींग वाला गैंडा)", "Royal Bengal Tiger", "Asiatic Lion", "Snow Leopard"],
        "oHi": ["एक सींग वाला गैंडा (One-horned Rhino)", "रॉयल बंगाल टाइगर", "एशियाई शेर", "हिम तेंदुआ"],
        "a": 0,
        "exp": "Kaziranga National Park in Golaghat and Nagaon districts of Assam is a UNESCO World Heritage Site home to the world's largest population of the Great Indian One-horned Rhinoceros (Rhinoceros unicornis).",
        "expHi": "असम के गोलाघाट व नगाँव जिलों में स्थित काजीरंगा राष्ट्रीय उद्यान 1985 में यूनेस्को विश्व धरोहर घोषित हुआ। यह विश्व के दो-तिहाई 'एक सींग वाले भारतीय गैंडों' का प्राकृतिक आवास है।",
        "hint": "Inscribed on UNESCO World Heritage list in 1985; located along the Brahmaputra River.",
        "hintHi": "ब्रह्मपुत्र नदी के किनारे स्थित यूनेस्को विश्व धरोहर स्थल।"
    },
    {
        "topicId": "indian_geography", "subtopicId": "peninsular_rivers",
        "q": "Which river is celebrated as 'Dakshin Ganga' (Ganges of the South) and is the longest peninsular river in India?",
        "qHi": "किस नदी को 'दक्षिण गंगा' या 'वृद्ध गंगा' कहा जाता है तथा जो भारत के प्रायद्वीपीय पठार की सबसे लंबी नदी (1,465 किमी) है?",
        "o": ["Godavari River", "Krishna River", "Cauvery River", "Mahanadi River"],
        "oHi": ["गोदावरी नदी", "कृष्णा नदी", "कावेरी नदी", "महानदी"],
        "a": 0,
        "exp": "The Godavari River rises at Trimbakeshwar near Nashik in Maharashtra and flows 1,465 km into the Bay of Bengal, celebrated as the 'Dakshin Ganga' or 'Vridha Ganga'.",
        "expHi": "गोदावरी नदी महाराष्ट्र के नासिक जिले के त्र्यंबकेश्वर से निकलकर 1,465 किमी बहती हुई बंगाल की खाड़ी में गिरती है। विशालता और पवित्रता के कारण इसे 'दक्षिण गंगा' या 'वृद्ध गंगा' कहा जाता है।",
        "hint": "Rises from Trimbakeshwar near Nashik in Maharashtra.",
        "hintHi": "महाराष्ट्र के नासिक के निकट त्र्यंबकेश्वर से निकलती है।"
    },
    {
        "topicId": "science_technology", "subtopicId": "isro_missions",
        "q": "On which historic date did ISRO's Chandrayaan-3 lander Vikram make a successful soft landing near the Moon's South Pole, making India the first country to do so?",
        "qHi": "इसरो के चंद्रयान-3 के लैंडर विक्रम ने चंद्रमा के दक्षिणी ध्रुव के पास किस ऐतिहासिक तारीख को सफल सॉफ्ट लैंडिंग कर भारत को विश्व का प्रथम देश बनाया था?",
        "o": ["23 August 2023 (National Space Day)", "14 July 2023", "2 September 2023", "22 July 2019"],
        "oHi": ["23 अगस्त 2023 (राष्ट्रीय अंतरिक्ष दिवस)", "14 जुलाई 2023", "2 सितंबर 2023", "22 जुलाई 2019"],
        "a": 0,
        "exp": "On 23 August 2023 at 18:04 IST, Chandrayaan-3's Vikram lander successfully touched down near the lunar South Pole. The landing site was named 'Shiv Shakti Point', and 23 August was declared 'National Space Day'.",
        "expHi": "23 अगस्त 2023 को चंद्रयान-3 ने चंद्रमा के दक्षिणी ध्रुव पर ऐतिहासिक लैंडिंग की। इस लैंडिंग स्थल को 'शिव शक्ति पॉइंट' नाम दिया गया और भारत सरकार ने प्रतिवर्ष 23 अगस्त को 'राष्ट्रीय अंतरिक्ष दिवस' घोषित किया।",
        "hint": "Now celebrated annually in India as National Space Day; landing point named Shiv Shakti.",
        "hintHi": "अब प्रतिवर्ष राष्ट्रीय अंतरिक्ष दिवस के रूप में मनाया जाता है; स्थल का नाम शिव शक्ति पॉइंट है।"
    },
    {
        "topicId": "indian_history", "subtopicId": "ancient_rulers",
        "q": "Which Maurya emperor was referred to as 'Devanampiya Piyadassi' (Beloved of the Gods) in his rock and pillar edicts?",
        "qHi": "मौर्य वंश के किस महान सम्राट को उनके शिलालेखों और स्तंभ अभिलेखों में 'देवानामप्रिय प्रियदर्शी' (देवताओं के प्रिय) कहा गया है?",
        "o": ["Emperor Ashoka", "Chandragupta Maurya", "Bindusara", "Brihadratha"],
        "oHi": ["सम्राट अशोक", "चंद्रगुप्त मौर्य", "बिंदुसार", "बृहद्रथ"],
        "a": 0,
        "exp": "In 1837, James Prinsep deciphered Brahmi script and confirmed that the royal title 'Devanampiya Piyadassi' referred to the Maurya Emperor Ashoka the Great.",
        "expHi": "1837 में जेम्स प्रिंसेप ने ब्राह्मी लिपि को पढ़कर यह स्पष्ट किया कि शिलालेखों में उल्लिखित 'देवानामप्रिय प्रियदर्शी' उपाधि महान मौर्य सम्राट अशोक की है।",
        "hint": "Deciphered in 1837 by James Prinsep.",
        "hintHi": "1837 में जेम्स प्रिंसेप द्वारा ब्राह्मी लिपि में पढ़े गए सम्राट।"
    }
]

def build_and_inject_all():
    # 1. Update Master Question Bank
    master_path = 'src/data/gk/questions/gk_questions_master.json'
    with open(master_path, 'r', encoding='utf-8') as f:
        master_data = json.load(f)

    existing_master_qs = master_data.get('questions', [])
    seen_stems = {get_stem(q.get('questionText', q.get('q', ''))) for q in existing_master_qs}
    seen_ids = {q['id'] for q in existing_master_qs}

    new_master_qs = []

    # Add World Quiz MCQs
    for idx, item in enumerate(WORLD_QUIZ_MCQS, 1):
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_world_{item['topicId']}_quiz_{idx}"
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "world",
            "topicId": item["topicId"],
            "subtopicId": item.get("subtopicId", "general"),
            "questionType": "mcq",
            "questionText": item["q"],
            "questionTextHi": item["qHi"],
            "options": item["o"],
            "optionsHi": item["oHi"],
            "correctIndex": item["a"],
            "difficulty": "medium",
            "hint": item["hint"],
            "hintHi": item["hintHi"],
            "explanation": item["exp"],
            "explanationHi": item["expHi"],
            "lastVerified": "2026-03",
            "examTags": ["UPSC", "SSC CGL", "State PCS", "Banking", "Railways"]
        }
        new_master_qs.append(q_obj)

    # Add National Additional MCQs
    for idx, item in enumerate(NATIONAL_ADDITIONAL_MCQS, 1):
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_nat_{item['topicId']}_add_{idx}"
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "national",
            "topicId": item["topicId"],
            "subtopicId": item.get("subtopicId", "general"),
            "questionType": "mcq",
            "questionText": item["q"],
            "questionTextHi": item["qHi"],
            "options": item["o"],
            "optionsHi": item["oHi"],
            "correctIndex": item["a"],
            "difficulty": "medium",
            "hint": item["hint"],
            "hintHi": item["hintHi"],
            "explanation": item["exp"],
            "explanationHi": item["expHi"],
            "lastVerified": "2026-03",
            "examTags": ["UPSC", "SSC CGL", "State PCS", "CDS", "NDA", "RRB"]
        }
        new_master_qs.append(q_obj)

    print(f"Adding {len(new_master_qs)} newly verified questions to Master...")
    combined_master_qs = existing_master_qs + new_master_qs
    master_data['totalQuestions'] = len(combined_master_qs)
    master_data['questions'] = combined_master_qs

    with open(master_path, 'w', encoding='utf-8') as f:
        json.dump(master_data, f, ensure_ascii=False, indent=2)
    print(f"Master question bank successfully updated to {len(combined_master_qs)} questions!")

    # 2. Update individual National & World topic JSON files
    all_to_distribute = new_master_qs
    by_topic = {}
    for q in all_to_distribute:
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
            seen_t_ids = {m.get('id') for m in existing_mcqs}
            seen_t_stems = {get_stem(m.get('questionText', m.get('q', ''))) for m in existing_mcqs}

            added = 0
            for q in qs:
                stem = get_stem(q.get('questionText', q.get('q', '')))
                if stem in seen_t_stems or q['id'] in seen_t_ids:
                    continue
                seen_t_stems.add(stem)
                
                t_mcq = {
                    "id": q["id"],
                    "q": q["questionText"],
                    "questionText": q["questionText"],
                    "qHi": q["questionTextHi"],
                    "questionTextHi": q["questionTextHi"],
                    "o": q["options"],
                    "options": q["options"],
                    "oHi": q["optionsHi"],
                    "optionsHi": q["optionsHi"],
                    "a": q["correctIndex"],
                    "correctIndex": q["correctIndex"],
                    "exp": q["explanation"],
                    "explanation": q["explanation"],
                    "expHi": q["explanationHi"],
                    "explanationHi": q["explanationHi"],
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
    build_and_inject_all()
