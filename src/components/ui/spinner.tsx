import * as React from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      default: "size-4",
      sm: "size-3",
      lg: "size-6",
      xl: "size-8",
      "2xl": "size-12",
    },
    variant: {
      default: "text-gray-600",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      white: "text-white",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export interface SpinnerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Loader2>, "size">,
    VariantProps<typeof spinnerVariants> {
  className?: string;
}

function Spinner({ className, size, variant, ...props }: SpinnerProps) {
  return (
    <Loader2
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };

