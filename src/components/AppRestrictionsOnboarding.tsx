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
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Select Apps to Restrict</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
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

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={handleSkip} className="flex-1">
          Skip for Now
        </Button>
        <Button onClick={handleContinue} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
