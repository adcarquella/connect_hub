import { Bath, Droplets, Apple, Users, Move, Bed, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const quickActionCategories = [
  {
    id: "personal-care",
    label: "Personal Care",
    icon: Bath,
    color: "hsl(var(--primary))"
  },
  {
    id: "continence", 
    label: "Continence",
    icon: Droplets,
    color: "hsl(var(--primary))"
  },
  {
    id: "nutrition-hydration",
    label: "Nutrition & Hydration", 
    icon: Apple,
    color: "hsl(var(--primary))"
  },
  {
    id: "social-life",
    label: "Social Life",
    icon: Users,
    color: "hsl(var(--primary))"
  },
  {
    id: "moving-handling",
    label: "Moving & Handling",
    icon: Move,
    color: "hsl(var(--primary))"
  },
  {
    id: "sleeping-rest",
    label: "Sleeping & Rest",
    icon: Bed,
    color: "hsl(var(--primary))"
  }
];

interface QuickActionsProps {
  selectedActions: string[];
  onActionToggle: (actionId: string) => void;
}

export const QuickActions = ({ selectedActions, onActionToggle }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {quickActionCategories.map((category) => {
        const IconComponent = category.icon;
        const isSelected = selectedActions.includes(category.id);
        
        return (
          <button
            key={category.id}
            onClick={() => onActionToggle(category.id)}
            className={cn(
              "relative flex flex-col items-center justify-center p-6 rounded-full aspect-square transition-all duration-200 group hover:scale-105",
              "border-2 border-border bg-background hover:bg-muted/50",
              isSelected && "bg-primary text-primary-foreground border-primary"
            )}
          >
            {/* Icon */}
            <div className="relative">
              <IconComponent 
                className={cn(
                  "h-8 w-8 transition-colors",
                  isSelected ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              
              {/* Check mark overlay when selected */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3 text-primary" />
                </div>
              )}
            </div>
            
            {/* Label */}
            <span className={cn(
              "text-xs font-medium text-center mt-2 leading-tight",
              isSelected ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}>
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};