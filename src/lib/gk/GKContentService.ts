import {
  StateGKProfile,
  GKTopic,
  GKTopicSummary,
  GKMCQQuestion,
  GKCategory,
} from "@/data/gk/gk-types";
import { ALL_STATES_SUMMARY, StateSummaryItem } from "@/data/gk/state-gk-index";
import { ALL_NATIONAL_TOPICS_SUMMARY } from "@/data/gk/national-gk-index";
import { ALL_WORLD_TOPICS_SUMMARY } from "@/data/gk/world-gk-index";

export class GKContentService {
  /**
   * Return metadata summaries for all 36 States & UTs
   */
  static getAllStatesSummary(): StateSummaryItem[] {
    return ALL_STATES_SUMMARY;
  }

  static getStatesOnly(): StateSummaryItem[] {
    return ALL_STATES_SUMMARY.filter((s) => s.type === "state");
  }

  static getUTsOnly(): StateSummaryItem[] {
    return ALL_STATES_SUMMARY.filter((s) => s.type === "ut");
  }

  static getStateSummary(stateId: string): StateSummaryItem | undefined {
    return ALL_STATES_SUMMARY.find((s) => s.id === stateId);
  }

  /**
   * Load complete state profile (facts, symbols, 6 subtopics, MCQs)
   */
  static async getStateDetail(stateId: string): Promise<StateGKProfile | null> {
    try {
      const data = await import(`@/data/gk/states/${stateId}.json`);
      return data.default as StateGKProfile;
    } catch (err) {
      console.error(`Failed to load state GK for ${stateId}`, err);
      return null;
    }
  }

  /**
   * Return metadata summaries for all 11 Indian GK topics
   */
  static getAllNationalTopics(): GKTopicSummary[] {
    return ALL_NATIONAL_TOPICS_SUMMARY;
  }

  static getNationalTopicSummary(topicId: string): GKTopicSummary | undefined {
    return ALL_NATIONAL_TOPICS_SUMMARY.find((t) => t.id === topicId);
  }

  /**
   * Load complete National GK topic
   */
  static async getNationalTopicDetail(topicId: string): Promise<GKTopic | null> {
    if (!this.getNationalTopicSummary(topicId)) return null;
    try {
      const data = await import(`@/data/gk/national/${topicId}.json`);
      return data.default as GKTopic;
    } catch (err) {
      console.error(`Failed to load national GK topic for ${topicId}`, err);
      return null;
    }
  }

  /**
   * Return metadata summaries for all 6 World GK topics
   */
  static getAllWorldTopics(): GKTopicSummary[] {
    return ALL_WORLD_TOPICS_SUMMARY;
  }

  static getWorldTopicSummary(topicId: string): GKTopicSummary | undefined {
    return ALL_WORLD_TOPICS_SUMMARY.find((t) => t.id === topicId);
  }

  /**
   * Load complete World GK topic
   */
  static async getWorldTopicDetail(topicId: string): Promise<GKTopic | null> {
    if (!this.getWorldTopicSummary(topicId)) return null;
    try {
      const data = await import(`@/data/gk/world/${topicId}.json`);
      return data.default as GKTopic;
    } catch (err) {
      console.error(`Failed to load world GK topic for ${topicId}`, err);
      return null;
    }
  }

  /**
   * Load the master GK question bank (112+ curated questions)
   */
  static async getAllGKQuestions(): Promise<GKMCQQuestion[]> {
    try {
      const data = await import("@/data/gk/questions/gk_questions_master.json");
      return (data.default?.questions || []) as GKMCQQuestion[];
    } catch (err) {
      console.error("Failed to load master GK questions", err);
      return [];
    }
  }

  /**
   * Query GK questions with optional filters
   */
  static async getFilteredGKQuestions(filter: {
    category?: GKCategory | "all";
    stateId?: string;
    topicId?: string;
    difficulty?: "easy" | "medium" | "hard" | "all" | "mixed";
    limit?: number;
    shuffle?: boolean;
  }): Promise<GKMCQQuestion[]> {
    const allQuestions = await this.getAllGKQuestions();

    let filtered = allQuestions.filter((q) => {
      if (filter.category && filter.category !== "all" && q.gkCategory !== filter.category) {
        return false;
      }
      if (filter.stateId && q.stateId !== filter.stateId) {
        return false;
      }
      if (filter.topicId && q.topicId !== filter.topicId) {
        return false;
      }
      if (
        filter.difficulty &&
        filter.difficulty !== "all" &&
        filter.difficulty !== "mixed" &&
        q.difficulty !== filter.difficulty
      ) {
        return false;
      }
      return true;
    });

    if (filter.shuffle) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    if (filter.limit && filter.limit > 0) {
      filtered = filtered.slice(0, filter.limit);
    }

    return filtered;
  }
}
