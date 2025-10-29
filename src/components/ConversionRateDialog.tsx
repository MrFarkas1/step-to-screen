import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ConversionRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRate: number;
  onSave: (rate: number) => void;
}

export const ConversionRateDialog = ({
  open,
  onOpenChange,
  currentRate,
  onSave,
}: ConversionRateDialogProps) => {
  const [rate, setRate] = useState(currentRate);

  const handleSave = () => {
    onSave(rate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Conversion Rate</DialogTitle>
          <DialogDescription>
            Set how many steps equal 1 minute of screen time
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Steps per minute</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[rate]}
                onValueChange={(values) => setRate(values[0])}
                min={50}
                max={500}
                step={10}
                className="flex-1"
              />
              <div className="w-20 text-center">
                <span className="text-2xl font-bold text-foreground">{rate}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              With this rate, <span className="font-semibold text-foreground">1,000 steps</span> will 
              earn you <span className="font-semibold text-foreground">{Math.round(1000 / rate)} minutes</span> of screen time.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-gradient-primary">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
