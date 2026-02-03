import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-md shadow-secondary/25 hover:shadow-lg hover:shadow-secondary/30",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-md shadow-destructive/25 hover:shadow-lg hover:shadow-destructive/30",
        outline: 
          "text-foreground border-border hover:border-primary hover:text-primary",
        success:
          "border-transparent bg-success text-white shadow-md shadow-success/25 hover:shadow-lg hover:shadow-success/30",
        warning:
          "border-transparent bg-warning text-black shadow-md shadow-warning/25 hover:shadow-lg hover:shadow-warning/30",
        // Gaming variants with glow
        gaming:
          "border-primary/40 bg-primary/15 text-primary shadow-[0_0_10px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:bg-primary/20",
        "gaming-secondary":
          "border-secondary/40 bg-secondary/15 text-secondary shadow-[0_0_10px_hsl(var(--secondary)/0.2)] hover:shadow-[0_0_15px_hsl(var(--secondary)/0.3)] hover:bg-secondary/20",
        "gaming-accent":
          "border-accent/40 bg-accent/15 text-accent shadow-[0_0_10px_hsl(var(--accent)/0.2)] hover:shadow-[0_0_15px_hsl(var(--accent)/0.3)] hover:bg-accent/20",
        // Neon glow badges
        "neon-primary":
          "border-primary bg-primary/10 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.5),inset_0_0_12px_hsl(var(--primary)/0.1)] animate-pulse",
        "neon-secondary":
          "border-secondary bg-secondary/10 text-secondary shadow-[0_0_12px_hsl(var(--secondary)/0.5),inset_0_0_12px_hsl(var(--secondary)/0.1)] animate-pulse",
        "neon-success":
          "border-success bg-success/10 text-success shadow-[0_0_12px_hsl(var(--success)/0.5),inset_0_0_12px_hsl(var(--success)/0.1)]",
        "neon-destructive":
          "border-destructive bg-destructive/10 text-destructive shadow-[0_0_12px_hsl(var(--destructive)/0.5),inset_0_0_12px_hsl(var(--destructive)/0.1)]",
        // Gradient badges
        gradient:
          "border-transparent bg-gradient-to-r from-primary to-secondary text-white shadow-lg",
        "gradient-accent":
          "border-transparent bg-gradient-to-r from-primary to-accent text-white shadow-lg",
        // Status badges
        live:
          "border-destructive/50 bg-destructive/20 text-destructive animate-pulse shadow-[0_0_10px_hsl(var(--destructive)/0.3)]",
        online:
          "border-success/50 bg-success/20 text-success shadow-[0_0_10px_hsl(var(--success)/0.3)]",
        offline:
          "border-muted-foreground/50 bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
