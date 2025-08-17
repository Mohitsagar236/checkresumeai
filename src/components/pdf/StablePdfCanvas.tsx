import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface StablePdfCanvasProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
  onCanvasError?: (error: Error) => void;
}

/**
 * A canvas component specifically for PDF rendering that handles context errors
 * forwards ref to the underlying HTMLCanvasElement
 */
const StablePdfCanvas = forwardRef<HTMLCanvasElement, StablePdfCanvasProps>(
  ({ width, height, className, onCanvasReady, onCanvasError }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Expose canvas element via ref
    useImperativeHandle(ref, () => canvasRef.current!);
   
    // Try to initialize the canvas and get its context when it's mounted
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        // Try different context configurations to maximize compatibility
        let context: CanvasRenderingContext2D | null = null;
        
        // Try first with standard options
        context = canvas.getContext('2d');
        
        // If that fails, try with explicit options
        if (!context) {
          context = canvas.getContext('2d', { alpha: false });
        }
        
        // If that still fails, try with different options
        if (!context) {
          context = canvas.getContext('2d', { alpha: true });
        }
        
        if (!context) {
          throw new Error('Cannot get 2D canvas context after multiple attempts');
        }

        // Test the context with a simple draw operation
        try {
          context.fillStyle = 'rgba(0,0,0,0.01)';
          context.fillRect(0, 0, 1, 1);
          context.clearRect(0, 0, 1, 1);
        } catch (drawError) {
          throw new Error(`Canvas context exists but drawing failed: ${
            drawError instanceof Error ? drawError.message : 'Unknown error'
          }`);
        }

        // Canvas is ready with a working context
        setError(null);
        
        // Notify parent
        onCanvasReady?.(canvas, context);
      } catch (err) {
        console.error('Canvas initialization error:', err);
        setError(err instanceof Error ? err.message : 'Unknown canvas error');
        
        onCanvasError?.(err instanceof Error ? err : new Error('Unknown canvas error'));
      }
    }, [onCanvasReady, onCanvasError]);

    // Render the canvas with optional error message
    return (
      <>
      <canvas
        ref={canvasRef}
        className={`${className ?? ''} pdf-canvas`}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        data-testid="pdf-canvas"
      />
     {error && (
        <div className="canvas-error">
           <p>Canvas error: {error}</p>
           <p>Please try a different browser or update your current browser.</p>
         </div>
     )}
   </>
   );
});

StablePdfCanvas.displayName = 'StablePdfCanvas';
export default StablePdfCanvas;
