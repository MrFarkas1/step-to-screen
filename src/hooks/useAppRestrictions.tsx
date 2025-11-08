import { useState, useEffect } from "react";

export interface AppRestriction {
  id: string;
  name: string;
  icon: string;
  restricted: boolean;
}

interface AppRestrictionsData {
  apps: AppRestriction[];
  pin: string;
  enabled: boolean;
}

const STORAGE_KEY = "strollscroll-app-restrictions";

const DEFAULT_APPS: AppRestriction[] = [
  { id: "instagram", name: "Instagram", icon: "📷", restricted: false },
  { id: "tiktok", name: "TikTok", icon: "🎵", restricted: false },
  { id: "youtube", name: "YouTube", icon: "▶️", restricted: false },
  { id: "snapchat", name: "Snapchat", icon: "👻", restricted: false },
  { id: "facebook", name: "Facebook", icon: "👥", restricted: false },
  { id: "twitter", name: "Twitter/X", icon: "🐦", restricted: false },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", restricted: false },
  { id: "netflix", name: "Netflix", icon: "🎬", restricted: false },
  { id: "reddit", name: "Reddit", icon: "🤖", restricted: false },
  { id: "discord", name: "Discord", icon: "🎮", restricted: false },
  { id: "twitch", name: "Twitch", icon: "📺", restricted: false },
  { id: "spotify", name: "Spotify", icon: "🎧", restricted: false },
];

export function useAppRestrictions() {
  const [data, setData] = useState<AppRestrictionsData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { apps: DEFAULT_APPS, pin: "", enabled: false };
      }
    }
    return { apps: DEFAULT_APPS, pin: "", enabled: false };
  });

  const saveData = (newData: Partial<AppRestrictionsData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const setPin = (pin: string) => {
    saveData({ pin, enabled: true });
  };

  const verifyPin = (inputPin: string): boolean => {
    return data.pin === inputPin;
  };

  const toggleApp = (appId: string) => {
    const updatedApps = data.apps.map((app) =>
      app.id === appId ? { ...app, restricted: !app.restricted } : app
    );
    saveData({ apps: updatedApps });
  };

  const toggleAllApps = (restricted: boolean) => {
    const updatedApps = data.apps.map((app) => ({ ...app, restricted }));
    saveData({ apps: updatedApps });
  };

  const resetRestrictions = () => {
    saveData({ apps: DEFAULT_APPS, pin: "", enabled: false });
  };

  const changePin = (newPin: string) => {
    saveData({ pin: newPin });
  };

  const getRestrictedApps = () => {
    return data.apps.filter((app) => app.restricted);
  };

  return {
    apps: data.apps,
    pin: data.pin,
    enabled: data.enabled,
    setPin,
    verifyPin,
    toggleApp,
    toggleAllApps,
    resetRestrictions,
    changePin,
    getRestrictedApps,
  };
}
