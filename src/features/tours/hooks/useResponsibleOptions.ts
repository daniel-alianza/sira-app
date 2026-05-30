import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/users/services/users.service';
import { toCatalogSelectOptions } from '@/features/users/utils/catalog-select-options';

export function useResponsibleOptions() {
  const query = useQuery({
    queryKey: ['users', 'responsible-select'],
    queryFn: getUsers,
  });

  const options = useMemo(() => {
    if (!query.data) {
      return [];
    }

    const activeUsers = query.data.filter((user) => user.isActive);
    return toCatalogSelectOptions(
      activeUsers.map((user) => ({ id: user.id, name: user.name })),
    );
  }, [query.data]);

  return {
    options,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
