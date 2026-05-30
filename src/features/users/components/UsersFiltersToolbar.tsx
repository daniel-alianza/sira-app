import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboardInput } from '@/features/dashboard/components/dashboard-ui.classes';
import { CatalogFilterSelect } from './CatalogFilterSelect';
import type { UsersFiltersToolbarProps } from '../interfaces';

export function UsersFiltersToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusFilters,
  companyFilter,
  areaFilter,
  branchFilter,
  onCompanyFilterChange,
  onAreaFilterChange,
  onBranchFilterChange,
  catalog,
}: UsersFiltersToolbarProps) {
  return (
    <div className="space-y-3 border-b border-slate-200/90 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por nombre, email, rol o área..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(dashboardInput(), 'pl-9')}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onStatusFilterChange(filter.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200',
                statusFilter === filter.id
                  ? 'bg-[#0A2240] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CatalogFilterSelect
          label="Compañía"
          placeholder="Todas las compañías"
          value={companyFilter}
          options={catalog.companies}
          onValueChange={onCompanyFilterChange}
        />
        <CatalogFilterSelect
          label="Área"
          placeholder="Todas las áreas"
          value={areaFilter}
          options={catalog.areas}
          onValueChange={onAreaFilterChange}
        />
        <CatalogFilterSelect
          label="Sucursal"
          placeholder="Todas las sucursales"
          value={branchFilter}
          options={catalog.branches}
          onValueChange={onBranchFilterChange}
        />
      </div>
    </div>
  );
}
