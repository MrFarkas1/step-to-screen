import { useState, useEffect } from "react";
import { GamificationData, DailyQuest, WeeklyChallenge, Achievement } from "@/types/gamification";
import { achievementDefinitions } from "@/data/achievements";
import { toast } from "sonner";

const STORAGE_KEY = "strollscroll_gamification";

const getInitialData = (): GamificationData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  const today = new Date().toISOString().split("T")[0];
  const weekStart = getWeekStart();

  return {
    currentStreak: 0,
    longestStreak: 0,
    lastGoalDate: "",
    totalCredits: 0,
    achievements: achievementDefinitions.map((def) => ({
      ...def,
      unlocked: false,
    })),
    dailyQuest: generateDailyQuest(today),
    weeklyChallenge: {
      description: "Walk 50,000 steps this week",
      target: 50000,
      current: 0,
      reward: 50,
      completed: false,
      weekStart,
    },
    lastBonusCheck: "",
    totalStepsAllTime: 0,
    weeklySteps: 0,
    daysMetGoal: 0,
  };
};

const getWeekStart = (): string => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().split("T")[0];
};

const generateDailyQuest = (date: string): DailyQuest => {
  const targets = [500, 800, 1000, 1200, 1500];
  const descriptions = [
    "Take {target} more steps today",
    "Walk {target} steps before sunset",
    "Hit {target} steps to complete this quest",
    "Reach {target} additional steps",
  ];
  
  const target = targets[Math.floor(Math.random() * targets.length)];
  const desc = descriptions[Math.floor(Math.random() * descriptions.length)].replace("{target}", target.toString());

  return {
    id: `quest_${date}`,
    description: desc,
    target,
    current: 0,
    reward: 15,
    completed: false,
    date,
  };
};

export const useGamification = (steps: number, dailyGoal: number) => {
  const [data, setData] = useState<GamificationData>(getInitialData);
  const [showSurpriseBonus, setShowSurpriseBonus] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Check and update daily/weekly progress
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const currentWeekStart = getWeekStart();

    setData((prev) => {
      let updated = { ...prev };

      // Reset weekly challenge if new week
      if (updated.weeklyChallenge.weekStart !== currentWeekStart) {
        updated.weeklyChallenge = {
          description: "Walk 50,000 steps this week",
          target: 50000,
          current: 0,
          reward: 50,
          completed: false,
          weekStart: currentWeekStart,
        };
        updated.weeklySteps = 0;
      }

      // Generate new daily quest if new day
      if (!updated.dailyQuest || updated.dailyQuest.date !== today) {
        updated.dailyQuest = generateDailyQuest(today);
      }

      // Update quest and challenge progress
      if (updated.dailyQuest && !updated.dailyQuest.completed) {
        updated.dailyQuest.current = steps;
        if (updated.dailyQuest.current >= updated.dailyQuest.target) {
          updated.dailyQuest.completed = true;
          updated.totalCredits += updated.dailyQuest.reward;
          toast.success(`🎯 Daily Quest Complete! +${updated.dailyQuest.reward} credits`);
        }
      }

      updated.weeklySteps = steps;
      updated.weeklyChallenge.current = updated.weeklySteps;
      if (!updated.weeklyChallenge.completed && updated.weeklyChallenge.current >= updated.weeklyChallenge.target) {
        updated.weeklyChallenge.completed = true;
        updated.totalCredits += updated.weeklyChallenge.reward;
        toast.success(`🏆 Weekly Challenge Complete! +${updated.weeklyChallenge.reward} credits`);
      }

      return updated;
    });
  }, [steps]);

  // Check if daily goal met and update streak
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    if (steps >= dailyGoal) {
      setData((prev) => {
        if (prev.lastGoalDate === today) {
          return prev; // Already processed today
        }

        let newStreak = prev.currentStreak;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        if (prev.lastGoalDate === yesterday) {
          newStreak += 1;
        } else if (prev.lastGoalDate !== today) {
          newStreak = 1;
        }

        let bonusCredits = 0;
        if (newStreak >= 7) bonusCredits = 20;
        else if (newStreak >= 5) bonusCredits = 15;
        else if (newStreak >= 3) bonusCredits = 10;

        if (bonusCredits > 0) {
          toast.success(`🔥 ${newStreak}-Day Streak Bonus! +${bonusCredits} credits`);
        }

        return {
          ...prev,
          currentStreak: newStreak,
          longestStreak: Math.max(prev.longestStreak, newStreak),
          lastGoalDate: today,
          totalCredits: prev.totalCredits + bonusCredits,
          daysMetGoal: prev.daysMetGoal + 1,
        };
      });
    }
  }, [steps, dailyGoal]);

  // Update total steps
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      totalStepsAllTime: Math.max(prev.totalStepsAllTime, steps),
    }));
  }, [steps]);

  // Check achievements
  useEffect(() => {
    setData((prev) => {
      const updated = { ...prev };
      let creditsEarned = 0;

      updated.achievements = updated.achievements.map((achievement) => {
        if (!achievement.unlocked && achievement.condition(updated)) {
          creditsEarned += achievement.reward;
          toast.success(`🎉 Achievement Unlocked: ${achievement.title}! +${achievement.reward} credits`);
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          };
        }
        return achievement;
      });

      if (creditsEarned > 0) {
        updated.totalCredits += creditsEarned;
      }

      return updated;
    });
  }, [data.currentStreak, data.totalStepsAllTime, data.weeklySteps]);

  // Random surprise bonus (5% chance per day)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    
    if (data.lastBonusCheck !== today) {
      const chance = Math.random();
      if (chance < 0.05) {
        setData((prev) => ({
          ...prev,
          totalCredits: prev.totalCredits + 10,
          lastBonusCheck: today,
        }));
        setShowSurpriseBonus(true);
        toast.success("🎁 Surprise Bonus! +10 credits");
      } else {
        setData((prev) => ({
          ...prev,
          lastBonusCheck: today,
        }));
      }
    }
  }, [data.lastBonusCheck]);

  return {
    ...data,
    showSurpriseBonus,
    setShowSurpriseBonus,
  };
};
