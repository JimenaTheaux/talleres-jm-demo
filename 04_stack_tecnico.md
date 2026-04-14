# 04 — Stack Técnico y Arquitectura

## Decisiones tecnológicas

### Frontend
| Capa | Tecnología | Versión | Por qué |
|---|---|---|---|
| Framework | React + Vite + TypeScript | React 18, Vite 6 | Velocidad de desarrollo, ecosistema, tipado |
| Tipo de app | PWA | — | Instalable en iOS/Android/Desktop sin app store |
| Estilos | Tailwind CSS | v4 | Rapidez, consistencia, mobile-first nativo |
| Componentes UI | shadcn/ui | — | Headless, accesible, sobre Tailwind |
| Routing | React Router | v6 | Estándar, protección de rutas por rol |
| Estado global | Zustand | v4 | Simple, sin boilerplate, atomic setAuth |
| Formularios | React Hook Form + Zod | v7 + v3 | Validación robusta, DX excelente |
| Server state | TanStack Query | v5 | Cache, staleTime, retry, refetchOnReconnect |
| Gráficos | Recharts | v2 | Liviano, fácil de customizar con Tailwind |
| Fechas | date-fns | v3 | Ligero, funcional, sin side effects |
| Iconos | lucide-react | latest | Consistente, tree-shakeable |

### Backend / Base de datos
- **Supabase** (PostgreSQL, Auth, Storage)
  - Sin servidor propio
  - Auth integrado con roles vía tabla `perfiles`
  - SDK React maduro (`@supabase/supabase-js` v2)
  - Plan gratuito suficiente para el MVP
  - PostgreSQL real, migrable a futuro

### Deploy
- **Vercel** — auto-deploy desde rama `main`
- Variables de entorno configuradas en Vercel dashboard
- `vercel.json` para SPA routing (rewrites `/* → /index.html`)

### Autenticación
- Supabase Auth con email + password
- Rol almacenado en tabla `perfiles` (no en JWT metadata)
- **CRÍTICO:** usar SOLO `onAuthStateChange` — nunca `getSession()` (devuelve tokens expirados)
- `setTimeout(0)` defer en callback para evitar deadlock con mutex de Supabase
- AbortController con timeout de 6s en `fetchPerfil`
- Timeout global de seguridad de 10s para forzar `loading: false`
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
│  │     TanStack Query + Supabase SDK   │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ HTTPS
┌─────────────────▼───────────────────────────┐
│                SUPABASE                     │
│  ┌────────────┐ ┌──────────┐ ┌──────────┐  │
│  │ PostgreSQL │ │   Auth   │ │ Storage  │  │
│  └────────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│                VERCEL                       │
│  Auto-deploy desde main · SPA routing       │
└─────────────────────────────────────────────┘
```

---

## Estructura de carpetas

```
talleres-jm-demo/
├── public/
│   ├── manifest.json          # Config PWA
│   ├── icons/                 # Íconos (icon-192.png, icon-512.png, apple-touch-icon.png)
│   └── logo.png               # Logo del club
│
├── src/
│   ├── assets/                # Imágenes estáticas
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui generados (no tocar)
│   │   ├── common/
│   │   │   ├── AdminLayout.tsx         # Layout con sidebar (admin + profesor en /alumnos)
│   │   │   ├── ProfesorLayout.tsx      # Layout topbar para /mis-horas
│   │   │   ├── Sidebar.tsx             # Sidebar filtrado por rol
│   │   │   ├── Topbar.tsx              # Topbar mobile (admin)
│   │   │   ├── ProtectedRoute.tsx      # Guarda de rutas por rol (usa SplashScreen)
│   │   │   ├── SplashScreen.tsx        # Loading progresivo (0s/3s/7s fases)
│   │   │   ├── ErrorBoundary.tsx       # Captura chunk errors → auto-reload
│   │   │   ├── CambiarContrasenaModal.tsx  # Modal cambio de contraseña (todos los roles)
│   │   │   └── ProductoThumb.tsx       # Thumbnail de foto de producto con fallback
│   │   ├── alumnos/           # AlumnosList, AlumnoForm, AlumnoRow
│   │   ├── pagos/             # PagosList, PagoForm, DeudoresList, GenerarDeudasModal
│   │   ├── egresos/           # EgresosList, EgresoForm
│   │   ├── asistencia/        # AsistenciaTable, AsistenciaForm, MisHorasList
│   │   ├── ventas/            # VentasList, VentaForm
│   │   ├── configuracion/     # UsuariosSection, TurnosSection, ProductosSection, etc.
│   │   └── dashboard/         # KpiCard, IngresoChart, AccesosRapidos
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
│   │   ├── useAuth.ts         # Sesión y rol — SOLO onAuthStateChange
│   │   ├── useAlumnos.ts
│   │   ├── usePagos.ts
│   │   ├── useEgresos.ts
│   │   ├── useAsistencia.ts
│   │   ├── useVentas.ts
│   │   └── useConfig.ts
│   │
│   ├── store/
│   │   └── authStore.ts       # Zustand: user, perfil, loading — setAuth() atómico
│   │
│   ├── lib/
│   │   ├── supabase.ts        # Cliente Supabase configurado
│   │   ├── utils.ts           # formatCurrency, formatPeriodo, buildWhatsAppUrl, etc.
│   │   └── constants.ts       # CATEGORIAS_EGRESO, FORMAS_PAGO, TIPOS_PAGO, ESTADOS_PAGO, ROLES
│   │
│   ├── services/
│   │   ├── alumnos.service.ts
│   │   ├── pagos.service.ts
│   │   ├── egresos.service.ts
│   │   ├── asistencia.service.ts
│   │   ├── ventas.service.ts
│   │   ├── dashboard.service.ts
│   │   └── config.service.ts
│   │
│   ├── types/
│   │   ├── supabase.ts        # Tipos generados por Supabase CLI
│   │   └── app.types.ts       # Tipos de la app (Perfil, Alumno, Pago, etc.)
│   │
│   ├── App.tsx                # Router principal (React Router v6)
│   └── main.tsx               # Entry point + QueryClient + chunk error handlers
│
├── vercel.json                # SPA routing rewrite
├── .env.local                 # Variables de entorno (no commitear)
├── vite.config.ts             # Vite + VitePWA + Workbox
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
    "@tanstack/react-query": "^5",
    "recharts": "^2",
    "date-fns": "^3",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "vite": "^6",
    "vite-plugin-pwa": "latest",
    "tailwindcss": "^4",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}
```

---

## Configuración PWA (vite.config.ts)

```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,   // ← elimina chunks de versiones anteriores
    runtimeCaching: [
      {
        // NetworkFirst para todas las llamadas a Supabase REST
        urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
        handler: 'NetworkFirst',
        options: { networkTimeoutSeconds: 8, cacheName: 'supabase-rest' }
      },
      {
        // CacheFirst para Google Fonts
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
        handler: 'CacheFirst',
        options: { cacheName: 'google-fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } }
      }
    ]
  },
  manifest: {
    name: 'Talleres DEMO',
    short_name: 'Talleres',
    theme_color: '#05173B',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  }
})
```

---

## Patrones críticos de implementación

### Auth — onAuthStateChange con defer
```typescript
// ⚠️ CRÍTICO: setTimeout(0) evita deadlock con el mutex de Supabase Auth
supabase.auth.onAuthStateChange((_event, session) => {
  setTimeout(async () => {
    if (!session?.user) { clear(); return }
    // Evitar re-fetch si ya tenemos el mismo usuario y perfil
    const state = useAuthStore.getState()
    if (state.user?.id === session.user.id && state.perfil) {
      if (state.loading) setLoading(false)
      return
    }
    // fetchPerfil con AbortController (6s timeout)
    const p = await fetchPerfil(session.user.id)
    if (p) setAuth(session.user, p)
    else { await supabase.auth.signOut(); setLoading(false) }
  }, 0)
})
```

### Chunk load error recovery
```typescript
// main.tsx — handler global
window.addEventListener('unhandledrejection', (event) => {
  const msg = String(event.reason?.message ?? '')
  if (isChunkLoadError(msg)) { event.preventDefault(); window.location.reload() }
})

// ErrorBoundary — captura errores de render
static getDerivedStateFromError(error: Error) {
  if (isChunkLoadError(error)) { window.location.reload(); return { hasError: false } }
  return { hasError: true, error }
}
```

### TanStack Query — configuración
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,  // 2 minutos
      retry: 2,
      retryDelay: 1000,
      refetchOnReconnect: true,
    }
  }
})
```

---

## Notas de compatibilidad PWA

### iOS (Safari)
- Instalar desde Safari → "Agregar a pantalla de inicio"
- `display: standalone` hace que se vea como app nativa
- `viewport-fit=cover` + `env(safe-area-inset-*)` para notch y home bar
- `<meta name="apple-mobile-web-app-capable" content="yes">` (legacy)
- `<meta name="mobile-web-app-capable" content="yes">` (moderno)
- La sesión de Supabase Auth persiste entre sesiones en iOS Safari

### Android (Chrome)
- Banner automático de instalación de PWA
- Funciona igual que iOS una vez instalada

### Desktop
- Chrome/Edge soportan instalación de PWA
- Layout adapta sidebar visible en desktop (≥ 1024px)

### Vercel redeploy
- Al redeploy, los hashes de chunks cambian
- El SW viejo puede servir index.html con chunks que ya no existen
- Solución: `cleanupOutdatedCaches: true` + ErrorBoundary + `unhandledrejection` handler → auto-reload
