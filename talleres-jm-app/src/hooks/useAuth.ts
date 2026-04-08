import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import type { Perfil } from '@/types/app.types'

async function fetchPerfil(userId: string): Promise<Perfil | null> {
  const { data } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data as Perfil | null
}

export function useAuth() {
  const { user, perfil, loading, setAuth, setLoading, clear } = useAuthStore()

  useEffect(() => {
    // Safety net: si en 7 segundos la sesión no resolvió, salimos del loading
    // Esto cubre el caso de Supabase lento en mobile o red inestable
    const timeout = setTimeout(() => {
      if (useAuthStore.getState().loading) {
        setLoading(false)
      }
    }, 7000)

    // getSession() lee localStorage de forma síncrona y devuelve rápido.
    // Manejamos la sesión inicial aquí para evitar la race condition con
    // onAuthStateChange(INITIAL_SESSION) que dispararía un fetch duplicado.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        clearTimeout(timeout)
        setLoading(false)
        return
      }
      try {
        const p = await fetchPerfil(session.user.id)
        clearTimeout(timeout)
        if (p) {
          setAuth(session.user, p)
        } else {
          // Usuario autenticado pero sin perfil en la DB
          setLoading(false)
        }
      } catch {
        clearTimeout(timeout)
        setLoading(false)
      }
    })

    // onAuthStateChange maneja cambios POSTERIORES a la carga inicial.
    // Saltamos INITIAL_SESSION porque ya lo manejó getSession() arriba.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignorar el evento inicial — ya lo maneja getSession()
        if (event === 'INITIAL_SESSION') return

        if (event === 'SIGNED_OUT' || !session?.user) {
          clear()
          return
        }

        // TOKEN_REFRESHED: el access token rotó pero el perfil no cambia.
        // Evitamos un fetch innecesario si el perfil ya está cargado.
        if (event === 'TOKEN_REFRESHED' && useAuthStore.getState().perfil) {
          return
        }

        // SIGNED_IN u otros eventos: cargar el perfil
        try {
          const p = await fetchPerfil(session.user.id)
          if (p) {
            setAuth(session.user, p)
          } else {
            setLoading(false)
          }
        } catch {
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

  return { user, perfil, loading, logout }
}
