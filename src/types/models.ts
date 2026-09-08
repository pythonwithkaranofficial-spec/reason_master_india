/**
 * ReasonMaster India - Type Definitions & Domain Models
 */

export type ReasoningCategory = "verbal" | "nonverbal";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface WorkedExample {
  title?: string;
  problem?: string;
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  stepByStepSolution?: string[];
  solutionSteps?: string | string[];
  shortcutOrTrick?: string;
  shortcutApplied?: string;
  difficulty?: DifficultyLevel;
  figureRef?: string;
}

export interface PracticeQuestion {
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  solutionSteps?: string | string[];
  hint?: string;
  difficulty?: DifficultyLevel;
  figureRef?: string;
  examTags?: string[];
}

export interface Subtopic {
  id: string;
  name: string;
  explanation: string;
  shortcuts?: string[];
  examples: WorkedExample[];
  practiceQuestions: PracticeQuestion[];
}

export interface Topic {
  id: string;
  category: ReasoningCategory;
  name: string;
  iconName?: string;
  shortcutSummary?: string;
  conceptExplanation: string;
  subtopics: Subtopic[];
}

export interface MCQQuestion {
  id: string;
  topicId: string;
  subtopicId: string;
  questionType: "text" | "figure";
  questionText: string;
  options: string[];
  correctIndex: number;
  difficulty: DifficultyLevel;
  hint: string;
  explanation: string;
  solutionSteps?: string[];
  memoryTip?: string;
  examTags: string[];
  figureData?: string;
  figureRef?: string;
}

export interface TopicQuestionBank {
  topicId: string;
  totalQuestions: number;
  questions: MCQQuestion[];
}

export type TopicPriority = "high" | "medium" | "low";

export interface ExamTopicMapping {
  topicId: string;
  priority: TopicPriority;
  weight: number;
  frequency: "frequent" | "common" | "occasional" | "rare";
}

export interface Exam {
  id: string;
  name: string;
  shortName: string;
  category: string;
  conductingBody: string;
  description: string;
  iconName?: string;
  topicMappings: ExamTopicMapping[];
}

export interface ExamCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
  conductingBodies: string[];
  examCount: number;
  iconName: string;
  color: string;
}

/* User Progress & Session Data Models */
export interface UserQuestionAttempt {
  questionId: string;
  topicId: string;
  subtopicId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
}

export interface SessionResult {
  id: string;
  timestamp: number;
  topicIds: string[];
  examId?: string;
  difficulty: "easy" | "medium" | "hard" | "mixed";
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
  mode: "instant" | "review";
  attempts: UserQuestionAttempt[];
}

export interface BookmarkItem {
  id: string;
  questionId: string;
  topicId: string;
  subtopicId: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  difficulty: DifficultyLevel;
  explanation: string;
  hint?: string;
  solutionSteps?: string[];
  memoryTip?: string;
  savedAt: number;
  notes?: string;
}

export interface TopicProgressSummary {
  topicId: string;
  totalAttempted: number;
  totalCorrect: number;
  accuracy: number;
  lastAttemptedTimestamp?: number;
}

export interface UserSettings {
  themeMode: "light" | "dark" | "auto";
  fontSize: "normal" | "large";
  instantFeedback: boolean;
  soundEffects: boolean;
  autoNextQuestion: boolean;
  defaultQuestionCount: 10 | 20 | 30;
}
