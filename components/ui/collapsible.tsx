import * as React from "react"
import {
  Collapsible as RadixCollapsible,
  CollapsibleContent as RadixCollapsibleContent,
  CollapsibleTrigger as RadixCollapsibleTrigger,
} from "@radix-ui/react-collapsible"
import { cn } from "@/lib/utils"

const Collapsible = RadixCollapsible

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof RadixCollapsibleTrigger>,
  React.ComponentPropsWithoutRef<typeof RadixCollapsibleTrigger>
>(({ className, ...props }, ref) => (
  <RadixCollapsibleTrigger
    ref={ref}
    className={cn("cursor-pointer", className)}
    {...props}
  />
))
CollapsibleTrigger.displayName = RadixCollapsibleTrigger.displayName

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof RadixCollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof RadixCollapsibleContent>
>(({ className, ...props }, ref) => (
  <RadixCollapsibleContent
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
      className
    )}
    {...props}
  />
))
CollapsibleContent.displayName = RadixCollapsibleContent.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
