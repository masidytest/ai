import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child, { value, setValue });
        }
        if (React.isValidElement(child) && child.type === TabsContent) {
          return React.cloneElement(child, { value });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, value, setValue, className }: any) {
  return (
    <div className={cn("flex gap-2 mb-2", className)}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { value, setValue })
          : child
      )}
    </div>
  );
}

export function TabsTrigger({ value: tabValue, setValue, value, children, className }: any) {
  const active = value === tabValue;
  return (
    <button
      className={cn(
        "px-4 py-2 rounded font-semibold transition-all duration-200",
        active ? "bg-[#a259ff] text-white shadow-neon" : "bg-[#232347] text-[#00fff7] hover:bg-[#a259ff] hover:text-white",
        className
      )}
      onClick={() => setValue(tabValue)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, value: tabValue, className }: any) {
  if (value !== tabValue) return null;
  return <div className={className}>{children}</div>;
}
