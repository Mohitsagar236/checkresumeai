import React, { useEffect, useRef, useState } from 'react';
import { cn } from './cn';

/**
 * Iteration 8: Advanced Visual Enhancement Utilities
 * Focus: Premium section gradient overlay and interactive elements
 */

interface GradientOverlayProps {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'strong';
  direction?: 'tr' | 'br' | 'tl' | 'bl';
  animated?: boolean;
  className?: string;
}

export const EnhancedGradientOverlay: React.FC<GradientOverlayProps> = ({
  children,
  intensity = 'medium',
  direction = 'tr',
  animated = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (overlayRef.current) {
      observer.observe(overlayRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const intensityClasses = {
    light: 'from-black/40 via-black/20 to-transparent',
    medium: 'from-black/70 via-black/40 to-transparent',
    strong: 'from-black/85 via-black/60 to-black/20'
  };

  const directionClasses = {
    tr: 'bg-gradient-to-tr',
    br: 'bg-gradient-to-br',
    tl: 'bg-gradient-to-tl',
    bl: 'bg-gradient-to-bl'
  };

  return (
    <div ref={overlayRef} className={cn('relative overflow-hidden', className)}>
      {/* Enhanced gradient overlay with animation */}
      <div 
        className={cn(
          'absolute inset-0 z-10 transition-all duration-1000 ease-in-out',
          directionClasses[direction],
          intensityClasses[intensity],
          animated && isVisible && 'animate-gradient-shift',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Subtle shimmer effect */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-slow" />
        )}
      </div>
      
      {/* Enhanced backdrop blur with depth */}
      <div className="absolute inset-0 backdrop-blur-[1px] z-5" />
      
      {children}
    </div>
  );
};

interface InteractiveCardProps {
  children: React.ReactNode;
  intensity?: 'subtle' | 'medium' | 'strong';
  glowColor?: string;
  className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  intensity = 'medium',
  glowColor = 'blue',
  className = ''
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const intensityScale = {
    subtle: 0.5,
    medium: 1,
    strong: 1.5
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative transition-all duration-500 group',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.1 * intensityScale[intensity]}deg) rotateY(${(mousePosition.x - 50) * 0.1 * intensityScale[intensity]}deg) translateZ(20px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
      }}
    >
      {/* Dynamic glow effect following mouse */}
      {isHovered && (
        <div 
          className={cn(
            'absolute inset-0 opacity-30 transition-opacity duration-300 blur-xl -z-10',
            `bg-${glowColor}-500/20`
          )}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgb(59 130 246 / 0.3) 0%, transparent 50%)`
          }}
        />
      )}
      
      {children}
    </div>
  );
};

interface AnimatedParticlesProps {
  count?: number;
  colors?: string[];
  speed?: 'slow' | 'medium' | 'fast';
  size?: 'small' | 'medium' | 'large';
}

export const AnimatedParticles: React.FC<AnimatedParticlesProps> = ({
  count = 6,
  colors = ['white', 'blue-400', 'amber-400', 'purple-400'],
  speed = 'medium',
  size = 'medium'
}) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  const sizeClasses = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  };

  const speedMultiplier = {
    slow: 1.5,
    medium: 1,
    fast: 0.7
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            'absolute rounded-full opacity-20',
            sizeClasses[size],
            `bg-${particle.color}`
          )}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration * speedMultiplier[speed]}s`,
            animation: 'float-particle infinite ease-in-out'
          }}
        />
      ))}
    </div>
  );
};

interface ProgressiveLoadingProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
}

export const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    fade: 'scale-95'
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-700 ease-out',
        !isVisible && directionClasses[direction],
        !isVisible && 'opacity-0',
        isVisible && 'opacity-100 translate-y-0 translate-x-0 scale-100',
        className
      )}
    >
      {children}
    </div>
  );
};

// Performance monitoring for visual enhancements
export class VisualPerformanceMonitor {
  private static instance: VisualPerformanceMonitor;
  private animationFrameId: number | null = null;
  private performanceData: Array<{ timestamp: number; fps: number; memory?: number }> = [];

  static getInstance(): VisualPerformanceMonitor {
    if (!VisualPerformanceMonitor.instance) {
      VisualPerformanceMonitor.instance = new VisualPerformanceMonitor();
    }
    return VisualPerformanceMonitor.instance;
  }

  startMonitoring(): void {
    let lastTime = performance.now();
    let frameCount = 0;

    const monitor = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memory = (performance as any).memory?.usedJSHeapSize / 1024 / 1024;
        
        this.performanceData.push({
          timestamp: currentTime,
          fps,
          memory
        });

        // Keep only last 60 seconds of data
        this.performanceData = this.performanceData.slice(-60);

        // Log performance warnings
        if (fps < 30) {
          console.warn(`Visual Performance Warning: FPS dropped to ${fps}`);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      this.animationFrameId = requestAnimationFrame(monitor);
    };

    this.animationFrameId = requestAnimationFrame(monitor);
  }

  stopMonitoring(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  getPerformanceData() {
    return this.performanceData;
  }

  getAverageStats() {
    if (this.performanceData.length === 0) return null;

    const avgFps = this.performanceData.reduce((sum, data) => sum + data.fps, 0) / this.performanceData.length;
    const avgMemory = this.performanceData
      .filter(data => data.memory)
      .reduce((sum, data) => sum + (data.memory || 0), 0) / this.performanceData.length;

    return {
      averageFPS: Math.round(avgFps),
      averageMemory: Math.round(avgMemory * 100) / 100,
      dataPoints: this.performanceData.length
    };
  }
}

export const visualPerformanceMonitor = VisualPerformanceMonitor.getInstance();

// Export utility for global access
declare global {
  interface Window {
    visualPerformance: typeof visualPerformanceMonitor;
  }
}

if (typeof window !== 'undefined') {
  window.visualPerformance = visualPerformanceMonitor;
}
