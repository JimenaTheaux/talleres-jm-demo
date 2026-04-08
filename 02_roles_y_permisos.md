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

**Vista principal:** Dashboard financiero con KPIs + acceso rápido a todas las secciones.

---

### ROL: Profesor (`profesor`)
**Quién:** Profesores de la escuelita.

**Puede:**
- Ver su propio registro de asistencia y horas del mes
- Ver su historial de horas por mes

**No puede:**
- Ver datos de alumnos
- Ver información financiera (pagos, egresos, ventas)
- Ver datos de otros profesores
- Acceder al dashboard general
- Crear ni editar ningún dato

**Vista principal:** Lista de sus propias asistencias registradas, agrupadas por mes con total de horas.

---

### ROL: Superadmin (`superadmin`)
**Quién:** El desarrollador.
**Puede:** Todo lo del admin + configuración técnica.

---

## Matriz de permisos

| Sección / Acción | Admin | Profesor |
|---|:---:|:---:|
| Dashboard general (KPIs) | ✅ | ❌ |
| Ver alumnos | ✅ | ❌ |
| ABM alumnos | ✅ | ❌ |
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

---

## Notas
- Login con email + contraseña. Sin registro público.
- Los usuarios (profesores y admins) son creados exclusivamente por el admin desde Configuración.
- La sesión persiste para no tener que loguearse cada vez (especialmente importante en mobile).
- El profesor que se loguea solo ve sus propios registros — nunca los de otros.
- Un admin puede desactivar a otro admin o a un profesor sin eliminarlo (preserva el historial).
