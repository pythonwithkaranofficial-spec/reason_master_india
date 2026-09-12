/**
 * World GK Summary Index
 * Authoritative topics covering world geography, countries & currencies, global institutions, and international sports.
 */
import { GKTopicSummary } from "./gk-types";

export const ALL_WORLD_TOPICS_SUMMARY: GKTopicSummary[] = [
  {
    "id": "world_geography",
    "domain": "gk",
    "gkCategory": "world",
    "name": "World Geography",
    "iconName": "Compass",
    "summary": "Continents, oceans, deepest trenches, major mountain ranges, straits, canals, and deserts.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 126,
    "subtopics": [
      {
        "id": "oceans_straits_canals",
        "name": "Oceans, Strategic Straits & Canals",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "countries_capitals_currencies",
    "domain": "gk",
    "gkCategory": "world",
    "name": "Countries, Capitals & Currencies",
    "iconName": "Compass",
    "summary": "Global nations, their administrative capitals, national currencies, and regional blocs.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 7,
    "subtopics": [
      {
        "id": "major_world_capitals",
        "name": "Key Global Nations & Currencies",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "international_organizations",
    "domain": "gk",
    "gkCategory": "world",
    "name": "International Organizations",
    "iconName": "Shield",
    "summary": "United Nations and agencies, Bretton Woods institutions (IMF, World Bank), WTO, G20, BRICS, and ASEAN.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 18,
    "subtopics": [
      {
        "id": "united_nations_system",
        "name": "United Nations & Global Agencies",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "world_history",
    "domain": "gk",
    "gkCategory": "world",
    "name": "World History",
    "iconName": "BookOpen",
    "summary": "Ancient civilizations, Renaissance, French Revolution, Industrial Revolution, World Wars, and Cold War.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 7,
    "subtopics": [
      {
        "id": "major_revolutions_wars",
        "name": "Revolutions & Global Conflicts",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "world_important_days",
    "domain": "gk",
    "gkCategory": "world",
    "name": "Important World Days",
    "iconName": "Calendar",
    "summary": "United Nations international days, global environmental dates, and human rights anniversaries.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 8,
    "subtopics": [
      {
        "id": "un_international_days",
        "name": "Global Observances & Origins",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  },
  {
    "id": "world_sports",
    "domain": "gk",
    "gkCategory": "world",
    "name": "World Sports & Tournaments",
    "iconName": "Award",
    "summary": "Olympic Games history, FIFA World Cup, ICC Cricket World Cup, Grand Slam Tennis, and world championship records.",
    "subtopicCount": 1,
    "factCount": 2,
    "questionCount": 17,
    "subtopics": [
      {
        "id": "major_tournaments",
        "name": "Global Tournaments & Milestones",
        "factCount": 2,
        "questionCount": 2
      }
    ]
  }
];
