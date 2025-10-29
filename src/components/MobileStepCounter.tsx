import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface MobileStepCounterProps {
  steps: number;
  dailyGoal: number;
}

export const MobileStepCounter = ({ steps, dailyGoal }: MobileStepCounterProps) => {
  const progress = (steps / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - steps);
  const isGoalMet = steps >= dailyGoal;

  return (
    <div className="relative">
      {/* Main Circle Display */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative w-64 h-64">
          {/* Circular Progress */}
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 112}`}
              strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
              className="transition-all duration-500"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold text-foreground mb-1">
              {steps.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">steps today</div>
            {isGoalMet && (
              <div className="mt-3 px-4 py-1.5 bg-primary/10 rounded-full flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Goal reached!</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Goal Info */}
        {!isGoalMet && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{remaining.toLocaleString()}</span> steps to reach your goal
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
