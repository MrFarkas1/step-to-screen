import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Footprints } from "lucide-react";

interface FallingStep {
  id: number;
  x: number;
  y: number;
  speed: number;
}

interface StepCatcherGameProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const StepCatcherGame = ({ onComplete, onClose }: StepCatcherGameProps) => {
  const [steps, setSteps] = useState<FallingStep[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);

  useEffect(() => {
    if (gameOver) return;

    // Spawn steps
    const spawnInterval = setInterval(() => {
      if (gameAreaRef.current) {
        const width = gameAreaRef.current.clientWidth;
        setSteps(prev => [
          ...prev,
          {
            id: nextIdRef.current++,
            x: Math.random() * (width - 40),
            y: -40,
            speed: 2 + Math.random() * 2,
          }
        ]);
      }
    }, 800);

    // Move steps
    const moveInterval = setInterval(() => {
      setSteps(prev => {
        const updated = prev.map(step => ({
          ...step,
          y: step.y + step.speed
        }));
        
        // Remove steps that hit the bottom
        const gameHeight = gameAreaRef.current?.clientHeight || 500;
        const filtered = updated.filter(step => {
          if (step.y > gameHeight) {
            setMissed(m => m + 1);
            return false;
          }
          return true;
        });
        
        return filtered;
      });
    }, 16);

    // Countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      clearInterval(timerInterval);
    };
  }, [gameOver]);

  // End game if too many missed
  useEffect(() => {
    if (missed >= 10 && !gameOver) {
      setGameOver(true);
    }
  }, [missed, gameOver]);

  useEffect(() => {
    if (gameOver) {
      onComplete(score);
    }
  }, [gameOver, score, onComplete]);

  const catchStep = (id: number) => {
    setSteps(prev => prev.filter(step => step.id !== id));
    setScore(s => s + 1);
  };

  if (gameOver) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-4 text-sm font-medium">
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
          <span>Missed: {missed}/10</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="flex-1 relative overflow-hidden bg-gradient-to-b from-background to-muted"
      >
        {steps.map(step => (
          <button
            key={step.id}
            onClick={() => catchStep(step.id)}
            className="absolute transition-none cursor-pointer hover:scale-110 active:scale-90"
            style={{
              left: `${step.x}px`,
              top: `${step.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Footprints className="w-10 h-10 text-primary animate-pulse" />
          </button>
        ))}
      </div>
    </div>
  );
};
