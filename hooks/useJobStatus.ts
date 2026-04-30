'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getJobStatus } from '@/lib/api/scout'
import { JOB_POLL_INTERVAL_MS } from '@/lib/constants'
import type { JobStatus } from '@/types/api'

interface UseJobStatusOptions {
  onComplete?: (resultId: string) => void
  onError?: (error: string) => void
}

export function useJobStatus(jobId: string | null, options?: UseJobStatusOptions) {
  const query = useQuery<JobStatus>({
    queryKey: ['job', jobId],
    queryFn: () => getJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return JOB_POLL_INTERVAL_MS
      if (data.status === 'complete' || data.status === 'failed') return false
      return JOB_POLL_INTERVAL_MS
    },
  })

  useEffect(() => {
    if (!query.data) return
    if (query.data.status === 'complete' && query.data.result_id) {
      options?.onComplete?.(query.data.result_id)
    }
    if (query.data.status === 'failed') {
      options?.onError?.(query.data.error ?? 'Analysis failed')
    }
  }, [query.data?.status])

  return {
    status: query.data?.status ?? 'queued',
    progress: query.data?.progress ?? 0,
    resultId: query.data?.result_id,
    estimatedSeconds: query.data?.estimated_seconds_remaining,
    isLoading: query.isLoading,
    error: query.error,
  }
}
