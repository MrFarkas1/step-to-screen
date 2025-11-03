import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footprints, Trophy, Clock, Sparkles } from "lucide-react";
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
  const [gameTier, setGameTier] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const calculateCredits = (score: number, gameType: "catcher" | "race") => {
    if (gameType === "catcher") {
      if (score >= 30) return { credits: 15, tier: "Perfect!" };
      if (score >= 20) return { credits: 10, tier: "Great!" };
      if (score >= 10) return { credits: 5, tier: "Good!" };
      return { credits: 2, tier: "Nice Try!" };
    } else {
      if (score >= 1500) return { credits: 20, tier: "Champion!" };
      if (score >= 800) return { credits: 10, tier: "Skilled!" };
      if (score >= 300) return { credits: 5, tier: "Decent!" };
      return { credits: 2, tier: "Keep Trying!" };
    }
  };

  const handleGameComplete = (score: number, gameType: "catcher" | "race") => {
    const result = calculateCredits(score, gameType);
    setGameScore(score);
    setEarnedCredits(result.credits);
    setGameTier(result.tier);
    setActiveGame(null);
    setShowResults(true);
    
    // Show confetti for good scores
    if (result.credits >= 10) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    if (gameType === "catcher") {
      onStepCatcherComplete(result.credits);
    } else {
      onStepRaceComplete(result.credits);
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
          <div className="space-y-6 text-center py-4 relative overflow-hidden">
            {/* Confetti effect */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-[fall_2s_ease-out_forwards]"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-20px',
                      animationDelay: `${Math.random() * 0.5}s`,
                    }}
                  >
                    {['🎉', '✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 5)]}
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <div className="text-7xl animate-bounce mb-2">
                {earnedCredits >= 15 ? '🏆' : earnedCredits >= 10 ? '🎉' : earnedCredits >= 5 ? '👏' : '💪'}
              </div>
              <Badge 
                variant={earnedCredits >= 10 ? "default" : "secondary"}
                className="text-lg px-4 py-1 font-bold"
              >
                {gameTier}
              </Badge>
            </div>

            <DialogHeader>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Well done!
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-lg">
                <span className="text-muted-foreground">Final Score:</span>
                <span className="font-bold text-2xl">{gameScore}</span>
              </div>
              <div className="flex items-center justify-between text-xl">
                <span className="text-muted-foreground">Credits Earned:</span>
                <Badge variant="default" className="text-xl px-4 py-1 font-bold animate-pulse">
                  +{earnedCredits} 🎁
                </Badge>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-2 justify-center">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Play again tomorrow for more rewards!
              </span>
            </div>

            <Button onClick={handleClose} size="lg" className="w-full text-lg">
              Back to Home
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 justify-center">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <DialogTitle className="text-2xl">Hidden Games</DialogTitle>
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                Play once per day to earn bonus credits!
              </p>
            </DialogHeader>
            
            <div className="grid gap-4 mt-4">
              <Card
                className={`p-6 transition-all relative overflow-hidden ${
                  canPlayStepCatcher
                    ? "cursor-pointer hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-card to-primary/5"
                    : "opacity-60 cursor-not-allowed bg-muted"
                }`}
                onClick={() => {
                  if (canPlayStepCatcher) {
                    setActiveGame("catcher");
                  } else {
                    toast.info("Come back tomorrow to play again!");
                  }
                }}
              >
                {canPlayStepCatcher && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="text-xs animate-pulse">
                      Available!
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{canPlayStepCatcher ? '👣' : '🔒'}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      Step Catcher
                      {canPlayStepCatcher && <span className="text-xs">⚡</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tap falling steps before they hit the ground!
                    </p>
                    {!canPlayStepCatcher ? (
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <Clock className="w-3 h-3" />
                        <span>Played today — Resets at midnight</span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Earn up to 15 credits! 🎁
                      </div>
                    )}
                  </div>
                  <Footprints className={`w-8 h-8 ${canPlayStepCatcher ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              </Card>

              <Card
                className={`p-6 transition-all relative overflow-hidden ${
                  canPlayStepRace
                    ? "cursor-pointer hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-card to-primary/5"
                    : "opacity-60 cursor-not-allowed bg-muted"
                }`}
                onClick={() => {
                  if (canPlayStepRace) {
                    setActiveGame("race");
                  } else {
                    toast.info("Come back tomorrow to play again!");
                  }
                }}
              >
                {canPlayStepRace && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="text-xs animate-pulse">
                      Available!
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{canPlayStepRace ? '🏁' : '🔒'}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      Step Race
                      {canPlayStepRace && <span className="text-xs">⚡</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Jump over obstacles and survive as long as you can!
                    </p>
                    {!canPlayStepRace ? (
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <Clock className="w-3 h-3" />
                        <span>Played today — Resets at midnight</span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Earn up to 20 credits! 🎁
                      </div>
                    )}
                  </div>
                  <Trophy className={`w-8 h-8 ${canPlayStepRace ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
