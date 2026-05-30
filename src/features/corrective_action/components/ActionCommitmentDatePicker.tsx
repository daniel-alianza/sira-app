import { useState } from 'react';
import { format, isValid, parse, parseISO, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { dashboardInput, dashboardSubtextClass } from '@/features/dashboard/components/dashboard-ui.classes';

interface ActionCommitmentDatePickerProps {
  readonly id: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

function parseCommitmentDate(value: string): Date | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const isoParsed = parseISO(value);
  if (isValid(isoParsed)) {
    return isoParsed;
  }

  const labelParsed = parse(value.replace(/\./g, '').trim(), 'd MMM yyyy', new Date(), {
    locale: es,
  });
  if (isValid(labelParsed)) {
    return labelParsed;
  }

  return undefined;
}

function formatCommitmentDateIso(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function formatCommitmentDateLabel(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: es });
}

export function ActionCommitmentDatePicker({
  id,
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
}: ActionCommitmentDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = parseCommitmentDate(value);
  const today = startOfToday();

  function handleSelect(date: Date | undefined) {
    if (!date) {
      return;
    }
    onChange(formatCommitmentDateIso(date));
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        id={id}
        className="w-full min-w-0"
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              dashboardInput(),
              'h-9 justify-start gap-2 font-normal hover:bg-white',
              !selectedDate && 'text-slate-500',
            )}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0 text-[#00a896]" aria-hidden />
        <span className="truncate text-[#0A2240]">
          {selectedDate ? formatCommitmentDateLabel(selectedDate) : placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="start" sideOffset={6}>
        <Calendar
          mode="single"
          locale={es}
          selected={selectedDate}
          onSelect={handleSelect}
          defaultMonth={selectedDate ?? today}
          disabled={{ before: today }}
        />
        <p className={cn(dashboardSubtextClass, 'border-t border-slate-100 px-3 py-2 text-xs')}>
          Solo fechas de hoy en adelante
        </p>
      </PopoverContent>
    </Popover>
  );
}
