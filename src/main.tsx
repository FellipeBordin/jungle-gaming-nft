
import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { router } from './routes/router'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

async function enableMocks() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser')

    await worker.start()
  }
}

async function bootstrap() {
  await enableMocks()

  ReactDOM.createRoot(
    document.getElementById('root')!,
  ).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  )
}

bootstrap().catch((error: unknown) => {
  console.error('Falha ao iniciar a aplicação:', error)
})
