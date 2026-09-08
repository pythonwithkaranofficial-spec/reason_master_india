import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EXAM_CATEGORIES } from "@/data/categories";
import { ALL_TOPICS_SUMMARY } from "@/data/topics-index";
import { ContentService } from "@/lib/content/ContentService";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Award, Zap, Building, ArrowRight, BookOpen, Layers, CheckCircle } from "lucide-react";

interface ExamDetailPageProps {
  params: Promise<{
    categoryId: string;
    examId: string;
  }>;
}

export async function generateStaticParams() {
  const allExams = await ContentService.getAllExams();
  return allExams.map((e) => ({
    categoryId: e.category,
    examId: e.id,
  }));
}

export async function generateMetadata({ params }: ExamDetailPageProps) {
  const { examId } = await params;
  const exam = await ContentService.getExamById(examId);
  if (!exam) return { title: "Exam Not Found" };

  return {
    title: `${exam.name} — Reasoning Syllabus, Weightage & Practice | ReasonMaster India`,
    description: `Complete reasoning syllabus and topic-wise priority breakdown for ${exam.name}. Practice high-priority exam MCQs.`,
  };
}

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { categoryId, examId } = await params;
  const exam = await ContentService.getExamById(examId);
  const category = EXAM_CATEGORIES.find((c) => c.id.toLowerCase() === categoryId.toLowerCase());

  if (!exam || !category) {
    notFound();
  }

  // Group topics by priority
  const topicMap = new Map(ALL_TOPICS_SUMMARY.map((t) => [t.id, t]));

  const highPriorityMappings = (exam.topicMappings || []).filter((m) => m.priority === "high");
  const mediumPriorityMappings = (exam.topicMappings || []).filter((m) => m.priority === "medium");
  const lowPriorityMappings = (exam.topicMappings || []).filter((m) => m.priority === "low");

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-16)" }}>
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: "Exam Profiles", href: "/exams" },
          { label: category.name, href: `/exams/${category.id}` },
          { label: exam.shortName },
        ]}
      />

      {/* Hero Header */}
      <div
        className="rm-card"
        style={{
          padding: "clamp(var(--space-6), 4vw, var(--space-8))",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-4)" }}>
          <div style={{ maxWidth: "750px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <span className="badge badge-primary">{category.name}</span>
              <span className="badge badge-accent">{exam.shortName}</span>
              <span className="tag" style={{ fontSize: "0.75rem" }}>
                <Layers size={12} /> {exam.topicMappings?.length || 0} Syllabus Topics
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", marginBottom: "var(--space-2)" }}>
              {exam.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "var(--space-4)" }}>
              <Building size={16} />
              <span>Conducting Body: <strong>{exam.conductingBody}</strong></span>
            </div>

            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {exam.description}
            </p>
          </div>

          <Link
            href={`/practice/session?examId=${exam.id}&count=20&difficulty=mixed`}
            className="btn btn-primary btn-lg"
          >
            <Zap size={18} /> Practice for {exam.shortName}
          </Link>
        </div>
      </div>

      {/* Syllabus Priority Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        {/* 1. High Priority Topics */}
        {highPriorityMappings.length > 0 && (
          <section>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                <h2 style={{ fontSize: "1.35rem" }}>High-Priority Topics</h2>
                <span className="badge badge-hard">{highPriorityMappings.length} Topics</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Frequently tested with maximum question weightage in {exam.shortName}. Essential for clearing sectional cutoffs.
              </p>
            </div>

            <div className="grid-cards">
              {highPriorityMappings.map((m) => {
                const topicSummary = topicMap.get(m.topicId);
                if (!topicSummary) return null;

                return (
                  <Link
                    key={m.topicId}
                    href={`/topics/${m.topicId}`}
                    className="rm-card rm-card-interactive"
                    style={{
                      textDecoration: "none",
                      borderLeft: "4px solid var(--color-error)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                      <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>{topicSummary.name}</h3>
                      <span className="badge badge-hard" style={{ fontSize: "0.7rem" }}>
                        Weight: {m.weight}/5
                      </span>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "var(--space-3)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {topicSummary.shortcutSummary || "Master core concepts and rules."}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <span>{topicSummary.category === "verbal" ? "Verbal" : "Non-Verbal"}</span>
                      <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>Study Topic →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. Medium Priority Topics */}
        {mediumPriorityMappings.length > 0 && (
          <section>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                <h2 style={{ fontSize: "1.35rem" }}>Medium-Priority Topics</h2>
                <span className="badge badge-medium">{mediumPriorityMappings.length} Topics</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Regularly featured in prelims and tier-1 examinations. Consistent practice is recommended.
              </p>
            </div>

            <div className="grid-cards">
              {mediumPriorityMappings.map((m) => {
                const topicSummary = topicMap.get(m.topicId);
                if (!topicSummary) return null;

                return (
                  <Link
                    key={m.topicId}
                    href={`/topics/${m.topicId}`}
                    className="rm-card rm-card-interactive"
                    style={{
                      textDecoration: "none",
                      borderLeft: "4px solid var(--color-warning)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                      <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>{topicSummary.name}</h3>
                      <span className="badge badge-medium" style={{ fontSize: "0.7rem" }}>
                        Weight: {m.weight}/5
                      </span>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "var(--space-3)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {topicSummary.shortcutSummary || "Master core concepts and rules."}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <span>{topicSummary.category === "verbal" ? "Verbal" : "Non-Verbal"}</span>
                      <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>Study Topic →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. Low Priority / Occasional Topics */}
        {lowPriorityMappings.length > 0 && (
          <section>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                <h2 style={{ fontSize: "1.35rem" }}>Occasional / Supplementary Topics</h2>
                <span className="badge badge-easy">{lowPriorityMappings.length} Topics</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Occasionally asked or supplementary question types in {exam.shortName}.
              </p>
            </div>

            <div className="grid-cards">
              {lowPriorityMappings.map((m) => {
                const topicSummary = topicMap.get(m.topicId);
                if (!topicSummary) return null;

                return (
                  <Link
                    key={m.topicId}
                    href={`/topics/${m.topicId}`}
                    className="rm-card rm-card-interactive"
                    style={{
                      textDecoration: "none",
                      borderLeft: "4px solid var(--color-success)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                      <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>{topicSummary.name}</h3>
                      <span className="badge badge-easy" style={{ fontSize: "0.7rem" }}>
                        Weight: {m.weight}/5
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <span>{topicSummary.category === "verbal" ? "Verbal" : "Non-Verbal"}</span>
                      <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>Study Topic →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom Practice CTA */}
        <div
          className="rm-card"
          style={{
            padding: "var(--space-8)",
            textAlign: "center",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          <h3 style={{ fontSize: "1.3rem", marginBottom: "var(--space-2)" }}>
            Launch a targeted Mock Session for {exam.shortName}
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)", maxWidth: "550px", marginLeft: "auto", marginRight: "auto", fontSize: "0.95rem" }}>
            The session generator will sample questions strictly from high and medium priority topics for {exam.name}.
          </p>
          <Link
            href={`/practice/session?examId=${exam.id}&count=20&difficulty=mixed`}
            className="btn btn-primary btn-lg"
          >
            <Zap size={18} /> Start {exam.shortName} Practice Session
          </Link>
        </div>
      </div>
    </div>
  );
}
