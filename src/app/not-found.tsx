import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "@/lib/assets/manifest";
import { ArrowLeft, Home, BookOpen, Award, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-16)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Image
          src={ASSETS.states.error404.src}
          alt={ASSETS.states.error404.alt}
          width={140}
          height={140}
          style={{ display: "block" }}
        />
      </div>

      <span className="badge badge-primary" style={{ marginBottom: "var(--space-3)" }}>
        Error 404
      </span>

      <h1 style={{ marginBottom: "var(--space-3)", fontSize: "clamp(2rem, 4vw, 2.5rem)" }}>
        Page Not Found
      </h1>

      <p
        style={{
          maxWidth: "500px",
          color: "var(--text-secondary)",
          fontSize: "1.05rem",
          marginBottom: "var(--space-8)",
        }}
      >
        The reasoning topic, exam syllabus, or page you are looking for does not exist or has been relocated.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          justifyContent: "center",
          marginBottom: "var(--space-12)",
        }}
      >
        <Link href="/" className="btn btn-primary">
          <Home size={16} /> Back to Dashboard
        </Link>
        <Link href="/verbal" className="btn btn-secondary">
          <BookOpen size={16} /> Verbal Topics
        </Link>
        <Link href="/exams" className="btn btn-secondary">
          <Award size={16} /> Exam Profiles
        </Link>
        <Link href="/practice" className="btn btn-accent">
          <Zap size={16} /> MCQ Practice
        </Link>
      </div>

      {/* Suggested Quick Links */}
      <div
        className="rm-card"
        style={{
          maxWidth: "600px",
          width: "100%",
          textAlign: "left",
          padding: "var(--space-6)",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-3)" }}>
          Popular Reasoning Topics
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {[
            { name: "Syllogism", href: "/topics/syllogism" },
            { name: "Coding & Decoding", href: "/topics/coding_decoding" },
            { name: "Blood Relations", href: "/topics/blood_relations" },
            { name: "Direction Sense", href: "/topics/direction_sense" },
            { name: "Cubes & Dice", href: "/topics/cubes_and_dice" },
            { name: "Non-Verbal Series", href: "/topics/nonverbal_series" },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="tag" style={{ padding: "0.4rem 0.75rem" }}>
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
