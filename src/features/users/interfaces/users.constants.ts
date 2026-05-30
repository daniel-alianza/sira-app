import type { StatusFilterOption, UserCatalog } from './users.interfaces';

export const FILTER_ALL = 'all';

export const EMPTY_CATALOG: UserCatalog = {
  companies: [],
  areas: [],
  branches: [],
};

export const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'Activos' },
  { id: 'inactive', label: 'Inactivos' },
];
