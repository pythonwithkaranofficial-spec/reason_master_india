"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserSettings } from "@/types/models";
import { StorageService } from "@/lib/persistence/StorageService";

interface SettingsContextType {
  settings: UserSettings;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial sync on client mount
    setSettings(StorageService.getSettings());
    setIsLoaded(true);

    // Listen to in-app custom event for instant cross-component updates
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(StorageService.getSettings());
      }
    };

    // Listen to browser storage changes for multi-tab synchronization
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "rm_user_settings") {
        setSettings(StorageService.getSettings());
      }
    };

    window.addEventListener("rm-settings-changed", handleSettingsChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("rm-settings-changed", handleSettingsChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const updateSetting = useCallback(<K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = StorageService.saveSettings({ [key]: value });
    setSettings(updated);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    const updated = StorageService.saveSettings(newSettings);
    setSettings(updated);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, updateSettings, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    // Fallback if rendered outside SettingsProvider
    const fallbackSettings = StorageService.getSettings();
    return {
      settings: fallbackSettings,
      updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        StorageService.saveSettings({ [key]: value });
      },
      updateSettings: (newSettings: Partial<UserSettings>) => {
        StorageService.saveSettings(newSettings);
      },
      isLoaded: true,
    };
  }
  return context;
}
