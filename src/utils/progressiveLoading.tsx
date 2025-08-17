/**
 * Progressive Loading Enhancement
 * Implements skeleton loading and progressive enhancement for better UX
 */

import React from 'react';

// Skeleton loading components for different UI sections
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="rounded-lg bg-gray-200 dark:bg-gray-700 h-32 w-full mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = "" 
}) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <div 
        key={i}
        className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
          i === lines - 1 ? 'w-2/3' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export const SkeletonButton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6 p-6">
    {/* Header skeleton */}
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
    
    {/* Stats cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
    
    {/* Chart skeleton */}
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

export const SkeletonResumeAnalyzer: React.FC = () => (
  <div className="space-y-6 p-6">
    {/* Upload area skeleton */}
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
    </div>
    
    {/* Form fields skeleton */}
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
    
    {/* Button skeleton */}
    <SkeletonButton />
  </div>
);

export const SkeletonProfile: React.FC = () => (
  <div className="space-y-6 p-6">
    {/* Profile header skeleton */}
    <div className="flex items-center space-x-4 animate-pulse">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="space-y-2 flex-1">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    
    {/* Profile form skeleton */}
    <div className="space-y-4">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

// Progressive enhancement wrapper
export const ProgressiveEnhancement: React.FC<{
  children: React.ReactNode;
  skeleton: React.ComponentType;
  delay?: number;
}> = ({ children, skeleton: Skeleton, delay = 200 }) => {
  const [showContent, setShowContent] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!showContent) {
    return <Skeleton />;
  }
  
  return <>{children}</>;
};

// Image progressive loading
export const ProgressiveImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
}> = ({ src, alt, className = "", placeholderClassName = "" }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  
  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setError(true);
  
  if (error) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Failed to load</span>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {!isLoaded && (
        <div className={`absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 ${placeholderClassName}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${className} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  
  React.useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );
    
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
};

// Lazy load wrapper component
export const LazyLoad: React.FC<{
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
}> = ({ children, placeholder, rootMargin = "50px" }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(ref, { rootMargin });
  
  return (
    <div ref={ref}>
      {isIntersecting ? children : placeholder}
    </div>
  );
};
