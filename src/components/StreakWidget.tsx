import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Flame, Calendar, Trophy, Target } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StreakWidgetProps {
  streak: number;
}

export const StreakWidget = ({ streak }: StreakWidgetProps) => {
  const [open, setOpen] = useState(false);
  const longestStreak = Math.max(streak, 12);
  const totalDaysActive = 47;
  const nextMilestone = streak < 7 ? 7 : streak < 30 ? 30 : 100;
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Card className="p-4 bg-gradient-accent border-0 interactive-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center icon-glow">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Current Streak</p>
              <p className="text-2xl font-bold text-white">
                {streak} <span className="text-base font-normal">days</span>
              </p>
            </div>
          </div>
        </Card>
      </PopoverTrigger>
      
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Flame className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Streak Details</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Current Streak</span>
              </div>
              <span className="font-semibold text-foreground">{streak} days</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Longest Streak</span>
              </div>
              <span className="font-semibold text-foreground">{longestStreak} days</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Total Active Days</span>
              </div>
              <span className="font-semibold text-foreground">{totalDaysActive} days</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Next Milestone</span>
              </div>
              <span className="font-semibold text-foreground">{nextMilestone} days</span>
            </div>
          </div>
          
          <div className="pt-2 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Don't break the streak! Meet your goal today 🔥
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
