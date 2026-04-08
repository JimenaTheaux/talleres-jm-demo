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
    // Obtener sesión inicial
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error || !session?.user) {
        setLoading(false)
        return
      }
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
    })

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          clear()
          return
        }
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

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    clear()
  }

  return { user, perfil, loading, logout }
}
