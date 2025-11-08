import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PinSetupProps {
  onComplete: (pin: string) => void;
  onSkip?: () => void;
}

export function PinSetup({ onComplete, onSkip }: PinSetupProps) {
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePin = () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleConfirmPin = () => {
    if (confirmPin !== pin) {
      setError("PINs do not match");
      return;
    }
    setError("");
    onComplete(pin);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-2">
          <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          {step === "create" ? "Set Your Protection PIN" : "Confirm Your PIN"}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {step === "create"
            ? "Create a 4-digit PIN to protect your app restrictions"
            : "Enter your PIN again to confirm"}
        </p>
      </div>

      <div className="space-y-4">
        {step === "create" ? (
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-base">
              Enter PIN
            </Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                className="text-lg text-center tracking-widest pr-10 h-12 touch-manipulation"
                placeholder="••••"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="confirmPin" className="text-base">
              Confirm PIN
            </Label>
            <div className="relative">
              <Input
                id="confirmPin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => {
                  setConfirmPin(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                className="text-lg text-center tracking-widest pr-10 h-12 touch-manipulation"
                placeholder="••••"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}

        <div className="flex gap-3 pt-2 flex-col sm:flex-row">
          {onSkip && step === "create" && (
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1 touch-manipulation min-h-[44px]"
            >
              Skip for Now
            </Button>
          )}
          <Button
            onClick={step === "create" ? handleCreatePin : handleConfirmPin}
            className="flex-1 touch-manipulation min-h-[44px]"
            disabled={step === "create" ? pin.length < 4 : confirmPin.length < 4}
          >
            {step === "create" ? "Continue" : "Confirm PIN"}
          </Button>
        </div>

        {step === "confirm" && (
          <Button
            variant="ghost"
            onClick={() => {
              setStep("create");
              setConfirmPin("");
              setError("");
            }}
            className="w-full touch-manipulation min-h-[44px]"
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
