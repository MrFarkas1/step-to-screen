import { Settings, Moon, Sun, Zap, Target } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface SettingsSheetProps {
  stepsPerMinute: number;
  onRateChange: (value: number) => void;
  dailyGoal: number;
  onGoalChange: (value: number) => void;
}

export function SettingsSheet({
  stepsPerMinute,
  onRateChange,
  dailyGoal,
  onGoalChange,
}: SettingsSheetProps) {
  const { theme, setTheme } = useTheme();

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
        </div>
      </SheetContent>
    </Sheet>
  );
}
