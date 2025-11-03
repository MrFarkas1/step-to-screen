import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DailyQuest } from "@/types/gamification";
import { Target, CheckCircle2 } from "lucide-react";

interface DailyQuestCardProps {
  quest: DailyQuest | null;
}

export const DailyQuestCard = ({ quest }: DailyQuestCardProps) => {
  if (!quest) return null;

  const progress = Math.min((quest.current / quest.target) * 100, 100);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          quest.completed ? "bg-success/10" : "bg-primary/10"
        }`}>
          {quest.completed ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <Target className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-foreground">Daily Quest</p>
            {quest.completed ? (
              <span className="text-xs font-medium text-success">Complete!</span>
            ) : (
              <span className="text-xs font-medium text-primary">+{quest.reward} credits</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{quest.description}</p>
        </div>
      </div>
      {!quest.completed && (
        <>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground text-right">
            {quest.current} / {quest.target} steps
          </p>
        </>
      )}
    </Card>
  );
};
