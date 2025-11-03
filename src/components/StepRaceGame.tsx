import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Zap } from "lucide-react";

interface Obstacle {
  id: number;
  x: number;
  type: "rock" | "hole" | "cactus";
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
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showJumpEffect, setShowJumpEffect] = useState(false);
  const nextIdRef = useRef(0);
  const gameSpeed = useRef(3);
  const containerWidthRef = useRef(400);

  useEffect(() => {
    if (gameOver) return;

    // Spawn obstacles with variety
    const spawnInterval = setInterval(() => {
      const obstacleTypes: Array<"rock" | "hole" | "cactus"> = ["rock", "hole", "cactus"];
      const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      
      setObstacles(prev => [
        ...prev,
        {
          id: nextIdRef.current++,
          x: containerWidthRef.current,
          type: randomType,
        }
      ]);
    }, 1400);

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
    if (isJumping || gameOver) return;
    
    setIsJumping(true);
    setShowJumpEffect(true);
    
    // Smoother jump arc
    setPlayerY(-100);
    setTimeout(() => setPlayerY(-90), 50);
    setTimeout(() => setPlayerY(-75), 100);
    setTimeout(() => setPlayerY(-55), 150);
    setTimeout(() => setPlayerY(-35), 200);
    setTimeout(() => setPlayerY(-20), 250);
    setTimeout(() => setPlayerY(-8), 300);
    setTimeout(() => {
      setPlayerY(0);
      setIsJumping(false);
      setShowJumpEffect(false);
    }, 350);
  };

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setGameOver(true);
    onClose();
  };

  const getObstacleEmoji = (type: string) => {
    switch (type) {
      case "rock": return "🪨";
      case "hole": return "🕳️";
      case "cactus": return "🌵";
      default: return "🪨";
    }
  };

  if (gameOver) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-900 z-50 flex flex-col animate-fade-in">
      {/* Header with stats */}
      <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="flex gap-3 items-center">
          <Badge variant="secondary" className="text-base font-bold px-3">
            Distance: {score}
          </Badge>
          <Badge variant={timeLeft <= 5 ? "destructive" : "default"} className="text-base font-bold px-3">
            {timeLeft}s
          </Badge>
          <Badge variant={hits >= 2 ? "destructive" : "outline"} className="text-sm px-2 flex gap-1">
            ❤️ {3 - hits}
          </Badge>
          {gameSpeed.current > 4 && (
            <Badge variant="default" className="text-xs px-2 flex gap-1 items-center animate-pulse">
              <Zap className="w-3 h-3" /> Fast!
            </Badge>
          )}
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

      {/* Moving background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 text-4xl opacity-20 animate-[slide-in-right_8s_linear_infinite]" style={{ right: '-100px' }}>☁️</div>
        <div className="absolute top-32 text-3xl opacity-15 animate-[slide-in-right_12s_linear_infinite]" style={{ right: '-100px', animationDelay: '2s' }}>🌤️</div>
        <div className="absolute top-48 text-2xl opacity-10 animate-[slide-in-right_10s_linear_infinite]" style={{ right: '-100px', animationDelay: '4s' }}>☁️</div>
      </div>
      
      {/* Game area */}
      <div 
        className="flex-1 relative overflow-hidden cursor-pointer select-none touch-manipulation"
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
      >
        {/* Ground with texture */}
        <div className="absolute bottom-16 left-0 right-0 h-24 bg-gradient-to-b from-green-400/30 to-green-600/40 dark:from-green-800/30 dark:to-green-950/40" />
        <div className="absolute bottom-16 left-0 right-0 h-1 bg-foreground/30 shadow-lg" />
        
        {/* Ground decorations */}
        <div className="absolute bottom-20 left-10 text-2xl opacity-40">🌱</div>
        <div className="absolute bottom-20 right-24 text-2xl opacity-40">🌼</div>
        <div className="absolute bottom-18 left-32 text-xl opacity-30">🌿</div>
        
        {/* Player with shadow */}
        <div className="absolute bottom-16 left-16">
          <div 
            className="relative transition-all duration-100 ease-out"
            style={{ transform: `translateY(${playerY}px)` }}
          >
            {/* Jump trail effect */}
            {showJumpEffect && (
              <div className="absolute inset-0 animate-[scale-out_0.3s_ease-out]">
                <div className="text-3xl opacity-50">💨</div>
              </div>
            )}
            
            {/* Player character */}
            <div className="relative">
              <div className="text-4xl drop-shadow-lg animate-[bounce_0.3s_ease-in-out]" style={{ 
                animationPlayState: isJumping ? 'running' : 'paused' 
              }}>
                🏃
              </div>
              
              {/* Shadow */}
              <div 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full blur-sm transition-all"
                style={{ 
                  transform: `translateX(-50%) scale(${1 - Math.abs(playerY) / 150})`,
                  opacity: 1 - Math.abs(playerY) / 150,
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute bottom-16 transition-none"
            style={{ left: `${obstacle.x}px` }}
          >
            <div className="text-3xl drop-shadow-md animate-[bounce_1s_ease-in-out_infinite]">
              {getObstacleEmoji(obstacle.type)}
            </div>
            {/* Obstacle shadow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm" />
          </div>
        ))}

        {/* Instruction hint */}
        {score < 50 && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center animate-fade-in pointer-events-none">
            <div className="text-3xl mb-2 animate-bounce">👆</div>
            <div className="text-lg font-medium text-foreground/80 bg-background/60 backdrop-blur-sm px-4 py-2 rounded-lg">
              Tap to jump!
            </div>
          </div>
        )}

        {/* Speed indicator */}
        <div className="absolute bottom-4 right-4 flex gap-1">
          {[...Array(Math.min(5, Math.floor(gameSpeed.current)))].map((_, i) => (
            <div key={i} className="w-1 h-3 bg-primary rounded-full animate-pulse" />
          ))}
        </div>
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
