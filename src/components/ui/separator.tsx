"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva(
  "shrink-0",
  {
    variants: {
      variant: {
        default: "bg-border",
        terminal: "bg-primary/30 shadow-[0_0_10px_hsl(var(--primary)/0.3)]",
        dashed: "bg-transparent border-t border-dashed border-muted-foreground/30",
        gradient: "bg-gradient-to-r from-transparent via-primary/50 to-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SeparatorProps 
  extends React.ComponentProps<typeof SeparatorPrimitive.Root>,
  VariantProps<typeof separatorVariants> {}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorVariants({ variant }),
        orientation === "horizontal" 
          ? "h-px w-full" 
          : "h-full w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
