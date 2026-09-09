"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GKStatsEngine, GKOverallStats } from "@/lib/gk/GKStatsEngine";
import { GKStorageService } from "@/lib/gk/GKStorageService";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Zap,
  MapPin,
  Landmark,
  Globe,
  RotateCcw,
} from "lucide-react";

export default function GKStatsPage() {
  const [stats, setStats] = useState<GKOverallStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGKStats() {
      setLoading(true);
      const [attempts, sessions] = await Promise.all([
        GKStorageService.getAllAttempts(),
        GKStorageService.getAllSessions(),
      ]);

      const computed = GKStatsEngine.computeStats(attempts, sessions);
      setStats(computed);
      setLoading(false);
    }

    loadGKStats();
  }, []);

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div style={{ paddingBottom: "var(--space-12)" }}>
      {/* Header Banner */}
      <section
        style={{
          padding: "var(--space-6) 0 var(--space-6)",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 var(--space-4)" }}>
          <Breadcrumb
            items={[
              { label: "GK Hub", href: "/gk" },
              { label: "GK Diagnostic Statistics" },
            ]}
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#059669",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                padding: "3px 10px",
                borderRadius: "9999px",
                marginBottom: "var(--space-2)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <TrendingUp size={13} />
              <span>Performance Analytics</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "var(--space-2)",
              }}
            >
              GK Diagnostic Dashboard
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Isolated performance analytics for General Knowledge. Track accuracy by pillar, review weak topics, and optimize your study plan.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "var(--space-8) var(--space-4) 0" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vh",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "3px solid var(--border-color)",
                borderTopColor: "var(--color-primary)",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        ) : !stats || stats.totalAttempted === 0 ? (
          <div
            style={{
              padding: "var(--space-12)",
              textAlign: "center",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px dashed var(--border-color)",
              color: "var(--text-muted)",
            }}
          >
            <Target size={44} style={{ color: "var(--color-primary)", margin: "0 auto var(--space-3)" }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
              No GK Practice Activity Recorded Yet
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "var(--space-6)", maxWidth: "480px", margin: "0 auto var(--space-6)" }}>
              Take your first GK mock test or practice drill to generate diagnostic insights and topic accuracy breakdowns.
            </p>
            <Link href="/gk/practice" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Start a GK Practice Test <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
            {/* 1. Top Metrics Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              <div
                className="rm-card"
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Overall Accuracy</span>
                  <Award size={18} style={{ color: stats.overallAccuracy >= 70 ? "#10b981" : "var(--color-primary)" }} />
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: stats.overallAccuracy >= 70 ? "#059669" : "var(--text-primary)" }}>
                  {stats.overallAccuracy}%
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  {stats.totalCorrect} of {stats.totalAttempted} correct
                </div>
              </div>

              <div
                className="rm-card"
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Total Questions</span>
                  <Target size={18} style={{ color: "var(--color-primary)" }} />
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {stats.totalAttempted}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Across all GK categories
                </div>
              </div>

              <div
                className="rm-card"
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Tests Completed</span>
                  <CheckCircle2 size={18} style={{ color: "#10b981" }} />
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {stats.totalSessions}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Mock sessions recorded
                </div>
              </div>

              <div
                className="rm-card"
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Study Time</span>
                  <Clock size={18} style={{ color: "var(--color-accent)" }} />
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {formatTime(stats.totalTimeSeconds)}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Active practice time
                </div>
              </div>
            </div>

            {/* 2. Category Accuracy Breakdown */}
            <div
              className="rm-card"
              style={{
                padding: "var(--space-6)",
                borderRadius: "var(--radius-xl)",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-5)" }}>
                Accuracy by GK Pillar
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {[
                  {
                    name: "State GK (36 States & UTs)",
                    icon: MapPin,
                    color: "#d97706",
                    data: stats.categoryBreakdown.state,
                  },
                  {
                    name: "Indian GK (11 Topics)",
                    icon: Landmark,
                    color: "#059669",
                    data: stats.categoryBreakdown.national,
                  },
                  {
                    name: "World GK (6 Topics)",
                    icon: Globe,
                    color: "#4f46e5",
                    data: stats.categoryBreakdown.world,
                  },
                ].map((pillar) => {
                  const Icon = pillar.icon;
                  const attempted = pillar.data.attempted;
                  const accuracy = pillar.data.accuracy;

                  return (
                    <div key={pillar.name}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Icon size={16} style={{ color: pillar.color }} />
                          <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                            {pillar.name}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: pillar.color }}>
                          {attempted > 0 ? `${accuracy}% (${pillar.data.correct}/${attempted})` : "No attempts"}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div
                        style={{
                          height: "8px",
                          width: "100%",
                          borderRadius: "9999px",
                          backgroundColor: "var(--bg-surface-elevated)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${accuracy}%`,
                            borderRadius: "9999px",
                            backgroundColor: pillar.color,
                            transition: "width 500ms ease-out",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Weak Topics & Improvement Areas */}
            {stats.weakTopics.length > 0 && (
              <div
                className="rm-card"
                style={{
                  padding: "var(--space-6)",
                  borderRadius: "var(--radius-xl)",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "var(--space-4)" }}>
                  <AlertTriangle size={20} style={{ color: "#ef4444" }} />
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    Targeted Weak Areas (Accuracy &lt; 60%)
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "var(--space-3)",
                  }}
                >
                  {stats.weakTopics.map((wt) => (
                    <div
                      key={wt.topicId}
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                          {wt.topicName}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {wt.attempted} attempted • {wt.accuracy}% accuracy
                        </div>
                      </div>

                      <Link
                        href={wt.gkCategory === "state" ? `/gk/state/${wt.topicId}` : `/gk/topics/${wt.topicId}`}
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.8rem" }}
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Recent Test History */}
            {stats.recentSessions.length > 0 && (
              <div
                className="rm-card"
                style={{
                  padding: "var(--space-6)",
                  borderRadius: "var(--radius-xl)",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                  Recent GK Practice Sessions
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {stats.recentSessions.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-surface-elevated)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "var(--space-2)",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                          {new Date(s.timestamp).toLocaleDateString()} • {s.totalQuestions} Questions ({s.mode} mode)
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {s.correctAnswers} Correct • {s.incorrectAnswers} Incorrect • {Math.round(s.timeTakenSeconds / 60)}m duration
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: "1rem",
                            color: s.accuracyPercentage >= 70 ? "#059669" : "var(--color-primary)",
                          }}
                        >
                          {s.accuracyPercentage}%
                        </span>

                        <Link
                          href={`/gk/practice/result?sessionId=${s.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: "0.78rem", padding: "3px 10px" }}
                        >
                          Scorecard
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
