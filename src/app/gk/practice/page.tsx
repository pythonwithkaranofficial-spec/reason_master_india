import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  Zap,
  MapPin,
  Landmark,
  Globe,
  Sliders,
  Award,
  ArrowRight,
  Clock,
  HelpCircle,
  BookmarkCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "GK Practice Arena — Mock Tests & Custom Drills | ReasonMaster India",
  description:
    "Take timed GK mock tests and practice drills for SSC CGL, Railways, State PSC, and UPSC. Choose from State GK, Indian GK, World GK, or create custom practice tests.",
};

export default function GKPracticeHubPage() {
  const presets = [
    {
      id: "state_mock",
      title: "State GK Mock Test",
      category: "state",
      count: 20,
      timeMins: 15,
      icon: MapPin,
      color: "#d97706",
      bgColor: "rgba(245, 158, 11, 0.12)",
      description: "20 high-yield questions on Indian states, capitals, rivers, monuments, and cultural traditions.",
      href: "/gk/practice/session?category=state&count=20&mode=instant",
    },
    {
      id: "national_mock",
      title: "Indian GK Drill",
      category: "national",
      count: 20,
      timeMins: 15,
      icon: Landmark,
      color: "#059669",
      bgColor: "rgba(16, 185, 129, 0.12)",
      description: "Indian History, Polity & Constitution, Geography, ISRO space milestones, and National Parks.",
      href: "/gk/practice/session?category=national&count=20&mode=instant",
    },
    {
      id: "world_mock",
      title: "World GK Drill",
      category: "world",
      count: 15,
      timeMins: 12,
      icon: Globe,
      color: "#4f46e5",
      bgColor: "rgba(99, 102, 241, 0.12)",
      description: "International organizations, world geography, straits, capitals, and currencies.",
      href: "/gk/practice/session?category=world&count=15&mode=instant",
    },
    {
      id: "full_comprehensive_mock",
      title: "Full GK Comprehensive Exam",
      category: "all",
      count: 30,
      timeMins: 25,
      icon: Award,
      color: "var(--color-primary)",
      bgColor: "var(--color-primary-subtle)",
      description: "Balanced 30-question simulation mixing State GK, Indian Polity, History, Economy, and World Affairs.",
      href: "/gk/practice/session?category=all&count=30&mode=review",
    },
  ];

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
            { label: "Practice Arena" },
          ]}
        />

        <div style={{ marginTop: "var(--space-4)", maxWidth: "800px" }}>
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
            <Zap size={13} />
            <span>Test Simulator</span>
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
            GK Practice Arena &amp; Mock Tests
          </h1>

          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Launch instant drills or configure custom mock tests with timed countdowns, immediate explanations, and detailed score analytics.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div>
        {/* Quick Configurator Card */}
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
            marginBottom: "var(--space-8)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ maxWidth: "650px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "var(--space-2)" }}>
              <Sliders size={20} style={{ color: "var(--color-primary)" }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Custom Practice Test Configurator
              </h2>
            </div>
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Choose your exact domain (State, Indian, World), select specific states or topics, adjust question count (10 to 50), and toggle instant feedback or full exam review mode.
            </p>
          </div>

          <Link
            href="/gk/practice/configure"
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0.65rem 1.25rem", whiteSpace: "nowrap" }}
          >
            <Sliders size={16} /> Configure Custom Test
          </Link>
        </div>

        {/* Presets Grid */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
            Featured Practice Drills
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {presets.map((preset) => {
              const Icon = preset.icon;
              return (
                <div
                  key={preset.id}
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
                        width: "44px",
                        height: "44px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: preset.bgColor,
                        color: preset.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
                      {preset.title}
                    </h3>

                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                      {preset.description}
                    </p>

                    <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <HelpCircle size={13} /> {preset.count} Questions
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={13} /> {preset.timeMins} Mins
                      </span>
                    </div>
                  </div>

                  <Link
                    href={preset.href}
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center", gap: "6px" }}
                  >
                    <span>Start Test</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links Row: Bookmarks & Diagnostics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          <Link
            href="/gk/bookmarks"
            className="rm-card rm-card-interactive"
            style={{
              padding: "var(--space-4)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary-subtle)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BookmarkCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>
                Bookmarked Questions
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Review saved facts and challenging practice MCQs
              </p>
            </div>
          </Link>

          <Link
            href="/gk/stats"
            className="rm-card rm-card-interactive"
            style={{
              padding: "var(--space-4)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TrendingUp size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>
                GK Diagnostic Statistics
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Track overall accuracy, category breakdown, and weak topics
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
