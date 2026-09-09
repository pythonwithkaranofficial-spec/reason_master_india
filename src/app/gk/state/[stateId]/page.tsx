import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ALL_STATES_SUMMARY } from "@/data/gk/state-gk-index";
import { GKContentService } from "@/lib/gk/GKContentService";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FactCardViewer } from "@/components/gk/FactCardViewer";
import { GKPracticeQuestionViewer } from "@/components/gk/GKPracticeQuestionViewer";
import { GKPracticeQuestion } from "@/data/gk/gk-types";
import {
  MapPin,
  Building2,
  Calendar,
  Layers,
  Award,
  User,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  HelpCircle,
} from "lucide-react";

interface StateDetailPageProps {
  params: Promise<{
    stateId: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_STATES_SUMMARY.map((s) => ({
    stateId: s.id,
  }));
}

export async function generateMetadata({ params }: StateDetailPageProps): Promise<Metadata> {
  const { stateId } = await params;
  const summary = GKContentService.getStateSummary(stateId);
  if (!summary) return { title: "State Not Found" };

  return {
    title: `${summary.name} GK — Geography, Polity, Monuments, Culture & Practice MCQs | ReasonMaster India`,
    description: `Complete General Knowledge guide for ${summary.name}. Capital: ${summary.capital}, Districts: ${summary.districtsCount}, verified leadership, 6 subtopics, fact cards, and exam practice MCQs.`,
  };
}

export default async function StateDetailPage({ params }: StateDetailPageProps) {
  const { stateId } = await params;
  const state = await GKContentService.getStateDetail(stateId);

  if (!state) {
    notFound();
  }

  // Prev / Next State navigation
  const currentIndex = ALL_STATES_SUMMARY.findIndex((s) => s.id === stateId);
  const prevIndex = (currentIndex - 1 + ALL_STATES_SUMMARY.length) % ALL_STATES_SUMMARY.length;
  const nextIndex = (currentIndex + 1) % ALL_STATES_SUMMARY.length;
  const prevState = ALL_STATES_SUMMARY[prevIndex];
  const nextState = ALL_STATES_SUMMARY[nextIndex];

  // Map mcqs to GKPracticeQuestion
  const practiceQuestions: GKPracticeQuestion[] = ((state as any).mcqs || []).map(
    (m: any, idx: number) => ({
      id: `gk_state_${state.id}_q${idx + 1}`,
      questionText: m.q,
      options: m.o,
      correctIndex: m.a,
      explanation: m.exp,
      difficulty: "medium",
      lastVerified: state.lastVerified,
    })
  );

  const isUT = state.type === "ut";

  return (
    <div style={{ paddingBottom: "var(--space-12)" }}>
      {/* 1. Header Section */}
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
              { label: "States & UTs", href: "/gk/state" },
              { label: state.name },
            ]}
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            {/* Badges Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "var(--space-2)",
                marginBottom: "var(--space-3)",
              }}
            >
              <span
                className="tag"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  backgroundColor: isUT ? "rgba(245, 158, 11, 0.12)" : "var(--color-primary-subtle)",
                  color: isUT ? "#d97706" : "var(--color-primary)",
                  borderColor: isUT ? "rgba(245, 158, 11, 0.25)" : "var(--border-color)",
                }}
              >
                {isUT ? "Union Territory" : "State of India"}
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#059669",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  padding: "3px 8px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <ShieldCheck size={14} />
                Verified As of {state.lastVerified}
              </span>
            </div>

            {/* State Title */}
            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: "var(--space-2)",
              }}
            >
              {state.name}
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                maxWidth: "900px",
                marginBottom: "var(--space-6)",
              }}
            >
              {state.summary}
            </p>

            {/* Key Fact Pills / Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "2px" }}>Capital</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{state.capital}</div>
              </div>

              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "2px" }}>Formation Date</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{state.formationDate}</div>
              </div>

              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "2px" }}>Area &amp; Districts</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {state.areaSqKm.toLocaleString()} km² • {state.districtsCount} Districts
                </div>
              </div>

              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "2px" }}>High Court</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {state.highCourt}
                </div>
              </div>

              {state.chiefMinister && (
                <div
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "2px" }}>Chief Minister</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{state.chiefMinister}</div>
                </div>
              )}

              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "2px" }}>{state.governorTitle}</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{state.governorOrLtGovernor}</div>
              </div>
            </div>

            {/* Official State Symbols Banner */}
            {state.stateSymbols && (
              <div
                style={{
                  marginTop: "var(--space-4)",
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-primary-subtle)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "var(--space-4)",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>Official Symbols:</span>
                <span><strong>Animal:</strong> {state.stateSymbols.animal || "N/A"}</span>
                <span><strong>Bird:</strong> {state.stateSymbols.bird || "N/A"}</span>
                <span><strong>Flower:</strong> {state.stateSymbols.flower || "N/A"}</span>
                <span><strong>Tree:</strong> {state.stateSymbols.tree || "N/A"}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Main Content Sections */}
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "var(--space-8) var(--space-4) 0" }}>
        {/* Section A: Standardized Subtopics & Fact Cards */}
        <section style={{ marginBottom: "var(--space-10)" }}>
          <div style={{ marginBottom: "var(--space-5)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              Standardized State Subtopics &amp; High-Yield Facts
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Explore facts organized across Geography, History &amp; Culture, Government &amp; Polity, Economy &amp; Agriculture, Places &amp; Tourism, and State Schemes.
            </p>
          </div>

          <FactCardViewer subtopics={state.subtopics} />
        </section>

        {/* Section B: State GK Practice Questions */}
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
              {state.name} Practice Questions
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Test your recall on high-frequency questions frequently asked in SSC, Railways, and State PSC examinations.
            </p>
          </div>

          <GKPracticeQuestionViewer
            questions={practiceQuestions}
            topicId={state.id}
            topicName={state.name}
            category="state"
          />
        </section>

        {/* Section C: Prev / Next State Navigation */}
        <nav
          aria-label="State to state navigation"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-4)",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "var(--space-6)",
          }}
        >
          <Link
            href={`/gk/state/${prevState.id}`}
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
              <ArrowLeft size={13} /> Previous State
            </span>
            <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {prevState.name}
            </span>
          </Link>

          <Link
            href={`/gk/state/${nextState.id}`}
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
              Next State <ArrowRight size={13} />
            </span>
            <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {nextState.name}
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
