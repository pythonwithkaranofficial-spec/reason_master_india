import { Topic, Exam, MCQQuestion, TopicQuestionBank, DifficultyLevel } from "@/types/models";
import { ALL_TOPICS_SUMMARY, TopicSummary } from "@/data/topics-index";
import { EXAM_CATEGORIES } from "@/data/categories";

// Dynamic topic and question loader
export class ContentService {
  /**
   * Return lightweight metadata summary for all 39 topics
   */
  static getAllTopics(): TopicSummary[] {
    return ALL_TOPICS_SUMMARY;
  }

  static getVerbalTopics(): TopicSummary[] {
    return ALL_TOPICS_SUMMARY.filter((t) => t.category === "verbal");
  }

  static getNonVerbalTopics(): TopicSummary[] {
    return ALL_TOPICS_SUMMARY.filter((t) => t.category === "nonverbal");
  }

  static getTopicSummary(topicId: string): TopicSummary | undefined {
    return ALL_TOPICS_SUMMARY.find((t) => t.id === topicId);
  }

  /**
   * Load full topic content (including worked examples and practice Qs)
   */
  static async getTopicDetail(topicId: string): Promise<Topic | null> {
    try {
      // Dynamic import to keep bundle small
      const topicData = await import(`@/data/topics/${topicId}.json`);
      return topicData.default as Topic;
    } catch (err) {
      console.error(`Failed to load topic ${topicId}`, err);
      return null;
    }
  }

  /**
   * Load all 64 exams
   */
  static async getAllExams(): Promise<Exam[]> {
    try {
      const examsData = await import("@/data/exams/exam-meta.json");
      return examsData.default as Exam[];
    } catch (err) {
      console.error("Failed to load exams", err);
      return [];
    }
  }

  /**
   * Load specific exam by ID
   */
  static async getExamById(examId: string): Promise<Exam | null> {
    const exams = await this.getAllExams();
    return exams.find((e) => e.id === examId) || null;
  }

  /**
   * Load exams for a specific category (e.g. ssc, banking)
   */
  static async getExamsByCategory(categoryId: string): Promise<Exam[]> {
    const exams = await this.getAllExams();
    return exams.filter((e) => e.category.toLowerCase() === categoryId.toLowerCase());
  }

  /**
   * Load the 500 questions for a specific topic
   */
  static async getQuestionBank(topicId: string): Promise<MCQQuestion[]> {
    try {
      const qData = await import(`@/data/questions/${topicId}.json`);
      const bank = qData.default as TopicQuestionBank;
      return bank.questions || [];
    } catch (err) {
      console.error(`Failed to load questions for topic ${topicId}`, err);
      return [];
    }
  }

  /**
   * Fetch questions for an MCQ practice session based on filters
   */
  static async getQuestionsForSession(options: {
    topicIds?: string[];
    examId?: string;
    difficulty?: "easy" | "medium" | "hard" | "mixed";
    count?: number;
    excludeQuestionIds?: string[];
  }): Promise<MCQQuestion[]> {
    const count = options.count || 10;
    let targetTopicIds = options.topicIds || [];

    // If an exam is selected, prioritize topics mapped to that exam
    if (options.examId) {
      const exam = await this.getExamById(options.examId);
      if (exam && exam.topicMappings) {
        // High priority first, then medium
        const highTopics = exam.topicMappings
          .filter((m) => m.priority === "high")
          .map((m) => m.topicId);
        const mediumTopics = exam.topicMappings
          .filter((m) => m.priority === "medium")
          .map((m) => m.topicId);

        targetTopicIds = highTopics.length > 0 ? [...highTopics, ...mediumTopics] : exam.topicMappings.map((m) => m.topicId);
      }
    }

    // Default to random topics if none provided
    if (targetTopicIds.length === 0) {
      targetTopicIds = ALL_TOPICS_SUMMARY.map((t) => t.id);
    }

    // Shuffle topic choices
    const shuffledTopics = [...targetTopicIds].sort(() => Math.random() - 0.5);

    // Collect questions across selected topics
    let pool: MCQQuestion[] = [];
    const topicsToSample = shuffledTopics.slice(0, Math.min(shuffledTopics.length, 6));

    for (const tId of topicsToSample) {
      const topicQuestions = await this.getQuestionBank(tId);
      pool.push(...topicQuestions);
    }

    // Filter by exam tag if examId is provided and questions have matching tags
    if (options.examId) {
      const examTagged = pool.filter((q) => q.examTags?.includes(options.examId!));
      if (examTagged.length >= count) {
        pool = examTagged;
      }
    }

    // Filter by excluded question IDs (anti-repetition)
    if (options.excludeQuestionIds && options.excludeQuestionIds.length > 0) {
      const excludeSet = new Set(options.excludeQuestionIds);
      const filtered = pool.filter((q) => !excludeSet.has(q.id));
      if (filtered.length >= count) {
        pool = filtered;
      }
    }

    // Filter / distribute by difficulty
    const requestedDiff = options.difficulty || "mixed";
    let selectedQuestions: MCQQuestion[] = [];

    if (requestedDiff === "mixed") {
      // 25% easy, 50% medium, 25% hard per spec §19
      const easyCount = Math.max(1, Math.round(count * 0.25));
      const hardCount = Math.max(1, Math.round(count * 0.25));
      const medCount = count - easyCount - hardCount;

      const easyQs = pool.filter((q) => q.difficulty === "easy").sort(() => Math.random() - 0.5);
      const medQs = pool.filter((q) => q.difficulty === "medium").sort(() => Math.random() - 0.5);
      const hardQs = pool.filter((q) => q.difficulty === "hard").sort(() => Math.random() - 0.5);

      selectedQuestions = [
        ...easyQs.slice(0, easyCount),
        ...medQs.slice(0, medCount),
        ...hardQs.slice(0, hardCount),
      ];

      // If any bucket fell short, fill from remainder pool
      if (selectedQuestions.length < count) {
        const remaining = pool
          .filter((q) => !selectedQuestions.some((sq) => sq.id === q.id))
          .sort(() => Math.random() - 0.5);
        selectedQuestions.push(...remaining.slice(0, count - selectedQuestions.length));
      }
    } else {
      const filteredByDiff = pool.filter((q) => q.difficulty === requestedDiff);
      const chosenPool = filteredByDiff.length >= count ? filteredByDiff : pool;
      selectedQuestions = chosenPool.sort(() => Math.random() - 0.5).slice(0, count);
    }

    // Final shuffle
    return selectedQuestions.sort(() => Math.random() - 0.5).slice(0, count);
  }
}
