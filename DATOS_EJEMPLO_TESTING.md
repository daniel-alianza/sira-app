# Datos de Ejemplo para Testing

Este archivo contiene datos de prueba (mock) que pueden usarse para probar la funcionalidad de usuarios en áreas.

## Formato JSON para el backend

El backend debe devolver datos en este formato en el endpoint `/dashboard/overview`:

```json
{
  "data": {
    "period": {
      "from": "2024-01-01",
      "to": "2024-01-31"
    },
    "firstWalkthroughDate": "2024-01-01",
    "filterOptions": {
      "companies": [],
      "areas": [],
      "responsibles": []
    },
    "kpis": {
      "totalActions": 350,
      "openActions": 45,
      "closedActions": 270,
      "pendingAcceptance": 60,
      "expiredActions": 5,
      "closureReview": 50,
      "rejectedClosures": 3,
      "walkthroughsPeriod": 25,
      "avgClosureDays": 7,
      "notRespondedUsers": 2,
      "notSignedUsers": 1
    },
    "openActions": [],
    "commitmentDateRequests": [],
    "operationalQueues": {
      "pendingSignature": [],
      "closureReview": [],
      "expiredActions": []
    },
    "charts": {
      "actionsTrend": [],
      "complianceByArea": [],
      "statusDistribution": [],
      "upcomingDue": []
    },
    "areaCompliance": [
      {
        "id": "area-produccion-123",
        "name": "Producción",
        "compliance": 65,
        "nonCompliance": 35,
        "actionsTotal": 165,
        "expired": 0,
        "trend": "+5%",
        "users": [
          {
            "userId": "user-001",
            "userName": "Juan Pérez Martínez",
            "open": 3,
            "pending": 0,
            "pendingAcceptance": 12,
            "inReview": 15,
            "expired": 0,
            "closed": 54,
            "rejected": 0,
            "reopened": 0
          },
          {
            "userId": "user-002",
            "userName": "María García López",
            "open": 0,
            "pending": 0,
            "pendingAcceptance": 12,
            "inReview": 15,
            "expired": 0,
            "closed": 54,
            "rejected": 0,
            "reopened": 0
          },
          {
            "userId": "user-003",
            "userName": "Pedro Sánchez Ruiz",
            "open": 2,
            "pending": 1,
            "pendingAcceptance": 8,
            "inReview": 10,
            "expired": 1,
            "closed": 35,
            "rejected": 1,
            "reopened": 0
          }
        ]
      },
      {
        "id": "area-almacen-456",
        "name": "Almacén",
        "compliance": 78,
        "nonCompliance": 22,
        "actionsTotal": 95,
        "expired": 2,
        "trend": "-3%",
        "users": [
          {
            "userId": "user-004",
            "userName": "Carlos López Fernández",
            "open": 5,
            "pending": 2,
            "pendingAcceptance": 8,
            "inReview": 10,
            "expired": 2,
            "closed": 45,
            "rejected": 1,
            "reopened": 0
          },
          {
            "userId": "user-005",
            "userName": "Ana Martínez González",
            "open": 1,
            "pending": 0,
            "pendingAcceptance": 4,
            "inReview": 5,
            "expired": 0,
            "closed": 33,
            "rejected": 0,
            "reopened": 0
          }
        ]
      },
      {
        "id": "area-calidad-789",
        "name": "Calidad",
        "compliance": 92,
        "nonCompliance": 8,
        "actionsTotal": 55,
        "expired": 0,
        "trend": "+12%",
        "users": [
          {
            "userId": "user-006",
            "userName": "Laura Rodríguez Díaz",
            "open": 0,
            "pending": 0,
            "pendingAcceptance": 2,
            "inReview": 3,
            "expired": 0,
            "closed": 28,
            "rejected": 0,
            "reopened": 0
          },
          {
            "userId": "user-007",
            "userName": "Roberto Jiménez Castro",
            "open": 1,
            "pending": 0,
            "pendingAcceptance": 1,
            "inReview": 2,
            "expired": 0,
            "closed": 22,
            "rejected": 0,
            "reopened": 0
          }
        ]
      },
      {
        "id": "area-seguridad-101",
        "name": "Seguridad e Higiene",
        "compliance": 88,
        "nonCompliance": 12,
        "actionsTotal": 35,
        "expired": 1,
        "trend": "+8%",
        "users": [
          {
            "userId": "user-008",
            "userName": "Elena Torres Morales",
            "open": 2,
            "pending": 1,
            "pendingAcceptance": 3,
            "inReview": 4,
            "expired": 1,
            "closed": 18,
            "rejected": 0,
            "reopened": 1
          }
        ]
      }
    ]
  },
  "message": "Dashboard overview retrieved successfully",
  "error": null
}
```

## Casos de prueba

### 1. Área con múltiples usuarios
**Área**: Producción
- 3 usuarios con diferentes niveles de actividad
- Total de 165 acciones
- Compliance de 65%

### 2. Área con usuarios con acciones expiradas
**Área**: Almacén
- Usuario "Carlos López" tiene 2 acciones expiradas
- Debe mostrarse en color naranja en la UI

### 3. Área con alta compliance
**Área**: Calidad
- 92% de cumplimiento
- Usuarios con pocas acciones pendientes
- Sin acciones expiradas

### 4. Área con un solo usuario
**Área**: Seguridad e Higiene
- 1 usuario
- Tiene acciones expiradas y reabiertas
- Debe mostrar correctamente aunque sea un solo usuario

### 5. Área sin usuarios (comportamiento retrocompatible)
Para probar que el componente funciona sin datos de usuarios, simplemente omitir la propiedad `users`:

```json
{
  "id": "area-mantenimiento-999",
  "name": "Mantenimiento",
  "compliance": 70,
  "nonCompliance": 30,
  "actionsTotal": 45,
  "expired": 3,
  "trend": "—"
}
```

## Cómo usar estos datos para testing

### Opción 1: Mock en el frontend (para desarrollo)

Crear un archivo `src/features/dashboard/data/dashboard.mock.ts`:

```typescript
import type { DashboardOverview } from '../interfaces';

export const mockDashboardOverview: DashboardOverview = {
  // Copiar el JSON de arriba aquí
};
```

Luego, temporalmente modificar el servicio para devolver datos mock:

```typescript
export async function fetchDashboardOverview(
  params: DashboardQueryParams,
): Promise<DashboardOverview> {
  // Para testing, descomentar la siguiente línea:
  // return mockDashboardOverview;
  
  try {
    const { data } = await siraApi.get<ApiResponse<DashboardOverview>>(
      '/dashboard/overview',
      { params },
    );
    return data.data;
  } catch (error) {
    // ...
  }
}
```

### Opción 2: Usar el backend real

Una vez que el backend implemente los cambios descritos en `BACKEND_API_DOCUMENTATION.md`, los datos reales deben aparecer automáticamente.

## Validación visual esperada

Al cargar el dashboard con estos datos mock, deberías ver:

1. **Tarjeta de Producción**:
   - Título: "Producción" con "+5%" en verde
   - "165 acciones · 0 expiradas"
   - Compliance: 65%
   - Sección "Usuarios (3)"
   - Juan Pérez con "(30 pendientes)" en naranja
   - María García con "(27 pendientes)" en naranja
   - Pedro Sánchez con "(22 pendientes)" en naranja, con expiradas en naranja y rechazadas en rojo

2. **Tarjeta de Almacén**:
   - Título: "Almacén" con "-3%" en naranja
   - "95 acciones · 2 expiradas"
   - Compliance: 78%
   - Sección "Usuarios (2)"
   - Carlos López con expiradas en naranja
   - Ana Martínez con menos pendientes

3. **Tarjeta de Calidad**:
   - Título: "Calidad" con "+12%" en verde
   - "55 acciones · 0 expiradas"
   - Compliance: 92%
   - Sección "Usuarios (2)"
   - Ambos usuarios con pocas pendientes

4. **Tarjeta de Seguridad**:
   - Título: "Seguridad e Higiene" con "+8%" en verde
   - "35 acciones · 1 expirada"
   - Compliance: 88%
   - Sección "Usuarios (1)"
   - Elena Torres con expiradas y reabiertas en naranja

## Checklist de testing

- [ ] Las tarjetas se muestran correctamente
- [ ] El conteo de usuarios es correcto
- [ ] Los nombres de usuarios se muestran completos
- [ ] El total de pendientes se calcula correctamente
- [ ] Los colores se aplican correctamente:
  - [ ] Verde para cerradas
  - [ ] Naranja para expiradas/reabiertas
  - [ ] Rojo para rechazadas
- [ ] El scroll funciona cuando hay muchos usuarios
- [ ] Las tarjetas sin datos de usuarios funcionan correctamente (retrocompatibilidad)
- [ ] El diseño es responsivo en móvil, tablet y desktop

## Notas adicionales

- Los datos de ejemplo representan un mes de operaciones (enero 2024)
- Los nombres son ficticios para propósitos de testing
- Las estadísticas están balanceadas para mostrar diferentes escenarios
- Se incluyen casos extremos (0 pendientes, muchas expiradas, etc.)
