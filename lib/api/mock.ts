import type { Athlete, ScoutReportSummary, ScoutReport } from '@/types/scout'
import type { TrainingSessionSummary, TrainingFeedback, TrainingProgress } from '@/types/training'
import type { WhoopStatus, WhoopDaily, WhoopCorrelation } from '@/types/whoop'
import type { JobStatus } from '@/types/api'

export const IS_DEMO = !process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL.includes('placeholder')

export const MOCK_ATHLETES: Athlete[] = [
  { id: 'a1', name: 'Gordon Ryan', belt: 'black', weight_class: '-99kg', nationality: 'USA', photo_url: null, fight_count: 112, hours_analyzed: 48 },
  { id: 'a2', name: 'Kaynan Duarte', belt: 'black', weight_class: '-99kg', nationality: 'Brazil', photo_url: null, fight_count: 87, hours_analyzed: 36 },
  { id: 'a3', name: 'Nicholas Meregali', belt: 'black', weight_class: '-100kg', nationality: 'Brazil', photo_url: null, fight_count: 94, hours_analyzed: 41 },
  { id: 'a4', name: 'Felipe Pena', belt: 'black', weight_class: '-94kg', nationality: 'Brazil', photo_url: null, fight_count: 103, hours_analyzed: 45 },
  { id: 'a5', name: 'Andre Galvao', belt: 'black', weight_class: '-88kg', nationality: 'Brazil', photo_url: null, fight_count: 156, hours_analyzed: 62 },
]

export const MOCK_SCOUT_SUMMARIES: ScoutReportSummary[] = [
  {
    id: 'r1',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    opponent_name: 'Gordon Ryan',
    opponent_photo_url: null,
    opponent_belt: 'black',
    confidence_score: 94,
    status: 'complete',
  },
  {
    id: 'r2',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    opponent_name: 'Kaynan Duarte',
    opponent_photo_url: null,
    opponent_belt: 'black',
    confidence_score: 88,
    status: 'complete',
  },
  {
    id: 'r3',
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    opponent_name: 'Nicholas Meregali',
    opponent_photo_url: null,
    opponent_belt: 'black',
    confidence_score: 91,
    status: 'complete',
  },
]

export const MOCK_SCOUT_REPORT: ScoutReport = {
  id: 'r1',
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  opponent_name: 'Gordon Ryan',
  opponent_photo_url: null,
  opponent_belt: 'black',
  confidence_score: 94,
  status: 'complete',
  opponent: {
    id: 'a1',
    name: 'Gordon Ryan',
    belt: 'black',
    weight_class: '-99kg',
    photo_url: null,
  },
  overview: {
    style_summary: 'Highly technical leg lock specialist with elite back take ability. Extremely patient, prefers to control pace and force opponents into his guard system. Known for systematic rear naked choke game from back control.',
    signature_moves: ['Heel hook system', 'Back take via leg entanglement', 'Guillotine from top', 'Kimura trap'],
    guard_preference: 'Half guard / RDLR with leg lock entries',
    passing_preference: 'Knee slice into leg drag, systematic torreando',
    win_rate_db: 89,
  },
  threat_assessment: {
    danger_zones: [
      { position: 'Leg entanglements', threat_level: 'high', description: 'World-class heel hook system. Any 50/50 or outside heel hook position is extremely dangerous. Prioritize keeping feet free.' },
      { position: 'Back control', threat_level: 'high', description: 'Elite back retention and RNC mechanics. Once he has back, expect long control sequences before submission attempt.' },
      { position: 'Top half guard', threat_level: 'medium', description: 'Strong underhook battle. Tends to flatten quickly and advance to mount via leg drag.' },
    ],
    opportunity_zones: [
      { position: 'Standing / takedown', threat_level: 'low', description: 'Prefers guard pull. Forcing a standup battle reduces his advantages early in the match.' },
      { position: 'Early guard passing', threat_level: 'medium', description: 'Before he establishes grips, aggressive passing creates scrambles that disrupt his systematic approach.' },
    ],
  },
  game_plan: {
    phases: [
      { phase: 1, title: 'Control the tie-up', instructions: 'Stay on feet, deny guard pull. Underhook battle, create forward pressure to frustrate early grip fighting.', confidence: 'high' },
      { phase: 2, title: 'Avoid 50/50 at all costs', instructions: 'If he pulls, pass immediately with combat base. Never sit in 50/50. Torreando or knee-cut if guard pull happens.', confidence: 'high' },
      { phase: 3, title: 'Attack single leg from top', instructions: 'When passing, transition to single leg control to prevent back takes. Do not give up wrist control.', confidence: 'medium' },
      { phase: 4, title: 'Kimura trap counter', instructions: 'If he goes to kimura trap, immediately defend with tight elbow to hip and rotate away. Do not try to power out.', confidence: 'medium' },
    ],
  },
  key_moments: [
    { timestamp_seconds: 124, timestamp_label: '2:04', category: 'guard_pass', description: 'Initiates knee slice from combat base after failed guard pull attempt by opponent' },
    { timestamp_seconds: 287, timestamp_label: '4:47', category: 'submission', description: 'Heel hook entry via outside leg entanglement — demonstrates typical transition pattern' },
    { timestamp_seconds: 412, timestamp_label: '6:52', category: 'escape', description: 'Demonstrates back escape sequence — uses hip escape before hooks are fully set' },
    { timestamp_seconds: 598, timestamp_label: '9:58', category: 'takedown', description: 'Successful double leg after 40 seconds of grip fighting — rare but exploitable when tired' },
  ],
  training_recommendations: [
    { technique: 'Leg lock defense — heel hook escape series', reason: 'His #1 finish. Must have systematic defense before this match.', priority: 'high' },
    { technique: 'Back escape mechanics (pre-hook)', reason: 'He takes back frequently. Escape before hooks are fully set.', priority: 'high' },
    { technique: 'Guard pull sprawl / combat base', reason: 'Deny his guard pull to prevent leg entanglement entries.', priority: 'medium' },
    { technique: 'Knee slice pass', reason: 'Primary pass to use against his half guard system.', priority: 'medium' },
    { technique: 'Wrestling tie-ups (collar tie / underhook)', reason: 'Standup battle is your best early match strategy.', priority: 'low' },
  ],
}

export const MOCK_TRAINING_SUMMARIES: TrainingSessionSummary[] = [
  { id: 's1', session_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), session_type: 'sparring', duration_minutes: 90, overall_score: 78, score_delta: 4, status: 'complete' },
  { id: 's2', session_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), session_type: 'drilling', duration_minutes: 60, overall_score: 82, score_delta: 2, status: 'complete' },
  { id: 's3', session_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), session_type: 'competition', duration_minutes: 45, overall_score: 71, score_delta: -3, status: 'complete' },
  { id: 's4', session_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), session_type: 'sparring', duration_minutes: 75, overall_score: 74, score_delta: 1, status: 'complete' },
  { id: 's5', session_date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), session_type: 'drilling', duration_minutes: 60, overall_score: 73, score_delta: 0, status: 'complete' },
]

export const MOCK_TRAINING_FEEDBACK: TrainingFeedback = {
  id: 's1',
  session_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  session_type: 'sparring',
  duration_minutes: 90,
  overall_score: 78,
  score_delta: 4,
  status: 'complete',
  coach_message: "Strong session overall. Your guard retention has improved significantly over the past two weeks — keep drilling the hip escape sequence. The main area holding you back is your guard passing under pressure: you tend to stall in the knee slice when your partner defends actively. Focus next week on chaining knee slice to leg drag when the first pass attempt gets countered.",
  positives: [
    { observation: 'Hip escape and guard recovery from bottom', timestamp_label: '12:30', category: 'Defense', suggested_drill: 'Hip escape drill × 50 reps each side' },
    { observation: 'Back exposure awareness — you consistently stayed chest down when threatened', timestamp_label: '34:15', category: 'Awareness' },
    { observation: 'Collar tie to single leg transition was clean and consistent', timestamp_label: '01:05:20', category: 'Takedown', suggested_drill: 'Level change drill to single leg' },
  ],
  improvements: [
    { observation: 'Knee slice stalls when partner defends with elbow-knee connection', timestamp_label: '08:45', category: 'Passing', suggested_drill: 'Knee slice to leg drag combination × 30 reps' },
    { observation: 'Turtle position — exposing neck during scrambles', timestamp_label: '47:00', category: 'Scrambles', suggested_drill: 'Turtle defense positioning drill' },
    { observation: 'Submission attempts abandoned too early — more follow-through needed on RNC', timestamp_label: '55:30', category: 'Finishing', suggested_drill: 'RNC mechanics — seatbelt + body lock drill' },
  ],
  patterns: {
    position_flow: [
      { from: 'Standing', to: 'Guard', count: 8 },
      { from: 'Guard', to: 'Half Guard', count: 5 },
      { from: 'Half Guard', to: 'Side Control', count: 3 },
      { from: 'Side Control', to: 'Mount', count: 2 },
      { from: 'Mount', to: 'Back', count: 1 },
    ],
    submission_attempts: [
      { technique: 'Triangle', attempts: 4, successes: 1 },
      { technique: 'Armbar', attempts: 3, successes: 0 },
      { technique: 'RNC', attempts: 2, successes: 1 },
      { technique: 'Guillotine', attempts: 2, successes: 0 },
    ],
    guard_passes: 3,
    sweeps: 5,
  },
}

export const MOCK_TRAINING_PROGRESS: TrainingProgress = {
  sessions: Array.from({ length: 20 }, (_, i) => ({
    date: new Date(Date.now() - (19 - i) * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    score: 62 + Math.round(i * 0.7 + Math.sin(i) * 4),
    session_type: (['sparring', 'drilling', 'sparring', 'competition'] as const)[i % 4],
  })),
  trend: 'improving',
  most_improved: 'Guard retention and hip escape mechanics',
  needs_work: 'Guard passing under active resistance',
}

export const MOCK_WHOOP_STATUS: WhoopStatus = {
  connected: true,
  whoop_user_id: 'demo-user-001',
  connected_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
}

export const MOCK_WHOOP_DAILY: WhoopDaily = {
  date: new Date().toISOString().split('T')[0],
  recovery: { score: 74, hrv_rmssd_milli: 68, resting_heart_rate_bpm: 52, score_state: 'GREEN' },
  sleep: { performance_percentage: 81, hours_of_sleep: 7.4, disturbances: 2 },
  strain: { score: 14.2, max_heart_rate_bpm: 172 },
}

export const MOCK_WHOOP_CORRELATION: WhoopCorrelation = {
  data_points: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    training_score: 65 + Math.round(Math.sin(i * 0.8) * 10 + i * 0.5),
    recovery_score: 60 + Math.round(Math.cos(i * 0.6) * 15 + i * 0.3),
    sleep_performance: 72 + Math.round(Math.sin(i * 1.2) * 8),
    hrv: 58 + Math.round(Math.cos(i * 0.9) * 10),
  })),
  insights: [
    { type: 'correlation', text: 'Your best training sessions happen when HRV is above 65ms. Schedule hard sparring on those days.' },
    { type: 'recommendation', text: 'Recovery score has been above 70 for 4 consecutive days — ideal window for high-intensity competition prep.' },
    { type: 'warning', text: 'Sleep under 7 hours correlates with a 14% drop in your guard passing efficiency. Prioritize sleep before tournaments.' },
  ],
}

export const MOCK_JOB_COMPLETE: JobStatus = {
  job_id: 'demo-job-001',
  status: 'complete',
  progress: 100,
  estimated_seconds_remaining: 0,
  result_id: 'r1',
  error: null,
}
