"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "gradient"
  | "outline"
  | "ghost"
  | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "bg-accent text-white hover:bg-accent-hover shadow-sm",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      gradient: "bg-accent-gradient text-white hover:opacity-90 shadow-sm",
      outline:
        "bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white",
      ghost:
        "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-10 py-4 text-base",
      icon: "p-3 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
