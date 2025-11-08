import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Share2 } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAppRestrictions } from "@/hooks/useAppRestrictions";
import { toast } from "sonner";
import { AgePicker } from "@/components/AgePicker";
import { AppRestrictionsOnboarding } from "@/components/AppRestrictionsOnboarding";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { completeOnboarding, data } = useOnboarding();
  const { enabled: appRestrictionsEnabled } = useAppRestrictions();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(data.age || 25);
  const [dailyHours, setDailyHours] = useState(data.dailyHours || 5);
  const [showResult, setShowResult] = useState(false);
  const [showAppRestrictions, setShowAppRestrictions] = useState(false);
  const [animatedYears, setAnimatedYears] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate wasted years using current local state
  const calculateWastedYears = (currentAge: number, currentDailyHours: number) => {
    const LIFESPAN = 85;
    
    if (!currentAge || !currentDailyHours) {
      return { years: 0, isValid: false, atLifespan: false };
    }
    
    if (currentAge >= LIFESPAN) {
      return { years: 0, isValid: true, atLifespan: true };
    }
    
    const remainingYears = LIFESPAN - currentAge;
    const wastedYears = remainingYears * (currentDailyHours / 24);
    
    return {
      years: parseFloat(wastedYears.toFixed(1)),
      isValid: true,
      atLifespan: false
    };
  };

  const handleNext = () => {
    if (step === 1) {
      if (!age || age < 1 || age > 120) {
        toast.error("Please enter a realistic age between 1 and 120");
        return;
      }
      if (age >= 85) {
        toast("At age 85+, you've reached the lifespan baseline. We'll show you the impact anyway!", {
          duration: 4000,
        });
      }
    }
    
    if (step === 2 && (dailyHours < 0 || dailyHours > 24)) {
      toast.error("Please enter hours between 0 and 24");
      return;
    }
    
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Calculate and show result
      completeOnboarding(age, dailyHours);
      setShowResult(true);
      startAnimation();
    }
  };

  const startAnimation = () => {
    setIsAnimating(true);
    const result = calculateWastedYears(age, dailyHours);
    const targetYears = result.years;
    const duration = 3000; // 3 seconds
    const steps = 60;
    const increment = targetYears / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= targetYears) {
        setAnimatedYears(targetYears);
        setIsAnimating(false);
        clearInterval(interval);
      } else {
        setAnimatedYears(parseFloat(current.toFixed(1)));
      }
    }, duration / steps);
  };

  const handleShare = () => {
    const result = calculateWastedYears(age, dailyHours);
    const text = result.atLifespan 
      ? `At age ${age}, I've reached the 85-year lifespan baseline. Time to make every moment count with StrollScroll! 📱`
      : `If I keep using my phone ${dailyHours} hours daily, I'll waste ${result.years} years of my remaining life on screens! 📱 Time to walk more with StrollScroll.`;
    
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Result copied to clipboard!");
    }
  };

  const handleStartStrolling = () => {
    // Skip app restrictions if already configured
    if (appRestrictionsEnabled) {
      onComplete();
    } else {
      setShowAppRestrictions(true);
    }
  };

  const handleAppRestrictionsComplete = () => {
    onComplete();
  };

  // Show app restrictions after result
  if (showAppRestrictions) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-primary/5 to-background animate-fade-in">
        <div className="h-full flex flex-col items-center justify-center p-6">
          <AppRestrictionsOnboarding onComplete={handleAppRestrictionsComplete} />
        </div>
      </div>
    );
  }

  if (showResult) {
    const result = calculateWastedYears(age, dailyHours);
    
    // Handle edge cases
    if (!result.isValid) {
      return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-fade-in flex items-center justify-center p-6">
          <Card className="p-8 max-w-md">
            <p className="text-center text-lg">Invalid data. Please try again.</p>
            <Button onClick={() => setShowResult(false)} className="w-full mt-4">Go Back</Button>
          </Card>
        </div>
      );
    }
    
    const funFacts = [
      "That's enough time to walk around Earth twice 🌍",
      "Or learn 3 new languages 🧠",
      "You could become a master chef 👨‍🍳",
      "Or write 10 bestselling novels 📚",
    ];
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-fade-in">
        <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Floating particles */}
          {!isAnimating && (
            <>
              <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-float opacity-60" />
              <div className="absolute top-40 right-20 w-3 h-3 bg-secondary rounded-full animate-float opacity-40" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-32 left-20 w-2 h-2 bg-primary rounded-full animate-float opacity-50" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-20 right-10 w-3 h-3 bg-secondary rounded-full animate-float opacity-30" style={{ animationDelay: '1.5s' }} />
            </>
          )}

          <div className="max-w-md w-full space-y-8 text-center animate-scale-in">
            {/* Main counter */}
            <div className="space-y-4">
              <div className="relative">
                <div className={`text-7xl md:text-8xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                  {animatedYears}
                </div>
                {isAnimating && (
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                )}
              </div>
              
              <div className="text-2xl md:text-3xl font-semibold text-foreground">
                {result.atLifespan ? "years at" : "years"}
              </div>
              
              <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-muted-foreground">
                {result.atLifespan ? (
                  <span>You've reached the 85-year baseline</span>
                ) : (
                  <>
                    <span>you'll waste from now on</span>
                    <span className="text-3xl">📱</span>
                  </>
                )}
              </div>
            </div>

            {!isAnimating && (
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {/* Progress indicator */}
                <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((result.years / 10) * 100, 100)}%` }}
                  />
                </div>

                {/* Fun fact */}
                <Card className="p-4 bg-card/50 backdrop-blur border-primary/20">
                  <p className="text-sm text-muted-foreground">{randomFact}</p>
                </Card>

                {/* Motivational message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <p className="text-lg font-semibold text-foreground">
                      {result.atLifespan 
                        ? "Every moment counts!" 
                        : "Let's turn those years into memories"}
                    </p>
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <p className="text-muted-foreground">
                    {result.atLifespan
                      ? "Start making every screen minute count — walk more, live better!"
                      : `If you keep using your phone ${dailyHours} hours daily, you will waste about ${result.years} years of your remaining life (assuming an 85-year lifespan).`}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    size="lg"
                    onClick={handleStartStrolling}
                    className="w-full text-lg h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-glow"
                  >
                    Start Strolling
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleShare}
                    className="w-full"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share My Result
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-primary/5 to-background animate-fade-in">
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <Card className="p-8 space-y-6 animate-scale-in backdrop-blur bg-card/95 shadow-glow border-primary/20">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold text-foreground">
                    How old are you?
                  </h2>
                  <p className="text-muted-foreground">
                    Help us calculate your screen time impact
                  </p>
                </div>

                <div className="pt-4">
                  <AgePicker
                    value={age}
                    onChange={setAge}
                    min={1}
                    max={85}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold text-foreground">
                    Daily screen time?
                  </h2>
                  <p className="text-muted-foreground">
                    How many hours do you spend on your phone daily?
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-2">
                      {dailyHours}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      hours per day
                    </div>
                  </div>

                  <Slider
                    value={[dailyHours]}
                    onValueChange={([value]) => setDailyHours(value)}
                    min={0}
                    max={24}
                    step={0.5}
                    className="w-full"
                  />

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0h</span>
                    <span>24h</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              size="lg"
              onClick={handleNext}
              className="w-full text-lg h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {step < 2 ? "Continue" : "Calculate"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Your data stays private and secure on your device
          </p>
        </div>
      </div>
    </div>
  );
}
