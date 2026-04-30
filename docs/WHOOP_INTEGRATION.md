# Whoop Integration — Be A Pro

## Overview

Be A Pro integrates with the **Whoop Developer Platform v2 API** to correlate athletes' biometric data (recovery, sleep, HRV, strain) with their grappling training quality scores.

Whoop data helps answer: **"Am I training at the right times? Is my recovery aligned with performance?"**

---

## Data Available from Whoop API

| Data Type | Key Metrics |
|---|---|
| **Recovery** | Recovery score (0–100), HRV (RMSSD), Resting HR, Score state (GREEN/YELLOW/RED) |
| **Sleep** | Sleep performance %, Total sleep hours, Sleep stages, Disturbances |
| **Strain** | Daily strain score (0–21), Max HR, Average HR |
| **Workouts** | Activity type, duration, strain, HR data |
| **Cycles** | Day cycles with all above bundled |

---

## OAuth 2.0 Flow

Whoop uses standard OAuth 2.0 with Authorization Code flow.

### Flow Diagram

```
User clicks "Connect Whoop"
         ↓
Frontend → redirects to Whoop OAuth URL
         ↓
Whoop: User logs in + grants permission
         ↓
Whoop → redirects back to: /whoop/callback?code=XXX&state=YYY
         ↓
Next.js /whoop/callback page
  1. Validates state param (CSRF protection)
  2. Sends { code, state } to backend: POST /whoop/connect
         ↓
Backend exchanges code for access_token + refresh_token
Backend stores tokens securely (encrypted in DB)
         ↓
Frontend receives { connected: true }
Redirect to /whoop dashboard
```

---

## Frontend Implementation

### 1. Initiate OAuth (`/app/(dashboard)/whoop/page.tsx`)

```tsx
const connectWhoop = () => {
  const state = crypto.randomUUID(); // CSRF token
  sessionStorage.setItem('whoop_oauth_state', state);

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_WHOOP_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/whoop/callback`,
    response_type: 'code',
    scope: 'offline read:recovery read:sleep read:workout read:profile',
    state,
  });

  window.location.href = `https://api.prod.whoop.com/oauth/oauth2/auth?${params}`;
};
```

**Required Scopes:**
```
offline           # Refresh token (essential for persistent access)
read:recovery     # Recovery scores, HRV, resting HR
read:sleep        # Sleep data + performance scores
read:workout      # Workout/strain data
read:profile      # Basic profile (to display user info)
```

---

### 2. OAuth Callback (`/app/(dashboard)/whoop/callback/page.tsx`)

```tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

export default function WhoopCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      toast({ type: 'error', message: 'Whoop connection cancelled' });
      router.push('/whoop');
      return;
    }

    const savedState = sessionStorage.getItem('whoop_oauth_state');
    if (!state || state !== savedState) {
      toast({ type: 'error', message: 'Invalid state parameter — please try again' });
      router.push('/whoop');
      return;
    }

    sessionStorage.removeItem('whoop_oauth_state');

    // Exchange code via backend
    connectWhoopAPI(code!, state).then(() => {
      toast({ type: 'success', message: 'Whoop connected successfully!' });
      router.push('/whoop');
    }).catch(() => {
      toast({ type: 'error', message: 'Failed to connect Whoop. Please try again.' });
      router.push('/whoop');
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner label="Connecting your Whoop..." />
    </div>
  );
}
```

---

### 3. Whoop Data Hook (`/hooks/useWhoop.ts`)

```tsx
import { useQuery } from '@tanstack/react-query';
import { getWhoopDaily, getWhoopCorrelation } from '@/lib/api/whoop';

export function useWhoopDaily() {
  return useQuery({
    queryKey: ['whoop', 'daily'],
    queryFn: getWhoopDaily,
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
  });
}

export function useWhoopCorrelation(days = 30) {
  return useQuery({
    queryKey: ['whoop', 'correlation', days],
    queryFn: () => getWhoopCorrelation(days),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
```

---

## Data Display Guidelines

### Recovery Score Color Coding

Always display recovery scores with the standard Whoop color system:

```tsx
const getRecoveryColor = (score: number) => {
  if (score >= 67) return 'var(--color-recovery-high)';   // Green
  if (score >= 34) return 'var(--color-recovery-mid)';    // Yellow
  return 'var(--color-recovery-low)';                     // Red
};

const getRecoveryLabel = (score: number) => {
  if (score >= 67) return 'Well Recovered';
  if (score >= 34) return 'Moderate Recovery';
  return 'Recovery Needed';
};
```

### Strain Scale (0–21)

```tsx
const getStrainLabel = (score: number) => {
  if (score < 10) return 'Light Activity';
  if (score < 14) return 'Moderate';
  if (score < 18) return 'Strenuous';
  return 'All Out';
};
```

---

## Correlation Logic (UI-side)

The backend computes correlation scores, but the frontend should display insights clearly:

**Insight Card Component:**

```tsx
type InsightType = 'correlation' | 'recommendation' | 'warning';

interface WhoopInsight {
  type: InsightType;
  text: string;
}

// Example insights from API:
// "Your top 20% training sessions all had recovery > 70%"
// "HRV below 55ms correlates with 18% lower guard retention for you"
// "3 of your last 5 sessions were on recovery scores under 40% — consider rest"
```

**Icon mapping:**
- `correlation` → `TrendingUp` (brand color)
- `recommendation` → `Lightbulb` (info color)
- `warning` → `AlertTriangle` (warning color)

---

## Privacy & Consent UI

Before initiating OAuth, show the user:

```
"We will access the following Whoop data:
 ✓ Recovery score, HRV, resting heart rate
 ✓ Sleep performance and duration
 ✓ Daily strain and workout data

 We never share your health data with third parties.
 You can disconnect Whoop at any time in Settings."
```

Display as a modal confirmation before redirect.

---

## Disconnect Flow

```tsx
// In Settings or Whoop page
const disconnectWhoop = async () => {
  await confirmDialog('Disconnect Whoop? This will remove all Whoop correlation data.');
  await api.delete('/whoop/disconnect');
  queryClient.invalidateQueries({ queryKey: ['whoop'] });
  toast({ type: 'success', message: 'Whoop disconnected' });
};
```

---

## Error Handling

| Error | Frontend Handling |
|---|---|
| Whoop token expired | Backend refreshes automatically; if fails → prompt reconnect |
| User revoked access on Whoop side | Show "Whoop disconnected — reconnect?" banner |
| No data available yet | Show empty state: "No recent data — make sure Whoop is synced" |
| API rate limit | Show cached data with "Last updated X hours ago" label |

---

## Notes for Backend Partner

- Store access_token + refresh_token **encrypted** in Supabase (never expose to frontend)
- Refresh tokens every hour as per Whoop docs
- Request `offline` scope to get refresh token
- Whoop requires app submission/review before public launch — register at `developer.whoop.com`
- Whoop Developer Platform: `https://developer.whoop.com`
- API v2 docs: `https://developer.whoop.com/api/`
- OAuth endpoints: `https://api.prod.whoop.com/oauth/oauth2/`
