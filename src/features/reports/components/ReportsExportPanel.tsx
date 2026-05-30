import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReportsExportPanelProps } from '../interfaces';

export function ReportsExportPanel({
  fileName,
  isPreviewLoading,
  isPreviewError,
  isExporting,
  isQueryEnabled,
  totalActions,
  exportErrorMessage,
  onExportClick,
}: ReportsExportPanelProps) {
  const canExport =
    isQueryEnabled && !isPreviewLoading && !isPreviewError && !isExporting;

  return (
    <Card className="overflow-hidden border-slate-200/90 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0A2240] text-white">
              <FileSpreadsheet className="size-5" />
            </span>
            <div>
              <CardTitle className="text-[#0A2240]">Descargar libro Excel</CardTitle>
              <CardDescription className="mt-0.5 font-mono text-xs">
                {fileName}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <p className="text-sm text-slate-600">
          Un archivo con 5 hojas. Las evidencias se exportan como indicadores Sí/No
          (firma, fotos, cierre, plazo).
        </p>
        {!isPreviewLoading && totalActions === 0 && (
          <p className="text-sm text-amber-800">
            No hay acciones en el periodo y filtros seleccionados; el Excel puede
            incluir solo recorridos, detecciones o resumen.
          </p>
        )}
        {exportErrorMessage && (
          <p className="text-sm text-red-600" role="alert">
            {exportErrorMessage}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t border-slate-100 bg-slate-50/50">
        <Button
          type="button"
          disabled={!canExport}
          onClick={onExportClick}
          className={cn(
            'gap-2 bg-[#0A2240] text-white hover:bg-[#0f3460]',
            !canExport && 'opacity-60',
          )}
        >
          {isExporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          {isExporting ? 'Generando Excel…' : 'Descargar Excel'}
        </Button>
      </CardFooter>
    </Card>
  );
}
