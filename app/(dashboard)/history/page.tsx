'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Target, Dumbbell, Clock } from 'lucide-react'
import { pageVariants, containerVariants, itemVariants } from '@/lib/utils/animations'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { getScoutReports } from '@/lib/api/scout'
import { getTrainingSessions } from '@/lib/api/training'
import { formatRelativeDate } from '@/lib/utils/format'

type Filter = 'all' | 'scout' | 'training'

export default function HistoryPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')

  const scoutQuery = useQuery({
    queryKey: ['scout', 'reports', 'history'],
    queryFn: () => getScoutReports(50),
    enabled: filter === 'all' || filter === 'scout',
  })

  const trainingQuery = useQuery({
    queryKey: ['training', 'sessions', 'history'],
    queryFn: () => getTrainingSessions(50),
    enabled: filter === 'all' || filter === 'training',
  })

  const isLoading = (filter === 'all' || filter === 'scout') && scoutQuery.isLoading ||
    (filter === 'all' || filter === 'training') && trainingQuery.isLoading

  const hasError = scoutQuery.error || trainingQuery.error

  type HistoryItem =
    | { kind: 'scout'; id: string; title: string; date: string; score: number; status: string }
    | { kind: 'training'; id: string; title: string; date: string; score: number; status: string }

  const items: HistoryItem[] = [
    ...(filter !== 'training' ? (scoutQuery.data?.reports ?? []).map(r => ({
      kind: 'scout' as const,
      id: r.id,
      title: r.opponent_name,
      date: r.created_at,
      score: r.confidence_score,
      status: r.status,
    })) : []),
    ...(filter !== 'scout' ? (trainingQuery.data?.sessions ?? []).map(s => ({
      kind: 'training' as const,
      id: s.id,
      title: `${s.session_type.charAt(0).toUpperCase() + s.session_type.slice(1)} Session`,
      date: s.session_date,
      score: s.overall_score,
      status: s.status,
    })) : []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader title="History" subtitle="All your analyses in one place" />

      <div className="flex gap-2">
        {(['all', 'scout', 'training'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
              filter === f ? 'bg-[var(--color-brand)] text-[#0A0A0C]' : 'bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : hasError ? (
        <ErrorState message="Failed to load history" onRetry={() => { scoutQuery.refetch(); trainingQuery.refetch() }} />
      ) : items.length === 0 ? (
        <EmptyState icon={Clock} title="No history yet" description="Start by scouting an opponent or uploading a training video" />
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
          {items.map((item) => (
            <motion.div key={`${item.kind}-${item.id}`} variants={itemVariants}>
              <button
                onClick={() => router.push(`/${item.kind === 'scout' ? 'scout' : 'training'}/${item.id}`)}
                className="w-full text-left p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elevated)] transition-all duration-150 flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--color-bg-subtle)] flex items-center justify-center shrink-0">
                  {item.kind === 'scout'
                    ? <Target className="w-4 h-4 text-[var(--color-brand)]" />
                    : <Dumbbell className="w-4 h-4 text-[var(--color-brand)]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{item.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatRelativeDate(item.date)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-display text-lg font-bold text-[var(--color-brand)]">{item.score}</span>
                  {item.status === 'processing' && <Badge variant="warning">Processing</Badge>}
                  {item.status === 'failed' && <Badge variant="danger">Failed</Badge>}
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
