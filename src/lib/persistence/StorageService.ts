"use client";

import {
  SessionResult,
  BookmarkItem,
  UserQuestionAttempt,
  UserSettings,
  TopicProgressSummary,
} from "@/types/models";

const DB_NAME = "ReasonMasterDB";
const DB_VERSION = 1;

const STORE_SESSIONS = "sessions";
const STORE_ATTEMPTS = "attempts";
const STORE_BOOKMARKS = "bookmarks";

const SETTINGS_KEY = "rm_user_settings";

const DEFAULT_SETTINGS: UserSettings = {
  themeMode: "auto",
  fontSize: "normal",
  instantFeedback: true,
  soundEffects: false,
  autoNextQuestion: false,
  defaultQuestionCount: 10,
};

/**
 * IndexedDB database initiator with promise wrappers
 */
class IndexedDBStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("IndexedDB is only available in browser"));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Sessions store
          if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
            const sessionsStore = db.createObjectStore(STORE_SESSIONS, { keyPath: "id" });
            sessionsStore.createIndex("timestamp", "timestamp", { unique: false });
          }

          // Attempts store
          if (!db.objectStoreNames.contains(STORE_ATTEMPTS)) {
            const attemptsStore = db.createObjectStore(STORE_ATTEMPTS, {
              keyPath: "id",
              autoIncrement: true,
            });
            attemptsStore.createIndex("questionId", "questionId", { unique: false });
            attemptsStore.createIndex("topicId", "topicId", { unique: false });
            attemptsStore.createIndex("timestamp", "timestamp", { unique: false });
          }

          // Bookmarks store
          if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
            const bookmarksStore = db.createObjectStore(STORE_BOOKMARKS, { keyPath: "questionId" });
            bookmarksStore.createIndex("savedAt", "savedAt", { unique: false });
            bookmarksStore.createIndex("topicId", "topicId", { unique: false });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return this.dbPromise;
  }

  // --- Session Methods ---
  async saveSession(session: SessionResult): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_SESSIONS, STORE_ATTEMPTS], "readwrite");
      const sessionStore = tx.objectStore(STORE_SESSIONS);
      const attemptStore = tx.objectStore(STORE_ATTEMPTS);

      sessionStore.put(session);

      // Save each question attempt for analytics & anti-repetition
      for (const attempt of session.attempts || []) {
        attemptStore.add(attempt);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAllSessions(): Promise<SessionResult[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SESSIONS, "readonly");
      const store = tx.objectStore(STORE_SESSIONS);
      const index = store.index("timestamp");
      const request = index.getAll();

      request.onsuccess = () => {
        // Return reverse sorted (latest first)
        const results = (request.result || []) as SessionResult[];
        resolve(results.reverse());
      };
      request.onerror = () => reject(request.error);
    });
  }

  // --- Attempt & Analytics Methods ---
  async getAllAttempts(): Promise<UserQuestionAttempt[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ATTEMPTS, "readonly");
      const store = tx.objectStore(STORE_ATTEMPTS);
      const request = store.getAll();

      request.onsuccess = () => resolve((request.result || []) as UserQuestionAttempt[]);
      request.onerror = () => reject(request.error);
    });
  }

  async getRecentQuestionIds(limit = 500): Promise<string[]> {
    const attempts = await this.getAllAttempts();
    const sorted = attempts.sort((a, b) => b.timestamp - a.timestamp);
    const recent = sorted.slice(0, limit).map((a) => a.questionId);
    return Array.from(new Set(recent));
  }

  // --- Bookmark Methods ---
  async saveBookmark(item: BookmarkItem): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, "readwrite");
      const store = tx.objectStore(STORE_BOOKMARKS);
      store.put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async removeBookmark(questionId: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, "readwrite");
      const store = tx.objectStore(STORE_BOOKMARKS);
      store.delete(questionId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAllBookmarks(): Promise<BookmarkItem[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, "readonly");
      const store = tx.objectStore(STORE_BOOKMARKS);
      const index = store.index("savedAt");
      const request = index.getAll();

      request.onsuccess = () => {
        const results = (request.result || []) as BookmarkItem[];
        resolve(results.reverse());
      };
      request.onerror = () => reject(request.error);
    });
  }

  async isBookmarked(questionId: string): Promise<boolean> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, "readonly");
      const store = tx.objectStore(STORE_BOOKMARKS);
      const request = store.get(questionId);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Clear / Reset Methods ---
  async clearProgress(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_SESSIONS, STORE_ATTEMPTS], "readwrite");
      tx.objectStore(STORE_SESSIONS).clear();
      tx.objectStore(STORE_ATTEMPTS).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clearBookmarks(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, "readwrite");
      tx.objectStore(STORE_BOOKMARKS).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clearAll(): Promise<void> {
    await this.clearProgress();
    await this.clearBookmarks();
    if (typeof window !== "undefined") {
      localStorage.removeItem(SETTINGS_KEY);
    }
  }
}

const idbStorage = new IndexedDBStorage();

export class StorageService {
  // Session
  static async saveSession(session: SessionResult): Promise<void> {
    if (typeof window === "undefined") return;
    return idbStorage.saveSession(session);
  }

  static async getAllSessions(): Promise<SessionResult[]> {
    if (typeof window === "undefined") return [];
    return idbStorage.getAllSessions();
  }

  // Attempts & Anti-Repetition
  static async getAllAttempts(): Promise<UserQuestionAttempt[]> {
    if (typeof window === "undefined") return [];
    return idbStorage.getAllAttempts();
  }

  static async getRecentQuestionIds(limit = 500): Promise<string[]> {
    if (typeof window === "undefined") return [];
    return idbStorage.getRecentQuestionIds(limit);
  }

  // Bookmarks
  static async saveBookmark(item: BookmarkItem): Promise<void> {
    if (typeof window === "undefined") return;
    return idbStorage.saveBookmark(item);
  }

  static async removeBookmark(questionId: string): Promise<void> {
    if (typeof window === "undefined") return;
    return idbStorage.removeBookmark(questionId);
  }

  static async getAllBookmarks(): Promise<BookmarkItem[]> {
    if (typeof window === "undefined") return [];
    return idbStorage.getAllBookmarks();
  }

  static async isBookmarked(questionId: string): Promise<boolean> {
    if (typeof window === "undefined") return false;
    return idbStorage.isBookmarked(questionId);
  }

  // Settings
  static getSettings(): UserSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: Partial<UserSettings>): UserSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }

  // Reset
  static async clearProgress(): Promise<void> {
    return idbStorage.clearProgress();
  }

  static async clearBookmarks(): Promise<void> {
    return idbStorage.clearBookmarks();
  }

  static async clearAllData(): Promise<void> {
    return idbStorage.clearAll();
  }
}
