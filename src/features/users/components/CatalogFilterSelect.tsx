import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FILTER_ALL } from '../interfaces';
import type { CatalogFilterSelectProps } from '../interfaces';

export function CatalogFilterSelect({
  label,
  placeholder,
  value,
  options,
  onValueChange,
}: CatalogFilterSelectProps) {
  const selectOptions = [
    { value: FILTER_ALL, label: placeholder },
    ...options.map((item) => ({ value: item.id, label: item.name })),
  ];

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <Label className="text-xs font-medium text-slate-500">{label}</Label>
      <Select
        value={value}
        items={selectOptions}
        onValueChange={(nextValue) => onValueChange(nextValue ?? FILTER_ALL)}
      >
        <SelectTrigger className="w-full min-w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {selectOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
