import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressCircleProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  textClassName?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function ProgressCircle({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  textClassName,
  showValue = true,
  variant = 'default',
}: ProgressCircleProps) {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  
  // Determine color based on variant and value
  let strokeColor = 'stroke-brand-500 dark:stroke-brand-400';
  let gradientId = 'gradient-brand';
  
  if (variant === 'default') {
    if (normalizedValue >= 80) {
      strokeColor = 'stroke-url(#gradient-success)';
      gradientId = 'gradient-success';
    }
    else if (normalizedValue >= 60) {
      strokeColor = 'stroke-url(#gradient-brand)';
      gradientId = 'gradient-brand';
    }
    else if (normalizedValue >= 40) {
      strokeColor = 'stroke-url(#gradient-warning)';
      gradientId = 'gradient-warning';
    }
    else {
      strokeColor = 'stroke-url(#gradient-error)';
      gradientId = 'gradient-error';
    }
  } else if (variant === 'success') {
    strokeColor = 'stroke-url(#gradient-success)';
    gradientId = 'gradient-success';
  } else if (variant === 'warning') {
    strokeColor = 'stroke-url(#gradient-warning)';
    gradientId = 'gradient-warning';
  } else if (variant === 'error') {
    strokeColor = 'stroke-url(#gradient-error)';
    gradientId = 'gradient-error';
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 filter drop-shadow-md"
      >
        <defs>
          <linearGradient id="gradient-brand" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradient-warning" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="gradient-error" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="stroke-gray-100 dark:stroke-gray-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={strokeColor}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-2xl font-heading font-bold text-gray-800 dark:text-neutral-50 drop-shadow-sm', textClassName)}>
            {normalizedValue}
            <span className="text-sm font-sans ml-0.5 text-gray-500 dark:text-gray-400">%</span>
          </span>
        </div>
      )}
    </div>
  );
}