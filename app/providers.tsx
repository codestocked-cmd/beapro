'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { APIError } from '@/lib/api/errors'

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error instanceof APIError && (error.status === 401 || error.status === 402)) return false
              return failureCount < 2
            },
            onError: (error: unknown) => {
              if (error instanceof APIError) {
                if (error.status === 401) router.push('/login')
                if (error.status === 402) router.push('/settings?upgrade=true')
              }
            },
          } as Parameters<QueryClient['setDefaultOptions']>[0]['queries'],
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
