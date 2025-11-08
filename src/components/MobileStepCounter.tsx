import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Activity, Calendar, Target } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MobileStepCounterProps {
  steps: number;
  dailyGoal: number;
}

export const MobileStepCounter = ({ steps, dailyGoal }: MobileStepCounterProps) => {
  const [open, setOpen] = useState(false);
  const progress = (steps / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - steps);
  const isGoalMet = steps >= dailyGoal;
  
  const weeklyAverage = 8234;
  const monthlyTotal = 245678;
  const bestDay = 12847;

  return (
    <div className="relative">
      {/* Main Circle Display */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-col items-center justify-center py-8 md:py-12 interactive-card rounded-2xl touch-ripple gpu-accelerate">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72">
              {/* Circular Progress */}
              <svg className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 transform -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 110}`}
              strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress / 100)}`}
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
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-1 leading-none">
              {steps.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">steps today</div>
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
    </PopoverTrigger>
    
    <PopoverContent className="w-80">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Step Statistics</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Daily Goal</span>
            </div>
            <span className="font-semibold text-foreground">{dailyGoal.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Weekly Average</span>
            </div>
            <span className="font-semibold text-foreground">{weeklyAverage.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Best Day</span>
            </div>
            <span className="font-semibold text-foreground">{bestDay.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Monthly Total</span>
            </div>
            <span className="font-semibold text-foreground">{monthlyTotal.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {progress.toFixed(1)}% of daily goal
          </p>
        </div>
      </div>
    </PopoverContent>
  </Popover>
    </div>
  );
};
