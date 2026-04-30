import type { BeltLevel, ThreatLevel, MomentCategory } from './api'

export interface Athlete {
  id: string
  name: string
  belt: BeltLevel
  weight_class: string
  nationality: string
  photo_url: string | null
  fight_count: number
  hours_analyzed: number
}

export interface ScoutReportSummary {
  id: string
  created_at: string
  opponent_name: string
  opponent_photo_url: string | null
  opponent_belt: BeltLevel | null
  confidence_score: number
  status: 'complete' | 'processing' | 'failed'
}

export interface ThreatZone {
  position: string
  threat_level: ThreatLevel
  description: string
}

export interface GamePlanPhase {
  phase: number
  title: string
  instructions: string
  confidence: ThreatLevel
}

export interface KeyMoment {
  timestamp_seconds: number
  timestamp_label: string
  category: MomentCategory
  description: string
}

export interface TrainingRecommendation {
  technique: string
  reason: string
  priority: ThreatLevel
}

export interface ScoutReport extends ScoutReportSummary {
  opponent: {
    id: string | null
    name: string
    belt: BeltLevel | null
    weight_class: string | null
    photo_url: string | null
  }
  overview: {
    style_summary: string
    signature_moves: string[]
    guard_preference: string
    passing_preference: string
    win_rate_db: number | null
  }
  threat_assessment: {
    danger_zones: ThreatZone[]
    opportunity_zones: ThreatZone[]
  }
  game_plan: {
    phases: GamePlanPhase[]
  }
  key_moments: KeyMoment[]
  training_recommendations: TrainingRecommendation[]
}

export interface AnalyzeOpponentPayload {
  athlete_id?: string
  video_storage_url?: string
  youtube_url?: string
  opponent_name: string
  competition_name?: string
  event_date?: string
}
