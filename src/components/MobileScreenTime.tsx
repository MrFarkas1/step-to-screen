import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Sparkles, Calendar, TrendingUp, Award } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MobileScreenTimeProps {
  minutes: number;
  earnedToday: number;
}

export const MobileScreenTime = ({ minutes, earnedToday }: MobileScreenTimeProps) => {
  const [open, setOpen] = useState(false);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  const weeklyTotal = 287;
  const monthlyTotal = 1234;
  const longestSession = 156;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Card className="p-6 bg-gradient-primary border-0 shadow-glow interactive-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-white/80">Screen Time Earned</p>
            <p className="text-xs text-white/60">Today</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-white/80" />
      </div>
      
      <div className="space-y-1">
        <div className="text-5xl font-bold text-white">
          {hours > 0 ? (
            <>
              {hours}<span className="text-2xl text-white/80">h</span> {mins}<span className="text-2xl text-white/80">m</span>
            </>
          ) : (
            <>
              {mins}<span className="text-2xl text-white/80">m</span>
            </>
          )}
        </div>
      </div>
    </Card>
      </PopoverTrigger>
      
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Screen Time Details</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Earned Today</span>
              </div>
              <span className="font-semibold text-foreground">{earnedToday} min</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">This Week</span>
              </div>
              <span className="font-semibold text-foreground">{weeklyTotal} min</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">This Month</span>
              </div>
              <span className="font-semibold text-foreground">{monthlyTotal} min</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Longest Session</span>
              </div>
              <span className="font-semibold text-foreground">{longestSession} min</span>
            </div>
          </div>
          
          <div className="pt-2 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Keep walking to earn more screen time! 🚶‍♂️
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
