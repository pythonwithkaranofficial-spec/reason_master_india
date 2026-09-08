"use client";

import React, { useState } from "react";
import { PracticeQuestion } from "@/types/models";
import { Check, X, HelpCircle, Eye, Tag } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { NonVerbalFigureRenderer } from "@/components/visual/NonVerbalFigureRenderer";

interface PracticeQuestionViewerProps {
  questions: PracticeQuestion[];
  topicId?: string;
}

export function PracticeQuestionViewer({ questions, topicId }: PracticeQuestionViewerProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});

  if (!questions || questions.length === 0) {
    return (
      <div className="rm-card" style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--text-muted)" }}>
        No practice questions available for this section.
      </div>
    );
  }

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    // Auto-reveal explanation when an option is selected
    setRevealedExplanations((prev) => ({ ...prev, [qIdx]: true }));
  };

  const toggleHint = (qIdx: number) => {
    setRevealedHints((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {questions.map((q, qIdx) => {
        const selectedOpt = selectedAnswers[qIdx];
        const isAnswered = selectedOpt !== undefined;
        const isHintShown = revealedHints[qIdx];
        const isExplShown = revealedExplanations[qIdx];

        // Format explanation or solution steps
        let explanationContent = q.explanation || "";
        if (!explanationContent && q.solutionSteps) {
          if (Array.isArray(q.solutionSteps)) {
            explanationContent = q.solutionSteps.join("\n");
          } else {
            explanationContent = String(q.solutionSteps);
          }
        }

        return (
          <div
            key={qIdx}
            className="rm-card"
            style={{
              padding: "var(--space-5)",
              border: isAnswered
                ? selectedOpt === q.correctIndex
                  ? "1.5px solid var(--color-success-border)"
                  : "1.5px solid var(--color-error-border)"
                : "1px solid var(--border-color)",
            }}
          >
            {/* Question Top Row: Index, Difficulty & Exam Tags */}
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
                <span className="tag" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                  Question {qIdx + 1} of {questions.length}
                </span>

                {q.difficulty && <DifficultyBadge difficulty={q.difficulty} size="sm" />}
              </div>

              {q.examTags && q.examTags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {q.examTags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="tag"
                      style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem", textTransform: "uppercase" }}
                    >
                      {tag.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Question Text */}
            <p
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                lineHeight: 1.55,
                color: "var(--text-primary)",
                marginBottom: "var(--space-4)",
                whiteSpace: "pre-line",
              }}
            >
              {q.questionText}
            </p>

            {/* Non-verbal Figure Diagram if applicable */}
            <NonVerbalFigureRenderer
              topicId={topicId || ""}
              questionText={q.questionText}
              figureRef={q.figureRef}
            />

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedOpt === optIdx;
                const isCorrect = optIdx === q.correctIndex;

                let optStyle: React.CSSProperties = {
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.95rem",
                  transition: "all var(--transition-fast)",
                };

                if (isAnswered) {
                  if (isCorrect) {
                    optStyle.backgroundColor = "var(--color-success-bg)";
                    optStyle.borderColor = "var(--color-success-border)";
                    optStyle.color = "var(--color-success-text)";
                  } else if (isSelected && !isCorrect) {
                    optStyle.backgroundColor = "var(--color-error-bg)";
                    optStyle.borderColor = "var(--color-error-border)";
                    optStyle.color = "var(--color-error-text)";
                  }
                } else if (isSelected) {
                  optStyle.borderColor = "var(--color-primary)";
                  optStyle.backgroundColor = "var(--color-primary-subtle)";
                }

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(qIdx, optIdx)}
                    style={optStyle}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "var(--radius-full)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          backgroundColor: isAnswered && isCorrect ? "var(--color-success)" : "var(--bg-subtle)",
                          color: isAnswered && isCorrect ? "#ffffff" : "var(--text-secondary)",
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswered && (
                      <div>
                        {isCorrect && <Check size={18} color="var(--color-success)" />}
                        {isSelected && !isCorrect && <X size={18} color="var(--color-error)" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hint and Explanation Actions */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", alignItems: "center" }}>
              {q.hint && (
                <button
                  onClick={() => toggleHint(qIdx)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "0.8rem" }}
                >
                  <HelpCircle size={14} /> {isHintShown ? "Hide Hint" : "Need a Hint?"}
                </button>
              )}

              {!isAnswered && (
                <button
                  onClick={() => setRevealedExplanations((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }))}
                  className="btn btn-subtle btn-sm"
                  style={{ fontSize: "0.8rem" }}
                >
                  <Eye size={14} /> {isExplShown ? "Hide Solution" : "Show Solution"}
                </button>
              )}
            </div>

            {/* Hint Box */}
            {isHintShown && q.hint && (
              <div
                style={{
                  marginTop: "var(--space-3)",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-info-bg)",
                  border: "1px solid var(--color-info-border)",
                  color: "var(--color-info-text)",
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                }}
              >
                <strong>Hint:</strong> {q.hint}
              </div>
            )}

            {/* Explanation Box */}
            {isExplShown && explanationContent && (
              <div
                style={{
                  marginTop: "var(--space-3)",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    color: "var(--color-primary)",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  Explanation & Concept:
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.55, whiteSpace: "pre-line" }}>
                  {explanationContent}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
