import { useRef, useState } from 'react';
import { Camera, ImagePlus, Images, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMdUp } from '@/hooks/use-media-query';
import { dashboardSubtextClass } from '@/features/dashboard/components/dashboard-ui.classes';

interface ActionResolutionPhotoUploadProps {
  readonly previewUrl: string | null;
  readonly onChange: (dataUrl: string | null, previewUrl: string | null) => void;
  readonly disabled?: boolean;
  readonly title?: string;
  readonly description?: string;
  readonly previewAlt?: string;
  readonly helperText?: string | null;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = 'image/png,image/jpeg,image/jpg,image/webp';
const MOBILE_ACCEPTED_IMAGE_TYPES = 'image/*';

const DEFAULT_HELPER_TEXT =
  'Muestra cómo quedó corregido el hallazgo o el avance de tu acción.';

function readImageFile(
  file: File,
  onSuccess: (dataUrl: string) => void,
  onError: (message: string) => void,
): void {
  if (!file.type.startsWith('image/')) {
    onError('Selecciona un archivo de imagen válido');
    return;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    onError('La imagen no debe superar 5 MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const result = typeof reader.result === 'string' ? reader.result : null;
    if (!result) {
      onError('No se pudo leer la imagen');
      return;
    }
    onSuccess(result);
  };
  reader.onerror = () => {
    onError('No se pudo leer la imagen');
  };
  reader.readAsDataURL(file);
}

export function ActionResolutionPhotoUpload({
  previewUrl,
  onChange,
  disabled = false,
  title = 'Subir foto de resolución',
  description = 'JPG, PNG o WEBP · máx. 5 MB',
  previewAlt = 'Vista previa de foto de resolución',
  helperText = DEFAULT_HELPER_TEXT,
}: ActionResolutionPhotoUploadProps) {
  const isMdUp = useIsMdUp();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const useMobilePicker = !isMdUp;

  function applySelectedFile(file: File | undefined) {
    if (!file) {
      return;
    }

    readImageFile(
      file,
      (dataUrl) => {
        setError(null);
        onChange(dataUrl, dataUrl);
      },
      (message) => setError(message),
    );
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    applySelectedFile(file);
  }

  function handleRemove() {
    setError(null);
    onChange(null, null);
  }

  function renderHiddenInputs() {
    if (useMobilePicker) {
      return (
        <>
          <input
            ref={galleryInputRef}
            type="file"
            accept={MOBILE_ACCEPTED_IMAGE_TYPES}
            className="hidden"
            disabled={disabled}
            onChange={handleFileSelect}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept={MOBILE_ACCEPTED_IMAGE_TYPES}
            capture="environment"
            className="hidden"
            disabled={disabled}
            onChange={handleFileSelect}
          />
        </>
      );
    }

    return (
      <input
        ref={desktopInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="hidden"
        disabled={disabled}
        onChange={handleFileSelect}
      />
    );
  }

  function renderMobilePicker() {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#0A2240]/5 text-[#0A2240]">
            <ImagePlus className="size-5" />
          </div>
          <p className="mt-2 text-sm font-medium text-[#0A2240]">{title}</p>
          <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => cameraInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200',
              'bg-white px-3 py-4 text-center shadow-sm transition-colors',
              'hover:border-[#00a896]/40 hover:bg-slate-50/80 active:scale-[0.98]',
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-[#0A2240]/5 text-[#0A2240]">
              <Camera className="size-5" />
            </div>
            <span className="text-sm font-medium text-[#0A2240]">Cámara</span>
            <span className={cn(dashboardSubtextClass, 'text-[10px]')}>
              Tomar foto
            </span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => galleryInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200',
              'bg-white px-3 py-4 text-center shadow-sm transition-colors',
              'hover:border-[#00a896]/40 hover:bg-slate-50/80 active:scale-[0.98]',
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-[#0A2240]/5 text-[#0A2240]">
              <Images className="size-5" />
            </div>
            <span className="text-sm font-medium text-[#0A2240]">Galería</span>
            <span className={cn(dashboardSubtextClass, 'text-[10px]')}>
              Elegir imagen
            </span>
          </button>
        </div>
      </div>
    );
  }

  function renderDesktopPicker() {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => desktopInputRef.current?.click()}
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
    );
  }

  return (
    <div className="space-y-2">
      {renderHiddenInputs()}

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
          {useMobilePicker && (
            <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-[#0A2240]"
              >
                <Camera className="size-3.5" />
                Cambiar (cámara)
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-[#0A2240]"
              >
                <Images className="size-3.5" />
                Cambiar (galería)
              </button>
            </div>
          )}
        </div>
      ) : useMobilePicker ? (
        renderMobilePicker()
      ) : (
        renderDesktopPicker()
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
      {!previewUrl && !error && helperText !== null && (
        <p className={cn(dashboardSubtextClass, 'text-xs')}>{helperText}</p>
      )}
    </div>
  );
}
