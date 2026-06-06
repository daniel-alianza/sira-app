import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Loader2, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  dashboardButtonPrimary,
  dashboardCard,
  dashboardHeadingClass,
  dashboardInput,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import {
  CORRECTIVE_ACTIONS_QUERY_KEY,
  getCorrectiveActionDetailQueryKey,
} from '../interfaces';
import { directCloseCorrectiveAction } from '../service/action.service';

interface ActionDirectCloseModalProps {
  readonly actionId: string | null;
  readonly detectionFolio: string;
  readonly open: boolean;
  readonly onClose: () => void;
}

export function ActionDirectCloseModal({
  actionId,
  detectionFolio,
  open,
  onClose,
}: ActionDirectCloseModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const directCloseMutation = useMutation({
    mutationFn: (payload: { actionId: string; reason: string }) =>
      directCloseCorrectiveAction(payload.actionId, payload.reason),
    onSuccess: async () => {
      setFormError(null);
      setReason('');
      await queryClient.invalidateQueries({ queryKey: CORRECTIVE_ACTIONS_QUERY_KEY });
      if (actionId) {
        await queryClient.invalidateQueries({
          queryKey: getCorrectiveActionDetailQueryKey(actionId),
        });
      }
      onClose();
    },
    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  useEffect(() => {
    if (!open) {
      setReason('');
      setFormError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open || !actionId) {
    return null;
  }

  function handleSubmit() {
    if (!actionId) {
      return;
    }

    setFormError(null);
    const trimmedReason = reason.trim();

    if (trimmedReason.length < 10) {
      setFormError('Indica el motivo del cierre directo (mínimo 10 caracteres)');
      return;
    }

    directCloseMutation.mutate({ actionId, reason: trimmedReason });
  }

  const isSubmitting = directCloseMutation.isPending;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2240]/40 p-4 backdrop-blur-[2px]"
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
    >
      <div className={cn(dashboardCard('relative w-full max-w-lg overflow-hidden p-0'))}>
        <div className="flex items-start justify-between border-b border-slate-200/90 bg-slate-50/80 px-6 py-4">
          <div>
            <h2 className={cn(dashboardHeadingClass, 'text-lg')}>Cierre directo SHE</h2>
            <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
              Cierra la acción {detectionFolio} sin seguir el flujo estándar
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Cerrar">
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            <p>
              Usa esta opción solo cuando Seguridad e Higiene deba cerrar la acción por una
              situación excepcional. El motivo quedará registrado en el historial.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="direct-close-reason">Motivo del cierre directo</Label>
            <textarea
              id="direct-close-reason"
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={isSubmitting}
              placeholder="Describe la situación que justifica el cierre directo"
              className={cn(dashboardInput(), 'h-auto min-h-[96px] resize-y py-2')}
            />
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="size-4 shrink-0" />
              {formError}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200/90 bg-slate-50/50 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              dashboardButtonPrimary(),
              'inline-flex items-center gap-2 disabled:opacity-50',
            )}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Cerrar acción
          </button>
        </div>
      </div>
    </div>
  );
}
