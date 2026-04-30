# API Contracts — Be A Pro (Frontend ↔ Backend)

> This document defines the API contracts the frontend expects from the backend.  
> Base URL: `NEXT_PUBLIC_API_BASE_URL` (set per environment)  
> Auth: All endpoints require `Authorization: Bearer {supabase_access_token}` header

---

## Auth

Authentication is handled by **Supabase Auth** on the frontend. The backend receives the Supabase JWT and validates it server-side.

---

## Endpoints

### Athletes / Database Search

#### `GET /athletes/search`

Search the fight database for an athlete by name.

**Query params:**
```
name: string (required, min 2 chars)
limit?: number (default: 10)
```

**Response `200`:**
```json
{
  "athletes": [
    {
      "id": "string",
      "name": "string",
      "belt": "white|blue|purple|brown|black",
      "weight_class": "string",
      "nationality": "string",
      "photo_url": "string | null",
      "fight_count": 42,
      "hours_analyzed": 12.5
    }
  ]
}
```

---

### Scout / Game Plan

#### `POST /scout/analyze`

Trigger AI analysis on a fight video.

**Body:**
```json
{
  "athlete_id": "string | null",       // if searching from DB
  "video_storage_url": "string | null", // if uploaded manually
  "youtube_url": "string | null",       // if YouTube link
  "opponent_name": "string",
  "competition_name": "string | null",
  "event_date": "ISO8601 | null"
}
```

**Response `202`:**
```json
{
  "job_id": "string",
  "status": "queued",
  "estimated_seconds": 180
}
```

---

#### `GET /scout/jobs/{job_id}/status`

Poll job status.

**Response `200`:**
```json
{
  "job_id": "string",
  "status": "queued | processing | complete | failed",
  "progress": 0.65,
  "estimated_seconds_remaining": 60,
  "error": "string | null"
}
```

---

#### `GET /scout/reports/{report_id}`

Fetch a completed game plan report.

**Response `200`:**
```json
{
  "id": "string",
  "created_at": "ISO8601",
  "opponent": {
    "id": "string | null",
    "name": "string",
    "belt": "string",
    "weight_class": "string",
    "photo_url": "string | null"
  },
  "confidence_score": 87,
  "overview": {
    "style_summary": "string",
    "signature_moves": ["string"],
    "guard_preference": "string",
    "passing_preference": "string",
    "win_rate_db": "number | null"
  },
  "threat_assessment": {
    "danger_zones": [
      { "position": "string", "threat_level": "high|medium|low", "description": "string" }
    ],
    "opportunity_zones": [
      { "position": "string", "confidence": "high|medium|low", "description": "string" }
    ]
  },
  "game_plan": {
    "phases": [
      {
        "phase": 1,
        "title": "Grip Fighting & Takedown",
        "instructions": "string",
        "confidence": "high|medium|low"
      }
    ]
  },
  "key_moments": [
    {
      "timestamp_seconds": 154,
      "timestamp_label": "02:34",
      "category": "guard_pass|submission|sweep|takedown|escape",
      "description": "string"
    }
  ],
  "training_recommendations": [
    {
      "technique": "string",
      "reason": "string",
      "priority": "high|medium|low"
    }
  ]
}
```

---

#### `GET /scout/reports`

List all game plans for the authenticated user.

**Query params:**
```
limit?: number (default: 20)
cursor?: string
```

**Response `200`:**
```json
{
  "reports": [
    {
      "id": "string",
      "created_at": "ISO8601",
      "opponent_name": "string",
      "opponent_photo_url": "string | null",
      "confidence_score": 87,
      "status": "complete | processing | failed"
    }
  ],
  "next_cursor": "string | null"
}
```

---

### Training Analysis

#### `POST /training/analyze`

Trigger analysis of a training session video.

**Body:**
```json
{
  "video_storage_url": "string",
  "session_type": "drilling|sparring|competition",
  "session_date": "ISO8601",
  "duration_minutes": 60,
  "notes": "string | null"
}
```

**Response `202`:**
```json
{
  "job_id": "string",
  "status": "queued",
  "estimated_seconds": 240
}
```

---

#### `GET /training/sessions/{session_id}`

Fetch a completed training feedback report.

**Response `200`:**
```json
{
  "id": "string",
  "created_at": "ISO8601",
  "session_date": "ISO8601",
  "session_type": "string",
  "duration_minutes": 60,
  "overall_score": 74,
  "score_delta": +5.2,
  "positives": [
    {
      "observation": "string",
      "timestamp_label": "string | null",
      "category": "string"
    }
  ],
  "improvements": [
    {
      "observation": "string",
      "timestamp_label": "string | null",
      "suggested_drill": "string"
    }
  ],
  "patterns": {
    "position_flow": [
      { "from": "string", "to": "string", "count": 3 }
    ],
    "submission_attempts": [
      { "technique": "string", "attempts": 3, "successes": 1 }
    ],
    "guard_passes": 4,
    "sweeps": 2
  },
  "coach_message": "string"
}
```

---

#### `GET /training/sessions`

List training sessions.

**Query params:** Same pagination as `/scout/reports`

**Response `200`:**
```json
{
  "sessions": [
    {
      "id": "string",
      "session_date": "ISO8601",
      "session_type": "string",
      "duration_minutes": 60,
      "overall_score": 74,
      "status": "complete | processing | failed"
    }
  ],
  "next_cursor": "string | null"
}
```

---

#### `GET /training/progress`

Aggregate progress over time for charts.

**Query params:**
```
days?: number (default: 30)
```

**Response `200`:**
```json
{
  "sessions": [
    { "date": "ISO8601", "score": 74, "session_type": "string" }
  ],
  "trend": "improving|declining|stable",
  "most_improved": "string",
  "needs_work": "string"
}
```

---

### Whoop Integration

#### `GET /whoop/status`

Check if Whoop is connected for the user.

**Response `200`:**
```json
{
  "connected": true,
  "whoop_user_id": "string | null",
  "connected_at": "ISO8601 | null"
}
```

---

#### `POST /whoop/connect`

Exchange OAuth code for tokens (called after OAuth callback).

**Body:**
```json
{
  "code": "string",
  "state": "string"
}
```

**Response `200`:**
```json
{
  "connected": true,
  "whoop_user_id": "string"
}
```

---

#### `DELETE /whoop/disconnect`

Revoke Whoop access.

**Response `200`:**
```json
{ "disconnected": true }
```

---

#### `GET /whoop/daily`

Today's Whoop data.

**Response `200`:**
```json
{
  "date": "ISO8601",
  "recovery": {
    "score": 78,
    "hrv_rmssd_milli": 62.4,
    "resting_heart_rate_bpm": 48,
    "score_state": "GREEN|YELLOW|RED"
  },
  "sleep": {
    "performance_percentage": 84,
    "hours_of_sleep": 7.2,
    "disturbances": 2
  },
  "strain": {
    "score": 14.2,
    "max_heart_rate_bpm": 178
  }
}
```

---

#### `GET /whoop/correlation`

Correlation data between training quality and Whoop metrics.

**Query params:**
```
days?: number (default: 30)
```

**Response `200`:**
```json
{
  "data_points": [
    {
      "date": "ISO8601",
      "training_score": 74,
      "recovery_score": 78,
      "sleep_performance": 84,
      "hrv": 62.4
    }
  ],
  "insights": [
    {
      "type": "correlation|recommendation|warning",
      "text": "string"
    }
  ]
}
```

---

### Jobs (Generic)

#### `GET /jobs/{job_id}`

Universal job status endpoint (works for both scout and training jobs).

**Response:** Same as `/scout/jobs/{job_id}/status`

---

## Error Format

All errors follow this structure:

```json
{
  "error": {
    "code": "ATHLETE_NOT_FOUND | UPLOAD_FAILED | QUOTA_EXCEEDED | ...",
    "message": "Human-readable message",
    "details": {} // optional
  }
}
```

**HTTP Status Codes:**
- `400` — Bad request / validation error
- `401` — Unauthorized (invalid/expired token)
- `402` — Payment required (quota exceeded for free tier)
- `404` — Resource not found
- `422` — Unprocessable entity
- `429` — Rate limited
- `500` — Internal server error
- `503` — Analysis service unavailable

---

## Webhook (Backend → Frontend)

Backend calls this endpoint when an async job completes:

`POST /api/webhooks` (Next.js API Route, internal)

**Headers:**
```
X-Webhook-Secret: {shared secret}
```

**Body:**
```json
{
  "event": "job.complete | job.failed",
  "job_id": "string",
  "user_id": "string",
  "result_id": "string | null",
  "error": "string | null"
}
```

Frontend validates the secret, then emits via **Supabase Realtime** channel to notify the connected browser client in real time.
