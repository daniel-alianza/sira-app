import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ApiUserPublic } from '@/features/users/interfaces';
import { getUsers } from '@/features/users/services/users.service';
import { toCatalogSelectOptions } from '@/features/users/utils/catalog-select-options';

export function useResponsibleOptions() {
  const query = useQuery({
    queryKey: ['users', 'responsible-select'],
    queryFn: getUsers,
  });

  const activeUsers: ApiUserPublic[] = useMemo(
    () => (query.data ?? []).filter((user) => user.isActive),
    [query.data],
  );

  const options = useMemo(
    () => toCatalogSelectOptions(activeUsers.map((user) => ({ id: user.id, name: user.name }))),
    [activeUsers],
  );

  return {
    data: activeUsers,
    options,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
