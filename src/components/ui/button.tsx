import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-fire text-primary-foreground hover:shadow-warrior hover:scale-105 border border-primary/20 transition-all duration-300",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors",
        outline: "border-2 border-primary bg-background/50 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-warrior transition-all duration-300",
        secondary: "bg-gradient-bronze text-secondary-foreground hover:shadow-bronze hover:scale-105 border border-secondary/20 transition-all duration-300",
        ghost: "hover:bg-muted hover:text-foreground transition-colors duration-200",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow transition-colors",
        epic: "bg-gradient-gold text-secondary-foreground hover:shadow-gold hover:scale-105 border border-gold transition-all duration-400 font-bold",
        "room-red": "bg-gradient-room-red text-foreground hover:shadow-[0_8px_25px_-8px_hsl(var(--room-red)/0.4)] hover:scale-105",
        "room-yellow": "bg-gradient-room-yellow text-background hover:shadow-[0_8px_25px_-8px_hsl(var(--room-yellow)/0.4)] hover:scale-105",
        "room-green": "bg-gradient-room-green text-foreground hover:shadow-[0_8px_25px_-8px_hsl(var(--room-green)/0.4)] hover:scale-105"
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-md px-4 text-sm",
        lg: "h-14 rounded-lg px-10 text-base",
        icon: "h-12 w-12",
        epic: "h-16 rounded-xl px-12 text-lg font-bold",
        nav: "h-10 px-4 text-sm"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
