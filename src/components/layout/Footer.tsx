import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "@/lib/assets/manifest";
import { Brain, Shield, Zap, Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border-color)",
        padding: "var(--space-12) 0 var(--space-8)",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-8)",
            marginBottom: "var(--space-8)",
          }}
        >
          {/* Col 1: Brand & Mission */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Image
                src={ASSETS.brand.logoMark.src}
                alt={ASSETS.brand.logoMark.alt}
                width={32}
                height={32}
                style={{
                  borderRadius: "var(--radius-sm)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "var(--text-primary)",
                }}
              >
                ReasonMaster India
              </span>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
              The comprehensive reasoning preparation platform for Indian competitive exams.
              Covering 39 topics, 64 exams, and a curated repository of 19,500 high-yield MCQs.
            </p>

            <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
              <span className="tag" style={{ fontSize: "0.75rem" }}>
                <Shield size={12} /> 100% Client-Side Privacy
              </span>
            </div>
          </div>

          {/* Col 2: Reasoning Modules */}
          <div>
            <h4
              style={{
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--space-4)",
                color: "var(--text-primary)",
              }}
            >
              Reasoning Hubs
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "0.9rem" }}>
              <li>
                <Link href="/verbal" style={{ color: "var(--text-secondary)" }}>
                  Verbal Reasoning (25 Topics)
                </Link>
              </li>
              <li>
                <Link href="/nonverbal" style={{ color: "var(--text-secondary)" }}>
                  Non-Verbal Reasoning (14 Topics)
                </Link>
              </li>
              <li>
                <Link href="/practice" style={{ color: "var(--text-secondary)" }}>
                  MCQ Practice Arena (19,500 Qs)
                </Link>
              </li>
              <li>
                <Link href="/stats" style={{ color: "var(--text-secondary)" }}>
                  Performance & Weak Topics
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" style={{ color: "var(--text-secondary)" }}>
                  Bookmarked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Exam Target Hubs */}
          <div>
            <h4
              style={{
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--space-4)",
                color: "var(--text-primary)",
              }}
            >
              Target Exams
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "0.9rem" }}>
              <li>
                <Link href="/exams/ssc" style={{ color: "var(--text-secondary)" }}>
                  SSC Exams (CGL, CHSL, CPO, MTS, GD)
                </Link>
              </li>
              <li>
                <Link href="/exams/banking" style={{ color: "var(--text-secondary)" }}>
                  Banking & Regulatory (IBPS, SBI, RBI, NABARD)
                </Link>
              </li>
              <li>
                <Link href="/exams/railway" style={{ color: "var(--text-secondary)" }}>
                  Railways (RRB NTPC, Group D, ALP)
                </Link>
              </li>
              <li>
                <Link href="/exams/defence" style={{ color: "var(--text-secondary)" }}>
                  Defence (NDA, CDS, AFCAT, CAPF)
                </Link>
              </li>
              <li>
                <Link href="/exams/state_psc" style={{ color: "var(--text-secondary)" }}>
                  State PSCs & Civil Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Utilities */}
          <div>
            <h4
              style={{
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--space-4)",
                color: "var(--text-primary)",
              }}
            >
              Preferences
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "0.9rem" }}>
              <li>
                <Link href="/settings" style={{ color: "var(--text-secondary)" }}>
                  Display & Practice Settings
                </Link>
              </li>
              <li>
                <Link href="/settings#data-management" style={{ color: "var(--text-secondary)" }}>
                  Data Management & Reset
                </Link>
              </li>
              <li>
                <Link href="/settings#about" style={{ color: "var(--text-secondary)" }}>
                  About & Methodological Design
                </Link>
              </li>
              <li>
                <Link href="/settings#privacy" style={{ color: "var(--text-secondary)" }}>
                  Privacy Statement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: "var(--space-6)",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          <div>
            © {new Date().getFullYear()} ReasonMaster India. Built for aspirants across India.
          </div>
          <div>
            No ads • No tracking • Fast client-side storage
          </div>
        </div>
      </div>
    </footer>
  );
}
