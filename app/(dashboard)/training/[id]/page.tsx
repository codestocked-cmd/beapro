'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react'
import { pageVariants } from '@/lib/utils/animations'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProcessingStatus } from '@/components/scout/ProcessingStatus'
import { getJobStatus } from '@/lib/api/scout'
import { getTrainingSession } from '@/lib/api/training'
import { APIError } from '@/lib/api/errors'
import { formatDate, formatDuration } from '@/lib/utils/format'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TrainingFeedbackPage({ params }: PageProps) {
  const router = useRouter()

  const jobQuery = useQuery({
    queryKey: ['training-job-check'],
    queryFn: async () => {
      const { id } = await params
      try {
        return { type: 'job' as const, data: await getJobStatus(id), id }
      } catch (e) {
        if (e instanceof APIError && e.status === 404) return { type: 'session' as const, id }
        throw e
      }
    },
    staleTime: 0,
  })

  const isProcessing = jobQuery.data?.type === 'job' &&
    (jobQuery.data.data.status === 'queued' || jobQuery.data.data.status === 'processing')

  const sessionId = jobQuery.data?.type === 'job' && jobQuery.data.data.status === 'complete'
    ? jobQuery.data.data.result_id
    : jobQuery.data?.type === 'session'
    ? jobQuery.data.id
    : null

  const sessionQuery = useQuery({
    queryKey: ['training', 'session', sessionId],
    queryFn: () => getTrainingSession(sessionId!),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => jobQuery.refetch(), 5000)
      return () => clearInterval(interval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing])

  if (jobQuery.isLoading) return <Skeleton className="h-64 w-full" />

  if (isProcessing && jobQuery.data?.type === 'job') {
    return (
      <ProcessingStatus
        progress={Math.round(jobQuery.data.data.progress * 100)}
        estimatedSeconds={jobQuery.data.data.estimated_seconds_remaining}
      />
    )
  }

  if (sessionQuery.isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )

  if (sessionQuery.error || !sessionQuery.data) return <ErrorState message="Session not found" onRetry={() => router.push('/training')} />

  const session = sessionQuery.data

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />Back
      </Button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)] capitalize">{session.session_type} Session</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-sm text-[var(--color-text-muted)]">{formatDate(session.session_date)}</span>
            <span className="text-[var(--color-border)]">·</span>
            <span className="text-sm text-[var(--color-text-muted)]">{formatDuration(session.duration_minutes)}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Score</p>
          <span className="font-display text-5xl font-extrabold text-[var(--color-brand)]">{session.overall_score}</span>
          {session.score_delta !== 0 && (
            <p className={`text-sm font-medium ${session.score_delta > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {session.score_delta > 0 ? '+' : ''}{session.score_delta.toFixed(1)} vs avg
            </p>
          )}
        </div>
      </div>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />What You Did Well
        </h2>
        <div className="space-y-3">
          {session.positives.map((obs, i) => (
            <div key={i} className="p-3 bg-[rgba(58,255,160,0.05)] border border-[rgba(58,255,160,0.15)] rounded-[var(--radius-md)]">
              <div className="flex items-center gap-2 mb-1">
                {obs.timestamp_label && <span className="font-mono-data text-xs text-[var(--color-brand)]">{obs.timestamp_label}</span>}
                <Badge variant="success">{obs.category}</Badge>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">{obs.observation}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />Areas to Improve
        </h2>
        <div className="space-y-3">
          {session.improvements.map((obs, i) => (
            <div key={i} className="p-3 bg-[rgba(255,184,48,0.05)] border border-[rgba(255,184,48,0.15)] rounded-[var(--radius-md)]">
              {obs.timestamp_label && <span className="font-mono-data text-xs text-[var(--color-brand)]">{obs.timestamp_label}</span>}
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{obs.observation}</p>
              {obs.suggested_drill && (
                <p className="text-xs text-[var(--color-warning)] mt-2 font-medium">→ Drill: {obs.suggested_drill}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card variant="brand">
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[var(--color-brand)]" />AI Coach Message
        </h2>
        <p className="text-[var(--color-text-secondary)]">{session.coach_message}</p>
      </Card>
    </motion.div>
  )
}
