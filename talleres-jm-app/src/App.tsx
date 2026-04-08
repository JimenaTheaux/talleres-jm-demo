import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

import ProtectedRoute from '@/components/common/ProtectedRoute'
import AdminLayout from '@/components/common/AdminLayout'
import ProfesorLayout from '@/components/common/ProfesorLayout'

// Lazy loading — cada página se carga solo cuando se navega a ella
const LoginPage        = lazy(() => import('@/pages/LoginPage'))
const DashboardPage    = lazy(() => import('@/pages/DashboardPage'))
const AlumnosPage      = lazy(() => import('@/pages/AlumnosPage'))
const PagosPage        = lazy(() => import('@/pages/PagosPage'))
const EgresosPage      = lazy(() => import('@/pages/EgresosPage'))
const AsistenciaPage   = lazy(() => import('@/pages/AsistenciaPage'))
const VentasPage       = lazy(() => import('@/pages/VentasPage'))
const ConfiguracionPage = lazy(() => import('@/pages/ConfiguracionPage'))
const MisHorasPage     = lazy(() => import('@/pages/MisHorasPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function RootRedirect() {
  const { perfil } = useAuthStore()
  if (!perfil) return <Navigate to="/login" replace />
  return <Navigate to={perfil.rol === 'profesor' ? '/mis-horas' : '/dashboard'} replace />
}

function AppRoutes() {
  const { loading } = useAuth()

  if (loading) return <PageLoader />

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard"     element={<DashboardPage />} />
            <Route path="/alumnos"       element={<AlumnosPage />} />
            <Route path="/pagos"         element={<PagosPage />} />
            <Route path="/egresos"       element={<EgresosPage />} />
            <Route path="/asistencia"    element={<AsistenciaPage />} />
            <Route path="/ventas"        element={<VentasPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
          </Route>
        </Route>

        {/* Rutas profesor */}
        <Route element={<ProtectedRoute allowedRoles={['profesor', 'admin', 'superadmin']} />}>
          <Route element={<ProfesorLayout />}>
            <Route path="/mis-horas" element={<MisHorasPage />} />
          </Route>
        </Route>

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
