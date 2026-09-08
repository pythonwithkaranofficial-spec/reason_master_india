"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ALL_TOPICS_SUMMARY } from "@/data/topics-index";
import { EXAM_CATEGORIES } from "@/data/categories";
import { ContentService } from "@/lib/content/ContentService";
import { Exam } from "@/types/models";
import { Sliders, Zap, Check, HelpCircle, Layers, Award } from "lucide-react";

function ConfigureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [scopeType, setScopeType] = useState<"all" | "verbal" | "nonverbal" | "topic" | "exam">(
    (searchParams.get("category") as any) || "all"
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    searchParams.get("topicIds") ? searchParams.get("topicIds")!.split(",") : []
  );
  const [selectedExamId, setSelectedExamId] = useState<string>(searchParams.get("examId") || "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [questionCount, setQuestionCount] = useState<10 | 20 | 30>(20);
  const [mode, setMode] = useState<"instant" | "review">("instant");

  const [examsList, setExamsList] = useState<Exam[]>([]);

  useEffect(() => {
    async function loadExams() {
      const exams = await ContentService.getAllExams();
      setExamsList(exams);
    }
    loadExams();
  }, []);

  const handleToggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleStartSession = () => {
    const params = new URLSearchParams();
    params.set("count", questionCount.toString());
    params.set("difficulty", difficulty);
    params.set("mode", mode);

    if (scopeType === "verbal") {
      params.set("category", "verbal");
    } else if (scopeType === "nonverbal") {
      params.set("category", "nonverbal");
    } else if (scopeType === "topic" && selectedTopics.length > 0) {
      params.set("topicIds", selectedTopics.join(","));
    } else if (scopeType === "exam" && selectedExamId) {
      params.set("examId", selectedExamId);
    }

    router.push(`/practice/session?${params.toString()}`);
  };

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-16)", maxWidth: "840px" }}>
      <Breadcrumb
        items={[
          { label: "Practice Arena", href: "/practice" },
          { label: "Configure Session" },
        ]}
      />

      <div
        className="rm-card"
        style={{
          padding: "var(--space-8)",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
          <Sliders size={20} color="var(--color-primary)" />
          <h1 style={{ fontSize: "1.8rem" }}>Session Builder Wizard</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Customize the scope, difficulty curve, and feedback mode of your practice session.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        {/* Step 1: Scope Selection */}
        <section className="rm-card">
          <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-4)" }}>
            1. Select Practice Scope
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "var(--space-3)",
              marginBottom: "var(--space-6)",
            }}
          >
            {[
              { id: "all", label: "All 39 Topics", desc: "Verbal & Non-Verbal" },
              { id: "verbal", label: "Verbal Only", desc: "25 Verbal Topics" },
              { id: "nonverbal", label: "Non-Verbal Only", desc: "14 Spatial Topics" },
              { id: "topic", label: "Specific Topics", desc: "Choose Topics" },
              { id: "exam", label: "By Exam Target", desc: "64 Exam Profiles" },
            ].map((scope) => {
              const isSelected = scopeType === scope.id;
              return (
                <div
                  key={scope.id}
                  onClick={() => setScopeType(scope.id as any)}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                    backgroundColor: isSelected ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? "var(--color-primary)" : "var(--text-primary)", marginBottom: "2px" }}>
                    {scope.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {scope.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conditional Sub-selector for Topic Multi-Select */}
          {scopeType === "topic" && (
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  Select Topic(s) ({selectedTopics.length} selected):
                </span>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <button
                    onClick={() => setSelectedTopics(ALL_TOPICS_SUMMARY.map((t) => t.id))}
                    className="btn btn-subtle btn-sm"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setSelectedTopics([])}
                    className="btn btn-subtle btn-sm"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "var(--space-2)",
                  maxHeight: "260px",
                  overflowY: "auto",
                  padding: "var(--space-2)",
                  backgroundColor: "var(--bg-subtle)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                {ALL_TOPICS_SUMMARY.map((topic) => {
                  const isChecked = selectedTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleToggleTopic(topic.id)}
                      style={{
                        padding: "var(--space-2) var(--space-3)",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: isChecked ? "var(--color-primary)" : "var(--bg-surface)",
                        color: isChecked ? "#ffffff" : "var(--text-primary)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{topic.name}</span>
                      {isChecked && <Check size={14} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conditional Sub-selector for Exam */}
          {scopeType === "exam" && (
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-4)" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "var(--space-2)" }}>
                Choose Target Exam:
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                }}
              >
                <option value="">-- Choose from 64 Exam Profiles --</option>
                {examsList.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} ({exam.shortName})
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        {/* Step 2: Difficulty Distribution */}
        <section className="rm-card">
          <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-4)" }}>
            2. Difficulty Distribution
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-3)" }}>
            {[
              { id: "mixed", label: "Mixed (Recommended)", desc: "25% Easy • 50% Medium • 25% Hard" },
              { id: "easy", label: "Easy", desc: "Fundamental drills" },
              { id: "medium", label: "Medium", desc: "Standard exam level" },
              { id: "hard", label: "Hard", desc: "Advanced & tricky questions" },
            ].map((d) => {
              const isSelected = difficulty === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setDifficulty(d.id as any)}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                    backgroundColor: isSelected ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? "var(--color-primary)" : "var(--text-primary)", marginBottom: "2px" }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {d.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 3: Question Count & Mode */}
        <section className="rm-card">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
            {/* Count */}
            <div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-3)" }}>
                3. Number of Questions
              </h3>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                {([10, 20, 30] as const).map((cnt) => {
                  const isSelected = questionCount === cnt;
                  return (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`btn ${isSelected ? "btn-primary" : "btn-secondary"}`}
                      style={{ flex: 1, padding: "0.6rem" }}
                    >
                      {cnt} Questions
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode */}
            <div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-3)" }}>
                4. Feedback Mode
              </h3>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <button
                  type="button"
                  onClick={() => setMode("instant")}
                  className={`btn ${mode === "instant" ? "btn-primary" : "btn-secondary"}`}
                  style={{ flex: 1, fontSize: "0.85rem", padding: "0.6rem" }}
                >
                  Instant Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setMode("review")}
                  className={`btn ${mode === "review" ? "btn-primary" : "btn-secondary"}`}
                  style={{ flex: 1, fontSize: "0.85rem", padding: "0.6rem" }}
                >
                  Review at End
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Launch Action */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleStartSession}
            disabled={scopeType === "topic" && selectedTopics.length === 0}
            className="btn btn-primary btn-lg"
            style={{ padding: "0.85rem 3rem", fontSize: "1.1rem" }}
          >
            <Zap size={20} /> Launch Practice Session ({questionCount} Qs)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "var(--space-12) 0", textAlign: "center" }}>Loading wizard...</div>}>
      <ConfigureContent />
    </Suspense>
  );
}
