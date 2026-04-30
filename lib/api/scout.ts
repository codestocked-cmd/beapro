import { API_BASE } from '@/lib/constants'
import { APIError } from '@/lib/api/errors'
import { getAuthHeaders } from '@/lib/api/auth'
import { IS_DEMO, MOCK_ATHLETES, MOCK_SCOUT_SUMMARIES, MOCK_SCOUT_REPORT, MOCK_JOB_COMPLETE } from '@/lib/api/mock'
import type { Athlete, ScoutReport, ScoutReportSummary, AnalyzeOpponentPayload } from '@/types/scout'
import type { JobResponse, JobStatus } from '@/types/api'

export async function searchAthletes(name: string): Promise<Athlete[]> {
  if (IS_DEMO) {
    return MOCK_ATHLETES.filter((a) => a.name.toLowerCase().includes(name.toLowerCase()))
  }
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/athletes/search?name=${encodeURIComponent(name)}&limit=10`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Search failed', res.status)
  }
  const data = await res.json()
  return data.athletes
}

export async function analyzeOpponent(payload: AnalyzeOpponentPayload): Promise<JobResponse> {
  if (IS_DEMO) {
    return { job_id: 'demo-job-001', status: 'queued', estimated_seconds: 3 }
  }
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/scout/analyze`, {
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

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  if (IS_DEMO) {
    return MOCK_JOB_COMPLETE
  }
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/jobs/${jobId}`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Job not found', res.status)
  }
  return res.json()
}

export async function getScoutReport(reportId: string): Promise<ScoutReport> {
  if (IS_DEMO) {
    const mock = { ...MOCK_SCOUT_REPORT, id: reportId }
    return mock
  }
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/scout/reports/${reportId}`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Report not found', res.status)
  }
  return res.json()
}

export async function getScoutReports(limit = 20, cursor?: string): Promise<{ reports: ScoutReportSummary[]; next_cursor: string | null }> {
  if (IS_DEMO) {
    return { reports: MOCK_SCOUT_SUMMARIES.slice(0, limit), next_cursor: null }
  }
  const headers = await getAuthHeaders()
  const params = new URLSearchParams({ limit: String(limit) })
  if (cursor) params.set('cursor', cursor)
  const res = await fetch(`${API_BASE}/scout/reports?${params}`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Failed to load reports', res.status)
  }
  return res.json()
}
