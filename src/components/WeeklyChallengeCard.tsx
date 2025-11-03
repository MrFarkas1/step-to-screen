import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WeeklyChallenge } from "@/types/gamification";
import { Trophy, CheckCircle2 } from "lucide-react";

interface WeeklyChallengeCardProps {
  challenge: WeeklyChallenge;
}

export const WeeklyChallengeCard = ({ challenge }: WeeklyChallengeCardProps) => {
  const progress = Math.min((challenge.current / challenge.target) * 100, 100);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          challenge.completed ? "bg-success/10" : "bg-accent/10"
        }`}>
          {challenge.completed ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <Trophy className="w-5 h-5 text-accent" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-foreground">Weekly Challenge</p>
            {challenge.completed ? (
              <span className="text-xs font-medium text-success">Complete!</span>
            ) : (
              <span className="text-xs font-medium text-accent">+{challenge.reward} credits</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{challenge.description}</p>
        </div>
      </div>
      {!challenge.completed && (
        <>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground text-right">
            {challenge.current.toLocaleString()} / {challenge.target.toLocaleString()} steps
          </p>
        </>
      )}
    </Card>
  );
};
