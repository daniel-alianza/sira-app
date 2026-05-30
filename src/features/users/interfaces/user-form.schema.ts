import { z } from 'zod';

export const userFormSchema = z
  .object({
    mode: z.enum(['create', 'edit']),
    name: z.string().min(1, 'El nombre es obligatorio'),
    email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
    password: z.string(),
    isActive: z.boolean(),
    companyId: z.string().min(1, 'La compañía es obligatoria'),
    areaId: z.string().min(1, 'El área es obligatoria'),
    branchId: z.string().min(1, 'La sucursal es obligatoria'),
    roleId: z.string().min(1, 'El rol es obligatorio'),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'create' && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'La contraseña es obligatoria',
      });
    }
  });

export type UserFormValues = z.infer<typeof userFormSchema>;
