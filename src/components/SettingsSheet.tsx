import { Settings, Moon, Sun, Zap, Target, RefreshCw, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { AppRestrictionsSettings } from "./AppRestrictionsSettings";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface SettingsSheetProps {
  stepsPerMinute: number;
  onRateChange: (value: number) => void;
  dailyGoal: number;
  onGoalChange: (value: number) => void;
  onResetOnboarding: () => void;
}

export function SettingsSheet({
  stepsPerMinute,
  onRateChange,
  dailyGoal,
  onGoalChange,
  onResetOnboarding,
}: SettingsSheetProps) {
  const { theme, setTheme } = useTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteAllData = () => {
    // Clear all localStorage data
    localStorage.clear();
    
    // Show success toast
    toast({
      title: "✅ App restarted successfully",
      description: "All data has been deleted",
      duration: 2500,
    });
    
    // Small delay to show toast, then reload
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
          <SheetDescription>
            Customize your step tracking experience
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto h-[calc(100%-80px)] pb-6">
          {/* Theme Setting */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <Label className="text-base font-semibold">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred theme
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>
          </div>

          <Separator />

          {/* Conversion Rate Setting */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-base font-semibold">
                  Conversion Rate
                </Label>
                <p className="text-sm text-muted-foreground">
                  Steps needed per minute of screen time
                </p>
              </div>
            </div>
            <div className="space-y-3 px-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {stepsPerMinute} steps/min
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round(10000 / stepsPerMinute)} min for 10k steps
                </span>
              </div>
              <Slider
                value={[stepsPerMinute]}
                onValueChange={([value]) => onRateChange(value)}
                min={50}
                max={500}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Daily Goal Setting */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-base font-semibold">Daily Goal</Label>
                <p className="text-sm text-muted-foreground">
                  Your daily step target
                </p>
              </div>
            </div>
            <div className="space-y-3 px-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {dailyGoal.toLocaleString()} steps
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round(dailyGoal / stepsPerMinute)} min max
                </span>
              </div>
              <Slider
                value={[dailyGoal]}
                onValueChange={([value]) => onGoalChange(value)}
                min={5000}
                max={20000}
                step={1000}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Recalculate Screen Life */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-base font-semibold">
                  Screen Life Calculator
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recalculate your lifetime screen time
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={onResetOnboarding}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Recalculate My Screen Life
            </Button>
          </div>

          <Separator />

          {/* App Restrictions */}
          <AppRestrictionsSettings />

          <Separator />

          {/* Delete All Data */}
          <div className="space-y-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <Label className="text-base font-semibold text-destructive">
                  Danger Zone
                </Label>
                <p className="text-sm text-muted-foreground">
                  Delete all data and restart the app
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              className="w-full font-bold shadow-lg"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Data & Restart App
            </Button>
          </div>
        </div>
      </SheetContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              ⚠️ Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete all your data and restart the app? 
              This action cannot be undone. All your progress, settings, and preferences will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-medium">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
