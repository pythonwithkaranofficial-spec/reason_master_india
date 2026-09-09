"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GKSessionResult, GKMCQQuestion } from "@/data/gk/gk-types";
import { GKStorageService } from "@/lib/gk/GKStorageService";
import { GKContentService } from "@/lib/gk/GKContentService";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sliders,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";

function GKPracticeResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [session, setSession] = useState<GKSessionResult | null>(null);
  const [questions, setQuestions] = useState<GKMCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "incorrect" | "unanswered">("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadSession() {
      setLoading(true);

      // 1. Try reading from sessionStorage
      let foundSession: GKSessionResult | null = null;
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("current_gk_session");
        if (stored) {
          try {
            foundSession = JSON.parse(stored);
          } catch {
            // ignore
          }
        }
      }

      // 2. Fallback to IndexedDB
      if (!foundSession && sessionId) {
        const all = await GKStorageService.getAllSessions();
        foundSession = all.find((s) => s.id === sessionId) || null;
      }

      setSession(foundSession);

      // 3. Load question content
      if (foundSession) {
        let questionData: GKMCQQuestion[] = [];
        if (typeof window !== "undefined") {
          const storedQuestions = sessionStorage.getItem("current_gk_questions");
          if (storedQuestions) {
            try {
              questionData = JSON.parse(storedQuestions);
            } catch {
              // ignore
            }
          }
        }

        if (questionData.length === 0) {
          const allQs = await GKContentService.getAllGKQuestions();
          const qMap = new Map(allQs.map((q) => [q.id, q]));
          questionData = foundSession.attempts
            .map((att) => qMap.get(att.questionId))
            .filter(Boolean) as GKMCQQuestion[];
        }

        setQuestions(questionData);
      }

      // 4. Load bookmarks
      const bookmarks = await GKStorageService.getAllBookmarks();
      setBookmarkedIds(new Set(bookmarks.map((b) => b.questionId)));

      setLoading(false);
    }

    loadSession();
  }, [sessionId]);

  const toggleBookmark = async (q: GKMCQQuestion) => {
    const isBookmarked = bookmarkedIds.has(q.id);
    if (isBookmarked) {
      await GKStorageService.removeBookmark(q.id);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(q.id);
        return next;
      });
    } else {
      await GKStorageService.addBookmark({
        id: `bm_${q.id}`,
        questionId: q.id,
        topicId: q.topicId,
        subtopicId: q.subtopicId,
        gkCategory: q.gkCategory,
        stateId: q.stateId,
        questionText: q.questionText,
        options: q.options,
        correctIndex: q.correctIndex,
        difficulty: q.difficulty,
        explanation: q.explanation,
        hint: q.hint,
        lastVerified: q.lastVerified,
        savedAt: Date.now(),
      });
      setBookmarkedIds((prev) => new Set(prev).add(q.id));
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "4px solid var(--border-color)",
            borderTopColor: "var(--color-primary)",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className="container"
        style={{
          maxWidth: "600px",
          margin: "var(--space-12) auto",
          padding: "var(--space-8)",
          textAlign: "center",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
          Session Not Found
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
          We could not locate this test result. It may have expired or been taken in another browser session.
        </p>
        <Link href="/gk/practice" className="btn btn-primary">
          Back to GK Practice Arena
        </Link>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Build review items
  const attemptMap = new Map(session.attempts.map((att) => [att.questionId, att]));

  const reviewItems = questions.map((q, idx) => {
    const attempt = attemptMap.get(q.id);
    const selectedIdx = attempt ? attempt.selectedOptionIndex : -1;
    const isAnswered = selectedIdx !== -1;
    const isCorrect = isAnswered && selectedIdx === q.correctIndex;

    return {
      q,
      idx: idx + 1,
      selectedIdx,
      isAnswered,
      isCorrect,
    };
  });

  const filteredReviewItems = reviewItems.filter((item) => {
    if (reviewFilter === "correct") return item.isCorrect;
    if (reviewFilter === "incorrect") return item.isAnswered && !item.isCorrect;
    if (reviewFilter === "unanswered") return !item.isAnswered;
    return true;
  });

  // Performance tier
  let badgeColor = "var(--color-primary)";
  let feedbackText = "Good effort! Practice more to master these topics.";
  if (session.accuracyPercentage >= 80) {
    badgeColor = "#10b981";
    feedbackText = "Outstanding Performance! You have strong mastery over these GK facts.";
  } else if (session.accuracyPercentage >= 60) {
    badgeColor = "#d97706";
    feedbackText = "Good Job! Review the incorrect questions below to solidify concepts.";
  }

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
              { label: "Practice Arena", href: "/gk/practice" },
              { label: "Test Result" },
            ]}
          />

          <div style={{ marginTop: "var(--space-4)" }}>
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
              Practice Test Scorecard
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
              Detailed performance metrics, answer key breakdown, and explanations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "var(--space-8) var(--space-4) 0" }}>
        {/* Scorecard Hero Box */}
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-8) var(--space-6)",
            marginBottom: "var(--space-8)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "var(--color-primary-subtle)",
              color: badgeColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Award size={32} />
          </div>

          <div>
            <div style={{ fontSize: "2.8rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
              {session.correctAnswers} <span style={{ fontSize: "1.5rem", color: "var(--text-muted)", fontWeight: 500 }}>/ {session.totalQuestions}</span>
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: badgeColor, marginTop: "var(--space-2)" }}>
              {session.accuracyPercentage}% Accuracy
            </div>
          </div>

          <p style={{ maxWidth: "550px", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {feedbackText}
          </p>

          {/* Quick Metrics Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "var(--space-3)",
              width: "100%",
              maxWidth: "600px",
              marginTop: "var(--space-2)",
            }}
          >
            <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#059669" }}>{session.correctAnswers}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Correct</div>
            </div>

            <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#dc2626" }}>{session.incorrectAnswers}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Incorrect</div>
            </div>

            <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-secondary)" }}>{session.unanswered}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Unanswered</div>
            </div>

            <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-primary-subtle)", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-primary)" }}>{formatTime(session.timeTakenSeconds)}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Time Taken</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
            <Link
              href="/gk/practice/configure"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Sliders size={16} /> Configure New Test
            </Link>
            <Link
              href="/gk/stats"
              className="btn btn-secondary"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <TrendingUp size={16} /> View GK Diagnostics
            </Link>
          </div>
        </div>

        {/* Detailed Question Review Section */}
        <section>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
              marginBottom: "var(--space-5)",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Question-by-Question Review
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Examine explanations and save tough questions to bookmarks
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setReviewFilter("all")}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: reviewFilter === "all" ? 600 : 500,
                  backgroundColor: reviewFilter === "all" ? "var(--color-primary)" : "var(--color-primary-subtle)",
                  color: reviewFilter === "all" ? "#ffffff" : "var(--text-secondary)",
                  border: reviewFilter === "all" ? "1px solid var(--color-primary)" : "1px solid var(--border-color)",
                  cursor: "pointer",
                }}
              >
                All ({reviewItems.length})
              </button>

              <button
                type="button"
                onClick={() => setReviewFilter("correct")}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: reviewFilter === "correct" ? 600 : 500,
                  backgroundColor: reviewFilter === "correct" ? "#10b981" : "rgba(16, 185, 129, 0.1)",
                  color: reviewFilter === "correct" ? "#ffffff" : "#059669",
                  border: reviewFilter === "correct" ? "1px solid #10b981" : "1px solid rgba(16, 185, 129, 0.2)",
                  cursor: "pointer",
                }}
              >
                Correct ({session.correctAnswers})
              </button>

              <button
                type="button"
                onClick={() => setReviewFilter("incorrect")}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: reviewFilter === "incorrect" ? 600 : 500,
                  backgroundColor: reviewFilter === "incorrect" ? "#ef4444" : "rgba(239, 68, 68, 0.1)",
                  color: reviewFilter === "incorrect" ? "#ffffff" : "#dc2626",
                  border: reviewFilter === "incorrect" ? "1px solid #ef4444" : "1px solid rgba(239, 68, 68, 0.2)",
                  cursor: "pointer",
                }}
              >
                Incorrect ({session.incorrectAnswers})
              </button>
            </div>
          </div>

          {/* Review Cards List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {filteredReviewItems.map(({ q, idx, selectedIdx, isAnswered, isCorrect }) => {
              const isBookmarked = bookmarkedIds.has(q.id);

              return (
                <div
                  key={q.id}
                  className="rm-card"
                  style={{
                    padding: "var(--space-5)",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {/* Item Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        Question {idx}
                      </span>

                      {isCorrect ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#059669",
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          <CheckCircle2 size={13} /> Correct
                        </span>
                      ) : isAnswered ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#dc2626",
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          <XCircle size={13} /> Incorrect
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "var(--text-muted)",
                            backgroundColor: "var(--bg-surface-elevated)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          Unanswered
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(q)}
                      className="btn btn-ghost btn-sm"
                      style={{
                        padding: "3px 8px",
                        fontSize: "0.78rem",
                        color: isBookmarked ? "var(--color-primary)" : "var(--text-muted)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      <span>{isBookmarked ? "Saved" : "Save"}</span>
                    </button>
                  </div>

                  {/* Question Text */}
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.45,
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    {q.questionText}
                  </h3>

                  {/* Options Comparison */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "var(--space-3)" }}>
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedIdx === optIdx;
                      const isOptionCorrect = optIdx === q.correctIndex;

                      let border = "1px solid var(--border-color)";
                      let bg = "var(--bg-surface-elevated, var(--bg-surface))";
                      let color = "var(--text-secondary)";

                      if (isOptionCorrect) {
                        border = "1.5px solid #10b981";
                        bg = "rgba(16, 185, 129, 0.1)";
                        color = "#059669";
                      } else if (isOptionSelected) {
                        border = "1.5px solid #ef4444";
                        bg = "rgba(239, 68, 68, 0.1)";
                        color = "#dc2626";
                      }

                      return (
                        <div
                          key={optIdx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.55rem 0.85rem",
                            borderRadius: "var(--radius-md)",
                            border,
                            backgroundColor: bg,
                            color,
                            fontSize: "0.88rem",
                            fontWeight: isOptionCorrect || isOptionSelected ? 600 : 400,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 700, width: "20px" }}>{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>

                          {isOptionCorrect && (
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669" }}>
                              Correct Option
                            </span>
                          )}
                          {isOptionSelected && !isOptionCorrect && (
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#dc2626" }}>
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Note */}
                  <div
                    style={{
                      backgroundColor: "var(--color-primary-subtle)",
                      padding: "var(--space-3) var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.85rem",
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function GKPracticeResultPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid var(--border-color)",
              borderTopColor: "var(--color-primary)",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      }
    >
      <GKPracticeResultContent />
    </Suspense>
  );
}
