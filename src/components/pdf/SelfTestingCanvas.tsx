import { useRef, useEffect, useState, forwardRef, ForwardedRef } from 'react';

interface SelfTestingCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  /**
   * Callback to run when the canvas is ready with a tested context
   */
  onCanvasReady?: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
  
  /**
   * Callback for canvas errors
   */
  onCanvasError?: (error: Error) => void;
  
  /**
   * Context type to request (default is '2d')
   */
  contextType?: '2d';
  
  /**
   * Context attributes
   */
  contextAttributes?: CanvasRenderingContext2DSettings;
  
  /**
   * Whether to show fallback content when canvas is not supported
   */
  showFallback?: boolean;
}

/**
 * A self-testing canvas component that ensures the 2D context is available
 * This helps prevent the "Cannot read properties of null (reading 'getContext')" error
 */
const SelfTestingCanvas = forwardRef((
  { 
    onCanvasReady, 
    onCanvasError, 
    contextType = '2d', 
    contextAttributes,
    showFallback = true,
    ...props 
  }: SelfTestingCanvasProps, 
  ref: ForwardedRef<HTMLCanvasElement>
) => {
  const internalRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const [isContextAvailable, setIsContextAvailable] = useState<boolean | null>(null);
  
  // Test if canvas context is available
  useEffect(() => {
    // Skip if already tested
    if (isContextAvailable !== null) return;
    
    const canvasElement = internalRef.current;
    if (!canvasElement) return;
    
    try {
      // First try to get a context with the provided attributes
      let context = canvasElement.getContext(contextType, contextAttributes);
      
      // If failed, try with minimal attributes
      if (!context) {
        context = canvasElement.getContext(contextType);
      }
      
      // If still failed, try with alpha enabled (sometimes helps in certain browsers)
      if (!context) {
        context = canvasElement.getContext(contextType, { alpha: true });
      }
      
      if (context) {
        setIsContextAvailable(true);
        
        // Test drawing functionality
        try {
          // @ts-ignore - We know this is a 2D context
          context.fillStyle = 'rgba(0,0,0,0.01)';
          // @ts-ignore - We know this is a 2D context
          context.fillRect(0, 0, 1, 1);
          // @ts-ignore - We know this is a 2D context
          context.clearRect(0, 0, 1, 1);
        } catch (drawError) {
          console.warn('Canvas drawing test failed:', drawError);
          setCanvasError('Canvas drawing operations failed');
          setIsContextAvailable(false);
          onCanvasError?.(new Error('Canvas drawing operations failed'));
          return;
        }
        
        // All tests passed - notify parent if provided
        if (onCanvasReady && context) {
          // @ts-ignore - We know this is a 2D context
          onCanvasReady(canvasElement, context);
        }
      } else {
        setCanvasError('Canvas context not available');
        setIsContextAvailable(false);
        onCanvasError?.(new Error('Canvas context not available in this browser'));
      }
    } catch (error) {
      console.error('Canvas error:', error);
      setCanvasError(error instanceof Error ? error.message : 'Unknown canvas error');
      setIsContextAvailable(false);
      onCanvasError?.(error instanceof Error ? error : new Error('Unknown canvas error'));
    }
  }, [contextType, onCanvasReady, onCanvasError, isContextAvailable, contextAttributes]);
  
  // Handle forwarded ref
  useEffect(() => {
    if (typeof ref === 'function') {
      ref(internalRef.current);
    } else if (ref) {
      ref.current = internalRef.current;
    }
  }, [ref]);
  
  // Return canvas element with optional fallback
  return (
    <>
      <canvas
        ref={internalRef}
        {...props}
        style={{ 
          display: canvasError && showFallback ? 'none' : 'block',
          ...props.style
        }}
      />
      {canvasError && showFallback && (
        <div className="canvas-fallback" style={{ padding: '10px', border: '1px solid #ccc' }}>
          <p>Canvas not available: {canvasError}</p>
          <p>Try using a different browser or updating your current browser.</p>
        </div>
      )}
    </>
  );
});

SelfTestingCanvas.displayName = 'SelfTestingCanvas';

export default SelfTestingCanvas;
