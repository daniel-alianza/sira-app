import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboardSubtextClass } from '@/features/dashboard/components/dashboard-ui.classes';

interface ActionResolutionPhotoUploadProps {
  readonly previewUrl: string | null;
  readonly onChange: (dataUrl: string | null, previewUrl: string | null) => void;
  readonly disabled?: boolean;
  readonly title?: string;
  readonly description?: string;
  readonly previewAlt?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function ActionResolutionPhotoUpload({
  previewUrl,
  onChange,
  disabled = false,
  title = 'Subir foto de resolución',
  description = 'JPG, PNG o WEBP · máx. 5 MB',
  previewAlt = 'Vista previa de foto de resolución',
}: ActionResolutionPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('La imagen no debe superar 5 MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      if (!result) {
        setError('No se pudo leer la imagen');
        return;
      }
      onChange(result, result);
    };
    reader.onerror = () => {
      setError('No se pudo leer la imagen');
    };
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    setError(null);
    onChange(null, null);
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={handleFileSelect}
      />

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <img
            src={previewUrl}
            alt={previewAlt}
            className="aspect-[16/10] w-full object-cover"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            disabled={disabled}
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white/95 shadow-sm"
            aria-label="Quitar foto"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300',
            'bg-white px-4 py-8 text-center transition-colors hover:border-[#00a896]/50 hover:bg-slate-50/80',
            disabled && 'cursor-not-allowed opacity-60',
          )}
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-[#0A2240]/5 text-[#0A2240]">
            <ImagePlus className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#0A2240]">{title}</p>
            <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
              {description}
            </p>
          </div>
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
      {!previewUrl && !error && (
        <p className={cn(dashboardSubtextClass, 'text-xs')}>
          Muestra cómo quedó corregido el hallazgo o el avance de tu acción.
        </p>
      )}
    </div>
  );
}
