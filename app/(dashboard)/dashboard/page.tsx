'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Target, Activity } from 'lucide-react'
import { pageVariants, containerVariants } from '@/lib/utils/animations'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { GamePlanCard, GamePlanCardSkeleton } from '@/components/scout/GamePlanCard'
import { RecoveryPanel, RecoveryPanelSkeleton } from '@/components/whoop/RecoveryPanel'
import { getScoutReports } from '@/lib/api/scout'
import { getWhoopStatus, getWhoopDaily } from '@/lib/api/whoop'

export default function DashboardPage() {
  const { data: whoopStatus } = useQuery({
    queryKey: ['whoop', 'status'],
    queryFn: getWhoopStatus,
  })

  const { data: whoopDaily, isLoading: whoopLoading } = useQuery({
    queryKey: ['whoop', 'daily'],
    queryFn: getWhoopDaily,
    enabled: !!whoopStatus?.connected,
  })

  const { data: reportsData, isLoading: reportsLoading, error: reportsError, refetch } = useQuery({
    queryKey: ['scout', 'reports', { limit: 3 }],
    queryFn: () => getScoutReports(3),
    staleTime: 1000 * 60 * 5,
  })

  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader
        title={greeting}
        subtitle={today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      />

      {whoopStatus?.connected ? (
        whoopLoading ? <RecoveryPanelSkeleton /> : whoopDaily ? <RecoveryPanel data={whoopDaily} /> : null
      ) : (
        <div className="p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[var(--color-brand)]" />
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Connect Whoop</p>
              <p className="text-xs text-[var(--color-text-muted)]">Correlate training with biometric data</p>
            </div>
          </div>
          <a href="/whoop" className="text-xs text-[var(--color-brand)] hover:underline font-medium">Connect →</a>
        </div>
      )}

      <QuickActions />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Recent Game Plans</h2>
          <a href="/scout" className="text-xs text-[var(--color-brand)] hover:underline">View all →</a>
        </div>

        {reportsLoading ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <GamePlanCardSkeleton key={i} />)}
          </motion.div>
        ) : reportsError ? (
          <ErrorState message="Failed to load reports" onRetry={refetch} />
        ) : !reportsData?.reports.length ? (
          <EmptyState
            icon={Target}
            title="No game plans yet"
            description="Search for an opponent to generate your first AI game plan"
            cta="Scout an opponent"
            onCtaClick={() => window.location.href = '/scout'}
          />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportsData.reports.map((report) => (
              <GamePlanCard key={report.id} report={report} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
