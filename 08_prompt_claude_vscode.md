# 08 — Prompt Maestro para Claude en VSCode

> Pegá este prompt al inicio de cada sesión de trabajo en Claude Code / VSCode.
> Ajustá la sección "Tarea actual" según lo que vayas a desarrollar.

---

## PROMPT COMPLETO

```
Sos un desarrollador senior trabajando en "Talleres JM App", una PWA de gestión interna para una escuela de fútbol.

---

## STACK
- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- React Router v6
- Zustand (estado global)
- React Hook Form + Zod (formularios y validación)
- Supabase (PostgreSQL + Auth)
- Recharts (gráficos)
- date-fns (fechas)
- lucide-react (iconos)

## DISEÑO — REGLAS ESTRICTAS
- Modo claro siempre. Fondo `#F8FAFC`, cards blancas `#FFFFFF`.
- Paleta: primario `#05173B`, secundario `#131E47`, acento `#3B82F6`.
- Tipografía: DM Sans (títulos/números), Plus Jakarta Sans (cuerpo/labels).
- Bordes: `rounded-2xl` cards, `rounded-xl` botones, `rounded-full` badges.
- Sombra base: `shadow-sm`. Hover: `shadow-md`.
- Sidebar desktop: gradiente `from-[#05173B] to-[#131E47]`, texto blanco.
- Botón primario: `bg-[#3B82F6] text-white rounded-xl`.
- Mobile-first. Tap targets mínimo 44px.
- Iconos: lucide-react únicamente.
- Números de dinero: `formatCurrency()` de utils.ts.
- Períodos: `formatPeriodo()` de utils.ts (YYYY-MM → "Enero 2025").

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

## ROLES
- `admin`: acceso total
- `profesor`: solo ve sus propias horas en `asistencia_profes`
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
- Custom hooks en `src/hooks/` para encapsular fetching
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
Proyecto: Talleres JM App (React + TypeScript + Supabase + Tailwind)
Componente con bug: [pegar código]
Error: [descripción o stack trace]
Comportamiento esperado: [descripción]
No cambies el diseño — solo corregí el bug.
```

### Para refactoring
```
Proyecto: Talleres JM App
Componente a refactorizar: [pegar código]
Objetivo: [mejorar legibilidad / extraer hook / separar componente / etc.]
NO cambies el comportamiento ni el diseño.
Resultado esperado: [descripción]
```

### Para nueva query Supabase
```
Proyecto: Talleres JM App
Necesito una query Supabase para: [caso de uso]
Tablas involucradas: [listar]
Columnas necesarias: [listar]
Filtros: [listar]
Sin RLS en esta fase.
Tipado con los tipos generados de Supabase.
```

### Para nuevo componente UI
```
Proyecto: Talleres JM App
Necesito el componente: [nombre]
Propósito: [descripción]
Props: [listar]
Design system: azul Talleres (#05173B/#131E47/#3B82F6), fondo blanco, DM Sans + Plus Jakarta Sans, rounded-2xl cards, rounded-xl botones.
Mobile-first. Modo claro.
Usar lucide-react para iconos.
```

---

## ESTRUCTURA DE CARPETAS DE REFERENCIA

```
src/
├── components/
│   ├── ui/              ← shadcn generados (no tocar)
│   ├── common/          ← AdminLayout, ProfesorLayout, ProtectedRoute, Sidebar, Topbar
│   ├── alumnos/         ← AlumnosList, AlumnoForm, AlumnoRow
│   ├── pagos/           ← PagosList, PagoForm, DeudoresList, GenerarDeudasModal
│   ├── egresos/         ← EgresosList, EgresoForm
│   ├── asistencia/      ← AsistenciaTable, AsistenciaForm, MisHorasList
│   ├── ventas/          ← VentasList, VentaForm
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
│   ├── useAuth.ts
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
│   └── config.service.ts
├── store/
│   └── authStore.ts
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── constants.ts
└── types/
    ├── supabase.ts      ← generado por Supabase CLI
    └── app.types.ts
```
