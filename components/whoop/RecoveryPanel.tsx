'use client'

import { Heart, Activity, Moon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { RECOVERY_HIGH_THRESHOLD, RECOVERY_MID_THRESHOLD } from '@/lib/constants'
import type { WhoopDaily } from '@/types/whoop'

interface RecoveryPanelProps {
  data: WhoopDaily
}

function getRecoveryColor(score: number): string {
  if (score >= RECOVERY_HIGH_THRESHOLD) return 'var(--color-recovery-high)'
  if (score >= RECOVERY_MID_THRESHOLD) return 'var(--color-recovery-mid)'
  return 'var(--color-recovery-low)'
}

function getRecoveryLabel(score: number): string {
  if (score >= RECOVERY_HIGH_THRESHOLD) return 'Well Recovered'
  if (score >= RECOVERY_MID_THRESHOLD) return 'Moderate Recovery'
  return 'Recovery Needed'
}

function getReadinessMessage(score: number): string {
  if (score >= RECOVERY_HIGH_THRESHOLD) return `You're at ${score}% recovery. Good day for intense drilling.`
  if (score >= RECOVERY_MID_THRESHOLD) return `You're at ${score}% recovery. Moderate training recommended.`
  return `You're at ${score}% recovery. Consider active recovery today.`
}

export function RecoveryPanel({ data }: RecoveryPanelProps) {
  const color = getRecoveryColor(data.recovery.score)

  return (
    <Card variant="brand">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest font-medium mb-1">Today&apos;s Recovery</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-6xl font-bold" style={{ color }}>{data.recovery.score}</span>
            <span className="text-[var(--color-text-secondary)] text-lg">%</span>
          </div>
          <p className="text-sm font-medium mt-1" style={{ color }}>{getRecoveryLabel(data.recovery.score)}</p>
          <p className="text-[var(--color-text-secondary)] text-sm mt-2">{getReadinessMessage(data.recovery.score)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[var(--color-danger)]" />
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">HRV</p>
              <p className="text-sm font-semibold font-mono-data text-[var(--color-text-primary)]">{data.recovery.hrv_rmssd_milli.toFixed(1)} ms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--color-info)]" />
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Resting HR</p>
              <p className="text-sm font-semibold font-mono-data text-[var(--color-text-primary)]">{data.recovery.resting_heart_rate_bpm} bpm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-[var(--color-brand)]" />
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Sleep</p>
              <p className="text-sm font-semibold font-mono-data text-[var(--color-text-primary)]">{data.sleep.performance_percentage}%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function RecoveryPanelSkeleton() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Skeleton className="h-3 w-28 mb-3" />
          <Skeleton className="h-16 w-24 mb-2" />
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <div>
                <Skeleton className="h-2 w-8 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
