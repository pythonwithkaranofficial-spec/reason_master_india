"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  BookOpen,
  Eye,
  Award,
  Zap,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Search,
  Sparkles,
  Layers,
  RotateCcw,
  Target,
  ShieldCheck,
  Compass,
  FileCheck,
} from "lucide-react";
import { EXAM_CATEGORIES } from "@/data/categories";
import { StorageService, LastStudiedTopic } from "@/lib/persistence/StorageService";
import { TopicProgressSummary } from "@/types/models";
import { StatsEngine, OverallStats } from "@/lib/stats/StatsEngine";
import { useUserSettings } from "@/lib/settings/SettingsProvider";
import { SearchModal } from "@/components/layout/SearchModal";
import { TopicIcon } from "@/components/topics/TopicIcon";
import { ASSETS } from "@/lib/assets/manifest";

const VERBAL_TOPIC_IDS = new Set([
  "alphabet_test",
  "analogy",
  "analytical_reasoning",
  "blood_relations",
  "cause_and_effect",
  "classification",
  "coding_decoding",
  "course_of_action",
  "critical_reasoning",
  "data_sufficiency",
  "direction_sense",
  "inequality",
  "input_output",
  "logical_venn_diagrams",
  "puzzles_box",
  "puzzles_floor",
  "puzzles_scheduling",
  "ranking_order",
  "seating_circular",
  "seating_linear",
  "series_completion",
  "statement_argument",
  "statement_assumption",
  "statement_conclusion",
  "syllogism",
]);

const NON_VERBAL_TOPIC_IDS = new Set([
  "analytical_figure_classification",
  "counting_figures",
  "cubes_and_dice",
  "embedded_figures",
  "figure_completion",
  "grouping_figures",
  "mathematical_operations",
  "mirror_images",
  "missing_character",
  "nonverbal_series",
  "odd_figure_out",
  "paper_cutting",
  "paper_folding",
  "water_images",
]);

// Premier exam pills mapped to categories for instant recognition
const PREMIER_EXAMS_MAP: Record<string, string[]> = {
  ssc: ["CGL", "CHSL", "CPO", "MTS", "GD"],
  banking: ["SBI PO", "IBPS PO", "RBI Gr B", "Clerk"],
  railway: ["RRB NTPC", "RRB ALP", "Group D", "JE"],
  insurance: ["LIC AAO", "NIACL AO", "LIC ADO", "UIIC"],
  defence: ["NDA", "CDS", "AFCAT", "CAPF AC"],
  police: ["Delhi Police SI", "UP Police SI", "Constable"],
  central_govt: ["IB ACIO", "EPFO SSA", "ESIC SSO"],
  state_psc: ["UPSC CSAT", "UPPSC", "BPSC", "MPPSC"],
};

export default function HomePage() {
  const { settings, isLoaded } = useUserSettings();
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [recentSession, setRecentSession] = useState<any | null>(null);
  const [lastStudied, setLastStudied] = useState<LastStudiedTopic | null>(null);
  const [topicSummaries, setTopicSummaries] = useState<TopicProgressSummary[]>([]);
  const [exploredTopicIds, setExploredTopicIds] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const attempts = await StorageService.getAllAttempts();
        const sessions = await StorageService.getAllSessions();
        const lastTopic = StorageService.getLastStudiedTopic();
        const explored = await StorageService.getExploredTopicIds();
        const summaries = await StorageService.getTopicProgressSummaries();

        if (lastTopic) {
          setLastStudied(lastTopic);
        }

        if (explored) {
          setExploredTopicIds(explored);
        }

        if (summaries) {
          setTopicSummaries(summaries);
        }

        if (attempts.length > 0 || sessions.length > 0) {
          const computed = StatsEngine.computeStats(attempts, sessions);
          setStats(computed);
          if (sessions.length > 0) {
            setRecentSession(sessions[0]);
          }
        }
      } catch (err) {
        console.error("Failed loading local dashboard stats", err);
      } finally {
        setMounted(true);
      }
    }
    loadData();
  }, []);

  const verbalExploredCount = exploredTopicIds.filter((id) => VERBAL_TOPIC_IDS.has(id)).length;
  const nonVerbalExploredCount = exploredTopicIds.filter((id) => NON_VERBAL_TOPIC_IDS.has(id)).length;
  const questionCount = isLoaded ? settings.defaultQuestionCount : 10;
  const instantMode = isLoaded && settings.instantFeedback ? "instant" : "review";
  const lastStudiedSummary = lastStudied ? topicSummaries.find((s) => s.topicId === lastStudied.topicId) : null;

  return (
    <div className="container" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
      {/* 1. Hero Section */}
      <section
        className="rm-card"
        style={{
          padding: "clamp(var(--space-6), 4vw, var(--space-10))",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "var(--space-8)",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "0.35rem 0.85rem",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "var(--space-4)",
              }}
            >
              <Sparkles size={15} />
              <span>Curated for Indian Competitive Aspirants</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                marginBottom: "var(--space-4)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Master Reasoning for <span style={{ color: "var(--color-primary)" }}>64+ Indian Exams</span>
            </h1>

            <p
              className="text-lead"
              style={{
                marginBottom: "var(--space-6)",
                fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
              }}
            >
              One unified, highly-structured reasoning curriculum covering SSC, Banking, Railways, Defence,
              Police, and State PSCs. 39 Master Topics • 207 Worked Examples • 859 Practice Questions • 19,500 High-Yield MCQs.
            </p>

            {/* Quick Action Buttons & Search Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-3)",
                alignItems: "center",
              }}
            >
              <Link
                href={`/practice/session?count=${questionCount}&difficulty=mixed&mode=${instantMode}`}
                className="btn btn-primary btn-lg"
              >
                <Zap size={18} /> Quick {questionCount}-Q Practice
              </Link>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="btn btn-secondary btn-lg"
                style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}
              >
                <Search size={18} />
                <span>Search Topics or Exams</span>
                <kbd
                  className="tag"
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.15rem 0.4rem",
                    marginLeft: "0.2rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Ctrl+K
                </kbd>
              </button>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Image
              src={ASSETS.illustrations.studyHero.src}
              alt={ASSETS.illustrations.studyHero.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* 2. "Resume Prep" (Conditional on local activity: last studied topic or recent session) */}
      {mounted && (lastStudied || recentSession) && (
        <section
          className="rm-card"
          style={{
            marginBottom: "var(--space-8)",
            borderLeft: "4px solid var(--color-primary)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-6)",
            alignItems: "center",
          }}
        >
          {/* Last Studied Topic */}
          {lastStudied ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  marginBottom: "var(--space-2)",
                }}
              >
                <RotateCcw size={14} /> Resume Learning
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                <TopicIcon topicId={lastStudied.topicId} category={lastStudied.category} size={20} badgeSize={38} variant="badge" />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "1.15rem", marginBottom: "2px" }}>{lastStudied.topicName}</h3>
                    {lastStudiedSummary && lastStudiedSummary.totalAttempted > 0 && (
                      <span
                        className="badge"
                        style={{
                          fontSize: "0.7rem",
                          backgroundColor:
                            lastStudiedSummary.accuracy >= 75
                              ? "var(--color-success-subtle)"
                              : lastStudiedSummary.accuracy >= 60
                              ? "var(--color-primary-subtle)"
                              : "var(--color-warning-subtle)",
                          color:
                            lastStudiedSummary.accuracy >= 75
                              ? "var(--color-success)"
                              : lastStudiedSummary.accuracy >= 60
                              ? "var(--color-primary)"
                              : "var(--color-warning)",
                          border: `1px solid ${
                            lastStudiedSummary.accuracy >= 75
                              ? "var(--color-success)"
                              : lastStudiedSummary.accuracy >= 60
                              ? "var(--color-primary)"
                              : "var(--color-warning)"
                          }`,
                        }}
                      >
                        {lastStudiedSummary.accuracy}% Acc
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>
                    {lastStudied.category} Reasoning • {lastStudiedSummary && lastStudiedSummary.totalAttempted > 0 ? `${lastStudiedSummary.totalAttempted} / 500 Practiced` : "500 MCQs Pool"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
                <Link
                  href={`/practice/session?topicIds=${lastStudied.topicId}&count=${questionCount}&mode=${instantMode}`}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "0.82rem", minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Zap size={14} /> Practice Topic MCQs
                </Link>
                <Link
                  href={`/topics/${lastStudied.topicId}`}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "0.82rem", minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  Study Concepts <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : null}

          {/* Last Practice Session */}
          {recentSession ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  marginBottom: "var(--space-2)",
                }}
              >
                <Target size={14} /> Last Practice Session
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "var(--space-1)" }}>
                {recentSession.correctAnswers} / {recentSession.totalQuestions} Correct ({recentSession.accuracyPercentage}%)
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "var(--space-3)" }}>
                {new Date(recentSession.timestamp).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })} • Mode: {recentSession.mode === "instant" ? "Instant Feedback" : "Exam Simulation"}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                <Link
                  href={
                    recentSession.topicIds && recentSession.topicIds.length > 0
                      ? `/practice/session?topicIds=${recentSession.topicIds.join(",")}&count=${recentSession.totalQuestions || questionCount}&mode=${recentSession.mode || instantMode}`
                      : `/practice/session?count=${questionCount}&difficulty=mixed&mode=${instantMode}`
                  }
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "0.82rem", minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <RotateCcw size={14} /> Retake Practice
                </Link>
                <Link
                  href="/practice/configure"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "0.82rem", minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  Custom Setup <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      )}

      {/* 3. Performance Teaser OR Diagnostic Prompt */}
      {mounted && stats && stats.totalAttempted > 0 ? (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-8)",
          }}
        >
          {/* Performance Overview (4 Metrics) */}
          <div className="rm-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <h3 style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <TrendingUp size={18} color="var(--color-primary)" /> Performance Snapshot
              </h3>
              <Link
                href="/stats"
                className="tag"
                style={{
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "0.3rem 0.6rem",
                  minHeight: "36px",
                }}
              >
                Full Analytics →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-3)", textAlign: "center" }}>
              <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>{stats.totalAttempted}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Questions Solved</div>
              </div>

              <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-success)" }}>{stats.overallAccuracy}%</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Accuracy</div>
              </div>

              <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-accent)" }}>{stats.currentStreakDays} 🔥</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Day Streak</div>
              </div>

              <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary)" }}>
                  {exploredTopicIds.length} / 39
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Topics Explored</div>
              </div>
            </div>
          </div>

          {/* Smart Focus Areas or Mastery Challenge */}
          {stats.weakTopics.length > 0 ? (
            <div className="rm-card" style={{ borderLeft: "4px solid var(--color-warning)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <AlertTriangle size={18} color="var(--color-warning)" />
                <h3 style={{ fontSize: "1.15rem" }}>Recommended Focus Areas</h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "var(--space-3)" }}>
                You have {stats.weakTopics.length} topic(s) scoring below 60%. Target them to raise your exam cutoff score:
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                {stats.weakTopics.slice(0, 3).map((w) => (
                  <Link
                    key={w.topicId}
                    href={`/practice/session?topicIds=${w.topicId}&count=${questionCount}&mode=${instantMode}`}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "6px", minHeight: "36px" }}
                  >
                    <TopicIcon topicId={w.topicId} size={14} variant="plain" />
                    <span>{w.topicName}</span>
                    <span style={{ color: "var(--color-warning)", fontWeight: 700 }}>({w.accuracy}%)</span>
                  </Link>
                ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                <Link
                  href={`/practice/session?topicIds=${stats.weakTopics.map((w) => w.topicId).join(",")}&count=${questionCount}&mode=${instantMode}`}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "0.82rem", minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Zap size={14} /> 1-Click Weak Areas Workout <ArrowRight size={14} />
                </Link>
                {stats.weakTopics[0] && (
                  <Link
                    href={`/topics/${stats.weakTopics[0].topicId}`}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "0.82rem", minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    Review Theory <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="rm-card" style={{ borderLeft: "4px solid var(--color-success)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <CheckCircle2 size={18} color="var(--color-success)" />
                <h3 style={{ fontSize: "1.15rem" }}>All Attempted Topics Mastered! 🎉</h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "var(--space-3)" }}>
                Every topic you have practiced scores 60% or higher. Challenge yourself with a Hard-difficulty session to test your speed under pressure.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                <Link
                  href={`/practice/session?count=${questionCount}&difficulty=hard&mode=${instantMode}`}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "0.82rem", minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Zap size={14} /> Launch Hard Challenge Mock <ArrowRight size={14} />
                </Link>
                <Link
                  href="/practice/configure"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "0.82rem", minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  Custom Mock Setup
                </Link>
              </div>
            </div>
          )}
        </section>
      ) : mounted ? (
        /* Diagnostic Prompt for Fresh Aspirants (0 attempts) */
        <section
          className="rm-card"
          style={{
            marginBottom: "var(--space-8)",
            borderLeft: "4px solid var(--color-accent)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-accent-subtle)",
                color: "var(--color-accent)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--space-2)",
              }}
            >
              <Award size={14} /> Diagnostic Baseline
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-1)" }}>
              Measure Your Reasoning Baseline Score
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "600px" }}>
              Take a quick 5-minute diagnostic test (10 mixed questions) to reveal your strongest reasoning areas and
              pinpoint topics that need immediate attention.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <Link
              href="/practice/session?count=10&difficulty=mixed&mode=instant"
              className="btn btn-primary"
              style={{ whiteSpace: "nowrap", minHeight: "44px", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <Zap size={16} /> Start 10-Q Diagnostic Quiz <ArrowRight size={16} />
            </Link>
            <Link
              href="/verbal"
              className="btn btn-secondary"
              style={{ whiteSpace: "nowrap", minHeight: "44px", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              Explore Curriculum <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      ) : null}

      {/* 4. Core Reasoning Disciplines Section */}
      <section style={{ marginBottom: "var(--space-12)" }}>
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "var(--space-2)" }}>Core Reasoning Disciplines</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Deep conceptual foundations, shortcuts, step-by-step worked examples, and high-yield question sets.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "var(--space-6)" }}>
          {/* Verbal Reasoning Card */}
          <Link href="/verbal" className="rm-card rm-card-interactive" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--group-verbal-bg)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BookOpen size={26} />
              </div>
              <span className="badge badge-primary">
                {verbalExploredCount > 0 ? `${verbalExploredCount} / 25 Explored` : "25 Topics"}
              </span>
            </div>

            <h3 style={{ fontSize: "1.3rem", marginBottom: "var(--space-2)" }}>Verbal Reasoning</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
              Analogy, Syllogism, Blood Relations, Coding-Decoding, Direction Sense, Seating Puzzles, Critical Logic, and more.
            </p>

            {/* Topic Preview Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "var(--space-4)" }}>
              {["Analogy", "Syllogism", "Blood Relations", "Coding-Decoding", "Seating Puzzles", "Direction Sense", "Critical Logic"].map((chip) => (
                <span
                  key={chip}
                  className="tag"
                  style={{
                    fontSize: "0.75rem",
                    backgroundColor: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem", minHeight: "44px" }}>
              <span>Explore 25 Verbal Topics</span>
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* Non-Verbal Reasoning Card */}
          <Link href="/nonverbal" className="rm-card rm-card-interactive" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--group-nonverbal-bg)",
                  color: "var(--group-nonverbal-text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Eye size={26} />
              </div>
              <span
                className="badge"
                style={{
                  backgroundColor: "var(--group-nonverbal-bg)",
                  color: "var(--group-nonverbal-text)",
                  borderColor: "var(--group-nonverbal-border)",
                }}
              >
                {nonVerbalExploredCount > 0 ? `${nonVerbalExploredCount} / 14 Explored` : "14 Topics"}
              </span>
            </div>

            <h3 style={{ fontSize: "1.3rem", marginBottom: "var(--space-2)" }}>Non-Verbal Reasoning</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
              Non-Verbal Series, Cubes & Dice, Mirror/Water Images, Paper Folding, Counting Figures, Embedded Shapes, and Geometry.
            </p>

            {/* Topic Preview Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "var(--space-4)" }}>
              {["Cubes & Dice", "Mirror Images", "Figure Series", "Paper Folding", "Counting Figures", "Embedded Shapes", "Water Images"].map((chip) => (
                <span
                  key={chip}
                  className="tag"
                  style={{
                    fontSize: "0.75rem",
                    backgroundColor: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem", minHeight: "44px" }}>
              <span>Explore 14 Non-Verbal Topics</span>
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* MCQ Practice Arena Card */}
          <Link href="/practice" className="rm-card rm-card-interactive" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--color-accent-subtle)",
                  color: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={26} />
              </div>
              <span className="badge badge-accent">19,500 MCQs</span>
            </div>

            <h3 style={{ fontSize: "1.3rem", marginBottom: "var(--space-2)" }}>Practice Arena</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
              Custom mock sessions by topic, exam syllabus scope, and difficulty. Instant step-by-step explanations and memory tips.
            </p>

            {/* Features Preview Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "var(--space-4)" }}>
              {["Timed Mock Tests", "Step-by-Step Solutions", "Exam Syllabus Weightage", "Anti-Repetition"].map((chip) => (
                <span
                  key={chip}
                  className="tag"
                  style={{
                    fontSize: "0.75rem",
                    backgroundColor: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-accent)", fontWeight: 600, fontSize: "0.9rem", minHeight: "44px" }}>
              <span>Launch Practice Engine</span>
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Exam Categories Grid */}
      <section style={{ marginBottom: "var(--space-12)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)", flexWrap: "wrap", gap: "var(--space-3)" }}>
          <div>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "var(--space-1)" }}>Target Competitive Exams</h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Syllabus weightages and prioritized reasoning topics for 64 premier Indian examinations.
            </p>
          </div>

          <Link href="/exams" className="btn btn-secondary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", minHeight: "44px" }}>
            <span>View All 64 Exams</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-cards-4">
          {EXAM_CATEGORIES.map((category) => {
            const catAsset = ASSETS.categories[category.id];
            const premierPills = PREMIER_EXAMS_MAP[category.id] || [];

            return (
              <Link
                key={category.id}
                href={`/exams/${category.id}`}
                className="rm-card rm-card-interactive"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                    {catAsset && (
                      <Image
                        src={catAsset.src}
                        alt={catAsset.alt}
                        width={40}
                        height={40}
                        style={{ borderRadius: "var(--radius-sm)" }}
                      />
                    )}
                    <span className="badge badge-primary">{category.examCount} Exams</span>
                  </div>

                  <h4 style={{ fontSize: "1.1rem", marginBottom: "var(--space-1)" }}>{category.name}</h4>
                  
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "var(--space-2)", fontWeight: 500 }}>
                    {category.conductingBodies.join(" • ")}
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: "var(--space-3)" }}>
                    {category.description}
                  </p>

                  {/* Premier Exam Pill Chips */}
                  {premierPills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "var(--space-3)" }}>
                      {premierPills.map((p) => (
                        <span
                          key={p}
                          className="tag"
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.1rem 0.35rem",
                            backgroundColor: "var(--bg-subtle)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "4px", minHeight: "44px" }}>
                  <span>View Exams & Syllabus</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. Why ReasonMaster India Section */}
      <section
        className="rm-card"
        style={{
          padding: "clamp(var(--space-6), 4vw, var(--space-10))",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        <h2 style={{ fontSize: "1.4rem", marginBottom: "var(--space-6)", textAlign: "center" }}>
          Built for High-Yield Competitive Preparation
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", marginBottom: "var(--space-1)" }}>Shared-Topic Architecture</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Master a reasoning concept once thoroughly, and automatically cover its application across all 64 target competitive exams.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", marginBottom: "var(--space-1)" }}>Step-by-Step Solutions & Tips</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Every single question includes clear step-by-step logic, speed shortcuts, and mnemonics (EJOTY, reversal rules) for rapid exam recall.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Compass size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", marginBottom: "var(--space-1)" }}>Priority-Driven Roadmaps</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Each exam maps reasoning topics into High-Priority, Medium-Priority, and Occasional Topics with exact question weightages.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", marginBottom: "var(--space-1)" }}>100% Client-Side Privacy</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Zero tracking, no mandatory logins, and offline-first IndexedDB persistence guaranteeing lightning-fast performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
