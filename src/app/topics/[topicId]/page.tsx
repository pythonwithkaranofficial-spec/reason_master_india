import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ALL_TOPICS_SUMMARY } from "@/data/topics-index";
import { ContentService } from "@/lib/content/ContentService";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { WorkedExampleViewer } from "@/components/topics/WorkedExampleViewer";
import { PracticeQuestionViewer } from "@/components/topics/PracticeQuestionViewer";
import {
  BookOpen,
  Eye,
  Zap,
  Lightbulb,
  Award,
  Layers,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { TopicIcon } from "@/components/topics/TopicIcon";
import { TopicStudyTracker } from "@/components/topics/TopicStudyTracker";

interface TopicPageProps {
  params: Promise<{
    topicId: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_TOPICS_SUMMARY.map((t) => ({
    topicId: t.id,
  }));
}

export async function generateMetadata({ params }: TopicPageProps) {
  const { topicId } = await params;
  const summary = ContentService.getTopicSummary(topicId);
  if (!summary) return { title: "Topic Not Found" };

  return {
    title: `${summary.name} Reasoning — Concept, Rules, Examples & Practice | ReasonMaster India`,
    description: `Complete reasoning master guide for ${summary.name}. Step-by-step worked examples, speed shortcuts, practice questions, and 500 exam MCQs.`,
  };
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { topicId } = await params;
  const topic = await ContentService.getTopicDetail(topicId);
  const summary = ContentService.getTopicSummary(topicId);

  if (!topic || !summary) {
    notFound();
  }

  const isVerbal = topic.category === "verbal";
  const allExams = await ContentService.getAllExams();

  // Find exams where this topic is tested
  const relevantExams = allExams
    .map((e) => {
      const mapping = e.topicMappings?.find((m) => m.topicId === topic.id);
      return mapping ? { exam: e, priority: mapping.priority, frequency: mapping.frequency } : null;
    })
    .filter(Boolean) as { exam: (typeof allExams)[0]; priority: string; frequency: string }[];

  const highPriorityExams = relevantExams.filter((r) => r.priority === "high");
  const otherExams = relevantExams.filter((r) => r.priority !== "high");

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-16)" }}>
      {/* Track last studied topic */}
      <TopicStudyTracker topicId={topic.id} topicName={topic.name} category={topic.category} />
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          {
            label: isVerbal ? "Verbal Reasoning" : "Non-Verbal Reasoning",
            href: isVerbal ? "/verbal" : "/nonverbal",
          },
          { label: topic.name },
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
              <span
                className="badge"
                style={{
                  backgroundColor: isVerbal ? "var(--group-verbal-bg)" : "var(--group-nonverbal-bg)",
                  color: isVerbal ? "var(--group-verbal-text)" : "var(--group-nonverbal-text)",
                }}
              >
                {isVerbal ? "Verbal Reasoning" : "Non-Verbal Reasoning"}
              </span>

              <span className="tag" style={{ fontSize: "0.75rem" }}>
                <Layers size={12} /> {summary.subtopicCount} Subtopic{summary.subtopicCount > 1 ? "s" : ""}
              </span>

              <span className="tag" style={{ fontSize: "0.75rem" }}>
                {summary.exampleCount} Worked Examples
              </span>

              <span className="tag" style={{ fontSize: "0.75rem" }}>
                {summary.practiceCount} Practice Qs
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
              <TopicIcon topicId={topic.id} category={topic.category} size={28} badgeSize={52} variant="badge" />
              <h1 style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)", margin: 0, color: "var(--text-primary)" }}>
                {topic.name}
              </h1>
            </div>

            {topic.shortcutSummary && (
              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {topic.shortcutSummary}
              </p>
            )}
          </div>

          <Link
            href={`/practice/session?topicIds=${topic.id}&difficulty=mixed`}
            className="btn btn-primary btn-lg"
          >
            <Zap size={18} /> Practice Topic MCQs
          </Link>
        </div>
      </div>

      {/* Grid Layout: Main Topic Content + Sidebar (Exam Relevance) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-8)",
        }}
        className="topic-layout-grid"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          {/* Section 1: Concept & Fundamental Principles */}
          {topic.conceptExplanation && (
            <section className="rm-card">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--color-primary-subtle)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={18} />
                </div>
                <h2 style={{ fontSize: "1.35rem" }}>Concept & Theory Foundation</h2>
              </div>

              <div
                style={{
                  fontSize: "0.98rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {topic.conceptExplanation}
              </div>
            </section>
          )}

          {/* Section 2: Subtopics, Worked Examples & Practice Questions */}
          <section>
            <div style={{ marginBottom: "var(--space-6)" }}>
              <h2 style={{ fontSize: "1.45rem", marginBottom: "var(--space-1)" }}>
                Subtopics & Worked Solutions ({topic.subtopics?.length || 0})
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                Deep-dive into each subtopic with explanations, shortcut tricks, and step-by-step examples.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              {(topic.subtopics || []).map((subtopic, subIdx) => (
                <div
                  key={subtopic.id || subIdx}
                  className="rm-card"
                  style={{
                    padding: "clamp(var(--space-5), 3vw, var(--space-7))",
                    border: "1.5px solid var(--border-color)",
                  }}
                >
                  {/* Subtopic Header */}
                  <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "var(--space-4)", marginBottom: "var(--space-5)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                      <span className="badge badge-primary">Subtopic {subIdx + 1}</span>
                      <h3 style={{ fontSize: "1.3rem" }}>{subtopic.name}</h3>
                    </div>

                    {subtopic.explanation && (
                      <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                        {subtopic.explanation}
                      </p>
                    )}
                  </div>

                  {/* Subtopic Shortcuts / Rules */}
                  {subtopic.shortcuts && subtopic.shortcuts.length > 0 && (
                    <div
                      style={{
                        padding: "var(--space-4)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--color-accent-subtle)",
                        border: "1px solid var(--color-warning-border)",
                        marginBottom: "var(--space-6)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)", color: "var(--color-warning-text)", fontWeight: 700, fontSize: "0.9rem" }}>
                        <Lightbulb size={18} />
                        <span>Key Shortcuts & Speed Rules:</span>
                      </div>
                      <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", paddingLeft: "var(--space-4)" }}>
                        {subtopic.shortcuts.map((sc, sIdx) => (
                          <li key={sIdx} style={{ fontSize: "0.88rem", color: "var(--color-warning-text)", listStyleType: "disc" }}>
                            {sc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Worked Examples Subsection */}
                  {subtopic.examples && subtopic.examples.length > 0 && (
                    <div style={{ marginBottom: "var(--space-6)" }}>
                      <h4 style={{ fontSize: "1.05rem", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <span>Worked Examples ({subtopic.examples.length})</span>
                      </h4>
                      <WorkedExampleViewer examples={subtopic.examples} topicId={topic.id} />
                    </div>
                  )}

                  {/* Embedded Practice Questions Subsection */}
                  {subtopic.practiceQuestions && subtopic.practiceQuestions.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: "1.05rem", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <span>Practice Questions ({subtopic.practiceQuestions.length})</span>
                      </h4>
                      <PracticeQuestionViewer questions={subtopic.practiceQuestions} topicId={topic.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Target Exams Relevance */}
          <section className="rm-card">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <Award size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: "1.3rem" }}>Exam Weightage & Relevance</h2>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
              This topic is an integral part of the reasoning syllabus for the following competitive exams:
            </p>

            {highPriorityExams.length > 0 && (
              <div style={{ marginBottom: "var(--space-4)" }}>
                <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-error)", marginBottom: "var(--space-2)" }}>
                  High-Priority / Frequent Weightage:
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {highPriorityExams.map(({ exam }) => (
                    <Link
                      key={exam.id}
                      href={`/exams/${exam.category}/${exam.id}`}
                      className="tag"
                      style={{
                        padding: "0.35rem 0.65rem",
                        backgroundColor: "var(--diff-hard-bg)",
                        borderColor: "var(--diff-hard-border)",
                        color: "var(--diff-hard-text)",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      {exam.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {otherExams.length > 0 && (
              <div>
                <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "var(--space-2)" }}>
                  Commonly Tested In:
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {otherExams.slice(0, 15).map(({ exam }) => (
                    <Link
                      key={exam.id}
                      href={`/exams/${exam.category}/${exam.id}`}
                      className="tag"
                      style={{ textDecoration: "none" }}
                    >
                      {exam.shortName}
                    </Link>
                  ))}
                  {otherExams.length > 15 && (
                    <span className="tag">+{otherExams.length - 15} more exams</span>
                  )}
                </div>
              </div>
            )}
          </section>

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
              Ready to test your mastery in {topic.name}?
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)", maxWidth: "550px", marginLeft: "auto", marginRight: "auto", fontSize: "0.95rem" }}>
              Practice from our pool of 500 high-yield questions for this topic with live timers, accuracy tracking, and step-by-step solutions.
            </p>
            <Link
              href={`/practice/session?topicIds=${topic.id}&difficulty=mixed`}
              className="btn btn-primary btn-lg"
            >
              <Zap size={18} /> Start Practice Mock Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
