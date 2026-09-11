"use client";

import React, { useState, useEffect } from "react";
import { GKPracticeQuestion } from "@/data/gk/gk-types";
import { GKStorageService } from "@/lib/gk/GKStorageService";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

interface GKPracticeQuestionViewerProps {
  questions: GKPracticeQuestion[];
  topicId: string;
  topicName: string;
  category: "state" | "national" | "world";
}

export function GKPracticeQuestionViewer({
  questions,
  topicId,
  topicName,
  category,
}: GKPracticeQuestionViewerProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    // Load existing bookmarks & user language setting
    async function loadBookmarks() {
      const bookmarks = await GKStorageService.getAllBookmarks();
      setBookmarkedIds(new Set(bookmarks.map((b) => b.questionId)));
      const settings = GKStorageService.getSettings();
      if (settings.quizLanguage) {
        setLang(settings.quizLanguage);
      }
    }
    loadBookmarks();
  }, []);

  const handleLanguageChange = (newLang: "en" | "hi") => {
    setLang(newLang);
    GKStorageService.saveSettings({ quizLanguage: newLang });
  };

  const handleSelectOption = async (q: GKPracticeQuestion, optionIndex: number) => {
    if (selectedAnswers[q.id] !== undefined) return; // already answered

    setSelectedAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));

    const isCorrect = optionIndex === q.correctIndex;

    // Save attempt to isolated GKStorageService
    await GKStorageService.saveAttempt({
      questionId: q.id,
      topicId: topicId,
      subtopicId: `${topicId}_core`,
      gkCategory: category,
      stateId: category === "state" ? topicId : undefined,
      selectedOptionIndex: optionIndex,
      isCorrect,
      timeSpentSeconds: 15,
      timestamp: Date.now(),
    });
  };

  const toggleBookmark = async (q: GKPracticeQuestion) => {
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
        topicId: topicId,
        subtopicId: `${topicId}_core`,
        gkCategory: category,
        stateId: category === "state" ? topicId : undefined,
        questionText: q.questionText,
        questionTextHi: q.questionTextHi || (q as any).qHi,
        options: q.options,
        optionsHi: q.optionsHi || (q as any).oHi,
        correctIndex: q.correctIndex,
        difficulty: q.difficulty,
        explanation: q.explanation,
        explanationHi: q.explanationHi || (q as any).expHi,
        hint: q.hint,
        lastVerified: q.lastVerified,
        savedAt: Date.now(),
      });
      setBookmarkedIds((prev) => new Set(prev).add(q.id));
    }
  };

  const toggleHint = (questionId: string) => {
    setShowHints((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleReset = (questionId: string) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  if (!questions || questions.length === 0) {
    return (
      <div
        style={{
          padding: "var(--space-8)",
          textAlign: "center",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px dashed var(--border-color)",
          color: "var(--text-muted)",
        }}
      >
        Practice questions for this section are coming soon!
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Bilingual Selector & Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "var(--space-3) var(--space-4)",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-secondary)" }}>
          {questions.length} Practice Questions
        </span>

        {/* Language Switcher Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px",
            backgroundColor: "var(--bg-surface-elevated, #f1f5f9)",
            borderRadius: "9999px",
            border: "1px solid var(--border-color)",
          }}
        >
          <button
            type="button"
            onClick={() => handleLanguageChange("en")}
            style={{
              padding: "4px 12px",
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
            onClick={() => handleLanguageChange("hi")}
            style={{
              padding: "4px 12px",
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
      </div>

      {questions.map((q, idx) => {
        const selectedIdx = selectedAnswers[q.id];
        const isAnswered = selectedIdx !== undefined;
        const isBookmarked = bookmarkedIds.has(q.id);
        const isHintOpen = !!showHints[q.id];

        const currentQText =
          lang === "hi"
            ? (q.questionTextHi || (q as any).qHi || (q as any).question_hi || q.questionText)
            : q.questionText;
        const currentOptions: string[] =
          lang === "hi" && (((q.optionsHi && q.optionsHi.length === 4) || ((q as any).oHi && (q as any).oHi.length === 4)))
            ? ((q.optionsHi || (q as any).oHi) as string[])
            : q.options;
        const currentExp =
          lang === "hi"
            ? (q.explanationHi || (q as any).expHi || (q as any).explanation_hi || q.explanation)
            : q.explanation;
        const currentHint =
          lang === "hi"
            ? (q.hintHi || (q as any).hint_hi || q.hint)
            : q.hint;

        return (
          <div
            key={q.id}
            className="rm-card"
            style={{
              padding: "var(--space-5)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--bg-surface)",
              border: isAnswered
                ? selectedIdx === q.correctIndex
                  ? "1.5px solid var(--color-success-border, #10b981)"
                  : "1.5px solid var(--color-error-border, #ef4444)"
                : "1px solid var(--border-color)",
              transition: "border-color var(--transition-fast)",
            }}
          >
            {/* Question Header: Number, Difficulty, Verification, Bookmark */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-3)",
                flexWrap: "wrap",
                gap: "var(--space-2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Q{idx + 1} of {questions.length}
                </span>

                <DifficultyBadge difficulty={q.difficulty} />

                {q.lastVerified && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "#059669",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      padding: "1px 6px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <ShieldCheck size={11} />
                    Verified {q.lastVerified}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                {currentHint && !isAnswered && (
                  <button
                    type="button"
                    onClick={() => toggleHint(q.id)}
                    className="btn btn-ghost btn-sm"
                    style={{
                      fontSize: "0.78rem",
                      padding: "3px 8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color: isHintOpen ? "var(--color-accent)" : "var(--text-muted)",
                    }}
                  >
                    <Lightbulb size={13} />
                    {isHintOpen ? "Hide Hint" : "Hint"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toggleBookmark(q)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: "4px 8px",
                    color: isBookmarked ? "var(--color-primary)" : "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.78rem",
                  }}
                  title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
                  aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
                >
                  {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>

            {/* Hint Callout */}
            {isHintOpen && !isAnswered && currentHint && (
              <div
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.25)",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-4)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <Lightbulb size={16} style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Hint:</strong> {currentHint}
                </div>
              </div>
            )}

            {/* Question Text */}
            <p
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.5,
                marginBottom: "var(--space-4)",
              }}
            >
              {currentQText}
            </p>

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {currentOptions.map((option, optIdx) => {
                const isSelected = selectedIdx === optIdx;
                const isCorrect = optIdx === q.correctIndex;

                let border = "1px solid var(--border-color)";
                let background = "var(--bg-surface-elevated, var(--bg-surface))";
                let textColor = "var(--text-primary)";
                let icon = null;

                if (isAnswered) {
                  if (isCorrect) {
                    border = "1.5px solid var(--color-success, #10b981)";
                    background = "rgba(16, 185, 129, 0.12)";
                    textColor = "var(--color-success, #10b981)";
                    icon = <CheckCircle2 size={16} style={{ color: "var(--color-success, #10b981)" }} />;
                  } else if (isSelected) {
                    border = "1.5px solid var(--color-error, #ef4444)";
                    background = "rgba(239, 68, 68, 0.12)";
                    textColor = "var(--color-error, #ef4444)";
                    icon = <XCircle size={16} style={{ color: "var(--color-error, #ef4444)" }} />;
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(q, optIdx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-md)",
                      border,
                      backgroundColor: background,
                      color: textColor,
                      fontSize: "0.92rem",
                      textAlign: "left",
                      cursor: isAnswered ? "default" : "pointer",
                      transition: "all var(--transition-fast)",
                      fontWeight: isSelected || (isAnswered && isCorrect) ? 600 : 400,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          backgroundColor:
                            isSelected || (isAnswered && isCorrect)
                              ? "currentColor"
                              : "var(--border-color)",
                          color:
                            isSelected || (isAnswered && isCorrect)
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

            {/* Explanation & Retry Footer */}
            {isAnswered && (
              <div
                style={{
                  marginTop: "var(--space-4)",
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
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color:
                        selectedIdx === q.correctIndex
                          ? "var(--color-success, #10b981)"
                          : "var(--color-error, #ef4444)",
                    }}
                  >
                    {selectedIdx === q.correctIndex ? "Correct Answer!" : "Incorrect Answer"}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleReset(q.id)}
                    className="btn btn-ghost btn-sm"
                    style={{
                      fontSize: "0.78rem",
                      padding: "2px 8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <RotateCcw size={12} />
                    Try Again
                  </button>
                </div>

                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong>{lang === "hi" ? "व्याख्या:" : "Explanation:"}</strong> {currentExp}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
