export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  condition: (data: GamificationData) => boolean;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyQuest {
  id: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  date: string;
}

export interface WeeklyChallenge {
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  weekStart: string;
}

export interface GamificationData {
  currentStreak: number;
  longestStreak: number;
  lastGoalDate: string;
  totalCredits: number;
  achievements: Achievement[];
  dailyQuest: DailyQuest | null;
  weeklyChallenge: WeeklyChallenge;
  lastBonusCheck: string;
  totalStepsAllTime: number;
  weeklySteps: number;
  daysMetGoal: number;
}
