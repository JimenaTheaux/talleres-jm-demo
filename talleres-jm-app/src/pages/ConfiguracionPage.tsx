import { useState } from 'react'
import { Settings } from 'lucide-react'
import ConfigNegocio from '@/components/configuracion/ConfigNegocio'
import UsuariosSection from '@/components/configuracion/UsuariosSection'
import TurnosSection from '@/components/configuracion/TurnosSection'
import ProductosSection from '@/components/configuracion/ProductosSection'

const TABS = [
  { id: 'negocio',   label: 'Negocio' },
  { id: 'usuarios',  label: 'Usuarios' },
  { id: 'turnos',    label: 'Turnos' },
  { id: 'productos', label: 'Productos' },
]

type Tab = 'negocio' | 'usuarios' | 'turnos' | 'productos'

export default function ConfiguracionPage() {
  const [tab, setTab] = useState<Tab>('negocio')

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-primary" />
        <h1 className="text-2xl font-display font-bold text-primary">Configuración</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 bg-surface border border-border rounded-xl p-1 w-fit flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`px-4 py-2 rounded-lg font-body text-sm font-semibold transition-colors ${
              tab === t.id
                ? 'bg-card text-primary shadow-sm border border-border'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'negocio'   && <ConfigNegocio />}
      {tab === 'usuarios'  && <UsuariosSection />}
      {tab === 'turnos'    && <TurnosSection />}
      {tab === 'productos' && <ProductosSection />}
    </div>
  )
}
