import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-xl border text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "border-border bg-card shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:border-primary/30",
        gaming:
          "border-primary/20 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/40 hover:-translate-y-1",
        "gaming-glow":
          "border-primary/30 bg-card shadow-[0_0_15px_hsl(var(--primary)/0.1)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:border-primary/50 hover:-translate-y-1",
        "gaming-neon":
          "relative border-primary/40 bg-card/90 backdrop-blur-sm shadow-[0_0_20px_hsl(var(--primary)/0.15),inset_0_0_20px_hsl(var(--primary)/0.05)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.25),inset_0_0_30px_hsl(var(--primary)/0.1)] hover:border-primary/60 hover:-translate-y-2",
        glass:
          "border-white/10 bg-white/5 backdrop-blur-xl shadow-xl hover:bg-white/10 hover:border-white/20",
        elevated:
          "border-border bg-card shadow-2xl shadow-black/40 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-2",
        interactive:
          "border-border bg-card cursor-pointer shadow-lg hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 hover:bg-card/80 active:translate-y-0 active:shadow-md",
        outline:
          "border-2 border-border bg-transparent hover:border-primary hover:bg-primary/5",
        ghost:
          "border-transparent bg-transparent hover:bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
