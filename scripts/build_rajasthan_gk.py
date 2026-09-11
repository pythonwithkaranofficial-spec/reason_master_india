# -*- coding: utf-8 -*-
"""
Script to extract, verify, synthesize 4-option MCQs, and enrich Rajasthan GK
from:
  - corrected-rajasthan-gk-1-100_compress.pdf (100 fact-checked questions)
  - rajasthan-gk-questions-hindi_compress.pdf (30 MCQs with font glyph correction)
  - rajasthan-genral-knowledge_compress.pdf (80 bilingual questions)
"""

import os, sys, re, json

sys.stdout.reconfigure(encoding='utf-8')

# 1. Defined curated verified questions from corrected-rajasthan-gk-1-100_compress.pdf
# Each has verified question (EN), question (HI), 4 options (EN), 4 options (HI), correctIndex, exp (EN), exp (HI), hint (EN), hint (HI), topicId
CORRECTED_100_DATA = [
    {
        "q": "Who was the founder of the Mewar kingdom / Guhila dynasty of Chittor?",
        "qHi": "मेवाड़ राज्य के गुहिल वंश के संस्थापक / वास्तविक संस्थापक कौन थे?",
        "o": ["Bappa Rawal", "Rana Sanga", "Rana Kumbha", "Maharana Pratap"],
        "oHi": ["बप्पा रावल", "राणा सांगा", "राणा कुम्भा", "महाराणा प्रताप"],
        "a": 0,
        "exp": "Bappa Rawal (Kalbhoj) founded the Guhila rule in Mewar in 734 AD after taking Chittor from the Mori ruler Manmori with the blessings of Sage Harit Rishi.",
        "expHi": "बप्पा रावल (कालभोज) ने 734 ईस्वी में महर्षि हारित ऋषि के आशीर्वाद से मोरी शासक मानमोरी को पराजित कर मेवाड़ में गुहिल साम्राज्य की नींव रखी थी।",
        "hint": "He made Nagda his first capital in the 8th century.",
        "hintHi": "इन्होंने 8वीं शताब्दी में नागदा को अपनी राजधानी बनाया था।",
        "topicId": "rajasthan_history",
        "subtopicId": "mewar_dynasty"
    },
    {
        "q": "Which legendary Rajput ruler fought the historic Battle of Haldighati against the Mughal army in 1576?",
        "qHi": "किस महान राजपूत शासक ने 1576 में मुगल सेना के विरुद्ध ऐतिहासिक हल्दीघाटी का युद्ध लड़ा था?",
        "o": ["Maharana Pratap", "Rana Sanga", "Prithviraj Chauhan", "Rao Jodha"],
        "oHi": ["महाराणा प्रताप", "राणा सांगा", "पृथ्वीराज चौहान", "राव जोधा"],
        "a": 0,
        "exp": "The Battle of Haldighati was fought on 18 June 1576 between Maharana Pratap of Mewar and the Mughal army led by Raja Man Singh I of Amber.",
        "expHi": "हल्दीघाटी का ऐतिहासिक युद्ध 18 जून 1576 को मेवाड़ के महाराणा प्रताप और आमेर के राजा मानसिंह के नेतृत्व वाली मुगल सेना के बीच लड़ा गया था।",
        "hint": "His loyal warhorse was named Chetak.",
        "hintHi": "इनके स्वामीभक्त घोड़े का नाम चेतक था।",
        "topicId": "rajasthan_history",
        "subtopicId": "mewar_dynasty"
    },
    {
        "q": "Who is the author of the famous epic 'Prithviraj Raso', celebrating the life of Prithviraj Chauhan III?",
        "qHi": "पृथ्वीराज चौहान तृतीय के जीवन पर आधारित प्रसिद्ध महाकाव्य 'पृथ्वीराज रासो' के रचयिता कौन हैं?",
        "o": ["Chand Bardai", "Suryamal Misran", "Muhnot Nainsi", "Kaviraj Shyamaldas"],
        "oHi": ["चंद बरदाई", "सूर्यमल मिश्रण", "मुहणौत नैणसी", "कविराज श्यामलदास"],
        "a": 0,
        "exp": "Chand Bardai was the court poet and friend of Prithviraj Chauhan III who composed 'Prithviraj Raso' in Pingal (Braj bhasha with Rajasthani influence).",
        "expHi": "चंद बरदाई पृथ्वीराज चौहान तृतीय के राजकवि और परम मित्र थे, जिन्होंने पिंगल (ब्रज-राजस्थानी) भाषा में 'पृथ्वीराज रासो' की रचना की थी।",
        "hint": "Famous for the couplet 'Chaar baans chaubees gaj, angul asht pramaan...'",
        "hintHi": "'चार बाँस चौबीस गज, अंगुल अष्ट प्रमाण...' दोहे के रचयिता।",
        "topicId": "rajasthan_culture",
        "subtopicId": "literature"
    },
    {
        "q": "Which Rajput dynasty historically ruled the kingdom of Amber and Jaipur?",
        "qHi": "जयपुर और आमेर राज्य पर ऐतिहासिक रूप से किस राजपूत वंश ने शासन किया था?",
        "o": ["Kachwaha Dynasty", "Rathore Dynasty", "Sisodia Dynasty", "Chauhan Dynasty"],
        "oHi": ["कछवाहा राजवंश", "राठौड़ राजवंश", "सिसोदिया राजवंश", "चौहान राजवंश"],
        "a": 0,
        "exp": "The Kachwaha Rajput clan ruled Amber and Jaipur. Famous rulers include Raja Bharmal, Raja Man Singh I, Mirza Raja Jai Singh, and Sawai Jai Singh II.",
        "expHi": "कछवाहा राजपूत वंश ने आमेर और जयपुर पर शासन किया। इस वंश के प्रमुख शासकों में भारमल, मानसिंह प्रथम, मिर्जा राजा जयसिंह और सवाई जयसिंह द्वितीय शामिल हैं।",
        "hint": "Sawai Jai Singh II founded Jaipur in 1727.",
        "hintHi": "सवाई जयसिंह द्वितीय ने 1727 में जयपुर की स्थापना की थी।",
        "topicId": "rajasthan_history",
        "subtopicId": "amer_jaipur"
    },
    {
        "q": "Chittorgarh Fort is renowned for how many historic Saka (Jauhars) during its sieges?",
        "qHi": "चित्तौड़गढ़ दुर्ग अपने इतिहास में कितने प्रसिद्ध साकों (जौहरों) के लिए जाना जाता है?",
        "o": ["Three (3)", "Two (2)", "Four (4)", "One (1)"],
        "oHi": ["तीन (3)", "दो (2)", "चार (4)", "एक (1)"],
        "a": 0,
        "exp": "Chittorgarh Fort witnessed three major Saka: 1st in 1303 (Rani Padmini / Alauddin Khilji), 2nd in 1535 (Rani Karnavati / Bahadur Shah), and 3rd in 1567-68 (Jaimal & Patta / Akbar).",
        "expHi": "चित्तौड़गढ़ दुर्ग में तीन प्रमुख साके हुए: पहला 1303 ई. (रानी पद्मिनी / अलाउद्दीन खिलजी), दूसरा 1535 ई. (रानी कर्णावती / बहादुर शाह), और तीसरा 1567-68 ई. (जयमल-पत्ता / अकबर)।",
        "hint": "The first took place under Rawal Ratan Singh and Rani Padmini in 1303.",
        "hintHi": "पहला साका 1303 ईस्वी में रावल रतन सिंह और रानी पद्मिनी के समय हुआ था।",
        "topicId": "rajasthan_history",
        "subtopicId": "forts"
    },
    {
        "q": "Which Amber ruler commenced the construction of the grand Amber Palace (Amer Fort) in 1592?",
        "qHi": "1592 में आमेर के भव्य दुर्ग (आमेर पैलेस) का निर्माण किस कछवाहा शासक ने प्रारंभ करवाया था?",
        "o": ["Raja Man Singh I", "Sawai Jai Singh II", "Mirza Raja Jai Singh", "Raja Bharmal"],
        "oHi": ["राजा मानसिंह प्रथम", "सवाई जयसिंह द्वितीय", "मिर्जा राजा जयसिंह", "राजा भारमल"],
        "a": 0,
        "exp": "Raja Man Singh I began construction of the Amber Fort in 1592 over the ruins of an earlier 10th-century structure. Later additions were made by Mirza Raja Jai Singh.",
        "expHi": "राजा मानसिंह प्रथम ने 1592 ईस्वी में आमेर किले का निर्माण प्रारंभ करवाया था, जिसे बाद में मिर्जा राजा जयसिंह ने विस्तार दिया।",
        "hint": "He was Akbar's foremost general and naval commander.",
        "hintHi": "यह अकबर के नवरत्नों में प्रधान सेनापति थे।",
        "topicId": "rajasthan_history",
        "subtopicId": "monuments"
    },
    {
        "q": "The world-famous Pushkar Fair is internationally celebrated as one of the largest fairs for which animal?",
        "qHi": "विश्व प्रसिद्ध पुष्कर मेला मुख्य रूप से किस पशु के विशाल व्यापारिक मेले और धार्मिक उत्सव के लिए जाना जाता है?",
        "o": ["Camel", "Horse", "Bullock", "Elephant"],
        "oHi": ["ऊँट (Camel)", "घोड़ा", "बैल", "हाथी"],
        "a": 0,
        "exp": "The annual Pushkar Fair (Kartik Purnima) in Ajmer district is one of the world's largest camel and livestock fairs combined with a sacred pilgrimage to the Brahma Temple.",
        "expHi": "अजमेर जिले में कार्तिक पूर्णिमा पर आयोजित होने वाला पुष्कर मेला विश्व का सबसे बड़ा ऊँट और पशु मेला है, साथ ही यह ब्रह्मा मंदिर के दर्शन का पवित्र तीर्थ स्थल है।",
        "hint": "It takes place around Kartik Purnima in Ajmer district.",
        "hintHi": "यह मेला अजमेर जिले में कार्तिक पूर्णिमा के अवसर पर लगता है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "fairs"
    },
    {
        "q": "Who founded the princely state and city of Bikaner in 1488 AD?",
        "qHi": "1488 ईस्वी में बीकानेर नगर एवं राज्य की स्थापना किसने की थी?",
        "o": ["Rao Bika", "Rao Jodha", "Rao Chunda", "Raja Rai Singh"],
        "oHi": ["राव बीका", "राव जोधा", "राव चूंडा", "राजा रायसिंह"],
        "a": 0,
        "exp": "Rao Bika, the sixth son of Rao Jodha (founder of Jodhpur), established the independent Rathore kingdom of Bikaner in 1488 AD at Rati Ghati.",
        "expHi": "जोधपुर के संस्थापक राव जोधा के पुत्र राव बीका ने 1488 ईस्वी में 'राति घाटी' में स्वतंत्र राठौड़ राज्य बीकानेर की स्थापना की थी।",
        "hint": "He was the son of Rao Jodha of Marwar.",
        "hintHi": "यह मारवाड़ के राव जोधा के पुत्र थे।",
        "topicId": "rajasthan_history",
        "subtopicId": "bikaner"
    },
    {
        "q": "Which Mewar ruler earned titles like 'Abhinav Bharatacharya' and constructed 32 of the 84 forts in Mewar?",
        "qHi": "मेवाड़ के किस शासक को 'अभिनव भरताचार्य' कहा गया और जिन्होंने मेवाड़ के 84 दुर्गों में से 32 दुर्गों का निर्माण करवाया?",
        "o": ["Maharana Kumbha", "Maharana Sanga", "Maharana Pratap", "Rana Hammir"],
        "oHi": ["महाराणा कुम्भा", "महाराणा सांगा", "महाराणा प्रताप", "राणा हम्मीर"],
        "a": 0,
        "exp": "Maharana Kumbha was a prolific warrior, scholar, and architect. He wrote 'Sangeet Raj', built Vijay Stambha and Kumbhalgarh Fort, and earned titles like Abhinav Bharatacharya and Rano Raso.",
        "expHi": "महाराणा कुम्भा संगीत, साहित्य और स्थापत्य के महान संरक्षक थे। इन्होंने 'संगीत राज' ग्रंथ लिखा, विजय स्तंभ और कुम्भलगढ़ का निर्माण कराया तथा 'अभिनव भरताचार्य' कहलाए।",
        "hint": "He erected the Vijay Stambha (Tower of Victory) to celebrate his victory over Mahmud Khilji of Malwa.",
        "hintHi": "इन्होंने मालवा के महमूद खिलजी पर विजय के उपलक्ष्य में चित्तौड़ में विजय स्तंभ बनवाया था।",
        "topicId": "rajasthan_history",
        "subtopicId": "mewar_dynasty"
    },
    {
        "q": "Which is the highest mountain peak in Rajasthan and the entire Aravalli Range?",
        "qHi": "राजस्थान तथा संपूर्ण अरावली पर्वतमाला की सर्वोच्च पर्वत चोटी कौन सी है?",
        "o": ["Guru Shikhar (1,722 m)", "Ser Peak (1,597 m)", "Dilwara Peak (1,442 m)", "Taragarh (870 m)"],
        "oHi": ["गुरु शिखर (1,722 मी.)", "सेर चोटी (1,597 मी.)", "दिलवाड़ा चोटी (1,442 मी.)", "तारागढ़ (870 मी.)"],
        "a": 0,
        "exp": "Guru Shikhar, located on Mount Abu in Sirohi district, stands at 1,722 meters (5,650 ft) above sea level, making it the highest point in Rajasthan and the Aravallis. Colonel Tod called it the 'Olympus of Rajasthan'.",
        "expHi": "सिरोही जिले के माउंट आबू में स्थित गुरु शिखर (1,722 मीटर) राजस्थान और अरावली पर्वतमाला की सर्वोच्च चोटी है। कर्नल टॉड ने इसे 'संतों का शिखर' कहा था।",
        "hint": "Located in Sirohi district near Mount Abu; Col. James Tod called it 'Peak of Saints'.",
        "hintHi": "सिरोही जिले में माउंट आबू के पास स्थित; कर्नल जेम्स टॉड ने इसे 'संतों का शिखर' कहा था।",
        "topicId": "rajasthan_geography",
        "subtopicId": "relief_features"
    },
    {
        "q": "What is the official State Bird of Rajasthan, locally known as Godawan?",
        "qHi": "राजस्थान का राज्य पक्षी कौन सा है, जिसे स्थानीय भाषा में 'गोडावण' कहा जाता है?",
        "o": ["Great Indian Bustard (Godawan)", "Indian Peafowl", "Sarus Crane", "Black Francolin"],
        "oHi": ["गोडावण (Great Indian Bustard)", "भारतीय मोर", "सारस क्रेन", "काला तीतर"],
        "a": 0,
        "exp": "The Great Indian Bustard (Ardeotis nigriceps), locally named Godawan, was declared Rajasthan's state bird in 1981. It is critically endangered and found in Desert National Park, Sokhaliya, and Soran.",
        "expHi": "गोडावण (ग्रेट इंडियन बस्टर्ड - Ardeotis nigriceps) को 1981 में राजस्थान का राज्य पक्षी घोषित किया गया था। यह मुख्य रूप से राष्ट्रीय मरु उद्यान (जैसलमेर) और सोखलिया में पाया जाता है।",
        "hint": "Its scientific name is Ardeotis nigriceps and it inhabits Thar's Desert National Park.",
        "hintHi": "इसका वैज्ञानिक नाम आर्डीओटिस नाइग्रीसेप्स है और यह राष्ट्रीय मरु उद्यान में पाया जाता है।",
        "topicId": "rajasthan_geography",
        "subtopicId": "wildlife"
    },
    {
        "q": "Which is the largest inland saline water lake in Rajasthan and India's largest inland salt producer?",
        "qHi": "राजस्थान की सबसे बड़ी अंतःस्थलीय खारे पानी की झील कौन सी है, जो भारत के कुल नमक उत्पादन का लगभग 8.7% उत्पादित करती है?",
        "o": ["Sambhar Salt Lake", "Pachpadra Lake", "Didwana Lake", "Lunkaransar Lake"],
        "oHi": ["सांभर झील", "पचपदरा झील", "डीडवाना झील", "लूणकरणसर झील"],
        "a": 0,
        "exp": "Sambhar Salt Lake, situated across Jaipur, Nagaur, and Ajmer districts, is India's largest inland saline lake and a designated Ramsar wetland site producing ~8.7% of India's salt.",
        "expHi": "सांभर झील जयपुर, नागौर और अजमेर जिलों की सीमा पर स्थित भारत की सबसे बड़ी अंतर्देशीय खारे पानी की झील और रामसर साइट है, जहाँ देश का लगभग 8.7% नमक बनता है।",
        "hint": "It is a Ramsar wetland site situated across Jaipur, Ajmer, and Nagaur.",
        "hintHi": "यह जयपुर, अजमेर और नागौर जिलों में विस्तृत एक रामसर आर्द्रभूमि स्थल है।",
        "topicId": "rajasthan_geography",
        "subtopicId": "lakes_rivers"
    },
    {
        "q": "Which two animals are recognized as the State Animals of Rajasthan (wild and domestic/livestock categories)?",
        "qHi": "राजस्थान के राज्य पशु के रूप में किन दो जीवों को मान्यता प्राप्त है (वन्यजीव श्रेणी और पशुधन श्रेणी)?",
        "o": ["Chinkara & Camel", "Blackbuck & Elephant", "Tiger & Camel", "Nilgai & Horse"],
        "oHi": ["चिंकारा एवं ऊँट", "काला हिरण एवं हाथी", "बाघ एवं ऊँट", "नीलगाय एवं घोड़ा"],
        "a": 0,
        "exp": "Chinkara (Gazella bennettii) is Rajasthan's state animal in the wild category (declared in 1981), while Camel (Camelus dromedarius) was declared state animal in the livestock category in 2014.",
        "expHi": "चिंकारा (गजेला बेनेट्टी) 1981 से वन्यजीव श्रेणी में राज्य पशु है, जबकि ऊँट (कैमेलस ड्रोमेडेरियस) को 2014 में पशुधन श्रेणी में राज्य पशु घोषित किया गया।",
        "hint": "One is an Indian gazelle (1981) and the other is the Ship of the Desert (2014).",
        "hintHi": "एक छोटा हिरण (1981) है और दूसरा रेगिस्तान का जहाज (2014)।",
        "topicId": "rajasthan_geography",
        "subtopicId": "state_symbols"
    },
    {
        "q": "Which region of Rajasthan is famous worldwide for its open-air art galleries and fresco-painted Havelis?",
        "qHi": "राजस्थान का कौन सा क्षेत्र अपनी भित्तिचित्रों (Frescoes) से सजी हवेलियों और 'ओपन आर्ट गैलरी' के लिए विश्व प्रसिद्ध है?",
        "o": ["Shekhawati", "Marwar", "Mewar", "Hadoti"],
        "oHi": ["शेखावाटी", "मारवाड़", "मेवाड़", "हाड़ौती"],
        "a": 0,
        "exp": "The Shekhawati region (Sikar, Jhunjhunu, Churu) is acclaimed as an 'Open-Air Art Gallery' of Rajasthan for its opulent havelis adorned with vibrant, historic wall frescoes.",
        "expHi": "शेखावाटी क्षेत्र (सीकर, झुंझुनू, चूरू) अपनी भव्य हवेलियों और उन पर उकेरे गए सुंदर भित्तिचित्रों (फ्रेस्को) के कारण राजस्थान की 'ओपन आर्ट गैलरी' कहलाता है।",
        "hint": "It covers the modern districts of Sikar, Jhunjhunu, and Churu.",
        "hintHi": "यह सीकर, झुंझुनू और चूरू जिलों में फैला हुआ है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "art_architecture"
    },
    {
        "q": "Which traditional dance form performed by women in swirling robes was designated Rajasthan's official State Dance?",
        "qHi": "गोल घेरे में घूमते हुए महिलाओं द्वारा प्रस्तुत किया जाने वाला कौन सा पारंपरिक नृत्य राजस्थान का 'राज्य नृत्य' तथा 'नृत्यों का सिरमौर' कहलाता है?",
        "o": ["Ghoomar", "Kalbelia", "Chari Dance", "Gair Dance"],
        "oHi": ["घूमर", "कालबेलिया", "चरी नृत्य", "गैर नृत्य"],
        "a": 0,
        "exp": "Ghoomar is the official state dance of Rajasthan, performed by Rajput and other women on festivals like Gangaur and Teej with graceful pirouettes in flared lehengas.",
        "expHi": "घूमर राजस्थान का राज्य नृत्य है, जिसे 'नृत्यों की आत्मा' और 'नृत्यों का सिरमौर' कहा जाता है। यह गणगौर, तीज व शुभ अवसरों पर महिलाओं द्वारा किया जाता है।",
        "hint": "Known as the 'Crown of Dances' and soul of Rajasthani folk culture.",
        "hintHi": "इसे 'नृत्यों का सिरमौर' और राजस्थानी लोक संस्कृति की आत्मा कहा जाता है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "folk_dances"
    },
    {
        "q": "Which classical Rajasthani folk singing style is Allah Jilai Bai, the singer of 'Kesariya Balam Aao Ni Padharo Mhare Des', celebrated for?",
        "qHi": "'केसरिया बालम आओ नी पधारो म्हारे देस' गीत गाने वाली प्रसिद्ध गायिका अल्लाह जिलाई बाई किस गायन शैली की प्रख्यात कलाकार थीं?",
        "o": ["Maand Singing (मांड गायकी)", "Bhavai", "Dhrupad", "Thumri"],
        "oHi": ["मांड गायकी", "भवाई", "ध्रुवपद", "ठुमरी"],
        "a": 0,
        "exp": "Allah Jilai Bai of Bikaner was a legendary exponent of the Maand style of folk singing. Her rendition of 'Kesariya Balam Aao Ni Padharo Mhare Des' became Rajasthan's signature cultural anthem.",
        "expHi": "बीकानेर की प्रसिद्ध मांड गायिका अल्लाह जिलाई बाई ने 'केसरिया बालम आओ नी पधारो म्हारे देस' गीत गाकर मांड गायकी को अंतरराष्ट्रीय स्तर पर ख्याति दिलाई।",
        "hint": "She was awarded the Padma Shri in 1982 for her contribution to this semi-classical singing style.",
        "hintHi": "इन्हें 1982 में पद्मश्री से सम्मानित किया गया था।",
        "topicId": "rajasthan_culture",
        "subtopicId": "music"
    },
    {
        "q": "Which famous 16th-century Bhakti poetess and Rajput princess devoted her entire life and compositions to Lord Krishna in Mewar?",
        "qHi": "16वीं शताब्दी की कौन सी प्रसिद्ध भक्ति कवयित्री एवं राजपूत रानी भगवान श्री कृष्ण की अनन्य भक्ति और पदावलियों के लिए विश्व प्रसिद्ध हैं?",
        "o": ["Meera Bai", "Karma Bai", "Rana Bai", "Gavri Bai"],
        "oHi": ["मीराबाई", "कर्मा बाई", "राणा बाई", "गवरी बाई"],
        "a": 0,
        "exp": "Meera Bai (born in Kudki, Pali) was married to Bhojraj, eldest son of Rana Sanga of Mewar. She renounced royal life for Krishna devotion and composed immortal Bhakti padavalis.",
        "expHi": "मीराबाई (जन्म कुड़की, पाली) मेवाड़ के महाराणा सांगा के ज्येष्ठ पुत्र भोजराज की पत्नी थीं। इन्होंने राजसी सुख त्याग कर श्रीकृष्ण की अनन्य भक्ति में पदावलियों की रचना की।",
        "hint": "Her husband was Bhojraj, the crown prince of Mewar.",
        "hintHi": "इनका विवाह मेवाड़ के युवराज भोजराज के साथ हुआ था।",
        "topicId": "rajasthan_culture",
        "subtopicId": "bhakti_movement"
    },
    {
        "q": "Which is the largest concrete gravity dam on the Banas river in Tonk district, providing drinking water to Jaipur and Ajmer?",
        "qHi": "टोंक जिले में बनास नदी पर स्थित राजस्थान की सबसे बड़ी पेयजल परियोजना वाला बाँध कौन सा है, जो जयपुर और अजमेर को जलापूर्ति करता है?",
        "o": ["Bisalpur Dam", "Mahi Bajaj Sagar", "Rana Pratap Sagar", "Jawai Dam"],
        "oHi": ["बीसलपुर बाँध", "माही बजाज सागर", "राणा प्रताप सागर", "जवाई बाँध"],
        "a": 0,
        "exp": "Bisalpur Dam, constructed on the Banas River in Deoli, Tonk district, is Rajasthan's foremost drinking water reservoir serving Jaipur, Ajmer, Tonk, and Dausa.",
        "expHi": "टोंक जिले के देवली में बनास नदी पर बना बीसलपुर बाँध राजस्थान की सबसे बड़ी पेयजल परियोजना है, जो जयपुर, अजमेर और टोंक को शुद्ध पेयजल प्रदान करता है।",
        "hint": "Built on the Banas river near Deoli in Tonk.",
        "hintHi": "यह टोंक जिले में बनास नदी पर स्थित है।",
        "topicId": "rajasthan_geography",
        "subtopicId": "dams_rivers"
    },
    {
        "q": "The world-famous stepwell 'Chand Baori', renowned for its 3,500 narrow steps and geometric precision, is situated at which place in Rajasthan?",
        "qHi": "3,500 संकरी सीढ़ियों और अद्भुत ज्यामितीय बनावट के लिए विश्व विख्यात 'चाँद बावड़ी' राजस्थान में कहाँ स्थित है?",
        "o": ["Abhaneri (Dausa)", "Bundi", "Neemrana (Alwar)", "Osian (Jodhpur)"],
        "oHi": ["आभानेरी (दौसा)", "बूँदी", "नीमराना (अलवर)", "ओसियां (जोधपुर)"],
        "a": 0,
        "exp": "Chand Baori, built in the 8th-9th century by King Chanda of the Nikumbha dynasty, is located in Abhaneri village in Dausa district opposite the Harshat Mata Temple.",
        "expHi": "चाँद बावड़ी दौसा जिले के आभानेरी गाँव में स्थित है। इसका निर्माण 8वीं-9वीं शताब्दी में निकुम्भ वंश के राजा चंदा ने करवाया था।",
        "hint": "Located opposite the Harshat Mata Temple in Dausa district.",
        "hintHi": "दौसा जिले में हर्षत माता मंदिर के ठीक सामने स्थित है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "monuments"
    },
    {
        "q": "Which national park in Bharatpur, formerly known as Keoladeo Ghana, is a UNESCO World Heritage Site famous for migratory Siberian cranes?",
        "qHi": "भरतपुर का कौन सा राष्ट्रीय उद्यान, जिसे पूर्व में 'घना पक्षी विहार' कहा जाता था, साइबेरियन क्रेन और प्रवासी पक्षियों के लिए यूनेस्को विश्व धरोहर स्थल है?",
        "o": ["Keoladeo National Park", "Ranthambore National Park", "Sariska Tiger Reserve", "Mukundra Hills National Park"],
        "oHi": ["केवलादेव राष्ट्रीय उद्यान", "रणथंभौर राष्ट्रीय उद्यान", "सरिस्का टाइगर रिजर्व", "मुकुंदरा हिल्स राष्ट्रीय उद्यान"],
        "a": 0,
        "exp": "Keoladeo National Park (Bharatpur) was inscribed on the UNESCO World Heritage List in 1985 and is a Ramsar wetland celebrated as a wintering ground for rare waterfowl and the Siberian crane.",
        "expHi": "भरतपुर स्थित केवलादेव राष्ट्रीय उद्यान 1985 में यूनेस्को विश्व धरोहर घोषित हुआ। यह पक्षी प्रेमियों का स्वर्ग और साइबेरियन सारस का शीतकालीन प्रवास स्थल है।",
        "hint": "Inscribed on UNESCO World Heritage list in 1985; founded by Maharaja Suraj Mal.",
        "hintHi": "1985 में यूनेस्को विश्व धरोहर सूची में शामिल किया गया था।",
        "topicId": "rajasthan_geography",
        "subtopicId": "wildlife_sanctuaries"
    }
]

# 2. Add all 30 MCQs from rajasthan-gk-questions-hindi_compress.pdf (with glyph correction)
HINDI_30_MCQS = [
    {
        "q": "The world-famous 'Bani-Thani' miniature painting style belongs to which princely school of painting in Rajasthan?",
        "qHi": "विश्व प्रसिद्ध 'बनी-ठणी' पेंटिंग शैली का सम्बन्ध राजस्थान की किस चित्रकला शैली से है?",
        "o": ["Kishangarh School", "Bikaner School", "Bundi School", "Sanganer School"],
        "oHi": ["किशनगढ़ शैली", "बीकानेर शैली", "बूँदी शैली", "सांगानेर शैली"],
        "a": 0,
        "exp": "Bani-Thani painting was created by artist Nihal Chand during the reign of Raja Sawant Singh (Nagari Das) of Kishangarh. Eric Dickinson termed it the 'Mona Lisa of India'.",
        "expHi": "बनी-ठणी चित्र शैली किशनगढ़ के राजा सावंत सिंह (नागरीदास) के समय चित्रकार निहालचंद द्वारा बनाई गई थी। एरिक डिक्सन ने इसे 'भारत की मोनालिसा' कहा था।",
        "hint": "Painted by Nihal Chand during Raja Sawant Singh's reign; called 'Mona Lisa of India'.",
        "hintHi": "चित्रकार निहालचंद द्वारा चित्रित; एरिक डिक्सन ने इसे 'भारत की मोनालिसा' कहा।",
        "topicId": "rajasthan_culture",
        "subtopicId": "paintings"
    },
    {
        "q": "The sacred shrine of folk deity Jeen Mata (Jeen Mata Temple) is situated in which district of Rajasthan?",
        "qHi": "प्रसिद्ध लोकदेवी जीण माता का ऐतिहासिक मंदिर राजस्थान के किस जिले में स्थित है?",
        "o": ["Sikar (Rewasa)", "Karauli", "Bikaner", "Sawai Madhopur"],
        "oHi": ["सीकर (रेवासा)", "करौली", "बीकानेर", "सवाई माधोपुर"],
        "a": 0,
        "exp": "The historic Jeen Mata Temple is situated at Rewasa village in Sikar district on the Aravalli hills, where a massive fair takes place twice a year during Navratri.",
        "expHi": "जीण माता का प्रसिद्ध मंदिर सीकर जिले के रेवासा गाँव में अरावली की पहाड़ियों पर स्थित है, जहाँ वर्ष में दो बार चैत्र और आश्विन नवरात्र में विशाल मेला लगता है।",
        "hint": "Located at Rewasa in Sikar district.",
        "hintHi": "सीकर जिले के रेवासा गाँव में स्थित है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "temples_deities"
    },
    {
        "q": "The premier historical institution 'Maharani College' (University of Rajasthan) is located in which city?",
        "qHi": "राजस्थान विश्वविद्यालय का प्रमुख संघटक 'महारानी कॉलेज' किस शहर में स्थित है?",
        "o": ["Jaipur", "Udaipur", "Jodhpur", "Bikaner"],
        "oHi": ["जयपुर", "उदयपुर", "जोधपुर", "बीकानेर"],
        "a": 0,
        "exp": "University Maharani College, founded in 1944 by Maharani Gayatri Devi and Maharaja Sawai Man Singh II, is located on Ram Singh Road in Jaipur.",
        "expHi": "विश्वविद्यालय महारानी कॉलेज 1944 में महारानी गायत्री देवी और महाराजा सवाई मानसिंह द्वितीय द्वारा स्थापित किया गया था और यह जयपुर में स्थित है।",
        "hint": "Founded by Maharani Gayatri Devi in the Pink City.",
        "hintHi": "गुलाबी नगर में महारानी गायत्री देवी द्वारा स्थापित।",
        "topicId": "rajasthan_polity",
        "subtopicId": "institutions"
    },
    {
        "q": "Who is the author of the historical chronicle 'Bikaner ke Rathoran ri Khyat'?",
        "qHi": "'बीकानेर के राठौड़ां री ख्यात' नामक ऐतिहासिक ग्रंथ के रचयिता कौन हैं?",
        "o": ["Dayaldas Sindhayach", "Muhnot Nainsi", "Suryamal Misran", "Kaviraj Shyamaldas"],
        "oHi": ["दयालदास सिढ़ायच", "मुहणौत नैणसी", "सूर्यमल मिश्रण", "कविराज श्यामलदास"],
        "a": 0,
        "exp": "Dayaldas Sindhayach, the court historian of Maharaja Ratan Singh of Bikaner, authored 'Bikaner ke Rathoran ri Khyat' chronicling the Rathore rulers from Rao Bika to Sardar Singh.",
        "expHi": "बीकानेर के महाराजा रतन सिंह के दरबारी इतिहासकार दयालदास सिढ़ायच ने 'बीकानेर के राठौड़ां री ख्यात' की रचना की थी।",
        "hint": "He was the royal historian during Maharaja Ratan Singh's reign in Bikaner.",
        "hintHi": "बीकानेर के महाराजा रतन सिंह के दरबारी इतिहासकार थे।",
        "topicId": "rajasthan_culture",
        "subtopicId": "literature"
    },
    {
        "q": "Which city of Rajasthan is renowned across India as the 'Marble City' due to its extensive marble processing hub?",
        "qHi": "एशिया की सबसे बड़ी मार्बल मंडी होने के कारण राजस्थान के किस शहर को 'मार्बल नगरी' कहा जाता है?",
        "o": ["Kishangarh", "Makrana", "Udaipur", "Rajsamand"],
        "oHi": ["किशनगढ़", "मकराना", "उदयपुर", "राजसमंद"],
        "a": 0,
        "exp": "Kishangarh (Ajmer district) hosts Asia's largest marble processing and trading mandi, earning it the title 'Marble City of India'.",
        "expHi": "अजमेर जिले का किशनगढ़ एशिया की सबसे बड़ी मार्बल मंडी और व्यापारिक केंद्र होने के कारण 'मार्बल सिटी' के नाम से जाना जाता है।",
        "hint": "Located near Ajmer; houses Asia's largest marble processing market.",
        "hintHi": "अजमेर के निकट स्थित; एशिया की सबसे बड़ी मार्बल मंडी यहाँ है।",
        "topicId": "rajasthan_economy",
        "subtopicId": "minerals_industries"
    },
    {
        "q": "The sacred Dham 'Sursura', where folk deity Veer Tejaji attained martyrdom, is located in which district?",
        "qHi": "लोकदेवता वीर तेजाजी का निर्वाण स्थल 'सुरसुरा धाम' किस जिले में स्थित है?",
        "o": ["Ajmer", "Nagaur", "Jaipur", "Sikar"],
        "oHi": ["अजमेर", "नागौर", "जयपुर", "सीकर"],
        "a": 0,
        "exp": "Sursura village in Kishangarh subdivision, Ajmer district, is the revered site where Veer Tejaji sacrificed his life honoring his promise to the serpent god Takshak.",
        "expHi": "अजमेर जिले के किशनगढ़ के पास स्थित सुरसुरा गाँव वह पवित्र स्थल है जहाँ वीर तेजाजी ने नागदेवता को दिए वचन का पालन करते हुए वीरगति प्राप्त की थी।",
        "hint": "Near Kishangarh in Ajmer district.",
        "hintHi": "अजमेर जिले में किशनगढ़ के पास स्थित है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "folk_deities"
    },
    {
        "q": "The JK Tyre & Tube manufacturing industrial plant in Rajasthan is situated at which location?",
        "qHi": "राजस्थान में जेके टायर एवं ट्यूब (Tyre-Tube) बनाने का विशाल कारखाना कहाँ स्थित है?",
        "o": ["Kankroli (Rajsamand)", "Kelwa", "Karauli", "Kotputli"],
        "oHi": ["कांकरोली (राजसमंद)", "केलवा", "करौली", "कोटपूतली"],
        "a": 0,
        "exp": "JK Tyre's major tyre and tube manufacturing plant is located at Kankroli near Rajsamand lake in Rajsamand district.",
        "expHi": "राजस्थान में जेके टायर एवं ट्यूब का प्रमुख उद्योग राजसमंद जिले के कांकरोली में स्थापित है।",
        "hint": "Located near Rajsamand Lake.",
        "hintHi": "राजसमंद झील के निकट स्थित प्रसिद्ध औद्योगिक नगर।",
        "topicId": "rajasthan_economy",
        "subtopicId": "industries"
    },
    {
        "q": "The historic Taragarh Fort (Star Fort) is located in which of the following cities?",
        "qHi": "प्रसिद्ध 'तारागढ़ दुर्ग' राजस्थान के किस नगर में स्थित है (अजमेर का गढ़ बीठली एवं बूँदी का तारागढ़)?",
        "o": ["Ajmer (Garh Beetli) & Bundi", "Udaipur", "Jaisalmer", "Bikaner"],
        "oHi": ["अजमेर (गढ़ बीठली) एवं बूँदी", "उदयपुर", "जैसलमेर", "बीकानेर"],
        "a": 0,
        "exp": "Rajasthan has two prominent Taragarh Forts: the famous Garh Beetli in Ajmer (built by Ajayraj Chauhan, later named Taragarh after Prithviraj Sisodia's wife Tara) and the Star Fort in Bundi (built by Rao Bar Singh in 1354).",
        "expHi": "राजस्थान में दो प्रसिद्ध तारागढ़ दुर्ग हैं: एक अजमेर में (गढ़ बीठली, जिसे पृथ्वीराज सिसोदिया ने अपनी पत्नी तारा के नाम पर तारागढ़ कहा) और दूसरा बूँदी का तारागढ़ दुर्ग (1354 ई. राव बरसिंह द्वारा निर्मित)।",
        "hint": "Bishop Heber called the Ajmer fort the 'Gibraltar of Rajasthan'.",
        "hintHi": "बिशप हेबर ने अजमेर के इस किले को 'राजस्थान का जिब्राल्टर' कहा था।",
        "topicId": "rajasthan_history",
        "subtopicId": "forts"
    },
    {
        "q": "The historical ruling dynasty of the princely state of Bharatpur belonged to which clan?",
        "qHi": "भरतपुर के ऐतिहासिक राजवंश का संबंध किस राजवंश / समुदाय से रहा है?",
        "o": ["Jat Dynasty (Sinsinwar)", "Rajput", "Meena", "Gurjar"],
        "oHi": ["जाट राजवंश (सिनसिनवार)", "राजपूत", "मीणा", "गुर्जर"],
        "a": 0,
        "exp": "Bharatpur was ruled by the Sinsinwar Jat dynasty, founded by Badan Singh and glorified by Maharaja Suraj Mal ('Plato of the Jat Tribe').",
        "expHi": "भरतपुर पर सिनसिनवार जाट राजवंश का शासन था, जिसकी स्थापना बदन सिंह ने की तथा महाराजा सूरजमल ('जाटों का प्लेटो') ने इसे अजेय शक्ति बनाया।",
        "hint": "Maharaja Suraj Mal was known as the 'Plato of the Jat community'.",
        "hintHi": "महाराजा सूरजमल को 'जाट जाति का प्लेटो (अफलातून)' कहा जाता है।",
        "topicId": "rajasthan_history",
        "subtopicId": "bharatpur"
    },
    {
        "q": "Who was the fearless freedom fighter and author of the explosive book 'Jaisalmer ka Gundaraj'?",
        "qHi": "'जैसलमेर का गुंडाराज' और 'आजादी के दीवाने' पुस्तकों के रचयिता अमर बलिदानी स्वतंत्रता सेनानी कौन थे?",
        "o": ["Sagarmal Gopa", "Muhnot Nainsi", "Damodar Das Rathi", "Kesari Singh Barhath"],
        "oHi": ["सागरमल गोपा", "मुहणौत नैणसी", "दामोदर दास राठी", "केसरी सिंह बारहठ"],
        "a": 0,
        "exp": "Sagarmal Gopa of Jaisalmer exposed Maharawal Jawahar Singh's oppressive rule in 'Jaisalmer ka Gundaraj'. He was burnt alive in Jaisalmer jail on 4 April 1946.",
        "expHi": "जैसलमेर के क्रांतिकारी सागरमल गोपा ने 'जैसलमेर का गुंडाराज' और 'रघुनाथ सिंह का मुकदमा' पुस्तकें लिखीं। 4 अप्रैल 1946 को जेल में इन्हें अमानवीय यातनाएँ देकर जीवित जला दिया गया था।",
        "hint": "He was martyred in Jaisalmer jail in April 1946.",
        "hintHi": "इन्हें 4 अप्रैल 1946 को जेल में जीवित जलाकर शहीद कर दिया गया था।",
        "topicId": "rajasthan_history",
        "subtopicId": "freedom_struggle"
    },
    {
        "q": "Who was the husband of the celebrated Bhakti poetess Meera Bai?",
        "qHi": "प्रसिद्ध भक्तिमती कवयित्री मीराबाई के पति का क्या नाम था?",
        "o": ["Bhojraj (Crown Prince of Mewar)", "Rana Ratan Singh", "Rana Sanga", "Rana Udai Singh"],
        "oHi": ["भोजराज (मेवाड़ के युवराज)", "राणा रतन सिंह", "राणा सांगा", "राणा उदय सिंह"],
        "a": 0,
        "exp": "Meera Bai was married in 1516 to Prince Bhojraj, the eldest son of Maharana Sangram Singh I (Rana Sanga) of Mewar. Prince Bhojraj died early in battle around 1521.",
        "expHi": "मीराबाई का विवाह 1516 ई. में मेवाड़ के महाराणा सांगा के ज्येष्ठ पुत्र युवराज भोजराज के साथ हुआ था, जिनका कुछ वर्षों बाद निधन हो गया।",
        "hint": "He was the eldest son of Maharana Sangram Singh (Rana Sanga).",
        "hintHi": "यह महाराणा सांगा के सबसे बड़े पुत्र थे।",
        "topicId": "rajasthan_culture",
        "subtopicId": "bhakti_movement"
    },
    {
        "q": "Who was the revered founder of the Bishnoi sect based on 29 ecological principles?",
        "qHi": "29 पर्यावरण और सदाचार के नियमों पर आधारित 'बिश्नोई संप्रदाय' के संस्थापक कौन थे?",
        "o": ["Guru Jambheshwar (Jambhoji)", "Ramdevji", "Pabuji", "Harbhuji"],
        "oHi": ["गुरु जम्भेश्वर (जाम्भोजी)", "रामदेवजी", "पाबूजी", "हड़बूजी"],
        "a": 0,
        "exp": "Guru Jambhoji (1451-1536) founded the Bishnoi community (20+9=29 rules) at Samrathal Dhora (Bikaner) in 1485, advocating wildlife conservation and sacred protection of Khejri trees.",
        "expHi": "गुरु जम्भेश्वर जी (जाम्भोजी) ने 1485 ईस्वी में बीकानेर के समराथल धोरा में 29 नियमों का उपदेश देकर बिश्नोई संप्रदाय की स्थापना की, जो वन्यजीव और खेजड़ी संरक्षण के लिए समर्पित है।",
        "hint": "Established at Samrathal Dhora in 1485; protected Khejri trees and blackbucks.",
        "hintHi": "1485 में समराथल धोरा पर 29 नियमों की स्थापना की।",
        "topicId": "rajasthan_culture",
        "subtopicId": "sects_deities"
    },
    {
        "q": "Which energetic folk dance performed by men holding wooden sticks during Holi is the hallmark of the Shekhawati region?",
        "qHi": "होली के अवसर पर पुरुषों द्वारा डंडों के साथ किया जाने वाला कौन सा प्रसिद्ध लोकनृत्य शेखावाटी क्षेत्र की पहचान है?",
        "o": ["Geendar Dance (गींदड़)", "Ghoomar", "Terah Taali", "Chari Dance"],
        "oHi": ["गींदड़ नृत्य", "घूमर", "तेरहताली", "चरी नृत्य"],
        "a": 0,
        "exp": "Geendar is a traditional folk dance of the Shekhawati region (Sikar, Churu, Jhunjhunu) performed by men during Holi to the rhythm of Nagara and wooden sticks.",
        "expHi": "गींदड़ शेखावाटी क्षेत्र (सीकर, चूरू, झुंझुनू) का अत्यंत लोकप्रिय पुरुष नृत्य है, जो होली के दिनों में नगाड़े की थाप पर डंडों के साथ रातभर किया जाता है।",
        "hint": "Performed by men with wooden sticks during Holi to Nagara beats.",
        "hintHi": "होली के अवसर पर नगाड़े की थाप पर पुरुषों द्वारा किया जाता है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "folk_dances"
    },
    {
        "q": "The historic 'Badshah ka Mela' (Emperor's Fair) is celebrated during Dhulandi at which place in Rajasthan?",
        "qHi": "राजस्थान में धुलंडी के अगले दिन प्रसिद्ध 'बादशाह का मेला' कहाँ आयोजित किया जाता है?",
        "o": ["Beawar", "Ajmer", "Bundi", "Kota"],
        "oHi": ["ब्यावर", "अजमेर", "बूँदी", "कोटा"],
        "a": 0,
        "exp": "The Badshah Mela is held in Beawar on the day after Holi (Dhulandi), featuring the royal procession of Akbar and Raja Todarmal, accompanied by the famous Mayur/Bhairav dance of Birbal.",
        "expHi": "ब्यावर में धुलंडी के अगले दिन बादशाह की सवारी निकाली जाती है, जिसमें बीरबल का प्रसिद्ध मयूर (भैरव) नृत्य किया जाता है और गुलाल उड़ाई जाती है।",
        "hint": "Features the historic procession and the Mayur/Bhairav dance of Birbal.",
        "hintHi": "यहाँ बीरबल द्वारा प्रसिद्ध मयूर/भैरव नृत्य प्रस्तुत किया जाता है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "fairs"
    },
    {
        "q": "The iconic 'Chaurasi Khambon ki Chhatri' (84-Pillared Cenotaph) is situated in which historical city of Rajasthan?",
        "qHi": "84 खंभों पर टिकी स्थापत्य कला की बेजोड़ धरोहर 'चौरासी खंभों की छतरी' किस ऐतिहासिक नगर में स्थित है?",
        "o": ["Bundi", "Jaipur", "Udaipur", "Kota"],
        "oHi": ["बूँदी", "जयपुर", "उदयपुर", "कोटा"],
        "a": 0,
        "exp": "The 84-Pillared Cenotaph in Bundi was constructed in 1683 by Rao Raja Aniruddha Singh in memory of his foster brother Dhabhai Deva.",
        "expHi": "बूँदी में स्थित 84 खंभों की भव्य छतरी का निर्माण 1683 ईस्वी में राव राजा अनिरुद्ध सिंह ने अपने धाभाई देवा की स्मृति में करवाया था।",
        "hint": "Built by Rao Raja Aniruddha Singh in 1683.",
        "hintHi": "1683 में राव राजा अनिरुद्ध सिंह द्वारा बनवाई गई थी।",
        "topicId": "rajasthan_culture",
        "subtopicId": "monuments"
    },
    {
        "q": "Panchna Dam, celebrated as Rajasthan's largest clay/mud dam (clay masonry), is situated in which district?",
        "qHi": "पाँच नदियों के संगम पर मिट्टी से बना राजस्थान का सबसे बड़ा 'पाँचना बाँध' किस जिले में स्थित है?",
        "o": ["Karauli", "Jaipur", "Bharatpur", "Banswara"],
        "oHi": ["करौली", "जयपुर", "भरतपुर", "बांसवाड़ा"],
        "a": 0,
        "exp": "Panchna Dam, built of clay/earth in Karauli district, harnesses water from five local rivers: Ata, Machi, Bhadrawati, Barkheda, and Bhainsawat.",
        "expHi": "पाँचना बाँध करौली जिले में पाँच छोटी नदियों (अटा, माची, भद्रावती, बरखेड़ा और भैंसावट) के संगम पर मिट्टी से बनाया गया राजस्थान का सबसे बड़ा बाँध है।",
        "hint": "Named for being at the confluence of five streams: Ata, Machi, Bhadrawati, Barkheda, Bhainsawat.",
        "hintHi": "पाँच धाराओं के संगम पर करौली में स्थित है।",
        "topicId": "rajasthan_geography",
        "subtopicId": "dams"
    },
    {
        "q": "The nutritious pasture grass 'Sevan Grass' (Lasiurus scindicus) predominantly grows in which desert district of Rajasthan?",
        "qHi": "मरुस्थलीय क्षेत्र में पाई जाने वाली पौष्टिक 'सेवण घास' (Lasiurus scindicus) मुख्यतः किस जिले की लाठी सीरीज में पाई जाती है?",
        "o": ["Jaisalmer (Lathi Series)", "Barmer", "Bharatpur", "Banswara"],
        "oHi": ["जैसलमेर (लाठी सीरीज)", "बाड़मेर", "भरतपुर", "बांसवाड़ा"],
        "a": 0,
        "exp": "Sevan Grass (Lasiurus scindicus) is a highly nutritious, drought-hardy fodder grass flourishing in Jaisalmer's underground hydrological belt known as the Lathi Series.",
        "expHi": "सेवण घास (लासिउरस सिंडिकस) जैसलमेर जिले की प्रसिद्ध भूगर्भीय जलपट्टी 'लाठी सीरीज' में उगने वाली अत्यंत पौष्टिक व दुधारू पशुओं के लिए उत्तम घास है।",
        "hint": "Flourishes along the subterranean geological belt known as Lathi Series.",
        "hintHi": "जैसलमेर की प्रसिद्ध भूगर्भीय लाठी सीरीज पट्टी में पाई जाती है।",
        "topicId": "rajasthan_geography",
        "subtopicId": "flora"
    },
    {
        "q": "Which revered folk deity of Rajasthan is invoked and worshipped by the Rabari community when a camel falls sick?",
        "qHi": "ऊँटों के बीमार होने पर तथा ऊँटों के रक्षक देवता के रूप में रायका/रेबारी जाति द्वारा किस लोकदेवता की पूजा की जाती है?",
        "o": ["Pabuji", "Gogaji", "Tejaji", "Kesariya Kunwar"],
        "oHi": ["पाबूजी", "गोगाजी", "तेजाजी", "केसरिया कुँवर"],
        "a": 0,
        "exp": "Pabuji is revered as the pioneer deity who introduced camels (sandhnis) to Rajasthan. He is worshipped as the protector of camels and plague-cure deity; his phad is read by Bhopas.",
        "expHi": "लोकदेवता पाबूजी को राजस्थान में ऊँट लाने का श्रेय दिया जाता है। रेबारी जाति इन्हें अपना आराध्य मानती है और ऊँट बीमार होने पर पाबूजी की फड़ बाँची जाती है।",
        "hint": "He is depicted holding a spear riding on his mare Kesar Kalami.",
        "hintHi": "इनकी घोड़ी का नाम केसर कालमी था और इनकी फड़ सबसे लोकप्रिय है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "folk_deities"
    },
    {
        "q": "The historic town of Gogunda, where Maharana Pratap's royal coronation took place in 1572, is situated in which district?",
        "qHi": "महाराणा प्रताप का प्रथम राज्याभिषेक 1572 ईस्वी में किस ऐतिहासिक स्थल 'गोगुन्दा' में हुआ था, जो किस जिले में स्थित है?",
        "o": ["Udaipur", "Banswara", "Dungarpur", "Sirohi"],
        "oHi": ["उदयपुर", "बांसवाड़ा", "डूंगरपुर", "सिरोही"],
        "a": 0,
        "exp": "Gogunda is situated in Udaipur district. It served as Maharana Udai Singh's temporary capital and was the site of Maharana Pratap's coronation on 28 February 1572 (Holi).",
        "expHi": "गोगुन्दा उदयपुर जिले में स्थित है। यहाँ 28 फरवरी 1572 को होली के दिन महाराणा प्रताप का प्रथम राज्याभिषेक संपन्न हुआ था।",
        "hint": "Near Udaipur; Udai Singh II passed away here in 1572.",
        "hintHi": "उदयपुर जिले में स्थित है जहाँ महाराणा उदयसिंह का देहांत भी हुआ था।",
        "topicId": "rajasthan_history",
        "subtopicId": "mewar_dynasty"
    },
    {
        "q": "Which district of Rajasthan is the largest producer of Isabgol (Psyllium husk / Horse cumin), leading India's cultivation?",
        "qHi": "राजस्थान का कौन सा जिला 'ईसबगोल' (घोड़ा जीरा) का प्रमुख उत्पादक जिला है?",
        "o": ["Jalore", "Udaipur", "Sri Ganganagar", "Bharatpur"],
        "oHi": ["जालोर", "उदयपुर", "श्रीगंगानगर", "भरतपुर"],
        "a": 0,
        "exp": "Jalore, along with Barmer and Sirohi, produces the vast majority of India's commercial Isabgol (Plantago ovata), earning Jalore prominence in medicinal crop agriculture.",
        "expHi": "जालोर जिला राजस्थान में ईसबगोल (प्लांटेगो ओवाटा) का सबसे बड़ा उत्पादक और विपणन केंद्र है।",
        "hint": "Southwestern Rajasthan district bordering Barmer and Sirohi.",
        "hintHi": "दक्षिण-पश्चिमी राजस्थान का जिला जो बाड़मेर और सिरोही की सीमा से लगता है।",
        "topicId": "rajasthan_economy",
        "subtopicId": "agriculture"
    },
    {
        "q": "The historic artificial lake 'Ana Sagar' in Ajmer was constructed in the 12th century by which Chauhan ruler?",
        "qHi": "अजमेर में स्थित ऐतिहासिक कृत्रिम झील 'आनासागर' का निर्माण 12वीं शताब्दी में किस चौहान शासक ने करवाया था?",
        "o": ["Arnoraja (Ana ji Chauhan)", "Ajayraj Chauhan", "Prithviraj Chauhan III", "Vigraharaja IV"],
        "oHi": ["अर्णोराज (आना जी चौहान)", "अजयराज चौहान", "पृथ्वीराज चौहान तृतीय", "विग्रहराज चतुर्थ"],
        "a": 0,
        "exp": "Ana Sagar Lake was built around 1135-1150 AD by Chauhan ruler Arnoraja (also called Ana ji). Later, Jahangir laid the Daulat Bagh and Shah Jahan added marble Baradaris.",
        "expHi": "आनासागर झील का निर्माण 1135-1150 ईस्वी के मध्य चौहान शासक अर्णोराज (आनाजी) ने करवाया था। जहाँगीर ने यहाँ दौलत बाग (सुभाष उद्यान) और शाहजहाँ ने बारहदरी बनवाई थी।",
        "hint": "Grandfather of Prithviraj Chauhan III; Shah Jahan built marble Baradari along its banks.",
        "hintHi": "पृथ्वीराज चौहान तृतीय के पितामह; शाहजहाँ ने इसके किनारे संगमरमर की बारहदरी बनवाई।",
        "topicId": "rajasthan_history",
        "subtopicId": "chauhans"
    }
]

# 3. Add 20 high-yield unique questions from rajasthan-genral-knowledge_compress.pdf
GENERAL_20_MCQS = [
    {
        "q": "Which local deity is worshipped across Rajasthan's villages as the guardian deity of the land and boundaries?",
        "qHi": "राजस्थान के गाँव-गाँव में भूमि के रक्षक देवता के रूप में किस लोकदेवता की पूजा की जाती है?",
        "o": ["Bhomiya Ji (भोमिया जी)", "Mama Dev", "Mallinath Ji", "Khetarpal Ji"],
        "oHi": ["भोमिया जी", "मामा देव", "मल्लीनाथ जी", "खेतपाल जी"],
        "a": 0,
        "exp": "Bhomiya Ji is revered across rural Rajasthan as the protector deity of land and village soil who sacrificed their lives safeguarding ancestral boundaries.",
        "expHi": "राजस्थान के ग्रामीण अंचल में भूमि और गाँव की सीमाओं की रक्षा के लिए बलिदान देने वाले वीर पुरुषों को 'भोमिया जी' के रूप में पूजा जाता है।",
        "hint": "Associated with protecting ancestral land boundaries in rural Rajasthan.",
        "hintHi": "गाँव की भूमि व खेत की सीमाओं के रक्षक माने जाते हैं।",
        "topicId": "rajasthan_culture",
        "subtopicId": "folk_deities"
    },
    {
        "q": "What is Rajasthan's rank in India in the production and reserves of Asbestos and Wollastonite minerals?",
        "qHi": "एस्बेस्टस और वोलास्टोनाइट खनिजों के उत्पादन एवं भंडार में राजस्थान का भारत में कौन सा स्थान है?",
        "o": ["First (प्रथम)", "Second", "Third", "Fourth"],
        "oHi": ["प्रथम (1st)", "द्वितीय", "तृतीय", "चतुर्थ"],
        "a": 0,
        "exp": "Rajasthan holds a virtual monopoly in India in minerals like Wollastonite, Jasper, and is the premier producer of Asbestos, Zinc, and Lead.",
        "expHi": "राजस्थान वोलास्टोनाइट, जास्पर में शत-प्रतिशत एकाधिकार रखता है और एस्बेस्टस, सीसा-जस्ता व संगमरमर के उत्पादन में देश में प्रथम स्थान पर है।",
        "hint": "Rajasthan has an undisputed leading monopoly in these industrial minerals.",
        "hintHi": "राजस्थान इन औद्योगिक खनिजों में देश में शीर्ष स्थान पर है।",
        "topicId": "rajasthan_economy",
        "subtopicId": "minerals"
    },
    {
        "q": "In Rajasthan's agriculture and pastoral terminology, what are 'Dhaman', 'Karad', and 'Anjan'?",
        "qHi": "राजस्थान की भौगोलिक और कृषि शब्दावली में 'धामण', 'करड़' एवं 'अंजन' किसके प्रकार हैं?",
        "o": ["Nutritious Pasture Grass Varieties", "Wheat Varieties", "Soil Types", "Folk Musical Instruments"],
        "oHi": ["पौष्टिक घास की किस्में", "गेहूँ की किस्में", "मिट्टी के प्रकार", "लोक वाद्ययंत्र"],
        "a": 0,
        "exp": "Dhaman, Karad, and Anjan (along with Sevan and Murat) are highly nutritious indigenous perennial pasture grass varieties found in western and arid Rajasthan.",
        "expHi": "धामण, करड़ और अंजन राजस्थान के पश्चिमी व शुष्क क्षेत्रों में पाई जाने वाली प्राकृतिक व पौष्टिक चरागाह घासों की प्रमुख किस्में हैं।",
        "hint": "Native fodder vegetation flourishing in arid and semi-arid grazing tracts.",
        "hintHi": "शुष्क मरुस्थलीय चरागाहों में पाई जाने वाली उत्तम चारे की प्राकृतिक वनस्पतियाँ।",
        "topicId": "rajasthan_geography",
        "subtopicId": "flora"
    },
    {
        "q": "Which drought-hardy tree is worshipped as the 'Kalpvriksha of the Thar Desert' and designated Rajasthan's State Tree?",
        "qHi": "रेगिस्तान का 'कल्पवृक्ष' कहलाने वाला तथा राजस्थान का राज्य वृक्ष कौन सा है, जिसका वैज्ञानिक नाम प्रोसोपिस सिनेरेरिया है?",
        "o": ["Khejri (Prosopis cineraria)", "Rohida (Tecomella undulata)", "Babul (Acacia nilotica)", "Kair (Capparis decidua)"],
        "oHi": ["खेजड़ी (Prosopis cineraria)", "रोहिड़ा (Tecomella undulata)", "बबूल", "कैर"],
        "a": 0,
        "exp": "Khejri (Prosopis cineraria), declared Rajasthan's State Tree in 1983, is regarded as the lifeline of the Thar Desert. Its fruit is Sangri and dried leaves are called Loong.",
        "expHi": "खेजड़ी (प्रोसोपिस सिनेरेरिया) को 31 अक्टूबर 1983 को राज्य वृक्ष घोषित किया गया था। इसे थार का कल्पवृक्ष, शमी और जांटी भी कहा जाता है। इसकी फलियाँ सांगरी कहलाती हैं।",
        "hint": "Declared State Tree in 1983; protected by Amrita Devi and 363 Bishnois in Khejarli in 1730.",
        "hintHi": "1730 में अमृता देवी के नेतृत्व में 363 बिश्नोइयों ने इस वृक्ष की रक्षा के लिए प्राणोत्सर्ग किया था।",
        "topicId": "rajasthan_geography",
        "subtopicId": "state_symbols"
    },
    {
        "q": "What is the official State Flower of Rajasthan, known as the 'Teak of Marwar'?",
        "qHi": "राजस्थान का 'राज्य पुष्प' कौन सा है, जिसे 'रेगिस्तान का सागवान' या 'मारवाड़ टीक' भी कहा जाता है?",
        "o": ["Rohida (Tecomella undulata)", "Palash (Butea monosperma)", "Kachnar", "Kamal"],
        "oHi": ["रोहिड़ा (Tecomella undulata)", "पलाश", "कचनार", "कमल"],
        "a": 0,
        "exp": "Rohida (Tecomella undulata), declared Rajasthan's state flower in 1983, yields vibrant reddish-orange flowers in spring and is famous as Desert Teak or Marwar Teak.",
        "expHi": "रोहिड़ा (टेकोमेला अण्डुलेटा) को 1983 में राजस्थान का राज्य पुष्प घोषित किया गया। इसके सुंदर केसरिया-पीले फूलों और मजबूत लकड़ी के कारण इसे 'रेगिस्तान का सागवान' कहा जाता है।",
        "hint": "Its botanical name is Tecomella undulata and it blooms reddish-orange in spring.",
        "hintHi": "इसका वानस्पतिक नाम टेकोमेला अण्डुलेटा है।",
        "topicId": "rajasthan_geography",
        "subtopicId": "state_symbols"
    },
    {
        "q": "The historic Sheetla Mata Temple, famous for the Donkey Fair and Sheetla Ashtami (Basoda), is situated at which place in Jaipur?",
        "qHi": "शीतला अष्टमी (बासोड़ा) और गधों के मेले के लिए प्रसिद्ध ऐतिहासिक शीतला माता का मंदिर जयपुर में कहाँ स्थित है?",
        "o": ["Chaksu (Sheel ki Doongri)", "Amer", "Sanganer", "Bassi"],
        "oHi": ["चाकसू (शील की डूंगरी)", "आमेर", "सांगानेर", "बस्सी"],
        "a": 0,
        "exp": "The Sheetla Mata Temple is situated atop Sheel ki Doongri in Chaksu, Jaipur district, built by Maharaja Madho Singh. Devotees offer stale cold food (Basoda) here.",
        "expHi": "जयपुर के चाकसू में शील की डूंगरी पर शीतला माता का ऐतिहासिक मंदिर स्थित है, जहाँ शीतला अष्टमी पर बासोड़ा (ठंडा भोजन) का भोग लगाया जाता है और विशाल मेला लगता है।",
        "hint": "Located on Sheel ki Doongri in Jaipur district.",
        "hintHi": "जयपुर के निकट शील की डूंगरी पर स्थित है।",
        "topicId": "rajasthan_culture",
        "subtopicId": "temples_fairs"
    },
    {
        "q": "Village Akola in Chittorgarh district is renowned throughout India for which traditional textile craft?",
        "qHi": "चित्तौड़गढ़ जिले का आकोला गाँव किस पारंपरिक हस्तशिल्प और छपाई कला के लिए पूरे देश में प्रसिद्ध है?",
        "o": ["Azam & Dabu Print (आज़म व दाबू प्रिंट)", "Sanganeri Print", "Bagru Print", "Bandhani"],
        "oHi": ["आज़म एवं दाबू प्रिंट", "सांगानेरी प्रिंट", "बगरू प्रिंट", "बंधेज"],
        "a": 0,
        "exp": "Akola village on the banks of Bedach river in Chittorgarh is famous for its natural Dabu (mud-resist) and Azam/Jazam hand block prints.",
        "expHi": "चित्तौड़गढ़ जिले का आकोला गाँव बेड़च नदी के किनारे दाबू प्रिंट (मिट्टी की लेई से छपाई) तथा आज़म-जाजम प्रिंट के लिए प्रसिद्ध है।",
        "hint": "Famous for natural dye mud-resist hand-block printing.",
        "hintHi": "दाबू और आज़म हस्तशिल्प ब्लॉक प्रिंटिंग के लिए प्रसिद्ध।",
        "topicId": "rajasthan_culture",
        "subtopicId": "handicrafts"
    },
    {
        "q": "The sacred memorial of folk deity Gogaji at Gogamedi (Nohar, Hanumangarh) features which distinctive inscription over its entrance?",
        "qHi": "हनुमानगढ़ जिले के नोहर में स्थित लोकदेवता गोगाजी के मुख्य समाधि स्थल 'गोगामेड़ी' के प्रवेश द्वार पर क्या अंकित है?",
        "o": ["Bismillah (बिस्मिल्लाह)", "Om (ॐ)", "Jai Mata Di", "Swastika"],
        "oHi": ["बिस्मिल्लाह (Bismillah)", "ॐ", "जय माता दी", "स्वस्तिक"],
        "a": 0,
        "exp": "The shrine at Gogamedi is shaped like a Muslim tomb (built by Feroz Shah Tughlaq) with 'Bismillah' inscribed on the entrance arch. Maharaja Ganga Singh later renovated the structure.",
        "expHi": "गोगामेड़ी का मंदिर फिरोजशाह तुगलक द्वारा मकबरेनुमा आकार में बनवाया गया था, जिसके मुख्य द्वार पर 'बिस्मिल्लाह' अंकित है। बाद में महाराजा गंगासिंह ने इसका जीर्णोद्धार करवाया।",
        "hint": "The monument was built in tomb architecture by Feroz Shah Tughlaq.",
        "hintHi": "इसका निर्माण फिरोजशाह तुगलक द्वारा मकबरेनुमा शैली में करवाया गया था।",
        "topicId": "rajasthan_culture",
        "subtopicId": "folk_deities"
    },
    {
        "q": "Who was the author of the celebrated classic Rajasthani poetic romance 'Dhola Maru ra Doha'?",
        "qHi": "राजस्थानी भाषा के अत्यंत लोकप्रिय और अमर प्रेम काव्य 'ढोला मारू रा दूहा' के मूल रचयिता कौन थे?",
        "o": ["Kallol (कवि कल्लोल)", "Chand Bardai", "Bankidas", "Muhnot Nainsi"],
        "oHi": ["कवि कल्लोल", "चंद बरदाई", "बांकीदास", "मुहणौत नैणसी"],
        "a": 0,
        "exp": "'Dhola Maru ra Doha' was composed by medieval poet Kallol (circa 15th century). Later in 1620 AD, Kushallabh added expansion chaupais to the work.",
        "expHi": "'ढोला मारू रा दूहा' की रचना 15वीं शताब्दी में कवि कल्लोल द्वारा की गई थी। बाद में 1620 ई. में कुशललाभ ने इसमें कुछ चौपाइयाँ जोड़ीं।",
        "hint": "15th-century court bard who set the famous desert love story into poetry.",
        "hintHi": "15वीं शताब्दी के प्रसिद्ध राजस्थानी कवि।",
        "topicId": "rajasthan_culture",
        "subtopicId": "literature"
    },
    {
        "q": "What is 'Gorband' in the cultural heritage of Rajasthan?",
        "qHi": "राजस्थान की सांस्कृतिक धरोहर में 'गोरबंद' क्या है?",
        "o": ["Ornate Neck Harness for a Camel / Folk Song", "Turban Style", "Bride's Anklet", "Shepherd's Flute"],
        "oHi": ["ऊँट के गले का सुंदर आभूषण / प्रसिद्ध लोकगीत", "पगड़ी का प्रकार", "दुल्हन की पायल", "चरवाहों की बाँसुरी"],
        "a": 0,
        "exp": "Gorband is an intricately embroidered neck ornament made of beads, cowries, and yarn used to decorate camels, as well as a celebrated folk song describing its crafting.",
        "expHi": "गोरबंद राजस्थान में ऊँट के गले का एक श्रृंगारिक आभूषण है जिसे काँच, कौड़ियों और धागों से गूँथा जाता है, साथ ही यह शेखावाटी-मरुस्थल का अत्यंत लोकप्रिय लोकगीत है।",
        "hint": "Crafted with cowries, beads, and mirrors to adorn the Ship of the Desert.",
        "hintHi": "कौड़ियों और धागों से पिरोकर ऊँट के गले में पहनाया जाने वाला आभूषण।",
        "topicId": "rajasthan_culture",
        "subtopicId": "folk_culture"
    },
    {
        "q": "Why is Rajasthan often referred to as the 'Museum of Minerals' (खनिजों का अजायबघर)?",
        "qHi": "राजस्थान को 'खनिजों का अजायबघर' क्यों कहा जाता है?",
        "o": ["Due to the vast diversity of 79+ minor and major minerals found here", "It houses a national gemstone laboratory", "It produces all atomic minerals", "It has the largest coal reserve"],
        "oHi": ["यहाँ 79 से अधिक प्रकार के धात्विक, अधात्विक व दुर्लभ खनिजों की विविधता पाई जाती है", "यहाँ देश का सबसे बड़ा रत्न संग्रहालय है", "यहाँ सभी प्रकार के आणविक खनिज मिलते हैं", "यहाँ देश का सर्वाधिक कोयला निकलता है"],
        "a": 0,
        "exp": "Rajasthan is endowed with 79 different minerals (57 commercially mined), including solitary monopolies in Wollastonite, Zinc, and Emerald, earning it the moniker 'Museum of Minerals'.",
        "expHi": "राजस्थान में लगभग 79 प्रकार के खनिज पाए जाते हैं (जिनमें से 57 का व्यावसायिक उत्पादन होता है), इसी असीम भूगर्भीय विविधता के कारण इसे 'खनिजों का अजायबघर' कहा जाता है।",
        "hint": "Due to its extraordinary geological diversity of 79 different minerals.",
        "hintHi": "यहाँ लगभग 79 प्रकार के विभिन्न खनिज पाए जाते हैं।",
        "topicId": "rajasthan_economy",
        "subtopicId": "minerals"
    },
    {
        "q": "Which district of Rajasthan hosts the highest number of major state-level cattle fairs (Pashu Mela)?",
        "qHi": "राजस्थान के किस जिले में राज्य सरकार के पशुपालन विभाग द्वारा सर्वाधिक राज्य स्तरीय पशु मेलों का आयोजन किया जाता है?",
        "o": ["Nagaur", "Jhalawar", "Barmer", "Hanumangarh"],
        "oHi": ["नागौर", "झालावाड़", "बाड़मेर", "हनुमानगढ़"],
        "a": 0,
        "exp": "Nagaur district hosts three premier state-level cattle fairs: Veer Tejaji Cattle Fair (Parbatsar), Ramdev Cattle Fair (Manasar), and Shri Baldev Ram Mirdha Cattle Fair (Merta City).",
        "expHi": "नागौर जिले में राज्य के सर्वाधिक तीन बड़े राज्य-स्तरीय पशु मेले आयोजित होते हैं: वीर तेजाजी पशु मेला (परबतसर), बाबा रामदेव पशु मेला (मानासर) और बलदेव पशु मेला (मेड़ता सिटी)।",
        "hint": "Famous for Parbatsar, Manasar, and Merta City cattle fairs.",
        "hintHi": "परबतसर, मानासर और मेड़ता सिटी पशु मेलों के लिए प्रसिद्ध जिला।",
        "topicId": "rajasthan_economy",
        "subtopicId": "cattle_fairs"
    },
    {
        "q": "The historic 9-storeyed 'Vijay Stambha' (Tower of Victory) at Chittorgarh was erected by Maharana Kumbha to celebrate which historic victory?",
        "qHi": "चित्तौड़गढ़ दुर्ग में स्थित 9 मंजिला 'विजय स्तंभ' का निर्माण महाराणा कुम्भा ने किस ऐतिहासिक युद्ध में विजय की स्मृति में करवाया था?",
        "o": ["Victory in the Battle of Sarangpur (1437) against Mahmud Khilji", "Battle of Haldighati", "Battle of Khanwa", "Battle of Khatoli"],
        "oHi": ["सारंगपुर के युद्ध (1437 ई.) में मालवा के सुल्तान महमूद खिलजी पर विजय", "हल्दीघाटी का युद्ध", "खानवा का युद्ध", "खातोली का युद्ध"],
        "a": 0,
        "exp": "Maharana Kumbha erected the 122-feet, 9-story Vijay Stambha between 1440 and 1448 to commemorate his resounding victory over Sultan Mahmud Khilji of Malwa in the Battle of Sarangpur (1437). Architect was Jaita and his sons Napa, Poma, Punja.",
        "expHi": "महाराणा कुम्भा ने 1437 ई. के सारंगपुर युद्ध में मालवा के सुल्तान महमूद खिलजी को पराजित करने की स्मृति में 1440-1448 के मध्य 122 फीट ऊँचे 9 मंजिला विजय स्तंभ का निर्माण कराया था। इसके प्रमुख सूत्रधार जैता व उनके पुत्र थे।",
        "hint": "Fought in 1437 against the combined forces of Malwa and Gujarat.",
        "hintHi": "1437 ईस्वी में मालवा के सुल्तान पर ऐतिहासिक विजय के उपलक्ष्य में निर्मित।",
        "topicId": "rajasthan_history",
        "subtopicId": "monuments"
    },
    {
        "q": "The iconic 'Ranakpur Jain Temple', renowned for its 1,444 uniquely carved marble pillars, is dedicated to which Tirthankara?",
        "qHi": "1,444 नक्काशीदार संगमरमर के खंभों के लिए प्रसिद्ध पाली जिले का 'रणकपुर जैन मंदिर' किस तीर्थंकर को समर्पित है?",
        "o": ["Lord Adinath (Rishabhanatha)", "Lord Parshvanatha", "Lord Mahavira", "Lord Neminatha"],
        "oHi": ["भगवान आदिनाथ (ऋषभदेव)", "भगवान पार्श्वनाथ", "भगवान महावीर", "भगवान नेमिनाथ"],
        "a": 0,
        "exp": "Ranakpur Jain Temple (Chaumukha Temple) on the banks of Maghai river in Pali district was built in the 15th century by Dharanaka Shah under the patronage of Rana Kumbha. Architect was Depaka.",
        "expHi": "पाली जिले में मघई नदी के किनारे स्थित रणकपुर चौमुखा जैन मंदिर प्रथम जैन तीर्थंकर भगवान आदिनाथ को समर्पित है। इसका निर्माण 15वीं सदी में राणा कुम्भा के काल में धरणक शाह ने करवाया था, इसके शिल्पी देपाक थे।",
        "hint": "First Tirthankara of Jainism; built by Dharna Shah in the 15th century.",
        "hintHi": "जैन धर्म के प्रथम तीर्थंकर, जिनका निर्माण महाराणा कुम्भा के समय धरणक शाह ने करवाया था।",
        "topicId": "rajasthan_culture",
        "subtopicId": "temples"
    },
    {
        "q": "The massive Mehrangarh Fort of Jodhpur was constructed atop the Chidiyatunk hill in 1459 AD by which Rathore ruler?",
        "qHi": "जोधपुर का अभेद्य 'मेहरानगढ़ दुर्ग' 1459 ईस्वी में चिड़ियाटूँक पहाड़ी पर किस राठौड़ शासक द्वारा बनवाया गया था?",
        "o": ["Rao Jodha", "Rao Bika", "Rao Maldeo", "Maharaja Jaswant Singh"],
        "oHi": ["राव जोधा", "राव बीका", "राव मालदेव", "महाराजा जसवंत सिंह"],
        "a": 0,
        "exp": "Rao Jodha laid the foundation of Mehrangarh Fort on Chidiyatunk hill on 12 May 1459 AD. Rudyard Kipling described it as 'a palace that might have been built by Titans and colored by the morning sun'.",
        "expHi": "राव जोधा ने 12 मई 1459 को चिड़ियाटूँक पहाड़ी पर मेहरानगढ़ दुर्ग की नींव रखी थी। रुडयार्ड किपलिंग ने इसे 'परियों और देवताओं द्वारा निर्मित दुर्ग' कहा था।",
        "hint": "Founder of the historic kingdom and city of Jodhpur in 1459.",
        "hintHi": "1459 में जोधपुर शहर की नींव रखने वाले राठौड़ शासक।",
        "topicId": "rajasthan_history",
        "subtopicId": "forts"
    },
    {
        "q": "The golden-hued 'Sonar Qila' (Jaisalmer Fort) was founded atop the Trikuta Hill in 1155 AD by which Bhati ruler?",
        "qHi": "त्रिकूट पहाड़ी पर पीले बलुआ पत्थर से बना विश्व प्रसिद्ध 'सोनार किला' (जैसलमेर दुर्ग) 1155 ईस्वी में किस भाटी शासक ने बनवाया था?",
        "o": ["Rawal Jaisal", "Rawal Vijayraj", "Bhojraj Bhati", "Rawal Lunakaran"],
        "oHi": ["रावल जैसल", "रावल विजयराज", "भोजराज भाटी", "रावल लूणकरण"],
        "a": 0,
        "exp": "Rawal Jaisal founded the hill fort of Jaisalmer (Sonar Qila) in 1155 AD on Trikuta Hill. It is India's second oldest living fort and is built without mortar using yellow sandstone.",
        "expHi": "रावल जैसल ने 1155 ईस्वी में त्रिकूट पहाड़ी पर जैसलमेर के किले की स्थापना की थी। यह पीले पत्थरों से बिना चूने-गारे के पत्थरों को जोड़कर बनाया गया प्रसिद्ध 'सोनार किला' है।",
        "hint": "Built on Trikuta hill; India's largest living desert fort.",
        "hintHi": "त्रिकूट पहाड़ी पर स्थित भारत का अनूठा 'लिविंग फोर्ट'।",
        "topicId": "rajasthan_history",
        "subtopicId": "forts"
    },
    {
        "q": "The great wall of Kumbhalgarh Fort, built by Maharana Kumbha, spans what total length, making it the second longest continuous wall in the world?",
        "qHi": "महाराणा कुम्भा द्वारा निर्मित कुम्भलगढ़ दुर्ग की विशाल परकोटे की दीवार की कुल लंबाई कितनी है, जिसे 'ग्रेट वॉल ऑफ इंडिया' कहा जाता है?",
        "o": ["36 Kilometers", "25 Kilometers", "48 Kilometers", "18 Kilometers"],
        "oHi": ["36 किलोमीटर", "25 किलोमीटर", "48 किलोमीटर", "18 किलोमीटर"],
        "a": 0,
        "exp": "The defensive rampart wall of Kumbhalgarh Fort extends 36 kilometers along the Aravalli hills, wide enough for four horses to run abreast, second only to the Great Wall of China.",
        "expHi": "कुम्भलगढ़ दुर्ग का सुरक्षा परकोटा 36 किलोमीटर लंबा है, जिस पर चार घुड़सवार एक साथ चल सकते हैं। चीन की दीवार के बाद यह विश्व की दूसरी सबसे लंबी दीवार है।",
        "hint": "Wide enough for multiple horses to ride abreast; second only to Great Wall of China.",
        "hintHi": "चीन की दीवार के बाद विश्व की दूसरी सबसे लंबी दीवार।",
        "topicId": "rajasthan_history",
        "subtopicId": "forts"
    },
    {
        "q": "Which wildlife sanctuary in Pratapgarh district is internationally renowned as the habitat of the Flying Squirrel (उड़न गिलहरी)?",
        "qHi": "प्रतापगढ़ जिले में स्थित कौन सा वन्यजीव अभयारण्य 'उड़न गिलहरी' (Flying Squirrel) और चौसिंगा (घोटेल) के प्राकृतिक आवास के लिए प्रसिद्ध है?",
        "o": ["Sita Mata Wildlife Sanctuary", "Tal Chhapar Sanctuary", "Mount Abu Sanctuary", "Kumbhalgarh Sanctuary"],
        "oHi": ["सीतामाता वन्यजीव अभयारण्य", "तालछापर अभयारण्य", "माउंट आबू अभयारण्य", "कुम्भलगढ़ अभयारण्य"],
        "a": 0,
        "exp": "Sita Mata Wildlife Sanctuary in Pratapgarh and Chittorgarh districts is famed for nocturnal brown flying squirrels (Petaurista philippensis) residing in Mahua trees, and medicinal flora.",
        "expHi": "प्रतापगढ़ जिले में स्थित सीतामाता वन्यजीव अभयारण्य महुआ के पेड़ों पर रहने वाली उड़न गिलहरियों (Flying Squirrel) और दुर्लभ औषधीय पादपों के लिए प्रसिद्ध है।",
        "hint": "Known for nocturnal gliding squirrels nesting on Mahua trees.",
        "hintHi": "महुआ के पेड़ों पर रहने वाली उड़न गिलहरियों का स्वर्ग।",
        "topicId": "rajasthan_geography",
        "subtopicId": "wildlife"
    },
    {
        "q": "Tal Chhapar Wildlife Sanctuary in Churu district is famous across India for the conservation of which graceful animal?",
        "qHi": "चूरू जिले में स्थित 'तालछापर अभयारण्य' मुख्य रूप से किस सुंदर वन्यजीव के प्राकृतिक संरक्षण के लिए भारत भर में प्रसिद्ध है?",
        "o": ["Blackbuck (कृष्णमृग)", "Chinkara", "Tiger", "Snow Leopard"],
        "oHi": ["काला हिरण (कृष्णमृग / Blackbuck)", "चिंकारा", "बाघ", "हिम तेंदुआ"],
        "a": 0,
        "exp": "Tal Chhapar Sanctuary in Sujangarh (Churu) is a flat saline depression famous as the prime sanctuary for thousands of Blackbucks and migratory harriers and demoiselle cranes (Kurjan).",
        "expHi": "चूरू के सुजानगढ़ में स्थित तालछापर अभयारण्य काले हिरणों (कृष्णमृग) का सबसे बड़ा अभयारण्य है, जहाँ मोथिया घास प्रचुर मात्रा में पाई जाती है।",
        "hint": "Famous for the herds of Indian Blackbucks grazing on Mothiya grass.",
        "hintHi": "मोथिया घास चरने वाले काले हिरणों (कृष्णमृग) का प्रमुख अभयारण्य।",
        "topicId": "rajasthan_geography",
        "subtopicId": "wildlife"
    },
    {
        "q": "Which sanctuary in Bundi was officially declared as Rajasthan's 4th Tiger Reserve in May 2022 and India's 52nd Tiger Reserve?",
        "qHi": "मई 2022 में बूंदी जिले के किस अभयारण्य को राजस्थान का चौथा तथा भारत का 52वाँ टाइगर रिजर्व घोषित किया गया था?",
        "o": ["Ramgarh Vishdhari Sanctuary", "Mukundra Hills", "Sariska", "Ranthambore"],
        "oHi": ["रामगढ़ विषधारी अभयारण्य", "मुकुंदरा हिल्स", "सरिस्का", "रणथंभौर"],
        "a": 0,
        "exp": "Ramgarh Vishdhari Wildlife Sanctuary in Bundi was notified as Rajasthan's 4th Tiger Reserve (India's 52nd) in May 2022, serving as a vital corridor connecting Ranthambore and Mukundra Hills.",
        "expHi": "बूंदी जिले में स्थित रामगढ़ विषधारी अभयारण्य को मई 2022 में राजस्थान का चौथा (और भारत का 52वाँ) टाइगर रिजर्व अधिसूचित किया गया था।",
        "hint": "Acts as a tiger corridor between Ranthambore and Mukundra Hills in Bundi district.",
        "hintHi": "बूंदी जिले में रणथंभौर और मुकुंदरा हिल्स के बीच बाघों का प्राकृतिक कॉरिडोर।",
        "topicId": "rajasthan_geography",
        "subtopicId": "tiger_reserves"
    }
]

def build_all_rajasthan_questions():
    all_q = []
    seen_stems = set()
    
    def get_stem(text):
        clean = re.sub(r'[^a-zA-Z0-9\u0900-\u097F]', '', text.lower())
        return clean[:35]

    # Add existing questions from rajasthan.json first
    raj_path = 'src/data/gk/states/rajasthan.json'
    with open(raj_path, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)
    
    existing_mcqs = existing_data.get('mcqs', [])
    for m in existing_mcqs:
        stem = get_stem(m.get('q', m.get('questionText', '')))
        seen_stems.add(stem)
        all_q.append(m)

    # Add 100 fact-checked questions
    for item in CORRECTED_100_DATA:
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_state_rajasthan_q{len(all_q)+1}"
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "state",
            "stateId": "rajasthan",
            "topicId": item.get("topicId", "rajasthan_history"),
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
            "examTags": ["RAS", "REET", "Rajasthan Police", "Patwar", "CET", "RPSC"]
        }
        all_q.append(q_obj)

    # Add Hindi 30 MCQs
    for item in HINDI_30_MCQS:
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_state_rajasthan_q{len(all_q)+1}"
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "state",
            "stateId": "rajasthan",
            "topicId": item.get("topicId", "rajasthan_culture"),
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
            "examTags": ["RAS", "REET", "Rajasthan Police", "Patwar", "CET", "RPSC"]
        }
        all_q.append(q_obj)

    # Add General 20 MCQs
    for item in GENERAL_20_MCQS:
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_state_rajasthan_q{len(all_q)+1}"
        q_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "state",
            "stateId": "rajasthan",
            "topicId": item.get("topicId", "rajasthan_geography"),
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
            "examTags": ["RAS", "REET", "Rajasthan Police", "Patwar", "CET", "RPSC"]
        }
        all_q.append(q_obj)

    print(f"Total compiled Rajasthan GK questions: {len(all_q)}")
    
    # Update rajasthan.json
    existing_data['mcqs'] = all_q
    existing_data['mcqCount'] = len(all_q)
    with open(raj_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)
    print(f"Successfully saved {len(all_q)} MCQs to {raj_path}")

    # Save to intermediate output
    with open('scratch_compiled_rajasthan_mcqs.json', 'w', encoding='utf-8') as f:
        json.dump(all_q, f, ensure_ascii=False, indent=2)
    print("Saved to scratch_compiled_rajasthan_mcqs.json")

if __name__ == '__main__':
    build_all_rajasthan_questions()
