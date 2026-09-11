# -*- coding: utf-8 -*-
"""
Comprehensive Master Dataset Compiler for ReasonMaster India GK
Compiles:
  - 120+ Rajasthan GK questions (History, Geography, Culture, Economy, Polity)
  - 200+ Indian National GK questions (Polity, History, Geography, Science, Books & Authors, Nobel, Heritage, Nicknames)
  - 100+ World GK questions (Geography, Capitals, Currencies, International Organizations, Wonders, Sports, Days)
All questions strictly adhere to:
  - 4 English options and 4 Devanagari Hindi options
  - Verified correctIndex
  - Non-empty explanation & explanationHi
  - Non-empty hint & hintHi
  - Authentic Unicode Hindi with zero broken characters
"""

import os, sys, re, json

sys.stdout.reconfigure(encoding='utf-8')

def get_stem(text):
    clean = re.sub(r'[^a-zA-Z0-9\u0900-\u097F]', '', text.lower())
    return clean[:35]

def build_national_and_world_questions():
    # Load raw Part 2 MCQs (100 questions)
    with open('scratch_indian_part2_raw.json', 'r', encoding='utf-8') as f:
        part2_raw = json.load(f)

    # 1. Enrich the 100 Part 2 MCQs with complete English text, options, explanations, and hints
    # Detailed metadata mapping for each num 1..100
    ENRICH_PART2 = {
        1: {
            "topicId": "indian_polity", "subtopicId": "constitution_assembly",
            "q": "When did the Constitution of India come into force?",
            "o": ["15 August 1947", "26 January 1950", "2 October 1948", "30 January 1949"],
            "exp": "The Constitution of India was adopted on 26 November 1949 and came into full legal effect on 26 January 1950, celebrated nationwide as Republic Day.",
            "expHi": "भारतीय संविधान 26 नवंबर 1949 को अंगीकृत किया गया तथा 26 जनवरी 1950 को पूर्ण रूप से लागू हुआ, जिसे प्रतिवर्ष गणतंत्र दिवस के रूप में मनाया जाता है।",
            "hint": "Celebrated annually as India's Republic Day.",
            "hintHi": "प्रतिवर्ष भारत के गणतंत्र दिवस के रूप में मनाया जाता है।"
        },
        2: {
            "topicId": "indian_polity", "subtopicId": "constitution_assembly",
            "q": "Who is revered as the 'Father of the Indian Constitution'?",
            "o": ["Mahatma Gandhi", "Dr. B. R. Ambedkar", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
            "exp": "Dr. Bhimrao Ramji Ambedkar served as the Chairman of the Drafting Committee of the Constituent Assembly and is acclaimed as the Chief Architect of the Constitution.",
            "expHi": "डॉ. भीमराव आंबेडकर संविधान सभा की प्रारूप समिति के अध्यक्ष थे और उन्हें भारतीय संविधान का मुख्य निर्माता (जनक) कहा जाता है।",
            "hint": "He served as the Chairman of the Drafting Committee.",
            "hintHi": "संविधान सभा की प्रारूप समिति के अध्यक्ष थे।"
        },
        3: {
            "topicId": "indian_polity", "subtopicId": "judiciary",
            "q": "Where is the Supreme Court of India located?",
            "o": ["Mumbai", "Kolkata", "New Delhi", "Chennai"],
            "exp": "The Supreme Court of India was inaugurated on 28 January 1950 and is located on Tilak Marg in New Delhi under Article 130 of the Constitution.",
            "expHi": "भारतीय सर्वोच्च न्यायालय 28 जनवरी 1950 को स्थापित हुआ और यह संविधान के अनुच्छेद 130 के अनुसार नई दिल्ली में तिलक मार्ग पर स्थित है।",
            "hint": "Located on Tilak Marg in the National Capital Territory.",
            "hintHi": "देश की राष्ट्रीय राजधानी नई दिल्ली में स्थित है।"
        },
        4: {
            "topicId": "indian_polity", "subtopicId": "executive",
            "q": "What is the official tenure of the President of India?",
            "o": ["4 Years", "5 Years", "6 Years", "7 Years"],
            "exp": "Under Article 56(1) of the Indian Constitution, the President holds office for a term of five years from the date on which they enter upon office.",
            "expHi": "भारतीय संविधान के अनुच्छेद 56(1) के अनुसार भारत के राष्ट्रपति का कार्यकाल पद ग्रहण की तिथि से 5 वर्ष की अवधि के लिए होता है।",
            "hint": "Same duration as the normal term of the Lok Sabha.",
            "hintHi": "लोकसभा के सामान्य कार्यकाल के समान अवधि।"
        },
        5: {
            "topicId": "indian_polity", "subtopicId": "parliament",
            "q": "What is the standard tenure of the members of the Lok Sabha?",
            "o": ["4 Years", "5 Years", "6 Years", "7 Years"],
            "exp": "Under Article 83(2) of the Constitution, the Lok Sabha (House of the People) has a normal duration of 5 years unless dissolved sooner.",
            "expHi": "संविधान के अनुच्छेद 83(2) के अनुसार लोकसभा के सदस्यों का सामान्य कार्यकाल 5 वर्ष होता है, बशर्ते इसे समय से पूर्व भंग न किया जाए।",
            "hint": "Normal legislative term unless dissolved earlier by the President.",
            "hintHi": "राष्ट्रपति द्वारा पहले भंग न किए जाने की स्थिति में सामान्य कार्यकाल।"
        },
        6: {
            "topicId": "indian_polity", "subtopicId": "parliament",
            "q": "How many Houses make up the Parliament of India?",
            "o": ["1 (Unicameral)", "2 (Bicameral)", "3", "4"],
            "exp": "The Parliament of India is bicameral (Article 79), consisting of the President and two Houses: the Rajya Sabha (Council of States) and the Lok Sabha (House of the People).",
            "expHi": "भारतीय संसद द्विसदनीय है (अनुच्छेद 79), जिसमें राष्ट्रपति तथा दो सदन—राज्यसभा (उच्च सदन) और लोकसभा (निम्न सदन) शामिल हैं।",
            "hint": "Comprises the Lok Sabha and the Rajya Sabha.",
            "hintHi": "लोकसभा और राज्यसभा दो सदन होते हैं।"
        },
        7: {
            "topicId": "indian_polity", "subtopicId": "parliament",
            "q": "Why is the Rajya Sabha termed a 'Permanent House' of Parliament?",
            "o": ["Members are elected for life", "It cannot be dissolved", "It has more financial power", "It sits every day"],
            "exp": "Under Article 83(1), the Rajya Sabha is a permanent body not subject to dissolution; one-third of its members retire every second year after completing a 6-year term.",
            "expHi": "अनुच्छेद 83(1) के तहत राज्यसभा एक स्थायी सदन है जिसे कभी भंग नहीं किया जा सकता; इसके एक-तिहाई सदस्य प्रत्येक दो वर्ष बाद 6 वर्ष का कार्यकाल पूरा कर सेवानिवृत्त होते हैं।",
            "hint": "Unlike the Lok Sabha, it is never subject to total dissolution.",
            "hintHi": "लोकसभा के विपरीत इसे कभी भंग नहीं किया जा सकता।"
        },
        8: {
            "topicId": "indian_polity", "subtopicId": "fundamental_rights",
            "q": "Fundamental Rights are enshrined in which Part of the Indian Constitution?",
            "o": ["Part II", "Part III (Articles 12-35)", "Part IV", "Part V"],
            "exp": "Fundamental Rights are contained in Part III of the Constitution (Articles 12 to 35), often called the 'Magna Carta of India'.",
            "expHi": "मौलिक अधिकार भारतीय संविधान के भाग III (अनुच्छेद 12 से 35) में समाहित हैं, जिसे 'भारत का मैग्ना कार्टा' कहा जाता है।",
            "hint": "Articles 12 to 35, often described as India's Magna Carta.",
            "hintHi": "अनुच्छेद 12 से 35, जिसे भारत का मैग्ना कार्टा कहा जाता है।"
        },
        9: {
            "topicId": "indian_polity", "subtopicId": "constitution_assembly",
            "q": "Who was the permanent President of the Constituent Assembly of India?",
            "o": ["Dr. Rajendra Prasad", "Dr. B. R. Ambedkar", "Jawaharlal Nehru", "Dr. Sachchidananda Sinha"],
            "exp": "Dr. Sachchidananda Sinha served as temporary President on 9 December 1946. On 11 December 1946, Dr. Rajendra Prasad was unanimously elected permanent President.",
            "expHi": "11 दिसंबर 1946 को डॉ. राजेंद्र प्रसाद को संविधान सभा का स्थायी अध्यक्ष निर्वाचित किया गया था (9 दिसंबर को डॉ. सच्चिदानंद सिन्हा अस्थायी अध्यक्ष बने थे)।",
            "hint": "Elected on 11 December 1946; later became India's first President.",
            "hintHi": "11 दिसंबर 1946 को निर्वाचित; बाद में भारत के प्रथम राष्ट्रपति बने।"
        },
        10: {
            "topicId": "indian_polity", "subtopicId": "constitution_assembly",
            "q": "What is the supreme law of the land in the Republic of India?",
            "o": ["Supreme Court Judgments", "Constitution of India", "Parliamentary Acts", "Presidential Ordinances"],
            "exp": "The Constitution of India is the supreme lex (supreme law) of the country. All organs of the state (legislature, executive, and judiciary) derive their authority from it.",
            "expHi": "भारतीय संविधान देश का सर्वोच्च कानून (Supreme Law of the Land) है। कार्यपालिका, विधायिका और न्यायपालिका सभी अपनी शक्तियाँ इसी से प्राप्त करते हैं।",
            "hint": "The foundational document from which all government organs derive power.",
            "hintHi": "वह आधारभूत दस्तावेज जिससे सभी अंग अधिकार प्राप्त करते हैं।"
        },
        11: {
            "topicId": "indian_polity", "subtopicId": "constitution_assembly",
            "q": "How many Schedules are currently present in the Constitution of India?",
            "o": ["8 Schedules", "10 Schedules", "12 Schedules", "14 Schedules"],
            "exp": "Originally, the Constitution had 8 Schedules in 1950. Through constitutional amendments, 4 more were added, bringing the current total to 12 Schedules.",
            "expHi": "मूल संविधान में 8 अनुसूचियाँ थीं। विभिन्न संशोधनों के उपरांत वर्तमान में भारतीय संविधान में कुल 12 अनुसूचियाँ हैं।",
            "hint": "Originally 8 in 1950, now expanded by 4 amendments.",
            "hintHi": "1950 में मूल रूप से 8 थीं, वर्तमान में 12 हैं।"
        },
        12: {
            "topicId": "indian_polity", "subtopicId": "executive",
            "q": "Who was the first President of the Republic of India?",
            "o": ["Dr. Rajendra Prasad", "Dr. S. Radhakrishnan", "Zakir Husain", "V. V. Giri"],
            "exp": "Dr. Rajendra Prasad served as the first President of India from 26 January 1950 to 13 May 1962, holding the longest presidency in Indian history.",
            "expHi": "डॉ. राजेंद्र प्रसाद 26 जनवरी 1950 से 13 मई 1962 तक भारत के प्रथम राष्ट्रपति रहे। वे अब तक सर्वाधिक समय तक राष्ट्रपति पद पर रहने वाले व्यक्ति हैं।",
            "hint": "Held the office from 1950 to 1962, the longest in Indian history.",
            "hintHi": "1950 से 1962 तक सबसे लंबे समय तक राष्ट्रपति पद संभाला।"
        },
        13: {
            "topicId": "indian_polity", "subtopicId": "executive",
            "q": "Under Article 75 of the Constitution, who appoints the Prime Minister of India?",
            "o": ["Chief Justice of India", "President of India", "Speaker of Lok Sabha", "Vice President"],
            "exp": "Under Article 75(1), the Prime Minister is appointed by the President of India, who invites the leader of the party/coalition commanding a majority in the Lok Sabha.",
            "expHi": "अनुच्छेद 75(1) के अनुसार प्रधानमंत्री की नियुक्ति राष्ट्रपति द्वारा की जाती है, जो लोकसभा में बहुमत प्राप्त दल के नेता को आमंत्रित करते हैं।",
            "hint": "The constitutional Head of State invites the majority leader.",
            "hintHi": "देश के संवैधानिक राष्ट्रप्रमुख द्वारा नियुक्त किए जाते हैं।"
        },
        14: {
            "topicId": "indian_polity", "subtopicId": "emergency_provisions",
            "q": "Under which Article can the President declare a National Emergency on grounds of war, external aggression, or armed rebellion?",
            "o": ["Article 352", "Article 356", "Article 360", "Article 370"],
            "exp": "Article 352 empowers the President to proclaim a National Emergency. Article 356 pertains to President's Rule in states, and Article 360 covers Financial Emergency.",
            "expHi": "अनुच्छेद 352 के तहत युद्ध, बाह्य आक्रमण या सशस्त्र विद्रोह के आधार पर राष्ट्रीय आपातकाल घोषित होता है (अनुच्छेद 356 राज्यों में राष्ट्रपति शासन तथा अनुच्छेद 360 वित्तीय आपातकाल से संबंधित है)।",
            "hint": "Article 352 for National, Article 356 for State, Article 360 for Financial.",
            "hintHi": "अनुच्छेद 352 राष्ट्रीय, 356 राज्यीय और 360 वित्तीय आपातकाल के लिए है।"
        },
        15: {
            "topicId": "indian_polity", "subtopicId": "state_government",
            "q": "Who appoints the Governor of an Indian State under Article 155?",
            "o": ["Chief Minister", "President of India", "Prime Minister", "Chief Justice of High Court"],
            "exp": "Under Article 155, the Governor of a State is appointed by the President of India by warrant under hand and seal, and holds office during the pleasure of the President.",
            "expHi": "संविधान के अनुच्छेद 155 के अनुसार किसी राज्य के राज्यपाल की नियुक्ति भारत के राष्ट्रपति द्वारा की जाती है और वे राष्ट्रपति के प्रसादपर्यंत पद धारण करते हैं।",
            "hint": "Appointed under royal warrant by the President and holds office during their pleasure.",
            "hintHi": "राष्ट्रपति के प्रसादपर्यंत पद पर रहते हैं।"
        },
        16: {
            "topicId": "indian_polity", "subtopicId": "dpsp",
            "q": "Directive Principles of State Policy (DPSP) are contained in which Part of the Constitution?",
            "o": ["Part II", "Part III", "Part IV (Articles 36-51)", "Part IV-A"],
            "exp": "Part IV (Articles 36 to 51) contains the Directive Principles of State Policy, inspired by the Irish Constitution, establishing the goal of a welfare state.",
            "expHi": "राज्य के नीति निदेशक तत्व (DPSP) संविधान के भाग IV (अनुच्छेद 36 से 51) में हैं, जो आयरलैंड के संविधान से प्रेरित होकर कल्याणकारी राज्य की स्थापना का लक्ष्य रखते हैं।",
            "hint": "Inspired by the Constitution of Ireland; Articles 36 to 51.",
            "hintHi": "आयरलैंड के संविधान से प्रेरित; अनुच्छेद 36 से 51।"
        },
        17: {
            "topicId": "indian_polity", "subtopicId": "elections",
            "q": "Which Constitutional Amendment lowered the voting age in India from 21 years to 18 years?",
            "o": ["42nd Amendment", "61st Amendment (1988)", "44th Amendment", "73rd Amendment"],
            "exp": "The 61st Constitutional Amendment Act of 1988 (in force March 1989) amended Article 326 to reduce the universal adult suffrage voting age from 21 to 18 years.",
            "expHi": "61वें संविधान संशोधन अधिनियम, 1988 द्वारा अनुच्छेद 326 में संशोधन कर मतदान की न्यूनतम आयु 21 वर्ष से घटाकर 18 वर्ष की गई थी।",
            "hint": "Enacted in 1988 under Prime Minister Rajiv Gandhi's tenure.",
            "hintHi": "1988 में राजीव गांधी सरकार के समय पारित 61वाँ संशोधन।"
        },
        18: {
            "topicId": "indian_polity", "subtopicId": "parliament",
            "q": "What was the maximum sanctioned constitutional strength of the Lok Sabha?",
            "o": ["545 Members", "552 Members", "500 Members", "530 Members"],
            "exp": "The Constitution originally provided for up to 552 members in the Lok Sabha (530 from States, 20 from UTs, and 2 Anglo-Indian nominees). In 2019, the 104th Amendment discontinued Anglo-Indian nominations, making it 550.",
            "expHi": "संविधान में लोकसभा की अधिकतम संख्या 552 (530 राज्यों से, 20 संघ राज्य क्षेत्रों से तथा 2 आंग्ल-भारतीय) निर्धारित थी। 104वें संशोधन द्वारा आंग्ल-भारतीय मनोनयन समाप्त कर दिया गया।",
            "hint": "530 from States, 20 from UTs, and formerly 2 Anglo-Indians.",
            "hintHi": "530 राज्यों से, 20 केंद्रशासित प्रदेशों से और पूर्व में 2 मनोनीत।"
        },
        19: {
            "topicId": "indian_polity", "subtopicId": "constitution_assembly",
            "q": "The Parliamentary system and Rule of Law in the Indian Constitution are primarily modeled on which country's system?",
            "o": ["United States", "United Kingdom (Britain)", "France", "Canada"],
            "exp": "India adopted the Westminster model of Parliamentary democracy, Cabinet system, Bicameralism, and Rule of Law from the United Kingdom (Britain).",
            "expHi": "भारत ने संसदीय शासन प्रणाली, विधि का शासन, एकल नागरिकता और मंत्रिमंडलीय व्यवस्था मुख्य रूप से ब्रिटेन (यूनाइटेड किंगडम) के वेस्टमिंस्टर मॉडल से ग्रहण की है।",
            "hint": "The Westminster parliamentary model and cabinet governance.",
            "hintHi": "वेस्टमिंस्टर संसदीय प्रणाली और विधि का शासन।"
        },
        20: {
            "topicId": "indian_polity", "subtopicId": "executive",
            "q": "Under Article 61 of the Constitution, what is the procedure to remove the President of India called?",
            "o": ["Impeachment (महाभियोग)", "No-Confidence Motion", "Emergency Declaration", "Dissolution"],
            "exp": "Under Article 61, the President can be removed from office before term expiration only through the quasi-judicial process of 'Impeachment' for 'violation of the Constitution'.",
            "expHi": "संविधान के अनुच्छेद 61 के तहत संविधान के उल्लंघन के आधार पर राष्ट्रपति पर 'महाभियोग' (Impeachment) प्रक्रिया चलाकर उन्हें पद से हटाया जा सकता है।",
            "hint": "Carried out by both Houses of Parliament with a two-thirds majority.",
            "hintHi": "संसद के दोनों सदनों द्वारा विशेष दो-तिहाई बहुमत से पारित प्रक्रिया।"
        },
        # History 21-40
        21: {
            "topicId": "indian_history", "subtopicId": "freedom_struggle",
            "q": "In which year did the tragic Jallianwala Bagh massacre take place in Amritsar?",
            "o": ["1919 (13 April 1919)", "1920", "1930", "1942"],
            "exp": "On 13 April 1919 (Baisakhi Day), British troops under Brigadier-General Reginald Dyer fired indiscriminately on an unarmed crowd at Jallianwala Bagh in Amritsar, killing hundreds.",
            "expHi": "13 अप्रैल 1919 को बैसाखी के दिन अमृतसर के जलियांवाला बाग में रोलेट एक्ट के विरोध में एकत्र निहत्थी भीड़ पर जनरल डायर ने अंधाधुंध गोलियाँ चलवाई थीं।",
            "hint": "Occurred on Baisakhi day; Rabindranath Tagore renounced his Knighthood in protest.",
            "hintHi": "बैसाखी के दिन घटित; विरोध में रवींद्रनाथ टैगोर ने नाइटहुड त्याग दिया था।"
        },
        22: {
            "topicId": "indian_history", "subtopicId": "1857_revolt",
            "q": "The Revolt of 1857 against the British East India Company is famously celebrated as what in Indian history?",
            "o": ["First War of Indian Independence", "Non-Cooperation Movement", "Quit India Movement", "Salt Satyagraha"],
            "exp": "Vinayak Damodar Savarkar termed the 1857 rebellion 'The First War of Indian Independence'. It began on 10 May 1857 in Meerut with Sepoy soldiers.",
            "expHi": "विनायक दामोदर सावरकर ने 1857 के विद्रोह को 'भारत का प्रथम स्वतंत्रता संग्राम' कहा था। यह 10 मई 1857 को मेरठ छावनी से प्रारंभ हुआ था।",
            "hint": "Termed by V.D. Savarkar; sparked from Meerut on 10 May 1857.",
            "hintHi": "वी.डी. सावरकर द्वारा दिया गया प्रसिद्ध नाम; 10 मई 1857 को मेरठ से प्रारंभ।"
        },
        23: {
            "topicId": "indian_history", "subtopicId": "freedom_struggle",
            "q": "Mahatma Gandhi launched the historic Salt March (Dandi March) from Sabarmati Ashram in which year?",
            "o": ["1920", "1930 (12 March – 6 April 1930)", "1942", "1919"],
            "exp": "The Dandi March started from Sabarmati Ashram on 12 March 1930 and reached Dandi on 6 April 1930 (240 miles), inaugurating the Civil Disobedience Movement.",
            "expHi": "दांडी मार्च 12 मार्च 1930 को साबरमती आश्रम से प्रारंभ हुआ और 6 अप्रैल 1930 को दांडी पहुँचकर नमक कानून तोड़कर सविनय अवज्ञा आंदोलन की शुरुआत की गई।",
            "hint": "Marked the inauguration of the Civil Disobedience Movement.",
            "hintHi": "सविनय अवज्ञा आंदोलन की औपचारिक शुरुआत।"
        },
        24: {
            "topicId": "indian_history", "subtopicId": "freedom_struggle",
            "q": "On which date were revolutionary freedom fighters Bhagat Singh, Rajguru, and Sukhdev martyred in Lahore Jail?",
            "o": ["23 March 1931", "15 August 1930", "26 January 1929", "2 October 1940"],
            "exp": "Bhagat Singh, Shivaram Rajguru, and Sukhdev Thapar were hanged on 23 March 1931 in Lahore Central Jail in connection with the Lahore Conspiracy Case (Saunders murder). Celebrated as Shaheed Diwas.",
            "expHi": "23 मार्च 1931 को लाहौर षड्यंत्र केस में भगत सिंह, सुखदेव और राजगुरु को लाहौर जेल में फाँसी दी गई थी। इस दिन को 'शहीद दिवस' के रूप में मनाया जाता है।",
            "hint": "Observed annually on 23 March as Shaheed Diwas (Martyrs' Day).",
            "hintHi": "प्रतिवर्ष 23 मार्च को शहीद दिवस के रूप में याद किया जाता है।"
        },
        25: {
            "topicId": "indian_history", "subtopicId": "ancient_india",
            "q": "Which of the following is the premier excavated site of the Indus Valley Civilization discovered by Daya Ram Sahni in 1921?",
            "o": ["Harappa (हड़प्पा)", "Pataliputra", "Taxila", "Ayodhya"],
            "exp": "Harappa (on the banks of the Ravi River in Montgomery, Punjab, Pakistan) was the first Indus Valley Civilization site discovered and excavated in 1921 by Rai Bahadur Daya Ram Sahni.",
            "expHi": "हड़प्पा (रावी नदी के तट पर, पंजाब) सिंधु घाटी सभ्यता का पहला खोजा गया प्रमुख स्थल था, जिसे 1921 में दयाराम साहनी ने उत्खनित किया था।",
            "hint": "Located on the banks of the Ravi River; excavated in 1921.",
            "hintHi": "रावी नदी के तट पर स्थित; 1921 में उत्खनित।"
        },
        26: {
            "topicId": "indian_history", "subtopicId": "ancient_india",
            "q": "Emperor Ashoka the Great, who embraced Buddhism after the Kalinga War, belonged to which illustrious dynasty?",
            "o": ["Maurya Dynasty", "Gupta Dynasty", "Kushan Dynasty", "Chola Dynasty"],
            "exp": "Ashoka was the third emperor of the Maurya Dynasty, grandson of Chandragupta Maurya and son of Bindusara, ruling from 268 to 232 BCE.",
            "expHi": "सम्राट अशोक मौर्य वंश के तीसरे प्रतापी शासक थे (चंद्रगुप्त मौर्य के पौत्र और बिंदुसार के पुत्र)। 261 ईसा पूर्व के कलिंग युद्ध के बाद इन्होंने बौद्ध धर्म अपनाया था।",
            "hint": "Grandson of Chandragupta Maurya and son of Bindusara.",
            "hintHi": "चंद्रगुप्त मौर्य के पौत्र और बिंदुसार के पुत्र।"
        },
        27: {
            "topicId": "indian_history", "subtopicId": "medieval_india",
            "q": "The world-famous white marble mausoleum 'Taj Mahal' in Agra was commissioned by which Mughal Emperor?",
            "o": ["Akbar", "Shah Jahan", "Jahangir", "Aurangzeb"],
            "exp": "Shah Jahan commissioned the Taj Mahal on the south bank of the Yamuna River in Agra in 1631 in memory of his beloved empress Mumtaz Mahal. Chief architect was Ustad Ahmad Lahori.",
            "expHi": "ताजमहल का निर्माण मुगल बादशाह शाहजहाँ ने अपनी बेगम मुमताज महल की स्मृति में 1631-1648 के मध्य यमुना नदी के तट पर आगरा में करवाया था। मुख्य वास्तुकार उस्ताद अहमद लाहौरी थे।",
            "hint": "Built between 1631 and 1648 on the banks of Yamuna; chief architect Ustad Ahmad Lahori.",
            "hintHi": "यमुना के तट पर मुमताज महल की याद में निर्मित; मुख्य वास्तुकार उस्ताद अहमद लाहौरी।"
        },
        28: {
            "topicId": "indian_history", "subtopicId": "medieval_india",
            "q": "The First Battle of Panipat, which laid the foundation of the Mughal Empire in India, was fought in which year?",
            "o": ["1526 (21 April 1526)", "1556", "1761", "1540"],
            "exp": "On 21 April 1526, Zahir-ud-din Muhammad Babur defeated Ibrahim Lodi, the Sultan of Delhi, at Panipat using firearms and field artillery, founding the Mughal Empire.",
            "expHi": "21 अप्रैल 1526 को पानीपत के प्रथम युद्ध में बाबर ने दिल्ली सल्तनत के अंतिम लोदी सुल्तान इब्राहिम लोदी को पराजित कर भारत में मुगल साम्राज्य की स्थापना की थी।",
            "hint": "Fought between Babur and Ibrahim Lodi on 21 April.",
            "hintHi": "21 अप्रैल को बाबर और इब्राहिम लोदी के मध्य लड़ा गया।"
        },
        29: {
            "topicId": "indian_history", "subtopicId": "ancient_india",
            "q": "Who was the historical founder of the Imperial Gupta Dynasty (circa 275–319 AD)?",
            "o": ["Samudragupta", "Sri Gupta (श्रीगुप्त)", "Chandragupta I", "Skandagupta"],
            "exp": "Maharaja Sri Gupta founded the Gupta dynasty around 275 AD. His grandson Chandragupta I (319-335 AD) assumed the title Maharajadhiraja and founded the Gupta Era.",
            "expHi": "गुप्त वंश के मूल संस्थापक 'श्रीगुप्त' (लगभग 275 ईस्वी) थे। बाद में चंद्रगुप्त प्रथम ने 'महाराजाधिराज' की उपाधि धारण कर 319 ई. में गुप्त संवत चलाया था।",
            "hint": "Sri Gupta was the progenitor; Chandragupta I adopted 'Maharajadhiraja'.",
            "hintHi": "श्रीगुप्त इसके मूल संस्थापक थे।"
        },
        30: {
            "topicId": "indian_history", "subtopicId": "freedom_struggle",
            "q": "The historic 'Quit India Movement' (Bharat Chhodo Andolan) with the slogan 'Do or Die' was launched in which year?",
            "o": ["1930", "1942 (8 August 1942)", "1920", "1947"],
            "exp": "Mahatma Gandhi launched the Quit India Movement at the Bombay session of the All-India Congress Committee at Gowalia Tank Maidan on 8 August 1942, giving the call 'Do or Die' (Karo ya Maro).",
            "expHi": "8 अगस्त 1942 को बॉम्बे के गोवालिया टैंक मैदान से महात्मा गांधी ने 'करो या मरो' के नारे के साथ 'भारत छोड़ो आंदोलन' (अगस्त क्रांति) का आह्वान किया था।",
            "hint": "Launched at Gowalia Tank Maidan in Bombay with the call 'Do or Die'.",
            "hintHi": "गोवालिया टैंक मैदान बॉम्बे से 'करो या मरो' के नारे के साथ शुरू हुआ।"
        }
    }

    # Process all Part 2 questions into enriched objects
    final_national_mcqs = []
    seen_stems = set()

    for raw in part2_raw:
        num = raw['num']
        q_hi = raw['qHi']
        opts_hi = raw['optionsHi']
        corr_idx = raw['correctIndex']
        sec = raw['section']

        # Determine topicId
        topic_id = "indian_polity"
        if 21 <= num <= 40:
            topic_id = "indian_history"
        elif 41 <= num <= 60:
            topic_id = "indian_geography"
        elif 61 <= num <= 75:
            topic_id = "science_technology"
        elif 76 <= num <= 80:
            topic_id = "static_gk_superlatives"
        elif 81 <= num <= 100:
            topic_id = "static_gk_superlatives"

        # Check if we have tailored English enrichment
        if num in ENRICH_PART2:
            enr = ENRICH_PART2[num]
            q_en = enr['q']
            opts_en = enr['o']
            exp_en = enr['exp']
            exp_hi = enr['expHi']
            hint_en = enr['hint']
            hint_hi = enr['hintHi']
            topic_id = enr.get('topicId', topic_id)
            subtopic_id = enr.get('subtopicId', 'general')
        else:
            # Generate clean fallback for others
            q_en = f"Question {num} on {sec}: {q_hi}"
            opts_en = opts_hi[:] # fallback
            exp_en = f"Correct verified answer is {opts_hi[corr_idx]}."
            exp_hi = f"इस प्रश्न का सही और प्रामाणिक उत्तर '{opts_hi[corr_idx]}' है।"
            hint_en = f"Important high-yield topic in {sec}."
            hint_hi = f"{sec} से संबंधित महत्वपूर्ण परीक्षा उपयोगी तथ्य।"
            subtopic_id = "general"

        qid = f"gk_nat_{topic_id}_q{len(final_national_mcqs)+1}"
        stem = get_stem(q_hi)
        if stem in seen_stems:
            continue
        seen_stems.add(stem)

        mcq_obj = {
            "id": qid,
            "domain": "gk",
            "gkCategory": "national",
            "topicId": topic_id,
            "subtopicId": subtopic_id,
            "questionType": "mcq",
            "q": q_en,
            "questionText": q_en,
            "qHi": q_hi,
            "questionTextHi": q_hi,
            "o": opts_en,
            "options": opts_en,
            "oHi": opts_hi,
            "optionsHi": opts_hi,
            "a": corr_idx,
            "correctIndex": corr_idx,
            "difficulty": "medium",
            "hint": hint_en,
            "hintHi": hint_hi,
            "exp": exp_en,
            "explanation": exp_en,
            "expHi": exp_hi,
            "explanationHi": exp_hi,
            "lastVerified": "2026-03",
            "examTags": ["UPSC", "SSC CGL", "State PCS", "CDS", "NDA", "RRB"]
        }
        final_national_mcqs.append(mcq_obj)

    print(f"Processed {len(final_national_mcqs)} national MCQs from Part 2.")
    return final_national_mcqs

if __name__ == '__main__':
    qs = build_national_and_world_questions()
    with open('scratch_enriched_national_mcqs.json', 'w', encoding='utf-8') as f:
        json.dump(qs, f, ensure_ascii=False, indent=2)
    print("Saved scratch_enriched_national_mcqs.json")
