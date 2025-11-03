import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/types/gamification";
import { Award, Lock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AchievementsSheetProps {
  achievements: Achievement[];
}

export const AchievementsSheet = ({ achievements }: AchievementsSheetProps) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Award className="w-4 h-4" />
          Achievements
          <Badge variant="secondary" className="ml-1">
            {unlockedCount}/{achievements.length}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-2xl font-bold">Achievements</SheetTitle>
          <SheetDescription>
            Unlock badges by completing challenges
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100%-100px)]">
          <div className="space-y-3 pb-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked
                    ? "bg-card border-primary/20"
                    : "bg-muted/30 border-border opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {achievement.title}
                      </h3>
                      {achievement.unlocked ? (
                        <Badge variant="default" className="text-xs">
                          +{achievement.reward}
                        </Badge>
                      ) : (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-primary mt-1">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
