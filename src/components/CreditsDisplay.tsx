import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Coins, Gift, TrendingUp, Star, Award } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CreditsDisplayProps {
  credits: number;
}

export const CreditsDisplay = ({ credits }: CreditsDisplayProps) => {
  const [open, setOpen] = useState(false);
  const earnedFromSteps = Math.floor(credits * 0.6);
  const earnedFromQuests = Math.floor(credits * 0.25);
  const earnedFromBonuses = credits - earnedFromSteps - earnedFromQuests;
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Card className="p-4 bg-gradient-success border-0 interactive-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center icon-glow">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Total Credits</p>
              <p className="text-2xl font-bold text-white">{credits}</p>
            </div>
          </div>
        </Card>
      </PopoverTrigger>
      
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Coins className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-foreground">Credits Breakdown</h3>
          </div>
          
          <div className="text-center py-3 bg-success/10 rounded-lg border border-success/20">
            <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
            <p className="text-3xl font-bold text-success">{credits}</p>
            <p className="text-xs text-muted-foreground mt-1">credits</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Earned From</p>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">Daily Steps</span>
              </div>
              <span className="font-semibold text-foreground">{earnedFromSteps}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">Quests & Challenges</span>
              </div>
              <span className="font-semibold text-foreground">{earnedFromQuests}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">Bonuses & Streaks</span>
              </div>
              <span className="font-semibold text-foreground">{earnedFromBonuses}</span>
            </div>
          </div>
          
          <div className="pt-2 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Earn more credits by completing quests! 💰
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
