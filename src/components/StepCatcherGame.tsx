import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Footprints, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FallingStep {
  id: number;
  x: number;
  y: number;
  speed: number;
}

interface CatchParticle {
  id: number;
  x: number;
  y: number;
}

interface StepCatcherGameProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const StepCatcherGame = ({ onComplete, onClose }: StepCatcherGameProps) => {
  const [steps, setSteps] = useState<FallingStep[]>([]);
  const [particles, setParticles] = useState<CatchParticle[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (gameOver) return;

    // Spawn steps with better distribution
    const spawnInterval = setInterval(() => {
      if (gameAreaRef.current) {
        const width = gameAreaRef.current.clientWidth;
        const spawnX = Math.random() * (width - 80) + 40; // Keep away from edges
        setSteps(prev => [
          ...prev,
          {
            id: nextIdRef.current++,
            x: spawnX,
            y: -60,
            speed: 2.5 + Math.random() * 1.5,
          }
        ]);
      }
    }, 700);

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

  const catchStep = (id: number, x: number, y: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Debounce rapid taps
    const now = Date.now();
    if (now - lastTapRef.current < 50) return;
    lastTapRef.current = now;
    
    setSteps(prev => prev.filter(step => step.id !== id));
    setScore(s => s + 1);
    
    // Create particle burst effect
    setParticles(prev => [
      ...prev,
      { id: particleIdRef.current++, x, y }
    ]);
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particleIdRef.current - 1));
    }, 600);
  };

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setGameOver(true);
    onClose();
  };

  if (gameOver) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-100 via-blue-50 to-blue-100 dark:from-sky-950 dark:via-blue-950 dark:to-blue-900 z-50 flex flex-col animate-fade-in">
      {/* Header with stats */}
      <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="flex gap-3 items-center">
          <Badge variant="secondary" className="text-base font-bold px-3">
            Score: {score}
          </Badge>
          <Badge variant={timeLeft <= 5 ? "destructive" : "default"} className="text-base font-bold px-3">
            {timeLeft}s
          </Badge>
          <Badge variant={missed >= 7 ? "destructive" : "outline"} className="text-sm px-2">
            Miss: {missed}/10
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleExitClick}
          className="hover:bg-destructive/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Floating clouds background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-[float_8s_ease-in-out_infinite]">☁️</div>
        <div className="absolute top-32 right-16 text-5xl opacity-15 animate-[float_10s_ease-in-out_infinite]">☁️</div>
        <div className="absolute top-64 left-24 text-7xl opacity-10 animate-[float_12s_ease-in-out_infinite]">☁️</div>
      </div>
      
      {/* Game area */}
      <div 
        ref={gameAreaRef}
        className="flex-1 relative overflow-hidden"
      >
        {/* Falling steps */}
        {steps.map(step => (
          <button
            key={step.id}
            onClick={(e) => catchStep(step.id, step.x, step.y, e)}
            className="absolute transition-none cursor-pointer hover:scale-110 active:scale-90 touch-manipulation p-4 -m-4"
            style={{
              left: `${step.x}px`,
              top: `${step.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            aria-label="Catch step"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 animate-pulse" />
              <Footprints className="w-12 h-12 text-primary drop-shadow-lg relative" />
            </div>
          </button>
        ))}

        {/* Particle burst effects */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
            }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 animate-[scale-in_0.3s_ease-out]">
              <div className="text-4xl font-bold text-primary animate-[fade-out_0.6s_ease-out]">+1</div>
            </div>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full animate-[fade-out_0.6s_ease-out]"
                style={{
                  left: '0',
                  top: '0',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-20px)`,
                }}
              />
            ))}
          </div>
        ))}

        {/* Instruction hint */}
        {score === 0 && timeLeft > 18 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-fade-in pointer-events-none">
            <div className="text-2xl font-bold text-foreground/70 mb-2">👇</div>
            <div className="text-lg font-medium text-muted-foreground">Tap the falling steps!</div>
          </div>
        )}
      </div>

      {/* Exit confirmation dialog */}
      {showExitConfirm && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 animate-fade-in">
          <div className="bg-card p-6 rounded-lg shadow-xl max-w-sm mx-4 space-y-4 animate-scale-in">
            <h3 className="text-xl font-bold">Exit Game?</h3>
            <p className="text-muted-foreground">You'll lose your current progress and score won't count.</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1"
              >
                Keep Playing
              </Button>
              <Button
                variant="destructive"
                onClick={confirmExit}
                className="flex-1"
              >
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
