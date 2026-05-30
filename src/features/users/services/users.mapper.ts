import type {
  ApiUserPublic,
  CatalogItem,
  User,
  UserCatalog,
} from '../interfaces';

function resolveCatalogItem(
  items: CatalogItem[],
  id: string,
): CatalogItem {
  return items.find((item) => item.id === id) ?? { id, name: '—' };
}

export function mapApiUserToUser(
  apiUser: ApiUserPublic,
  catalog: UserCatalog,
  roles: CatalogItem[] = [],
): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    isActive: apiUser.isActive,
    company: resolveCatalogItem(catalog.companies, apiUser.companyId),
    area: resolveCatalogItem(catalog.areas, apiUser.areaId),
    branch: resolveCatalogItem(catalog.branches, apiUser.branchId),
    role: resolveCatalogItem(roles, apiUser.roleId),
  };
}

export function mapApiUsersToUsers(
  apiUsers: ApiUserPublic[],
  catalog: UserCatalog,
  roles: CatalogItem[] = [],
): User[] {
  return apiUsers.map((apiUser) => mapApiUserToUser(apiUser, catalog, roles));
}
