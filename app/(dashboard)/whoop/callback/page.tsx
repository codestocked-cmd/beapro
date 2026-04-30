'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { connectWhoop } from '@/lib/api/whoop'

export default function WhoopCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      toast.error('Whoop connection cancelled')
      router.push('/whoop')
      return
    }

    const savedState = sessionStorage.getItem('whoop_oauth_state')
    if (!state || state !== savedState) {
      toast.error('Invalid state — please try again')
      router.push('/whoop')
      return
    }

    sessionStorage.removeItem('whoop_oauth_state')

    if (!code) {
      toast.error('No authorization code received')
      router.push('/whoop')
      return
    }

    connectWhoop(code, state)
      .then(() => {
        toast.success('Whoop connected successfully!')
        router.push('/whoop')
      })
      .catch(() => {
        toast.error('Failed to connect Whoop. Please try again.')
        router.push('/whoop')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 text-[var(--color-brand)] animate-spin" />
      <p className="text-[var(--color-text-secondary)] text-sm">Connecting your Whoop...</p>
    </div>
  )
}
