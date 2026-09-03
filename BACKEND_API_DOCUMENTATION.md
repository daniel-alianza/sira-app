# Documentación de API - Dashboard Areas con Usuarios

## Endpoint: `/dashboard/overview`

### Cambios requeridos en la respuesta

El endpoint `/dashboard/overview` debe incluir información de usuarios por área en la propiedad `areaCompliance`.

### Estructura de datos actualizada

Cada objeto en el array `areaCompliance` ahora debe incluir una propiedad opcional `users` que contiene un array de estadísticas de usuarios del área.

#### Interfaz TypeScript

```typescript
export interface DashboardAreaUserStats {
  readonly userId: string;
  readonly userName: string;
  readonly open: number;
  readonly pending: number;
  readonly pendingAcceptance: number;
  readonly inReview: number;
  readonly expired: number;
  readonly closed: number;
  readonly rejected: number;
  readonly reopened: number;
}

export interface DashboardAreaComplianceItem {
  readonly id: string;
  readonly name: string;
  readonly compliance: number;
  readonly nonCompliance: number;
  readonly actionsTotal: number;
  readonly expired: number;
  readonly trend: string;
  readonly users?: readonly DashboardAreaUserStats[];
}
```

### Ejemplo de respuesta JSON

```json
{
  "data": {
    "areaCompliance": [
      {
        "id": "area-123",
        "name": "Producción",
        "compliance": 65,
        "nonCompliance": 35,
        "actionsTotal": 165,
        "expired": 0,
        "trend": "+5%",
        "users": [
          {
            "userId": "user-1",
            "userName": "Juan Pérez",
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
            "userId": "user-2",
            "userName": "María García",
            "open": 0,
            "pending": 0,
            "pendingAcceptance": 12,
            "inReview": 15,
            "expired": 0,
            "closed": 54,
            "rejected": 0,
            "reopened": 0
          }
        ]
      },
      {
        "id": "area-456",
        "name": "Almacén",
        "compliance": 78,
        "nonCompliance": 22,
        "actionsTotal": 95,
        "expired": 2,
        "trend": "-3%",
        "users": [
          {
            "userId": "user-3",
            "userName": "Carlos López",
            "open": 5,
            "pending": 2,
            "pendingAcceptance": 8,
            "inReview": 10,
            "expired": 2,
            "closed": 45,
            "rejected": 1,
            "reopened": 0
          }
        ]
      }
    ]
  }
}
```

### Descripción de campos de usuario

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `userId` | string | Identificador único del usuario |
| `userName` | string | Nombre completo del usuario |
| `open` | number | Cantidad de acciones abiertas (Open) |
| `pending` | number | Cantidad de acciones pendientes (Pending) |
| `pendingAcceptance` | number | Cantidad de acciones pendientes de aceptación |
| `inReview` | number | Cantidad de acciones en revisión |
| `expired` | number | Cantidad de acciones expiradas |
| `closed` | number | Cantidad de acciones cerradas |
| `rejected` | number | Cantidad de acciones rechazadas |
| `reopened` | number | Cantidad de acciones reabiertas |

### Notas para el backend

1. La propiedad `users` es **opcional**. Si no se proporciona, el frontend no mostrará la sección de usuarios.
2. Los usuarios deben ser filtrados por área - solo incluir usuarios que pertenezcan al área correspondiente.
3. Las estadísticas de cada usuario deben calcularse en base a todas las acciones asignadas a ese usuario dentro del área.
4. El conteo total de pendientes se calcula como: `open + pending + pendingAcceptance + inReview + expired + reopened`
5. Se debe respetar los filtros aplicados en el dashboard (empresa, área, responsable, fechas, etc.)
6. Los usuarios sin acciones en el periodo filtrado pueden ser omitidos del array.

### Consulta SQL de ejemplo (pseudocódigo)

```sql
SELECT 
  u.id as userId,
  CONCAT(u.first_name, ' ', u.last_name) as userName,
  COUNT(CASE WHEN a.status = 'open' THEN 1 END) as open,
  COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN a.status = 'pending_acceptance' THEN 1 END) as pendingAcceptance,
  COUNT(CASE WHEN a.status = 'closure_review' THEN 1 END) as inReview,
  COUNT(CASE WHEN a.status = 'expired' THEN 1 END) as expired,
  COUNT(CASE WHEN a.status = 'closed' THEN 1 END) as closed,
  COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) as rejected,
  COUNT(CASE WHEN a.status = 'reopened' THEN 1 END) as reopened
FROM users u
LEFT JOIN actions a ON a.responsible_id = u.id
WHERE u.area_id = ?
  AND a.created_at BETWEEN ? AND ?
  -- Aplicar otros filtros del dashboard
GROUP BY u.id, u.first_name, u.last_name
HAVING COUNT(a.id) > 0
ORDER BY userName ASC;
```

### Visualización en el frontend

En el frontend, cada tarjeta de área mostrará:
1. Información general del área (cumplimiento, acciones totales, expiradas)
2. Una sección expandible de "Usuarios" con el conteo de usuarios
3. Para cada usuario:
   - Nombre del usuario
   - Total de pendientes en paréntesis (si > 0)
   - Desglose de todas las estadísticas en una cuadrícula de 2 columnas

Los usuarios con acciones expiradas, rechazadas o reabiertas tendrán esos contadores resaltados en color naranja o rojo según corresponda.
