import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "px-4 py-2 rounded font-semibold transition-all duration-200 focus:outline-none",
          variant === "default" && "bg-[#a259ff] text-white hover:bg-[#00fff7] hover:text-[#18192a]",
          variant === "outline" && "border border-[#a259ff] text-[#a259ff] bg-transparent hover:bg-[#232347]",
          variant === "ghost" && "bg-transparent text-[#a259ff] hover:bg-[#232347]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
