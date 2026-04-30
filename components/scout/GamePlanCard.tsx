'use client'

import Link from 'next/link'
import { Crosshair } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatRelativeDate } from '@/lib/utils/format'
import { itemVariants } from '@/lib/utils/animations'
import type { ScoutReportSummary } from '@/types/scout'

interface GamePlanCardProps {
  report: ScoutReportSummary
}

export function GamePlanCard({ report }: GamePlanCardProps) {
  const badgeVariant = report.confidence_score >= 70 ? 'success' : report.confidence_score >= 40 ? 'warning' : 'danger'

  return (
    <motion.div variants={itemVariants}>
      <Link href={`/scout/${report.id}`}>
        <Card variant="interactive">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-subtle)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <Crosshair className="w-5 h-5 text-[var(--color-brand)]" />
            </div>
            <Badge variant={badgeVariant}>{report.confidence_score}% confidence</Badge>
          </div>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1 truncate">{report.opponent_name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{formatRelativeDate(report.created_at)}</p>
          {report.status === 'processing' && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
              <span className="text-xs text-[var(--color-brand)]">Processing...</span>
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  )
}

export function GamePlanCardSkeleton() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-24 h-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-36 mb-2" />
      <Skeleton className="h-3 w-20" />
    </Card>
  )
}
