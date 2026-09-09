/**
 * ReasonMaster India - General Knowledge (GK) Type Definitions & Models
 * Strictly additive models for State GK, Indian GK, and World GK.
 */

export type GKCategory = "state" | "national" | "world";

export type GKDifficultyLevel = "easy" | "medium" | "hard";

export interface GKFact {
  id: string;
  topicId: string;
  subtopicId?: string;
  title: string;
  content: string;
  tags?: string[];
  lastVerified?: string; // Required for time-sensitive officeholders, schemes, records (e.g. "2026-01-01")
  sourceOrReference?: string;
}

export interface GKPracticeQuestion {
  id: string;
  questionText: string;
  questionTextHi?: string;
  options: string[];
  optionsHi?: string[];
  correctIndex: number;
  explanation: string;
  explanationHi?: string;
  hint?: string;
  hintHi?: string;
  difficulty: GKDifficultyLevel;
  lastVerified?: string;
  examTags?: string[];
  source?: {
    type: "pdf";
    collection: "indian_gk" | "rajasthan_gk";
    fileName: string;
    page: number;
  };
}

export interface GKSubtopic {
  id: string;
  name: string;
  summary: string;
  facts: GKFact[];
  practiceQuestions?: GKPracticeQuestion[];
}

export interface StateGKProfile {
  id: string; // e.g. "rajasthan", "maharashtra", "delhi"
  type: "state" | "ut";
  name: string;
  capital: string;
  formationDate: string;
  areaSqKm: number;
  districtsCount: number;
  officialLanguages: string[];
  highCourt: string;
  chiefMinister?: string | null;
  governorOrLtGovernor: string;
  governorTitle: "Governor" | "Lieutenant Governor" | "Administrator";
  lastVerified: string; // e.g. "2026-01-01"
  stateSymbols: {
    animal?: string;
    bird?: string;
    flower?: string;
    tree?: string;
  };
  summary: string;
  subtopics: GKSubtopic[];
  mcqCount: number;
}

export interface GKTopicSummary {
  id: string;
  domain: "gk";
  gkCategory: GKCategory;
  name: string;
  shortName?: string;
  iconName: string;
  summary: string;
  subtopicCount: number;
  factCount: number;
  questionCount: number;
  subtopics: {
    id: string;
    name: string;
    factCount: number;
    questionCount: number;
  }[];
}

export interface GKTopic {
  id: string;
  domain: "gk";
  gkCategory: GKCategory;
  name: string;
  iconName: string;
  summary: string;
  conceptExplanation: string;
  subtopics: GKSubtopic[];
}

export interface GKMCQQuestion {
  id: string;
  domain: "gk";
  gkCategory: GKCategory;
  stateId?: string;
  topicId: string;
  subtopicId: string;
  questionType: "text";
  questionText: string;
  questionTextHi?: string;
  options: string[];
  optionsHi?: string[];
  correctIndex: number;
  difficulty: GKDifficultyLevel;
  hint: string;
  hintHi?: string;
  explanation: string;
  explanationHi?: string;
  lastVerified?: string;
  examTags: string[];
  source?: {
    type: "pdf";
    collection: "indian_gk" | "rajasthan_gk";
    fileName: string;
    page: number;
  };
}

export interface GKUserQuestionAttempt {
  questionId: string;
  topicId: string;
  subtopicId: string;
  gkCategory: GKCategory;
  stateId?: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
}

export interface GKSessionResult {
  id: string;
  timestamp: number;
  gkCategories: GKCategory[];
  topicIds: string[];
  stateIds?: string[];
  difficulty: "easy" | "medium" | "hard" | "mixed";
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
  mode: "instant" | "review";
  attempts: GKUserQuestionAttempt[];
}

export interface GKBookmarkItem {
  id: string;
  questionId: string;
  topicId: string;
  subtopicId: string;
  gkCategory: GKCategory;
  stateId?: string;
  questionText: string;
  questionTextHi?: string;
  options: string[];
  optionsHi?: string[];
  correctIndex: number;
  difficulty: GKDifficultyLevel;
  explanation: string;
  explanationHi?: string;
  hint?: string;
  lastVerified?: string;
  savedAt: number;
  notes?: string;
}

export interface GKTopicProgressSummary {
  topicId: string;
  topicName: string;
  gkCategory: GKCategory;
  totalQuestions?: number;
  totalAttempted: number;
  totalCorrect: number;
  accuracy: number;
  masteryStatus: "unstarted" | "practicing" | "proficient" | "mastered";
  lastAttemptedTimestamp?: number;
}

export interface GKUserSettings {
  instantFeedback: boolean;
  soundEffects: boolean;
  autoNextQuestion: boolean;
  defaultQuestionCount: 10 | 20 | 30;
  preferredCategory?: "all" | GKCategory;
  quizLanguage?: "en" | "hi";
}
