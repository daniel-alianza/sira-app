# Funcionalidad: Usuarios con Estadísticas en Tarjetas de Área

## Descripción

Se ha implementado una nueva funcionalidad que permite visualizar los usuarios de cada área junto con sus estadísticas detalladas de acciones en las tarjetas del dashboard "Avance por área".

## Cambios implementados en el frontend

### 1. Interfaces actualizadas

Se agregó una nueva interfaz `DashboardAreaUserStats` que contiene las estadísticas de cada usuario:

```typescript
export interface DashboardAreaUserStats {
  readonly userId: string;
  readonly userName: string;
  readonly open: number;            // Abiertas
  readonly pending: number;         // Pendientes
  readonly pendingAcceptance: number; // Pendientes de aceptación
  readonly inReview: number;        // En revisión
  readonly expired: number;         // Expiradas
  readonly closed: number;          // Cerradas
  readonly rejected: number;        // Rechazadas
  readonly reopened: number;        // Reabiertas
}
```

La interfaz `DashboardAreaComplianceItem` ahora incluye un campo opcional `users`:

```typescript
export interface DashboardAreaComplianceItem {
  // ... campos existentes
  readonly users?: readonly DashboardAreaUserStats[];
}
```

### 2. Componente actualizado

El componente `DashboardAreaComplianceCards` ahora:

- **Muestra el título "Avance por área"** en lugar de "Cumplimiento por área recorrida"
- **Renderiza una sección de usuarios** cuando la propiedad `users` está presente
- **Muestra el conteo de usuarios**: "Usuarios (N)"
- **Lista cada usuario** en una tarjeta individual con:
  - Icono de usuario
  - Nombre del usuario
  - Total de pendientes en paréntesis si > 0 (ej: "Juan Pérez (15 pendientes)")
  - Desglose completo de estadísticas en una cuadrícula de 2 columnas

### 3. Características visuales

- **Colores diferenciados**:
  - Verde: acciones cerradas
  - Naranja: acciones expiradas y reabiertas
  - Rojo: acciones rechazadas
  - Negro: otros estatus
  
- **Scroll automático**: Si la lista de usuarios excede 400px de altura, se activa scroll vertical

- **Diseño responsivo**: Se adapta a diferentes tamaños de pantalla

## Uso

### Para usuarios del dashboard (Administrador/Inspector)

1. Accede al dashboard principal
2. Desplázate hasta la sección "Avance por área"
3. Cada tarjeta de área ahora mostrará:
   - Información general del área (cumplimiento, tendencia, etc.)
   - Sección de "Usuarios" con el listado de usuarios del área
   - Para cada usuario: nombre y todas sus estadísticas

### Vista ejemplo

```
┌─────────────────────────────────────────┐
│ Producción                        +5%   │
│ 165 acciones · 0 expiradas             │
│                                         │
│ Cumplimiento: 65%  No cumpl.: 35%      │
│ [████████████░░░░░░░] 65%              │
│                                         │
│ ✓ Cerradas a tiempo  ✗ Incumplidas     │
│                                         │
│ Usuarios (2)                            │
│ ┌───────────────────────────────────┐  │
│ │ 👤 Juan Pérez (15 pendientes)     │  │
│ │ Abiertas: 3        Pendientes: 0  │  │
│ │ Pend. aceptación: 12  En rev.: 15 │  │
│ │ Expiradas: 0       Cerradas: 54   │  │
│ │ Rechazadas: 0      Reabiertas: 0  │  │
│ └───────────────────────────────────┘  │
│ ┌───────────────────────────────────┐  │
│ │ 👤 María García (27 pendientes)   │  │
│ │ Abiertas: 0        Pendientes: 0  │  │
│ │ Pend. aceptación: 12  En rev.: 15 │  │
│ │ Expiradas: 0       Cerradas: 54   │  │
│ │ Rechazadas: 0      Reabiertas: 0  │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Pendientes del backend

⚠️ **IMPORTANTE**: El backend debe actualizarse para incluir la información de usuarios en el endpoint `/dashboard/overview`.

Ver el archivo `BACKEND_API_DOCUMENTATION.md` para detalles completos sobre:
- Estructura de datos requerida
- Ejemplo de respuesta JSON
- Consulta SQL de ejemplo
- Filtros y consideraciones

### Resumen de cambios requeridos en el backend

1. Modificar el endpoint `/dashboard/overview`
2. Para cada área en `areaCompliance`, agregar un array opcional `users`
3. Cada usuario debe incluir:
   - `userId`: ID único del usuario
   - `userName`: Nombre completo
   - Contadores para cada tipo de acción (open, pending, pendingAcceptance, etc.)
4. Filtrar usuarios por área y respetar los filtros del dashboard

## Compatibilidad

- ✅ La funcionalidad es **retrocompatible**
- ✅ Si el backend no envía `users`, el componente funciona como antes
- ✅ No requiere cambios en otros componentes
- ✅ TypeScript verifica la correcta estructura de datos

## Archivos modificados

1. `src/features/dashboard/interfaces/dashboard.interfaces.ts`
   - Agregada interfaz `DashboardAreaUserStats`
   - Actualizada interfaz `DashboardAreaComplianceItem`

2. `src/features/dashboard/interfaces/index.ts`
   - Exportada la nueva interfaz `DashboardAreaUserStats`

3. `src/features/dashboard/components/DashboardAreaComplianceCards.tsx`
   - Agregado componente `UserStatsRow`
   - Actualizado componente principal para mostrar usuarios
   - Cambiado título de sección
   - Cambiado elemento de `<button>` a `<div>` para las tarjetas

4. `BACKEND_API_DOCUMENTATION.md` (nuevo)
   - Documentación completa para el backend

## Testing

Para probar la funcionalidad:

1. **Sin datos de usuarios** (comportamiento actual):
   - El dashboard debe funcionar como antes
   - No se muestra la sección de usuarios

2. **Con datos de usuarios** (cuando el backend esté actualizado):
   - Verificar que se muestre la lista de usuarios
   - Verificar que los colores se apliquen correctamente
   - Verificar que el conteo de pendientes sea correcto
   - Verificar el scroll en listas largas de usuarios

## Próximos pasos

1. ✅ Frontend implementado y testeado
2. ⏳ Backend debe implementar los cambios descritos en `BACKEND_API_DOCUMENTATION.md`
3. ⏳ Testing integrado frontend + backend
4. ⏳ Validación con usuarios finales

## Soporte

Para preguntas o problemas relacionados con esta implementación, contactar al equipo de desarrollo.
