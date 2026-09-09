"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookmarkItem } from "@/types/models";
import { StorageService } from "@/lib/persistence/StorageService";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ASSETS } from "@/lib/assets/manifest";
import { TopicIcon } from "@/components/topics/TopicIcon";
import {
  Bookmark,
  Zap,
  Trash2,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useUserSettings } from "@/lib/settings/SettingsProvider";

export default function BookmarksPage() {
  const router = useRouter();
  const { settings } = useUserSettings();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookmarks() {
      try {
        const items = await StorageService.getAllBookmarks();
        setBookmarks(items);
      } catch (err) {
        console.error("Failed to load bookmarks", err);
      } finally {
        setLoading(false);
      }
    }
    loadBookmarks();
  }, []);

  const handleRemove = async (questionId: string) => {
    await StorageService.removeBookmark(questionId);
    setBookmarks((prev) => prev.filter((b) => b.questionId !== questionId));
  };

  const filteredBookmarks = bookmarks.filter((b) =>
    selectedTopic === "all" ? true : b.topicId === selectedTopic
  );

  const topicSet = Array.from(new Set(bookmarks.map((b) => b.topicId)));

  const handlePracticeBookmarks = () => {
    if (filteredBookmarks.length === 0) return;
    // Map bookmark items to MCQQuestion shape and save to sessionStorage
    const qPool = filteredBookmarks.map((b) => ({
      id: b.questionId,
      topicId: b.topicId,
      subtopicId: b.subtopicId,
      questionType: "text" as const,
      questionText: b.questionText,
      options: b.options,
      correctIndex: b.correctIndex,
      difficulty: b.difficulty,
      hint: b.hint || "",
      explanation: b.explanation,
      solutionSteps: b.solutionSteps,
      memoryTip: b.memoryTip,
      examTags: [],
    }));

    sessionStorage.setItem("custom_session_pool", JSON.stringify(qPool));
    router.push(`/practice/session?count=${Math.min(qPool.length, settings.defaultQuestionCount)}&difficulty=mixed&mode=${settings.instantFeedback ? "instant" : "review"}`);
  };

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-16)", maxWidth: "900px" }}>
      <Breadcrumb items={[{ label: "Bookmarked Questions" }]} />

      {/* Header Banner */}
      <div
        className="rm-card"
        style={{
          padding: "var(--space-8)",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-accent-subtle)",
                color: "var(--color-accent)",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "var(--space-3)",
              }}
            >
              <Bookmark size={14} /> Saved Revision Vault
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "var(--space-2)" }}>
              Bookmarked Questions ({bookmarks.length})
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              Quickly revise tricky questions, high-yield shortcuts, and bookmark items saved during mock practice.
            </p>
          </div>

          {bookmarks.length > 0 && (
            <button onClick={handlePracticeBookmarks} className="btn btn-primary btn-lg">
              <Zap size={18} /> Practice All Bookmarks ({filteredBookmarks.length})
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-12) 0" }}>Loading bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <EmptyState
          asset={ASSETS.states.emptyBookmarks}
          icon={Bookmark}
          title="No Bookmarked Questions Yet"
          description="While practicing MCQs or reviewing topics, tap the bookmark icon to save tricky questions here for fast pre-exam revision."
          actionText="Start Practice Session"
          actionHref="/practice"
        />
      ) : (
        <div>
          {/* Topic Filters */}
          {topicSet.length > 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
              <button
                onClick={() => setSelectedTopic("all")}
                className={`btn btn-sm ${selectedTopic === "all" ? "btn-primary" : "btn-secondary"}`}
              >
                All Topics ({bookmarks.length})
              </button>
              {topicSet.map((tId) => {
                const count = bookmarks.filter((b) => b.topicId === tId).length;
                const isSelected = selectedTopic === tId;
                return (
                  <button
                    key={tId}
                    onClick={() => setSelectedTopic(tId)}
                    className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {tId.replace(/_/g, " ")} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Bookmarks List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {filteredBookmarks.map((item, idx) => {
              const isExpanded = expandedId === item.questionId;

              return (
                <div key={item.questionId} className="rm-card" style={{ padding: 0, overflow: "hidden" }}>
                  {/* Top Bar */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.questionId)}
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
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)", flexWrap: "wrap" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}>
                          <TopicIcon topicId={item.topicId} size={13} badgeSize={22} variant="badge" />
                          <span className="tag" style={{ textTransform: "capitalize", fontSize: "0.75rem" }}>
                            {item.topicId.replace(/_/g, " ")}
                          </span>
                        </div>
                        <DifficultyBadge difficulty={item.difficulty} size="sm" />
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Saved {new Date(item.savedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5 }}>
                        {item.questionText}
                      </h3>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.questionId);
                        }}
                        style={{
                          padding: "6px",
                          color: "var(--text-muted)",
                          borderRadius: "var(--radius-sm)",
                        }}
                        title="Remove Bookmark"
                        aria-label="Remove Bookmark"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div style={{ color: "var(--text-muted)", padding: "4px" }}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div style={{ padding: "var(--space-5)", borderTop: "1px solid var(--border-color)" }}>
                      {/* Options */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                        {item.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === item.correctIndex;
                          return (
                            <div
                              key={optIdx}
                              style={{
                                padding: "var(--space-2) var(--space-3)",
                                borderRadius: "var(--radius-sm)",
                                backgroundColor: isCorrect ? "var(--color-success-bg)" : "var(--bg-subtle)",
                                border: isCorrect ? "1px solid var(--color-success-border)" : "1px solid var(--border-color)",
                                color: isCorrect ? "var(--color-success-text)" : "var(--text-primary)",
                                fontSize: "0.9rem",
                                fontWeight: isCorrect ? 600 : 400,
                              }}
                            >
                              <span style={{ marginRight: "6px" }}>{String.fromCharCode(65 + optIdx)}.</span>
                              {opt}
                              {isCorrect && " (Correct Answer)"}
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
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-primary)", marginBottom: "4px" }}>
                          Explanation:
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                          {item.explanation}
                        </p>
                      </div>

                      {/* Memory Tip */}
                      {item.memoryTip && (
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
                            <strong>Exam Tip:</strong> {item.memoryTip}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
