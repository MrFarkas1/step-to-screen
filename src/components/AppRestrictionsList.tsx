import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AppRestriction } from "@/hooks/useAppRestrictions";

interface AppRestrictionsListProps {
  apps: AppRestriction[];
  onToggle: (appId: string) => void;
  onToggleAll?: (restricted: boolean) => void;
  showSelectAll?: boolean;
}

export function AppRestrictionsList({
  apps,
  onToggle,
  onToggleAll,
  showSelectAll = true,
}: AppRestrictionsListProps) {
  const allSelected = apps.every((app) => app.restricted);
  const someSelected = apps.some((app) => app.restricted);

  return (
    <div className="space-y-4">
      {showSelectAll && onToggleAll && (
        <>
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Label className="text-base font-semibold">
              {allSelected ? "Deselect All" : "Select All"}
            </Label>
            <Switch
              checked={allSelected}
              onCheckedChange={onToggleAll}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        {apps.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors border border-border/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{app.icon}</span>
              <Label
                htmlFor={`app-${app.id}`}
                className="text-base font-medium cursor-pointer"
              >
                {app.name}
              </Label>
            </div>
            <Switch
              id={`app-${app.id}`}
              checked={app.restricted}
              onCheckedChange={() => onToggle(app.id)}
            />
          </div>
        ))}
      </div>

      {showSelectAll && someSelected && (
        <p className="text-sm text-muted-foreground text-center pt-2">
          {apps.filter((app) => app.restricted).length} app
          {apps.filter((app) => app.restricted).length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
