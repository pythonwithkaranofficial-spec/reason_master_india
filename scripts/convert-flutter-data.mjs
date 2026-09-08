import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FLUTTER_ASSETS_PATH = "K:/Android App Files/PLAYSTORE APPS/Reasoning/reason_master/assets/content";
const TARGET_TOPICS_PATH = path.resolve(__dirname, "../src/data/topics");
const TARGET_QUESTIONS_PATH = path.resolve(__dirname, "../src/data/questions");
const TARGET_EXAMS_PATH = path.resolve(__dirname, "../src/data/exams");

// Ensure directories exist
fs.mkdirSync(TARGET_TOPICS_PATH, { recursive: true });
fs.mkdirSync(TARGET_QUESTIONS_PATH, { recursive: true });
fs.mkdirSync(TARGET_EXAMS_PATH, { recursive: true });

console.log("Starting data migration from Flutter assets...");

// 1. Copy exam_meta.json
const examMetaSrc = path.join(FLUTTER_ASSETS_PATH, "exam_meta.json");
const examMetaData = JSON.parse(fs.readFileSync(examMetaSrc, "utf8"));
fs.writeFileSync(path.join(TARGET_EXAMS_PATH, "exam-meta.json"), JSON.stringify(examMetaData, null, 2));
console.log(`✓ Copied exam_meta.json with ${examMetaData.length} exams.`);

// 2. Process verbal & nonverbal topics
const topicsSummary = [];
const searchTopics = [];

const verbalDir = path.join(FLUTTER_ASSETS_PATH, "verbal");
const nonverbalDir = path.join(FLUTTER_ASSETS_PATH, "nonverbal");

const verbalFiles = fs.readdirSync(verbalDir).filter((f) => f.endsWith(".json"));
const nonverbalFiles = fs.readdirSync(nonverbalDir).filter((f) => f.endsWith(".json"));

for (const f of verbalFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(verbalDir, f), "utf8"));
  content.category = "verbal";
  fs.writeFileSync(path.join(TARGET_TOPICS_PATH, f), JSON.stringify(content, null, 2));

  const subtopicNames = (content.subtopics || []).map((s) => s.name);
  let totalExamples = 0;
  let totalPractice = 0;
  (content.subtopics || []).forEach((s) => {
    totalExamples += s.examples?.length || 0;
    totalPractice += s.practiceQuestions?.length || 0;
  });

  topicsSummary.push({
    id: content.id,
    name: content.name,
    category: "verbal",
    subtopicCount: content.subtopics?.length || 0,
    exampleCount: totalExamples,
    practiceCount: totalPractice,
    shortcutSummary: content.shortcutSummary || "",
    subtopics: (content.subtopics || []).map((s) => ({
      id: s.id,
      name: s.name,
      exampleCount: s.examples?.length || 0,
      practiceCount: s.practiceQuestions?.length || 0,
    })),
  });

  searchTopics.push({
    id: content.id,
    name: content.name,
    category: "verbal",
    subtopicCount: content.subtopics?.length || 0,
    subtopics: subtopicNames,
  });
}

for (const f of nonverbalFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(nonverbalDir, f), "utf8"));
  content.category = "nonverbal";
  fs.writeFileSync(path.join(TARGET_TOPICS_PATH, f), JSON.stringify(content, null, 2));

  const subtopicNames = (content.subtopics || []).map((s) => s.name);
  let totalExamples = 0;
  let totalPractice = 0;
  (content.subtopics || []).forEach((s) => {
    totalExamples += s.examples?.length || 0;
    totalPractice += s.practiceQuestions?.length || 0;
  });

  topicsSummary.push({
    id: content.id,
    name: content.name,
    category: "nonverbal",
    subtopicCount: content.subtopics?.length || 0,
    exampleCount: totalExamples,
    practiceCount: totalPractice,
    shortcutSummary: content.shortcutSummary || "",
    subtopics: (content.subtopics || []).map((s) => ({
      id: s.id,
      name: s.name,
      exampleCount: s.examples?.length || 0,
      practiceCount: s.practiceQuestions?.length || 0,
    })),
  });

  searchTopics.push({
    id: content.id,
    name: content.name,
    category: "nonverbal",
    subtopicCount: content.subtopics?.length || 0,
    subtopics: subtopicNames,
  });
}

console.log(`✓ Copied ${verbalFiles.length} verbal topics & ${nonverbalFiles.length} nonverbal topics (Total: ${topicsSummary.length}).`);

// 3. Process question files
const questionsDir = path.join(FLUTTER_ASSETS_PATH, "questions");
const questionFiles = fs.readdirSync(questionsDir).filter((f) => f.endsWith(".json"));
let grandTotalQuestions = 0;

for (const f of questionFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(questionsDir, f), "utf8"));
  fs.writeFileSync(path.join(TARGET_QUESTIONS_PATH, f), JSON.stringify(content, null, 2));
  grandTotalQuestions += content.questions?.length || 0;
}

console.log(`✓ Copied ${questionFiles.length} question files with a grand total of ${grandTotalQuestions} MCQs.`);

// 4. Generate search-index.ts
const searchExams = examMetaData.map((e) => ({
  id: e.id,
  name: e.name,
  shortName: e.shortName,
  category: e.category,
  conductingBody: e.conductingBody,
  topicCount: e.topicMappings?.length || 0,
}));

const searchIndexContent = `/**
 * Pre-compiled Search & Discovery Index
 * Auto-generated from data pipeline.
 */

export interface TopicSearchItem {
  id: string;
  name: string;
  category: "verbal" | "nonverbal";
  subtopicCount: number;
  subtopics: string[];
}

export interface ExamSearchItem {
  id: string;
  name: string;
  shortName: string;
  category: string;
  conductingBody: string;
  topicCount: number;
}

export const TOPIC_INDEX: TopicSearchItem[] = ${JSON.stringify(searchTopics, null, 2)};

export const EXAM_INDEX: ExamSearchItem[] = ${JSON.stringify(searchExams, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, "../src/data/search-index.ts"), searchIndexContent);
console.log("✓ Generated src/data/search-index.ts");

// 5. Generate topics-index.ts (Lightweight metadata index for high-speed page rendering)
const topicsIndexContent = `/**
 * Master Topics Summary Index
 * Auto-generated from data pipeline.
 */

export interface TopicSummary {
  id: string;
  name: string;
  category: "verbal" | "nonverbal";
  subtopicCount: number;
  exampleCount: number;
  practiceCount: number;
  shortcutSummary: string;
  subtopics: {
    id: string;
    name: string;
    exampleCount: number;
    practiceCount: number;
  }[];
}

export const ALL_TOPICS_SUMMARY: TopicSummary[] = ${JSON.stringify(topicsSummary, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, "../src/data/topics-index.ts"), topicsIndexContent);
console.log("✓ Generated src/data/topics-index.ts");

console.log("Data migration complete successfully!");
