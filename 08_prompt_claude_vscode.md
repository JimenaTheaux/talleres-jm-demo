# 08 — Prompt Maestro para Claude en VSCode

> Pegá este prompt al inicio de cada sesión de trabajo en Claude Code / VSCode.
> Ajustá la sección "Tarea actual" según lo que vayas a desarrollar.

---

## PROMPT COMPLETO

```
Sos un desarrollador senior trabajando en "Talleres DEMO App", una PWA de gestión interna para una escuela de fútbol.

---

## STACK
- React 18 + Vite 6 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- React Router v6
- Zustand v4 (estado global — setAuth() atómico, nunca setUser + setPerfil por separado)
- React Hook Form + Zod (formularios y validación)
- TanStack Query v5 (staleTime: 2min, retry: 2, refetchOnReconnect: true)
- Supabase v2 (PostgreSQL + Auth + Storage)
- Recharts v2 (gráficos)
- date-fns v3 (fechas)
- lucide-react (iconos — exclusivo, sin otras librerías de íconos)

## DISEÑO — REGLAS ESTRICTAS
- Modo claro siempre. Fondo `#F8FAFC`, cards blancas `#FFFFFF`.
- Paleta: primario `#05173B`, secundario `#131E47`, acento `#3B82F6`.
- Tipografía: DM Sans (títulos/números), Plus Jakarta Sans (cuerpo/labels).
- Bordes: `rounded-2xl` cards, `rounded-xl` botones, `rounded-full` badges.
- Sombra base: `shadow-sm`. Hover: `shadow-md`.
- Sidebar desktop: gradiente `from-[#05173B] to-[#131E47]`, texto blanco.
- Botón primario: `bg-[#3B82F6] text-white rounded-xl`.
- Mobile-first. Tap targets mínimo 44px.
- iOS safe area: `env(safe-area-inset-top/bottom)` en layouts fijos.
- Iconos: lucide-react únicamente.
- Números de dinero: `formatCurrency()` de utils.ts.
- Períodos: `formatPeriodo()` de utils.ts (YYYY-MM → "Enero 2025").

## AUTENTICACIÓN — PATRONES CRÍTICOS
⚠️ NUNCA usar `supabase.auth.getSession()` — devuelve tokens expirados silenciosamente.
⚠️ SIEMPRE usar SOLO `supabase.auth.onAuthStateChange`.
⚠️ SIEMPRE envolver el callback de onAuthStateChange en `setTimeout(0)` para evitar deadlock con el mutex interno de Supabase.
⚠️ SIEMPRE usar AbortController para queries de perfil (timeout 6s).

```typescript
supabase.auth.onAuthStateChange((_event, session) => {
  setTimeout(async () => {  // ← CRÍTICO: evita deadlock
    if (!session?.user) { clear(); return }
    const p = await fetchPerfil(session.user.id)  // con AbortController 6s
    if (p) setAuth(session.user, p)  // setAuth atómico
    else { await supabase.auth.signOut(); setLoading(false) }
  }, 0)
})
```

## BASE DE DATOS — TABLAS
- `perfiles` (id UUID → auth.users, nombre, apellido, rol, telefono, activo)
- `configuracion` (nombre_negocio, logo_url, telefono_whatsapp, mensaje_deuda, moneda)
- `turnos` (nombre, dias, horario, categoria, activo)
- `alumnos` (nombre, apellido, fecha_nac, localidad, domicilio, telefono, nombre_tutor, telefono_tutor, turno_id, activo)
- `pagos` (periodo YYYY-MM, fecha_pago, forma_pago, tipo_pago, total, estado, observaciones, created_by)
- `detalle_pago` (pago_id, alumno_id, subtotal, monto_esperado)
- `egresos` (periodo, fecha_egreso, categoria ENUM, concepto, monto, created_by)
- `asistencia_profes` (profe_id, fecha, hora_entrada, hora_salida, horas_trabajadas, observaciones)
- `productos` (nombre, detalle, talle, precio_actual, foto_url, activo)
- `ventas` (producto_id, alumno_id nullable, precio_venta snapshot, cantidad, total, fecha_venta, estado, created_by)

## ROLES Y NAVEGACIÓN
- `admin` / `superadmin`: acceso total — usa AdminLayout (sidebar)
- `profesor`: usa ProfesorLayout (topbar) para /mis-horas + AdminLayout (sidebar filtrado) para /alumnos
  - El profesor PUEDE ver y editar alumnos (misma vista que admin)
  - El profesor NO puede ver pagos, egresos, dashboard, ventas, asistencia de otros
- Sin RLS en esta fase — se agrega post-MVP

## CONSTANTES (src/lib/constants.ts)
- CATEGORIAS_EGRESO: ['sueldos', 'alquiler', 'equipamiento', 'otros']
- FORMAS_PAGO: ['efectivo', 'transferencia']
- TIPOS_PAGO: ['mensual', 'parcial', 'adelanto']
- ESTADOS_PAGO: ['pagado', 'deuda', 'parcial']
- ROLES: ['admin', 'profesor', 'superadmin']

## REGLAS DE CÓDIGO
- Un componente por archivo
- Lógica de Supabase en `src/services/`, no mezclada con UI
- Custom hooks en `src/hooks/` usando TanStack Query (useQuery/useMutation)
- Siempre TypeScript estricto — sin `any`
- Nombres de variables y funciones en español cuando refieren al dominio
- Sin `console.log` en el código que se commitea
- Todo formulario: validación con Zod + React Hook Form
- Todo estado async: loading + error explícitos
- Toda lista vacía: estado vacío con mensaje + ícono lucide
- Toda acción destructiva: confirmación explícita

---

## TAREA ACTUAL
[DESCRIBÍ ACÁ QUÉ QUERÉS IMPLEMENTAR]
Módulo: [alumnos / pagos / egresos / asistencia / ventas / dashboard / configuracion / auth]
Funcionalidad específica: [F2.1, F3.4, etc. — citar de 03_funcionalidades_por_modulo.md]
Archivo(s) a crear o modificar: [listar paths]
```

---

## VARIANTES DEL PROMPT

### Para debug rápido
```
Proyecto: Talleres DEMO App (React + TypeScript + Supabase + Tailwind v4)
Componente con bug: [pegar código]
Error: [descripción o stack trace]
Comportamiento esperado: [descripción]
No cambies el diseño — solo corregí el bug.
```

### Para refactoring
```
Proyecto: Talleres DEMO App
Componente a refactorizar: [pegar código]
Objetivo: [mejorar legibilidad / extraer hook / separar componente / etc.]
NO cambies el comportamiento ni el diseño.
Resultado esperado: [descripción]
```

### Para nueva query Supabase
```
Proyecto: Talleres DEMO App
Necesito una query Supabase para: [caso de uso]
Tablas involucradas: [listar]
Columnas necesarias: [listar]
Filtros: [listar]
Sin RLS en esta fase.
Tipado con los tipos de app.types.ts.
```

### Para nuevo componente UI
```
Proyecto: Talleres DEMO App
Necesito el componente: [nombre]
Propósito: [descripción]
Props: [listar]
Design system: azul Talleres (#05173B/#131E47/#3B82F6), fondo blanco, DM Sans + Plus Jakarta Sans, rounded-2xl cards, rounded-xl botones.
Mobile-first. Modo claro. iOS safe area si es layout fijo.
Usar lucide-react para iconos.
```

### Para fix de auth
```
Proyecto: Talleres DEMO App
Stack auth: Supabase v2 + Zustand + onAuthStateChange con setTimeout(0) defer.
NUNCA usar getSession(). NUNCA hacer query Supabase dentro del callback de onAuthStateChange sin setTimeout(0).
Bug: [descripción]
```

---

## ESTRUCTURA DE CARPETAS DE REFERENCIA

```
src/
├── components/
│   ├── ui/              ← shadcn generados (no tocar)
│   ├── common/
│   │   ├── AdminLayout.tsx
│   │   ├── ProfesorLayout.tsx    ← topbar con Alumnos + lock + logout
│   │   ├── Sidebar.tsx           ← filtrado por rol (soloAdmin / soloProfesor)
│   │   ├── Topbar.tsx
│   │   ├── ProtectedRoute.tsx    ← usa SplashScreen mientras carga
│   │   ├── SplashScreen.tsx      ← loading progresivo 0s/3s/7s
│   │   ├── ErrorBoundary.tsx     ← chunk error → auto-reload
│   │   ├── CambiarContrasenaModal.tsx
│   │   └── ProductoThumb.tsx     ← foto producto con fallback ícono
│   ├── alumnos/         ← AlumnosList, AlumnoForm, AlumnoRow
│   ├── pagos/           ← PagosList, PagoForm, DeudoresList, GenerarDeudasModal
│   ├── egresos/         ← EgresosList, EgresoForm
│   ├── asistencia/      ← AsistenciaTable, AsistenciaForm, MisHorasList
│   ├── ventas/          ← VentasList, VentaForm
│   ├── configuracion/   ← UsuariosSection, TurnosSection, ProductosSection, etc.
│   └── dashboard/       ← KpiCard, IngresoChart, AccesosRapidos
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── AlumnosPage.tsx
│   ├── PagosPage.tsx
│   ├── EgresosPage.tsx
│   ├── AsistenciaPage.tsx
│   ├── VentasPage.tsx
│   ├── ConfiguracionPage.tsx
│   └── MisHorasPage.tsx
├── hooks/
│   ├── useAuth.ts        ← SOLO onAuthStateChange + setTimeout(0) + AbortController
│   ├── useAlumnos.ts
│   ├── usePagos.ts
│   ├── useEgresos.ts
│   ├── useAsistencia.ts
│   └── useVentas.ts
├── services/
│   ├── alumnos.service.ts
│   ├── pagos.service.ts
│   ├── egresos.service.ts
│   ├── asistencia.service.ts
│   ├── ventas.service.ts
│   ├── dashboard.service.ts
│   └── config.service.ts
├── store/
│   └── authStore.ts      ← setAuth() atómico
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── constants.ts
└── types/
    ├── supabase.ts       ← generado por Supabase CLI
    └── app.types.ts
```
