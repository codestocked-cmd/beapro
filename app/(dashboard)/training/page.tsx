'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, Dumbbell, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { toast } from 'sonner'
import { pageVariants, containerVariants, itemVariants } from '@/lib/utils/animations'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { analyzeTraining, getTrainingSessions, getTrainingProgress } from '@/lib/api/training'
import { useVideoUpload } from '@/hooks/useVideoUpload'
import { formatDate, formatDuration } from '@/lib/utils/format'
import { SESSION_TYPES } from '@/lib/constants'

export default function TrainingPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [sessionType, setSessionType] = useState<'drilling' | 'sparring' | 'competition'>('sparring')
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0])
  const [duration, setDuration] = useState('60')
  const [notes, setNotes] = useState('')

  const { upload, progress, status: uploadStatus } = useVideoUpload()

  const { data: sessionsData, isLoading: sessionsLoading, error: sessionsError, refetch } = useQuery({
    queryKey: ['training', 'sessions'],
    queryFn: () => getTrainingSessions(20),
    staleTime: 1000 * 60 * 5,
  })

  const { data: progressData } = useQuery({
    queryKey: ['training', 'progress'],
    queryFn: () => getTrainingProgress(30),
    staleTime: 1000 * 60 * 15,
  })

  const analyzeMutation = useMutation({
    mutationFn: analyzeTraining,
    onSuccess: (data) => router.push(`/training/${data.job_id}`),
    onError: () => toast.error('Failed to start analysis.'),
  })

  async function handleAnalyze() {
    if (!file) { toast.error('Select a video first'); return }
    let videoStorageUrl: string
    try {
      videoStorageUrl = await upload(file, { bucket: 'training-videos' })
    } catch {
      toast.error('Upload failed')
      return
    }
    analyzeMutation.mutate({
      video_storage_url: videoStorageUrl,
      session_type: sessionType,
      session_date: sessionDate,
      duration_minutes: parseInt(duration) || 60,
      notes: notes || undefined,
    })
  }

  const TrendIcon = progressData?.trend === 'improving' ? TrendingUp : progressData?.trend === 'declining' ? TrendingDown : Minus

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader title="Training" subtitle="Upload and analyze your training sessions" />

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-[var(--color-brand)]" />New Session
        </h2>
        <div className="space-y-4">
          <div
            onClick={() => document.getElementById('training-file')?.click()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]) }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-brand)] hover:bg-[var(--color-bg-subtle)] transition-all"
          >
            <Upload className="w-6 h-6 text-[var(--color-text-muted)] mx-auto mb-2" />
            {file ? (
              <p className="text-sm text-[var(--color-brand)] font-medium">{file.name}</p>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">Drop training video here or click to browse</p>
            )}
            <input id="training-file" type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
          </div>

          <div className="flex flex-wrap gap-2">
            {SESSION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setSessionType(t)}
                className={`px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium transition-all ${
                  sessionType === t ? 'bg-[var(--color-brand)] text-[#0A0A0C]' : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Session date" type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
            <Input label="Duration (min)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>

          <Input label="Notes (optional)" placeholder="What did you focus on today?" value={notes} onChange={(e) => setNotes(e.target.value)} />

          {uploadStatus === 'uploading' && (
            <div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                <span>Uploading...</span><span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-[var(--color-bg-subtle)] rounded-full">
                <div className="h-1.5 bg-[var(--color-brand)] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <Button onClick={handleAnalyze} loading={analyzeMutation.isPending || uploadStatus === 'uploading'} disabled={!file} className="w-full">
            Analyze session
          </Button>
        </div>
      </Card>

      {progressData && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--color-text-primary)]">30-Day Progress</h2>
            <div className="flex items-center gap-1.5">
              <TrendIcon className={`w-4 h-4 ${progressData.trend === 'improving' ? 'text-[var(--color-success)]' : progressData.trend === 'declining' ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-muted)]'}`} />
              <span className="text-sm font-medium capitalize text-[var(--color-text-secondary)]">{progressData.trend}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-[rgba(58,255,160,0.05)] border border-[rgba(58,255,160,0.15)] rounded-[var(--radius-md)]">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Most Improved</p>
              <p className="font-medium text-[var(--color-success)]">{progressData.most_improved}</p>
            </div>
            <div className="p-3 bg-[rgba(255,184,48,0.05)] border border-[rgba(255,184,48,0.15)] rounded-[var(--radius-md)]">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Needs Work</p>
              <p className="font-medium text-[var(--color-warning)]">{progressData.needs_work}</p>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Session History</h2>
        {sessionsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : sessionsError ? (
          <ErrorState message="Failed to load sessions" onRetry={refetch} />
        ) : !sessionsData?.sessions.length ? (
          <EmptyState icon={Dumbbell} title="No sessions yet" description="Upload your first training video above" />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
            {sessionsData.sessions.map((session) => (
              <motion.div key={session.id} variants={itemVariants}>
                <button
                  onClick={() => router.push(`/training/${session.id}`)}
                  className="w-full text-left p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elevated)] transition-all duration-150 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-subtle)] flex items-center justify-center shrink-0">
                    <Dumbbell className="w-5 h-5 text-[var(--color-brand)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] capitalize">{session.session_type} · {formatDuration(session.duration_minutes)}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{formatDate(session.session_date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-xl font-bold text-[var(--color-brand)]">{session.overall_score}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">score</p>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
