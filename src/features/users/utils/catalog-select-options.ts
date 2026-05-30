import type { CatalogItem } from '../interfaces';

export interface CatalogSelectOption {
  value: string;
  label: string;
}

export function toCatalogSelectOptions(items: CatalogItem[]): CatalogSelectOption[] {
  return items.map((item) => ({ value: item.id, label: item.name }));
}

export function withSelectedCatalogOption(
  options: CatalogSelectOption[],
  selectedId: string,
  selectedLabel?: string,
): CatalogSelectOption[] {
  if (!selectedId) {
    return options;
  }

  if (options.some((option) => option.value === selectedId)) {
    return options;
  }

  const label =
    selectedLabel && selectedLabel !== '—' ? selectedLabel : 'Selección actual';

  return [{ value: selectedId, label }, ...options];
}
