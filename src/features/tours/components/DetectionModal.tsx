import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, CheckCircle2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ActionResolutionPhotoUpload } from '@/features/corrective_action/components/ActionResolutionPhotoUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  dashboardButtonPrimary,
  dashboardCard,
  dashboardHeadingClass,
  dashboardInput,
  dashboardSubtextClass,
} from '@/features/dashboard/components/dashboard-ui.classes';
import {
  DETECTION_TYPE_SELECT_OPTIONS,
  tourDetectionFormSchema,
  type DetectionModalProps,
  type TourDetectionFormValues,
} from '../interfaces';
import { toCatalogSelectOptions } from '@/features/users/utils/catalog-select-options';
import { CatalogLocationFields } from './CatalogLocationFields';

const emptyDetectionValues: TourDetectionFormValues = {
  companyId: '',
  branchId: '',
  areaId: '',
  detectionType: 'unsafe_condition',
  description: '',
  responsibleId: '',
  evidencePhotoDataUrl: undefined,
};

export function DetectionModal({
  open,
  tourFolio,
  detectionCount,
  catalog,
  isCatalogLoading,
  allUsers,
  isAllUsersLoading,
  isAllUsersError,
  onClose,
  onSubmit,
}: DetectionModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [lastSavedFolio, setLastSavedFolio] = useState<string | null>(null);
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TourDetectionFormValues>({
    resolver: zodResolver(tourDetectionFormSchema),
    defaultValues: emptyDetectionValues,
  });

  const companyId = watch('companyId');
  const branchId = watch('branchId');
  const areaId = watch('areaId');
  const responsibleId = watch('responsibleId');

  const filteredResponsibleOptions = useMemo(() => {
    if (!companyId || !branchId || !areaId) return [];
    return toCatalogSelectOptions(
      allUsers
        .filter(
          (u) =>
            u.companyId === companyId &&
            u.branchId === branchId &&
            u.areaId === areaId,
        )
        .map((u) => ({ id: u.id, name: u.name })),
    );
  }, [allUsers, companyId, branchId, areaId]);

  useEffect(() => {
    if (open) {
      reset(emptyDetectionValues);
      setLastSavedFolio(null);
      setEvidencePreviewUrl(null);
    }
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleFormSubmit = useCallback(
    (values: TourDetectionFormValues) => {
      const savedFolio = onSubmit(values);
      setLastSavedFolio(savedFolio);
      reset(emptyDetectionValues);
      setEvidencePreviewUrl(null);
    },
    [onSubmit, reset],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2240]/40 p-4 backdrop-blur-[2px]"
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          dashboardCard('relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden p-0'),
          'animate-in fade-in-0 slide-in-from-bottom-4 zoom-in-95 duration-200',
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-slate-50/80 px-6 py-4">
          <div>
            <h2 className={cn(dashboardHeadingClass, 'text-lg')}>Nueva detección</h2>
            <p className={cn(dashboardSubtextClass, 'mt-0.5 text-xs')}>
              Recorrido {tourFolio} · {detectionCount}{' '}
              {detectionCount === 1 ? 'detección registrada' : 'detecciones registradas'}
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Cerrar">
            <X className="size-4" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {lastSavedFolio && (
              <div className="flex items-center gap-2 rounded-lg border border-[#00C4B3]/30 bg-[#00C4B3]/10 px-3 py-2 text-sm text-[#007a70]">
                <CheckCircle2 className="size-4 shrink-0" />
                Detección {lastSavedFolio} registrada. Puedes agregar otra con distinta ubicación.
              </div>
            )}

            {isCatalogLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" />
                Cargando catálogo de empresas, sucursales y áreas…
              </div>
            )}

            {!isCatalogLoading && !catalog && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="size-4 shrink-0" />
                No se pudo cargar el catálogo. Intenta de nuevo más tarde.
              </div>
            )}

            {catalog && (
              <CatalogLocationFields
                companyId={companyId}
                branchId={branchId}
                areaId={areaId}
                catalog={catalog}
                companyError={errors.companyId?.message}
                branchError={errors.branchId?.message}
                areaError={errors.areaId?.message}
                onCompanyChange={(value) => setValue('companyId', value, { shouldValidate: true })}
                onBranchChange={(value) => setValue('branchId', value, { shouldValidate: true })}
                onAreaChange={(value) => setValue('areaId', value, { shouldValidate: true })}
                responsibleId={responsibleId}
                responsibleOptions={filteredResponsibleOptions}
                onResponsibleChange={(value) =>
                  setValue('responsibleId', value, { shouldValidate: true })
                }
              />
            )}

            <div className="space-y-1.5">
              <Label htmlFor="detectionType">Tipo de detección</Label>
              <Controller
                name="detectionType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    items={[...DETECTION_TYPE_SELECT_OPTIONS]}
                    onValueChange={(value) =>
                      field.onChange(value ?? 'unsafe_condition')
                    }
                  >
                    <SelectTrigger id="detectionType" className="w-full">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {DETECTION_TYPE_SELECT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.detectionType && (
                <p className="text-xs text-destructive">{errors.detectionType.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descripción del hallazgo</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe el acto o condición insegura detectada"
                className={cn(dashboardInput(), 'h-auto min-h-[88px] resize-y py-2')}
                {...register('description')}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Foto de evidencia</Label>
              <ActionResolutionPhotoUpload
                title="Subir foto de evidencia"
                description="JPG, PNG o WEBP · máx. 5 MB · opcional"
                previewAlt="Vista previa de evidencia del inspector"
                helperText={null}
                previewUrl={evidencePreviewUrl}
                onChange={(dataUrl, previewUrl) => {
                  setValue('evidencePhotoDataUrl', dataUrl ?? undefined, {
                    shouldValidate: true,
                  });
                  setEvidencePreviewUrl(previewUrl);
                }}
              />
            </div>

          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-slate-200/90 bg-slate-50/50 px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cerrar
            </Button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                isCatalogLoading ||
                isAllUsersLoading ||
                isAllUsersError ||
                !catalog
              }
              className={cn(dashboardButtonPrimary(), 'disabled:opacity-50')}
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Registrar y agregar otra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
