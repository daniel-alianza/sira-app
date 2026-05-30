import { siraApi } from '@/api/sira-api';
import type {
  ApiResponse,
  CatalogSelectors,
} from '../interfaces/catalog.interfaces';

export async function getCatalogSelectors(): Promise<CatalogSelectors> {
  const { data } = await siraApi.get<ApiResponse<CatalogSelectors>>(
    '/catalog/selectors',
  );
  return data.data;
}
