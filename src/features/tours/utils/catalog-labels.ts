import type { CatalogItem } from '@/features/catalog/interfaces/catalog.interfaces';

export function resolveCatalogLabel(items: CatalogItem[], id: string): string {
  return items.find((item) => item.id === id)?.name ?? '—';
}
