import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

const MotionButton = motion.button;

const baseButtonStyles = {
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    default: 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 border-transparent',
    premium: 'bg-gradient-to-r from-premium-400 to-premium-600 dark:from-premium-500 dark:to-premium-700 text-white hover:from-premium-500 hover:to-premium-700 dark:hover:from-premium-400 dark:hover:to-premium-600',
    outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-700',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100',
  },
  sizes: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
} as const;

export type ButtonVariant = keyof typeof baseButtonStyles.variants;
export type ButtonSize = keyof typeof baseButtonStyles.sizes;

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

// Using motion.button directly which is the recommended approach

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', fullWidth = false, ...props }, ref) => {
    return (
      <MotionButton
        className={cn(
          baseButtonStyles.base,
          baseButtonStyles.variants[variant],
          baseButtonStyles.sizes[size],
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';