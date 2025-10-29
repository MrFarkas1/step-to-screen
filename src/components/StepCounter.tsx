import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Footprints } from "lucide-react";

interface StepCounterProps {
  steps: number;
  dailyGoal: number;
}

export const StepCounter = ({ steps, dailyGoal }: StepCounterProps) => {
  const [displaySteps, setDisplaySteps] = useState(0);
  const progress = (steps / dailyGoal) * 100;

  useEffect(() => {
    const duration = 1000;
    const frames = 60;
    const increment = steps / frames;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      current = Math.min(current + increment, steps);
      setDisplaySteps(Math.floor(current));

      if (frame >= frames) {
        clearInterval(timer);
      }
    }, duration / frames);

    return () => clearInterval(timer);
  }, [steps]);

  return (
    <Card className="p-8 bg-gradient-primary shadow-glow border-0 text-primary-foreground overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-90 font-medium">Today's Steps</p>
            <p className="text-xs opacity-70">Keep moving!</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-6xl font-bold mb-2 tabular-nums tracking-tight">
            {displaySteps.toLocaleString()}
          </h2>
          <p className="text-sm opacity-80">
            of {dailyGoal.toLocaleString()} daily goal
          </p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-3 bg-white/20" />
          <p className="text-xs opacity-75 text-right">
            {Math.min(100, Math.round(progress))}% completed
          </p>
        </div>
      </div>
    </Card>
  );
};
