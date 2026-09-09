import {
  GKSessionResult,
  GKUserQuestionAttempt,
  GKCategory,
  GKTopicProgressSummary,
} from "@/data/gk/gk-types";

export interface GKOverallStats {
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  totalSessions: number;
  totalTimeSeconds: number;
  categoryBreakdown: {
    state: { attempted: number; correct: number; accuracy: number };
    national: { attempted: number; correct: number; accuracy: number };
    world: { attempted: number; correct: number; accuracy: number };
  };
  weakTopics: {
    topicId: string;
    topicName: string;
    gkCategory: GKCategory;
    accuracy: number;
    attempted: number;
  }[];
  strongTopics: {
    topicId: string;
    topicName: string;
    gkCategory: GKCategory;
    accuracy: number;
    attempted: number;
  }[];
  recentSessions: GKSessionResult[];
}

export const GKStatsEngine = {
  computeStats(
    attempts: GKUserQuestionAttempt[],
    sessions: GKSessionResult[]
  ): GKOverallStats {
    const totalAttempted = attempts.length;
    const totalCorrect = attempts.filter((a) => a.isCorrect).length;
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const totalTimeSeconds = attempts.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0);

    const catStats = {
      state: { attempted: 0, correct: 0, accuracy: 0 },
      national: { attempted: 0, correct: 0, accuracy: 0 },
      world: { attempted: 0, correct: 0, accuracy: 0 },
    };

    const topicMap: Record<
      string,
      { topicId: string; gkCategory: GKCategory; attempted: number; correct: number }
    > = {};

    for (const a of attempts) {
      const cat = a.gkCategory || "national";
      if (catStats[cat]) {
        catStats[cat].attempted += 1;
        if (a.isCorrect) catStats[cat].correct += 1;
      }

      if (!topicMap[a.topicId]) {
        topicMap[a.topicId] = {
          topicId: a.topicId,
          gkCategory: cat,
          attempted: 0,
          correct: 0,
        };
      }
      topicMap[a.topicId].attempted += 1;
      if (a.isCorrect) topicMap[a.topicId].correct += 1;
    }

    for (const k of ["state", "national", "world"] as const) {
      const s = catStats[k];
      s.accuracy = s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0;
    }

    const topicList = Object.values(topicMap).map((t) => ({
      topicId: t.topicId,
      topicName: formatTopicName(t.topicId),
      gkCategory: t.gkCategory,
      attempted: t.attempted,
      accuracy: Math.round((t.correct / t.attempted) * 100),
    }));

    // Weak topics: accuracy < 60% with at least 3 attempts
    const weakTopics = topicList
      .filter((t) => t.attempted >= 3 && t.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    // Strong topics: accuracy >= 75% with at least 3 attempts
    const strongTopics = topicList
      .filter((t) => t.attempted >= 3 && t.accuracy >= 75)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5);

    return {
      totalAttempted,
      totalCorrect,
      overallAccuracy,
      totalSessions: sessions.length,
      totalTimeSeconds,
      categoryBreakdown: catStats,
      weakTopics,
      strongTopics,
      recentSessions: sessions.slice(0, 10),
    };
  },
};

function formatTopicName(id: string): string {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
