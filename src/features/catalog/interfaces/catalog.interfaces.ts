export interface CatalogItem {
  id: string;
  name: string;
}

export interface CatalogSelectors {
  companies: CatalogItem[];
  branches: CatalogItem[];
  areas: CatalogItem[];
  roles: CatalogItem[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  error: string | null;
}
