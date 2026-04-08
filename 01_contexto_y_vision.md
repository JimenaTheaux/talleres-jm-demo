# 01 — Contexto y Visión del Proyecto

## Nombre del proyecto
> **Talleres JM — Sistema de Gestión Interna**

## Descripción general
Sistema interno de gestión para la Escuela de Fútbol Talleres Jesús María. PWA centralizada que permite administrar alumnos, pagos, egresos, ventas de productos y asistencia de profesores, reemplazando el flujo manual actual (cuadernos, WhatsApp, planillas).

## Problema que resuelve
- Registro manual de pagos sin trazabilidad
- Sin visibilidad de deudores en tiempo real
- Control de egresos disperso y sin categorización
- Asistencia de profesores registrada en papel
- Ventas de productos sin registro centralizado

## Objetivo del MVP
Digitalizar la gestión completa de la escuelita: alumnos, pagos mensuales, egresos, ventas de productos y horas de profesores, con dashboard financiero con filtros por período.

## Alcance del MVP

### ✅ Incluye
- ABM de alumnos con turno asignado
- Registro de pagos mensuales (individuales y grupales por familia)
- Generación automática de deudas para alumnos activos sin pago del mes
- Dashboard financiero con KPIs y gráfico temporal (filtrable por período)
- Registro de egresos por categoría
- Registro de asistencia y horas de profesores
- Ventas de productos del club con estado pagado/deuda
- WhatsApp deeplink para contactar deudores
- ABM de productos, turnos y categorías desde Configuración
- Autenticación con roles: admin y profesor
- Vista de profesor: solo su propia asistencia/horas
- PWA instalable en iOS, Android y Desktop

### ❌ Fuera del MVP
- Control de stock de productos
- Facturación electrónica / AFIP
- Notificaciones push
- Vista avanzada de profesores (más allá de sus horas)
- Vinculación egresos ↔ sueldos de profes (calculado automático)
- Foto de alumno

## Usuarios del sistema

| Rol | Dispositivo principal | Contexto de uso |
|---|---|---|
| Admin (dueño) | iPhone | Gestión completa del sistema |
| Admin (co-admin) | Android | Gestión completa del sistema |
| Profesor | Android / cualquier | Solo ve su propia asistencia y horas |

## Identidad visual

- **Primario:** `#05173B` (Prussian Blue — azul oscuro Talleres)
- **Secundario:** `#131E47` (Space Indigo — azul mediano)
- **Acento:** `#3B82F6` (azul eléctrico para CTAs y highlights)
- **Fondo app:** `#FFFFFF` (blanco puro — modo claro)
- **Fondo surface:** `#F8FAFC` (gris muy claro para cards)
- **Texto principal:** `#05173B`
- **Texto secundario:** `#64748B`
- **Borde:** `#E2E8F0`
- **Tipografía:** DM Sans (títulos) / Plus Jakarta Sans (cuerpo)

### Estética general
Modo claro. Fondo blanco. Cards con sombra suave. Acentos en azul Talleres.
Referencia: limpio y moderno como Apple Sports / Withings Health — datos primero, sin decoración innecesaria.
Mobile-first pero completamente funcional en desktop.

## Potencial SaaS futuro
El sistema está diseñado para ser multi-tenant a futuro:
- `configuracion` centraliza nombre, logo y datos del negocio
- Sin datos hardcodeados del club en el código
- Turnos, categorías y productos gestionables desde el panel de configuración
- Roles y usuarios creados desde dentro del sistema (sin registro público)

## Visión a futuro (backlog)
- Foto de alumno en perfil
- RLS y políticas de seguridad por rol (Supabase)
- Vista avanzada de profesores
- Vinculación egresos ↔ sueldos de profes
- Notificaciones push (deudas, recordatorios)
- Multi-tenant / SaaS para otras escuelitas
- Reportes exportables (PDF/Excel)
- Integración WhatsApp API (más allá del deeplink)
