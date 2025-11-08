import { useState } from "react";
import { Shield, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppRestrictionsList } from "./AppRestrictionsList";
import { PinPrompt } from "./PinPrompt";
import { PinSetup } from "./PinSetup";
import { useAppRestrictions } from "@/hooks/useAppRestrictions";
import { toast } from "@/hooks/use-toast";

export function AppRestrictionsSettings() {
  const {
    apps,
    enabled,
    toggleApp,
    verifyPin,
    changePin,
    resetRestrictions,
    getRestrictedApps,
  } = useAppRestrictions();
  
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [showChangePinDialog, setShowChangePinDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(!enabled);
  const [pendingAction, setPendingAction] = useState<"apps" | "changePin" | null>(
    null
  );

  const requestAccess = (action: "apps" | "changePin") => {
    if (!enabled) {
      if (action === "apps") {
        setIsUnlocked(true);
      } else {
        setShowChangePinDialog(true);
      }
      return;
    }
    setPendingAction(action);
    setShowPinPrompt(true);
  };

  const handlePinSuccess = () => {
    setShowPinPrompt(false);
    if (pendingAction === "apps") {
      setIsUnlocked(true);
    } else if (pendingAction === "changePin") {
      setShowChangePinDialog(true);
    }
    setPendingAction(null);
  };

  const handleForgotPin = () => {
    setShowResetDialog(true);
  };

  const handleResetRestrictions = () => {
    resetRestrictions();
    setIsUnlocked(true);
    setShowResetDialog(false);
    toast({
      title: "Restrictions Reset",
      description: "All app restrictions and PIN have been removed",
    });
  };

  const handlePinChange = (newPin: string) => {
    changePin(newPin);
    setShowChangePinDialog(false);
    toast({
      title: "PIN Changed",
      description: "Your protection PIN has been updated",
    });
  };

  const restrictedApps = getRestrictedApps();

  if (!enabled) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <Label className="text-base font-semibold">App Restrictions</Label>
            <p className="text-sm text-muted-foreground">
              No restrictions set up yet
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground px-2">
          Set up app restrictions during onboarding or restart the app to configure them.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <Label className="text-base font-semibold">App Restrictions</Label>
            <p className="text-sm text-muted-foreground">
              {restrictedApps.length} app{restrictedApps.length !== 1 ? "s" : ""}{" "}
              currently restricted
            </p>
          </div>
        </div>

        {isUnlocked ? (
          <div className="space-y-4">
            <div className="max-h-[40vh] overflow-y-auto px-1">
              <AppRestrictionsList
                apps={apps}
                onToggle={toggleApp}
                showSelectAll={false}
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsUnlocked(false)}
            >
              Lock Settings
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => requestAccess("apps")}
          >
            <Lock className="mr-2 h-4 w-4" />
            Unlock to Manage Apps
          </Button>
        )}

        <Separator />

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => requestAccess("changePin")}
          >
            Change PIN
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowResetDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Reset All Restrictions
          </Button>
        </div>

        <p className="text-xs text-muted-foreground px-2 pt-2">
          Choose which apps to limit and protect your settings with a PIN.
        </p>
      </div>

      <PinPrompt
        open={showPinPrompt}
        onOpenChange={setShowPinPrompt}
        onSuccess={handlePinSuccess}
        onForgot={handleForgotPin}
        verifyPin={verifyPin}
      />

      <AlertDialog
        open={showChangePinDialog}
        onOpenChange={setShowChangePinDialog}
      >
        <AlertDialogContent className="max-w-md">
          <PinSetup
            onComplete={handlePinChange}
            onSkip={() => setShowChangePinDialog(false)}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Reset All Restrictions?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This will remove all app restrictions and delete your protection PIN.
              You can set them up again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetRestrictions}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset Restrictions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
