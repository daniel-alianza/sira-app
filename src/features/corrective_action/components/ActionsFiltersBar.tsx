import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/users/services/users.service';
import { useCatalogSelectors } from '@/features/catalog/hooks/useCatalogSelectors';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ActionsFiltersBarProps {
  readonly companyId: string;
  readonly areaId: string;
  readonly branchId: string;
  readonly responsibleId: string;
  readonly onCompanyChange: (value: string) => void;
  readonly onAreaChange: (value: string) => void;
  readonly onBranchChange: (value: string) => void;
  readonly onResponsibleChange: (value: string) => void;
  readonly onClear: () => void;
}

export function ActionsFiltersBar({
  companyId,
  areaId,
  branchId,
  responsibleId,
  onCompanyChange,
  onAreaChange,
  onBranchChange,
  onResponsibleChange,
  onClear,
}: ActionsFiltersBarProps) {
  const catalogQuery = useCatalogSelectors();
  const usersQuery = useQuery({
    queryKey: ['users', 'active'],
    queryFn: getUsers,
  });

  const companies = catalogQuery.data?.companies ?? [];
  const areas = catalogQuery.data?.areas ?? [];
  const branches = catalogQuery.data?.branches ?? [];

  const users = (usersQuery.data ?? [])
    .filter((user) => user.isActive)
    .filter((user) => !companyId || user.companyId === companyId)
    .filter((user) => !areaId || user.areaId === areaId)
    .filter((user) => !branchId || user.branchId === branchId)
    .map((user) => ({ value: user.id, label: user.name }));

  const selectClass =
    'h-10 w-48 border-slate-200 rounded-xl bg-white text-sm text-[#0A2240] shadow-sm';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-[#0A2240]">
        <Search className="size-4" />
        Filtros
      </div>

      <div className="flex flex-wrap gap-3">
          <Select
              value={companyId}
              onValueChange={(value) => { if (value) onCompanyChange(value); }}
              items={companies.map((c) => ({ value: c.id, label: c.name }))}
            >
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={areaId}
              onValueChange={(value) => { if (value) onAreaChange(value); }}
              items={areas.map((a) => ({ value: a.id, label: a.name }))}
            >
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={branchId}
              onValueChange={(value) => { if (value) onBranchChange(value); }}
              items={branches.map((b) => ({ value: b.id, label: b.name }))}
            >
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Sucursal" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={responsibleId}
              onValueChange={(value) => { if (value) onResponsibleChange(value); }}
              items={users}
            >
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Responsable" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.value} value={user.value}>
                    {user.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
