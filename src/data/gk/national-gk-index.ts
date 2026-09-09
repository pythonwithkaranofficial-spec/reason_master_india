/**
 * Indian GK Summary Index
 * Authoritative topics covering national heritage, polity, geography, economy, and science.
 */
import { GKTopicSummary } from "./gk-types";

export const ALL_NATIONAL_TOPICS_SUMMARY: GKTopicSummary[] = [
  {
    "id": "indian_history",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Indian History",
    "iconName": "BookOpen",
    "summary": "From the Indus Valley Civilization and Vedic eras to Mauryan, Gupta, Mughal empires, and the Indian Freedom Struggle (1857-1947).",
    "subtopicCount": 3,
    "factCount": 7,
    "questionCount": 10,
    "subtopics": [
      {
        "id": "ancient_india",
        "name": "Ancient India & Indus Valley",
        "factCount": 3,
        "questionCount": 3
      },
      {
        "id": "medieval_india",
        "name": "Medieval India & Empires",
        "factCount": 2,
        "questionCount": 3
      },
      {
        "id": "modern_freedom_movement",
        "name": "Modern India & Freedom Movement",
        "factCount": 2,
        "questionCount": 3
      }
    ]
  },
  {
    "id": "indian_polity",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Polity & Constitution",
    "iconName": "Shield",
    "summary": "Preamble, Fundamental Rights, Directive Principles, President, Parliament, Judiciary, and Constitutional Amendments.",
    "subtopicCount": 2,
    "factCount": 4,
    "questionCount": 14,
    "subtopics": [
      {
        "id": "preamble_citizenship",
        "name": "Preamble, Union & Citizenship",
        "factCount": 2,
        "questionCount": 2
      },
      {
        "id": "fundamental_rights",
        "name": "Fundamental Rights & Duties",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "indian_geography",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Indian Geography",
    "iconName": "Compass",
    "summary": "Physiography, Himalayan & Peninsular river basins, Monsoons, Soils, Forests, and Mineral resources.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 5,
    "subtopics": [
      {
        "id": "physiography_himalayas",
        "name": "Physiography & Mountain Ranges",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "indian_economy",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Indian Economy",
    "iconName": "TrendingUp",
    "summary": "NITI Aayog, Five Year Plans, Budget, Taxation (GST), RBI & Monetary Policy, Banking, and Agriculture.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 5,
    "subtopics": [
      {
        "id": "rbi_banking",
        "name": "Banking & Monetary Policy",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "science_technology",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Science & Technology",
    "iconName": "Zap",
    "summary": "ISRO space missions, DRDO defense systems, nuclear energy, biotechnology, and IT.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 4,
    "subtopics": [
      {
        "id": "isro_missions",
        "name": "ISRO Space Missions",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "sports_games",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Sports & Games",
    "iconName": "Award",
    "summary": "Olympics, Asian Games, Commonwealth Games, Cricket World Cups, Trophies, and Major Dhyan Chand Khel Ratna.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 2,
    "subtopics": [
      {
        "id": "olympic_achievements",
        "name": "Olympic Records & Heroes",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "books_authors",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Books & Authors",
    "iconName": "Book",
    "summary": "Ancient Sanskrit classics, Freedom struggle memoirs, and contemporary Booker and Sahitya Akademi prize-winners.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 17,
    "subtopics": [
      {
        "id": "classical_ancient_books",
        "name": "Classical & Medieval Classics",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "awards_honours",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Awards & Honours",
    "iconName": "Award",
    "summary": "Civilian awards (Bharat Ratna, Padma), Gallantry awards, Literary, Cinema, and Sports honours.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 10,
    "subtopics": [
      {
        "id": "civilian_awards",
        "name": "Civilian Honours & Bharat Ratna",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "important_days",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Important National Days",
    "iconName": "Calendar",
    "summary": "Commemorative national days, anniversaries, and associated historical events.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 2,
    "subtopics": [
      {
        "id": "national_observances",
        "name": "National Observances & Significance",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "national_parks_wildlife",
    "domain": "gk",
    "gkCategory": "national",
    "name": "National Parks & Wildlife",
    "iconName": "Shield",
    "summary": "Tiger reserves, elephant reserves, biosphere reserves, Ramsar wetland sites, and endangered fauna.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 4,
    "subtopics": [
      {
        "id": "tiger_reserves_parks",
        "name": "Tiger Reserves & Bio-Sanctuaries",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "static_gk_superlatives",
    "domain": "gk",
    "gkCategory": "national",
    "name": "Static GK & First in India",
    "iconName": "Eye",
    "summary": "First officeholders, highest/longest/largest geographical wonders, national emblems, and superlatives.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 14,
    "subtopics": [
      {
        "id": "first_in_india",
        "name": "First Dignitaries & Pioneers",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  }
];
