'use client'

import { Loader2 } from 'lucide-react'

interface ProcessingStatusProps {
  progress: number
  estimatedSeconds?: number | null
}

export function ProcessingStatus({ progress, estimatedSeconds }: ProcessingStatusProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-[var(--color-border)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[var(--color-brand)] animate-spin" />
        </div>
        <div
          className="absolute inset-0 rounded-full border-4 border-[var(--color-brand)] border-t-transparent"
          style={{ transform: `rotate(${(progress / 100) * 360}deg)` }}
        />
      </div>
      <div className="text-center">
        <p className="text-[var(--color-text-primary)] font-semibold font-display text-lg">Analyzing...</p>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">
          {estimatedSeconds
            ? `~${Math.ceil(estimatedSeconds / 60)} min remaining`
            : 'Processing your video with AI'}
        </p>
      </div>
      <div className="w-64 bg-[var(--color-bg-subtle)] rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full bg-[var(--color-brand)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">{progress}% complete</p>
    </div>
  )
}
