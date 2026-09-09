import { UserQuestionAttempt, SessionResult } from "@/types/models";
import { ALL_TOPICS_SUMMARY } from "@/data/topics-index";

export interface TopicStat {
  topicId: string;
  topicName: string;
  category: "verbal" | "nonverbal";
  totalAttempted: number;
  totalCorrect: number;
  accuracy: number;
  lastAttempted?: number;
}

export interface DifficultyStat {
  difficulty: "easy" | "medium" | "hard";
  totalAttempted: number;
  totalCorrect: number;
  accuracy: number;
}

export interface OverallStats {
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  overallAccuracy: number;
  totalSessions: number;
  totalTimeSpentSeconds: number;
  currentStreakDays: number;
  bestSessionAccuracy: number;
  topicStats: TopicStat[];
  weakTopics: TopicStat[];
  strongTopics: TopicStat[];
  difficultyStats: DifficultyStat[];
  recentSessions: SessionResult[];
}

export class StatsEngine {
  /**
   * Compute comprehensive analytics from raw user attempts and completed sessions
   */
  static computeStats(attempts: UserQuestionAttempt[], sessions: SessionResult[]): OverallStats {
    const totalAttempted = attempts.length;
    const totalCorrect = attempts.filter((a) => a.isCorrect).length;
    const totalIncorrect = totalAttempted - totalCorrect;
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const totalSessions = sessions.length;

    // Time spent
    const totalTimeSpentSeconds = sessions.reduce((sum, s) => sum + (s.timeTakenSeconds || 0), 0);

    // Best session
    let bestSessionAccuracy = 0;
    if (sessions.length > 0) {
      bestSessionAccuracy = Math.max(...sessions.map((s) => s.accuracyPercentage || 0));
    }

    // Group attempts by topic
    const topicMap = new Map<string, { attempted: number; correct: number; lastTime: number }>();

    for (const a of attempts) {
      const current = topicMap.get(a.topicId) || { attempted: 0, correct: 0, lastTime: 0 };
      current.attempted += 1;
      if (a.isCorrect) current.correct += 1;
      if (a.timestamp > current.lastTime) current.lastTime = a.timestamp;
      topicMap.set(a.topicId, current);
    }

    const topicStats: TopicStat[] = ALL_TOPICS_SUMMARY.map((t) => {
      const data = topicMap.get(t.id) || { attempted: 0, correct: 0, lastTime: 0 };
      const accuracy = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;
      return {
        topicId: t.id,
        topicName: t.name,
        category: t.category,
        totalAttempted: data.attempted,
        totalCorrect: data.correct,
        accuracy,
        lastAttempted: data.lastTime || undefined,
      };
    }).sort((a, b) => b.totalAttempted - a.totalAttempted);

    // Weak topics threshold: accuracy < 60% and attempted >= 3
    const attemptedTopicStats = topicStats.filter((t) => t.totalAttempted >= 3);
    const weakTopics = attemptedTopicStats
      .filter((t) => t.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy);

    // Strong topics: accuracy >= 75% and attempted >= 3
    const strongTopics = attemptedTopicStats
      .filter((t) => t.accuracy >= 75)
      .sort((a, b) => b.accuracy - a.accuracy);

    // Group by difficulty
    const diffMap = {
      easy: { attempted: 0, correct: 0 },
      medium: { attempted: 0, correct: 0 },
      hard: { attempted: 0, correct: 0 },
    };

    // Calculate streak from sessions
    const currentStreakDays = this.calculateStreak(sessions);

    return {
      totalAttempted,
      totalCorrect,
      totalIncorrect,
      overallAccuracy,
      totalSessions,
      totalTimeSpentSeconds,
      currentStreakDays,
      bestSessionAccuracy,
      topicStats,
      weakTopics,
      strongTopics,
      difficultyStats: [
        {
          difficulty: "easy",
          totalAttempted: diffMap.easy.attempted,
          totalCorrect: diffMap.easy.correct,
          accuracy: diffMap.easy.attempted > 0 ? Math.round((diffMap.easy.correct / diffMap.easy.attempted) * 100) : 0,
        },
        {
          difficulty: "medium",
          totalAttempted: diffMap.medium.attempted,
          totalCorrect: diffMap.medium.correct,
          accuracy: diffMap.medium.attempted > 0 ? Math.round((diffMap.medium.correct / diffMap.medium.attempted) * 100) : 0,
        },
        {
          difficulty: "hard",
          totalAttempted: diffMap.hard.attempted,
          totalCorrect: diffMap.hard.correct,
          accuracy: diffMap.hard.attempted > 0 ? Math.round((diffMap.hard.correct / diffMap.hard.attempted) * 100) : 0,
        },
      ],
      recentSessions: sessions.slice(0, 10),
    };
  }

  private static calculateStreak(sessions: SessionResult[]): number {
    if (sessions.length === 0) return 0;

    const sessionDates = Array.from(
      new Set(
        sessions.map((s) => {
          const d = new Date(s.timestamp);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        })
      )
    ).sort().reverse();

    if (sessionDates.length === 0) return 0;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    // Streak is active if user practiced today or yesterday
    let activeIndex = 0;
    if (sessionDates[0] === todayStr) {
      activeIndex = 0;
    } else if (sessionDates[0] === yesterdayStr) {
      activeIndex = 0;
    } else {
      return 0; // Streak broken
    }

    let streak = 1;
    let curr = new Date(sessionDates[0]);

    for (let i = 1; i < sessionDates.length; i++) {
      const prevExpected = new Date(curr);
      prevExpected.setDate(prevExpected.getDate() - 1);
      const prevExpectedStr = `${prevExpected.getFullYear()}-${String(prevExpected.getMonth() + 1).padStart(2, "0")}-${String(prevExpected.getDate()).padStart(2, "0")}`;

      if (sessionDates[i] === prevExpectedStr) {
        streak += 1;
        curr = prevExpected;
      } else {
        break;
      }
    }

    return streak;
  }
}
