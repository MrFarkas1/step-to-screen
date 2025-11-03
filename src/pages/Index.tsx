import { useState, useEffect } from "react";
import { MobileStepCounter } from "@/components/MobileStepCounter";
import { MobileScreenTime } from "@/components/MobileScreenTime";
import { MobileStats } from "@/components/MobileStats";
import { MobileConversionRate } from "@/components/MobileConversionRate";
import { ConversionRateDialog } from "@/components/ConversionRateDialog";
import { SettingsSheet } from "@/components/SettingsSheet";
import { StreakWidget } from "@/components/StreakWidget";
import { DailyQuestCard } from "@/components/DailyQuestCard";
import { WeeklyChallengeCard } from "@/components/WeeklyChallengeCard";
import { AchievementsSheet } from "@/components/AchievementsSheet";
import { SurpriseBonusDialog } from "@/components/SurpriseBonusDialog";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { MinigameDialog } from "@/components/MinigameDialog";
import { useGamification } from "@/hooks/useGamification";
import { useMinigames } from "@/hooks/useMinigames";
import { toast } from "sonner";

const Index = () => {
  const [steps, setSteps] = useState(3847);
  const [stepsPerMinute, setStepsPerMinute] = useState(100);
  const [dailyGoal, setDailyGoal] = useState(10000);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [minigameOpen, setMinigameOpen] = useState(false);
  
  const gamification = useGamification(steps, dailyGoal);
  const minigames = useMinigames();
  
  const screenTimeMinutes = Math.floor(steps / stepsPerMinute);
  const earnedToday = screenTimeMinutes;
  
  // Quick stats
  const weeklyAverage = 8234;
  const totalEarned = screenTimeMinutes;

  // Simulate steps increasing
  useEffect(() => {
    const interval = setInterval(() => {
      setSteps((prev) => {
        const newSteps = prev + Math.floor(Math.random() * 3) + 1;
        return Math.min(newSteps, dailyGoal + 5000);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [dailyGoal]);

  const handleRateChange = (newRate: number) => {
    setStepsPerMinute(newRate);
    toast.success(`Conversion rate updated to ${newRate} steps per minute`);
  };

  const handleMinigameComplete = (credits: number) => {
    // Credits are awarded through local state update
    const currentCredits = parseInt(localStorage.getItem("strollscroll-credits") || "0");
    const newCredits = currentCredits + credits;
    localStorage.setItem("strollscroll-credits", newCredits.toString());
    
    minigames.markStepCatcherPlayed();
    
    // Force a re-render by updating a dummy state
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-safe pt-8 pb-4 flex items-start justify-between">
          <button 
            onClick={() => setMinigameOpen(true)}
            className="group relative"
            title="✨ Hidden Games"
          >
            <h1 className="text-2xl font-bold text-foreground transition-all group-hover:text-primary group-hover:scale-105 cursor-pointer">
              StrollScroll
            </h1>
            <p className="text-sm text-muted-foreground">
              Turn your steps into screen time
            </p>
            <span className="absolute -top-2 -right-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity animate-pulse">
              ✨
            </span>
          </button>
          <SettingsSheet
            stepsPerMinute={stepsPerMinute}
            onRateChange={handleRateChange}
            dailyGoal={dailyGoal}
            onGoalChange={(value) => setDailyGoal(value)}
          />
        </div>

        {/* Main Content */}
        <div className="px-6 space-y-4">
          {/* Step Counter Circle */}
          <MobileStepCounter steps={steps} dailyGoal={dailyGoal} />

          {/* Screen Time Card */}
          <MobileScreenTime 
            minutes={screenTimeMinutes} 
            earnedToday={earnedToday}
          />

          {/* Gamification Row */}
          <div className="grid grid-cols-2 gap-3">
            <StreakWidget streak={gamification.currentStreak} />
            <CreditsDisplay credits={gamification.totalCredits} />
          </div>

          {/* Daily Quest & Weekly Challenge */}
          <DailyQuestCard quest={gamification.dailyQuest} />
          <WeeklyChallengeCard challenge={gamification.weeklyChallenge} />

          {/* Stats Grid */}
          <MobileStats 
            weeklyAverage={weeklyAverage}
            streak={gamification.currentStreak}
            totalEarned={totalEarned}
          />

          {/* Achievements Button */}
          <div className="flex justify-center">
            <AchievementsSheet achievements={gamification.achievements} />
          </div>

          {/* Conversion Rate */}
          <MobileConversionRate 
            stepsPerMinute={stepsPerMinute}
            onAdjust={() => setDialogOpen(true)}
          />
        </div>
      </div>

      <ConversionRateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentRate={stepsPerMinute}
        onSave={handleRateChange}
      />

      <SurpriseBonusDialog
        open={gamification.showSurpriseBonus}
        onOpenChange={gamification.setShowSurpriseBonus}
      />

      <MinigameDialog
        open={minigameOpen}
        onOpenChange={setMinigameOpen}
        canPlayStepCatcher={minigames.canPlayStepCatcher}
        onStepCatcherComplete={handleMinigameComplete}
      />
    </div>
  );
};

export default Index;
