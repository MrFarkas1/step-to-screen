import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppRestrictionsList } from "./AppRestrictionsList";
import { PinSetup } from "./PinSetup";
import { useAppRestrictions } from "@/hooks/useAppRestrictions";
import { Shield } from "lucide-react";

interface AppRestrictionsOnboardingProps {
  onComplete: () => void;
}

export function AppRestrictionsOnboarding({
  onComplete,
}: AppRestrictionsOnboardingProps) {
  const [step, setStep] = useState<"apps" | "pin">("apps");
  const { apps, toggleApp, toggleAllApps, setPin, getRestrictedApps } =
    useAppRestrictions();

  const handleContinue = () => {
    const restrictedApps = getRestrictedApps();
    if (restrictedApps.length > 0) {
      setStep("pin");
    } else {
      onComplete();
    }
  };

  const handlePinComplete = (pin: string) => {
    setPin(pin);
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  if (step === "pin") {
    return <PinSetup onComplete={handlePinComplete} onSkip={handleSkip} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-2">
          <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">Select Apps to Restrict</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          Choose which apps you want to limit. You'll need to earn screen time
          by walking to use them.
        </p>
      </div>

      <div className="max-h-[50vh] overflow-y-auto px-1">
        <AppRestrictionsList
          apps={apps}
          onToggle={toggleApp}
          onToggleAll={toggleAllApps}
          showSelectAll={true}
        />
      </div>

      <div className="flex gap-3 pt-4 flex-col sm:flex-row">
        <Button variant="outline" onClick={handleSkip} className="flex-1 touch-manipulation min-h-[44px]">
          Skip for Now
        </Button>
        <Button onClick={handleContinue} className="flex-1 touch-manipulation min-h-[44px]">
          Continue
        </Button>
      </div>
    </div>
  );
}
