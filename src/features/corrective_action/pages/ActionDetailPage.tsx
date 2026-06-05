import { useQuery } from '@tanstack/react-query';
import { Loader2, UserRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  ROLE_ADMINISTRATOR,
  ROLE_INSPECTOR,
  canRespondToActions,
  canReviewActionClosure,
} from '@/features/auth/utils/role-permissions';
import { getUsers } from '@/features/users/services/users.service';
import {
  ActionDetailCommitmentHistory,
  ActionDetailClosureReviewForm,
  ActionDetailDetectionEvidenceForm,
  ActionDetailEvidenceGallery,
  ActionDetailHeader,
  ActionDetailObservation,
  ActionDetailProgressTimeline,
  ActionDetailResolutionForm,
  ActionDetailRespondForm,
  ActionDetailStatusPanel,
  ReassignResponsibleModal,
} from '../components';
import { useActionDetail } from '../hooks/useActionDetail';

export function ActionDetailPage() {
  const navigate = useNavigate();
  const { actionId } = useParams<{ actionId: string }>();
  const roleName = useAuthStore((state) => state.user?.role?.name);
  const canRespond = canRespondToActions(roleName);
  const canReviewClosure = canReviewActionClosure(roleName);
  const detailQuery = useActionDetail(actionId);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  const usersQuery = useQuery({
    queryKey: ['users', 'active'],
    queryFn: getUsers,
    enabled: canReviewClosure,
  });

  const isAdminOrInspector = roleName === ROLE_ADMINISTRATOR || roleName === ROLE_INSPECTOR;
  const backLabel = isAdminOrInspector ? 'Volver a recorridos' : 'Volver a mis acciones';

  function handleBack() {
    navigate(isAdminOrInspector ? '/tours' : '/actions');
  }

  if (detailQuery.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-24 text-sm text-slate-500">
        <Loader2 className="size-5 animate-spin" />
        Cargando detalle de la acción…
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 py-12 text-center">
        <p className="text-sm text-red-600">
          {detailQuery.error instanceof Error
            ? detailQuery.error.message
            : 'No se pudo cargar el detalle de la acción correctiva.'}
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="text-sm font-medium text-[#0A2240] underline"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  const detail = detailQuery.data;

  const userOptions = (usersQuery.data ?? [])
    .filter((u) => u.isActive)
    .map((u) => ({ value: u.id, label: u.name }));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 md:space-y-6">
      <div className="flex items-start justify-between gap-4">
        <ActionDetailHeader
          detectionFolio={detail.detectionFolio}
          walkthroughFolio={detail.walkthroughFolio}
          onBack={handleBack}
          backLabel={backLabel}
        />
        {canReviewClosure && (
          <button
            type="button"
            onClick={() => setReassignModalOpen(true)}
            className="mt-2 inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#0A2240] shadow-sm transition-colors hover:bg-slate-50"
          >
            <UserRound className="size-3.5" />
            Reasignar responsable
          </button>
        )}
      </div>

      {actionId && (
        <ReassignResponsibleModal
          actionId={actionId}
          open={reassignModalOpen}
          onClose={() => setReassignModalOpen(false)}
          users={userOptions}
          currentResponsibleName={detail.responsibleName}
        />
      )}

      <ActionDetailEvidenceGallery
        inspectorName={detail.inspectorName}
        inspectedAt={detail.inspectedAt}
        inspectorPhotoUrl={detail.photoUrl}
        responsibleName={detail.responsibleName}
        respondedAt={detail.resolutionResolvedAt ?? detail.respondedAt}
        resolutionPhotoUrl={detail.resolutionPhotoUrl}
      />

      {actionId && isAdminOrInspector && !detail.photoUrl && (
        <ActionDetailDetectionEvidenceForm actionId={actionId} />
      )}

      <ActionDetailProgressTimeline detail={detail} />

      {detail.commitmentHistory.length > 0 && (
        <ActionDetailCommitmentHistory
          history={detail.commitmentHistory}
          currentCommitmentDate={detail.currentCommitmentDate}
        />
      )}

      <div className="grid gap-5 lg:grid-cols-5 lg:gap-6">
        <div className="lg:col-span-3">
          <ActionDetailObservation
            detectionType={detail.detectionType}
            description={detail.description}
          />
        </div>
        <div className="lg:col-span-2">
          <ActionDetailStatusPanel
            status={detail.status}
            companyName={detail.companyName}
            branchName={detail.branchName}
            areaName={detail.areaName}
            tourDate={detail.tourDate}
            assignedAt={detail.assignedAt}
            closureRejectionReason={detail.closureRejectionReason}
            resolutionDurationMinutes={detail.resolutionDurationMinutes}
          />
        </div>
      </div>

      {actionId && canReviewClosure && (
        <ActionDetailClosureReviewForm
          actionId={actionId}
          status={detail.status}
          resolutionDurationMinutes={detail.resolutionDurationMinutes}
          hasResolutionPhoto={Boolean(detail.resolutionPhotoUrl)}
        />
      )}

      {actionId && canRespond && (
        <>
          <ActionDetailRespondForm
            actionId={actionId}
            status={detail.status}
            initialCorrectivePlan={detail.correctivePlan}
            hasCommitment={detail.commitmentSequence !== null}
            currentCommitmentDate={detail.currentCommitmentDate}
          />
          {!detail.resolutionPhotoUrl && detail.commitmentSequence !== null && (
            <ActionDetailResolutionForm
              actionId={actionId}
              status={detail.status}
              respondedAt={detail.respondedAt}
            />
          )}
        </>
      )}
    </div>
  );
}
