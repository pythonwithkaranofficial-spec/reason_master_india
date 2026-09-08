import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { EXAM_CATEGORIES } from "@/data/categories";
import { ContentService } from "@/lib/content/ContentService";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCategoryAsset } from "@/lib/assets/manifest";
import { Award, ArrowRight, Layers, Building } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export async function generateStaticParams() {
  return EXAM_CATEGORIES.map((c) => ({
    categoryId: c.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const category = EXAM_CATEGORIES.find((c) => c.id.toLowerCase() === categoryId.toLowerCase());
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Reasoning Syllabi & Exams | ReasonMaster India`,
    description: `Complete reasoning syllabus and exam profiles for ${category.name} (${category.examCount} exams).`,
  };
}

export default async function CategoryExamsPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const category = EXAM_CATEGORIES.find((c) => c.id.toLowerCase() === categoryId.toLowerCase());

  if (!category) {
    notFound();
  }

  const exams = await ContentService.getExamsByCategory(categoryId);
  const categoryAsset = getCategoryAsset(category.id);

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-12)" }}>
      <Breadcrumb
        items={[
          { label: "Exam Profiles", href: "/exams" },
          { label: category.name },
        ]}
      />

      {/* Header Banner */}
      <div
        className="rm-card"
        style={{
          padding: "var(--space-8)",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-6)", flexWrap: "wrap" }}>
          {categoryAsset && (
            <Image
              src={categoryAsset.src}
              alt={categoryAsset.alt}
              width={64}
              height={64}
              style={{ borderRadius: "var(--radius-lg)", flexShrink: 0 }}
            />
          )}

          <div style={{ maxWidth: "720px", flex: 1 }}>
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
              <Award size={14} /> {category.name} Sector
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "var(--space-2)" }}>
              {category.name} ({exams.length} Exams)
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid-cards">
        {exams.map((exam) => {
          const highPriorityCount = exam.topicMappings?.filter((m) => m.priority === "high").length || 0;
          const totalTopics = exam.topicMappings?.length || 0;

          return (
            <Link
              key={exam.id}
              href={`/exams/${category.id}/${exam.id}`}
              className="rm-card rm-card-interactive"
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                  <span className="badge badge-accent" style={{ fontWeight: 700 }}>
                    {exam.shortName}
                  </span>

                  <span className="tag" style={{ fontSize: "0.75rem" }}>
                    <Layers size={12} /> {totalTopics} Topics
                  </span>
                </div>

                <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
                  {exam.name}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>
                  <Building size={14} />
                  <span>{exam.conductingBody}</span>
                </div>

                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                  {exam.description}
                </p>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "var(--space-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: "var(--diff-hard-text)", fontWeight: 600 }}>
                  {highPriorityCount} High-Priority Topics
                </span>

                <span style={{ color: "var(--color-primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "2px" }}>
                  View Syllabus <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
