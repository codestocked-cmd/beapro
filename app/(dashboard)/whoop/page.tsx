'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Lightbulb, AlertTriangle, Link2, Link2Off } from 'lucide-react'
import { toast } from 'sonner'
import { pageVariants } from '@/lib/utils/animations'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { RecoveryPanel, RecoveryPanelSkeleton } from '@/components/whoop/RecoveryPanel'
import { getWhoopStatus, getWhoopDaily, getWhoopCorrelation } from '@/lib/api/whoop'
import { useDisconnectWhoop } from '@/hooks/useWhoop'
import { WHOOP_OAUTH_URL, WHOOP_SCOPES } from '@/lib/constants'
import type { WhoopInsight } from '@/types/whoop'

const insightIcons = {
  correlation: TrendingUp,
  recommendation: Lightbulb,
  warning: AlertTriangle,
}

const insightColors = {
  correlation: 'var(--color-brand)',
  recommendation: 'var(--color-info)',
  warning: 'var(--color-warning)',
}

function InsightCard({ insight }: { insight: WhoopInsight }) {
  const Icon = insightIcons[insight.type]
  return (
    <div className="p-3 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-start gap-3">
      <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: insightColors[insight.type] }} />
      <p className="text-sm text-[var(--color-text-secondary)]">{insight.text}</p>
    </div>
  )
}

export default function WhoopPage() {
  const statusQuery = useQuery({
    queryKey: ['whoop', 'status'],
    queryFn: getWhoopStatus,
  })

  const dailyQuery = useQuery({
    queryKey: ['whoop', 'daily'],
    queryFn: getWhoopDaily,
    enabled: statusQuery.data?.connected === true,
  })

  const correlationQuery = useQuery({
    queryKey: ['whoop', 'correlation', 30],
    queryFn: () => getWhoopCorrelation(30),
    enabled: statusQuery.data?.connected === true,
    staleTime: 1000 * 60 * 30,
  })

  const disconnect = useDisconnectWhoop()

  function connectWhoop() {
    const state = crypto.randomUUID()
    sessionStorage.setItem('whoop_oauth_state', state)
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_WHOOP_CLIENT_ID ?? '',
      redirect_uri: `${window.location.origin}/whoop/callback`,
      response_type: 'code',
      scope: WHOOP_SCOPES,
      state,
    })
    window.location.href = `${WHOOP_OAUTH_URL}?${params}`
  }

  async function handleDisconnect() {
    if (!confirm('Disconnect Whoop? This will remove all correlation data.')) return
    try {
      await disconnect.mutateAsync()
      toast.success('Whoop disconnected')
    } catch {
      toast.error('Failed to disconnect Whoop')
    }
  }

  if (statusQuery.isLoading) return <div className="space-y-4"><RecoveryPanelSkeleton /></div>
  if (statusQuery.error) return <ErrorState message="Failed to load Whoop status" onRetry={() => statusQuery.refetch()} />

  const connected = statusQuery.data?.connected

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader
        title="Whoop"
        subtitle="Biometric correlation with training performance"
        actions={
          connected ? (
            <Button variant="danger" size="sm" loading={disconnect.isPending} onClick={handleDisconnect}>
              <Link2Off className="w-3.5 h-3.5" />Disconnect
            </Button>
          ) : undefined
        }
      />

      {!connected ? (
        <Card>
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-[var(--color-brand)] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-display mb-2">Connect Your Whoop</h2>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-sm mx-auto">
              Correlate your training quality with recovery data to train smarter.
            </p>
            <div className="text-left max-w-xs mx-auto mb-6 space-y-2">
              {['Recovery score, HRV, resting heart rate', 'Sleep performance and duration', 'Daily strain and workout data'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)]">✓</span> {item}
                </div>
              ))}
              <p className="text-xs text-[var(--color-text-muted)] mt-3">We never share your health data with third parties. You can disconnect at any time.</p>
            </div>
            <Button onClick={connectWhoop}>
              <Link2 className="w-4 h-4" />Connect Whoop
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {dailyQuery.isLoading ? (
            <RecoveryPanelSkeleton />
          ) : dailyQuery.data ? (
            <RecoveryPanel data={dailyQuery.data} />
          ) : null}

          {correlationQuery.data && correlationQuery.data.insights.length > 0 && (
            <Card>
              <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-brand)]" />AI Insights
              </h2>
              <div className="space-y-2">
                {correlationQuery.data.insights.map((insight, i) => (
                  <InsightCard key={i} insight={insight} />
                ))}
              </div>
            </Card>
          )}

          {dailyQuery.data && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Today&apos;s Sleep</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Performance</span>
                    <span className="font-mono-data font-semibold text-[var(--color-text-primary)]">{dailyQuery.data.sleep.performance_percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Hours slept</span>
                    <span className="font-mono-data font-semibold text-[var(--color-text-primary)]">{dailyQuery.data.sleep.hours_of_sleep.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Disturbances</span>
                    <span className="font-mono-data font-semibold text-[var(--color-text-primary)]">{dailyQuery.data.sleep.disturbances}</span>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Today&apos;s Strain</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Strain score</span>
                    <span className="font-mono-data font-semibold text-[var(--color-text-primary)]">{dailyQuery.data.strain.score.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Max heart rate</span>
                    <span className="font-mono-data font-semibold text-[var(--color-text-primary)]">{dailyQuery.data.strain.max_heart_rate_bpm} bpm</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
