import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      "relative flex touch-none select-none items-center group",
      orientation === "horizontal" ? "w-full" : "h-full flex-col",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track 
      className={cn(
        "relative grow overflow-hidden rounded-full bg-secondary",
        orientation === "horizontal" ? "h-1.5 w-full" : "w-1.5 h-full"
      )}
    >
      <SliderPrimitive.Range 
        className={cn(
          "absolute bg-foreground transition-all",
          orientation === "horizontal" ? "h-full" : "w-full"
        )} 
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-foreground bg-foreground shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-[0_0_10px_hsla(0,0%,100%,0.5)]" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
