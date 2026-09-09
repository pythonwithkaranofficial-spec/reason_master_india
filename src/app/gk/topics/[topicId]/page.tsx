import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ALL_NATIONAL_TOPICS_SUMMARY } from "@/data/gk/national-gk-index";
import { ALL_WORLD_TOPICS_SUMMARY } from "@/data/gk/world-gk-index";
import { GKContentService } from "@/lib/gk/GKContentService";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FactCardViewer } from "@/components/gk/FactCardViewer";
import { GKPracticeQuestionViewer } from "@/components/gk/GKPracticeQuestionViewer";
import { GKPracticeQuestion, GKSubtopic } from "@/data/gk/gk-types";
import {
  BookOpen,
  Landmark,
  Globe,
  Layers,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

interface GKTopicDetailPageProps {
  params: Promise<{
    topicId: string;
  }>;
}

export async function generateStaticParams() {
  const nationalParams = ALL_NATIONAL_TOPICS_SUMMARY.map((t) => ({ topicId: t.id }));
  const worldParams = ALL_WORLD_TOPICS_SUMMARY.map((t) => ({ topicId: t.id }));
  return [...nationalParams, ...worldParams];
}

export async function generateMetadata({ params }: GKTopicDetailPageProps): Promise<Metadata> {
  const { topicId } = await params;
  const national = GKContentService.getNationalTopicSummary(topicId);
  const world = GKContentService.getWorldTopicSummary(topicId);
  const summary = national || world;

  if (!summary) return { title: "Topic Not Found" };

  return {
    title: `${summary.name} — Facts, Concepts & Practice Questions | ReasonMaster GK`,
    description: `Master ${summary.name} for competitive exams. Core concept explanation, high-yield fact cards, subtopics breakdown, and practice MCQs.`,
  };
}

export default async function GKTopicDetailPage({ params }: GKTopicDetailPageProps) {
  const { topicId } = await params;

  // Try national topic first, then world topic
  const nationalTopic = await GKContentService.getNationalTopicDetail(topicId);
  const worldTopic = !nationalTopic ? await GKContentService.getWorldTopicDetail(topicId) : null;
  const topic = nationalTopic || worldTopic;

  if (!topic) {
    notFound();
  }

  const isNational = !!nationalTopic;
  const categorySummaryList = isNational ? ALL_NATIONAL_TOPICS_SUMMARY : ALL_WORLD_TOPICS_SUMMARY;
  const categoryHubHref = isNational ? "/gk/national" : "/gk/world";
  const categoryLabel = isNational ? "Indian GK" : "World GK";

  // Prev / Next topic navigation
  const currentIndex = categorySummaryList.findIndex((t) => t.id === topicId);
  const prevIndex = (currentIndex - 1 + categorySummaryList.length) % categorySummaryList.length;
  const nextIndex = (currentIndex + 1) % categorySummaryList.length;
  const prevTopic = categorySummaryList[prevIndex];
  const nextTopic = categorySummaryList[nextIndex];

  // Ensure subtopics have valid fact IDs
  const subtopicsWithIds: GKSubtopic[] = (topic.subtopics || []).map((st: any) => ({
    ...st,
    facts: (st.facts || []).map((f: any, idx: number) => ({
      ...f,
      id: f.id || `${topic.id}_${st.id}_f${idx + 1}`,
      topicId: topic.id,
      subtopicId: st.id,
    })),
  }));

  // Practice MCQs
  const practiceQuestions: GKPracticeQuestion[] = ((topic as any).mcqs || []).map(
    (m: any, idx: number) => ({
      id: `gk_${topic.id}_q${idx + 1}`,
      questionText: m.q,
      options: m.o,
      correctIndex: m.a,
      explanation: m.exp,
      difficulty: "medium",
    })
  );

  return (
    <div style={{ paddingBottom: "var(--space-12)" }}>
      {/* Header Banner */}
      <section
        style={{
          padding: "var(--space-6) 0 var(--space-6)",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-4)" }}>
          <Breadcrumb
            items={[
              { label: "GK Hub", href: "/gk" },
              { label: categoryLabel, href: categoryHubHref },
              { label: topic.name },
            ]}
          />

          <div style={{ marginTop: "var(--space-4)", maxWidth: "900px" }}>
            {/* Category Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: isNational ? "#059669" : "#4f46e5",
                backgroundColor: isNational ? "rgba(16, 185, 129, 0.1)" : "rgba(99, 102, 241, 0.1)",
                padding: "3px 10px",
                borderRadius: "9999px",
                marginBottom: "var(--space-2)",
                border: isNational ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(99, 102, 241, 0.25)",
              }}
            >
              {isNational ? <Landmark size={13} /> : <Globe size={13} />}
              <span>{categoryLabel}</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 2.6rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "var(--space-3)",
              }}
            >
              {topic.name}
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-5)" }}>
              {topic.summary}
            </p>

            {/* Quick Metrics */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Layers size={15} style={{ color: "var(--color-primary)" }} />
                <strong>{subtopicsWithIds.length}</strong> Subtopics
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <HelpCircle size={15} style={{ color: "#f59e0b" }} />
                <strong>{practiceQuestions.length}</strong> Practice MCQs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "var(--space-8) var(--space-4) 0" }}>
        {/* Section A: Concept & Significance */}
        {(topic as any).concept && (
          <section
            style={{
              marginBottom: "var(--space-8)",
              padding: "var(--space-5)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "var(--space-3)" }}>
              <Lightbulb size={20} style={{ color: "var(--color-accent)" }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Core Concept &amp; Exam Relevance
              </h2>
            </div>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              {(topic as any).concept}
            </p>
          </section>
        )}

        {/* Section B: Subtopics & High-Yield Fact Cards */}
        <section style={{ marginBottom: "var(--space-10)" }}>
          <div style={{ marginBottom: "var(--space-5)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              High-Yield Fact Cards &amp; Notes
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Explore structured facts by subtopic with search and verified key highlights.
            </p>
          </div>

          <FactCardViewer subtopics={subtopicsWithIds} />
        </section>

        {/* Section C: Practice MCQs */}
        {practiceQuestions.length > 0 && (
          <section style={{ marginBottom: "var(--space-10)" }}>
            <div style={{ marginBottom: "var(--space-5)" }}>
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
                <HelpCircle size={13} />
                <span>Exam Practice</span>
              </div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
                {topic.name} Practice Questions
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                Reinforce your concepts with authentic questions, immediate feedback, and detailed explanations.
              </p>
            </div>

            <GKPracticeQuestionViewer
              questions={practiceQuestions}
              topicId={topic.id}
              topicName={topic.name}
              category={isNational ? "national" : "world"}
            />
          </section>
        )}

        {/* Section D: Prev / Next Navigation */}
        <nav
          aria-label="Topic navigation"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-4)",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "var(--space-6)",
          }}
        >
          <Link
            href={`/gk/topics/${prevTopic.id}`}
            className="rm-card rm-card-interactive"
            style={{
              padding: "var(--space-4)",
              borderRadius: "var(--radius-lg)",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <ArrowLeft size={13} /> Previous Topic
            </span>
            <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {prevTopic.name}
            </span>
          </Link>

          <Link
            href={`/gk/topics/${nextTopic.id}`}
            className="rm-card rm-card-interactive"
            style={{
              padding: "var(--space-4)",
              borderRadius: "var(--radius-lg)",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "4px",
              textAlign: "right",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              Next Topic <ArrowRight size={13} />
            </span>
            <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {nextTopic.name}
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
