import { useState, useEffect } from "react";
import { MobileStepCounter } from "@/components/MobileStepCounter";
import { MobileScreenTime } from "@/components/MobileScreenTime";
import { MobileStats } from "@/components/MobileStats";
import { MobileConversionRate } from "@/components/MobileConversionRate";
import { ConversionRateDialog } from "@/components/ConversionRateDialog";
import { toast } from "sonner";

const Index = () => {
  const [steps, setSteps] = useState(3847);
  const [stepsPerMinute, setStepsPerMinute] = useState(100);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const dailyGoal = 10000;
  const screenTimeMinutes = Math.floor(steps / stepsPerMinute);
  const earnedToday = screenTimeMinutes;
  
  // Quick stats
  const weeklyAverage = 8234;
  const streak = 7;
  const totalEarned = 456;

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

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-safe pt-8 pb-4">
          <h1 className="text-2xl font-bold text-foreground">
            StrollScroll
          </h1>
          <p className="text-sm text-muted-foreground">
            Turn your steps into screen time
          </p>
        </div>

        {/* Main Content */}
        <div className="px-6 space-y-6">
          {/* Step Counter Circle */}
          <MobileStepCounter steps={steps} dailyGoal={dailyGoal} />

          {/* Screen Time Card */}
          <MobileScreenTime 
            minutes={screenTimeMinutes} 
            earnedToday={earnedToday}
          />

          {/* Stats Grid */}
          <MobileStats 
            weeklyAverage={weeklyAverage}
            streak={streak}
            totalEarned={totalEarned}
          />

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
    </div>
  );
};

export default Index;
