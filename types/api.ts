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

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black'
export type CompetitionLevel = 'recreational' | 'amateur' | 'competitor' | 'pro'
export type SessionType = 'drilling' | 'sparring' | 'competition'
export type ThreatLevel = 'high' | 'medium' | 'low'
export type InsightType = 'correlation' | 'recommendation' | 'warning'
export type MomentCategory = 'guard_pass' | 'submission' | 'sweep' | 'takedown' | 'escape'
