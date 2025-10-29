import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings2 } from "lucide-react";

interface ConversionRateProps {
  stepsPerMinute: number;
  onAdjust: () => void;
}

export const ConversionRate = ({ stepsPerMinute, onAdjust }: ConversionRateProps) => {
  return (
    <Card className="p-6 shadow-card border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-success rounded-xl">
            <ArrowRight className="w-5 h-5 text-success-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
            <p className="text-xs text-muted-foreground/70">Steps to screen time</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onAdjust}
          className="h-8 w-8 hover:bg-muted"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-foreground">{stepsPerMinute}</span>
          <span className="text-sm text-muted-foreground font-medium">steps</span>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground" />
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-foreground">1</span>
          <span className="text-sm text-muted-foreground font-medium">minute</span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground/70">
        Every {stepsPerMinute} steps earns you 1 minute of screen time
      </p>
    </Card>
  );
};
