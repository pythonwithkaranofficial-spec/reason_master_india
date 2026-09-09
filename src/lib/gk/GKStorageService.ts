"use client";

import {
  GKSessionResult,
  GKBookmarkItem,
  GKUserQuestionAttempt,
  GKUserSettings,
  GKTopicProgressSummary,
} from "@/data/gk/gk-types";

const GK_DB_NAME = "ReasonMasterGKDB";
const GK_DB_VERSION = 1;

const STORE_GK_SESSIONS = "gk_sessions";
const STORE_GK_ATTEMPTS = "gk_attempts";
const STORE_GK_BOOKMARKS = "gk_bookmarks";

const GK_SETTINGS_KEY = "gk_user_settings";
const ACTIVE_DOMAIN_KEY = "rm_active_domain";

const DEFAULT_GK_SETTINGS: GKUserSettings = {
  instantFeedback: true,
  soundEffects: false,
  autoNextQuestion: false,
  defaultQuestionCount: 10,
  preferredCategory: "all",
  quizLanguage: "en",
};

/**
 * Isolated IndexedDB database manager for General Knowledge (GK).
 * Completely separate from ReasonMasterDB with zero shared mutable state.
 */
class GKIndexedDBStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("IndexedDB is only available in browser"));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(GK_DB_NAME, GK_DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // GK Sessions store
          if (!db.objectStoreNames.contains(STORE_GK_SESSIONS)) {
            const sessionsStore = db.createObjectStore(STORE_GK_SESSIONS, { keyPath: "id" });
            sessionsStore.createIndex("timestamp", "timestamp", { unique: false });
          }

          // GK Attempts store
          if (!db.objectStoreNames.contains(STORE_GK_ATTEMPTS)) {
            const attemptsStore = db.createObjectStore(STORE_GK_ATTEMPTS, {
              keyPath: "id",
              autoIncrement: true,
            });
            attemptsStore.createIndex("questionId", "questionId", { unique: false });
            attemptsStore.createIndex("topicId", "topicId", { unique: false });
            attemptsStore.createIndex("gkCategory", "gkCategory", { unique: false });
            attemptsStore.createIndex("timestamp", "timestamp", { unique: false });
          }

          // GK Bookmarks store
          if (!db.objectStoreNames.contains(STORE_GK_BOOKMARKS)) {
            const bookmarksStore = db.createObjectStore(STORE_GK_BOOKMARKS, { keyPath: "questionId" });
            bookmarksStore.createIndex("savedAt", "savedAt", { unique: false });
            bookmarksStore.createIndex("topicId", "topicId", { unique: false });
            bookmarksStore.createIndex("gkCategory", "gkCategory", { unique: false });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return this.dbPromise;
  }

  // --- GK Session Methods ---
  async saveSession(session: GKSessionResult): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_GK_SESSIONS, STORE_GK_ATTEMPTS], "readwrite");
      const sessionStore = tx.objectStore(STORE_GK_SESSIONS);
      const attemptStore = tx.objectStore(STORE_GK_ATTEMPTS);

      sessionStore.put(session);

      for (const attempt of session.attempts || []) {
        attemptStore.add(attempt);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAllSessions(): Promise<GKSessionResult[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_GK_SESSIONS, "readonly");
      const store = tx.objectStore(STORE_GK_SESSIONS);
      const request = store.getAll();

      request.onsuccess = () => {
        const results: GKSessionResult[] = request.result || [];
        results.sort((a, b) => b.timestamp - a.timestamp);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // --- GK Attempts Methods ---
  async getAllAttempts(): Promise<GKUserQuestionAttempt[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_GK_ATTEMPTS, "readonly");
      const store = tx.objectStore(STORE_GK_ATTEMPTS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAttempt(attempt: GKUserQuestionAttempt): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_GK_ATTEMPTS, "readwrite");
      const store = tx.objectStore(STORE_GK_ATTEMPTS);
      store.add(attempt);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAttemptsForTopic(topicId: string): Promise<GKUserQuestionAttempt[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_GK_ATTEMPTS, "readonly");
      const store = tx.objectStore(STORE_GK_ATTEMPTS);
      const index = store.index("topicId");
      const request = index.getAll(topicId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // --- GK Bookmarks Methods ---
  async saveBookmark(bookmark: GKBookmarkItem): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_GK_BOOKMARKS, "readwrite");
      const store = tx.objectStore(STORE_GK_BOOKMARKS);
      store.put(bookmark);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async removeBookmark(questionId: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_GK_BOOKMARKS, "readwrite");
      const store = tx.objectStore(STORE_GK_BOOKMARKS);
      store.delete(questionId);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async isBookmarked(questionId: string): Promise<boolean> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_GK_BOOKMARKS, "readonly");
      const store = tx.objectStore(STORE_GK_BOOKMARKS);
      const request = store.get(questionId);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllBookmarks(): Promise<GKBookmarkItem[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_GK_BOOKMARKS, "readonly");
      const store = tx.objectStore(STORE_GK_BOOKMARKS);
      const request = store.getAll();

      request.onsuccess = () => {
        const results: GKBookmarkItem[] = request.result || [];
        results.sort((a, b) => b.savedAt - a.savedAt);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

const gkStorage = new GKIndexedDBStorage();

export const GKStorageService = {
  // Session methods
  saveSession: (session: GKSessionResult) => gkStorage.saveSession(session),
  getAllSessions: () => gkStorage.getAllSessions(),

  // Attempt methods
  saveAttempt: (attempt: GKUserQuestionAttempt) => gkStorage.saveAttempt(attempt),
  getAllAttempts: () => gkStorage.getAllAttempts(),
  getAttemptsForTopic: (topicId: string) => gkStorage.getAttemptsForTopic(topicId),

  // Bookmark methods
  addBookmark: (bookmark: GKBookmarkItem) => gkStorage.saveBookmark(bookmark),
  saveBookmark: (bookmark: GKBookmarkItem) => gkStorage.saveBookmark(bookmark),
  removeBookmark: (questionId: string) => gkStorage.removeBookmark(questionId),
  isBookmarked: (questionId: string) => gkStorage.isBookmarked(questionId),
  getAllBookmarks: () => gkStorage.getAllBookmarks(),

  // Local Settings (Namespaced to gk_user_settings)
  getSettings(): GKUserSettings {
    if (typeof window === "undefined") return DEFAULT_GK_SETTINGS;
    try {
      const stored = localStorage.getItem(GK_SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_GK_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_GK_SETTINGS;
  },

  saveSettings(settings: Partial<GKUserSettings>): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(GK_SETTINGS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  // Active domain preference ("reasoning" | "gk")
  getActiveDomain(): "reasoning" | "gk" {
    if (typeof window === "undefined") return "reasoning";
    try {
      const saved = localStorage.getItem(ACTIVE_DOMAIN_KEY);
      if (saved === "gk" || saved === "reasoning") return saved;
    } catch {
      // ignore
    }
    return "reasoning";
  },

  setActiveDomain(domain: "reasoning" | "gk"): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(ACTIVE_DOMAIN_KEY, domain);
    } catch {
      // ignore
    }
  },
};
