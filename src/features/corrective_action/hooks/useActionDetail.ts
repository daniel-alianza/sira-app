import { useQuery } from '@tanstack/react-query';
import { getCorrectiveActionDetailQueryKey } from '../interfaces';
import { fetchCorrectiveActionById } from '../service/action.service';

export function useActionDetail(actionId: string | undefined) {
  return useQuery({
    queryKey: getCorrectiveActionDetailQueryKey(actionId ?? ''),
    queryFn: () => fetchCorrectiveActionById(actionId!),
    enabled: Boolean(actionId),
  });
}
