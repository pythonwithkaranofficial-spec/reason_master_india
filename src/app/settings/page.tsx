"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { useUserSettings } from "@/lib/settings/SettingsProvider";
import { StorageService } from "@/lib/persistence/StorageService";
import { UserSettings } from "@/types/models";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Trash2,
  Shield,
  Brain,
  Info,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { mode, setThemeMode } = useTheme();
  const { settings, updateSetting } = useUserSettings();
  const [confirmAction, setConfirmAction] = useState<"progress" | "bookmarks" | "all" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    updateSetting(key, value);
    showToast("Preferences updated.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmReset = async () => {
    if (confirmAction === "progress") {
      await StorageService.clearProgress();
      showToast("Progress history cleared successfully.");
    } else if (confirmAction === "bookmarks") {
      await StorageService.clearBookmarks();
      showToast("Bookmarks cleared successfully.");
    } else if (confirmAction === "all") {
      await StorageService.clearAllData();
      showToast("All local app data has been reset.");
    }
    setConfirmAction(null);
  };

  return (
    <div className="container" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-16)", maxWidth: "800px" }}>
      <Breadcrumb items={[{ label: "Settings & About" }]} />

      {/* Header Banner */}
      <div
        className="rm-card"
        style={{
          padding: "var(--space-8)",
          marginBottom: "var(--space-8)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
          <SettingsIcon size={20} color="var(--color-primary)" />
          <h1 style={{ fontSize: "1.8rem" }}>Platform Settings</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Customize your interface theme, practice preferences, and local data persistence.
        </p>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "var(--space-6)",
            right: "var(--space-6)",
            zIndex: 100,
            backgroundColor: "var(--color-primary)",
            color: "#ffffff",
            padding: "var(--space-3) var(--space-5)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          <Check size={16} /> {toastMessage}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        {/* 1. Theme & Appearance */}
        <section className="rm-card">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-2)" }}>
            Theme & Appearance
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
            Select your preferred visual mode or allow automatic transition based on local daylight (06:00 to 18:00).
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-3)" }}>
            {[
              { id: "auto", label: "Automatic", desc: "Day/Night schedule (6 AM - 6 PM)", icon: Sparkles },
              { id: "light", label: "Light Mode", desc: "Clean academic navy & slate", icon: Sun },
              { id: "dark", label: "Dark Mode", desc: "High-contrast night reading", icon: Moon },
            ].map((t) => {
              const isSelected = mode === t.id;
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  onClick={() => setThemeMode(t.id as any)}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-color)",
                    backgroundColor: isSelected ? "var(--color-primary-subtle)" : "var(--bg-surface)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "4px" }}>
                    <Icon size={18} color={isSelected ? "var(--color-primary)" : "var(--text-muted)"} />
                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? "var(--color-primary)" : "var(--text-primary)" }}>
                      {t.label}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {t.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Practice Preferences */}
        <section className="rm-card">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-2)" }}>
            Practice Preferences
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
            Configure default question counts and feedback behaviors for new tests.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {/* Default Question Count */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Default Test Length</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Number of questions in quick launch sessions</div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                {([10, 20, 30] as const).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => handleUpdateSetting("defaultQuestionCount", cnt)}
                    className={`btn btn-sm ${settings.defaultQuestionCount === cnt ? "btn-primary" : "btn-secondary"}`}
                  >
                    {cnt} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Feedback Default */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "var(--space-4)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Instant Solution Reveal</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Show correct answer & explanation immediately on selection</div>
              </div>

              <input
                type="checkbox"
                checked={settings.instantFeedback}
                onChange={(e) => handleUpdateSetting("instantFeedback", e.target.checked)}
                style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
              />
            </div>
          </div>
        </section>

        {/* 3. Data & Storage Management */}
        <section className="rm-card" id="data-management">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-2)" }}>
            Data & Privacy Management
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
            All your test sessions, accuracy history, and bookmarks are stored securely in your browser&apos;s IndexedDB.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
            <button
              onClick={() => setConfirmAction("progress")}
              className="btn btn-secondary"
            >
              <Trash2 size={16} /> Reset Progress History
            </button>

            <button
              onClick={() => setConfirmAction("bookmarks")}
              className="btn btn-secondary"
            >
              <Trash2 size={16} /> Clear Saved Bookmarks
            </button>

            <button
              onClick={() => setConfirmAction("all")}
              className="btn btn-danger"
            >
              <Trash2 size={16} /> Reset All Data
            </button>
          </div>
        </section>

        {/* 4. About ReasonMaster India */}
        <section className="rm-card" id="about">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
            <Brain size={22} color="var(--color-primary)" />
            <h2 style={{ fontSize: "1.25rem" }}>About ReasonMaster India</h2>
          </div>

          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-3)" }}>
            ReasonMaster India is a pedagogical platform designed for Indian competitive exam aspirants (SSC, Banking, Railways, Defence, Police, and State PSCs).
          </p>

          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
            Built with a shared-topic architectural paradigm: rather than creating fragmented, duplicate syllabus pools,
            every reasoning concept is mapped universally to all 64 target examinations with weighted priority vectors.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-3)", textAlign: "center" }}>
            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)" }}>39</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Master Topics</div>
            </div>

            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)" }}>64</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Exam Profiles</div>
            </div>

            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)" }}>19,500</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Curated MCQs</div>
            </div>

            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary)" }}>207</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Worked Solutions</div>
            </div>
          </div>
        </section>

        {/* 5. Privacy Statement */}
        <section className="rm-card" id="privacy">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
            <Shield size={20} color="var(--color-success)" />
            <h2 style={{ fontSize: "1.25rem" }}>Privacy & Data Guarantee</h2>
          </div>

          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            ReasonMaster India operates under a strict privacy-first model:
          </p>

          <ul style={{ paddingLeft: "var(--space-5)", marginTop: "var(--space-2)", display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            <li style={{ listStyleType: "disc" }}>
              <strong>Zero Data Harvesting:</strong> Your scores, bookmarks, question attempts, and settings remain 100% on your local device.
            </li>
            <li style={{ listStyleType: "disc" }}>
              <strong>No Account Required:</strong> Immediate access without passwords, email verifications, or invasive phone number prompts.
            </li>
            <li style={{ listStyleType: "disc" }}>
              <strong>No Advertising Trackers:</strong> Clean, distraction-free environment optimized for high-intensity study sessions.
            </li>
          </ul>
        </section>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={confirmAction !== null}
        title={
          confirmAction === "progress"
            ? "Reset Progress History?"
            : confirmAction === "bookmarks"
            ? "Clear All Bookmarks?"
            : "Reset All Local Data?"
        }
        message={
          confirmAction === "progress"
            ? "This will erase all past session attempts, accuracy calculations, and weak-topic diagnostics. This action cannot be undone."
            : confirmAction === "bookmarks"
            ? "This will delete all questions saved in your revision vault. This action cannot be undone."
            : "This will completely wipe your local database including test history, bookmarks, and custom preferences."
        }
        confirmLabel={
          confirmAction === "progress"
            ? "Reset Progress"
            : confirmAction === "bookmarks"
            ? "Clear Bookmarks"
            : "Reset All Data"
        }
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
