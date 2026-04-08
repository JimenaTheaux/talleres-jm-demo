import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import type { Perfil } from '@/types/app.types'

async function fetchPerfil(userId: string): Promise<Perfil | null> {
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error   // propagate — el catch lo maneja
  return data as Perfil | null
}

export function useAuth() {
  const { loading, setAuth, setLoading, clear } = useAuthStore()

  useEffect(() => {
    // Seguridad absoluta: si en 8s no resolvió, salimos del loading
    const timeout = setTimeout(() => {
      if (useAuthStore.getState().loading) {
        console.warn('[useAuth] timeout — forzando loading:false')
        setLoading(false)
      }
    }, 8000)

    // ⚠️  NO usamos getSession() porque puede devolver tokens vencidos
    // del localStorage sin validarlos con el servidor.
    // onAuthStateChange siempre valida/refresca el token ANTES de disparar.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Sin sesión → limpiar y mostrar login
        if (!session?.user) {
          clearTimeout(timeout)
          clear()
          return
        }

        const currentState = useAuthStore.getState()

        // Si ya tenemos al mismo usuario y perfil cargados no re-fetchar
        // Cubre: TOKEN_REFRESHED, SIGNED_IN después de que LoginPage ya seteo el estado
        if (
          currentState.user?.id === session.user.id &&
          currentState.perfil !== null
        ) {
          clearTimeout(timeout)
          // Aseguramos que loading quede en false si quedó colgado
          if (currentState.loading) setLoading(false)
          return
        }

        // INITIAL_SESSION, SIGNED_IN con usuario nuevo → cargar perfil
        try {
          const p = await fetchPerfil(session.user.id)
          clearTimeout(timeout)
          if (p) {
            setAuth(session.user, p)
          } else {
            // Autenticado pero sin perfil en la DB → cerrar sesión
            await supabase.auth.signOut()
            setLoading(false)
          }
        } catch {
          clearTimeout(timeout)
          setLoading(false)
        }
      }
    )

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    clear()
  }

  return { loading, logout }
}
