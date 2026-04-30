'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Crosshair, Clock, Dumbbell, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { pageVariants } from '@/lib/utils/animations'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProcessingStatus } from '@/components/scout/ProcessingStatus'
import { getJobStatus, getScoutReport } from '@/lib/api/scout'
import { APIError } from '@/lib/api/errors'
import { formatDate } from '@/lib/utils/format'
import type { ThreatLevel } from '@/types/api'

interface PageProps {
  params: Promise<{ id: string }>
}

function ThreatBadge({ level }: { level: ThreatLevel }) {
  const map = { high: 'danger', medium: 'warning', low: 'success' } as const
  return <Badge variant={map[level]}>{level}</Badge>
}

export default function ScoutReportPage({ params }: PageProps) {
  const router = useRouter()

  const jobQuery = useQuery({
    queryKey: ['job-or-report', 'check'],
    queryFn: async () => {
      const { id } = await params
      try {
        return { type: 'job' as const, data: await getJobStatus(id), id }
      } catch (e) {
        if (e instanceof APIError && e.status === 404) {
          return { type: 'report' as const, id }
        }
        throw e
      }
    },
    staleTime: 0,
  })

  const isProcessing = jobQuery.data?.type === 'job' &&
    (jobQuery.data.data.status === 'queued' || jobQuery.data.data.status === 'processing')

  const reportId = jobQuery.data?.type === 'job' && jobQuery.data.data.status === 'complete'
    ? jobQuery.data.data.result_id
    : jobQuery.data?.type === 'report'
    ? jobQuery.data.id
    : null

  const reportQuery = useQuery({
    queryKey: ['scout', 'report', reportId],
    queryFn: () => getScoutReport(reportId!),
    enabled: !!reportId,
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => jobQuery.refetch(), 5000)
      return () => clearInterval(interval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing])

  if (jobQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isProcessing && jobQuery.data?.type === 'job') {
    return (
      <ProcessingStatus
        progress={Math.round(jobQuery.data.data.progress * 100)}
        estimatedSeconds={jobQuery.data.data.estimated_seconds_remaining}
      />
    )
  }

  if (reportQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (reportQuery.error || !reportQuery.data) {
    return <ErrorState message="Report not found" onRetry={() => router.push('/scout')} />
  }

  const report = reportQuery.data

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />Back
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Game Plan for</p>
          <h1 className="font-display text-4xl font-bold text-[var(--color-text-primary)]">{report.opponent.name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {report.opponent.belt && <Badge variant="default">{report.opponent.belt} belt</Badge>}
            {report.opponent.weight_class && <Badge variant="default">{report.opponent.weight_class}</Badge>}
            <span className="text-xs text-[var(--color-text-muted)]">{formatDate(report.created_at)}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Confidence</p>
          <span className="font-display text-5xl font-extrabold text-[var(--color-brand)]">{report.confidence_score}%</span>
        </div>
      </div>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--color-brand)]" />Opponent Overview
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm mb-4">{report.overview.style_summary}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[var(--color-text-muted)] text-xs mb-1">Guard Preference</p>
            <p className="text-[var(--color-text-primary)] font-medium">{report.overview.guard_preference}</p>
          </div>
          <div>
            <p className="text-[var(--color-text-muted)] text-xs mb-1">Passing Style</p>
            <p className="text-[var(--color-text-primary)] font-medium">{report.overview.passing_preference}</p>
          </div>
        </div>
        {report.overview.signature_moves.length > 0 && (
          <div className="mt-4">
            <p className="text-[var(--color-text-muted)] text-xs mb-2">Signature Moves</p>
            <div className="flex flex-wrap gap-2">
              {report.overview.signature_moves.map((move) => (
                <Badge key={move} variant="brand">{move}</Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />Threat Assessment
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[var(--color-danger)] uppercase tracking-widest font-medium mb-2">Danger Zones</p>
            <div className="space-y-2">
              {report.threat_assessment.danger_zones.map((z, i) => (
                <div key={i} className="p-3 bg-[rgba(255,77,77,0.05)] border border-[rgba(255,77,77,0.15)] rounded-[var(--radius-md)]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{z.position}</p>
                    <ThreatBadge level={z.threat_level} />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{z.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--color-success)] uppercase tracking-widest font-medium mb-2">Opportunity Zones</p>
            <div className="space-y-2">
              {report.threat_assessment.opportunity_zones.map((z, i) => (
                <div key={i} className="p-3 bg-[rgba(58,255,160,0.05)] border border-[rgba(58,255,160,0.15)] rounded-[var(--radius-md)]">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{z.position}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{z.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card variant="brand">
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[var(--color-brand)]" />Game Plan
        </h2>
        <div className="space-y-3">
          {report.game_plan.phases.map((phase) => (
            <div key={phase.phase} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-[var(--color-brand)] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#0A0A0C]">{phase.phase}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{phase.title}</p>
                  <ThreatBadge level={phase.confidence} />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">{phase.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {report.key_moments.length > 0 && (
        <Card>
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-info)]" />Key Moments
          </h2>
          <div className="space-y-2">
            {report.key_moments.map((moment, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-[var(--radius-md)]">
                <span className="font-mono-data text-xs text-[var(--color-brand)] shrink-0 mt-0.5">{moment.timestamp_label}</span>
                <div className="flex-1">
                  <Badge variant="default" className="mb-1">{moment.category.replace('_', ' ')}</Badge>
                  <p className="text-sm text-[var(--color-text-secondary)]">{moment.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-[var(--color-warning)]" />Training Recommendations
        </h2>
        <div className="space-y-3">
          {report.training_recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-[var(--radius-md)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{rec.technique}</p>
                  <ThreatBadge level={rec.priority} />
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
