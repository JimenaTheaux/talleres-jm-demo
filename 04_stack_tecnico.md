# 04 — Stack Técnico y Arquitectura

## Decisiones tecnológicas

### Frontend
| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | React 18 + Vite + TypeScript | Velocidad de desarrollo, ecosistema, tipado |
| Tipo de app | PWA | Instalable en iOS/Android/Desktop sin app store |
| Estilos | Tailwind CSS | Rapidez, consistencia, mobile-first nativo |
| Componentes UI | shadcn/ui | Headless, accesible, sobre Tailwind |
| Routing | React Router v6 | Estándar, protección de rutas por rol |
| Estado global | Zustand | Simple, sin boilerplate |
| Formularios | React Hook Form + Zod | Validación robusta, DX excelente |
| Gráficos | Recharts | Liviano, fácil de customizar con Tailwind |
| Fechas | date-fns | Ligero, funcional, sin side effects |

### Backend / Base de datos
- **Supabase** (PostgreSQL, Auth, Storage)
  - Sin servidor propio
  - Auth integrado con roles vía `user_metadata`
  - SDK React maduro
  - Plan gratuito suficiente para el MVP
  - PostgreSQL real, migrable a futuro

### Autenticación
- Supabase Auth con email + password
- Rol almacenado en `user_metadata` del JWT
- Tabla `perfiles` vinculada a `auth.users`
- Sin RLS en MVP — se agrega en fase de hardening post-MVP

---

## Arquitectura general

```
┌─────────────────────────────────────────────┐
│              CLIENTE (PWA)                  │
│                                             │
│  React + Vite + TypeScript                  │
│  ┌─────────────┐  ┌────────────────────┐   │
│  │  Admin UI   │  │   Profesor UI      │   │
│  └──────┬──────┘  └────────┬───────────┘   │
│         │                  │               │
│  ┌──────▼──────────────────▼───────────┐   │
│  │        Supabase Client SDK          │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ HTTPS
┌─────────────────▼───────────────────────────┐
│                SUPABASE                     │
│  ┌────────────┐ ┌──────────┐ ┌──────────┐  │
│  │ PostgreSQL │ │   Auth   │ │ Storage  │  │
│  └────────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────┘
```

---

## Estructura de carpetas

```
talleres-jm-app/
├── public/
│   ├── manifest.json          # Config PWA
│   ├── icons/                 # Íconos Talleres JM (192x192, 512x512)
│   └── logo.png               # Logo del club
│
├── src/
│   ├── assets/                # Imágenes estáticas
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui generados
│   │   ├── common/            # Layout, Sidebar, Topbar, ProtectedRoute
│   │   ├── alumnos/           # Componentes del módulo alumnos
│   │   ├── pagos/             # Componentes del módulo pagos
│   │   ├── egresos/           # Componentes del módulo egresos
│   │   ├── asistencia/        # Componentes asistencia profes
│   │   ├── ventas/            # Componentes ventas productos
│   │   └── dashboard/         # Componentes KPIs y gráficos
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AlumnosPage.tsx
│   │   ├── PagosPage.tsx
│   │   ├── EgresosPage.tsx
│   │   ├── AsistenciaPage.tsx
│   │   ├── VentasPage.tsx
│   │   ├── ConfiguracionPage.tsx
│   │   └── MisHorasPage.tsx   # Vista exclusiva del profesor
│   │
│   ├── hooks/
│   │   ├── useAuth.ts         # Sesión y rol del usuario
│   │   ├── useAlumnos.ts
│   │   ├── usePagos.ts
│   │   ├── useEgresos.ts
│   │   ├── useAsistencia.ts
│   │   ├── useVentas.ts
│   │   └── useConfig.ts
│   │
│   ├── store/
│   │   └── authStore.ts       # Zustand: usuario autenticado y rol
│   │
│   ├── lib/
│   │   ├── supabase.ts        # Cliente Supabase configurado
│   │   ├── utils.ts           # Helpers (formatCurrency, formatPeriodo, etc.)
│   │   └── constants.ts       # Enums, listas fijas (formas de pago, categorías, etc.)
│   │
│   ├── services/              # Funciones de acceso a datos por entidad
│   │   ├── alumnos.service.ts
│   │   ├── pagos.service.ts
│   │   ├── egresos.service.ts
│   │   ├── asistencia.service.ts
│   │   ├── ventas.service.ts
│   │   └── config.service.ts
│   │
│   ├── types/
│   │   ├── supabase.ts        # Tipos generados por Supabase CLI
│   │   └── app.types.ts       # Tipos de la app (enums, interfaces)
│   │
│   ├── App.tsx                # Router principal
│   └── main.tsx               # Entry point + BrowserRouter
│
├── .env.local                 # Variables de entorno (no commitear)
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Variables de entorno

```env
VITE_SUPABASE_URL=https://[tu-proyecto].supabase.co
VITE_SUPABASE_ANON_KEY=[tu-anon-key]
```

---

## Dependencias principales

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "react-router-dom": "^6",
    "@supabase/supabase-js": "^2",
    "zustand": "^4",
    "react-hook-form": "^7",
    "zod": "^3",
    "recharts": "^2",
    "date-fns": "^3",
    "tailwindcss": "^3",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "lucide-react": "^0.400"
  },
  "devDependencies": {
    "vite": "^5",
    "vite-plugin-pwa": "^0.19",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}
```

---

## Configuración PWA

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Talleres JM',
    short_name: 'Talleres JM',
    theme_color: '#05173B',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  }
})
```

---

## Notas de compatibilidad PWA

### iOS (Safari)
- Instalar desde Safari → "Agregar a pantalla de inicio"
- `display: standalone` hace que se vea como app nativa
- La sesión de Supabase Auth persiste entre sesiones en iOS Safari

### Android (Chrome)
- Banner automático de instalación de PWA
- Funciona igual que iOS una vez instalada

### Desktop
- Chrome/Edge soportan instalación de PWA
- Layout adapta sidebar visible en desktop (≥ 1024px)
