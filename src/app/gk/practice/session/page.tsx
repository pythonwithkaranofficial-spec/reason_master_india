"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GKMCQQuestion, GKSessionResult, GKUserQuestionAttempt } from "@/data/gk/gk-types";
import { GKContentService } from "@/lib/gk/GKContentService";
import { GKStorageService } from "@/lib/gk/GKStorageService";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  Flag,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

function GKPracticeSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "all";
  const stateIdParam = searchParams.get("stateId") || undefined;
  const topicIdParam = searchParams.get("topicId") || undefined;
  const countParam = parseInt(searchParams.get("count") || "20", 10);
  const difficultyParam = (searchParams.get("difficulty") || "mixed") as any;
  const mode = (searchParams.get("mode") || "instant") as "instant" | "review";
  const langParam = (searchParams.get("lang") || "en") as "en" | "hi";

  const [questions, setQuestions] = useState<GKMCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState<"en" | "hi">(langParam);

  // User state: answers, reviewed, bookmarks, timing
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load questions
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const filtered = await GKContentService.getFilteredGKQuestions({
        category: categoryParam as any,
        stateId: stateIdParam,
        topicId: topicIdParam,
        difficulty: difficultyParam,
        limit: countParam,
        shuffle: true,
      });

      setQuestions(filtered);

      // Load bookmarks
      const bookmarks = await GKStorageService.getAllBookmarks();
      setBookmarkedIds(new Set(bookmarks.map((b) => b.questionId)));

      setLoading(false);
    }
    loadData();
  }, [categoryParam, stateIdParam, topicIdParam, difficultyParam, countParam]);

  // Timer
  useEffect(() => {
    if (loading || questions.length === 0 || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, questions.length, isSubmitting]);

  const currentQ = questions[currentIndex];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQ) return;
    if (mode === "instant" && selectedAnswers[currentQ.id] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const toggleBookmark = async () => {
    if (!currentQ) return;
    const isBookmarked = bookmarkedIds.has(currentQ.id);

    if (isBookmarked) {
      await GKStorageService.removeBookmark(currentQ.id);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(currentQ.id);
        return next;
      });
    } else {
      await GKStorageService.addBookmark({
        id: `bm_${currentQ.id}`,
        questionId: currentQ.id,
        topicId: currentQ.topicId,
        subtopicId: currentQ.subtopicId,
        gkCategory: currentQ.gkCategory,
        stateId: currentQ.stateId,
        questionText: currentQ.questionText,
        questionTextHi: currentQ.questionTextHi || (currentQ as any).qHi,
        options: currentQ.options,
        optionsHi: currentQ.optionsHi || (currentQ as any).oHi,
        correctIndex: currentQ.correctIndex,
        difficulty: currentQ.difficulty,
        explanation: currentQ.explanation,
        explanationHi: currentQ.explanationHi || (currentQ as any).expHi,
        hint: currentQ.hint,
        lastVerified: currentQ.lastVerified,
        savedAt: Date.now(),
      });
      setBookmarkedIds((prev) => new Set(prev).add(currentQ.id));
    }
  };

  const toggleReviewMark = () => {
    if (!currentQ) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const attempts: GKUserQuestionAttempt[] = questions.map((q) => {
      const selected = selectedAnswers[q.id];
      const answered = selected !== undefined;
      const isCorrect = answered && selected === q.correctIndex;

      if (!answered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionId: q.id,
        topicId: q.topicId,
        subtopicId: q.subtopicId,
        gkCategory: q.gkCategory,
        stateId: q.stateId,
        selectedOptionIndex: answered ? selected : -1,
        isCorrect,
        timeSpentSeconds: Math.round(timeElapsed / (questions.length || 1)),
        timestamp: Date.now(),
      };
    });

    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    const sessionResult: GKSessionResult = {
      id: `gk_session_${Date.now()}`,
      timestamp: Date.now(),
      gkCategories: [categoryParam === "all" ? "state" : (categoryParam as any)],
      topicIds: Array.from(new Set(questions.map((q) => q.topicId))),
      stateIds: stateIdParam ? [stateIdParam] : [],
      difficulty: difficultyParam,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unanswered: unansweredCount,
      accuracyPercentage: accuracy,
      timeTakenSeconds: timeElapsed,
      mode,
      attempts,
    };

    // Save to isolated GKStorageService
    await GKStorageService.saveSession(sessionResult);

    // Save to sessionStorage for immediate render in results
    if (typeof window !== "undefined") {
      sessionStorage.setItem("current_gk_session", JSON.stringify(sessionResult));
      sessionStorage.setItem("current_gk_questions", JSON.stringify(questions));
    }

    router.push(`/gk/practice/result?sessionId=${sessionResult.id}`);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "var(--space-4)",
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
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Generating your GK practice session...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
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
        <AlertCircle size={40} style={{ color: "var(--color-accent)", margin: "0 auto var(--space-3)" }} />
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
          No Questions Found for Selected Filter
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
          We could not find questions matching your exact filter criteria. Try relaxing your difficulty or domain filters.
        </p>
        <button
          type="button"
          onClick={() => router.push("/gk/practice/configure")}
          className="btn btn-primary"
          style={{ margin: "0 auto" }}
        >
          Change Test Settings
        </button>
      </div>
    );
  }

  const selectedIdx = currentQ ? selectedAnswers[currentQ.id] : undefined;
  const isAnswered = selectedIdx !== undefined;
  const isBookmarked = currentQ ? bookmarkedIds.has(currentQ.id) : false;
  const isMarkedReview = currentQ ? markedForReview.has(currentQ.id) : false;

  const currentQuestionTextHi =
    (currentQ as any)?.questionTextHi || (currentQ as any)?.qHi || (currentQ as any)?.question_hi;
  const currentQuestionText =
    lang === "hi" && currentQuestionTextHi ? currentQuestionTextHi : currentQ?.questionText;

  const currentOptionsHi =
    (currentQ as any)?.optionsHi || (currentQ as any)?.oHi || (currentQ as any)?.options_hi;
  const currentOptions =
    lang === "hi" && Array.isArray(currentOptionsHi) && currentOptionsHi.length === 4
      ? currentOptionsHi
      : currentQ?.options || [];

  const currentExplanationHi =
    (currentQ as any)?.explanationHi || (currentQ as any)?.expHi;
  const currentExplanation =
    lang === "hi" && currentExplanationHi ? currentExplanationHi : currentQ?.explanation;

  return (
    <div style={{ paddingBottom: "var(--space-12)" }}>
      {/* 1. Top Control Bar */}
      <section
        style={{
          backgroundColor: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-color)",
          padding: "var(--space-3) 0",
          position: "sticky",
          top: "var(--nav-height, 68px)",
          zIndex: 30,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          {/* Left: Title & Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)" }}>
              Q {currentIndex + 1} <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>of {questions.length}</span>
            </span>

            <span
              className="tag"
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: mode === "instant" ? "rgba(16, 185, 129, 0.1)" : "rgba(99, 102, 241, 0.1)",
                color: mode === "instant" ? "#059669" : "#4f46e5",
              }}
            >
              {mode === "instant" ? "Instant Feedback" : "Exam Mode"}
            </span>
          </div>

          {/* Right: Language Switcher, Timer & Submit */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
            {/* Language Switcher */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px",
                backgroundColor: "var(--bg-surface-elevated, #f1f5f9)",
                borderRadius: "9999px",
                border: "1px solid var(--border-color)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setLang("en");
                  GKStorageService.saveSettings({ quizLanguage: "en" });
                }}
                style={{
                  padding: "3px 10px",
                  fontSize: "0.78rem",
                  fontWeight: lang === "en" ? 700 : 500,
                  borderRadius: "9999px",
                  backgroundColor: lang === "en" ? "var(--color-primary)" : "transparent",
                  color: lang === "en" ? "#ffffff" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => {
                  setLang("hi");
                  GKStorageService.saveSettings({ quizLanguage: "hi" });
                }}
                style={{
                  padding: "3px 10px",
                  fontSize: "0.78rem",
                  fontWeight: lang === "hi" ? 700 : 500,
                  borderRadius: "9999px",
                  backgroundColor: lang === "hi" ? "var(--color-primary)" : "transparent",
                  color: lang === "hi" ? "#ffffff" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
              >
                हिन्दी
              </button>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              <Clock size={16} />
              <span>{formatTime(timeElapsed)}</span>
            </div>

            <button
              type="button"
              onClick={handleSubmitTest}
              className="btn btn-primary btn-sm"
              style={{ padding: "0.45rem 1rem", fontWeight: 700 }}
            >
              {currentIndex === questions.length - 1 ? "Finish Test" : "Submit Test"}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Question Area */}
      <style>{`
        .gk-session-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
          align-items: start;
        }
        @media (min-width: 960px) {
          .gk-session-layout {
            grid-template-columns: 1fr minmax(260px, 320px);
          }
        }
      `}</style>
      <div
        className="container gk-session-layout"
        style={{
          paddingTop: "var(--space-6)",
        }}
      >
        {/* Left Column: Question Card */}
        <div>
          <div
            className="rm-card"
            style={{
              padding: "var(--space-6)",
              borderRadius: "var(--radius-xl)",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            {/* Header: Meta tags, bookmark, mark for review */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-4)",
                flexWrap: "wrap",
                gap: "var(--space-2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <DifficultyBadge difficulty={currentQ.difficulty} />
                {currentQ.lastVerified && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "#059669",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      padding: "2px 6px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <ShieldCheck size={12} />
                    Verified {currentQ.lastVerified}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                {mode === "review" && (
                  <button
                    type="button"
                    onClick={toggleReviewMark}
                    className="btn btn-ghost btn-sm"
                    style={{
                      padding: "4px 8px",
                      color: isMarkedReview ? "var(--color-accent)" : "var(--text-muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.78rem",
                    }}
                  >
                    <Flag size={15} />
                    <span>{isMarkedReview ? "Marked" : "Mark Review"}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleBookmark}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: "4px 8px",
                    color: isBookmarked ? "var(--color-primary)" : "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.78rem",
                  }}
                  title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                >
                  {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h3
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.5,
                marginBottom: "var(--space-6)",
              }}
            >
              {currentQuestionText}
            </h3>

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {currentOptions.map((option, optIdx) => {
                const isSelected = selectedIdx === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;

                let border = "1px solid var(--border-color)";
                let background = "var(--bg-surface-elevated, var(--bg-surface))";
                let textColor = "var(--text-primary)";
                let icon = null;

                if (mode === "instant" && isAnswered) {
                  if (isCorrect) {
                    border = "1.5px solid var(--color-success, #10b981)";
                    background = "rgba(16, 185, 129, 0.12)";
                    textColor = "var(--color-success, #10b981)";
                    icon = <CheckCircle2 size={18} style={{ color: "var(--color-success, #10b981)" }} />;
                  } else if (isSelected) {
                    border = "1.5px solid var(--color-error, #ef4444)";
                    background = "rgba(239, 68, 68, 0.12)";
                    textColor = "var(--color-error, #ef4444)";
                    icon = <XCircle size={18} style={{ color: "var(--color-error, #ef4444)" }} />;
                  }
                } else if (isSelected) {
                  border = "2px solid var(--color-primary)";
                  background = "var(--color-primary-subtle)";
                  textColor = "var(--color-primary)";
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={mode === "instant" && isAnswered}
                    onClick={() => handleSelectOption(optIdx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1.15rem",
                      borderRadius: "var(--radius-md)",
                      border,
                      backgroundColor: background,
                      color: textColor,
                      fontSize: "0.95rem",
                      textAlign: "left",
                      cursor: mode === "instant" && isAnswered ? "default" : "pointer",
                      transition: "all var(--transition-fast)",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          backgroundColor:
                            isSelected || (mode === "instant" && isAnswered && isCorrect)
                              ? "currentColor"
                              : "var(--border-color)",
                          color:
                            isSelected || (mode === "instant" && isAnswered && isCorrect)
                              ? "#ffffff"
                              : "var(--text-secondary)",
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Instant Mode: Explanation Banner */}
            {mode === "instant" && isAnswered && (
              <div
                style={{
                  marginTop: "var(--space-6)",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-primary-subtle)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color:
                        selectedIdx === currentQ.correctIndex
                          ? "var(--color-success, #10b981)"
                          : "var(--color-error, #ef4444)",
                    }}
                  >
                    {selectedIdx === currentQ.correctIndex ? "Correct Answer!" : "Incorrect Answer"}
                  </span>
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.55 }}>
                  <strong>{lang === "hi" ? "व्याख्या:" : "Explanation:"}</strong>{" "}
                  {currentExplanation}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "var(--space-6)",
                paddingTop: "var(--space-4)",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="btn btn-secondary"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="btn btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="btn btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  Submit &amp; View Results <CheckCircle2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <div>
          <div
            className="rm-card"
            style={{
              padding: "var(--space-5)",
              borderRadius: "var(--radius-xl)",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              position: "sticky",
              top: "calc(var(--nav-height, 68px) + 60px)",
            }}
          >
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>
              Question Palette
            </h4>

            {/* Palette Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "8px",
                marginBottom: "var(--space-4)",
              }}
            >
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnsweredQ = selectedAnswers[q.id] !== undefined;
                const isMarked = markedForReview.has(q.id);

                let bg = "var(--bg-surface-elevated, var(--bg-surface))";
                let color = "var(--text-secondary)";
                let border = "1px solid var(--border-color)";

                if (isCurrent) {
                  border = "2px solid var(--color-primary)";
                  bg = "var(--color-primary-subtle)";
                  color = "var(--color-primary)";
                } else if (isMarked) {
                  bg = "rgba(245, 158, 11, 0.15)";
                  color = "#d97706";
                  border = "1px solid #d97706";
                } else if (isAnsweredQ) {
                  bg = "rgba(16, 185, 129, 0.15)";
                  color = "#059669";
                  border = "1px solid #059669";
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      height: "36px",
                      borderRadius: "var(--radius-sm)",
                      border,
                      backgroundColor: bg,
                      color,
                      fontWeight: isCurrent || isAnsweredQ ? 700 : 500,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Palette Legend */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "var(--space-3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "rgba(16, 185, 129, 0.3)", border: "1px solid #059669" }} />
                <span>Answered ({Object.keys(selectedAnswers).length})</span>
              </div>
              {mode === "review" && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "rgba(245, 158, 11, 0.3)", border: "1px solid #d97706" }} />
                  <span>Marked for Review ({markedForReview.size})</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-color)" }} />
                <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GKPracticeSessionPage() {
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
      <GKPracticeSessionContent />
    </Suspense>
  );
}
