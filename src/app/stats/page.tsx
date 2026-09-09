"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StorageService } from "@/lib/persistence/StorageService";
import { StatsEngine, OverallStats } from "@/lib/stats/StatsEngine";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { ASSETS } from "@/lib/assets/manifest";
import { TopicIcon } from "@/components/topics/TopicIcon";
import {
  BarChart2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  RotateCcw,
  Target,
  Flame,
} from "lucide-react";
import { useUserSettings } from "@/lib/settings/SettingsProvider";

export default function StatsPage() {
  const { settings, isLoaded } = useUserSettings();
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const attempts = await StorageService.getAllAttempts();
        const sessions = await StorageService.getAllSessions();
        if (attempts.length > 0 || sessions.length > 0) {
          const computed = StatsEngine.computeStats(attempts, sessions);
          setStats(computed);
        }
      } catch (err) {
        console.error("Failed to calculate stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const formatTotalTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-16)", maxWidth: "1000px" }}>
      <Breadcrumb items={[{ label: "Performance & Statistics" }]} />

      {/* Header Banner */}
      <div
        className="rm-card"
        style={{
          padding: "var(--space-8)",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "var(--space-3)",
              }}
            >
              <BarChart2 size={14} /> Local Diagnostic Analytics
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "var(--space-2)" }}>
              Performance & Weak Topics
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              Actionable insights based on your practice sessions. Identify high-priority weaknesses to maximize your exam cutoff scores.
            </p>
          </div>

          <Link href="/practice/configure" className="btn btn-primary btn-lg">
            <Zap size={18} /> New Practice Test
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-12) 0" }}>Loading performance data...</div>
      ) : !stats || stats.totalAttempted === 0 ? (
        <EmptyState
          asset={ASSETS.states.emptyHistory}
          icon={BarChart2}
          title="No Practice Attempts Recorded Yet"
          description="Take a practice test or answer questions to generate your diagnostic profile, accuracy curves, and weak topic alerts."
          actionText={isLoaded ? `Take a ${settings.defaultQuestionCount}-Question Test` : "Take a Practice Test"}
          actionHref={`/practice/session?count=${isLoaded ? settings.defaultQuestionCount : 10}&difficulty=mixed&mode=${isLoaded && settings.instantFeedback ? "instant" : "review"}`}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          {/* 1. Core KPIs Overview */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {/* Total Attempted */}
            <div className="rm-card" style={{ padding: "var(--space-5)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "var(--space-1)" }}>
                Total Questions
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {stats.totalAttempted}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                {stats.totalCorrect} Correct • {stats.totalIncorrect} Wrong
              </div>
            </div>

            {/* Overall Accuracy */}
            <div className="rm-card" style={{ padding: "var(--space-5)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "var(--space-1)" }}>
                Overall Accuracy
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: stats.overallAccuracy >= 75 ? "var(--color-success)" : stats.overallAccuracy >= 50 ? "var(--color-warning)" : "var(--color-error)",
                }}
              >
                {stats.overallAccuracy}%
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Best Test: {stats.bestSessionAccuracy}%
              </div>
            </div>

            {/* Daily Streak */}
            <div className="rm-card" style={{ padding: "var(--space-5)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "var(--space-1)" }}>
                Active Streak
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent)" }}>
                {stats.currentStreakDays} <span style={{ fontSize: "1.4rem" }}>🔥</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Consecutive Study Days
              </div>
            </div>

            {/* Tests & Practice Time */}
            <div className="rm-card" style={{ padding: "var(--space-5)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "var(--space-1)" }}>
                Tests Completed
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-primary)" }}>
                {stats.totalSessions}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Time: {formatTotalTime(stats.totalTimeSpentSeconds)}
              </div>
            </div>
          </div>

          {/* 2. Weak Topics Action Box */}
          {stats.weakTopics.length > 0 && (
            <section className="rm-card" style={{ borderLeft: "4px solid var(--color-warning)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <AlertTriangle size={20} color="var(--color-warning)" />
                <h2 style={{ fontSize: "1.25rem" }}>
                  Identified Weak Topics (&lt;60% Accuracy)
                </h2>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "var(--space-5)" }}>
                Targeting these topics is the highest ROI strategy to push your competitive reasoning percentile higher:
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "var(--space-4)",
                }}
              >
                {stats.weakTopics.map((w) => (
                  <div
                    key={w.topicId}
                    style={{
                      padding: "var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-subtle)",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)", gap: "var(--space-2)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", minWidth: 0 }}>
                          <TopicIcon topicId={w.topicId} size={15} badgeSize={28} variant="badge" />
                          <h4 style={{ fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.3, wordBreak: "break-word" }}>
                            {w.topicName}
                          </h4>
                        </div>
                        <span className="badge badge-hard" style={{ flexShrink: 0 }}>{w.accuracy}%</span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>
                        {w.totalCorrect} of {w.totalAttempted} answered correctly
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <Link
                        href={`/topics/${w.topicId}`}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, fontSize: "0.8rem" }}
                      >
                        Read Rules
                      </Link>
                      <Link
                        href={`/practice/session?topicIds=${w.topicId}&count=${isLoaded ? settings.defaultQuestionCount : 10}&mode=${isLoaded && settings.instantFeedback ? "instant" : "review"}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, fontSize: "0.8rem" }}
                      >
                        Strengthen
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Per-Topic Accuracy Breakdown (Meters) */}
          <section className="rm-card">
            <h2 style={{ fontSize: "1.3rem", marginBottom: "var(--space-4)" }}>
              Topic Accuracy Distribution ({stats.topicStats.filter((t) => t.totalAttempted > 0).length} Topics Attempted)
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {stats.topicStats
                .filter((t) => t.totalAttempted > 0)
                .map((topic) => {
                  let barColor = "var(--color-primary)";
                  if (topic.accuracy >= 75) barColor = "var(--color-success)";
                  else if (topic.accuracy < 60) barColor = "var(--color-error)";
                  else barColor = "var(--color-accent)";

                  return (
                    <div key={topic.topicId}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", fontSize: "0.9rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0 }}>
                          <TopicIcon topicId={topic.topicId} category={topic.category} size={14} badgeSize={26} variant="badge" />
                          <Link href={`/topics/${topic.topicId}`} style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            {topic.topicName}
                          </Link>
                          <span className="tag" style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem", flexShrink: 0 }}>
                            {topic.category === "verbal" ? "Verbal" : "Non-Verbal"}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "0.85rem" }}>
                          <span style={{ color: "var(--text-muted)" }}>
                            {topic.totalCorrect}/{topic.totalAttempted} Qs
                          </span>
                          <span style={{ fontWeight: 700, color: barColor, minWidth: "40px", textAlign: "right" }}>
                            {topic.accuracy}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Track (Solid fill, no gradients) */}
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          borderRadius: "var(--radius-full)",
                          backgroundColor: "var(--bg-subtle)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${topic.accuracy}%`,
                            height: "100%",
                            backgroundColor: barColor,
                            transition: "width 0.5s ease-out",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* 4. Recent Session History Table */}
          {stats.recentSessions.length > 0 && (
            <section className="rm-card">
              <h2 style={{ fontSize: "1.3rem", marginBottom: "var(--space-4)" }}>
                Recent Practice Tests
              </h2>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>
                      <th style={{ padding: "var(--space-3) var(--space-2)" }}>Date</th>
                      <th style={{ padding: "var(--space-3) var(--space-2)" }}>Score</th>
                      <th style={{ padding: "var(--space-3) var(--space-2)" }}>Accuracy</th>
                      <th style={{ padding: "var(--space-3) var(--space-2)" }}>Time</th>
                      <th style={{ padding: "var(--space-3) var(--space-2)" }}>Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentSessions.map((sess) => (
                      <tr key={sess.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "var(--space-3) var(--space-2)", color: "var(--text-secondary)" }}>
                          {new Date(sess.timestamp).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td style={{ padding: "var(--space-3) var(--space-2)", fontWeight: 600 }}>
                          {sess.correctAnswers} / {sess.totalQuestions}
                        </td>
                        <td style={{ padding: "var(--space-3) var(--space-2)" }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: sess.accuracyPercentage >= 75 ? "var(--color-success-bg)" : "var(--color-warning-bg)",
                              color: sess.accuracyPercentage >= 75 ? "var(--color-success-text)" : "var(--color-warning-text)",
                            }}
                          >
                            {sess.accuracyPercentage}%
                          </span>
                        </td>
                        <td style={{ padding: "var(--space-3) var(--space-2)", color: "var(--text-muted)" }}>
                          {Math.floor(sess.timeTakenSeconds / 60)}m {sess.timeTakenSeconds % 60}s
                        </td>
                        <td style={{ padding: "var(--space-3) var(--space-2)", textTransform: "capitalize", color: "var(--text-secondary)" }}>
                          {sess.mode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
