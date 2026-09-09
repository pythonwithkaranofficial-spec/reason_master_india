import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ALL_STATES_SUMMARY } from "@/data/gk/state-gk-index";
import { ALL_NATIONAL_TOPICS_SUMMARY } from "@/data/gk/national-gk-index";
import { ALL_WORLD_TOPICS_SUMMARY } from "@/data/gk/world-gk-index";
import { StateCard } from "@/components/gk/StateCard";
import { GKTopicCard } from "@/components/gk/GKTopicCard";
import {
  MapPin,
  Landmark,
  Globe,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "General Knowledge (GK) — 36 States & UTs, Indian GK & World GK | ReasonMaster India",
  description:
    "Master General Knowledge for competitive exams (UPSC, SSC CGL, Railways, State PSC, Police, Banking). Authoritative facts for all 28 Indian States, 8 UTs, 11 Indian GK topics, and 6 World GK topics with verified officeholders and exam MCQs.",
};

export default function GKHomePage() {
  const featuredStates = ALL_STATES_SUMMARY.slice(0, 6);
  const featuredNational = ALL_NATIONAL_TOPICS_SUMMARY.slice(0, 4);
  const featuredWorld = ALL_WORLD_TOPICS_SUMMARY.slice(0, 3);

  return (
    <div style={{ paddingBottom: "var(--space-12)" }}>
      {/* 1. Hero Section */}
      <section
        style={{
          padding: "var(--space-8) 0 var(--space-6)",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-4)" }}>
          <div style={{ maxWidth: "800px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
                fontSize: "0.82rem",
                fontWeight: 600,
                marginBottom: "var(--space-3)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Sparkles size={14} />
              <span>General Knowledge (GK) Module</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "var(--space-3)",
              }}
            >
              Authoritative <span style={{ color: "var(--color-primary)" }}>General Knowledge</span> for Competitive Exams
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                marginBottom: "var(--space-6)",
              }}
            >
              Complete, verified factual coverage across all <strong>28 Indian States & 8 UTs</strong>, <strong>11 Indian GK</strong> disciplines, and <strong>6 World GK</strong> topics. Every officeholder, scheme, and record carries an authoritative verification badge.
            </p>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "var(--space-3)",
                marginBottom: "var(--space-6)",
              }}
            >
              <div
                style={{
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-primary)" }}>36</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>States & UTs</div>
              </div>
              <div
                style={{
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981" }}>17</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>National & World Topics</div>
              </div>
              <div
                style={{
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f59e0b" }}>6</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Standard Subtopics / State</div>
              </div>
              <div
                style={{
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface-elevated, var(--bg-surface))",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#6366f1" }}>100%</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Date-Verified Facts</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
              <Link href="/gk/state" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={16} /> Explore State GK
              </Link>
              <Link href="/gk/practice" className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Zap size={16} /> GK Practice Arena
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three GK Pillars Section */}
      <section style={{ padding: "var(--space-8) 0" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-4)" }}>
          <div style={{ marginBottom: "var(--space-6)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              Core GK Sub-Domains
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Explore structured GK modules designed specifically for syllabus patterns of SSC, UPSC, and State examinations.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {/* Pillar 1: State GK */}
            <div
              className="rm-card"
              style={{
                padding: "var(--space-5)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(245, 158, 11, 0.12)",
                    color: "#d97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <MapPin size={26} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
                  State GK (36 States & UTs)
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                  All 28 States and 8 Union Territories with 6 standardized subtopics: Geography, History & Culture, Polity, Economy, Places & Monuments, and Schemes & Awards.
                </p>
              </div>
              <Link href="/gk/state" className="btn btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}>
                <span>Browse All 36 States</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Pillar 2: Indian GK */}
            <div
              className="rm-card"
              style={{
                padding: "var(--space-5)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(16, 185, 129, 0.12)",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <Landmark size={26} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
                  Indian GK (11 Topics)
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                  National heritage, Indian Polity & Constitution, Indian Geography, Economy, ISRO Science & Tech, Sports, Books & Authors, Awards, and National Parks.
                </p>
              </div>
              <Link href="/gk/national" className="btn btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}>
                <span>Explore Indian GK Topics</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Pillar 3: World GK */}
            <div
              className="rm-card"
              style={{
                padding: "var(--space-5)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(99, 102, 241, 0.12)",
                    color: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <Globe size={26} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
                  World GK (6 Topics)
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                  Global geography, Countries/Capitals/Currencies, International Organizations (UN, IMF, World Bank, WTO), World History milestones, and Global Sports.
                </p>
              </div>
              <Link href="/gk/world" className="btn btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}>
                <span>Explore World GK Topics</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured States & UTs Grid */}
      <section style={{ padding: "var(--space-6) 0" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-4)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-5)",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Featured State Profiles
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Authoritative data cards verified with Census and official state gazettes
              </p>
            </div>

            <Link
              href="/gk/state"
              style={{
                fontSize: "0.88rem",
                color: "var(--color-primary)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              View All 36 <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {featuredStates.map((state) => (
              <StateCard key={state.id} state={state} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Indian GK Topics */}
      <section style={{ padding: "var(--space-6) 0" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-4)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-5)",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Indian GK Highlights
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Core subjects required across SSC CGL, CHSL, Railways & State PSCs
              </p>
            </div>

            <Link
              href="/gk/national"
              style={{
                fontSize: "0.88rem",
                color: "var(--color-primary)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              View All 11 <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {featuredNational.map((topic) => (
              <GKTopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Practice Arena CTA Banner */}
      <section style={{ padding: "var(--space-6) 0" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-4)" }}>
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
              padding: "var(--space-8) var(--space-6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "var(--space-4)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={28} />
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1.2 }}>
              Ready to Test Your General Knowledge?
            </h2>

            <p style={{ maxWidth: "600px", fontSize: "1.05rem", opacity: 0.95, lineHeight: 1.5 }}>
              Take targeted State GK mocks, Indian Polity drills, or comprehensive full-length GK practice tests with instant explanations.
            </p>

            <Link
              href="/gk/practice"
              className="btn"
              style={{
                backgroundColor: "#ffffff",
                color: "var(--color-primary)",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "var(--radius-md)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              Start GK Practice Test <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
