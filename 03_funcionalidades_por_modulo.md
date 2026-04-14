# 03 — Funcionalidades por Módulo

---

## MÓDULO 1: Autenticación

### F1.1 — Login
- Formulario: email + contraseña
- Sin registro público
- Sesión persistente (no expira sola)
- Redirección automática según rol:
  - Admin → `/dashboard`
  - Profesor → `/mis-horas`
- Manejo de errores: credenciales incorrectas, usuario inactivo, error de red
- Estado "Ingresando..." bloqueado mientras procesa (isSubmitting)

### F1.2 — Logout
- Botón siempre visible en el layout (sidebar admin / topbar profesor)
- Limpia la sesión local y el store Zustand

### F1.3 — Cambiar contraseña
- Modal `CambiarContrasenaModal` accesible desde:
  - **Admin:** sección "Mi cuenta" en ConfiguracionPage (botón con ícono Lock)
  - **Profesor:** topbar de ProfesorLayout (botón con ícono Lock)
- Campos: contraseña actual (validación en UI), nueva contraseña (mín. 6 caracteres), confirmar nueva
- Toggle Eye/EyeOff por campo
- Llama a `supabase.auth.updateUser({ password })`
- Estado de éxito con ícono CheckCircle2 + cierre automático a los 1800ms
- Validación con Zod + React Hook Form

---

## MÓDULO 2: Alumnos

> Accesible por admin **y profesor** (misma vista, mismas acciones).

### F2.1 — Listado de alumnos
- Tabla con: nombre completo, turno, teléfono tutor, estado (activo/inactivo)
- Búsqueda por nombre o apellido
- Filtro por turno
- Filtro por estado (activo / inactivo / todos)
- Indicador visual de estado (badge de color)
- Acciones rápidas por fila: editar, cambiar estado, ir a pagos del alumno

### F2.2 — Crear alumno
**Campos:**
- Nombre (obligatorio)
- Apellido (obligatorio)
- Fecha de nacimiento
- Localidad
- Domicilio
- Teléfono
- Nombre del tutor
- Teléfono del tutor (obligatorio — se usa para WhatsApp)
- Turno (selección de lista — ver Módulo Configuración)
- Activo (default: true)

### F2.3 — Editar alumno
- Mismos campos que crear
- Muestra fecha de alta (created_at, solo lectura)

### F2.4 — Cambiar estado
- Toggle activo/inactivo con confirmación
- Los alumnos inactivos no reciben deudas automáticas

### F2.5 — Ver detalle de alumno
- Todos sus datos
- Historial de pagos del alumno (lista de períodos con estado)

---

## MÓDULO 3: Pagos

### F3.1 — Listado de pagos
- Vista principal: pagos agrupados por período (mes/año)
- Selector de período (mes/año) para filtrar — default: mes actual
- Tabla con: alumno(s), período, monto, forma de pago, estado, fecha de pago
- Filtro por estado: todos / pagado / deuda / parcial
- Búsqueda por nombre de alumno
- Badge de estado con color por cada fila
- Botón de acción rápida por fila: editar pago

### F3.2 — Registrar pago
**Campos:**
- Período (YYYY-MM — selector mes/año)
- Alumno(s): selección múltiple — para pagos grupales de familia
  - Se crea un `pago` con múltiples `detalle_pago` (uno por alumno)
  - Cada alumno tiene su propio subtotal editable
- Forma de pago: efectivo | transferencia
- Tipo de pago: mensual | parcial | adelanto
- Total (suma automática de subtotales, editable manualmente)
- Estado: pagado | parcial
- Fecha de pago (default: hoy)
- Observaciones (opcional)

**Lógica de subtotales:**
- Al seleccionar un alumno, se precarga el monto de su turno (si el turno tiene precio configurado)
- El precio es editable por alumno
- El total se recalcula automáticamente

### F3.3 — Editar pago
- Mismos campos que registrar
- Visible el historial de cambios (created_at / updated_at)

### F3.4 — Generar deudas del mes
- Botón "Generar deudas" en la vista de pagos
- Selección del período a generar
- El sistema identifica todos los alumnos activos que NO tienen pago registrado para ese período
- Crea un registro `pago` en estado `deuda` con `detalle_pago` para cada alumno sin pagar
- Confirmación antes de ejecutar: "Se generarán X deudas para el período YYYY-MM"
- Si ya existen deudas generadas para ese período, avisa y permite regenerar solo los faltantes

### F3.5 — Listado de deudores
- Accesible desde el Dashboard (botón en KPI de deudores) y desde la vista de pagos
- Lista de alumnos con deuda en el período seleccionado
- Muestra: nombre, turno, teléfono tutor, monto adeudado
- Botón WhatsApp por fila: abre `https://wa.me/{telefono_tutor}?text={mensaje}` con plantilla de la configuración
  - Variables disponibles en el mensaje: `{alumno}`, `{tutor}`, `{periodo}`, `{monto}`
- Filtro por período

---

## MÓDULO 4: Egresos

### F4.1 — Listado de egresos
- Tabla con: fecha, categoría, concepto, monto
- Filtro por período (mes/año)
- Filtro por categoría
- Total del período visible arriba de la tabla
- Botón "Agregar egreso"
- Acciones por fila: editar, eliminar (con confirmación)

### F4.2 — Registrar egreso
**Campos:**
- Fecha (obligatorio)
- Período (YYYY-MM — se auto-completa según fecha, editable)
- Categoría: enum fijo → sueldos | alquiler | equipamiento | otros
- Concepto (texto libre, obligatorio)
- Monto (obligatorio)

### F4.3 — Editar egreso
- Mismos campos que registrar

---

## MÓDULO 5: Asistencia Profesores

### F5.1 — Vista admin: listado general
- Selector de mes para filtrar
- Tabla por profesor: nombre, total de horas del mes
- Al hacer clic en un profesor, ver detalle de sus registros del mes

### F5.2 — Detalle de asistencia por profesor
- Lista de registros: fecha, hora entrada, hora salida, horas trabajadas, observaciones
- Total de horas del mes al final
- Botón "Agregar registro" (solo admin)
- Acciones por fila: editar, eliminar (solo admin)

### F5.3 — Registrar asistencia (admin)
**Campos:**
- Profesor (selección de lista — solo profes activos)
- Fecha
- Hora entrada
- Hora salida
- Horas trabajadas (calculado automático: salida − entrada, editable manualmente)
- Observaciones (opcional)

### F5.4 — Vista profesor: mis horas
- Solo ve sus propios registros
- Selector de mes
- Lista de registros del mes con total de horas
- Sin opciones de editar ni agregar
- Navegación desde `ProfesorLayout`: topbar con link "Alumnos" + botón lock + logout

---

## MÓDULO 6: Ventas de Productos

### F6.1 — Listado de ventas
- Tabla con: thumbnail del producto (`ProductoThumb`), producto, detalle, talle, alumno (si aplica), precio venta, cantidad, total, estado, fecha
- Filtro por estado: pagado / deuda / todos
- Filtro por período
- Búsqueda por producto o alumno
- Total de ventas del período visible arriba
- Botón "Registrar venta"
- Acciones por fila: editar, eliminar (con confirmación)

### F6.2 — Registrar venta
**Campos:**
- Producto (selección del catálogo activo) — muestra thumbnail
  - Al seleccionar, se precarga precio actual del catálogo (editable)
- Alumno (selección de lista — opcional)
- Talle (texto libre, opcional)
- Precio de venta (snapshot — editable)
- Cantidad (default: 1)
- Total (calculado automático: precio × cantidad)
- Estado: pagado | deuda
- Fecha (default: hoy)
- Observaciones (opcional)

### F6.3 — Editar venta
- Mismos campos que registrar

### F6.4 — Catálogo de productos (desde Configuración)
- Lista de productos con: nombre, detalle, precio actual, foto (thumbnail con fallback a ícono), activo/inactivo
- Crear, editar, activar/desactivar producto
- Campos producto: nombre, detalle, precio_actual, foto_url (opcional), activo

### F6.5 — Thumbnail de producto (`ProductoThumb`)
- Componente reutilizable que muestra la foto del producto
- `onError` → fallback al ícono `ShoppingBag` de Lucide
- Usado en: VentasPage listado, VentaForm selector, ProductosSection en Configuración

---

## MÓDULO 7: Dashboard

### F7.1 — KPIs principales
Todos los valores respetan el filtro de período activo (default: mes actual).

- **Total ingresos** (suma de pagos en estado `pagado` + ventas `pagado`)
- **Total egresos** (suma de egresos del período)
- **Ganancia neta** (ingresos − egresos)
- **Ingresos por ventas de productos** (solo ventas)
- **Nro de deudores** con botón → abre listado de deudores del período
- **Nro de alumnos activos** (no depende del filtro de período)

### F7.2 — Filtro de período
- Selector de mes/año o rango de fechas personalizado
- Afecta todos los KPIs excepto "Alumnos activos"
- Default: mes actual

### F7.3 — Gráfico de ingresos
- Gráfico de línea o barras: ingresos por mes (últimos 6 o 12 meses)
- Puede incluir línea de egresos superpuesta para comparar

### F7.4 — Accesos rápidos
- Botón "Agregar alumno"
- Botón "Registrar pago"
- Botón "Ver deudores"

---

## MÓDULO 8: Configuración

### F8.1 — Datos del negocio
- Nombre del negocio
- Logo (upload de imagen)
- Teléfono WhatsApp (número para configurar el remitente)
- Mensaje de deuda (template con variables: `{alumno}`, `{tutor}`, `{periodo}`, `{monto}`)
- Moneda (default: ARS)

### F8.2 — Gestión de usuarios
- Lista de usuarios (nombre, email, rol, estado activo/inactivo)
- Crear usuario: nombre, apellido, email, contraseña temporal, rol (admin | profesor), teléfono
- Editar usuario: nombre, apellido, teléfono, rol
- Activar / desactivar usuario (no se elimina, preserva historial)

### F8.3 — Gestión de turnos
- Lista de turnos activos
- Crear, editar, activar/desactivar turno
- Campos: nombre, días, horario, categoría

### F8.4 — Categorías de egresos
> Las categorías son un ENUM fijo en la base de datos: `sueldos | alquiler | equipamiento | otros`. No son editables por el usuario.

### F8.5 — Mi cuenta (solo visible para admin)
- Sección fija al pie de ConfiguracionPage (visible en todos los tabs)
- Botón con ícono Lock → abre `CambiarContrasenaModal`

---

## Notas transversales
- Toda acción destructiva (eliminar, desactivar, generar deudas) requiere confirmación explícita
- Todo formulario muestra validación inline antes de enviar
- Todo estado de carga (loading) y error (con mensaje claro en español) es obligatorio
- Los importes siempre se muestran con separador de miles y 2 decimales (ej: $12.500,00)
- SplashScreen en carga inicial: fase loading (0s) → "Conectando con el servidor" (3s) → botón reintento (7s) → timeout (10s)
- Errores de chunk load tras redeploy: auto-reload via ErrorBoundary + `unhandledrejection` handler
