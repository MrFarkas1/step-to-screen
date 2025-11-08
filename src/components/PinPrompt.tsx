import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PinPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onForgot: () => void;
  verifyPin: (pin: string) => boolean;
}

export function PinPrompt({
  open,
  onOpenChange,
  onSuccess,
  onForgot,
  verifyPin,
}: PinPromptProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (verifyPin(pin)) {
      setError("");
      setPin("");
      onSuccess();
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  };

  const handleClose = () => {
    setPin("");
    setError("");
    setShowPin(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="animate-scale-in max-w-sm">
        <AlertDialogHeader>
          <div className="flex justify-center mb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Enter Your PIN
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This feature is protected. Enter your PIN to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="pinInput" className="sr-only">
              PIN
            </Label>
            <div className="relative">
              <Input
                id="pinInput"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && pin.length >= 4) {
                    handleSubmit();
                  }
                }}
                className="text-lg text-center tracking-widest pr-10"
                placeholder="••••"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center animate-fade-in">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={pin.length < 4}
            >
              Unlock
            </Button>
            <Button
              variant="ghost"
              onClick={handleClose}
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                handleClose();
                onForgot();
              }}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Forgot PIN?
            </button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
