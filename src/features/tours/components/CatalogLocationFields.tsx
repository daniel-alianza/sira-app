import { useMemo } from 'react';
import { Building2, Layers, MapPin, UserRound } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toCatalogSelectOptions } from '@/features/users/utils/catalog-select-options';
import type { CatalogLocationFieldsProps } from '../interfaces';

export function CatalogLocationFields({
  companyId,
  branchId,
  areaId,
  catalog,
  companyError,
  branchError,
  areaError,
  onCompanyChange,
  onBranchChange,
  onAreaChange,
  responsibleId,
  onResponsibleChange,
  responsibleOptions,
}: CatalogLocationFieldsProps) {
  const companyItems = useMemo(
    () => toCatalogSelectOptions(catalog.companies),
    [catalog.companies],
  );
  const branchItems = useMemo(
    () => toCatalogSelectOptions(catalog.branches),
    [catalog.branches],
  );
  const areaItems = useMemo(
    () => toCatalogSelectOptions(catalog.areas),
    [catalog.areas],
  );

  return (
    <div className="space-y-4 rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Ubicación de la detección
        </p>
        <p className="mt-0.5 text-xs text-slate-600">
          Puedes elegir otra empresa, sucursal o área en cada detección
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tour-companyId" className="flex items-center gap-1.5">
            <Building2 className="size-3.5 text-slate-400" />
            Empresa
          </Label>
          <Select
            value={companyId}
            items={companyItems}
            onValueChange={(value) => onCompanyChange(value ?? '')}
          >
            <SelectTrigger id="tour-companyId" className="w-full">
              <SelectValue placeholder="Seleccionar empresa" />
            </SelectTrigger>
            <SelectContent>
              {companyItems.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {companyError && <p className="text-xs text-destructive">{companyError}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tour-branchId" className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-slate-400" />
            Sucursal
          </Label>
          <Select
            value={branchId}
            items={branchItems}
            onValueChange={(value) => onBranchChange(value ?? '')}
          >
            <SelectTrigger id="tour-branchId" className="w-full">
              <SelectValue placeholder="Seleccionar sucursal" />
            </SelectTrigger>
            <SelectContent>
              {branchItems.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {branchError && <p className="text-xs text-destructive">{branchError}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tour-areaId" className="flex items-center gap-1.5">
          <Layers className="size-3.5 text-slate-400" />
          Área
        </Label>
        <Select
          value={areaId}
          items={areaItems}
          onValueChange={(value) => onAreaChange(value ?? '')}
        >
          <SelectTrigger id="tour-areaId" className="w-full">
            <SelectValue placeholder="Seleccionar área" />
          </SelectTrigger>
          <SelectContent>
            {areaItems.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {areaError && <p className="text-xs text-destructive">{areaError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tour-responsibleId" className="flex items-center gap-1.5">
          <UserRound className="size-3.5 text-slate-400" />
          Responsable
        </Label>
        <Select
          value={responsibleId ?? ''}
          onValueChange={(value) => onResponsibleChange?.(value ?? '')}
          items={responsibleOptions?.map((o) => ({ value: o.value, label: o.label })) ?? []}
          disabled={!responsibleOptions || responsibleOptions.length === 0}
        >
          <SelectTrigger id="tour-responsibleId" className="w-full">
            <SelectValue
              placeholder={
                responsibleOptions && responsibleOptions.length > 0
                  ? 'Seleccionar responsable'
                  : 'Sin responsables disponibles'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {responsibleOptions?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
