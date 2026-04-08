import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { Rol } from '@/lib/constants'

interface ProtectedRouteProps {
  allowedRoles?: Rol[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, perfil, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-body text-text-secondary">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && perfil && !allowedRoles.includes(perfil.rol as Rol)) {
    const destino = perfil.rol === 'profesor' ? '/mis-horas' : '/login'
    return <Navigate to={destino} replace />
  }

  return <Outlet />
}
