"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { GKBookmarkItem } from "@/data/gk/gk-types";
import { GKStorageService } from "@/lib/gk/GKStorageService";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import {
  BookmarkCheck,
  Trash2,
  Search,
  MapPin,
  Landmark,
  Globe,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export default function GKBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<GKBookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "state" | "national" | "world">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchBookmarks() {
      setLoading(false);
      const items = await GKStorageService.getAllBookmarks();
      setBookmarks(items);
      setLoading(false);
    }
    fetchBookmarks();
  }, []);

  const handleRemove = async (questionId: string) => {
    await GKStorageService.removeBookmark(questionId);
    setBookmarks((prev) => prev.filter((b) => b.questionId !== questionId));
  };

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      if (categoryFilter !== "all" && b.gkCategory !== categoryFilter) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        b.questionText.toLowerCase().includes(q) ||
        b.explanation.toLowerCase().includes(q) ||
        b.options.some((opt) => opt.toLowerCase().includes(q))
      );
    });
  }, [bookmarks, categoryFilter, searchQuery]);

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-16)" }}>
      {/* Header Banner */}
      <div
        className="rm-card"
        style={{
          padding: "var(--space-8)",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <Breadcrumb
          items={[
            { label: "GK Hub", href: "/gk" },
            { label: "Bookmarked Questions" },
          ]}
        />

        <div style={{ marginTop: "var(--space-4)" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--color-primary)",
              backgroundColor: "var(--color-primary-subtle)",
              padding: "3px 10px",
              borderRadius: "9999px",
              marginBottom: "var(--space-2)",
              border: "1px solid var(--border-color)",
            }}
          >
            <BookmarkCheck size={13} />
            <span>Personal Vault</span>
          </div>

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
            Bookmarked GK Questions
          </h1>

          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Review saved questions, study detailed explanations, and master high-yield topics before your exam.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Search & Filter Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            marginBottom: "var(--space-6)",
            backgroundColor: "var(--bg-surface)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)",
          }}
        >
          {/* Search Bar */}
          <div style={{ position: "relative", flex: "1 1 240px", maxWidth: "380px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in saved questions..."
              style={{
                width: "100%",
                padding: "0.55rem 0.85rem 0.55rem 2.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {/* Right: Language Switcher & Filter Pills */}
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
            {/* Language Switcher */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px",
                backgroundColor: "var(--bg-surface-elevated, #f1f5f9)",
                borderRadius: "9999px",
                border: "1px solid var(--border-color)",
                marginRight: "var(--space-2)",
              }}
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                style={{
                  padding: "3px 10px",
                  fontSize: "0.78rem",
                  fontWeight: lang === "en" ? 700 : 500,
                  borderRadius: "9999px",
                  backgroundColor: lang === "en" ? "var(--color-primary)" : "transparent",
                  color: lang === "en" ? "#ffffff" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("hi")}
                style={{
                  padding: "3px 10px",
                  fontSize: "0.78rem",
                  fontWeight: lang === "hi" ? 700 : 500,
                  borderRadius: "9999px",
                  backgroundColor: lang === "hi" ? "var(--color-primary)" : "transparent",
                  color: lang === "hi" ? "#ffffff" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                हिन्दी
              </button>
            </div>
            {[
              { id: "all", label: `All (${bookmarks.length})` },
              { id: "state", label: "State GK" },
              { id: "national", label: "Indian GK" },
              { id: "world", label: "World GK" },
            ].map((f) => {
              const isSelected = categoryFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategoryFilter(f.id as any)}
                  style={{
                    padding: "0.35rem 0.8rem",
                    borderRadius: "9999px",
                    fontSize: "0.82rem",
                    fontWeight: isSelected ? 600 : 500,
                    backgroundColor: isSelected ? "var(--color-primary)" : "var(--color-primary-subtle)",
                    color: isSelected ? "#ffffff" : "var(--text-secondary)",
                    border: isSelected ? "1px solid var(--color-primary)" : "1px solid var(--border-color)",
                    cursor: "pointer",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookmarks List */}
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vh",
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
        ) : filteredBookmarks.length === 0 ? (
          <div
            style={{
              padding: "var(--space-12)",
              textAlign: "center",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px dashed var(--border-color)",
              color: "var(--text-muted)",
            }}
          >
            <BookmarkCheck size={44} style={{ color: "var(--text-muted)", margin: "0 auto var(--space-3)" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
              No Bookmarked Questions Found
            </h3>
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
              {searchQuery.trim()
                ? `No bookmarks match "${searchQuery}".`
                : "Bookmark challenging GK questions during practice or topic study to review them anytime."}
            </p>
            <Link href="/gk/practice" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Start GK Practice Drills <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {filteredBookmarks.map((b, idx) => (
              <div
                key={b.questionId}
                className="rm-card"
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <span
                      className="tag"
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        backgroundColor: "var(--color-primary-subtle)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {b.gkCategory === "state"
                        ? "State GK"
                        : b.gkCategory === "national"
                        ? "Indian GK"
                        : "World GK"}
                    </span>

                    <DifficultyBadge difficulty={b.difficulty} />

                    {b.lastVerified && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: "#059669",
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          padding: "2px 6px",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        <ShieldCheck size={11} /> Verified {b.lastVerified}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(b.questionId)}
                    className="btn btn-ghost btn-sm"
                    style={{
                      color: "#ef4444",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.78rem",
                      padding: "3px 8px",
                    }}
                    title="Remove from Bookmarks"
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>

                {/* Question */}
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1.45,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {(() => {
                    const qTextHi = (b as any)?.questionTextHi || (b as any)?.qHi || (b as any)?.question_hi;
                    return lang === "hi" && qTextHi ? qTextHi : b.questionText;
                  })()}
                </h3>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "var(--space-3)" }}>
                  {(() => {
                    const optsHi = (b as any)?.optionsHi || (b as any)?.oHi || (b as any)?.options_hi;
                    const opts = (lang === "hi" && Array.isArray(optsHi) && optsHi.length === 4) ? optsHi : b.options;
                    return opts.map((opt, optIdx) => {
                      const isCorrect = optIdx === b.correctIndex;
                      return (
                        <div
                          key={optIdx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.55rem 0.85rem",
                            borderRadius: "var(--radius-md)",
                            border: isCorrect ? "1.5px solid #10b981" : "1px solid var(--border-color)",
                            backgroundColor: isCorrect ? "rgba(16, 185, 129, 0.1)" : "var(--bg-surface-elevated)",
                            color: isCorrect ? "#059669" : "var(--text-secondary)",
                            fontSize: "0.88rem",
                            fontWeight: isCorrect ? 600 : 400,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 700, width: "20px" }}>{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && (
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669" }}>
                              {lang === "hi" ? "सही उत्तर" : "Correct Answer"}
                            </span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Explanation */}
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
                  <strong>{lang === "hi" ? "व्याख्या:" : "Explanation:"}</strong>{" "}
                  {(() => {
                    const expHi = (b as any)?.explanationHi || (b as any)?.expHi;
                    return lang === "hi" && expHi ? expHi : b.explanation;
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
