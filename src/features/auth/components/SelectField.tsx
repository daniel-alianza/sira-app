import type { ReactNode } from 'react';
import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CatalogItem } from '@/features/catalog/interfaces/catalog.interfaces';

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  icon: LucideIcon;
  label: string;
  placeholder: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  triggerClassName?: string;
  iconClassName?: string;
  children?: ReactNode;
  options?: CatalogItem[];
  optionsLoading?: boolean;
}

export function SelectField<T extends FieldValues>({
  name,
  control,
  icon: Icon,
  label,
  placeholder,
  error,
  touched: isTouched,
  disabled,
  containerClassName,
  triggerClassName,
  iconClassName,
  children,
  options,
  optionsLoading,
}: SelectFieldProps<T>) {
  const { field } = useController({ name, control });
  const selectItems = options?.map((opt) => ({
    value: opt.id,
    label: opt.name,
  }));

  return (
    <div className={containerClassName}>
      <Label htmlFor={name} className="mb-1.5 block text-xs font-semibold tracking-wide text-[#4A5568] uppercase">
        {label}
      </Label>
      <div className="relative group">
        <Icon
          className={cn(
            'pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-[#898A8D]/60 transition-colors duration-200',
            iconClassName,
            'group-focus-within:text-[#FF4D00]',
          )}
        />
        <Select
          value={field.value ?? ''}
          onValueChange={field.onChange}
          disabled={disabled}
          items={selectItems}
        >
          <SelectTrigger
            id={name}
            className={cn(
              'w-full pl-10 text-sm font-normal transition-all duration-200',
              !field.value && 'text-muted-foreground',
              triggerClassName,
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {optionsLoading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">Cargando...</div>
            ) : options && options.length > 0 ? (
              options.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))
            ) : null}
            {children}
          </SelectContent>
        </Select>
      </div>
      {error && isTouched && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
