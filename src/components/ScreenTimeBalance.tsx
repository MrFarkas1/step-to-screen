import { Card } from "@/components/ui/card";
import { Clock, TrendingUp } from "lucide-react";

interface ScreenTimeBalanceProps {
  minutes: number;
  earnedToday: number;
}

export const ScreenTimeBalance = ({ minutes, earnedToday }: ScreenTimeBalanceProps) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return (
    <Card className="p-6 shadow-card border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-accent rounded-xl">
            <Clock className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Screen Time Balance</p>
            <p className="text-xs text-muted-foreground/70">Available to use</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-bold text-foreground">
            {hours}
          </h3>
          <span className="text-xl font-semibold text-muted-foreground">h</span>
          <h3 className="text-4xl font-bold text-foreground">
            {remainingMinutes}
          </h3>
          <span className="text-xl font-semibold text-muted-foreground">m</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-border">
        <TrendingUp className="w-4 h-4 text-success" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-success">+{earnedToday} min</span> earned today
        </p>
      </div>
    </Card>
  );
};
