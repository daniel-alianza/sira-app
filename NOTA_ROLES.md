# Nota sobre Roles en el Sistema

## Roles disponibles

El sistema actualmente cuenta con **tres roles** definidos:

1. **Administrador** (`ROLE_ADMINISTRATOR`)
   - Acceso completo al sistema
   - Puede gestionar usuarios, áreas, empresas
   - Tiene acceso al dashboard y reportes
   - Puede realizar recorridos y acciones correctivas

2. **Inspector** (`ROLE_INSPECTOR`)
   - Puede acceder al dashboard y reportes (como Administrador)
   - Puede realizar recorridos y gestionar acciones correctivas
   - Puede crear y editar usuarios de tipo Inspector
   - Tiene acceso limitado a ciertas funcionalidades administrativas

3. **Responsable** (`ROLE_RESPONSIBLE`)
   - Rol limitado enfocado en responder a acciones asignadas
   - Puede ver y responder a acciones correctivas asignadas
   - **NO tiene acceso al dashboard ni reportes**
   - Vista principal: `/actions` (lista de acciones)

## Dashboard y roles

El dashboard con las tarjetas de área **solo es accesible** para:
- ✅ Administrador
- ✅ Inspector
- ❌ Responsable (no tiene acceso)

Esto se define en el código:

```typescript
export function canAccessDashboard(roleName?: string): boolean {
  return roleName === ROLE_ADMINISTRATOR || roleName === ROLE_INSPECTOR;
}
```

## Aclaración sobre "Rol de visualizador"

En tu solicitud mencionaste "en la vista del rol de visualizador", pero **no existe un rol de "Visualizador"** en el sistema actual.

Posibles interpretaciones:

1. **Te refieres al rol de "Inspector"**: Este rol puede ver el dashboard y toda la información, pero con permisos limitados de edición comparado con el Administrador.

2. **Quieres crear un nuevo rol "Visualizador"**: Si necesitas crear un nuevo rol con acceso de solo lectura al dashboard, esto requeriría:
   - Agregar el rol en el backend
   - Agregar la constante en `src/features/auth/utils/role-permissions.ts`
   - Actualizar las funciones de permisos para incluir este nuevo rol
   - Decidir qué funcionalidades tendrá acceso

## Funcionalidad implementada

La funcionalidad de **usuarios con estadísticas en tarjetas de área** está disponible para:
- ✅ Administrador
- ✅ Inspector

Los usuarios con estos roles verán:
- Información general de cada área (cumplimiento, tendencia, acciones)
- Lista de usuarios del área
- Estadísticas detalladas de cada usuario (abiertas, pendientes, cerradas, etc.)

## ¿Necesitas crear un rol de Visualizador?

Si necesitas crear un nuevo rol con permisos de solo lectura, por favor especifica:

1. ¿Qué funcionalidades debe poder ver?
   - Dashboard completo
   - Reportes
   - Lista de usuarios
   - Recorridos
   - Acciones correctivas

2. ¿Qué NO debe poder hacer?
   - ¿Crear/editar/eliminar usuarios?
   - ¿Crear recorridos?
   - ¿Asignar acciones?
   - ¿Revisar cierres de acciones?

3. ¿Este rol puede ver información de todas las áreas o solo de su área asignada?

## Ubicación de archivos de roles

Los roles y permisos se gestionan en:
- `src/features/auth/utils/role-permissions.ts` - Definiciones y funciones de permisos
- `src/features/auth/interfaces/auth.interfaces.ts` - Interfaces de sesión
- `src/router/RoleRouteGuard.tsx` - Guards de rutas por rol

---

**Conclusión**: La funcionalidad implementada está disponible para los roles Administrador e Inspector. Si necesitas que esté disponible para otro rol, por favor especifica los requisitos.
