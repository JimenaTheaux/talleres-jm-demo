# Talleres DEMO — Sistema de Gestión Interna

PWA de gestión interna para una escuela de fútbol. Administra alumnos, pagos mensuales, egresos, ventas de productos y asistencia de profesores.

## Stack

- React 18 + Vite 6 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- React Router v6
- Zustand (estado global)
- TanStack Query v5 (server state)
- React Hook Form + Zod (formularios)
- Supabase (PostgreSQL + Auth + Storage)
- Recharts (gráficos)
- vite-plugin-pwa + Workbox (PWA / Service Worker)
- Vercel (deploy)

## Correr el proyecto

```bash
npm install
# Crear .env.local con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Módulos

| Módulo | Descripción |
|---|---|
| Dashboard | KPIs financieros + gráfico de ingresos |
| Alumnos | ABM de alumnos con turno asignado |
| Pagos | Registro de pagos + deudas automáticas + WhatsApp deudores |
| Egresos | Registro de egresos por categoría |
| Asistencia | Control de horas de profesores |
| Ventas | Ventas de productos del club |
| Configuración | Negocio, usuarios, turnos, productos |
| Mis Horas | Vista del profesor (sus propias horas) |

## Roles

- **Admin / Superadmin:** acceso completo a todas las secciones
- **Profesor:** vista de sus propias horas + acceso completo a Alumnos

## Deploy

Auto-deploy en Vercel desde rama `main`.
Variables de entorno requeridas en Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## Documentación del proyecto

Ver carpeta raíz `../` para los archivos de documentación:

- `01_contexto_y_vision.md` — Descripción general, alcance, identidad visual
- `02_roles_y_permisos.md` — Roles, permisos, estructura de rutas
- `03_funcionalidades_por_modulo.md` — Especificación funcional detallada
- `04_stack_tecnico.md` — Stack, arquitectura, patrones críticos
- `05_estructura_de_datos.md` — Esquema de base de datos SQL completo
- `06_estilos_y_diseno.md` — Design system, tokens, componentes
- `07_guia_de_desarrollo.md` — Fases completadas, decisiones técnicas, errores resueltos
- `08_prompt_claude_vscode.md` — Prompt maestro para trabajar con Claude Code
