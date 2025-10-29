import { Card } from "@/components/ui/card";
import { Calendar, Flame, Trophy } from "lucide-react";

interface MobileStatsProps {
  weeklyAverage: number;
  streak: number;
  totalEarned: number;
}

export const MobileStats = ({ weeklyAverage, streak, totalEarned }: MobileStatsProps) => {
  const stats = [
    {
      icon: Calendar,
      label: "Weekly Avg",
      value: weeklyAverage.toLocaleString(),
      subtext: "steps",
    },
    {
      icon: Flame,
      label: "Streak",
      value: streak,
      subtext: "days",
    },
    {
      icon: Trophy,
      label: "Total Time",
      value: totalEarned,
      subtext: "minutes",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground mb-0.5">
            {stat.value}
          </div>
          <div className="text-xs text-muted-foreground">{stat.subtext}</div>
          <div className="text-xs text-muted-foreground font-medium mt-1">
            {stat.label}
          </div>
        </Card>
      ))}
    </div>
  );
};
