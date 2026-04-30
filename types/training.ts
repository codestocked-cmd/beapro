import type { SessionType } from './api'

export interface TrainingSessionSummary {
  id: string
  session_date: string
  session_type: SessionType
  duration_minutes: number
  overall_score: number
  score_delta: number
  status: 'complete' | 'processing' | 'failed'
}

export interface FeedbackObservation {
  observation: string
  timestamp_label: string | null
  category: string
  suggested_drill?: string
}

export interface PositionTransition {
  from: string
  to: string
  count: number
}

export interface SubmissionAttempt {
  technique: string
  attempts: number
  successes: number
}

export interface TrainingPatterns {
  position_flow: PositionTransition[]
  submission_attempts: SubmissionAttempt[]
  guard_passes: number
  sweeps: number
}

export interface TrainingFeedback extends TrainingSessionSummary {
  positives: FeedbackObservation[]
  improvements: FeedbackObservation[]
  patterns: TrainingPatterns
  coach_message: string
}

export interface ProgressDataPoint {
  date: string
  score: number
  session_type: SessionType
}

export interface TrainingProgress {
  sessions: ProgressDataPoint[]
  trend: 'improving' | 'declining' | 'stable'
  most_improved: string
  needs_work: string
}

export interface AnalyzeTrainingPayload {
  video_storage_url: string
  session_type: SessionType
  session_date: string
  duration_minutes: number
  notes?: string
}
