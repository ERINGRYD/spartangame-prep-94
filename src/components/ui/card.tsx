import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'epic' | 'battle' | 'room-red' | 'room-yellow' | 'room-green';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: "bg-card text-card-foreground border-border",
    epic: "bg-card text-card-foreground border-gold shadow-gold backdrop-blur-sm",
    battle: "bg-card/90 text-card-foreground border-primary/30 shadow-warrior backdrop-blur-sm",
    'room-red': "bg-card text-card-foreground border-room-red/30 shadow-[0_4px_20px_-4px_hsl(var(--room-red)/0.3)]",
    'room-yellow': "bg-card text-card-foreground border-room-yellow/30 shadow-[0_4px_20px_-4px_hsl(var(--room-yellow)/0.3)]",
    'room-green': "bg-card text-card-foreground border-room-green/30 shadow-[0_4px_20px_-4px_hsl(var(--room-green)/0.3)]"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border shadow-sm transition-all duration-300 hover:shadow-lg",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
