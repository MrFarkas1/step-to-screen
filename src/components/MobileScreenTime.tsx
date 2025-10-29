import { Card } from "@/components/ui/card";
import { Clock, Sparkles } from "lucide-react";

interface MobileScreenTimeProps {
  minutes: number;
  earnedToday: number;
}

export const MobileScreenTime = ({ minutes, earnedToday }: MobileScreenTimeProps) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return (
    <Card className="p-6 bg-gradient-primary border-0 shadow-glow">
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
  );
};
