import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: 'default' | 'energy' | 'xp' | 'epic';
  }
>(({ className, value, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: "bg-muted",
    energy: "bg-muted border border-primary/20",
    xp: "bg-muted border border-secondary/20", 
    epic: "bg-muted border border-gold shadow-gold"
  };

  const indicatorStyles = {
    default: "bg-primary",
    energy: "bg-gradient-fire shadow-warrior/50",
    xp: "bg-gradient-bronze shadow-bronze/50",
    epic: "bg-gradient-gold shadow-gold"
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full transition-all duration-300",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full",
          indicatorStyles[variant]
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
