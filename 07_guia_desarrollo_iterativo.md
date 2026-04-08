# 07 — Guía de Desarrollo Iterativo con Claude en VSCode

## Filosofía del proyecto

> **Lanzar simple, lanzar rápido.** El MVP tiene que funcionar y que el cliente lo use.
> Lo escalable, lo seguro y lo perfecto viene después. Cada decisión técnica prioriza velocidad de entrega y facilidad de mantenimiento.

---

## Orden de desarrollo recomendado

### FASE 1 — Setup del proyecto
1. `npm create vite@latest talleres-jm-app -- --template react-ts`
2. Instalar y configurar Tailwind CSS
3. Instalar shadcn/ui: `npx shadcn-ui@latest init`
4. Configurar `vite-plugin-pwa` con manifest básico
5. Crear proyecto en Supabase, obtener credenciales
6. Ejecutar el SQL completo de `05_estructura_de_datos.md` en Supabase
7. Configurar cliente Supabase (`src/lib/supabase.ts`)
8. Crear `.env.local` con las variables de entorno
9. Agregar fuentes Google (DM Sans + Plus Jakarta Sans) en `index.html`
10. **Commit:** `feat: project setup`

### FASE 2 — Autenticación y routing
1. Pantalla de login con diseño Talleres JM
2. Hook `useAuth` con Supabase Auth + tabla `perfiles`
3. Rutas protegidas por rol (React Router v6 + `<ProtectedRoute>`)
4. `AdminLayout` (sidebar azul desktop + topbar mobile)
5. `ProfesorLayout` (topbar simple)
6. Zustand store para el usuario autenticado
7. Probar con 2 usuarios de prueba (admin + profesor)
8. **Commit:** `feat: auth and routing`

### FASE 3 — Módulo Alumnos
1. Listado de alumnos con búsqueda, filtro turno y filtro estado
2. Modal crear alumno
3. Modal editar alumno
4. Toggle activo/inactivo con confirmación
5. Cargar turnos de prueba en Supabase para testear
6. **Commit:** `feat: alumnos module`

### FASE 4 — Módulo Pagos
1. Listado de pagos filtrable por período y estado
2. Modal registrar pago (con selección múltiple de alumnos)
3. Modal editar pago
4. Botón "Generar deudas del mes" con confirmación
5. Modal listado de deudores con botón WhatsApp por fila
6. **Commit:** `feat: pagos module`

### FASE 5 — Módulo Egresos
1. Listado de egresos filtrable por período y categoría
2. Modal registrar egreso
3. Modal editar egreso
4. **Commit:** `feat: egresos module`

### FASE 6 — Módulo Asistencia Profesores
1. Vista admin: tabla por profesor con total de horas del mes
2. Detalle por profesor con lista de registros
3. Modal registrar asistencia
4. Vista profesor: mis horas (solo lectura)
5. **Commit:** `feat: asistencia module`

### FASE 7 — Módulo Ventas de Productos
1. Listado de ventas con filtros
2. Modal registrar venta (con selección de producto y alumno opcional)
3. **Commit:** `feat: ventas module`

### FASE 8 — Dashboard
1. KPIs con filtro de período
2. Gráfico de ingresos por mes (Recharts)
3. Accesos rápidos
4. Botón deudores → abre modal del módulo pagos
5. **Commit:** `feat: dashboard`

### FASE 9 — Configuración
1. Formulario datos del negocio
2. Gestión de usuarios (crear, editar, activar/desactivar)
3. Gestión de turnos
4. **Commit:** `feat: configuracion`

### FASE 10 — Polish y Deploy
1. Íconos PWA definitivos con logo Talleres JM
2. Revisión UX en iPhone real y Android real
3. Loading states y mensajes de error en todos los módulos
4. Estados vacíos con mensaje + ícono en todas las listas
5. Deploy en Vercel
6. **Commit:** `feat: polish and deploy`

---

## Control de versiones con Git

```
main    → producción (lo que está deployado)
dev     → desarrollo activo
feat/x  → features nuevas
fix/x   → correcciones
```

### Flujo diario
```bash
git checkout dev && git pull
git checkout -b feat/modulo-pagos
# ... trabajar ...
git add . && git commit -m "feat: pagos module with deuda generation"
git checkout dev && git merge feat/modulo-pagos && git push
```

### Convención de commits
```
feat:     nueva funcionalidad
fix:      corrección de bug
refactor: mejora sin cambio funcional
style:    cambios de UI/CSS
docs:     actualización de documentación
```

### .gitignore obligatorio
```
node_modules/
dist/
.env
.env.local
*.log
```

---

## Checklist de testing manual por módulo

### Auth
- [ ] Admin ve Dashboard al loguearse
- [ ] Profesor ve "Mis Horas" al loguearse
- [ ] URL protegida redirige a login si no hay sesión
- [ ] Sesión persiste al cerrar y reabrir el browser

### Alumnos
- [ ] Crear alumno con todos los campos guarda correctamente
- [ ] Filtro por turno filtra correctamente
- [ ] Toggle activo/inactivo requiere confirmación
- [ ] Alumno inactivo no aparece en selección de "Generar deudas"

### Pagos
- [ ] Pago grupal (2 hermanos) crea 1 pago + 2 detalle_pago
- [ ] Total se recalcula al agregar/quitar alumnos
- [ ] "Generar deudas" no duplica deudas ya existentes
- [ ] Botón WhatsApp abre WA con el mensaje correcto
- [ ] Pago en estado "deuda" tiene fecha_pago null

### Egresos
- [ ] Crear egreso asigna período correcto según fecha
- [ ] Filtro por período muestra solo egresos de ese mes

### Dashboard
- [ ] KPIs cambian al cambiar el período
- [ ] "Alumnos activos" no cambia con el filtro de período
- [ ] Ganancia neta = ingresos − egresos (verificar con datos conocidos)

### Ventas
- [ ] precio_venta guarda snapshot — cambiar precio del producto no afecta ventas pasadas

---

## Prompts tipo para Claude en VSCode

### Nueva funcionalidad
```
Proyecto: PWA de gestión interna para escuela de fútbol "Talleres JM"
Stack: React + Vite + TypeScript + Tailwind + shadcn/ui + Supabase
Design system: ver 06_estilos_y_diseno.md (paleta Talleres, DM Sans + Plus Jakarta Sans)

Necesito implementar: [FUNCIONALIDAD]
Requisitos: [citar punto de 03_funcionalidades_por_modulo.md]
Tablas involucradas: [citar de 05_estructura_de_datos.md]
```

### Debug
```
Componente: [pegar código]
Bug: [descripción]
Comportamiento esperado: [citar requisito]
```

### Query Supabase
```
Query para: [caso de uso]
Esquema: [citar tablas de 05_estructura_de_datos.md]
Rol del usuario: admin
Sin RLS en esta fase.
```

---

## Checklist pre-deploy MVP

- [ ] Flujo completo probado en iPhone real (admin iOS)
- [ ] Flujo completo probado en Android real
- [ ] Sin `console.log` en producción
- [ ] Variables de entorno cargadas en Vercel
- [ ] Datos iniciales cargados: turnos, productos del catálogo
- [ ] 3 usuarios creados: 1 admin, 1 co-admin, 1 profesor de prueba
- [ ] PWA instalable verificada en iPhone (Safari → "Agregar a inicio")
- [ ] PWA instalable verificada en Android (Chrome → banner de instalación)
- [ ] Loading states en todas las operaciones async
- [ ] Mensajes de error en español en todos los formularios
- [ ] Estados vacíos en todas las listas

---

## Backlog (post-MVP)

- [ ] RLS y políticas de seguridad por rol en Supabase
- [ ] Foto de alumno en perfil (campo foto_url en tabla alumnos)
- [ ] Vista avanzada de profesores
- [ ] Vinculación egresos ↔ sueldos de profes (calculado automático)
- [ ] Notificaciones push (Web Push API)
- [ ] Reportes exportables (PDF/Excel)
- [ ] Multi-tenant / SaaS para otras escuelitas
- [ ] Integración WhatsApp API (más allá del deeplink)
