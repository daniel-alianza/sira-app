import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboardSubtextClass } from '@/features/dashboard/components/dashboard-ui.classes';

export interface ActionSignaturePadHandle {
  getSignatureDataUrl: () => string | null;
  clearSignature: () => void;
  hasSignature: () => boolean;
}

interface ActionSignaturePadProps {
  readonly disabled?: boolean;
  readonly className?: string;
}

interface Point {
  readonly x: number;
  readonly y: number;
}

function getCanvasPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number): Point {
  const rect = canvas.getBoundingClientRect();

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

export const ActionSignaturePad = forwardRef<
  ActionSignaturePadHandle,
  ActionSignaturePadProps
>(function ActionSignaturePad({ disabled = false, className }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const hasStrokeRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * devicePixelRatio);
    canvas.height = Math.floor(rect.height * devicePixelRatio);

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 2;
    context.strokeStyle = '#0A2240';
  }

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useImperativeHandle(ref, () => ({
    getSignatureDataUrl() {
      if (!hasStrokeRef.current || !canvasRef.current) {
        return null;
      }
      return canvasRef.current.toDataURL('image/png');
    },
    clearSignature() {
      clearCanvas();
    },
    hasSignature() {
      return hasStrokeRef.current;
    },
  }));

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    hasStrokeRef.current = false;
    setHasSignature(false);
    lastPointRef.current = null;
  }

  function startDrawing(point: Point) {
    if (disabled) {
      return;
    }
    isDrawingRef.current = true;
    lastPointRef.current = point;
  }

  function drawTo(point: Point) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const lastPoint = lastPointRef.current;

    if (!isDrawingRef.current || !context || !lastPoint || disabled) {
      return;
    }

    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();

    lastPointRef.current = point;
    hasStrokeRef.current = true;
    setHasSignature(true);
  }

  function stopDrawing() {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
        <canvas
          ref={canvasRef}
          className={cn(
            'h-28 w-full touch-none',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-crosshair',
          )}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            const point = getCanvasPoint(event.currentTarget, event.clientX, event.clientY);
            startDrawing(point);
          }}
          onPointerMove={(event) => {
            const point = getCanvasPoint(event.currentTarget, event.clientX, event.clientY);
            drawTo(point);
          }}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onPointerCancel={stopDrawing}
        />
        {!hasSignature && !disabled && (
          <p
            className={cn(
              dashboardSubtextClass,
              'pointer-events-none absolute inset-0 flex items-center justify-center text-xs',
            )}
          >
            Dibuja tu firma aquí
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled || !hasSignature}
          onClick={clearCanvas}
          className="h-8 gap-1.5 text-slate-600"
        >
          <Eraser className="size-3.5" />
          Limpiar firma
        </Button>
      </div>
    </div>
  );
});
