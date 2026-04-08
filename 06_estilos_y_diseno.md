# 06 — Estilos y Diseño (Design System)

> Este archivo es la **fuente única de verdad visual** de Talleres JM App.
> Usar en cada prompt a Claude para que no invente estilos propios.

---

## PRINCIPIOS DE DISEÑO

- UI **limpia y operativa** — datos primero, cero decoración innecesaria
- Estética **SaaS moderno modo claro** — como Apple Sports o Linear
- **Mobile-first** — diseñar para iPhone primero, escalar a desktop
- Jerarquía clara: KPIs → listas → acciones
- Botones grandes, legibles, táctiles
- Paleta de azules del Club Talleres sobre fondo blanco

---

## TOKENS DE DISEÑO

### Colores — tailwind.config.ts

```ts
colors: {
  // Marca Talleres JM
  primary:      '#05173B',   // Prussian Blue — color principal, sidebar, títulos
  secondary:    '#131E47',   // Space Indigo — variante oscura
  accent:       '#3B82F6',   // Azul eléctrico — CTAs, links, highlights
  'accent-dark':'#1D4ED8',   // Azul eléctrico oscuro — hover de accent

  // Superficies
  surface:      '#F8FAFC',   // Fondo general de la app
  card:         '#FFFFFF',   // Fondo de cards
  'card-hover': '#F1F5F9',   // Hover sobre cards

  // Texto
  'text-primary':   '#05173B',  // Texto principal
  'text-secondary': '#64748B',  // Texto secundario / labels
  'text-muted':     '#94A3B8',  // Texto muy tenue

  // Bordes
  border:       '#E2E8F0',
  'border-focus': '#3B82F6',

  // Semánticos
  success:      '#16A34A',
  'success-bg': '#F0FDF4',
  error:        '#DC2626',
  'error-bg':   '#FEF2F2',
  warning:      '#D97706',
  'warning-bg': '#FFFBEB',
  info:         '#0284C7',
  'info-bg':    '#F0F9FF',
}
```

### Estados de pago — colores exactos

| Estado | Fondo badge | Color texto/dot |
|--------|-------------|-----------------|
| pagado | `#F0FDF4` | `#16A34A` |
| deuda | `#FEF2F2` | `#DC2626` |
| parcial | `#FFFBEB` | `#D97706` |

---

## TIPOGRAFÍA

Importar desde Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

| Uso | Font | Tailwind |
|-----|------|---------|
| Títulos / display | DM Sans | `font-display text-3xl font-extrabold` |
| Subtítulos | DM Sans | `font-display text-lg font-bold` |
| Cuerpo | Plus Jakarta Sans | `font-body text-sm font-normal` |
| Labels | Plus Jakarta Sans | `font-body text-xs font-medium uppercase tracking-wide` |
| Números KPI | DM Sans | `font-display text-4xl font-black` |
| Badge / chip | Plus Jakarta Sans | `font-body text-[11px] font-semibold` |

```ts
// tailwind.config.ts
fontFamily: {
  display: ['DM Sans', 'sans-serif'],
  body:    ['Plus Jakarta Sans', 'sans-serif'],
}
```

---

## ESPACIADO

Múltiplos de 4 únicamente.

| Token | px | Tailwind |
|-------|----|---------|
| xs | 4 | `p-1` |
| sm | 8 | `p-2` |
| md | 16 | `p-4` |
| lg | 24 | `p-6` |
| xl | 32 | `p-8` |
| 2xl | 48 | `p-12` |

---

## BORDES Y RADIOS

| Uso | Clase |
|-----|-------|
| Inputs, small elements | `rounded-lg` |
| Cards | `rounded-2xl` |
| Modales | `rounded-2xl` |
| Botones | `rounded-xl` |
| Badges / pills | `rounded-full` |
| Avatar / círculos | `rounded-full` |

---

## SOMBRAS

| Estado | Clase |
|--------|-------|
| Card base | `shadow-sm` |
| Card hover | `shadow-md` |
| Modal | `shadow-xl` |
| Sidebar (mobile) | `shadow-2xl` |

---

## GRADIENTES

```css
/* Sidebar y headers principales */
background: linear-gradient(135deg, #05173B 0%, #131E47 100%);

/* Card de KPI destacada */
background: linear-gradient(135deg, #131E47 0%, #1e3a6e 100%);
```

---

## COMPONENTES

### Card base
```tsx
className="bg-white rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-all duration-200"
```

### Card KPI
```tsx
// KPI normal
className="bg-white rounded-2xl p-5 shadow-sm border border-border"
// Label
className="text-xs font-body font-medium uppercase tracking-wide text-text-secondary"
// Número
className="text-4xl font-display font-black text-primary mt-1"
// KPI destacada (invertida, fondo azul)
className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-5 shadow-md"
// Número en KPI invertida
className="text-4xl font-display font-black text-white mt-1"
```

### Badge de estado pago
```tsx
// Aplicar colores inline según la tabla de estados
<span
  style={{ background: estadoColors[estado].bg, color: estadoColors[estado].text }}
  className="text-[11px] font-body font-semibold px-2.5 py-0.5 rounded-full"
>
  ● {estado.toUpperCase()}
</span>
```

### Botones

**Primary** (acción principal)
```tsx
className="bg-accent text-white px-5 py-2.5 rounded-xl font-display font-semibold text-sm hover:bg-accent-dark transition-colors"
```

**Secondary** (acción secundaria)
```tsx
className="bg-white text-primary border border-border px-5 py-2.5 rounded-xl font-display font-semibold text-sm hover:bg-surface transition-colors"
```

**Destructivo**
```tsx
className="bg-error-bg text-error border border-error/20 px-5 py-2.5 rounded-xl font-display font-semibold text-sm hover:bg-red-100 transition-colors"
```

**WhatsApp**
```tsx
className="bg-[#25D366] text-white px-4 py-2 rounded-xl font-display font-semibold text-sm flex items-center gap-2 hover:bg-[#1ebe59] transition-colors"
```

**Ghost / icono**
```tsx
className="p-2 rounded-lg text-text-secondary hover:bg-surface hover:text-primary transition-colors"
```

### Input
```tsx
className="w-full bg-surface rounded-xl px-4 py-2.5 text-sm font-body border border-border focus:ring-2 focus:ring-accent/30 focus:border-accent focus:outline-none transition-all placeholder:text-text-muted"
```

### Select
```tsx
className="w-full bg-surface rounded-xl px-4 py-2.5 text-sm font-body border border-border focus:ring-2 focus:ring-accent/30 focus:border-accent focus:outline-none"
```

### Tabla
```tsx
// Contenedor
className="w-full overflow-x-auto rounded-2xl border border-border"
// th
className="text-xs font-body font-medium uppercase tracking-wide text-text-secondary px-4 py-3 text-left bg-surface"
// td
className="text-sm font-body px-4 py-3.5 border-t border-border text-text-primary"
// tr hover
className="hover:bg-surface/60 transition-colors"
```

### Modal / Drawer
```tsx
// Overlay
className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
// Panel
className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-auto"
```

---

## LAYOUT

### Desktop (≥ 1024px)
```
┌──────────┬─────────────────────────────────┐
│          │                                  │
│ Sidebar  │       Main Content               │
│  w-64    │       ml-64 p-8                 │
│ bg-grad  │       bg-surface                │
│          │                                  │
└──────────┴─────────────────────────────────┘
```

### Mobile (< 1024px)
```
┌─────────────────────────┐
│       Topbar h-14       │
├─────────────────────────┤
│                         │
│    Main Content p-4     │
│                         │
├─────────────────────────┤
│  Bottom Nav (opcional)  │
└─────────────────────────┘
```

### Sidebar (desktop)
```tsx
className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-primary to-secondary flex flex-col z-40"
// Logo area
className="p-6 border-b border-white/10"
// Nav item base
className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all font-body text-sm"
// Nav item activo
className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl bg-white/15 text-white font-semibold text-sm"
// Logout (bottom)
className="p-4 border-t border-white/10 mt-auto"
```

### Topbar (mobile)
```tsx
className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 z-40"
```

### Grillas de KPIs
```tsx
// Mobile: 2 columnas / Desktop: 4 columnas
className="grid grid-cols-2 lg:grid-cols-4 gap-4"
```

---

## NAMING DE COMPONENTES

| Componente | Nombre |
|------------|--------|
| Card KPI | `KpiCard` |
| Badge estado pago | `BadgePago` |
| Fila de tabla | `TableRow` |
| Modal formulario | `FormModal` |
| Layout admin | `AdminLayout` |
| Layout profesor | `ProfesorLayout` |
| Selector de período | `PeriodoPicker` |
| Botón WhatsApp | `WhatsAppButton` |

**Regla:** si un elemento se repite 2 veces → crear componente reutilizable.

---

## ANTI-PATTERNS — nunca hacer esto

- No usar fondos oscuros (dark mode) — la app es modo claro
- No inventar colores fuera de la paleta definida
- No usar Inter, Roboto ni Arial — usar DM Sans y Plus Jakarta Sans
- No usar colores de estado diferentes a los definidos en la tabla
- No usar más de 2 acciones principales por vista en mobile
- No usar valores arbitrarios de Tailwind salvo `text-[11px]` definido aquí
- No poner sombras excesivas — `shadow-sm` es el estándar
- No usar modales para acciones simples — preferir inline o página nueva

---

## ICONOGRAFÍA

Usar exclusivamente **lucide-react**.
Tamaños estándar: `size={16}` (inline), `size={20}` (botones), `size={24}` (nav).

```tsx
import { Users, CreditCard, TrendingDown, ShoppingBag, Clock, Settings, LayoutDashboard, MessageCircle } from 'lucide-react'

// Iconos por sección
Dashboard    → LayoutDashboard
Alumnos      → Users
Pagos        → CreditCard
Egresos      → TrendingDown
Ventas       → ShoppingBag
Asistencia   → Clock
Configuración → Settings
WhatsApp     → MessageCircle
```

---

## REGLA FINAL PARA CLAUDE EN VSCODE

Al generar cualquier componente de UI:

1. Usar este archivo como referencia — no inventar estilos
2. Respetar la paleta: azul Talleres (`#05173B`) sobre blanco
3. Tipografía: DM Sans para títulos, Plus Jakarta Sans para cuerpo
4. Modo claro siempre — fondo `#F8FAFC`, cards blancas
5. Mobile-first: pensar en iPhone primero
6. Botones de acción: mínimo 44px de altura
7. Todo estado vacío: mostrar mensaje + ícono de Lucide
8. Confirmar antes de cualquier acción destructiva
9. Todo número de dinero: usar `formatCurrency()` de utils.ts
10. Todo período: usar `formatPeriodo()` de utils.ts
