import { useState, useEffect } from "react";

interface MinigameState {
  stepCatcherPlayed: boolean;
  lastPlayDate: string;
}

const STORAGE_KEY = "strollscroll-minigames";

const getInitialState = (): MinigameState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as MinigameState;
      const today = new Date().toDateString();
      
      // Reset if it's a new day
      if (state.lastPlayDate !== today) {
        return {
          stepCatcherPlayed: false,
          lastPlayDate: today,
        };
      }
      return state;
    }
  } catch (error) {
    console.error("Failed to load minigame state:", error);
  }
  
  return {
    stepCatcherPlayed: false,
    lastPlayDate: new Date().toDateString(),
  };
};

export const useMinigames = () => {
  const [state, setState] = useState<MinigameState>(getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const markStepCatcherPlayed = () => {
    setState(prev => ({ ...prev, stepCatcherPlayed: true }));
  };

  return {
    canPlayStepCatcher: !state.stepCatcherPlayed,
    markStepCatcherPlayed,
  };
};
