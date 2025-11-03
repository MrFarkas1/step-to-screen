import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Obstacle {
  id: number;
  x: number;
}

interface StepRaceGameProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const StepRaceGame = ({ onComplete, onClose }: StepRaceGameProps) => {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const nextIdRef = useRef(0);
  const gameSpeed = useRef(3);

  useEffect(() => {
    if (gameOver) return;

    // Spawn obstacles
    const spawnInterval = setInterval(() => {
      setObstacles(prev => [
        ...prev,
        {
          id: nextIdRef.current++,
          x: 400,
        }
      ]);
    }, 1500);

    // Move obstacles
    const moveInterval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev.map(obstacle => ({
          ...obstacle,
          x: obstacle.x - gameSpeed.current
        })).filter(obstacle => obstacle.x > -50);
        
        return updated;
      });
      
      setScore(s => s + 1);
      
      // Increase speed over time
      gameSpeed.current = Math.min(6, 3 + score * 0.01);
    }, 16);

    // Timer
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
  }, [gameOver, score]);

  // Collision detection
  useEffect(() => {
    if (gameOver || isJumping) return;

    const playerLeft = 50;
    const playerRight = 80;
    
    obstacles.forEach(obstacle => {
      if (obstacle.x > playerLeft - 30 && obstacle.x < playerRight + 10) {
        setHits(h => h + 1);
        setObstacles(prev => prev.filter(o => o.id !== obstacle.id));
      }
    });
  }, [obstacles, isJumping, gameOver]);

  useEffect(() => {
    if (hits >= 3 && !gameOver) {
      setGameOver(true);
    }
  }, [hits, gameOver]);

  useEffect(() => {
    if (gameOver) {
      onComplete(score);
    }
  }, [gameOver, score, onComplete]);

  const jump = () => {
    if (isJumping) return;
    
    setIsJumping(true);
    setPlayerY(-80);
    
    setTimeout(() => {
      setPlayerY(-60);
    }, 100);
    
    setTimeout(() => {
      setPlayerY(-40);
    }, 200);
    
    setTimeout(() => {
      setPlayerY(-20);
    }, 300);
    
    setTimeout(() => {
      setPlayerY(0);
      setIsJumping(false);
    }, 400);
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
          <span>Hits: {hits}/3</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      
      <div 
        className="flex-1 relative overflow-hidden bg-gradient-to-b from-sky-200 to-green-200 dark:from-sky-900 dark:to-green-900 cursor-pointer"
        onClick={jump}
      >
        {/* Ground line */}
        <div className="absolute bottom-24 left-0 right-0 h-1 bg-foreground/20" />
        
        {/* Player */}
        <div 
          className="absolute bottom-24 left-12 w-8 h-12 bg-primary rounded-lg transition-all duration-100 flex items-center justify-center text-2xl"
          style={{ transform: `translateY(${playerY}px)` }}
        >
          🏃
        </div>
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute bottom-24 w-6 h-8 bg-destructive rounded"
            style={{ left: `${obstacle.x}px` }}
          />
        ))}
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
          Tap to jump!
        </div>
      </div>
    </div>
  );
};
