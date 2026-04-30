# Types — Claude Code Context

> All TypeScript types used in the project.
> Always read root `CLAUDE.md` first.

## Rule

All types live in `/types/`. Never define types inline in components or API files.  
Export named types only (no default exports in type files).  
Use `interface` for objects, `type` for unions/derived types.

---

## `types/api.ts` — Generic API Types

```tsx
export interface PaginatedResponse<T> {
  items: T[];
  next_cursor: string | null;
}

export interface JobResponse {
  job_id: string;
  status: 'queued';
  estimated_seconds: number;
}

export interface JobStatus {
  job_id: string;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  progress: number;
  estimated_seconds_remaining: number | null;
  result_id: string | null;
  error: string | null;
}

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type CompetitionLevel = 'recreational' | 'amateur' | 'competitor' | 'pro';
export type SessionType = 'drilling' | 'sparring' | 'competition';
export type ThreatLevel = 'high' | 'medium' | 'low';
export type InsightType = 'correlation' | 'recommendation' | 'warning';
export type MomentCategory = 'guard_pass' | 'submission' | 'sweep' | 'takedown' | 'escape';
```

---

## `types/scout.ts` — Competitor Analysis Types

```tsx
import type { BeltLevel, ThreatLevel, MomentCategory } from './api';

export interface Athlete {
  id: string;
  name: string;
  belt: BeltLevel;
  weight_class: string;
  nationality: string;
  photo_url: string | null;
  fight_count: number;
  hours_analyzed: number;
}

export interface ScoutReportSummary {
  id: string;
  created_at: string;
  opponent_name: string;
  opponent_photo_url: string | null;
  opponent_belt: BeltLevel | null;
  confidence_score: number;
  status: 'complete' | 'processing' | 'failed';
}

export interface ScoutReport extends ScoutReportSummary {
  opponent: {
    id: string | null;
    name: string;
    belt: BeltLevel | null;
    weight_class: string | null;
    photo_url: string | null;
  };
  overview: {
    style_summary: string;
    signature_moves: string[];
    guard_preference: string;
    passing_preference: string;
    win_rate_db: number | null;
  };
  threat_assessment: {
    danger_zones: ThreatZone[];
    opportunity_zones: ThreatZone[];
  };
  game_plan: {
    phases: GamePlanPhase[];
  };
  key_moments: KeyMoment[];
  training_recommendations: TrainingRecommendation[];
}

export interface ThreatZone {
  position: string;
  threat_level: ThreatLevel;
  description: string;
}

export interface GamePlanPhase {
  phase: number;
  title: string;
  instructions: string;
  confidence: ThreatLevel;
}

export interface KeyMoment {
  timestamp_seconds: number;
  timestamp_label: string;
  category: MomentCategory;
  description: string;
}

export interface TrainingRecommendation {
  technique: string;
  reason: string;
  priority: ThreatLevel;
}

export interface AnalyzeOpponentPayload {
  athlete_id?: string;
  video_storage_url?: string;
  youtube_url?: string;
  opponent_name: string;
  competition_name?: string;
  event_date?: string;
}
```

---

## `types/training.ts` — Training Analysis Types

```tsx
import type { SessionType } from './api';

export interface TrainingSessionSummary {
  id: string;
  session_date: string;
  session_type: SessionType;
  duration_minutes: number;
  overall_score: number;
  score_delta: number;
  status: 'complete' | 'processing' | 'failed';
}

export interface TrainingFeedback extends TrainingSessionSummary {
  positives: FeedbackObservation[];
  improvements: FeedbackObservation[];
  patterns: TrainingPatterns;
  coach_message: string;
}

export interface FeedbackObservation {
  observation: string;
  timestamp_label: string | null;
  category: string;
  suggested_drill?: string; // only on improvements
}

export interface TrainingPatterns {
  position_flow: PositionTransition[];
  submission_attempts: SubmissionAttempt[];
  guard_passes: number;
  sweeps: number;
}

export interface PositionTransition {
  from: string;
  to: string;
  count: number;
}

export interface SubmissionAttempt {
  technique: string;
  attempts: number;
  successes: number;
}

export interface TrainingProgress {
  sessions: ProgressDataPoint[];
  trend: 'improving' | 'declining' | 'stable';
  most_improved: string;
  needs_work: string;
}

export interface ProgressDataPoint {
  date: string;
  score: number;
  session_type: SessionType;
}

export interface AnalyzeTrainingPayload {
  video_storage_url: string;
  session_type: SessionType;
  session_date: string;
  duration_minutes: number;
  notes?: string;
}
```

---

## `types/whoop.ts` — Whoop Integration Types

```tsx
export interface WhoopStatus {
  connected: boolean;
  whoop_user_id: string | null;
  connected_at: string | null;
}

export interface WhoopDaily {
  date: string;
  recovery: WhoopRecovery;
  sleep: WhoopSleep;
  strain: WhoopStrain;
}

export interface WhoopRecovery {
  score: number;
  hrv_rmssd_milli: number;
  resting_heart_rate_bpm: number;
  score_state: 'GREEN' | 'YELLOW' | 'RED';
}

export interface WhoopSleep {
  performance_percentage: number;
  hours_of_sleep: number;
  disturbances: number;
}

export interface WhoopStrain {
  score: number;
  max_heart_rate_bpm: number;
}

export interface WhoopCorrelationPoint {
  date: string;
  training_score: number;
  recovery_score: number;
  sleep_performance: number;
  hrv: number;
}

export interface WhoopInsight {
  type: 'correlation' | 'recommendation' | 'warning';
  text: string;
}

export interface WhoopCorrelation {
  data_points: WhoopCorrelationPoint[];
  insights: WhoopInsight[];
}
```

---

## `types/user.ts` — User and Auth Types

```tsx
import type { BeltLevel, CompetitionLevel } from './api';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  belt: BeltLevel;
  weight_class: string | null;
  competition_level: CompetitionLevel;
  photo_url: string | null;
  plan: 'starter' | 'pro' | 'elite';
  created_at: string;
}

export interface UserSubscription {
  plan: 'starter' | 'pro' | 'elite';
  game_plans_used: number;
  game_plans_limit: number | null; // null = unlimited
  training_uploads_used: number;
  training_uploads_limit: number | null;
  next_reset_date: string;
}
```

---

## Global Type Augmentations

```tsx
// types/global.d.ts
declare global {
  // Extend Window if needed for Whoop OAuth callbacks
  interface Window {
    __WHOOP_OAUTH_STATE__?: string;
  }
}

export {};
```
