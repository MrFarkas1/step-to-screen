import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface MobileConversionRateProps {
  stepsPerMinute: number;
  onAdjust: () => void;
}

export const MobileConversionRate = ({ stepsPerMinute, onAdjust }: MobileConversionRateProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
          <p className="text-lg font-bold text-foreground">
            {stepsPerMinute} <span className="text-sm font-normal text-muted-foreground">steps/min</span>
          </p>
        </div>
        <Button
          onClick={onAdjust}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          Adjust
        </Button>
      </div>
    </Card>
  );
};
