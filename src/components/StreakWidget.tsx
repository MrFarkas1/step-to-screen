import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakWidgetProps {
  streak: number;
}

export const StreakWidget = ({ streak }: StreakWidgetProps) => {
  return (
    <Card className="p-4 bg-gradient-accent border-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
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
  );
};
