import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useCatalogSelectors } from '@/features/catalog/hooks/useCatalogSelectors';
import {
  EMPTY_CATALOG,
  FILTER_ALL,
  STATUS_FILTER_OPTIONS,
} from '../interfaces';
import type {
  CatalogItem,
  ModalMode,
  StatusFilter,
  User,
  UserCatalog,
  UserFormValues,
} from '../interfaces';
import { mapApiUsersToUsers } from '../services/users.mapper';
import {
  buildUpdateUserPayload,
  createUser,
  getUsers,
  updateUser,
} from '../services/users.service';

const USERS_QUERY_KEY = ['users'] as const;

export function useUsersPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [companyFilter, setCompanyFilter] = useState(FILTER_ALL);
  const [areaFilter, setAreaFilter] = useState(FILTER_ALL);
  const [branchFilter, setBranchFilter] = useState(FILTER_ALL);

  const catalogQuery = useCatalogSelectors();
  const usersQuery = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsers,
  });

  const catalog: UserCatalog = useMemo(
    () => ({
      companies: catalogQuery.data?.companies ?? EMPTY_CATALOG.companies,
      areas: catalogQuery.data?.areas ?? EMPTY_CATALOG.areas,
      branches: catalogQuery.data?.branches ?? EMPTY_CATALOG.branches,
    }),
    [catalogQuery.data],
  );

  const roles: CatalogItem[] = useMemo(
    () => catalogQuery.data?.roles ?? [],
    [catalogQuery.data?.roles],
  );

  const users = useMemo(
    () => mapApiUsersToUsers(usersQuery.data ?? [], catalog, roles),
    [usersQuery.data, catalog, roles],
  );

  const invalidateUsers = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: invalidateUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: UserFormValues }) =>
      updateUser(id, buildUpdateUserPayload(values)),
    onSuccess: invalidateUsers,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateUser(id, { isActive }),
    onSuccess: invalidateUsers,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isConfirmLoading = toggleActiveMutation.isPending;

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setEditingUser(null);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((user: User) => {
    setModalMode('edit');
    setEditingUser(user);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingUser(null);
  }, []);

  const openConfirm = useCallback((user: User) => {
    setConfirmUser(user);
    setConfirmOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    setConfirmUser(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: UserFormValues) => {
      if (modalMode === 'create') {
        await createMutation.mutateAsync(values);
      } else if (editingUser) {
        await updateMutation.mutateAsync({ id: editingUser.id, values });
      }
    },
    [modalMode, editingUser, createMutation, updateMutation],
  );

  const handleToggleActive = useCallback(async () => {
    if (!confirmUser) return;

    await toggleActiveMutation.mutateAsync({
      id: confirmUser.id,
      isActive: !confirmUser.isActive,
    });
    closeConfirm();
  }, [confirmUser, toggleActiveMutation, closeConfirm]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
    }),
    [users],
  );

  const hasActiveFilters =
    search.length > 0 ||
    statusFilter !== 'all' ||
    companyFilter !== FILTER_ALL ||
    areaFilter !== FILTER_ALL ||
    branchFilter !== FILTER_ALL;

  const filteredUsers = users.filter((u) => {
    if (statusFilter === 'active' && !u.isActive) return false;
    if (statusFilter === 'inactive' && u.isActive) return false;
    if (companyFilter !== FILTER_ALL && u.company?.id !== companyFilter) return false;
    if (areaFilter !== FILTER_ALL && u.area?.id !== areaFilter) return false;
    if (branchFilter !== FILTER_ALL && u.branch?.id !== branchFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.role?.name ?? '').toLowerCase().includes(q) ||
      (u.area?.name ?? '').toLowerCase().includes(q) ||
      (u.branch?.name ?? '').toLowerCase().includes(q) ||
      (u.company?.name ?? '').toLowerCase().includes(q)
    );
  });

  const confirmTitle = confirmUser?.isActive
    ? 'Desactivar usuario'
    : 'Activar usuario';

  const confirmDescription = confirmUser?.isActive
    ? `¿Estás seguro de desactivar a "${confirmUser?.name}"? El usuario no podrá acceder al sistema.`
    : `¿Estás seguro de activar a "${confirmUser?.name}"? El usuario podrá acceder al sistema nuevamente.`;

  const confirmLabel = confirmUser?.isActive ? 'Desactivar' : 'Activar';

  return {
    users,
    catalog,
    roles,
    stats,
    filteredUsers,
    hasActiveFilters,
    isLoading: usersQuery.isLoading || catalogQuery.isLoading,
    isError: usersQuery.isError,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusFilters: STATUS_FILTER_OPTIONS,
    companyFilter,
    setCompanyFilter,
    areaFilter,
    setAreaFilter,
    branchFilter,
    setBranchFilter,
    modalOpen,
    modalMode,
    editingUser,
    openCreateModal,
    closeModal,
    openEditModal,
    handleSubmit,
    isSubmitting,
    confirmOpen,
    confirmUser,
    openConfirm,
    closeConfirm,
    handleToggleActive,
    isConfirmLoading,
    confirmTitle,
    confirmDescription,
    confirmLabel,
  };
}
