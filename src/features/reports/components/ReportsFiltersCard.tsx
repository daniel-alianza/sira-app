import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ReportsFiltersState } from '../interfaces';

interface FilterSelectOption {
  readonly value: string;
  readonly label: string;
}

interface ReportsFiltersCardProps {
  readonly filters: ReportsFiltersState;
  readonly companyOptions: readonly FilterSelectOption[];
  readonly areaOptions: readonly FilterSelectOption[];
  readonly responsibleOptions: readonly FilterSelectOption[];
  readonly statusOptions: readonly FilterSelectOption[];
  readonly activityOptions: readonly FilterSelectOption[];
  readonly onFilterChange: <K extends keyof ReportsFiltersState>(
    key: K,
    value: ReportsFiltersState[K],
  ) => void;
}

interface ReportsFilterFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly options: readonly FilterSelectOption[];
  readonly onValueChange: (value: string) => void;
}

function ReportsFilterField({
  id,
  label,
  value,
  options,
  onValueChange,
}: ReportsFilterFieldProps) {
  const items = options.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        items={items}
        onValueChange={(nextValue) =>
          onValueChange(nextValue ?? options[0]?.value ?? '')
        }
      >
        <SelectTrigger id={id} className="h-10 w-full bg-white text-[#0A2240]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ReportsFiltersCard({
  filters,
  companyOptions,
  areaOptions,
  responsibleOptions,
  statusOptions,
  activityOptions,
  onFilterChange,
}: ReportsFiltersCardProps) {
  return (
    <Card className="border-slate-200/90 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-[#0A2240]">Filtros adicionales</CardTitle>
        <CardDescription>
          Se aplican a la vista previa y al Excel exportado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <ReportsFilterField
            id="reports-filter-company"
            label="Empresa"
            value={filters.companyId}
            options={companyOptions}
            onValueChange={(value) => onFilterChange('companyId', value)}
          />
          <ReportsFilterField
            id="reports-filter-area"
            label="Área"
            value={filters.areaId}
            options={areaOptions}
            onValueChange={(value) => onFilterChange('areaId', value)}
          />
          <ReportsFilterField
            id="reports-filter-responsible"
            label="Responsable"
            value={filters.responsibleId}
            options={responsibleOptions}
            onValueChange={(value) => onFilterChange('responsibleId', value)}
          />
          <ReportsFilterField
            id="reports-filter-activity"
            label="Actividad"
            value={filters.activity}
            options={activityOptions}
            onValueChange={(value) => onFilterChange('activity', value)}
          />
          <ReportsFilterField
            id="reports-filter-status"
            label="Estatus"
            value={filters.status}
            options={statusOptions}
            onValueChange={(value) => onFilterChange('status', value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
