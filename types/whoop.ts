export interface WhoopStatus {
  connected: boolean
  whoop_user_id: string | null
  connected_at: string | null
}

export interface WhoopRecovery {
  score: number
  hrv_rmssd_milli: number
  resting_heart_rate_bpm: number
  score_state: 'GREEN' | 'YELLOW' | 'RED'
}

export interface WhoopSleep {
  performance_percentage: number
  hours_of_sleep: number
  disturbances: number
}

export interface WhoopStrain {
  score: number
  max_heart_rate_bpm: number
}

export interface WhoopDaily {
  date: string
  recovery: WhoopRecovery
  sleep: WhoopSleep
  strain: WhoopStrain
}

export interface WhoopCorrelationPoint {
  date: string
  training_score: number
  recovery_score: number
  sleep_performance: number
  hrv: number
}

export interface WhoopInsight {
  type: 'correlation' | 'recommendation' | 'warning'
  text: string
}

export interface WhoopCorrelation {
  data_points: WhoopCorrelationPoint[]
  insights: WhoopInsight[]
}
