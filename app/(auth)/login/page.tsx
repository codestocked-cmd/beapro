'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Crosshair } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [googleLoading, setGoogleLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      toast.error(error.message)
      return
    }
    router.push('/dashboard')
  }

  async function signInWithGoogle() {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) {
      toast.error(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] p-12">
        <div className="flex items-center gap-2">
          <Crosshair className="w-7 h-7 text-[var(--color-brand)]" />
          <span className="font-display font-bold text-2xl text-[var(--color-text-primary)]">BE A PRO</span>
        </div>
        <div>
          <h1 className="font-display text-5xl font-extrabold text-[var(--color-text-primary)] leading-tight mb-4">
            Intelligence<br />
            <span className="text-[var(--color-brand)]">for Grappling</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg mb-8">
            AI-powered competitive intelligence. Know your opponent before you step on the mat.
          </p>
          <div className="flex items-center gap-3 p-4 bg-[var(--color-bg-elevated)] border border-[var(--color-border-brand)] rounded-xl">
            <div className="text-3xl font-display font-bold text-[var(--color-brand)]">8K+</div>
            <p className="text-[var(--color-text-secondary)] text-sm">hours of fight data<br />analyzed by AI</p>
          </div>
        </div>
        <p className="text-[var(--color-text-muted)] text-xs">© 2025 Be A Pro. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <Crosshair className="w-6 h-6 text-[var(--color-brand)]" />
              <span className="font-display font-bold text-xl text-[var(--color-text-primary)]">BE A PRO</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] font-display">Welcome back</h2>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="text-right">
              <button type="button" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors">
                Forgot password?
              </button>
            </div>
            <Button type="submit" loading={isSubmitting} className="w-full">
              Enter the mat
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-[var(--color-text-muted)] text-xs">or</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>

          <Button variant="secondary" loading={googleLoading} onClick={signInWithGoogle} className="w-full">
            Continue with Google
          </Button>

          <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[var(--color-brand)] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
