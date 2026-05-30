import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboardCard } from '@/features/dashboard/components/dashboard-ui.classes';
import {
  UserConfirmDialog,
  UserModal,
  UsersFiltersToolbar,
  UsersPageHeader,
  UsersStatsSection,
  UsersTable,
} from '../components';
import { useUsersPage } from '../hooks';

export function UsersPage() {
  const {
    users,
    catalog,
    roles,
    stats,
    filteredUsers,
    hasActiveFilters,
    isLoading,
    isError,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusFilters,
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
    confirmOpen,
    openConfirm,
    closeConfirm,
    handleToggleActive,
    isConfirmLoading,
    confirmTitle,
    confirmDescription,
    confirmLabel,
  } = useUsersPage();

  return (
    <div className="w-full space-y-5 md:space-y-6">
      <UsersPageHeader onCreateClick={openCreateModal} />

      <UsersStatsSection
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
      />

      <div className={cn(dashboardCard(), 'overflow-hidden p-0')}>
        {isLoading && (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500">
            <Loader2 className="size-5 animate-spin" />
            Cargando usuarios…
          </div>
        )}

        {isError && !isLoading && (
          <p className="px-6 py-16 text-center text-sm text-red-600">
            No se pudieron cargar los usuarios. Intenta de nuevo más tarde.
          </p>
        )}

        {!isLoading && !isError && (
          <>
        <UsersFiltersToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusFilters={statusFilters}
          companyFilter={companyFilter}
          areaFilter={areaFilter}
          branchFilter={branchFilter}
          onCompanyFilterChange={setCompanyFilter}
          onAreaFilterChange={setAreaFilter}
          onBranchFilterChange={setBranchFilter}
          catalog={catalog}
        />

        <UsersTable
          users={filteredUsers}
          totalCount={users.length}
          hasActiveFilters={hasActiveFilters}
          onEdit={openEditModal}
          onToggleActive={openConfirm}
        />
          </>
        )}
      </div>

      <UserModal
        mode={modalMode}
        user={editingUser}
        open={modalOpen}
        onClose={closeModal}
        catalog={catalog}
        roles={roles}
        onSubmit={handleSubmit}
      />

      <UserConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        loading={isConfirmLoading}
        onConfirm={handleToggleActive}
        onCancel={closeConfirm}
      />
    </div>
  );
}
