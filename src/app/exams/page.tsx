import React from "react";
import Link from "next/link";
import Image from "next/image";
import { EXAM_CATEGORIES } from "@/data/categories";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ASSETS } from "@/lib/assets/manifest";
import { Award, Landmark, Building2, Train, ShieldCheck, Shield, BadgeAlert, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Exam Profiles & Syllabus Mappings — 64 Indian Exams | ReasonMaster India",
  description: "Comprehensive reasoning syllabus weightages and prioritized topic roadmaps for 64 premier Indian competitive examinations.",
};

const categoryIcons: Record<string, React.ElementType> = {
  ssc: Landmark,
  banking: Building2,
  railway: Train,
  insurance: ShieldCheck,
  defence: Shield,
  police: BadgeAlert,
  central_govt: Briefcase,
  state_psc: GraduationCap,
};

export default function ExamsCategoriesPage() {
  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-12)" }}>
      <Breadcrumb items={[{ label: "Exam Profiles" }]} />

      {/* Header Banner */}
      <div
        className="rm-card"
        style={{
          padding: "var(--space-8)",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ maxWidth: "720px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "0.25rem 0.75rem",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-primary-subtle)",
              color: "var(--color-primary)",
              fontSize: "0.8rem",
              fontWeight: 700,
              marginBottom: "var(--space-3)",
            }}
          >
            <Award size={14} /> Comprehensive Exam Architecture
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "var(--space-2)" }}>
            64 Competitive Exam Profiles
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
            Explore the exact reasoning syllabus, topic frequency distributions, and high-priority preparation roadmaps
            curated for 8 major Indian examination sectors.
          </p>
        </div>
      </div>

      {/* 8 Categories Grid */}
      <div className="grid-cards">
        {EXAM_CATEGORIES.map((category) => {
          const Icon = categoryIcons[category.id] || Award;
          const categoryAsset = ASSETS.categories[category.id];

          return (
            <Link
              key={category.id}
              href={`/exams/${category.id}`}
              className="rm-card rm-card-interactive"
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
                  {categoryAsset ? (
                    <Image
                      src={categoryAsset.src}
                      alt={categoryAsset.alt}
                      width={48}
                      height={48}
                      style={{ borderRadius: "var(--radius-md)" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--color-primary-subtle)",
                        color: "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={24} />
                    </div>
                  )}

                  <span className="badge badge-primary">{category.examCount} Exams</span>
                </div>

                <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
                  {category.name}
                </h3>

                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                  {category.description}
                </p>

                <div style={{ marginBottom: "var(--space-4)" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "var(--space-1)" }}>
                    Conducting Bodies:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
                    {category.conductingBodies.map((body, bIdx) => (
                      <span key={bIdx} className="tag" style={{ fontSize: "0.75rem" }}>
                        {body}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "var(--space-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                <span>Browse {category.shortName} Exams</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
