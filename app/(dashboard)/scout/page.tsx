'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Upload, Target } from 'lucide-react'
import { toast } from 'sonner'
import { pageVariants, containerVariants } from '@/lib/utils/animations'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { GamePlanCard, GamePlanCardSkeleton } from '@/components/scout/GamePlanCard'
import { searchAthletes, analyzeOpponent, getScoutReports } from '@/lib/api/scout'
import { useVideoUpload } from '@/hooks/useVideoUpload'
import type { Athlete } from '@/types/scout'

type Mode = 'search' | 'upload'

export default function ScoutPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [opponentName, setOpponentName] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const { upload, progress, status: uploadStatus } = useVideoUpload()

  const { data: searchResults, isLoading: searching } = useQuery({
    queryKey: ['athletes', 'search', searchQuery],
    queryFn: () => searchAthletes(searchQuery),
    enabled: searchQuery.length >= 2,
    staleTime: 1000 * 30,
  })

  const { data: reportsData, isLoading: reportsLoading, error: reportsError, refetch } = useQuery({
    queryKey: ['scout', 'reports'],
    queryFn: () => getScoutReports(20),
    staleTime: 1000 * 60 * 5,
  })

  const analyzeMutation = useMutation({
    mutationFn: analyzeOpponent,
    onSuccess: (data) => {
      router.push(`/scout/${data.job_id}`)
    },
    onError: () => {
      toast.error('Failed to start analysis. Please try again.')
    },
  })

  async function handleAnalyze() {
    if (!opponentName && !selectedAthlete) {
      toast.error('Enter an opponent name')
      return
    }

    let videoStorageUrl: string | undefined

    if (file) {
      try {
        videoStorageUrl = await upload(file, { bucket: 'scout-videos' })
      } catch {
        toast.error('Video upload failed. Please try again.')
        return
      }
    }

    analyzeMutation.mutate({
      athlete_id: selectedAthlete?.id,
      video_storage_url: videoStorageUrl,
      youtube_url: youtubeUrl || undefined,
      opponent_name: selectedAthlete?.name ?? opponentName,
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const isAnalyzing = analyzeMutation.isPending || uploadStatus === 'uploading'

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
      <PageHeader title="Scout" subtitle="Generate AI game plans against your opponents" />

      <div className="p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl text-center text-xs text-[var(--color-text-muted)]">
        8,247 hours analyzed · 3,412 athletes in database · Updated daily
      </div>

      <div className="flex gap-2 p-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl w-fit">
        <button
          onClick={() => setMode('search')}
          className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
            mode === 'search' ? 'bg-[var(--color-brand)] text-[#0A0A0C]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Search className="w-3.5 h-3.5 inline mr-1.5" />Search Database
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
            mode === 'upload' ? 'bg-[var(--color-brand)] text-[#0A0A0C]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Upload className="w-3.5 h-3.5 inline mr-1.5" />Upload Video
        </button>
      </div>

      <Card>
        {mode === 'search' ? (
          <div className="space-y-4">
            <Input
              label="Search competitor"
              placeholder="Search by name (min. 2 characters)..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedAthlete(null) }}
            />
            {searching && <p className="text-sm text-[var(--color-text-muted)]">Searching...</p>}
            {searchResults && !selectedAthlete && (
              <div className="space-y-2">
                {searchResults.map((athlete) => (
                  <button
                    key={athlete.id}
                    onClick={() => { setSelectedAthlete(athlete); setSearchQuery(athlete.name) }}
                    className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-subtle)] transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-xs font-bold text-[var(--color-brand)]">
                      {athlete.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{athlete.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{athlete.belt} belt · {athlete.weight_class}</p>
                    </div>
                    <Badge variant="default">{athlete.fight_count} fights</Badge>
                  </button>
                ))}
              </div>
            )}
            {selectedAthlete && (
              <div className="p-3 bg-[var(--color-brand-glow)] border border-[var(--color-border-brand)] rounded-[var(--radius-md)] flex items-center gap-3">
                <Target className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                <p className="text-sm text-[var(--color-text-primary)]">
                  Selected: <span className="font-semibold text-[var(--color-brand)]">{selectedAthlete.name}</span>
                </p>
                <button onClick={() => setSelectedAthlete(null)} className="ml-auto text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand)]">Change</button>
              </div>
            )}
            <Button
              onClick={handleAnalyze}
              loading={isAnalyzing}
              disabled={!selectedAthlete && searchQuery.length < 2}
              className="w-full"
            >
              <Target className="w-4 h-4" />
              Analyze this fight
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Opponent name"
              placeholder="e.g. Gordon Ryan"
              value={opponentName}
              onChange={(e) => setOpponentName(e.target.value)}
            />
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('file-input')?.click()}
              className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--color-brand)] hover:bg-[var(--color-bg-subtle)] transition-all duration-150"
            >
              <Upload className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-3" />
              {file ? (
                <p className="text-sm text-[var(--color-brand)] font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm text-[var(--color-text-secondary)]">Drop video here or click to browse</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">MP4, MOV, AVI · Max 2GB</p>
                </>
              )}
              <input id="file-input" type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-text-muted)]">or paste YouTube link</span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>
            <Input placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
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
            <Button onClick={handleAnalyze} loading={isAnalyzing} disabled={!opponentName} className="w-full">
              <Target className="w-4 h-4" />
              Analyze this fight
            </Button>
          </div>
        )}
      </Card>

      <div>
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Recent Analyses</h2>
        {reportsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <GamePlanCardSkeleton key={i} />)}
          </div>
        ) : reportsError ? (
          <ErrorState message="Failed to load reports" onRetry={refetch} />
        ) : !reportsData?.reports.length ? (
          <EmptyState icon={Target} title="No analyses yet" description="Start by searching for an opponent above" />
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
