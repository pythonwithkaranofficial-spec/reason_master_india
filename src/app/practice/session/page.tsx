"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MCQQuestion, UserQuestionAttempt, SessionResult, BookmarkItem } from "@/types/models";
import { ContentService } from "@/lib/content/ContentService";
import { StorageService } from "@/lib/persistence/StorageService";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/SkeletonLoader";
import { NonVerbalFigureRenderer } from "@/components/visual/NonVerbalFigureRenderer";
import {
  Clock,
  Bookmark,
  X,
  Check,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useUserSettings } from "@/lib/settings/SettingsProvider";

function SessionRunner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings, isLoaded } = useUserSettings();

  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<number, number>>({});
  const [timePerQuestion, setTimePerQuestion] = useState<Record<number, number>>({});
  const [isHintRevealed, setIsHintRevealed] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Configuration
  const countParam = searchParams.get("count");
  const count = countParam ? parseInt(countParam, 10) : settings.defaultQuestionCount;
  const difficulty = (searchParams.get("difficulty") as any) || "mixed";
  const modeParam = searchParams.get("mode");
  const mode = (modeParam as "instant" | "review") || (settings.instantFeedback ? "instant" : "review");
  const category = searchParams.get("category");
  const topicIdsParam = searchParams.get("topicIds") || "";
  const topicIds = topicIdsParam ? topicIdsParam.split(",") : undefined;
  const examId = searchParams.get("examId") || undefined;

  // Load questions
  useEffect(() => {
    async function initSession() {
      try {
        setLoading(true);
        // Get recent questions to avoid immediate repetition
        const recentIds = await StorageService.getRecentQuestionIds(200);

        let finalTopicIds = topicIds;
        if (!finalTopicIds && category === "verbal") {
          finalTopicIds = ContentService.getVerbalTopics().map((t) => t.id);
        } else if (!finalTopicIds && category === "nonverbal") {
          finalTopicIds = ContentService.getNonVerbalTopics().map((t) => t.id);
        }

        const loadedQuestions = await ContentService.getQuestionsForSession({
          topicIds: finalTopicIds,
          examId,
          difficulty,
          count,
          excludeQuestionIds: recentIds,
        });

        if (loadedQuestions.length === 0) {
          // Fallback if no questions met criteria
          const fallback = await ContentService.getQuestionsForSession({ count });
          setQuestions(fallback);
        } else {
          setQuestions(loadedQuestions);
        }

        setQuestionStartTimes({ 0: Date.now() });
      } catch (err) {
        console.error("Failed to load session questions", err);
      } finally {
        setLoading(false);
      }
    }
    initSession();
  }, [category, difficulty, count, examId, topicIdsParam]);

  // Timer stopwatch
  useEffect(() => {
    if (loading || questions.length === 0) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, questions]);

  // Sync bookmark status on question change
  useEffect(() => {
    if (questions[currentIndex]) {
      setIsHintRevealed(false);
      StorageService.isBookmarked(questions[currentIndex].id).then(setIsBookmarked);
    }
  }, [currentIndex, questions]);

  const currentQ = questions[currentIndex];
  const selectedOpt = selectedAnswers[currentIndex];
  const isAnswered = selectedOpt !== undefined;

  const handleSelectOption = (optIdx: number) => {
    if (mode === "instant" && isAnswered) return; // Disallow changing answer in instant mode

    const now = Date.now();
    const startTime = questionStartTimes[currentIndex] || now;
    const elapsedOnThisQ = Math.round((now - startTime) / 1000);

    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
    setTimePerQuestion((prev) => ({ ...prev, [currentIndex]: elapsedOnThisQ }));
  };

  const handleToggleBookmark = async () => {
    if (!currentQ) return;
    if (isBookmarked) {
      await StorageService.removeBookmark(currentQ.id);
      setIsBookmarked(false);
    } else {
      const item: BookmarkItem = {
        id: `bm_${currentQ.id}`,
        questionId: currentQ.id,
        topicId: currentQ.topicId,
        subtopicId: currentQ.subtopicId,
        questionText: currentQ.questionText,
        options: currentQ.options,
        correctIndex: currentQ.correctIndex,
        difficulty: currentQ.difficulty,
        explanation: currentQ.explanation,
        hint: currentQ.hint,
        solutionSteps: currentQ.solutionSteps,
        memoryTip: currentQ.memoryTip,
        savedAt: Date.now(),
      };
      await StorageService.saveBookmark(item);
      setIsBookmarked(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (!questionStartTimes[nextIdx]) {
        setQuestionStartTimes((prev) => ({ ...prev, [nextIdx]: Date.now() }));
      }
    } else {
      handleFinishSession();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinishSession = async () => {
    // Compile session results
    const attempts: UserQuestionAttempt[] = questions.map((q, idx) => {
      const chosen = selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1;
      const isCorrect = chosen === q.correctIndex;
      return {
        questionId: q.id,
        topicId: q.topicId,
        subtopicId: q.subtopicId,
        selectedOptionIndex: chosen,
        isCorrect,
        timeSpentSeconds: timePerQuestion[idx] || 10,
        timestamp: Date.now(),
      };
    });

    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const answeredCount = attempts.filter((a) => a.selectedOptionIndex !== -1).length;
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sessionResult: SessionResult = {
      id: sessionId,
      timestamp: Date.now(),
      topicIds: Array.from(new Set(questions.map((q) => q.topicId))),
      examId,
      difficulty,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: answeredCount - correctCount,
      unanswered: questions.length - answeredCount,
      accuracyPercentage: accuracy,
      timeTakenSeconds: secondsElapsed,
      mode,
      attempts,
    };

    // Save to IndexedDB
    await StorageService.saveSession(sessionResult);

    // Save to sessionStorage for fast result rendering
    sessionStorage.setItem("last_session_result", JSON.stringify(sessionResult));
    sessionStorage.setItem("last_session_questions", JSON.stringify(questions));

    router.push(`/practice/result?sessionId=${sessionId}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitConfirm || loading) return;

      if (e.key === "1" || e.key.toLowerCase() === "a") {
        handleSelectOption(0);
      } else if (e.key === "2" || e.key.toLowerCase() === "b") {
        handleSelectOption(1);
      } else if (e.key === "3" || e.key.toLowerCase() === "c") {
        handleSelectOption(2);
      } else if (e.key === "4" || e.key.toLowerCase() === "d") {
        handleSelectOption(3);
      } else if (e.key === "h" || e.key === "H") {
        setIsHintRevealed((prev) => !prev);
      } else if (e.key === "ArrowRight" || (e.key === "Enter" && isAnswered)) {
        if (mode === "instant" && isAnswered) {
          handleNext();
        } else if (mode === "review") {
          handleNext();
        }
      } else if (e.key === "ArrowLeft" && mode === "review") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showExitConfirm, loading, isAnswered, mode, currentIndex, questions]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (loading || !currentQ) {
    return (
      <div className="container" style={{ paddingTop: "var(--space-12)", maxWidth: "800px" }}>
        <div className="rm-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Skeleton height="32px" width="40%" />
          <Skeleton height="20px" width="90%" count={3} />
          <Skeleton height="50px" count={4} borderRadius="var(--radius-md)" />
        </div>
      </div>
    );
  }

  const isCorrectAnswer = isAnswered && selectedOpt === currentQ.correctIndex;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-page)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Session Action Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          backgroundColor: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-color)",
          padding: "var(--space-3) var(--space-4)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "900px",
          }}
        >
          {/* Exit Button */}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="btn btn-subtle btn-sm"
            style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}
            aria-label="Exit Session"
          >
            <X size={16} /> Exit
          </button>

          {/* Progress Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Timer & Bookmark */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1)",
                padding: "0.25rem 0.6rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-subtle)",
                fontSize: "0.85rem",
                fontWeight: 600,
                fontFamily: "var(--font-poppins), monospace",
              }}
            >
              <Clock size={14} color="var(--color-primary)" />
              <span>{formatTimer(secondsElapsed)}</span>
            </div>

            <button
              onClick={handleToggleBookmark}
              className="btn btn-secondary btn-sm"
              style={{
                padding: "0.3rem 0.5rem",
                color: isBookmarked ? "var(--color-accent)" : "var(--text-muted)",
              }}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
            >
              <Bookmark size={16} fill={isBookmarked ? "var(--color-accent)" : "none"} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Track Bar */}
      <div style={{ width: "100%", height: "4px", backgroundColor: "var(--bg-subtle)" }}>
        <div
          style={{
            height: "100%",
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            backgroundColor: "var(--color-primary)",
            transition: "width 0.2s ease-out",
          }}
        />
      </div>

      {/* Main Question Card Container */}
      <div
        className="container"
        style={{
          maxWidth: "900px",
          paddingTop: "var(--space-6)",
          paddingBottom: "var(--space-16)",
          flex: 1,
        }}
      >
        <div
          className="rm-card"
          style={{
            padding: "clamp(var(--space-5), 4vw, var(--space-8))",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          {/* Header row: Topic tag & Difficulty */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-4)",
            }}
          >
            <span className="tag" style={{ textTransform: "capitalize", fontSize: "0.75rem" }}>
              {currentQ.topicId.replace(/_/g, " ")}
            </span>

            <DifficultyBadge difficulty={currentQ.difficulty} />
          </div>

          {/* Question Text */}
          <h2
            className="question-text"
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.6,
              marginBottom: "var(--space-4)",
            }}
          >
            {currentQ.questionText}
          </h2>

          {/* Visual Non-Verbal Geometric Figure */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <NonVerbalFigureRenderer
              topicId={currentQ.topicId}
              questionText={currentQ.questionText}
              figureData={currentQ.figureData}
              figureRef={currentQ.figureRef}
              isSolution={mode === "instant" && isAnswered}
            />
          </div>

          {/* 4 Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOpt === optIdx;
              const isCorrect = optIdx === currentQ.correctIndex;

              let optionStyle: React.CSSProperties = {
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border-color)",
                backgroundColor: "var(--bg-surface)",
                cursor: mode === "instant" && isAnswered ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "1rem",
                transition: "all var(--transition-fast)",
              };

              if (mode === "instant" && isAnswered) {
                if (isCorrect) {
                  optionStyle.backgroundColor = "var(--color-success-bg)";
                  optionStyle.borderColor = "var(--color-success)";
                  optionStyle.color = "var(--color-success-text)";
                } else if (isSelected && !isCorrect) {
                  optionStyle.backgroundColor = "var(--color-error-bg)";
                  optionStyle.borderColor = "var(--color-error)";
                  optionStyle.color = "var(--color-error-text)";
                }
              } else if (isSelected) {
                optionStyle.borderColor = "var(--color-primary)";
                optionStyle.backgroundColor = "var(--color-primary-subtle)";
              }

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  style={optionStyle}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "var(--radius-full)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        backgroundColor:
                          mode === "instant" && isAnswered && isCorrect
                            ? "var(--color-success)"
                            : isSelected
                            ? "var(--color-primary)"
                            : "var(--bg-subtle)",
                        color:
                          (mode === "instant" && isAnswered && isCorrect) || isSelected
                            ? "#ffffff"
                            : "var(--text-secondary)",
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="option-text">{opt}</span>
                  </div>

                  {mode === "instant" && isAnswered && (
                    <div>
                      {isCorrect && <Check size={20} color="var(--color-success)" />}
                      {isSelected && !isCorrect && <X size={20} color="var(--color-error)" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hint Toggle */}
          {currentQ.hint && (
            <div style={{ marginBottom: "var(--space-4)" }}>
              <button
                onClick={() => setIsHintRevealed((prev) => !prev)}
                className="btn btn-subtle btn-sm"
                style={{ fontSize: "0.82rem" }}
              >
                <HelpCircle size={14} /> {isHintRevealed ? "Hide Hint" : "Need a Hint? (Press H)"}
              </button>

              {isHintRevealed && (
                <div
                  style={{
                    marginTop: "var(--space-2)",
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-info-bg)",
                    border: "1px solid var(--color-info-border)",
                    color: "var(--color-info-text)",
                    fontSize: "0.88rem",
                  }}
                >
                  <strong>Hint:</strong> {currentQ.hint}
                </div>
              )}
            </div>
          )}

          {/* Instant Feedback Explanation Area */}
          {mode === "instant" && isAnswered && (
            <div
              style={{
                marginTop: "var(--space-6)",
                padding: "var(--space-5)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: isCorrectAnswer ? "var(--color-success-bg)" : "var(--color-error-bg)",
                border: isCorrectAnswer ? "1px solid var(--color-success-border)" : "1px solid var(--color-error-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                {isCorrectAnswer ? (
                  <CheckCircle2 size={20} color="var(--color-success)" />
                ) : (
                  <AlertCircle size={20} color="var(--color-error)" />
                )}
                <h4 style={{ fontSize: "1.05rem", color: isCorrectAnswer ? "var(--color-success-text)" : "var(--color-error-text)" }}>
                  {isCorrectAnswer ? "Correct Answer!" : `Incorrect. The correct answer is Option ${String.fromCharCode(65 + currentQ.correctIndex)}.`}
                </h4>
              </div>

              {/* Explanation Text */}
              <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.6, marginBottom: "var(--space-3)" }}>
                {currentQ.explanation}
              </p>

              {/* Solution Steps if available */}
              {currentQ.solutionSteps && currentQ.solutionSteps.length > 0 && (
                <div style={{ marginBottom: "var(--space-3)", paddingLeft: "var(--space-2)" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>
                    Solution Steps:
                  </div>
                  {currentQ.solutionSteps.map((s, idx) => (
                    <div key={idx} style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      • {s}
                    </div>
                  ))}
                </div>
              )}

              {/* Memory Tip if available */}
              {currentQ.memoryTip && (
                <div
                  style={{
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-2)",
                  }}
                >
                  <Lightbulb size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                    <strong>Exam Tip:</strong> {currentQ.memoryTip}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: mode === "review" ? "space-between" : "flex-end",
            alignItems: "center",
            marginTop: "var(--space-6)",
          }}
        >
          {mode === "review" && (
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="btn btn-secondary btn-lg"
              style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
            >
              <ArrowLeft size={18} /> Previous
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={mode === "instant" && !isAnswered}
            className="btn btn-primary btn-lg"
            style={{
              opacity: mode === "instant" && !isAnswered ? 0.5 : 1,
              padding: "0.85rem 2rem",
            }}
          >
            {currentIndex === questions.length - 1 ? (
              <>
                <Check size={18} /> Complete & View Results
              </>
            ) : (
              <>
                Next Question <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Exit Practice Session?"
        message="Your current session progress will not be saved if you exit now. Are you sure you want to return to the practice hub?"
        confirmLabel="Exit Session"
        cancelLabel="Continue Practicing"
        isDestructive={true}
        onConfirm={() => router.push("/practice")}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "var(--space-12) 0", textAlign: "center" }}>Initializing test engine...</div>}>
      <SessionRunner />
    </Suspense>
  );
}
