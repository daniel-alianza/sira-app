import { z } from 'zod';

export const tourDetectionFormSchema = z.object({
  companyId: z.string().min(1, 'Selecciona una empresa'),
  branchId: z.string().min(1, 'Selecciona una sucursal'),
  areaId: z.string().min(1, 'Selecciona un área'),
  detectionType: z.enum(['unsafe_act', 'unsafe_condition'], {
    message: 'Selecciona el tipo de detección',
  }),
  description: z.string().min(5, 'Describe el hallazgo (mín. 5 caracteres)'),
  responsibleId: z.string().min(1, 'Selecciona un responsable'),
  evidencePhotoDataUrl: z.string().optional(),
});

export type TourDetectionFormValues = z.infer<typeof tourDetectionFormSchema>;
