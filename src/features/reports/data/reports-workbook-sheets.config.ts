import type { LucideIcon } from 'lucide-react';
import {
  CalendarClock,
  ClipboardList,
  FileSpreadsheet,
  LayoutList,
  Route,
} from 'lucide-react';

export interface ReportsWorkbookSheet {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly highlights: readonly string[];
}

export const reportsWorkbookSheets: readonly ReportsWorkbookSheet[] = [
  {
    id: 'actions',
    name: 'Acciones',
    description:
      'Maestro de acciones correctivas con fechas, estatus y banderas de cumplimiento.',
    icon: ClipboardList,
    highlights: [
      'Evidencia inicial (Sí/No)',
      'Firmó de enterado (Sí/No)',
      'Foto de resolución (Sí/No)',
      'Cierre validado (Sí/No)',
      'Dentro de plazo / Expirado',
    ],
  },
  {
    id: 'commitments',
    name: 'Fechas compromiso',
    description: 'Historial F0, F1, F2 y F3 por acción con motivos de cambio.',
    icon: CalendarClock,
    highlights: [
      'Fecha y usuario por reprogramación',
      'Motivo del cambio',
      'Rechazo de cierre (si aplica)',
    ],
  },
  {
    id: 'walkthroughs',
    name: 'Recorridos',
    description: 'Resumen de recorridos realizados en el periodo filtrado.',
    icon: Route,
    highlights: [
      'Recorrido finalizado (Sí/No)',
      'Tiene detecciones (Sí/No)',
      'Cantidad de hallazgos',
    ],
  },
  {
    id: 'detections',
    name: 'Detecciones',
    description: 'Hallazgos detectados durante los recorridos.',
    icon: LayoutList,
    highlights: [
      'Evidencia inicial (Sí/No)',
      'Generó acción correctiva (Sí/No)',
      'Tipo y área',
    ],
  },
  {
    id: 'summary',
    name: 'Resumen',
    description: 'Indicadores del periodo: totales, cumplimiento y colas operativas.',
    icon: FileSpreadsheet,
    highlights: [
      'Acciones por estatus',
      'Cumplimiento por área',
      'Colas: sin firma, en revisión, vencidas',
    ],
  },
];

export const REPORTS_EXPORT_FILENAME_PREFIX = 'SIRA_Reportes';
