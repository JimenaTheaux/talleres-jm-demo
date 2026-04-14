# 02 — Roles y Permisos

## Roles del sistema

El sistema tiene 2 roles operativos más un superusuario.

---

### ROL: Administrador (`admin`)
**Quién:** El dueño de la escuelita y su co-administrador.

**Puede:**
- Acceso completo a todas las secciones
- ABM de alumnos (crear, editar, activar/desactivar, eliminar)
- Registrar, editar y eliminar pagos
- Generar deudas automáticas del mes
- Ver listado de deudores y enviar WhatsApp
- Registrar y ver egresos
- Registrar y ver asistencia de profesores
- ABM de ventas de productos
- ABM de productos del catálogo
- Dashboard con KPIs financieros y filtro por período
- Configuración del sistema: nombre, logo, WhatsApp, mensaje de deuda
- Gestión de usuarios (crear, editar, activar/desactivar profesores y admins)
- ABM de turnos y categorías desde Configuración
- Cambiar su propia contraseña (modal en Configuración)

**Vista principal:** Dashboard financiero con KPIs + acceso rápido a todas las secciones.

**Layout:** `AdminLayout` — sidebar fijo en desktop, hamburger en mobile.

---

### ROL: Profesor (`profesor`)
**Quién:** Profesores de la escuelita.

**Puede:**
- Ver su propio registro de asistencia y horas del mes
- Ver su historial de horas por mes
- **Ver y editar datos de alumnos** (misma vista que el admin)
- Cambiar su propia contraseña (modal en topbar)

**No puede:**
- Ver información financiera (pagos, egresos, dashboard, ventas)
- Ver datos de otros profesores
- Acceder al dashboard general
- Registrar ni editar asistencia

**Vista principal:** Mis Horas (ProfesorLayout) con acceso rápido a Alumnos desde topbar.

**Layout:** `ProfesorLayout` — topbar fijo con:
- Link "Alumnos" → navega a `/alumnos` (usa AdminLayout con sidebar filtrado)
- Botón lock → abre modal CambiarContraseña
- Botón logout

**Nota sobre navegación profesor en Alumnos:**
Cuando el profesor navega a `/alumnos`, usa el `AdminLayout` con sidebar. El sidebar muestra solo las rutas permitidas para su rol: "Alumnos" y "Mis Horas". No tiene acceso al resto de secciones admin.

---

### ROL: Superadmin (`superadmin`)
**Quién:** El desarrollador.
**Puede:** Todo lo del admin + configuración técnica.

---

## Matriz de permisos

| Sección / Acción | Admin | Profesor |
|---|:---:|:---:|
| Dashboard general (KPIs) | ✅ | ❌ |
| Ver alumnos | ✅ | ✅ |
| ABM alumnos | ✅ | ✅ |
| Ver pagos | ✅ | ❌ |
| Registrar pagos | ✅ | ❌ |
| Generar deudas del mes | ✅ | ❌ |
| Ver deudores + WhatsApp | ✅ | ❌ |
| Ver egresos | ✅ | ❌ |
| Registrar egresos | ✅ | ❌ |
| Ver ventas | ✅ | ❌ |
| Registrar ventas | ✅ | ❌ |
| ABM productos | ✅ | ❌ |
| Ver asistencia propia | ✅ | ✅ |
| Ver asistencia de otros | ✅ | ❌ |
| Registrar asistencia (cualquier profe) | ✅ | ❌ |
| Gestión de usuarios | ✅ | ❌ |
| Configuración del sistema | ✅ | ❌ |
| Cambiar contraseña propia | ✅ | ✅ |

---

## Implementación de rutas (React Router v6)

```
/login           → público
/dashboard       → admin + superadmin
/alumnos         → admin + superadmin + profesor  ← COMPARTIDA
/pagos           → admin + superadmin
/egresos         → admin + superadmin
/asistencia      → admin + superadmin
/ventas          → admin + superadmin
/configuracion   → admin + superadmin
/mis-horas       → profesor + admin + superadmin
```

**Estructura de layouts:**
```
AdminLayout (sidebar)
  ├── ProtectedRoute [admin, superadmin]
  │   ├── /dashboard
  │   ├── /pagos
  │   ├── /egresos
  │   ├── /asistencia
  │   ├── /ventas
  │   └── /configuracion
  └── ProtectedRoute [admin, superadmin, profesor]
      └── /alumnos

ProtectedRoute [profesor, admin, superadmin]
  └── ProfesorLayout
      └── /mis-horas
```

---

## Notas
- Login con email + contraseña. Sin registro público.
- Los usuarios (profesores y admins) son creados exclusivamente por el admin desde Configuración.
- La sesión persiste para no tener que loguearse cada vez (especialmente importante en mobile).
- El profesor que se loguea solo ve sus propios registros de asistencia — nunca los de otros.
- Un admin puede desactivar a otro admin o a un profesor sin eliminarlo (preserva el historial).
- El profesor accede a la vista de Alumnos idéntica a la del admin (puede ver y editar).
