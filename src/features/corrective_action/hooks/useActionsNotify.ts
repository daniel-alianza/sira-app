import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { CorrectiveActionItem } from '../interfaces';
import {
  notifyCorrectiveActionResponsible,
  notifyCorrectiveActionsResponsibleBulk,
} from '../service/action.service';

interface UseActionsNotifyOptions {
  readonly enabled: boolean;
}

export function useActionsNotify({ enabled }: UseActionsNotifyOptions) {
  const [notifyingActionId, setNotifyingActionId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error'>('success');

  const notifyOneMutation = useMutation({
    mutationFn: notifyCorrectiveActionResponsible,
  });

  const notifyAllMutation = useMutation({
    mutationFn: notifyCorrectiveActionsResponsibleBulk,
  });

  const clearFeedback = useCallback(() => {
    setFeedbackMessage(null);
  }, []);

  const notifyAction = useCallback(
    async (action: CorrectiveActionItem) => {
      if (!enabled) {
        return;
      }

      setFeedbackMessage(null);
      setNotifyingActionId(action.id);

      try {
        await notifyOneMutation.mutateAsync(action.id);
        setFeedbackTone('success');
        setFeedbackMessage(`Se notificó al responsable de ${action.detectionFolio}.`);
      } catch (error) {
        setFeedbackTone('error');
        setFeedbackMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo notificar al responsable.',
        );
      } finally {
        setNotifyingActionId(null);
      }
    },
    [enabled, notifyOneMutation],
  );

  const notifyAllActions = useCallback(
    async (actions: readonly CorrectiveActionItem[]) => {
      if (!enabled || actions.length === 0) {
        return;
      }

      setFeedbackMessage(null);
      setNotifyingActionId('bulk');

      try {
        const result = await notifyAllMutation.mutateAsync(
          actions.map((action) => action.id),
        );
        setFeedbackTone('success');
        setFeedbackMessage(
          `Se notificaron ${result.notifiedCount} responsable(s)${
            result.skippedCount > 0
              ? ` · ${result.skippedCount} omitida(s)`
              : ''
          }.`,
        );
      } catch (error) {
        setFeedbackTone('error');
        setFeedbackMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo notificar a los responsables.',
        );
      } finally {
        setNotifyingActionId(null);
      }
    },
    [enabled, notifyAllMutation],
  );

  const isNotifying =
    notifyOneMutation.isPending ||
    notifyAllMutation.isPending ||
    notifyingActionId !== null;

  return {
    notifyAction,
    notifyAllActions,
    notifyingActionId,
    isNotifying,
    feedbackMessage,
    feedbackTone,
    clearFeedback,
  };
}
