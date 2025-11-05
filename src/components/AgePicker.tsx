import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AgePickerProps {
  value: number;
  onChange: (age: number) => void;
  min?: number;
  max?: number;
}

export function AgePicker({ value, onChange, min = 1, max = 85 }: AgePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const ages = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const ITEM_HEIGHT = 60;

  const scrollToAge = (age: number, smooth = true) => {
    if (!containerRef.current) return;
    const index = ages.indexOf(age);
    const scrollTop = index * ITEM_HEIGHT;
    
    if (smooth) {
      // Smooth spring-like animation
      const start = containerRef.current.scrollTop;
      const distance = scrollTop - start;
      const duration = 400;
      const startTime = performance.now();
      
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        
        containerRef.current!.scrollTop = start + distance * eased;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    } else {
      containerRef.current.scrollTop = scrollTop;
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    setIsScrolling(true);
    clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      const scrollTop = containerRef.current!.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const newAge = ages[index];
      
      if (newAge !== value) {
        onChange(newAge);
        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      }
      scrollToAge(newAge, true);
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && value > min) {
      e.preventDefault();
      onChange(value - 1);
      scrollToAge(value - 1, true);
    } else if (e.key === "ArrowDown" && value < max) {
      e.preventDefault();
      onChange(value + 1);
      scrollToAge(value + 1, true);
    }
  };

  useEffect(() => {
    scrollToAge(value, false);
  }, []);

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Top fade overlay for depth */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-background via-background/98 to-transparent z-10 pointer-events-none rounded-t-lg" />
      
      {/* Scrollable container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={cn(
          "h-[180px] overflow-y-auto overflow-x-hidden snap-y snap-mandatory",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg",
          "scrollbar-hide relative"
        )}
        style={{
          paddingTop: `${ITEM_HEIGHT}px`,
          paddingBottom: `${ITEM_HEIGHT}px`,
          scrollBehavior: isScrolling ? "auto" : "smooth",
          scrollSnapType: 'y mandatory',
        }}
      >
        {ages.map((age) => {
          const isSelected = age === value;
          const containerScrollTop = containerRef.current?.scrollTop || 0;
          const index = ages.indexOf(age);
          const targetScrollTop = index * ITEM_HEIGHT;
          const distance = Math.abs(containerScrollTop - targetScrollTop);
          const maxDistance = ITEM_HEIGHT * 2;
          const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.7);
          const scale = isSelected ? 1 : Math.max(0.75, 1 - (distance / maxDistance) * 0.25);
          
          return (
            <div
              key={age}
              className={cn(
                "flex items-center justify-center cursor-pointer select-none",
                "transition-all ease-out",
                isSelected && !isScrolling ? "duration-300" : "duration-200"
              )}
              style={{ 
                height: `${ITEM_HEIGHT}px`,
                scrollSnapAlign: 'center',
                opacity: isSelected && !isScrolling ? 1 : opacity,
                transform: `scale(${isSelected && !isScrolling ? 1.15 : scale}) translateZ(0)`,
              }}
              onClick={() => {
                onChange(age);
                scrollToAge(age, true);
              }}
            >
              <span
                style={{
                  fontSize: isSelected && !isScrolling ? "3.5rem" : "2rem",
                  fontWeight: isSelected && !isScrolling ? "700" : "500",
                  color: isSelected && !isScrolling ? "#00ffff" : "hsl(var(--muted-foreground))",
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  transition: 'all 0.3s ease-out',
                }}
              >
                {age}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Bottom fade overlay for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background via-background/98 to-transparent z-10 pointer-events-none rounded-b-lg" />
      
      {/* Instructions */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Scroll or use arrow keys to select
      </p>
    </div>
  );
}
