import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,      // 2 min — datos considerados frescos
      gcTime: 1000 * 60 * 10,        // 10 min antes de limpiar del caché
      retry: 2,                       // 2 reintentos ante error de red
      retryDelay: 1000,               // 1 segundo entre reintentos
      refetchOnWindowFocus: false,    // no re-fetch al volver a la pestaña
      refetchOnReconnect: true,       // re-fetch al recuperar conexión (mobile)
      refetchOnMount: true,           // siempre re-fetch al montar el componente
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
