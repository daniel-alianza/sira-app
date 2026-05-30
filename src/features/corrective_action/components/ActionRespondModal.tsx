import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
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
  DETECTION_TYPE_LABELS,
  DETECTION_TYPE_STYLES,
} from '@/features/tours/interfaces';
import type { ActionRespondModalProps } from '../interfaces';
import { respondCorrectiveAction } from '../service/action.service';
import { ActionCommitmentDatePicker } from './ActionCommitmentDatePicker';
import {
  ActionSignaturePad,
  type ActionSignaturePadHandle,
} from './ActionSignaturePad';

export function ActionRespondModal({
  action,
  open,
  onClose,
  onSuccess,
}: ActionRespondModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const signaturePadRef = useRef<ActionSignaturePadHandle>(null);
  const [correctivePlan, setCorrectivePlan] = useState('');
  const [commitmentDate, setCommitmentDate] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const respondMutation = useMutation({
    mutationFn: (payload: {
      actionId: string;
      correctivePlan: string;
      commitmentDate: string;
      signatureDataUrl: string;
      changeReason?: string;
    }) =>
      respondCorrectiveAction(payload.actionId, {
        correctivePlan: payload.correctivePlan,
        commitmentDate: payload.commitmentDate,
        signatureDataUrl: payload.signatureDataUrl,
        changeReason: payload.changeReason,
      }),
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && !respondMutation.isPending) onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose, respondMutation.isPending]);

  useEffect(() => {
    if (!open || !action) {
      return;
    }
    setCorrectivePlan(action.correctivePlan ?? '');
    setCommitmentDate('');
    setChangeReason('');
    setFormError(null);
    signaturePadRef.current?.clearSignature();
  }, [open, action?.id, action?.correctivePlan]);

  if (!open || !action) {
    return null;
  }

  const isFirstResponse = action.status === 'pending_acceptance';
  const isSubmitting = respondMutation.isPending;
  const submitError =
    formError ??
    (respondMutation.isError && respondMutation.error instanceof Error
      ? respondMutation.error.message
      : null);

  function handleSubmit() {
    if (!action) {
      return;
    }

    setFormError(null);

    const trimmedPlan = correctivePlan.trim();
    if (trimmedPlan.length < 5) {
      setFormError('Describe la acción correctiva (mín. 5 caracteres)');
      return;
    }

    if (!commitmentDate) {
      setFormError('Selecciona la fecha compromiso');
      return;
    }

    if (!isFirstResponse && !changeReason.trim()) {
      setFormError('Indica el motivo del cambio de fecha compromiso');
      return;
    }

    const signatureDataUrl = signaturePadRef.current?.getSignatureDataUrl();
    if (!signatureDataUrl) {
      setFormError('Dibuja tu firma antes de enviar');
      return;
    }

    respondMutation.mutate({
      actionId: action.id,
      correctivePlan: trimmedPlan,
      commitmentDate,
      signatureDataUrl,
      changeReason: isFirstResponse ? undefined : changeReason.trim(),
    });
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2240]/40 p-4 backdrop-blur-[2px]"
      onClick={(event) => {
        if (event.target === overlayRef.current && !isSubmitting) onClose();
      }}
    >
      <div
        className={cn(
          dashboardCard('relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden p-0'),
          'animate-in fade-in-0 slide-in-from-bottom-4 zoom-in-95 duration-200',
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-slate-50/80 px-6 py-4">
          <div>
            <h2 className={cn(dashboardHeadingClass, 'text-lg')}>
              {isFirstResponse ? 'Responder acción correctiva' : 'Actualizar compromiso'}
            </h2>
            <p className={cn(dashboardSubtextClass, 'mt-0.5 font-mono text-xs text-[#00a896]')}>
              {action.detectionFolio}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                  DETECTION_TYPE_STYLES[action.detectionType],
                )}
              >
                {DETECTION_TYPE_LABELS[action.detectionType]}
              </span>
              <span className="font-mono text-xs text-slate-500">
                Recorrido {action.walkthroughFolio}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#0A2240]">{action.description}</p>
            <p className={cn(dashboardSubtextClass, 'mt-1 text-xs')}>
              {action.companyName} · {action.branchName} · {action.areaName}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="correctivePlan">Acción correctiva (qué harás)</Label>
            <textarea
              id="correctivePlan"
              rows={3}
              value={correctivePlan}
              onChange={(event) => setCorrectivePlan(event.target.value)}
              disabled={isSubmitting}
              placeholder="Describe las medidas que implementarás para corregir el hallazgo"
              className={cn(dashboardInput(), 'h-auto min-h-[88px] resize-y py-2')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="commitmentDate">
              {isFirstResponse ? 'Fecha compromiso (F0)' : 'Nueva fecha compromiso'}
            </Label>
            <ActionCommitmentDatePicker
              id="commitmentDate"
              value={commitmentDate}
              onChange={setCommitmentDate}
              placeholder={
                isFirstResponse ? 'Seleccionar fecha compromiso' : 'Seleccionar nueva fecha'
              }
            />
          </div>

          {!isFirstResponse && (
            <div className="space-y-1.5">
              <Label htmlFor="changeReason">Motivo del cambio</Label>
              <textarea
                id="changeReason"
                rows={2}
                value={changeReason}
                onChange={(event) => setChangeReason(event.target.value)}
                disabled={isSubmitting}
                placeholder="Indica por qué reprogramas la fecha compromiso"
                className={cn(dashboardInput(), 'h-auto min-h-[64px] resize-y py-2')}
              />
            </div>
          )}

          <div className="space-y-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
            <Label>Firma del responsable</Label>
            <ActionSignaturePad ref={signaturePadRef} disabled={isSubmitting} />
          </div>

          {submitError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{submitError}</p>
          )}
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-slate-200/90 bg-slate-50/50 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(dashboardButtonPrimary(), 'inline-flex items-center gap-2')}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando…
              </>
            ) : isFirstResponse ? (
              'Firmar y enviar'
            ) : (
              'Firmar cambio de fecha'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
