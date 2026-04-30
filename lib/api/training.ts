import { API_BASE } from '@/lib/constants'
import { APIError } from '@/lib/api/errors'
import { getAuthHeaders } from '@/lib/api/auth'
import { IS_DEMO, MOCK_TRAINING_SUMMARIES, MOCK_TRAINING_FEEDBACK, MOCK_TRAINING_PROGRESS } from '@/lib/api/mock'
import type { TrainingFeedback, TrainingSessionSummary, TrainingProgress, AnalyzeTrainingPayload } from '@/types/training'
import type { JobResponse } from '@/types/api'

export async function analyzeTraining(payload: AnalyzeTrainingPayload): Promise<JobResponse> {
  if (IS_DEMO) {
    return { job_id: 'demo-job-002', status: 'queued', estimated_seconds: 3 }
  }
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/training/analyze`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Analysis failed', res.status)
  }
  return res.json()
}

export async function getTrainingSession(sessionId: string): Promise<TrainingFeedback> {
  if (IS_DEMO) {
    return { ...MOCK_TRAINING_FEEDBACK, id: sessionId }
  }
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/training/sessions/${sessionId}`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Session not found', res.status)
  }
  return res.json()
}

export async function getTrainingSessions(limit = 20, cursor?: string): Promise<{ sessions: TrainingSessionSummary[]; next_cursor: string | null }> {
  if (IS_DEMO) {
    return { sessions: MOCK_TRAINING_SUMMARIES.slice(0, limit), next_cursor: null }
  }
  const headers = await getAuthHeaders()
  const params = new URLSearchParams({ limit: String(limit) })
  if (cursor) params.set('cursor', cursor)
  const res = await fetch(`${API_BASE}/training/sessions?${params}`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Failed to load sessions', res.status)
  }
  return res.json()
}

export async function getTrainingProgress(days = 30): Promise<TrainingProgress> {
  if (IS_DEMO) {
    return MOCK_TRAINING_PROGRESS
  }
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/training/progress?days=${days}`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Failed to load progress', res.status)
  }
  return res.json()
}
