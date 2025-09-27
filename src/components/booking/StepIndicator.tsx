import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  {
                    "bg-primary text-primary-foreground": isCurrent,
                    "bg-success text-success-foreground": isCompleted,
                    "bg-muted text-muted-foreground": !isCurrent && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3">
                <p className={cn(
                  "text-sm font-medium",
                  {
                    "text-primary": isCurrent,
                    "text-success": isCompleted,
                    "text-muted-foreground": !isCurrent && !isCompleted,
                  }
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            
            {!isLast && (
              <div className="flex-1 h-px bg-border mx-4 hidden sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
};