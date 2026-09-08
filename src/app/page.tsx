"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  HelpCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { EXAM_CATEGORIES } from "@/data/categories";
import { StorageService } from "@/lib/persistence/StorageService";
import { StatsEngine, OverallStats } from "@/lib/stats/StatsEngine";
import { SearchModal } from "@/components/layout/SearchModal";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import Image from "next/image";
import { ASSETS } from "@/lib/assets/manifest";

export default function HomePage() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [recentSession, setRecentSession] = useState<any | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const attempts = await StorageService.getAllAttempts();
        const sessions = await StorageService.getAllSessions();
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
                padding: "0.3rem 0.8rem",
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
              }}
            >
              One unified, highly-structured reasoning curriculum covering SSC, Banking, Railways, Defence,
              Police, and State PSCs. 39 Master Topics • 207 Worked Examples • 844 Practice Questions • 19,500 High-Yield MCQs.
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
              <Link href="/practice/session?count=10&difficulty=mixed" className="btn btn-primary btn-lg">
                <Zap size={18} /> Quick 10-Q Practice
              </Link>

              <button onClick={() => setIsSearchOpen(true)} className="btn btn-secondary btn-lg">
                <Search size={18} /> Search Topics or Exams
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

      {/* 2. "Continue Where You Left Off" (Conditional on local progress) */}
      {mounted && recentSession && (
        <section
          className="rm-card"
          style={{
            marginBottom: "var(--space-8)",
            borderLeft: "4px solid var(--color-primary)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
                marginBottom: "var(--space-1)",
              }}
            >
              <RotateCcw size={14} /> Continue Practice
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-1)" }}>
              Last Session: {recentSession.correctAnswers} / {recentSession.totalQuestions} Correct ({recentSession.accuracyPercentage}%)
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {new Date(recentSession.timestamp).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })} • Mode: {recentSession.mode}
            </p>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <Link href="/practice/configure" className="btn btn-primary btn-sm">
              New Practice Session <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* 3. Performance & Weak Topics Banner (if stats exist) */}
      {mounted && stats && stats.totalAttempted > 0 && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: stats.weakTopics.length > 0 ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr",
            gap: "var(--space-6)",
            marginBottom: "var(--space-8)",
          }}
        >
          {/* Performance Overview */}
          <div className="rm-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <h3 style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <TrendingUp size={18} color="var(--color-primary)" /> Performance Snapshot
              </h3>
              <Link href="/stats" className="tag" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                Full Analytics →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)", textAlign: "center" }}>
              <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{stats.totalAttempted}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Questions</div>
              </div>

              <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-success)" }}>{stats.overallAccuracy}%</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Accuracy</div>
              </div>

              <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-accent)" }}>{stats.currentStreakDays} 🔥</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Day Streak</div>
              </div>
            </div>
          </div>

          {/* Weak Topics Warning */}
          {stats.weakTopics.length > 0 && (
            <div className="rm-card" style={{ borderLeft: "4px solid var(--color-warning)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <AlertTriangle size={18} color="var(--color-warning)" />
                <h3 style={{ fontSize: "1.15rem" }}>Recommended Focus Areas</h3>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
                You have {stats.weakTopics.length} topic(s) with accuracy below 60%. Target them to boost your score:
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {stats.weakTopics.slice(0, 3).map((w) => (
                  <Link
                    key={w.topicId}
                    href={`/practice/session?topicIds=${w.topicId}&count=10`}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {w.topicName} ({w.accuracy}%)
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Reasoning Hubs Section */}
      <section style={{ marginBottom: "var(--space-12)" }}>
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "var(--space-2)" }}>Core Reasoning Disciplines</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Deep conceptual foundations, shortcuts, step-by-step worked examples, and practice question sets.
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
              <span className="badge badge-primary">25 Topics</span>
            </div>

            <h3 style={{ fontSize: "1.3rem", marginBottom: "var(--space-2)" }}>Verbal Reasoning</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
              Analogy, Syllogism, Blood Relations, Coding-Decoding, Direction Sense, Seating Puzzles, Critical Logic, and more.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem" }}>
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
              <span className="badge" style={{ backgroundColor: "var(--group-nonverbal-bg)", color: "var(--group-nonverbal-text)", borderColor: "var(--group-nonverbal-border)" }}>
                14 Topics
              </span>
            </div>

            <h3 style={{ fontSize: "1.3rem", marginBottom: "var(--space-2)" }}>Non-Verbal Reasoning</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
              Non-Verbal Series, Cubes & Dice, Mirror/Water Images, Paper Folding, Counting Figures, Embedded Shapes, and Geometry.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem" }}>
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
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
              Custom mock sessions by topic, exam scope, and difficulty. Instant step-by-step explanations and memory tips.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-accent)", fontWeight: 600, fontSize: "0.9rem" }}>
              <span>Launch Practice Engine</span>
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Exam Categories Grid */}
      <section style={{ marginBottom: "var(--space-12)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
          <div>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "var(--space-1)" }}>Target Competitive Exams</h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Syllabus weightages and prioritized reasoning topics for 64 premier Indian examinations.
            </p>
          </div>

          <Link href="/exams" className="btn btn-secondary btn-sm" style={{ display: "none" }}>
            View All 64 Exams →
          </Link>
        </div>

        <div className="grid-cards-4">
          {EXAM_CATEGORIES.map((category) => {
            const catAsset = ASSETS.categories[category.id];

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
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "var(--space-2)" }}>{category.name}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: "var(--space-4)" }}>
                    {category.description}
                  </p>
                </div>

                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)" }}>
                  View Exams & Syllabus →
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
          Built for High-Yield Preparation
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <div style={{ color: "var(--color-primary)", flexShrink: 0 }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", marginBottom: "var(--space-1)" }}>Shared-Topic Architecture</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Master a reasoning concept once, apply it to all 64 target exams. No duplicated content or fragmented study.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <div style={{ color: "var(--color-primary)", flexShrink: 0 }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", marginBottom: "var(--space-1)" }}>Step-by-Step Solutions</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Every single question includes clear solution steps, shortcuts, and memory tips for rapid exam recall.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <div style={{ color: "var(--color-primary)", flexShrink: 0 }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", marginBottom: "var(--space-1)" }}>100% Client-Side Privacy</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Zero tracking, no mandatory signups, and local-first persistence ensuring fast offline preparation.
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
