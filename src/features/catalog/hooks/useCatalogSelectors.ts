import { useQuery } from '@tanstack/react-query';
import { getCatalogSelectors } from '../services/catalog.service';

export function useCatalogSelectors() {
  return useQuery({
    queryKey: ['catalog', 'selectors'],
    queryFn: getCatalogSelectors,
  });
}
