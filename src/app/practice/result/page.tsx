"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { SessionResult, MCQQuestion } from "@/types/models";
import { AccuracyGauge } from "@/components/practice/AccuracyGauge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { StorageService } from "@/lib/persistence/StorageService";
import { NonVerbalFigureRenderer } from "@/components/visual/NonVerbalFigureRenderer";
import { ASSETS } from "@/lib/assets/manifest";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bookmark,
  Zap,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [session, setSession] = useState<SessionResult | null>(null);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedSession = sessionStorage.getItem("last_session_result");
      const storedQuestions = sessionStorage.getItem("last_session_questions");

      if (storedSession && storedQuestions) {
        const parsedSession = JSON.parse(storedSession) as SessionResult;
        const parsedQuestions = JSON.parse(storedQuestions) as MCQQuestion[];
        setSession(parsedSession);
        setQuestions(parsedQuestions);
      }
    } catch (err) {
      console.error("Failed loading session result", err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        Calculating performance metrics...
      </div>
    );
  }

  if (!session || questions.length === 0) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <h2>No session results found</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
          Please complete a practice session to view analytics.
        </p>
        <Link href="/practice" className="btn btn-primary">
          Go to Practice Arena
        </Link>
      </div>
    );
  }

  const accuracy = session.accuracyPercentage;

  // Performance Band definition per spec §20
  let bandTitle = "Good Attempt!";
  let bandMessage = "Review your incorrect questions below to solidify your reasoning concepts.";
  let bandColor = "var(--color-primary)";

  if (accuracy >= 90) {
    bandTitle = "Outstanding Mastery!";
    bandMessage = "Exceptional speed and precision! You are well-prepared for competitive exam cutoffs.";
    bandColor = "var(--color-success)";
  } else if (accuracy >= 75) {
    bandTitle = "Great Job! Strong Skill.";
    bandMessage = "Solid understanding across topics with only minor gaps. Keep practicing!";
    bandColor = "var(--color-success)";
  } else if (accuracy >= 60) {
    bandTitle = "Good Attempt! Keep Refining.";
    bandMessage = "You have good foundational knowledge. Work on accuracy and speed.";
    bandColor = "var(--color-accent)";
  } else if (accuracy >= 40) {
    bandTitle = "Keep Improving!";
    bandMessage = "Focus on identifying problem archetypes and reviewing worked examples.";
    bandColor = "var(--color-warning)";
  } else {
    bandTitle = "Keep Practicing!";
    bandMessage = "We recommend revisiting concept foundations and practicing easier questions first.";
    bandColor = "var(--color-error)";
  }

  const wrongQuestions = questions.filter((q, idx) => {
    const attempt = session.attempts[idx];
    return attempt && !attempt.isCorrect;
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const handlePracticeWrongQuestions = () => {
    // Stash wrong questions to sessionStorage and launch session
    sessionStorage.setItem("custom_session_pool", JSON.stringify(wrongQuestions));
    router.push(`/practice/session?count=${wrongQuestions.length}&difficulty=mixed`);
  };

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-16)", maxWidth: "920px" }}>
      <Breadcrumb
        items={[
          { label: "Practice Arena", href: "/practice" },
          { label: "Session Results" },
        ]}
      />

      {/* Main Score & Band Summary Card */}
      <div
        className="rm-card"
        style={{
          padding: "clamp(var(--space-6), 4vw, var(--space-8))",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "var(--space-4)",
          }}
        >
          {accuracy >= 75 && (
            <div style={{ marginBottom: "-0.5rem" }}>
              <Image
                src={ASSETS.states.practiceComplete.src}
                alt={ASSETS.states.practiceComplete.alt}
                width={84}
                height={84}
                style={{ display: "block", margin: "0 auto" }}
              />
            </div>
          )}

          <AccuracyGauge percentage={accuracy} size={150} />

          <div>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: bandColor, marginBottom: "var(--space-1)" }}>
              {bandTitle}
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "560px", fontSize: "0.95rem" }}>
              {bandMessage}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "var(--space-3)",
              width: "100%",
              maxWidth: "680px",
              marginTop: "var(--space-2)",
            }}
          >
            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>{session.totalQuestions}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Questions</div>
            </div>

            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-success-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-success-border)" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-success-text)" }}>{session.correctAnswers}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-success-text)" }}>Correct</div>
            </div>

            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-error-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-error-border)" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-error-text)" }}>{session.incorrectAnswers}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-error-text)" }}>Incorrect</div>
            </div>

            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>{formatTime(session.timeTakenSeconds)}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Time Taken</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-3)",
              justifyContent: "center",
              marginTop: "var(--space-4)",
            }}
          >
            {wrongQuestions.length > 0 && (
              <button onClick={handlePracticeWrongQuestions} className="btn btn-primary">
                <RotateCcw size={16} /> Practice Wrong Questions ({wrongQuestions.length})
              </button>
            )}

            <Link href="/practice/configure" className="btn btn-secondary">
              <Zap size={16} /> Practice Again
            </Link>

            <Link href="/stats" className="btn btn-subtle">
              View Analytics & Weak Topics →
            </Link>
          </div>
        </div>
      </div>

      {/* Detailed Per-Question Breakdown */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
          <h2 style={{ fontSize: "1.35rem" }}>Question-by-Question Review</h2>
          <span className="tag" style={{ fontSize: "0.8rem" }}>
            {session.correctAnswers} of {session.totalQuestions} Correct
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {questions.map((q, idx) => {
            const attempt = session.attempts[idx];
            const isCorrect = attempt && attempt.isCorrect;
            const chosen = attempt ? attempt.selectedOptionIndex : -1;
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={q.id || idx}
                className="rm-card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  borderLeft: isCorrect ? "4px solid var(--color-success)" : "4px solid var(--color-error)",
                }}
              >
                {/* Header Row Trigger */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  style={{
                    padding: "var(--space-4) var(--space-5)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "var(--space-3)",
                    backgroundColor: isExpanded ? "var(--bg-subtle)" : "var(--bg-surface)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
                    <div style={{ marginTop: "2px" }}>
                      {isCorrect ? (
                        <CheckCircle2 size={20} color="var(--color-success)" />
                      ) : (
                        <XCircle size={20} color="var(--color-error)" />
                      )}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                          Q{idx + 1}
                        </span>
                        <span className="tag" style={{ textTransform: "capitalize", fontSize: "0.7rem" }}>
                          {q.topicId.replace(/_/g, " ")}
                        </span>
                        <DifficultyBadge difficulty={q.difficulty} size="sm" />
                      </div>

                      <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.45 }}>
                        {q.questionText}
                      </p>
                    </div>
                  </div>

                  <div style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: "var(--space-5)", borderTop: "1px solid var(--border-color)" }}>
                    {/* Non-verbal diagram if applicable */}
                    <NonVerbalFigureRenderer
                      topicId={q.topicId}
                      questionText={q.questionText}
                      isSolution={true}
                    />

                    {/* Options Breakdown */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctIndex;
                        const isThisChosen = chosen === optIdx;

                        let optBg = "var(--bg-surface)";
                        let optBorder = "var(--border-color)";
                        let optColor = "var(--text-primary)";

                        if (isThisCorrect) {
                          optBg = "var(--color-success-bg)";
                          optBorder = "var(--color-success-border)";
                          optColor = "var(--color-success-text)";
                        } else if (isThisChosen && !isThisCorrect) {
                          optBg = "var(--color-error-bg)";
                          optBorder = "var(--color-error-border)";
                          optColor = "var(--color-error-text)";
                        }

                        return (
                          <div
                            key={optIdx}
                            style={{
                              padding: "var(--space-2) var(--space-3)",
                              borderRadius: "var(--radius-sm)",
                              backgroundColor: optBg,
                              border: `1px solid ${optBorder}`,
                              color: optColor,
                              fontSize: "0.9rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 700, marginRight: "8px" }}>
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </div>

                            <div style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                              {isThisCorrect && "✓ Correct Answer"}
                              {isThisChosen && !isThisCorrect && "✕ Your Choice"}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div
                      style={{
                        padding: "var(--space-4)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-subtle)",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      <h5 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--color-primary)", fontWeight: 700, marginBottom: "4px" }}>
                        Detailed Solution:
                      </h5>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {q.explanation}
                      </p>
                    </div>

                    {/* Solution Steps */}
                    {q.solutionSteps && q.solutionSteps.length > 0 && (
                      <div style={{ marginBottom: "var(--space-3)", paddingLeft: "var(--space-2)" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>
                          Step-by-Step Breakdown:
                        </div>
                        {q.solutionSteps.map((step, sIdx) => (
                          <div key={sIdx} style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                            • {step}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Memory Tip */}
                    {q.memoryTip && (
                      <div
                        style={{
                          padding: "var(--space-3)",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--color-accent-subtle)",
                          border: "1px solid var(--color-warning-border)",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "var(--space-2)",
                        }}
                      >
                        <Lightbulb size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontSize: "0.85rem", color: "var(--color-warning-text)" }}>
                          <strong>Memory Shortcut:</strong> {q.memoryTip}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "var(--space-12) 0", textAlign: "center" }}>Loading score report...</div>}>
      <ResultContent />
    </Suspense>
  );
}
