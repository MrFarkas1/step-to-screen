import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StepCounter } from "@/components/StepCounter";
import { ScreenTimeBalance } from "@/components/ScreenTimeBalance";
import { ConversionRate } from "@/components/ConversionRate";
import { ConversionRateDialog } from "@/components/ConversionRateDialog";
import { QuickStats } from "@/components/QuickStats";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [steps, setSteps] = useState(3847);
  const [stepsPerMinute, setStepsPerMinute] = useState(100);
  const [isSimulating, setIsSimulating] = useState(true);
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
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSteps((prev) => {
        const newSteps = prev + Math.floor(Math.random() * 3) + 1;
        return Math.min(newSteps, dailyGoal + 5000);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, dailyGoal]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    toast.success(isSimulating ? "Simulation paused" : "Simulation started");
  };

  const handleRateChange = (newRate: number) => {
    setStepsPerMinute(newRate);
    toast.success(`Conversion rate updated to ${newRate} steps per minute`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              StepReward
            </h1>
            <p className="text-muted-foreground">
              Turn your steps into screen time
            </p>
          </div>
          <Button
            onClick={toggleSimulation}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StepCounter steps={steps} dailyGoal={dailyGoal} />
          </div>
          <div className="space-y-6">
            <ScreenTimeBalance 
              minutes={screenTimeMinutes} 
              earnedToday={earnedToday}
            />
            <ConversionRate 
              stepsPerMinute={stepsPerMinute}
              onAdjust={() => setDialogOpen(true)}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats 
          weeklyAverage={weeklyAverage}
          streak={streak}
          totalEarned={totalEarned}
        />

        {/* Info Banner */}
        <div className="p-6 bg-gradient-primary rounded-2xl shadow-glow text-primary-foreground">
          <h3 className="text-lg font-semibold mb-2">Demo Mode Active</h3>
          <p className="text-sm opacity-90">
            This is a demonstration showing how the app would work. For real step tracking, 
            you'd need a native mobile app with access to your phone's pedometer. Click the 
            pause button above to stop the simulation.
          </p>
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
