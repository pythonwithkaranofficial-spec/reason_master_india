"use client";

import React, { useState } from "react";
import { WorkedExample } from "@/types/models";
import { CheckCircle2, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { NonVerbalFigureRenderer } from "@/components/visual/NonVerbalFigureRenderer";

interface WorkedExampleViewerProps {
  examples: WorkedExample[];
  topicId?: string;
}

export function WorkedExampleViewer({ examples, topicId }: WorkedExampleViewerProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // First example open by default

  if (!examples || examples.length === 0) {
    return (
      <div className="rm-card" style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--text-muted)" }}>
        No worked examples available for this section.
      </div>
    );
  }

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {examples.map((example, idx) => {
        const isOpen = openIndices.includes(idx);
        const problemText = example.questionText || example.problem || "";
        const shortcutText = example.shortcutApplied || example.shortcutOrTrick || "";

        let steps: string[] = [];
        if (Array.isArray(example.stepByStepSolution) && example.stepByStepSolution.length > 0) {
          steps = example.stepByStepSolution;
        } else if (Array.isArray(example.solutionSteps) && example.solutionSteps.length > 0) {
          steps = example.solutionSteps;
        } else if (typeof example.solutionSteps === "string") {
          steps = example.solutionSteps
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        }

        return (
          <div
            key={idx}
            className="rm-card"
            style={{
              padding: 0,
              overflow: "hidden",
              border: isOpen ? "1.5px solid var(--border-color)" : "1px solid var(--border-color)",
            }}
          >
            {/* Header / Problem trigger */}
            <div
              onClick={() => toggleIndex(idx)}
              style={{
                padding: "var(--space-4) var(--space-5)",
                backgroundColor: isOpen ? "var(--bg-subtle)" : "var(--bg-surface)",
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "var(--space-3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", flex: 1 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--color-primary-subtle)",
                    color: "var(--color-primary)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </span>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)", flexWrap: "wrap" }}>
                    <h4 style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: 700 }}>
                      {example.title || `Example ${idx + 1}`}
                    </h4>
                    {example.difficulty && <DifficultyBadge difficulty={example.difficulty} size="sm" />}
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                    {problemText}
                  </p>
                </div>
              </div>

              <div style={{ color: "var(--text-muted)", padding: "4px" }}>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {/* Expanded Body: Options, Steps & Shortcut */}
            {isOpen && (
              <div style={{ padding: "var(--space-5)", borderTop: "1px solid var(--border-color)" }}>
                {/* Non-verbal Figure Diagram if applicable */}
                <NonVerbalFigureRenderer
                  topicId={topicId || ""}
                  questionText={problemText}
                  figureRef={example.figureRef}
                  isSolution={true}
                />

                {/* Options if provided */}
                {example.options && example.options.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "var(--space-2)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    {example.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        style={{
                          padding: "var(--space-2) var(--space-3)",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "var(--bg-subtle)",
                          fontSize: "0.9rem",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        <span style={{ fontWeight: 600, marginRight: "6px" }}>
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* Step-by-Step Breakdown */}
                {steps.length > 0 && (
                  <div style={{ marginBottom: "var(--space-4)" }}>
                    <h5
                      style={{
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--text-muted)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      Step-by-Step Solution:
                    </h5>

                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      {steps.map((step, sIdx) => {
                        const isAnswerLine = step.toLowerCase().startsWith("answer:");
                        return (
                          <div
                            key={sIdx}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "var(--space-2)",
                              fontSize: "0.92rem",
                              lineHeight: 1.5,
                              padding: isAnswerLine ? "var(--space-2) var(--space-3)" : undefined,
                              backgroundColor: isAnswerLine ? "var(--color-success-bg)" : undefined,
                              borderRadius: isAnswerLine ? "var(--radius-sm)" : undefined,
                              border: isAnswerLine ? "1px solid var(--color-success-border)" : undefined,
                              color: isAnswerLine ? "var(--color-success-text)" : "var(--text-primary)",
                              fontWeight: isAnswerLine ? 600 : 400,
                            }}
                          >
                            <span
                              style={{
                                color: isAnswerLine ? "var(--color-success)" : "var(--color-primary)",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                flexShrink: 0,
                                marginTop: "1px",
                              }}
                            >
                              ▶
                            </span>
                            <span>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Shortcut / Exam Trick Callout */}
                {shortcutText && (
                  <div
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-accent-subtle)",
                      border: "1px solid var(--color-warning-border)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--space-3)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    <Lightbulb size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ fontSize: "0.88rem", lineHeight: 1.5, color: "var(--color-warning-text)" }}>
                      <strong>Exam Shortcut / Trick:</strong> {shortcutText}
                    </div>
                  </div>
                )}

                {/* Final Answer if provided separately */}
                {example.correctAnswer && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      padding: "var(--space-2) var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-success-bg)",
                      color: "var(--color-success-text)",
                      border: "1px solid var(--color-success-border)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Correct Answer: {example.correctAnswer}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
