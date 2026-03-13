import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  withGlow?: boolean;
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, hoverEffect = true, withGlow = false, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-2xl border border-gray-100 p-4 transition-all duration-300",
          hoverEffect &&
            "hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
