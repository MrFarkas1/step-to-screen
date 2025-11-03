import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footprints, Trophy } from "lucide-react";
import { StepCatcherGame } from "./StepCatcherGame";
import { StepRaceGame } from "./StepRaceGame";
import { toast } from "sonner";

interface MinigameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canPlayStepCatcher: boolean;
  canPlayStepRace: boolean;
  onStepCatcherComplete: (credits: number) => void;
  onStepRaceComplete: (credits: number) => void;
}

export const MinigameDialog = ({
  open,
  onOpenChange,
  canPlayStepCatcher,
  canPlayStepRace,
  onStepCatcherComplete,
  onStepRaceComplete,
}: MinigameDialogProps) => {
  const [activeGame, setActiveGame] = useState<"catcher" | "race" | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [earnedCredits, setEarnedCredits] = useState(0);

  const calculateCredits = (score: number, gameType: "catcher" | "race") => {
    if (gameType === "catcher") {
      if (score >= 30) return 15;
      if (score >= 20) return 10;
      if (score >= 10) return 5;
      return 0;
    } else {
      if (score >= 1500) return 20;
      if (score >= 800) return 10;
      if (score >= 300) return 5;
      return 0;
    }
  };

  const handleGameComplete = (score: number, gameType: "catcher" | "race") => {
    const credits = calculateCredits(score, gameType);
    setGameScore(score);
    setEarnedCredits(credits);
    setActiveGame(null);
    setShowResults(true);
    
    if (gameType === "catcher") {
      onStepCatcherComplete(credits);
    } else {
      onStepRaceComplete(credits);
    }
  };

  const handleClose = () => {
    setActiveGame(null);
    setShowResults(false);
    onOpenChange(false);
  };

  if (activeGame === "catcher") {
    return (
      <StepCatcherGame
        onComplete={(score) => handleGameComplete(score, "catcher")}
        onClose={handleClose}
      />
    );
  }

  if (activeGame === "race") {
    return (
      <StepRaceGame
        onComplete={(score) => handleGameComplete(score, "race")}
        onClose={handleClose}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {showResults ? (
          <div className="space-y-4 text-center">
            <div className="text-6xl animate-bounce">🎉</div>
            <DialogHeader>
              <DialogTitle className="text-2xl">Well done!</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-lg">Score: <strong>{gameScore}</strong></p>
              <p className="text-xl text-primary font-bold">
                +{earnedCredits} Credits Earned! 🎁
              </p>
            </div>
            <Button onClick={handleClose} size="lg" className="w-full">
              Awesome!
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">✨ Hidden Games</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Play once per day to earn bonus credits!
              </p>
            </DialogHeader>
            
            <div className="grid gap-4 mt-4">
              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                  !canPlayStepCatcher ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (canPlayStepCatcher) {
                    setActiveGame("catcher");
                  } else {
                    toast.info("You've already played Step Catcher today!");
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">👣</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Step Catcher</h3>
                    <p className="text-sm text-muted-foreground">
                      Tap falling steps before they hit the ground!
                    </p>
                    {!canPlayStepCatcher && (
                      <p className="text-xs text-primary mt-1">Played today ✓</p>
                    )}
                  </div>
                  <Footprints className="w-6 h-6 text-primary" />
                </div>
              </Card>

              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                  !canPlayStepRace ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (canPlayStepRace) {
                    setActiveGame("race");
                  } else {
                    toast.info("You've already played Step Race today!");
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🏁</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Step Race</h3>
                    <p className="text-sm text-muted-foreground">
                      Jump over obstacles and survive as long as you can!
                    </p>
                    {!canPlayStepRace && (
                      <p className="text-xs text-primary mt-1">Played today ✓</p>
                    )}
                  </div>
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
