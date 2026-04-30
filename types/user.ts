import type { BeltLevel, CompetitionLevel } from './api'

export interface UserProfile {
  id: string
  email: string
  name: string
  belt: BeltLevel
  weight_class: string | null
  competition_level: CompetitionLevel
  photo_url: string | null
  plan: 'starter' | 'pro' | 'elite'
  created_at: string
}

export interface UserSubscription {
  plan: 'starter' | 'pro' | 'elite'
  game_plans_used: number
  game_plans_limit: number | null
  training_uploads_used: number
  training_uploads_limit: number | null
  next_reset_date: string
}
