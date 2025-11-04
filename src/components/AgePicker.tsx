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
    containerRef.current.scrollTo({
      top: scrollTop,
      behavior: smooth ? "smooth" : "auto",
    });
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
      {/* Top fade overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-card via-card/80 to-transparent z-10 pointer-events-none rounded-t-lg" />
      
      {/* Selection indicator */}
      <div className="absolute top-1/2 left-0 right-0 h-[60px] -translate-y-1/2 border-y-2 border-primary/30 bg-primary/5 z-10 pointer-events-none" />
      
      {/* Scrollable container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={cn(
          "h-[180px] overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg",
          "scrollbar-hide relative"
        )}
        style={{
          paddingTop: `${ITEM_HEIGHT}px`,
          paddingBottom: `${ITEM_HEIGHT}px`,
        }}
      >
        {ages.map((age) => {
          const isSelected = age === value;
          return (
            <div
              key={age}
              className={cn(
                "snap-center flex items-center justify-center transition-all duration-200 cursor-pointer",
                isSelected && !isScrolling
                  ? "text-5xl font-bold text-primary scale-110"
                  : "text-3xl font-medium text-muted-foreground scale-90 opacity-50"
              )}
              style={{ height: `${ITEM_HEIGHT}px` }}
              onClick={() => {
                onChange(age);
                scrollToAge(age, true);
              }}
            >
              {age}
            </div>
          );
        })}
      </div>
      
      {/* Bottom fade overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card via-card/80 to-transparent z-10 pointer-events-none rounded-b-lg" />
      
      {/* Instructions */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Scroll or use arrow keys to select
      </p>
    </div>
  );
}
