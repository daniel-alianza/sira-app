import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  dashboardButtonPrimary,
  dashboardCard,
  dashboardHeadingClass,
  dashboardInput,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import type { CorrectiveActionStatus } from '@/features/tours/interfaces';
import {
  CORRECTIVE_ACTIONS_QUERY_KEY,
  getCorrectiveActionDetailQueryKey,
} from '../interfaces';
import { respondCorrectiveAction } from '../service/action.service';
import { ActionCommitmentDatePicker } from './ActionCommitmentDatePicker';
import {
  ActionSignaturePad,
  type ActionSignaturePadHandle,
} from './ActionSignaturePad';

interface ActionDetailRespondFormProps {
  readonly actionId: string;
  readonly status: CorrectiveActionStatus;
  readonly initialCorrectivePlan?: string | null;
  readonly hasCommitment: boolean;
  readonly currentCommitmentDate?: string | null;
}

const DATE_UPDATE_STATUSES: readonly CorrectiveActionStatus[] = [
  'open',
  'pending',
  'expired',
  'reopened',
];

const RESCHEDULE_BLOCKED_STATUSES: readonly CorrectiveActionStatus[] = [
  'closure_review',
  'closed',
];

export function ActionDetailRespondForm({
  actionId,
  status,
  initialCorrectivePlan = '',
  hasCommitment,
  currentCommitmentDate,
}: ActionDetailRespondFormProps) {
  const queryClient = useQueryClient();
  const signaturePadRef = useRef<ActionSignaturePadHandle>(null);

  const [correctivePlan, setCorrectivePlan] = useState(initialCorrectivePlan ?? '');
  const [commitmentDate, setCommitmentDate] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const isFirstResponse = status === 'pending_acceptance';
  const isDateUpdate =
    hasCommitment &&
    DATE_UPDATE_STATUSES.includes(status) &&
    !RESCHEDULE_BLOCKED_STATUSES.includes(status);
  const showForm = isFirstResponse || isDateUpdate;

  const respondMutation = useMutation({
    mutationFn: (payload: {
      correctivePlan: string;
      commitmentDate: string;
      signatureDataUrl: string;
      changeReason?: string;
    }) => respondCorrectiveAction(actionId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CORRECTIVE_ACTIONS_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: getCorrectiveActionDetailQueryKey(actionId),
      });
      setCommitmentDate('');
      setChangeReason('');
      signaturePadRef.current?.clearSignature();
    },
  });

  if (!showForm) {
    return null;
  }

  const isSubmitting = respondMutation.isPending;
  const submitError =
    formError ??
    (respondMutation.isError && respondMutation.error instanceof Error
      ? respondMutation.error.message
      : null);

  function handleSubmit() {
    setFormError(null);

    const planForSubmit = isDateUpdate
      ? (initialCorrectivePlan ?? correctivePlan).trim()
      : correctivePlan.trim();

    if (planForSubmit.length < 5) {
      setFormError('Describe tu acción correctiva (mín. 5 caracteres)');
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
      correctivePlan: planForSubmit,
      commitmentDate,
      signatureDataUrl,
      changeReason: isFirstResponse ? undefined : changeReason.trim(),
    });
  }

  return (
    <section className={cn(dashboardCard(), 'overflow-hidden p-0')}>
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 md:px-6">
        <h2 className={cn(dashboardHeadingClass, 'text-base')}>
          {isFirstResponse ? 'Paso 1: Tu compromiso' : 'Reprogramar fecha compromiso'}
        </h2>
        <p className={cn(dashboardSubtextClass, 'mt-1 text-xs')}>
          {isFirstResponse
            ? 'Registra qué harás, la fecha compromiso y tu firma. Después de corregir el hallazgo subirás la foto de resolución.'
            : 'Puedes cambiar la fecha sin aprobación del inspector. Solo firma y registra el motivo.'}
        </p>
        {isDateUpdate && currentCommitmentDate && (
          <p className="mt-2 text-xs font-medium text-[#0A2240]">
            Fecha compromiso actual: {currentCommitmentDate}
          </p>
        )}
      </div>

      <div className="space-y-5 p-5 md:p-6">
        {isFirstResponse && (
          <div className="space-y-1.5">
            <Label htmlFor="detail-correctivePlan">Acción correctiva (qué harás)</Label>
            <textarea
              id="detail-correctivePlan"
              rows={4}
              value={correctivePlan}
              onChange={(event) => setCorrectivePlan(event.target.value)}
              disabled={isSubmitting}
              placeholder="Describe las medidas que implementarás para corregir el hallazgo"
              className={cn(dashboardInput(), 'h-auto min-h-[96px] resize-y py-2')}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="detail-commitmentDate">
            {isFirstResponse ? 'Fecha compromiso (F0)' : 'Nueva fecha compromiso'}
          </Label>
          <ActionCommitmentDatePicker
            id="detail-commitmentDate"
            value={commitmentDate}
            onChange={setCommitmentDate}
            placeholder={
              isFirstResponse ? 'Seleccionar fecha compromiso' : 'Seleccionar nueva fecha'
            }
          />
        </div>

        {!isFirstResponse && (
          <div className="space-y-1.5">
            <Label htmlFor="detail-changeReason">Motivo del cambio</Label>
            <textarea
              id="detail-changeReason"
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

        {respondMutation.isSuccess && isFirstResponse && (
          <p className="rounded-lg border border-[#00C4B3]/30 bg-[#00C4B3]/10 px-3 py-2 text-sm text-[#007a70]">
            Compromiso registrado. Corrige el hallazgo y continúa con la foto de resolución
            abajo.
          </p>
        )}

        {respondMutation.isSuccess && isDateUpdate && (
          <p className="rounded-lg border border-[#00C4B3]/30 bg-[#00C4B3]/10 px-3 py-2 text-sm text-[#007a70]">
            Fecha compromiso actualizada. El historial de fechas se actualizó arriba.
          </p>
        )}

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(dashboardButtonPrimary(), 'inline-flex items-center gap-2 px-5 py-2.5')}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando…
              </>
            ) : (
              <>
                <PenLine className="size-4" />
                {isFirstResponse ? 'Firmar compromiso' : 'Firmar nueva fecha'}
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
