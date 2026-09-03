# SIRA App - Sistema de Inspección y Recorridos de Áreas

Aplicación web para gestión de inspecciones, recorridos y acciones correctivas.

## Tecnologías

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + TanStack Query
- **Routing**: React Router

---

## 🆕 Última Actualización: Usuarios en Tarjetas de Área

Se ha implementado la visualización de usuarios con estadísticas detalladas en las tarjetas de área del dashboard.

### 📚 Documentación de la nueva funcionalidad

| Archivo | Descripción |
|---------|-------------|
| [README_IMPLEMENTACION.md](./README_IMPLEMENTACION.md) | 📖 **EMPEZAR AQUÍ** - Guía visual completa |
| [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md) | 📘 Especificación de API para backend |
| [FEATURE_USUARIOS_EN_AREAS.md](./FEATURE_USUARIOS_EN_AREAS.md) | 📗 Documentación técnica de la funcionalidad |
| [DATOS_EJEMPLO_TESTING.md](./DATOS_EJEMPLO_TESTING.md) | 📕 Datos mock para testing |
| [RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md) | 📊 Resumen ejecutivo del proyecto |
| [NOTA_ROLES.md](./NOTA_ROLES.md) | 📙 Información sobre roles del sistema |

### Vista rápida de la funcionalidad

```
┌──────────────────────────────────────┐
│ Producción                     +5%   │
│ 165 acciones · 0 expiradas           │
│ Cumplimiento: 65%                    │
│                                       │
│ Usuarios (3)                         │
│ ┌──────────────────────────────────┐ │
│ │ 👤 Juan Pérez (30 pendientes)   │ │
│ │ Abiertas: 3     Pendientes: 0   │ │
│ │ Cerradas: 54    Expiradas: 0    │ │
│ │ ...más estadísticas...           │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/daniel-alianza/sira-app.git
cd sira-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
```

---

## 📁 Estructura del Proyecto

```
sira-app/
├── src/
│   ├── api/                 # Configuración de API
│   ├── components/          # Componentes compartidos
│   │   └── ui/             # Componentes UI de shadcn
│   ├── features/           # Features por módulo
│   │   ├── auth/           # Autenticación
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── users/          # Gestión de usuarios
│   │   ├── tours/          # Recorridos
│   │   └── corrective_action/ # Acciones correctivas
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilidades
│   ├── providers/          # Context providers
│   ├── router/             # Configuración de rutas
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos estáticos
└── docs/                   # Documentación (archivos .md en raíz)
```

---

## 👥 Roles del Sistema

El sistema cuenta con tres roles principales:

1. **Administrador**
   - Acceso completo al sistema
   - Gestión de usuarios, empresas y áreas
   - Acceso a dashboard y reportes

2. **Inspector**
   - Acceso a dashboard y reportes
   - Realización de recorridos
   - Gestión de acciones correctivas

3. **Responsable**
   - Vista limitada a acciones asignadas
   - Respuesta a acciones correctivas
   - Sin acceso a dashboard

Ver [NOTA_ROLES.md](./NOTA_ROLES.md) para más detalles.

---

## 🔐 Autenticación

El sistema utiliza autenticación basada en JWT. Las credenciales se configuran en el backend.

---

## 📊 Features Principales

### Dashboard (Administrador/Inspector)
- ✅ KPIs de acciones y cumplimiento
- ✅ Gráficas de tendencias
- ✅ **Tarjetas de área con usuarios** (NUEVO)
- ✅ Solicitudes de cambio de fecha compromiso
- ✅ Colas operacionales
- ✅ Resumen con IA

### Usuarios (Administrador/Inspector)
- ✅ Gestión de usuarios
- ✅ Asignación de roles y áreas
- ✅ Activación/desactivación de cuentas

### Recorridos (Administrador/Inspector)
- ✅ Creación de recorridos
- ✅ Registro de hallazgos
- ✅ Captura de evidencias fotográficas
- ✅ Asignación de responsables

### Acciones Correctivas (Todos los roles)
- ✅ Visualización de acciones asignadas
- ✅ Actualización de estatus
- ✅ Carga de evidencias de resolución
- ✅ Solicitud de cambio de fecha compromiso
- ✅ Firma digital de compromiso

### Reportes (Administrador/Inspector)
- ✅ Exportación a Excel
- ✅ Filtros avanzados
- ✅ Múltiples hojas de reporte

---

## 🛠️ Desarrollo

### Agregar nuevos componentes UI

El proyecto utiliza shadcn/ui. Para agregar componentes:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
# etc.
```

### Convenciones de código

- TypeScript estricto
- Functional components con hooks
- Props como readonly interfaces
- Estilos con Tailwind CSS
- Naming: PascalCase para componentes, camelCase para funciones

### Testing

Actualmente no hay tests configurados. Se recomienda agregar:
- Vitest para unit tests
- Testing Library para component tests
- Playwright para E2E tests

---

## 🔧 Configuración de Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=https://api.ejemplo.com
VITE_APP_ENV=development
```

---

## 📦 Build y Deploy

### Build para producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/`.

### Deploy

El proyecto puede desplegarse en:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Cualquier servidor web estático

---

## 🐛 Troubleshooting

### Error: TypeScript compilation failed

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: Vite build errors

```bash
# Verificar versiones de dependencias
npm outdated
npm update
```

---

## 📝 Commits Recientes

Ver historial completo con:

```bash
git log --oneline -10
```

Últimos cambios importantes:
- ✅ Implementación de usuarios en tarjetas de área
- ✅ Documentación completa de la funcionalidad
- ✅ Mejoras en permisos de usuarios

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📄 Licencia

Este proyecto es propiedad de [Tu Organización]. Todos los derechos reservados.

---

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@ejemplo.com
- Documentación: Ver archivos `.md` en la raíz del proyecto

---

## 🔄 Estado del Proyecto

- ✅ Frontend: Completado
- ⏳ Backend: Pendiente actualización para usuarios en áreas
- ⏳ Testing: Pendiente
- ⏳ Deploy: Pendiente

---

_Última actualización: 3 de septiembre de 2026_
