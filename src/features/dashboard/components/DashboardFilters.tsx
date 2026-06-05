import { useState, type ReactNode } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import {
  actionStatusOptions,
  activityTypeOptions,
  type DashboardDateRangeValue,
  type DashboardFilterOption,
} from '../interfaces';
import { DashboardFilterDateRange } from './DashboardFilterDateRange';
import { dashboardCard, dashboardHeadingClass, dashboardSubtextClass } from './dashboard-ui.classes';

const filterAccordionEaseClass =
  'duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none motion-reduce:animate-none';

interface FilterOption {
  readonly value: string;
  readonly label: string;
}

interface DashboardFilterSelectProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly FilterOption[];
}

function DashboardFilterSelect({
  id,
  label,
  value,
  onValueChange,
  options,
}: DashboardFilterSelectProps) {
  const selectItems = options.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? options[0]?.label ?? '';

  function handleValueChange(nextValue: string | null) {
    if (typeof nextValue === 'string' && nextValue.length > 0) {
      onValueChange(nextValue);
    }
  }

  return (
    <div className="min-w-0 space-y-2 text-left">
      <Label htmlFor={id} className={cn(dashboardSubtextClass, 'text-xs font-medium')}>
        {label}
      </Label>
      <Select value={value} onValueChange={handleValueChange} items={selectItems}>
        <SelectTrigger
          id={id}
          className="h-10 w-full min-w-0 bg-white text-[#0A2240] shadow-sm dark:bg-white [&_[data-slot=select-value]]:truncate"
        >
          <SelectValue>{selectedLabel}</SelectValue>
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

interface MobileFilterFieldProps {
  isOpen: boolean;
  delayMs: number;
  className?: string;
  children: ReactNode;
}

function MobileFilterField({ isOpen, delayMs, className, children }: MobileFilterFieldProps) {
  return (
    <div
      className={cn(
        'min-w-0',
        isOpen && 'max-md:dashboard-filter-field-enter',
        className,
      )}
      style={isOpen ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export interface DashboardFiltersProps {
  readonly companyId: string;
  readonly areaId: string;
  readonly responsibleId: string;
  readonly activity: string;
  readonly status: string;
  readonly dateRange: DashboardDateRangeValue;
  readonly companyOptions: readonly DashboardFilterOption[];
  readonly areaOptions: readonly DashboardFilterOption[];
  readonly responsibleOptions: readonly DashboardFilterOption[];
  readonly onCompanyChange: (value: string) => void;
  readonly onAreaChange: (value: string) => void;
  readonly onResponsibleChange: (value: string) => void;
  readonly onActivityChange: (value: string) => void;
  readonly onStatusChange: (value: string) => void;
  readonly onDateRangeChange: (value: DashboardDateRangeValue) => void;
  readonly firstWalkthroughDate?: string | null;
  readonly onApplyFromFirstWalkthrough?: () => void;
}

export function DashboardFilters({
  companyId,
  areaId,
  responsibleId,
  activity,
  status,
  dateRange,
  companyOptions,
  areaOptions,
  responsibleOptions,
  onCompanyChange,
  onAreaChange,
  onResponsibleChange,
  onActivityChange,
  onStatusChange,
  onDateRangeChange,
  firstWalkthroughDate,
  onApplyFromFirstWalkthrough,
}: DashboardFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={cn(dashboardCard(), 'gap-0 !overflow-visible py-0 ring-0')}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left md:hidden"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 text-[#0A2240]">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#00C4B3]/15">
            <Filter className="size-4 text-[#00a896]" />
          </div>
          <div>
            <span className="text-sm font-semibold !text-black">Filtros de consulta</span>
            <p className={cn(dashboardSubtextClass, 'text-xs')}>
              Toca para {isOpen ? 'ocultar' : 'mostrar'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-slate-500 transition-transform',
            filterAccordionEaseClass,
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <CardHeader className="hidden border-b border-slate-100 px-5 pt-5 pb-4 md:flex md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#00C4B3]/15">
            <Filter className="size-4 text-[#00a896]" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <CardTitle className={cn(dashboardHeadingClass, 'text-sm')}>
              Filtros de consulta
            </CardTitle>
            <CardDescription className={cn(dashboardSubtextClass, 'text-xs')}>
              Ajusta la vista sin generar reportes
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div
        className={cn(
          'grid transition-[grid-template-rows] md:contents',
          filterAccordionEaseClass,
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden md:overflow-visible">
          <CardContent
            className={cn(
              'border-slate-100 px-5 pb-6 transition-[opacity,padding] md:border-0 md:px-6 md:pt-5 md:pb-8',
              filterAccordionEaseClass,
              isOpen
                ? 'border-t pt-4 opacity-100 max-md:dashboard-filters-panel-enter'
                : 'pointer-events-none pt-0 opacity-0 md:pointer-events-auto md:pt-5 md:opacity-100',
            )}
          >
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <MobileFilterField isOpen={isOpen} delayMs={70}>
                <DashboardFilterSelect
                  id="filter-company"
                  label="Empresa"
                  value={companyId}
                  onValueChange={onCompanyChange}
                  options={companyOptions}
                />
              </MobileFilterField>
              <MobileFilterField isOpen={isOpen} delayMs={115}>
                <DashboardFilterSelect
                  id="filter-area"
                  label="Área"
                  value={areaId}
                  onValueChange={onAreaChange}
                  options={areaOptions}
                />
              </MobileFilterField>
              <MobileFilterField isOpen={isOpen} delayMs={160}>
                <DashboardFilterSelect
                  id="filter-responsible"
                  label="Responsable"
                  value={responsibleId}
                  onValueChange={onResponsibleChange}
                  options={responsibleOptions}
                />
              </MobileFilterField>
              <MobileFilterField isOpen={isOpen} delayMs={205}>
                <DashboardFilterSelect
                  id="filter-activity"
                  label="Actividad"
                  value={activity}
                  onValueChange={onActivityChange}
                  options={activityTypeOptions}
                />
              </MobileFilterField>
              <MobileFilterField isOpen={isOpen} delayMs={250}>
                <DashboardFilterSelect
                  id="filter-status"
                  label="Estatus"
                  value={status}
                  onValueChange={onStatusChange}
                  options={actionStatusOptions}
                />
              </MobileFilterField>
              <MobileFilterField
                isOpen={isOpen}
                delayMs={295}
                className="sm:col-span-2 lg:col-span-2 xl:col-span-2"
              >
                <DashboardFilterDateRange
                  id="filter-date-range"
                  label="Rango fechas"
                  value={dateRange}
                  onChange={onDateRangeChange}
                  firstWalkthroughDate={firstWalkthroughDate}
                  onApplyFromFirstWalkthrough={onApplyFromFirstWalkthrough}
                />
              </MobileFilterField>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
