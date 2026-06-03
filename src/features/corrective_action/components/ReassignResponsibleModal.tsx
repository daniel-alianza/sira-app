import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, UserRound } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { canReviewActionClosure } from '@/features/auth/utils/role-permissions';
import {
  CORRECTIVE_ACTIONS_QUERY_KEY,
  getCorrectiveActionDetailQueryKey,
} from '../interfaces';
import { reassignCorrectiveActionResponsible } from '../service/action.service';

interface ReassignResponsibleModalProps {
  readonly actionId: string;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly users: readonly { value: string; label: string }[];
  readonly currentResponsibleName: string;
}

export function ReassignResponsibleModal({
  actionId,
  open,
  onClose,
  users,
  currentResponsibleName,
}: ReassignResponsibleModalProps) {
  const queryClient = useQueryClient();
  const roleName = useAuthStore((state) => state.user?.role?.name);
  const canReassign = canReviewActionClosure(roleName);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const reassignMutation = useMutation({
    mutationFn: (newResponsibleId: string) =>
      reassignCorrectiveActionResponsible(actionId, newResponsibleId),
    onSuccess: async () => {
      setFormError(null);
      setSelectedUserId('');
      await queryClient.invalidateQueries({ queryKey: CORRECTIVE_ACTIONS_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: getCorrectiveActionDetailQueryKey(actionId),
      });
      onClose();
    },
    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  if (!open || !canReassign) {
    return null;
  }

  function handleSubmit() {
    setFormError(null);

    if (!selectedUserId) {
      setFormError('Selecciona un nuevo responsable');
      return;
    }

    reassignMutation.mutate(selectedUserId);
  }

  const isSubmitting = reassignMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-[#0A2240]">Reasignar responsable</h3>
        <p className="mt-1 text-sm text-slate-500">
          Responsable actual: <span className="font-medium text-[#0A2240]">{currentResponsibleName}</span>
        </p>

        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reassign-user">Nuevo responsable</Label>
            <Select
              value={selectedUserId}
              onValueChange={(value) => { if (value) setSelectedUserId(value); }}
              items={users.map((u) => ({ value: u.value, label: u.label }))}
            >
              <SelectTrigger id="reassign-user" className="h-10 w-full bg-white text-[#0A2240] shadow-sm">
                <SelectValue placeholder="Seleccionar responsable" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.value} value={user.value}>
                    <span className="inline-flex items-center gap-2">
                      <UserRound className="size-3.5 text-slate-400" />
                      {user.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0A2240] shadow-sm transition-colors hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedUserId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0A2240] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0A2240]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Reasignando…
                </>
              ) : (
                'Reasignar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
