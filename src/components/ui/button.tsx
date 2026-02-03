import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 hover:bg-destructive/90 hover:shadow-xl hover:shadow-destructive/30 hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border-2 border-border bg-transparent hover:bg-primary/10 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25 hover:bg-secondary/80 hover:shadow-xl hover:shadow-secondary/30 hover:scale-[1.02] active:scale-[0.98]",
        ghost: 
          "hover:bg-muted hover:text-foreground hover:shadow-md",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        // Gaming variants with glow effects
        gaming:
          "relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold uppercase tracking-wider shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 hover:scale-[1.03] active:scale-[0.98] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity overflow-hidden",
        "gaming-secondary":
          "relative bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground font-bold uppercase tracking-wider shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/50 hover:scale-[1.03] active:scale-[0.98] overflow-hidden",
        "gaming-accent":
          "relative bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-bold uppercase tracking-wider shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/50 hover:scale-[1.03] active:scale-[0.98] overflow-hidden",
        "gaming-outline":
          "relative border-2 border-primary bg-transparent text-primary font-bold uppercase tracking-wider hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] before:absolute before:inset-0 before:rounded-lg before:border before:border-primary/50 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        "gaming-ghost":
          "text-primary font-semibold uppercase tracking-wider hover:bg-primary/10 hover:text-primary hover:shadow-md hover:shadow-primary/10",
        // Neon glow variants
        "neon-primary":
          "relative bg-primary/20 text-primary border border-primary font-bold uppercase tracking-wider shadow-[0_0_15px_hsl(var(--primary)/0.5)] hover:bg-primary/30 hover:shadow-[0_0_25px_hsl(var(--primary)/0.7)] hover:scale-[1.02] active:scale-[0.98]",
        "neon-secondary":
          "relative bg-secondary/20 text-secondary border border-secondary font-bold uppercase tracking-wider shadow-[0_0_15px_hsl(var(--secondary)/0.5)] hover:bg-secondary/30 hover:shadow-[0_0_25px_hsl(var(--secondary)/0.7)] hover:scale-[1.02] active:scale-[0.98]",
        "neon-accent":
          "relative bg-accent/20 text-accent border border-accent font-bold uppercase tracking-wider shadow-[0_0_15px_hsl(var(--accent)/0.5)] hover:bg-accent/30 hover:shadow-[0_0_25px_hsl(var(--accent)/0.7)] hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
