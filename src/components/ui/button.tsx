import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-brand text-white shadow-brand hover:shadow-glow hover:scale-105 active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg",
        outline: "border border-jp-cyan/30 bg-transparent text-jp-cyan hover:bg-jp-cyan/10 hover:border-jp-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
        secondary: "bg-jp-deep/50 backdrop-blur-sm text-white border border-white/10 hover:bg-jp-deep/70 hover:border-white/20 shadow-card",
        ghost: "hover:bg-white/5 hover:text-jp-cyan transition-all duration-300",
        link: "text-jp-cyan underline-offset-4 hover:underline hover:text-jp-blue",
        hero: "bg-gradient-to-r from-jp-green via-jp-cyan to-jp-blue text-white font-bold px-8 py-4 rounded-xl shadow-glow hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-105 active:scale-95 transform transition-all duration-300",
        glass: "bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-card",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
