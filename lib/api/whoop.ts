import { API_BASE } from '@/lib/constants'
import { APIError } from '@/lib/api/errors'
import { getAuthHeaders } from '@/lib/api/auth'
import type { WhoopStatus, WhoopDaily, WhoopCorrelation } from '@/types/whoop'

export async function getWhoopStatus(): Promise<WhoopStatus> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/whoop/status`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Failed to get Whoop status', res.status)
  }
  return res.json()
}

export async function connectWhoop(code: string, state: string): Promise<{ connected: boolean; whoop_user_id: string }> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/whoop/connect`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ code, state }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Failed to connect Whoop', res.status)
  }
  return res.json()
}

export async function disconnectWhoop(): Promise<void> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/whoop/disconnect`, { method: 'DELETE', headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Failed to disconnect Whoop', res.status)
  }
}

export async function getWhoopDaily(): Promise<WhoopDaily> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/whoop/daily`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Failed to get Whoop data', res.status)
  }
  return res.json()
}

export async function getWhoopCorrelation(days = 30): Promise<WhoopCorrelation> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}/whoop/correlation?days=${days}`, { headers })
  if (!res.ok) {
    const err = await res.json()
    throw new APIError(err.error?.code ?? 'UNKNOWN', err.error?.message ?? 'Failed to get correlation data', res.status)
  }
  return res.json()
}
