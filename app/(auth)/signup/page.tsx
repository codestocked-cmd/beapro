'use client'

export const dynamic = 'force-dynamic'

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
import { BELT_LEVELS, COMPETITION_LEVELS } from '@/lib/constants'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  belt: z.enum(['white', 'blue', 'purple', 'brown', 'black']),
  competition_level: z.enum(['recreational', 'amateur', 'competitor', 'pro']),
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { belt: 'blue', competition_level: 'competitor' },
  })

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          belt: data.belt,
          competition_level: data.competition_level,
        },
      },
    })
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Account created! Welcome to Be A Pro.')
    router.push('/dashboard')
  }

  const selectClass = `
    bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-2.5
    text-[var(--color-text-primary)] w-full focus:outline-none focus:border-[var(--color-brand)]
    focus:shadow-[0_0_0_3px_var(--color-brand-glow)] transition-all duration-150 capitalize
  `

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] p-12">
        <div className="flex items-center gap-2">
          <Crosshair className="w-7 h-7 text-[var(--color-brand)]" />
          <span className="font-display font-bold text-2xl text-[var(--color-text-primary)]">BE A PRO</span>
        </div>
        <div>
          <h1 className="font-display text-5xl font-extrabold text-[var(--color-text-primary)] leading-tight mb-4">
            Train smarter.<br />
            <span className="text-[var(--color-brand)]">Compete sharper.</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            Join thousands of BJJ athletes using AI to gain the edge before competition.
          </p>
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
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] font-display">Create your account</h2>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Start your competitive intelligence journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full name" placeholder="John Silva" {...register('name')} error={errors.name?.message} />
            <Input label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
            <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">Belt level</label>
              <select {...register('belt')} className={selectClass}>
                {BELT_LEVELS.map((b) => (
                  <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)} Belt</option>
                ))}
              </select>
              {errors.belt && <p className="text-xs text-[var(--color-danger)]">{errors.belt.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">Competition level</label>
              <select {...register('competition_level')} className={selectClass}>
                {COMPETITION_LEVELS.map((l) => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full mt-2">
              Create my account
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--color-brand)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
