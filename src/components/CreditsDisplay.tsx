import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface CreditsDisplayProps {
  credits: number;
}

export const CreditsDisplay = ({ credits }: CreditsDisplayProps) => {
  return (
    <Card className="p-4 bg-gradient-success border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Coins className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-white/80">Total Credits</p>
          <p className="text-2xl font-bold text-white">{credits}</p>
        </div>
      </div>
    </Card>
  );
};
