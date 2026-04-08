# 05 — Estructura de Base de Datos (Supabase / PostgreSQL)

> ⚠️ **Nota de desarrollo:** Este esquema NO incluye RLS ni restricciones de seguridad.
> Se agregan en la fase de hardening, una vez que el MVP esté funcionando.

---

## SQL completo — ejecutar en orden en Supabase

```sql
-- ============================================================
-- 1. PERFILES (extiende auth.users de Supabase)
-- ============================================================
CREATE TABLE perfiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  rol         TEXT NOT NULL DEFAULT 'profesor',
  telefono    TEXT,
  activo      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 2. CONFIGURACION
-- ============================================================
CREATE TABLE configuracion (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_negocio    TEXT NOT NULL DEFAULT 'Talleres JM',
  logo_url          TEXT,
  telefono_whatsapp TEXT,
  mensaje_deuda     TEXT DEFAULT 'Hola {tutor}, te recordamos que {alumno} tiene una deuda pendiente por {periodo} de {monto}. Por favor, regularizá tu situación. ¡Gracias!',
  moneda            TEXT DEFAULT 'ARS',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar fila inicial de configuración
INSERT INTO configuracion (nombre_negocio) VALUES ('Talleres JM');


-- ============================================================
-- 3. TURNOS
-- ============================================================
CREATE TABLE turnos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  dias        TEXT NOT NULL,
  horario     TEXT NOT NULL,
  categoria   TEXT,
  activo      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 4. ALUMNOS
-- ============================================================
CREATE TABLE alumnos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  apellido        TEXT NOT NULL,
  fecha_nac       DATE,
  localidad       TEXT,
  domicilio       TEXT,
  telefono        TEXT,
  nombre_tutor    TEXT,
  telefono_tutor  TEXT,
  turno_id        UUID REFERENCES turnos(id),
  activo          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 5. PAGOS
-- ============================================================
CREATE TABLE pagos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  periodo     TEXT NOT NULL,           -- formato YYYY-MM
  fecha_pago  DATE,                    -- null si es deuda sin pagar
  forma_pago  TEXT,                    -- efectivo | transferencia | null
  tipo_pago   TEXT NOT NULL DEFAULT 'mensual',  -- mensual | parcial | adelanto
  total       NUMERIC(10, 2) DEFAULT 0,
  estado      TEXT NOT NULL DEFAULT 'deuda',    -- pagado | deuda | parcial
  observaciones TEXT,
  created_by  UUID REFERENCES perfiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 6. DETALLE PAGO
-- ============================================================
CREATE TABLE detalle_pago (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pago_id         UUID NOT NULL REFERENCES pagos(id) ON DELETE CASCADE,
  alumno_id       UUID NOT NULL REFERENCES alumnos(id),
  subtotal        NUMERIC(10, 2) NOT NULL DEFAULT 0,
  monto_esperado  NUMERIC(10, 2) DEFAULT 0    -- precio del turno al generar la deuda
);


-- ============================================================
-- 7. EGRESOS
-- ============================================================
CREATE TABLE egresos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  periodo     TEXT NOT NULL,           -- formato YYYY-MM
  fecha_egreso DATE NOT NULL,
  categoria   TEXT NOT NULL,           -- sueldos | alquiler | equipamiento | otros
  concepto    TEXT NOT NULL,
  monto       NUMERIC(10, 2) NOT NULL,
  created_by  UUID REFERENCES perfiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 8. ASISTENCIA PROFESORES
-- ============================================================
CREATE TABLE asistencia_profes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profe_id          UUID NOT NULL REFERENCES perfiles(id),
  fecha             DATE NOT NULL,
  hora_entrada      TIME NOT NULL,
  hora_salida       TIME NOT NULL,
  horas_trabajadas  NUMERIC(4, 2),     -- calculado o ingresado manualmente
  observaciones     TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 9. PRODUCTOS
-- ============================================================
CREATE TABLE productos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        TEXT NOT NULL,         -- Remera | Short | Medias | Conjunto
  detalle       TEXT,
  talle         TEXT,
  precio_actual NUMERIC(10, 2) NOT NULL DEFAULT 0,
  foto_url      TEXT,
  activo        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 10. VENTAS
-- ============================================================
CREATE TABLE ventas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id   UUID NOT NULL REFERENCES productos(id),
  alumno_id     UUID REFERENCES alumnos(id),    -- opcional
  precio_venta  NUMERIC(10, 2) NOT NULL,        -- snapshot del precio al vender
  cantidad      INTEGER NOT NULL DEFAULT 1,
  total         NUMERIC(10, 2) NOT NULL,        -- precio_venta × cantidad
  fecha_venta   DATE NOT NULL,
  estado        TEXT NOT NULL DEFAULT 'pagado', -- pagado | deuda
  observaciones TEXT,
  created_by    UUID REFERENCES perfiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- TRIGGERS: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_perfiles
  BEFORE UPDATE ON perfiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_configuracion
  BEFORE UPDATE ON configuracion
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_alumnos
  BEFORE UPDATE ON alumnos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_pagos
  BEFORE UPDATE ON pagos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_productos
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_ventas
  BEFORE UPDATE ON ventas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- ÍNDICES para performance
-- ============================================================
CREATE INDEX idx_alumnos_turno ON alumnos(turno_id);
CREATE INDEX idx_alumnos_activo ON alumnos(activo);
CREATE INDEX idx_pagos_periodo ON pagos(periodo);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_detalle_pago_pago ON detalle_pago(pago_id);
CREATE INDEX idx_detalle_pago_alumno ON detalle_pago(alumno_id);
CREATE INDEX idx_egresos_periodo ON egresos(periodo);
CREATE INDEX idx_egresos_categoria ON egresos(categoria);
CREATE INDEX idx_asistencia_profe ON asistencia_profes(profe_id);
CREATE INDEX idx_ventas_periodo ON ventas(fecha_venta);
CREATE INDEX idx_ventas_estado ON ventas(estado);
```

---

## Diagrama de relaciones

```
perfiles ──────────────────────────────────────────┐
    │                                               │
    │ (created_by)                                  │
    ▼                                               │
pagos ──────────► detalle_pago ──► alumnos ──► turnos
                                                    
egresos ◄── (created_by) ── perfiles               
ventas ──► productos                               
ventas ──► alumnos (opcional)                      
asistencia_profes ──► perfiles                     
configuracion (tabla única, 1 fila)                
```

---

## Notas importantes

### Período (YYYY-MM)
Todos los módulos financieros (pagos, egresos) usan `periodo TEXT` en formato `YYYY-MM`.
En la UI se muestra como "Enero 2025", "Febrero 2025", etc.

```typescript
// utils.ts
export const formatPeriodo = (periodo: string): string => {
  const [year, month] = periodo.split('-')
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  return `${meses[parseInt(month) - 1]} ${year}`
}

export const getCurrentPeriodo = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
```

### Número formateado de montos
```typescript
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
```

### Enum de categorías de egresos (constante en el código)
```typescript
// constants.ts
export const CATEGORIAS_EGRESO = ['sueldos', 'alquiler', 'equipamiento', 'otros'] as const
export type CategoriaEgreso = typeof CATEGORIAS_EGRESO[number]

export const FORMAS_PAGO = ['efectivo', 'transferencia'] as const
export const TIPOS_PAGO = ['mensual', 'parcial', 'adelanto'] as const
export const ESTADOS_PAGO = ['pagado', 'deuda', 'parcial'] as const
export const ROLES = ['admin', 'profesor', 'superadmin'] as const
```

### Lógica "Generar deudas del mes"
```typescript
// pagos.service.ts
export async function generarDeudasMes(periodo: string) {
  // 1. Traer todos los alumnos activos
  const { data: alumnos } = await supabase
    .from('alumnos')
    .select('id')
    .eq('activo', true)

  // 2. Traer alumnos que YA tienen pago o deuda en ese período
  const { data: detallesExistentes } = await supabase
    .from('detalle_pago')
    .select('alumno_id, pagos!inner(periodo)')
    .eq('pagos.periodo', periodo)

  const alumnosConPago = new Set(detallesExistentes?.map(d => d.alumno_id))

  // 3. Filtrar los que no tienen pago
  const alumnosSinPago = alumnos?.filter(a => !alumnosConPago.has(a.id)) ?? []

  // 4. Crear un pago en estado "deuda" con detalle por cada alumno sin pago
  for (const alumno of alumnosSinPago) {
    const { data: pago } = await supabase
      .from('pagos')
      .insert({ periodo, estado: 'deuda', tipo_pago: 'mensual', total: 0 })
      .select()
      .single()

    await supabase
      .from('detalle_pago')
      .insert({ pago_id: pago.id, alumno_id: alumno.id, subtotal: 0, monto_esperado: 0 })
  }

  return alumnosSinPago.length
}
```

### Mensaje WhatsApp deudores
```typescript
// utils.ts
export const buildWhatsAppUrl = (
  telefonoTutor: string,
  template: string,
  vars: { alumno: string; tutor: string; periodo: string; monto: string }
): string => {
  const mensaje = template
    .replace('{alumno}', vars.alumno)
    .replace('{tutor}', vars.tutor)
    .replace('{periodo}', vars.periodo)
    .replace('{monto}', vars.monto)
  const numero = telefonoTutor.replace(/\D/g, '')
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}
```
