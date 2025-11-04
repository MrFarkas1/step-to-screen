import { useState, useEffect } from "react";

interface OnboardingData {
  age: number;
  dailyHours: number;
  goal?: string;
  completed: boolean;
}

const STORAGE_KEY = "strollscroll-onboarding";

export function useOnboarding() {
  const [data, setData] = useState<OnboardingData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { age: 0, dailyHours: 0, completed: false };
      }
    }
    return { age: 0, dailyHours: 0, completed: false };
  });

  const saveOnboarding = (newData: Partial<OnboardingData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const completeOnboarding = (age: number, dailyHours: number, goal?: string) => {
    saveOnboarding({ age, dailyHours, goal, completed: true });
  };

  const resetOnboarding = () => {
    const resetData = { age: data.age, dailyHours: data.dailyHours, goal: data.goal, completed: false };
    setData(resetData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
  };

  const calculateLifeOnScreen = () => {
    const LIFESPAN = 85;
    
    // Validate inputs
    if (!data.age || !data.dailyHours) {
      return { years: 0, totalHours: 0, isValid: false };
    }
    
    // Edge case: already at or past lifespan
    if (data.age >= LIFESPAN) {
      return { years: 0, totalHours: 0, isValid: true, atLifespan: true };
    }
    
    const remainingYears = LIFESPAN - data.age;
    const totalHours = remainingYears * 365 * data.dailyHours;
    const yearsOnScreen = totalHours / 24 / 365;
    
    return {
      years: parseFloat(yearsOnScreen.toFixed(1)),
      totalHours: Math.round(totalHours),
      isValid: true,
      atLifespan: false
    };
  };

  return {
    data,
    hasCompletedOnboarding: data.completed,
    completeOnboarding,
    resetOnboarding,
    calculateLifeOnScreen,
  };
}
