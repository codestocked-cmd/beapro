export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export const MAX_VIDEO_SIZE_MB = 2048
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/avi']
export const JOB_POLL_INTERVAL_MS = 5000

export const WHOOP_OAUTH_URL = 'https://api.prod.whoop.com/oauth/oauth2/auth'
export const WHOOP_SCOPES = 'offline read:recovery read:sleep read:workout read:profile'

export const BELT_LEVELS = ['white', 'blue', 'purple', 'brown', 'black'] as const
export const COMPETITION_LEVELS = ['recreational', 'amateur', 'competitor', 'pro'] as const
export const SESSION_TYPES = ['drilling', 'sparring', 'competition'] as const

export const RECOVERY_HIGH_THRESHOLD = 67
export const RECOVERY_MID_THRESHOLD = 34
