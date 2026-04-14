# 07 — Guía de Desarrollo

> Estado actual del proyecto, fases completadas, decisiones técnicas y cómo trabajar en él.

---

## Estado del proyecto

**Versión:** MVP completo, desplegado en Vercel.
**Repositorio:** `https://github.com/JimenaTheaux/talleres-jm-demo`
**Branch principal:** `main` — auto-deploy en Vercel en cada push.

---

## Cómo correr el proyecto

```bash
# Clonar
git clone https://github.com/JimenaTheaux/talleres-jm-demo.git
cd talleres-jm-demo

# Instalar dependencias
npm install

# Variables de entorno — crear .env.local
VITE_SUPABASE_URL=https://[proyecto].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]

# Dev server
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## Fases de desarrollo completadas

### Fase 1 — Estructura base
- Vite + React + TypeScript + Tailwind CSS v4
- React Router v6 con rutas protegidas
- Zustand authStore (`user`, `perfil`, `loading`)
- Supabase client configurado
- Estructura de carpetas: pages / components / hooks / services / store / lib / types

### Fase 2 — Autenticación
- LoginPage con email + contraseña
- `useAuth` hook con `onAuthStateChange`
- `ProtectedRoute` con redirección por rol
- Logout desde layout

### Fase 3 — Módulo Alumnos
- AlumnosPage con listado, búsqueda, filtros
- Formulario crear/editar con React Hook Form + Zod
- Activar/desactivar con confirmación
- Integración con Supabase (alumnos.service.ts)

### Fase 4 — Módulo Pagos
- PagosPage con filtro por período
- Registro de pagos con selección múltiple de alumnos
- Subtotales por alumno con precharge desde turno
- Generar deudas del mes
- Listado de deudores + WhatsApp deeplink

### Fase 5 — Módulo Egresos
- EgresosPage con filtros de período y categoría
- CRUD completo de egresos
- Total del período calculado en tiempo real

### Fase 6 — Módulo Asistencia
- AsistenciaPage (admin): listado por profesor + detalle del mes
- MisHorasPage (profesor): solo sus registros
- Cálculo automático de horas trabajadas

### Fase 7 — Módulo Ventas
- VentasPage con filtros y búsqueda
- Formulario de venta con precharge de precio del catálogo
- ProductoThumb: thumbnail con fallback a ícono (manejo de errores Storage 400)

### Fase 8 — Dashboard
- KpiCard por KPI financiero
- Filtro de período afecta todos los KPIs
- Gráfico de ingresos con Recharts
- Accesos rápidos

### Fase 9 — Configuración
- Tabs: Negocio / Usuarios / Turnos / Productos
- CRUD de usuarios (crea en auth + perfiles)
- CRUD de turnos y productos
- Upload de logo y foto de productos a Supabase Storage
- Sección "Mi cuenta" con CambiarContrasenaModal

### Fase 10 — Polish y Deploy
- Íconos PWA (192x192, 512x512, apple-touch-icon)
- iOS safe area (`env(safe-area-inset-*)`, `viewport-fit=cover`)
- Meta tags PWA completos (`apple-mobile-web-app-*`, `mobile-web-app-capable`)
- `vercel.json` con rewrite SPA
- Deploy en Vercel con variables de entorno

### Fase 11 — Estabilidad y UX
- **SplashScreen progresivo:** fases 0s/3s/7s con spinner → mensaje → botón reintento
- **Auth freeze fix:** eliminación de `getSession()`, solo `onAuthStateChange` + `setTimeout(0)` defer
- **AbortController:** timeout de 6s en fetchPerfil + timeout global de 10s
- **Chunk load error fix:** ErrorBoundary + `unhandledrejection` handler → auto-reload tras redeploy
- **Cambiar contraseña:** CambiarContrasenaModal para admin (Configuración) y profesor (topbar)
- **Acceso profesor a Alumnos:** profesor puede ver y editar la misma vista de alumnos que el admin

---

## Decisiones técnicas clave

### Auth: solo onAuthStateChange

**Problema:** `getSession()` devuelve tokens expirados sin forzar refresh. Además, hacer queries a Supabase dentro del callback de `onAuthStateChange` causa deadlock con el mutex interno de la librería.

**Solución:**
1. Eliminar todo uso de `getSession()`
2. Usar únicamente `onAuthStateChange`
3. Envolver el handler en `setTimeout(0)` para diferir la ejecución fuera del mutex
4. AbortController con 6s timeout en la query de perfil
5. Timeout global de 10s para forzar `loading: false` como fallback

```typescript
supabase.auth.onAuthStateChange((_event, session) => {
  setTimeout(async () => {  // ← CRÍTICO: defer fuera del mutex
    // ... fetchPerfil con AbortController
  }, 0)
})
```

### Zustand: setAuth atómico

Usar `setAuth(user, perfil)` en lugar de `setUser(user); setPerfil(perfil)` para evitar re-renders intermedios con estado parcial.

### React Router v6: grupos de rutas con mismo layout

Cuando dos grupos de roles necesitan el mismo layout pero diferentes permisos, anidar dos `ProtectedRoute` dentro del mismo layout padre:

```tsx
<Route element={<AdminLayout />}>
  <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
    {/* Rutas solo admin */}
  </Route>
  <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'profesor']} />}>
    <Route path="/alumnos" element={<AlumnosPage />} />
  </Route>
</Route>
```

### TanStack Query: configuración estable
- `staleTime: 2min` — evita refetches innecesarios en móvil
- `retry: 2` — tolera errores de red transitorios
- `refetchOnReconnect: true` — actualiza al volver de background

### PWA: Workbox NetworkFirst para Supabase
Las queries REST de Supabase usan `NetworkFirst` con timeout de 8s: intenta red primero, cae a cache si no hay conexión. Evita servir datos stale indefinidamente.

### Chunk errors tras redeploy en Vercel
Al redeploy, los hashes de los chunks cambian. El Service Worker viejo sirve el `index.html` con imports a chunks que ya no existen → error de red.

Solución triple:
1. `cleanupOutdatedCaches: true` en Workbox
2. `ErrorBoundary.getDerivedStateFromError` detecta chunk errors → `window.location.reload()`
3. `window.addEventListener('unhandledrejection', ...)` en main.tsx → `window.location.reload()`

---

## Flujo de trabajo recomendado

### Agregar un nuevo módulo
1. Crear tabla en Supabase (ver `05_estructura_de_datos.md`)
2. Crear `src/services/[modulo].service.ts` con funciones de acceso a datos
3. Crear `src/hooks/use[Modulo].ts` con TanStack Query
4. Crear componentes en `src/components/[modulo]/`
5. Crear `src/pages/[Modulo]Page.tsx`
6. Agregar ruta en `src/App.tsx`
7. Agregar ítem en `Sidebar.tsx` con flags de visibilidad por rol

### Modificar un componente existente
1. Leer el archivo antes de modificar
2. No cambiar diseño si solo es un bug de lógica
3. Respetar el design system de `06_estilos_y_diseno.md`
4. Usar el prompt de `08_prompt_claude_vscode.md` como contexto

---

## Archivos críticos — no modificar sin entender

| Archivo | Por qué es crítico |
|---|---|
| `src/hooks/useAuth.ts` | Auth freeze fix — patrón muy específico con defer + AbortController |
| `src/store/authStore.ts` | setAuth atómico — no separar en setUser + setPerfil |
| `src/main.tsx` | QueryClient + chunk error handlers globales |
| `src/components/common/ErrorBoundary.tsx` | Chunk error recovery — no simplificar |
| `src/App.tsx` | Orden de rutas React Router v6 — el orden importa |
| `vite.config.ts` | Workbox config — `cleanupOutdatedCaches` y `NetworkFirst` son necesarios |

---

## Errores conocidos resueltos

| Error | Causa | Solución |
|---|---|---|
| Auth freeze en reload (`[useAuth] timeout`) | `getSession()` + deadlock mutex Supabase | Solo `onAuthStateChange` + `setTimeout(0)` |
| "Ingresando..." stuck | onSubmit sin try/catch → isSubmitting no se resetea | try/catch envolviendo todo el handler |
| Chunk load error tras redeploy | SW sirve index.html viejo con hashes de chunks nuevos | ErrorBoundary + unhandledrejection + cleanupOutdatedCaches |
| Supabase Storage 400 en imágenes | Bucket no público / path sin `/public/` | ProductoThumb con onError → fallback ícono |
| apple-mobile-web-app-capable deprecation | Meta tag legacy | Agregado `mobile-web-app-capable` moderno |
| Profesor: botón Alumnos sin respuesta | React Router v6 primer match: ProtectedRoute admin rechazaba → redirect | Dos ProtectedRoute dentro del mismo AdminLayout |
| Profesor: botón Alumnos desapareció | NavLink removido inadvertidamente de ProfesorLayout | Restaurado + agregado /mis-horas en sidebar |

---

## Próximas mejoras (backlog técnico)

- RLS (Row Level Security) en Supabase por rol
- Foto de alumno (upload a Storage)
- Notificaciones push (service worker + Web Push API)
- Multi-tenant: campo `negocio_id` en todas las tablas
- Reportes exportables (jsPDF / xlsx)
- Tests unitarios (Vitest + Testing Library)
