import { Card } from "@/components/ui/card";
import { Activity, Target, Zap } from "lucide-react";

interface QuickStatsProps {
  weeklyAverage: number;
  streak: number;
  totalEarned: number;
}

export const QuickStats = ({ weeklyAverage, streak, totalEarned }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 shadow-card border-border hover:shadow-glow transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">Weekly Avg</p>
        </div>
        <p className="text-2xl font-bold text-foreground">
          {weeklyAverage.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">steps per day</p>
      </Card>

      <Card className="p-4 shadow-card border-border hover:shadow-glow transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Zap className="w-4 h-4 text-accent" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">Streak</p>
        </div>
        <p className="text-2xl font-bold text-foreground">
          {streak}
        </p>
        <p className="text-xs text-muted-foreground">days in a row</p>
      </Card>

      <Card className="p-4 shadow-card border-border hover:shadow-glow transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-success/10 rounded-lg">
            <Target className="w-4 h-4 text-success" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">Total Earned</p>
        </div>
        <p className="text-2xl font-bold text-foreground">
          {totalEarned}
        </p>
        <p className="text-xs text-muted-foreground">minutes this week</p>
      </Card>
    </div>
  );
};
