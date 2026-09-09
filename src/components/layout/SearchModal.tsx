"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, BookOpen, Award, FileText, ArrowRight, CornerDownLeft } from "lucide-react";
import { TOPIC_INDEX, EXAM_INDEX } from "@/data/search-index";
import { ASSETS } from "@/lib/assets/manifest";
import { TopicIcon } from "@/components/topics/TopicIcon";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOPIC_ALIASES: Record<string, string[]> = {
  alphabet_test: ["alphabet", "letter", "letter word", "dictionary order"],
  analogy: ["analogies", "similarity", "word analogy", "number analogy"],
  analytical_reasoning: ["analytical", "counting figures", "triangle counting"],
  blood_relations: ["blood relation", "family tree", "relations", "relationship", "coded relation"],
  cause_and_effect: ["cause", "effect", "critical reasoning"],
  classification: ["odd one out", "find odd", "classification"],
  coding_decoding: ["coding", "decoding", "cipher", "letter code", "number code"],
  course_of_action: ["course of action", "action", "decision making"],
  critical_reasoning: ["critical", "assertion", "reason", "inference", "arguments"],
  data_sufficiency: ["data sufficiency", "sufficiency"],
  direction_sense: ["direction", "distance", "compass", "shadow", "turns", "left right"],
  inequality: ["inequalities", "coded inequality", "mathematical inequality"],
  input_output: ["machine input", "shifting", "rearrangement", "step input"],
  logical_venn_diagrams: ["venn diagram", "venn", "overlapping circles"],
  puzzles_box: ["box puzzle", "box arrangement"],
  puzzles_floor: ["floor puzzle", "flat floor", "building floor"],
  puzzles_scheduling: ["scheduling", "days puzzle", "months puzzle", "weekly schedule"],
  ranking_order: ["ranking", "order and ranking", "position in row"],
  seating_circular: ["circular seating", "round table", "circle puzzle", "facing center"],
  seating_linear: ["linear seating", "row seating", "line puzzle", "parallel rows"],
  series_completion: ["number series", "letter series", "alphabet series", "sequence"],
  statement_argument: ["argument", "strong argument", "weak argument"],
  statement_assumption: ["assumption", "implicit assumption"],
  statement_conclusion: ["conclusion", "statement conclusion"],
  syllogism: ["syllogisms", "venn syllogism", "all some no", "possibility"],
  analytical_figure_classification: ["figure classification", "grouping shapes"],
  counting_figures: ["count triangles", "count squares", "figure counting", "count rectangles"],
  cubes_and_dice: ["cube", "dice", "cubes", "dices", "opposite face", "open dice"],
  embedded_figures: ["embedded", "hidden figure", "find hidden"],
  figure_completion: ["complete pattern", "missing piece", "pattern completion"],
  grouping_figures: ["group figures", "shape grouping"],
  mathematical_operations: ["bodmas", "interchange signs", "symbol substitution"],
  mirror_images: ["mirror", "mirror image", "lateral inversion", "reflection"],
  missing_character: ["missing number", "matrix puzzle", "missing term"],
  nonverbal_series: ["figure series", "next figure", "rotation pattern"],
  odd_figure_out: ["odd figure", "different figure"],
  paper_cutting: ["paper cut", "punch hole", "unfolded"],
  paper_folding: ["paper fold", "crease", "transparent sheet"],
  water_images: ["water image", "water reflection", "inverted image"],
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const topicResults = TOPIC_INDEX.filter((t) => {
      const aliases = TOPIC_ALIASES[t.id] || [];
      return (
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.subtopics.some((s) => s.toLowerCase().includes(q)) ||
        aliases.some((a) => a.includes(q) || q.includes(a))
      );
    }).map((t) => ({
      id: `topic-${t.id}`,
      rawTopicId: t.id,
      category: t.category,
      type: "topic" as const,
      title: t.name,
      subtitle: `${t.category === "verbal" ? "Verbal" : "Non-Verbal"} Reasoning • ${t.subtopicCount} subtopics`,
      url: `/topics/${t.id}`,
      badge: t.category === "verbal" ? "Verbal" : "Non-Verbal",
    }));

    const examResults = EXAM_INDEX.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.shortName.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.conductingBody.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    ).map((e) => ({
      id: `exam-${e.id}`,
      rawTopicId: "",
      category: "verbal" as const,
      type: "exam" as const,
      title: e.name,
      subtitle: `${e.shortName} • ${e.conductingBody}`,
      url: `/exams/${e.category}/${e.id}`,
      badge: e.category.toUpperCase(),
    }));

    return [...topicResults, ...examResults].slice(0, 10);
  }, [query]);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(
        `[data-result-index="${selectedIndex}"]`
      ) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex].url);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, router]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "10vh var(--space-4) var(--space-4)",
        backgroundColor: "rgba(15, 23, 42, 0.7)",
      }}
      onClick={onClose}
    >
      <div
        className="rm-card"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: 0,
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "var(--space-4) var(--space-5)",
            borderBottom: "1px solid var(--border-color)",
            gap: "var(--space-3)",
          }}
        >
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search topics (e.g. Syllogism), exams (e.g. SSC CGL), or rules..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              color: "var(--text-primary)",
              fontSize: "1.05rem",
              outline: "none",
            }}
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              style={{
                color: "var(--text-muted)",
                minWidth: "44px",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "var(--radius-sm)",
              }}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          ) : (
            <span className="tag" style={{ fontSize: "0.75rem", padding: "0.15rem 0.4rem" }}>
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div
          ref={resultsContainerRef}
          style={{ maxHeight: "380px", overflowY: "auto", padding: "var(--space-2)" }}
        >
          {query.trim() === "" ? (
            <div
              style={{
                padding: "var(--space-8) var(--space-4)",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              <p style={{ marginBottom: "var(--space-2)" }}>Search across all 39 Topics and 64 Indian Competitive Exams</p>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: "var(--space-4)",
                }}
              >
                {["Syllogism", "Coding Decoding", "SSC CGL", "SBI PO", "Cubes & Dice", "Blood Relations"].map(
                  (chip) => (
                    <button
                      key={chip}
                      onClick={() => setQuery(chip)}
                      className="tag"
                      style={{ cursor: "pointer" }}
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div
              style={{
                padding: "var(--space-8) var(--space-4)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-3)",
              }}
            >
              <Image
                src={ASSETS.states.emptySearch.src}
                alt={ASSETS.states.emptySearch.alt}
                width={96}
                height={96}
              />
              <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                No matching topics or exams found
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Try searching for &ldquo;Syllogism&rdquo;, &ldquo;Coding Decoding&rdquo;, or &ldquo;SSC CGL&rdquo;
              </div>
            </div>
          ) : (
            <div>
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    data-result-index={idx}
                    onClick={() => handleSelect(item.url)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "var(--space-3) var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: isSelected ? "var(--bg-surface-hover)" : "transparent",
                      cursor: "pointer",
                      border: isSelected ? "1px solid var(--border-color)" : "1px solid transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", minWidth: 0 }}>
                      {item.type === "topic" ? (
                        <TopicIcon
                          topicId={item.rawTopicId}
                          category={item.category}
                          size={16}
                          badgeSize={32}
                          variant="badge"
                        />
                      ) : (
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            flexShrink: 0,
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--color-accent-subtle)",
                            color: "var(--color-accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Award size={16} />
                        </div>
                      )}

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: "var(--text-primary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                        {item.badge}
                      </span>
                      {isSelected && <CornerDownLeft size={14} color="var(--text-muted)" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            backgroundColor: "var(--bg-subtle)",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          <span>Use ↑ ↓ keys to navigate</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
