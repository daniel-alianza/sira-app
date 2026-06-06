import type { ComponentType } from 'react';
import type { UserFormValues } from './user-form.schema';

export interface CatalogItem {
  id: string;
  name: string;
}

export interface ApiUserPublic {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  companyId: string;
  areaId: string;
  branchId: string;
  roleId: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  empresaId?: string;
  sucursalId?: string;
  areaId?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  company?: CatalogItem;
  area?: CatalogItem;
  branch?: CatalogItem;
  role?: CatalogItem;
}

export interface UserCatalog {
  companies: CatalogItem[];
  areas: CatalogItem[];
  branches: CatalogItem[];
}

export type ModalMode = 'create' | 'edit';
export type UserEditScope = 'full' | 'inspector';
export type StatusFilter = 'all' | 'active' | 'inactive';
export type StatCardTone = 'default' | 'success' | 'muted';

export interface StatusFilterOption {
  id: StatusFilter;
  label: string;
}

export interface UserModalProps {
  mode: ModalMode;
  user: User | null;
  open: boolean;
  onClose: () => void;
  catalog: UserCatalog;
  roles: CatalogItem[];
  onSubmit: (values: UserFormValues) => Promise<void>;
  editScope?: UserEditScope;
}

export interface UserConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface UsersEmptyStateProps {
  hasSearch: boolean;
}

export interface UsersStatCardProps {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  tone: StatCardTone;
}

export interface UserAvatarProps {
  name: string;
  isActive: boolean;
}

export interface StatusBadgeProps {
  isActive: boolean;
}

export interface RoleBadgeProps {
  roleName: string;
}

export interface CatalogFilterSelectProps {
  label: string;
  placeholder: string;
  value: string;
  options: CatalogItem[];
  onValueChange: (value: string) => void;
}

export interface UsersPageHeaderProps {
  readonly canManageUsers: boolean;
  readonly canEditInspectorUsers: boolean;
  readonly onCreateClick?: () => void;
}

export interface UsersStatsSectionProps {
  total: number;
  active: number;
  inactive: number;
}

export interface UsersFiltersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  statusFilters: StatusFilterOption[];
  companyFilter: string;
  areaFilter: string;
  branchFilter: string;
  onCompanyFilterChange: (value: string) => void;
  onAreaFilterChange: (value: string) => void;
  onBranchFilterChange: (value: string) => void;
  catalog: UserCatalog;
}

export interface UsersTableProps {
  users: User[];
  totalCount: number;
  hasActiveFilters: boolean;
  canManageUsers: boolean;
  canEditUser: (user: User) => boolean;
  canToggleUserActive: boolean;
  onEdit: (user: User) => void;
  onToggleActive: (user: User) => void;
}

export interface UsersTableRowProps {
  user: User;
  canEdit: boolean;
  canToggleActive: boolean;
  onEdit: (user: User) => void;
  onToggleActive: (user: User) => void;
}

export type { UserFormValues };
