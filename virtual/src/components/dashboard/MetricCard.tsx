import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  className
}: MetricCardProps) => {
  return (
    <div className={cn("metric-card rounded-lg", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <div
          className={cn(
            "text-sm font-medium",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground"
          )}
        >
          {change}
        </div>
        <span className="text-sm text-muted-foreground ml-2">vs last month</span>
      </div>
    </div>
  );
};