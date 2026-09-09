"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, BookOpen, Eye, Award, Sliders, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ALL_TOPICS_SUMMARY } from "@/data/topics-index";
import { EXAM_CATEGORIES } from "@/data/categories";
import { TopicIcon } from "@/components/topics/TopicIcon";
import { StorageService } from "@/lib/persistence/StorageService";
import { StatsEngine, OverallStats } from "@/lib/stats/StatsEngine";
import { useUserSettings } from "@/lib/settings/SettingsProvider";

export default function PracticeHubPage() {
  const { settings, isLoaded } = useUserSettings();
  const [stats, setStats] = useState<OverallStats | null>(null);

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
        console.error("Failed to load stats", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-12)" }}>
      <Breadcrumb items={[{ label: "Practice Arena" }]} />

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
          <div style={{ maxWidth: "720px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-accent-subtle)",
                color: "var(--color-accent)",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "var(--space-3)",
              }}
            >
              <Zap size={14} /> 19,500 Question MCQ Bank
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "var(--space-2)" }}>
              Reasoning Practice Arena
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
              Sharpen your speed and accuracy with timed mock sessions, difficulty distribution (25% Easy / 50% Medium / 25% Hard),
              and comprehensive step-by-step explanations for every question.
            </p>
          </div>

          <Link href="/practice/configure" className="btn btn-primary btn-lg">
            <Sliders size={18} /> Custom Session Wizard
          </Link>
        </div>
      </div>

      {/* Weak Topics Alert if any */}
      {stats && stats.weakTopics.length > 0 && (
        <div
          className="rm-card"
          style={{
            marginBottom: "var(--space-8)",
            borderLeft: "4px solid var(--color-warning)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
              <AlertTriangle size={18} color="var(--color-warning)" />
              <h3 style={{ fontSize: "1.15rem" }}>Targeted Weak Topic Strengthening</h3>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
              You have {stats.weakTopics.length} topic(s) with accuracy below 60%. Practice them specifically to increase your cutoff chances.
            </p>
          </div>

          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {stats.weakTopics.slice(0, 2).map((w) => (
              <Link
                key={w.topicId}
                href={`/practice/session?topicIds=${w.topicId}&count=${isLoaded ? settings.defaultQuestionCount : 10}&mode=${isLoaded && settings.instantFeedback ? "instant" : "review"}`}
                className="btn btn-secondary btn-sm"
              >
                Practice {w.topicName} ({w.accuracy}%)
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Launch Cards */}
      <div style={{ marginBottom: "var(--space-10)" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "var(--space-4)" }}>Quick Practice Presets</h2>

        <div className="grid-cards">
          {/* Dynamic Default Sprint */}
          <Link
            href={`/practice/session?count=${isLoaded ? settings.defaultQuestionCount : 10}&difficulty=mixed&mode=${isLoaded && settings.instantFeedback ? "instant" : "review"}`}
            className="rm-card rm-card-interactive"
            style={{ textDecoration: "none", border: "1.5px solid var(--color-primary)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
              <span className="badge badge-accent">★ Your Default ({isLoaded ? settings.defaultQuestionCount : 10} Qs)</span>
              <span className="tag" style={{ fontSize: "0.75rem" }}>~{Math.round((isLoaded ? settings.defaultQuestionCount : 10) * 0.75)} Mins</span>
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
              Custom Default Sprint
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
              Fast mixed test matching your {isLoaded ? settings.defaultQuestionCount : 10}-question practice preference from Settings.
            </p>
            <div style={{ color: "var(--color-accent)", fontWeight: 600, fontSize: "0.88rem" }}>
              Start {isLoaded ? settings.defaultQuestionCount : 10}-Q Sprint →
            </div>
          </Link>

          {/* Verbal 20 */}
          <Link
            href="/practice/session?category=verbal&count=20&difficulty=mixed"
            className="rm-card rm-card-interactive"
            style={{ textDecoration: "none" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
              <span className="badge badge-primary">20 Questions</span>
              <span className="tag" style={{ fontSize: "0.75rem" }}>~15 Mins</span>
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
              Verbal Mastery Test
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
              20 questions drawn from Coding, Syllogism, Blood Relations, Directions, and Puzzles.
            </p>
            <div style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.88rem" }}>
              Start Verbal Test →
            </div>
          </Link>

          {/* Non-Verbal 20 */}
          <Link
            href="/practice/session?category=nonverbal&count=20&difficulty=mixed"
            className="rm-card rm-card-interactive"
            style={{ textDecoration: "none" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
              <span className="badge" style={{ backgroundColor: "var(--group-nonverbal-bg)", color: "var(--group-nonverbal-text)" }}>
                20 Questions
              </span>
              <span className="tag" style={{ fontSize: "0.75rem" }}>~15 Mins</span>
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
              Spatial & Visual Test
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
              20 non-verbal questions covering Series, Cubes & Dice, Reflections, and Figure Counting.
            </p>
            <div style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.88rem" }}>
              Start Spatial Test →
            </div>
          </Link>
        </div>
      </div>

      {/* Practice by Topic Picker */}
      <div style={{ marginBottom: "var(--space-10)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", marginBottom: "var(--space-1)" }}>Practice Specific Topics</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Each topic contains a dedicated 500-question high-yield bank.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {ALL_TOPICS_SUMMARY.map((topic) => (
            <Link
              key={topic.id}
              href={`/practice/session?topicIds=${topic.id}&count=${isLoaded ? settings.defaultQuestionCount : 20}&difficulty=mixed&mode=${isLoaded && settings.instantFeedback ? "instant" : "review"}`}
              className="rm-card rm-card-interactive"
              style={{
                padding: "var(--space-3) var(--space-4)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", minWidth: 0 }}>
                <TopicIcon topicId={topic.id} category={topic.category} size={16} badgeSize={34} variant="badge" />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.92rem",
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {topic.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {topic.category === "verbal" ? "Verbal" : "Non-Verbal"} • 500 MCQs
                  </div>
                </div>
              </div>

              <span style={{ color: "var(--color-primary)", flexShrink: 0 }}>
                <Zap size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Practice by Exam Target */}
      <div>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "var(--space-4)" }}>Practice by Exam Target</h2>

        <div className="grid-cards-4">
          {EXAM_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/exams/${category.id}`}
              className="rm-card rm-card-interactive"
              style={{ textDecoration: "none", padding: "var(--space-4)" }}
            >
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "var(--space-1)", color: "var(--text-primary)" }}>
                {category.name}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "var(--space-3)" }}>
                {category.examCount} Exam Syllabi
              </p>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)" }}>
                Pick Exam to Practice →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
