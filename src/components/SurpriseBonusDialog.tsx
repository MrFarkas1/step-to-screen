import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface SurpriseBonusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SurpriseBonusDialog = ({ open, onOpenChange }: SurpriseBonusDialogProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    if (open) {
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setConfetti(pieces);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="relative overflow-hidden">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2 h-2 bg-primary rounded-full animate-[fall_2s_ease-in-out]"
              style={{
                left: `${piece.left}%`,
                top: "-10px",
                animationDelay: `${piece.delay}s`,
                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
              }}
            />
          ))}
        </div>
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl">Surprise Bonus!</DialogTitle>
          <DialogDescription className="text-base">
            You've been rewarded with <span className="font-bold text-primary">10 bonus credits</span>!
            Keep up the great work!
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => onOpenChange(false)} className="w-full">
          Awesome!
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// Add this to your tailwind.config.ts or index.css
// @keyframes fall {
//   to {
//     transform: translateY(100vh) rotate(360deg);
//     opacity: 0;
//   }
// }
