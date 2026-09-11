# -*- coding: utf-8 -*-
"""
Inject additional high-yield questions for:
  - national_parks_wildlife
  - sports_games
  - important_days
  - indian_economy
And synchronize with master question bank.
"""

import os, sys, re, json

sys.stdout.reconfigure(encoding='utf-8')

def get_stem(text):
    clean = re.sub(r'[^a-zA-Z0-9\u0900-\u097F]', '', text.lower())
    return clean[:35]

NEW_EXPANSION_MCQS = [
    # ==========================
    # NATIONAL PARKS & WILDLIFE
    # ==========================
    {
        "topicId": "national_parks_wildlife", "subtopicId": "national_parks",
        "q": "Which was the first National Park established in India (and in Asia) in 1936, initially named Hailey National Park?",
        "qHi": "1936 में स्थापित भारत (और एशिया) का प्रथम राष्ट्रीय उद्यान कौन सा था, जिसे मूल रूप से 'हैली नेशनल पार्क' नाम दिया गया था?",
        "o": ["Jim Corbett National Park (Uttarakhand)", "Kanha National Park", "Kaziranga National Park", "Gir National Park"],
        "oHi": ["जिम कॉर्बेट राष्ट्रीय उद्यान (उत्तराखंड)", "कान्हा राष्ट्रीय उद्यान", "काजीरंगा राष्ट्रीय उद्यान", "गिर राष्ट्रीय उद्यान"],
        "a": 0,
        "exp": "Jim Corbett National Park in Nainital and Pauri Garhwal districts of Uttarakhand was established in 1936 as Hailey National Park. In 1973, it became the birthplace of 'Project Tiger'.",
        "expHi": "उत्तराखंड के नैनीताल और पौड़ी गढ़वाल में 1936 में स्थापित हैली नेशनल पार्क (वर्तमान जिम कॉर्बेट) भारत का पहला राष्ट्रीय उद्यान है। 1973 में यहीं से 'प्रोजेक्ट टाइगर' की शुरुआत हुई थी।",
        "hint": "Renamed after hunter-conservationist Jim Corbett; site of the 1973 launch of Project Tiger.",
        "hintHi": "1973 में प्रोजेक्ट टाइगर का शुभारंभ यहीं से हुआ था।"
    },
    {
        "topicId": "national_parks_wildlife", "subtopicId": "wildlife_sanctuaries",
        "q": "Gir National Park and Wildlife Sanctuary in Gujarat is the world's only natural wild refuge for which magnificent big cat?",
        "qHi": "गुजरात का 'गिर राष्ट्रीय उद्यान एवं वन्यजीव अभयारण्य' विश्व में किस अद्वितीय वन्यजीव का एकमात्र प्राकृतिक निवास स्थान है?",
        "o": ["Asiatic Lion (एशियाई शेर)", "Royal Bengal Tiger", "Snow Leopard", "Clouded Leopard"],
        "oHi": ["एशियाई बब्बर शेर (Asiatic Lion)", "रॉयल बंगाल टाइगर", "हिम तेंदुआ", "क्लाउडेड लेपर्ड"],
        "a": 0,
        "exp": "Gir National Park in Junagadh/Amreli districts of Gujarat is the sole home of the Asiatic Lion (Panthera leo persica) in the wild.",
        "expHi": "गुजरात के जूनागढ़, गिर सोमनाथ और अमरेली जिलों में फैला गिर राष्ट्रीय उद्यान विश्व में एशियाई बब्बर शेर (Panthera leo persica) का एकमात्र प्राकृतिक आवास है।",
        "hint": "Panthera leo persica; found in Junagadh and Gir Somnath districts of Gujarat.",
        "hintHi": "गुजरात के जूनागढ़ में पाया जाने वाला एशियाई बब्बर शेर।"
    },
    {
        "topicId": "national_parks_wildlife", "subtopicId": "national_parks",
        "q": "Keibul Lamjao National Park, situated on Loktak Lake in Manipur, is celebrated globally as what unique feature?",
        "qHi": "मणिपुर की लोकटक झील पर स्थित 'केइबुल लामजाओ राष्ट्रीय उद्यान' विश्व में किस अनूठी विशेषता के लिए जाना जाता है?",
        "o": ["Only floating national park in the world (Phumdis)", "Deepest mangrove park", "Highest alpine sanctuary", "Largest coral atoll"],
        "oHi": ["विश्व का एकमात्र तैरता हुआ राष्ट्रीय उद्यान (फुुमडी)", "सबसे गहरा मैंग्रोव पार्क", "सर्वोच्च अल्पाइन अभयारण्य", "सबसे बड़ा प्रवाल द्वीप"],
        "a": 0,
        "exp": "Keibul Lamjao National Park on Loktak Lake in Bishnupur district, Manipur, is the only floating national park in the world, consisting of floating decomposed biomass called 'phumdis', home to the endangered Sangai brow-antlered deer (dancing deer).",
        "expHi": "मणिपुर की लोकटक झील में स्थित केइबुल लामजाओ विश्व का एकमात्र तैरता हुआ राष्ट्रीय उद्यान है। यह तैरते हुए वनस्पति द्वीपों (फुुमडी) पर स्थित है तथा मणिपुर के राज्य पशु 'संगाई' (नाचने वाला हिरण) का एकमात्र घर है।",
        "hint": "Home to the endangered dancing deer (Sangai) on floating organic matter called phumdis.",
        "hintHi": "तैरती हुई फुुमडियों पर नाचने वाले हिरण 'संगाई' का प्राकृतिक आवास।"
    },
    {
        "topicId": "national_parks_wildlife", "subtopicId": "national_parks",
        "q": "Which is the largest national park in India by geographical area, renowned for protecting the elusive Snow Leopard in Ladakh?",
        "qHi": "क्षेत्रफल की दृष्टि से भारत का सबसे बड़ा राष्ट्रीय उद्यान कौन सा है, जो लद्दाख में दुर्लभ हिम तेंदुओं (Snow Leopard) के लिए विख्यात है?",
        "o": ["Hemis National Park (लद्दाख)", "Desert National Park", "Gangotri National Park", "Khangchendzonga National Park"],
        "oHi": ["हेमिस राष्ट्रीय उद्यान (लद्दाख)", "राष्ट्रीय मरु उद्यान (राजस्थान)", "गंगोत्री राष्ट्रीय उद्यान", "कंचनजंगा राष्ट्रीय उद्यान"],
        "a": 0,
        "exp": "Hemis National Park in eastern Ladakh spans approximately 4,400 sq km, making it India's largest national park. It harbors the highest density of snow leopards in any protected area in the world.",
        "expHi": "लद्दाख के लेह जिले में स्थित हेमिस राष्ट्रीय उद्यान (लगभग 4,400 वर्ग किमी) भारत का सबसे बड़ा राष्ट्रीय उद्यान है। यह विश्व में हिम तेंदुओं (Snow Leopards) का सबसे सघन संरक्षित क्षेत्र है।",
        "hint": "Spans ~4,400 sq km north of the Himalayas in the Union Territory of Ladakh.",
        "hintHi": "लद्दाख केंद्रशासित प्रदेश में लगभग 4,400 वर्ग किमी में फैला उद्यान।"
    },

    # ==========================
    # SPORTS & GAMES (sports_games)
    # ==========================
    {
        "topicId": "sports_games", "subtopicId": "sports_awards",
        "q": "What is the highest sporting honor of the Republic of India, renamed in August 2021 after the hockey legend?",
        "qHi": "भारत का सर्वोच्च खेल सम्मान कौन सा है, जिसका नाम अगस्त 2021 में हॉकी के जादूगर के नाम पर रखा गया?",
        "o": ["Major Dhyan Chand Khel Ratna Award", "Arjuna Award", "Dronacharya Award", "Rashtriya Khel Protsahan Puraskar"],
        "oHi": ["मेजर ध्यानचंद खेल रत्न पुरस्कार", "अर्जुन पुरस्कार", "द्रोणाचार्य पुरस्कार", "राष्ट्रीय खेल प्रोत्साहन पुरस्कार"],
        "a": 0,
        "exp": "Instituted in 1991-92 (formerly Rajiv Gandhi Khel Ratna), it was renamed the Major Dhyan Chand Khel Ratna Award in August 2021. Grandmaster Viswanathan Anand was its first recipient.",
        "expHi": "1991-92 में शुरू किए गए खेल रत्न पुरस्कार का नाम अगस्त 2021 में बदलकर 'मेजर ध्यानचंद खेल रत्न पुरस्कार' किया गया। इसके प्रथम विजेता ग्रैंडमास्टर विश्वनाथन आनंद थे। इसमें 25 लाख रुपये की पुरस्कार राशि दी जाती है।",
        "hint": "Carries a cash prize of Rs. 25 lakh; first awarded to chess wizard Viswanathan Anand.",
        "hintHi": "प्रथम प्राप्तकर्ता ग्रैंडमास्टर विश्वनाथन आनंद थे।"
    },
    {
        "topicId": "sports_games", "subtopicId": "olympics",
        "q": "Who was the first Indian athlete in independent India to win an individual Olympic Gold Medal?",
        "qHi": "स्वतंत्र भारत के इतिहास में व्यक्तिगत स्पर्धा में पहला ओलंपिक स्वर्ण पदक जीतने वाले भारतीय एथलीट कौन थे?",
        "o": ["Abhinav Bindra (2008 Beijing)", "Neeraj Chopra (2020 Tokyo)", "K. D. Jadhav", "Leander Paes"],
        "oHi": ["अभिनव बिंद्रा (2008 बीजिंग ओलंपिक)", "नीरज चोपड़ा (2020 टोक्यो ओलंपिक)", "के.डी. जाधव", "लिएंडर पेस"],
        "a": 0,
        "exp": "Abhinav Bindra won India's historic first individual Olympic gold medal in the Men's 10m Air Rifle event at the 2008 Beijing Olympics. (Neeraj Chopra won India's second individual gold in javelin at Tokyo 2020).",
        "expHi": "अभिनव बिंद्रा ने 2008 के बीजिंग ओलंपिक में 10 मीटर एयर राइफल निशानेबाजी में स्वर्ण पदक जीतकर व्यक्तिगत स्पर्धा में भारत का पहला ओलंपिक गोल्ड मेडल हासिल किया था।",
        "hint": "Won gold in 10m Air Rifle shooting at the 2008 Beijing Games.",
        "hintHi": "2008 के बीजिंग ओलंपिक में 10 मीटर एयर राइफल में स्वर्ण पदक जीता।"
    },
    {
        "topicId": "sports_games", "subtopicId": "football",
        "q": "Which is the oldest football tournament in Asia and the third oldest surviving football competition in the world, founded in Shimla in 1888?",
        "qHi": "1888 में शिमला में स्थापित एशिया का सबसे प्राचीन तथा विश्व का तीसरा सबसे पुराना फुटबॉल टूर्नामेंट कौन सा है?",
        "o": ["Durand Cup (डूरंड कप)", "Santosh Trophy", "IFA Shield", "Federation Cup"],
        "oHi": ["डूरंड कप (Durand Cup)", "संतोष ट्रॉफी", "आईएफए शील्ड", "फेडरेशन कप"],
        "a": 0,
        "exp": "The Durand Football Tournament was founded in 1888 in Shimla by Sir Henry Mortimer Durand, India's Foreign Secretary. It is Asia's oldest football competition.",
        "expHi": "डूरंड कप एशिया का सबसे पुराना और विश्व का तीसरा सबसे पुराना फुटबॉल टूर्नामेंट है, जिसकी शुरुआत 1888 में शिमला में सर हेनरी मोर्टिमर डूरंड द्वारा की गई थी।",
        "hint": "Founded in 1888 by Sir Mortimer Durand in Himachal Pradesh.",
        "hintHi": "1888 में सर हेनरी मोर्टिमर डूरंड द्वारा स्थापित।"
    },
    {
        "topicId": "sports_games", "subtopicId": "chess",
        "q": "Who became India's very first Chess Grandmaster in 1988 and went on to win the World Chess Championship five times?",
        "qHi": "1988 में भारत के पहले शतरंज ग्रैंडमास्टर (Grandmaster) बनने वाले तथा 5 बार विश्व शतरंज चैम्पियनशिप जीतने वाले दिग्गज खिलाड़ी कौन हैं?",
        "o": ["Viswanathan Anand", "Pentala Harikrishna", "Vidit Gujrathi", "D. Gukesh"],
        "oHi": ["विश्वनाथन आनंद", "पेंटाला हरिकृष्णा", "विदित गुजराती", "डी. गुकेश"],
        "a": 0,
        "exp": "Viswanathan Anand of Tamil Nadu became India's first Grandmaster in 1988. He won the undisputed World Chess Championship title in 2000, 2007, 2008, 2010, and 2012, sparking the Indian chess revolution.",
        "expHi": "तमिलनाडु के विश्वनाथन आनंद 1988 में भारत के पहले ग्रैंडमास्टर बने। इन्होंने 2000, 2007, 2008, 2010 और 2012 में विश्व शतरंज चैंपियनशिप जीतकर भारत का मान बढ़ाया।",
        "hint": "Nicknamed the 'Tiger of Madras' and author of 'Mind Master'.",
        "hintHi": "'टाइगर ऑफ मद्रास' कहलाने वाले शतरंज के महानायक।"
    },

    # ==========================
    # IMPORTANT DAYS (important_days)
    # ==========================
    {
        "topicId": "important_days", "subtopicId": "national_days",
        "q": "National Science Day (राष्ट्रीय विज्ञान दिवस) is celebrated every year on 28 February in India to commemorate what event?",
        "qHi": "भारत में प्रतिवर्ष 28 फरवरी को 'राष्ट्रीय विज्ञान दिवस' किस ऐतिहासिक वैज्ञानिक उपलब्धि की स्मृति में मनाया जाता है?",
        "o": ["Discovery of the Raman Effect by Sir C. V. Raman (1928)", "Birth anniversary of APJ Abdul Kalam", "Launch of Aryabhata satellite", "Founding of ISRO"],
        "oHi": ["सर सी.वी. रमन द्वारा 'रमन प्रभाव' की खोज (1928)", "डॉ. कलाम का जन्मदिवस", "आर्यभट्ट उपग्रह का प्रक्षेपण", "इसरो की स्थापना"],
        "a": 0,
        "exp": "National Science Day is celebrated on 28 February to mark the discovery of the 'Raman Effect' by Sir C.V. Raman in 1928, for which he was awarded the Nobel Prize in Physics in 1930.",
        "expHi": "सर सी.वी. रमन ने 28 फरवरी 1928 को 'रमन प्रभाव' की खोज की थी, जिसके लिए उन्हें 1930 में भौतिकी का नोबेल पुरस्कार मिला। भारत सरकार ने 1986 में 28 फरवरी को राष्ट्रीय विज्ञान दिवस घोषित किया।",
        "hint": "Commemorates the discovery for which Raman received the 1930 Nobel Prize.",
        "hintHi": "रमन प्रभाव की खोज 28 फरवरी 1928 को की गई थी।"
    },
    {
        "topicId": "important_days", "subtopicId": "national_days",
        "q": "National Voters' Day is celebrated across India on which date, commemorating the foundation of the Election Commission of India (ECI)?",
        "qHi": "भारत निर्वाचन आयोग (ECI) की स्थापना की स्मृति में प्रतिवर्ष 25 जनवरी को कौन सा राष्ट्रीय दिवस मनाया जाता है?",
        "o": ["25 January (National Voters' Day)", "26 November", "24 January", "28 February"],
        "oHi": ["25 जनवरी (राष्ट्रीय मतदाता दिवस)", "26 नवंबर", "24 जनवरी", "28 फरवरी"],
        "a": 0,
        "exp": "National Voters' Day has been observed annually on 25 January since 2011 to mark the founding anniversary of the Election Commission of India on 25 January 1950 and encourage democratic electoral participation.",
        "expHi": "25 जनवरी 1950 को भारत निर्वाचन आयोग (ECI) की स्थापना हुई थी। युवाओं को मतदान के प्रति जागरूक करने के लिए 2011 से प्रतिवर्ष 25 जनवरी को 'राष्ट्रीय मतदाता दिवस' मनाया जाता है।",
        "hint": "Marked since 2011, one day before Republic Day.",
        "hintHi": "गणतंत्र दिवस से ठीक एक दिन पहले 25 जनवरी को मनाया जाता है।"
    },
    {
        "topicId": "important_days", "subtopicId": "national_days",
        "q": "National Youth Day (राष्ट्रीय युवा दिवस) is observed across India on 12 January to honor the birth anniversary of which spiritual leader?",
        "qHi": "प्रतिवर्ष 12 जनवरी को 'राष्ट्रीय युवा दिवस' किस महान दार्शनिक और आध्यात्मिक युगपुरुष के जन्मदिवस पर मनाया जाता है?",
        "o": ["Swami Vivekananda", "Swami Dayananda Saraswati", "Ramakrishna Paramahamsa", "Sri Aurobindo"],
        "oHi": ["स्वामी विवेकानंद", "स्वामी दयानंद सरस्वती", "रामकृष्ण परमहंस", "श्री अरविंदो"],
        "a": 0,
        "exp": "National Youth Day is observed on 12 January, the birth anniversary of Swami Vivekananda (born 12 January 1863), who galvanized youth worldwide at the 1893 Parliament of Religions in Chicago.",
        "expHi": "1893 के शिकागो विश्व धर्म सम्मेलन में भारतीय संस्कृति का डंका बजाने वाले स्वामी विवेकानंद (जन्म 12 जनवरी 1863) के जन्मदिवस को 1985 से प्रतिवर्ष 'राष्ट्रीय युवा दिवस' के रूप में मनाया जाता है।",
        "hint": "Famous for his historic 1893 Chicago Parliament of Religions address.",
        "hintHi": "1893 के शिकागो धर्म सम्मेलन में 'भाइयों और बहनों' से संबोधन शुरू करने वाले महापुरुष।"
    },
    {
        "topicId": "important_days", "subtopicId": "national_days",
        "q": "Samvidhan Diwas (Constitution Day) is celebrated annually on which date to mark the adoption of the Constitution by the Constituent Assembly?",
        "qHi": "संविधान सभा द्वारा संविधान को अंगीकृत किए जाने के उपलक्ष्य में प्रतिवर्ष 'संविधान दिवस' किस तिथि को मनाया जाता है?",
        "o": ["26 November (26 नवंबर)", "26 January", "15 August", "2 October"],
        "oHi": ["26 नवंबर", "26 जनवरी", "15 अगस्त", "2 अक्टूबर"],
        "a": 0,
        "exp": "On 26 November 1949, the Constituent Assembly of India adopted the Constitution of India. In 2015 (Dr. B.R. Ambedkar's 125th birth anniversary year), the Government of India declared 26 November as Constitution Day.",
        "expHi": "26 नवंबर 1949 को संविधान सभा ने भारतीय संविधान को अंगीकृत, अधिनियमित और आत्मार्पित किया था। 2015 से प्रतिवर्ष 26 नवंबर को 'संविधान दिवस' मनाया जाता है।",
        "hint": "Not Republic Day (26 Jan), but the date of its formal adoption in 1949.",
        "hintHi": "26 नवंबर 1949 को संविधान अंगीकृत किया गया था।"
    },

    # ==========================
    # INDIAN ECONOMY (indian_economy)
    # ==========================
    {
        "topicId": "indian_economy", "subtopicId": "banking",
        "q": "The Reserve Bank of India (RBI) commenced operations on 1 April 1935 based on the recommendations of which Royal Commission?",
        "qHi": "भारतीय रिज़र्व बैंक (RBI) की स्थापना 1 अप्रैल 1935 को किस आयोग की सिफारिशों के आधार पर की गई थी?",
        "o": ["Hilton Young Commission (रॉयल कमीशन)", "Hunter Commission", "Kothari Commission", "Sarkaria Commission"],
        "oHi": ["हिल्टन यंग आयोग (Hilton Young Commission)", "हंटर आयोग", "कोठारी आयोग", "सरकारिया आयोग"],
        "a": 0,
        "exp": "The Reserve Bank of India was set up on 1 April 1935 under the Reserve Bank of India Act, 1934, following the recommendations of the Royal Commission on Indian Currency and Finance (Hilton Young Commission) of 1926.",
        "expHi": "भारतीय रिज़र्व बैंक (RBI) की स्थापना 1926 के हिल्टन यंग आयोग (Royal Commission on Indian Currency and Finance) की सिफारिश पर 1 अप्रैल 1935 को की गई थी। 1 जनवरी 1949 को इसका राष्ट्रीयकरण हुआ।",
        "hint": "Royal Commission on Indian Currency and Finance of 1926.",
        "hintHi": "1926 का शाही आयोग जिसे हिल्टन यंग कमीशन कहा जाता है।"
    },
    {
        "topicId": "indian_economy", "subtopicId": "taxation",
        "q": "The nationwide Goods and Services Tax (GST) in India came into effect on 1 July 2017 through which Constitutional Amendment Act?",
        "qHi": "भारत में 'एक देश, एक कर' की अवधारणा पर आधारित वस्तु एवं सेवा कर (GST) 1 जुलाई 2017 को किस संविधान संशोधन द्वारा लागू हुआ?",
        "o": ["101st Constitutional Amendment Act (101वाँ संशोधन)", "100th Amendment", "102nd Amendment", "103rd Amendment"],
        "oHi": ["101वाँ संविधान संशोधन अधिनियम", "100वाँ संशोधन", "102वाँ संशोधन", "103वाँ संशोधन"],
        "a": 0,
        "exp": "The Goods and Services Tax (GST) was enacted via the 101st Constitutional Amendment Act, 2016, and rolled out on midnight of 1 July 2017, subsuming numerous Central and State indirect taxes.",
        "expHi": "जीएसटी (GST) को 101वें संविधान संशोधन अधिनियम, 2016 द्वारा पारित किया गया और 1 जुलाई 2017 को देशभर में लागू किया गया, जिसने कई केंद्रीय व राज्य अप्रत्यक्ष करों का स्थान लिया।",
        "hint": "Enacted as the 101st Amendment Act, creating Article 279A for the GST Council.",
        "hintHi": "101वाँ संशोधन अधिनियम जिसके तहत जीएसटी परिषद (अनुच्छेद 279A) का गठन हुआ।"
    },
    {
        "topicId": "indian_economy", "subtopicId": "planning",
        "q": "NITI Aayog (National Institution for Transforming India) was established on 1 January 2015 to replace which 65-year-old body?",
        "qHi": "1 जनवरी 2015 को किस 65 वर्ष पुरानी संस्था के स्थान पर 'नीति आयोग' (NITI Aayog) का गठन किया गया?",
        "o": ["Planning Commission of India (योजना आयोग)", "National Development Council", "Finance Commission", "Disinvestment Commission"],
        "oHi": ["योजना आयोग (Planning Commission)", "राष्ट्रीय विकास परिषद", "वित्त आयोग", "विनिवेश आयोग"],
        "a": 0,
        "exp": "NITI Aayog replaced the Planning Commission (which had been established on 15 March 1950) on 1 January 2015 as a premier policy think tank to foster cooperative federalism. Prime Minister is its ex-officio Chairperson.",
        "expHi": "15 मार्च 1950 को गठित योजना आयोग को समाप्त कर 1 जनवरी 2015 को नीति आयोग (राष्ट्रीय भारत परिवर्तन संस्थान) का गठन किया गया, जिसके पदेन अध्यक्ष भारत के प्रधानमंत्री होते हैं।",
        "hint": "The body set up in 1950 that formulated 12 Five-Year Plans.",
        "hintHi": "1950 में स्थापित वह निकाय जिसने 12 पंचवर्षीय योजनाएँ बनाई थीं।"
    },
    {
        "topicId": "indian_economy", "subtopicId": "agriculture_economy",
        "q": "Who is globally acclaimed as the 'Father of the Green Revolution in India', conferred the Bharat Ratna in 2024?",
        "qHi": "उच्च उत्पादकता वाले गेहूँ और चावल के बीजों द्वारा भारत को खाद्यान्न में आत्मनिर्भर बनाने वाले 'भारत में हरित क्रांति के जनक' कौन थे, जिन्हें 2024 में भारत रत्न से सम्मानित किया गया?",
        "o": ["Dr. M. S. Swaminathan (डॉ. एम.एस. स्वामीनाथन)", "Dr. Verghese Kurien", "Dr. Norman Borlaug", "Prof. C. N. R. Rao"],
        "oHi": ["डॉ. एम.एस. स्वामीनाथन", "डॉ. वर्गीज कुरियन", "डॉ. नॉर्मन बोरलॉग", "प्रो. सी.एन.आर. राव"],
        "a": 0,
        "exp": "Dr. Mankombu Sambasivan Swaminathan led the introduction of semi-dwarf high-yielding wheat varieties in India during the 1960s with Norman Borlaug. He was posthumously awarded the Bharat Ratna in 2024.",
        "expHi": "कृषि वैज्ञानिक डॉ. एम.एस. स्वामीनाथन ने 1960 के दशक में नॉर्मन बोरलॉग के सहयोग से भारत में उच्च उपज वाले गेहूँ की किस्मों को विकसित कर हरित क्रांति का नेतृत्व किया। इन्हें 2024 में मरणोपरांत भारत रत्न दिया गया।",
        "hint": "Renowned agricultural scientist; led the introduction of high-yielding semi-dwarf wheat.",
        "hintHi": "महान कृषि वैज्ञानिक जिन्होंने भारत में हरित क्रांति का नेतृत्व किया।"
    }
]

def inject_expansion():
    # Update master
    master_path = 'src/data/gk/questions/gk_questions_master.json'
    with open(master_path, 'r', encoding='utf-8') as f:
        master_data = json.load(f)

    existing_master_qs = master_data.get('questions', [])
    seen_stems = {get_stem(q.get('questionText', q.get('q', ''))) for q in existing_master_qs}
    seen_ids = {q['id'] for q in existing_master_qs}

    new_qs = []
    for idx, item in enumerate(NEW_EXPANSION_MCQS, 1):
        stem = get_stem(item['q'])
        if stem in seen_stems:
            continue
        seen_stems.add(stem)
        qid = f"gk_nat_{item['topicId']}_exp_{idx}"
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
            "examTags": ["UPSC", "SSC CGL", "State PCS", "Banking", "RRB"]
        }
        new_qs.append(q_obj)

    print(f"Adding {len(new_qs)} new expansion questions to Master...")
    combined = existing_master_qs + new_qs
    master_data['totalQuestions'] = len(combined)
    master_data['questions'] = combined

    with open(master_path, 'w', encoding='utf-8') as f:
        json.dump(master_data, f, ensure_ascii=False, indent=2)
    print(f"Master question bank successfully updated to {len(combined)} questions!")

    # Update individual topic files
    by_topic = {}
    for q in new_qs:
        tid = q.get('topicId')
        by_topic.setdefault(tid, []).append(q)

    for tid, qs in by_topic.items():
        file_path = f"src/data/gk/national/{tid}.json"
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
    inject_expansion()
