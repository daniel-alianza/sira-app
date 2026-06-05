import { useEffect, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { dashboardSubtextClass } from './dashboard-ui.classes';

export interface DashboardDateRangeValue {
  from: string;
  to: string;
}

interface DashboardFilterDateRangeProps {
  id: string;
  label: string;
  value: DashboardDateRangeValue;
  onChange: (value: DashboardDateRangeValue) => void;
  readonly firstWalkthroughDate?: string | null;
  readonly onApplyFromFirstWalkthrough?: () => void;
}

function formatFirstWalkthroughLabel(isoDate: string): string {
  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) {
    return isoDate;
  }
  return format(parsed, 'd MMM yyyy', { locale: es });
}

type PickingField = 'from' | 'to';

function parseFilterDate(value: string): Date | undefined {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}

function formatFilterDateIso(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function formatFilterDateChip(date: Date | undefined): string {
  if (!date) {
    return '—';
  }
  return format(date, 'EEE, d MMM', { locale: es });
}

function formatFilterDateSummary(from: Date | undefined, to: Date | undefined): string {
  if (!from) {
    return 'Seleccionar rango';
  }
  if (!to || to < from) {
    return `${format(from, 'dd/MM/yyyy', { locale: es })} – …`;
  }
  return `${format(from, 'dd/MM/yyyy', { locale: es })} – ${format(to, 'dd/MM/yyyy', { locale: es })}`;
}

function normalizeRange(from: Date, to: Date): DateRange {
  if (to < from) {
    return { from: to, to: from };
  }
  return { from, to };
}

function valueToRange(value: DashboardDateRangeValue): DateRange {
  const from = parseFilterDate(value.from);
  const to = parseFilterDate(value.to);
  if (!from) {
    return { from: undefined, to: undefined };
  }
  if (!to || to < from) {
    return { from, to: undefined };
  }
  return { from, to };
}

export function DashboardFilterDateRange({
  id,
  label,
  value,
  onChange,
  firstWalkthroughDate,
  onApplyFromFirstWalkthrough,
}: DashboardFilterDateRangeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickingField, setPickingField] = useState<PickingField>('from');
  const [draftRange, setDraftRange] = useState<DateRange>({ from: undefined, to: undefined });

  useEffect(() => {
    if (isOpen) {
      setDraftRange(valueToRange(value));
      setPickingField('from');
    }
  }, [isOpen, value.from, value.to]);

  const committedFrom = parseFilterDate(value.from);
  const committedTo = parseFilterDate(value.to);
  const summaryFrom = draftRange.from ?? committedFrom;
  const summaryTo = draftRange.to ?? committedTo;

  function commitRange(range: DateRange) {
    if (!range.from || !range.to) {
      return;
    }
    const normalized = normalizeRange(range.from, range.to);
    onChange({
      from: formatFilterDateIso(normalized.from!),
      to: formatFilterDateIso(normalized.to!),
    });
  }

  function handleFromSelect(date: Date | undefined) {
    if (!date) {
      return;
    }

    const previousTo = draftRange.to;
    const validTo = previousTo && previousTo >= date ? previousTo : undefined;
    const next: DateRange = { from: date, to: validTo };

    setDraftRange(next);
    if (validTo) {
      commitRange({ from: date, to: validTo });
    }
    setPickingField('to');
  }

  function handleToSelect(date: Date | undefined) {
    if (!date || !draftRange.from) {
      return;
    }

    const normalized = normalizeRange(draftRange.from, date);
    setDraftRange(normalized);
    commitRange(normalized);
    setIsOpen(false);
  }

  function handleSelectFromChip() {
    setPickingField('from');
  }

  function handleSelectToChip() {
    if (!draftRange.from) {
      setPickingField('from');
      return;
    }
    setPickingField('to');
  }

  const rangeChipClass = (field: PickingField) =>
    cn(
      'flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-all',
      'bg-white text-sm text-[#0A2240] shadow-sm',
      pickingField === field
        ? 'border-[#00C4B3] ring-2 ring-[#00C4B3]/25'
        : 'border-slate-200 hover:border-slate-300',
      field === 'to' && !draftRange.from && 'cursor-not-allowed opacity-50',
    );

  const rangeModifiers =
    draftRange.from && draftRange.to
      ? {
          inRange: (date: Date) => date > draftRange.from! && date < draftRange.to!,
        }
      : undefined;

  const rangeModifiersClassNames = {
    inRange: 'bg-[#00C4B3]/15 rounded-none',
  };

  const showFirstWalkthroughShortcut =
    firstWalkthroughDate !== null &&
    firstWalkthroughDate !== undefined &&
    firstWalkthroughDate.length > 0 &&
    onApplyFromFirstWalkthrough !== undefined;

  return (
    <div className="min-w-0 space-y-2 text-left">
      <Label htmlFor={id} className={cn(dashboardSubtextClass, 'text-xs font-medium')}>
        {label}
      </Label>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
      <div className="min-w-0 flex-1">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          id={id}
          className="w-full min-w-0"
          render={
            <Button
              type="button"
              variant="outline"
              className={cn(
                'h-10 w-full min-w-0 justify-start gap-2 bg-white px-3 font-normal shadow-sm',
                'border-slate-200 text-[#0A2240] hover:bg-slate-50 dark:bg-white dark:hover:bg-slate-50',
                !summaryFrom && 'text-slate-500',
              )}
            />
          }
        >
          <CalendarIcon className="size-4 shrink-0 text-[#00a896]" />
          <span className="truncate !text-black">
            {formatFilterDateSummary(summaryFrom, summaryTo)}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="start" sideOffset={6}>
          <div className="border-b border-slate-100 p-3">
            <div className="flex gap-2">
              <button type="button" onClick={handleSelectFromChip} className={rangeChipClass('from')}>
                <CalendarIcon className="size-4 shrink-0 text-[#00a896]" />
                <span className="min-w-0 truncate capitalize !text-black">
                  {formatFilterDateChip(draftRange.from)}
                </span>
              </button>
              <button
                type="button"
                onClick={handleSelectToChip}
                disabled={!draftRange.from}
                className={rangeChipClass('to')}
              >
                <CalendarIcon className="size-4 shrink-0 text-[#00a896]" />
                <span className="min-w-0 truncate capitalize !text-black">
                  {formatFilterDateChip(draftRange.to)}
                </span>
              </button>
            </div>
            <p className={cn(dashboardSubtextClass, 'mt-2 text-[11px]')}>
              {pickingField === 'from'
                ? '1. Elige la fecha de inicio en el calendario'
                : '2. Elige la fecha de fin en el calendario'}
            </p>
          </div>
          <Calendar
            mode="single"
            locale={es}
            selected={pickingField === 'from' ? draftRange.from : draftRange.to}
            onSelect={pickingField === 'from' ? handleFromSelect : handleToSelect}
            defaultMonth={
              (pickingField === 'from' ? draftRange.from : draftRange.to) ??
              draftRange.from ??
              committedFrom
            }
            disabled={
              pickingField === 'to' && draftRange.from
                ? { before: draftRange.from }
                : undefined
            }
            modifiers={rangeModifiers}
            modifiersClassNames={rangeModifiersClassNames}
          />
        </PopoverContent>
      </Popover>
      </div>
      {showFirstWalkthroughShortcut && (
        <button
          type="button"
          onClick={onApplyFromFirstWalkthrough}
          className={cn(
            'inline-flex min-h-10 shrink-0 cursor-pointer flex-col justify-center rounded-lg border border-[#00C4B3]/40',
            'bg-[#00C4B3]/10 px-3 py-2 text-left transition-colors hover:bg-[#00C4B3]/15',
          )}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#007a70]">
            Desde el primer recorrido
          </span>
          <span className="text-xs font-medium text-[#0A2240]">
            {formatFirstWalkthroughLabel(firstWalkthroughDate)}
          </span>
        </button>
      )}
      </div>
    </div>
  );
}
