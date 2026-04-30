# App Router — Claude Code Context

> Context for `/app/` directory.
> Always read root `CLAUDE.md` first.

## Route Groups

```
(auth)      → No layout wrapper. Full-screen split: left branding, right form.
(dashboard) → Sidebar + Topbar layout shell. All authenticated pages live here.
api/        → Next.js API Routes (server-side only: Whoop OAuth, webhooks)
```

---

## Auth Pages

### `/login`
- Split layout: left panel (brand) + right panel (form)
- Left: logo, tagline "Intelligence for Grappling", stat "8,000+ hours analyzed"
- Left background: `bg-[#0A0A0C]` with brand color bottom accent line
- Right: email + password + "Enter the mat" CTA + Google SSO + link to signup
- If user is already logged in → redirect to `/dashboard`

### `/signup`  
- Same split layout
- Form fields: name, email, password, belt level (select), competition level (select)
- Belt options: White, Blue, Purple, Brown, Black
- Competition level: Recreational, Amateur, Competitor, Pro
- CTA: "Create my account"
- After signup → redirect to `/dashboard`

---

## Dashboard Layout (`(dashboard)/layout.tsx`)

```tsx
// This layout wraps ALL dashboard pages
// Must handle: auth check, sidebar, topbar, mobile nav

export default async function DashboardLayout({ children }) {
  // Server-side auth check
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)] overflow-hidden">
      <Sidebar />                          {/* desktop only, 240px */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />                         {/* 64px height */}
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />                        {/* mobile only, fixed bottom */}
    </div>
  );
}
```

---

## Page Standard Structure

Every dashboard page follows this exact pattern:

```tsx
'use client'; // only if needed (data fetching pages = yes)

import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/utils/animations';
import { PageHeader } from '@/components/ui/PageHeader';

export default function PageName() {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader 
        title="Page Title" 
        subtitle="Optional subtitle"
        actions={<Button>Optional CTA</Button>}
      />
      
      {/* Page content */}
    </motion.div>
  );
}
```

---

## Dashboard Home (`/dashboard`)

**Data needed (parallel fetches):**
- `GET /whoop/status` + `GET /whoop/daily` (if connected)
- `GET /scout/reports?limit=3` (recent game plans)
- `GET /training/sessions?limit=5` (recent sessions)
- Active jobs from `uploadStore` (Zustand, no API call)

**Layout grid (desktop):**
```
[Whoop Readiness Panel — full width if connected, else Connect CTA]
[Quick Actions — 2 buttons]
[Recent Game Plans — 3 cards] [Activity Streak + Training Summary — sidebar]
[Processing Queue — only if jobs pending]
```

---

## Scout Page (`/scout`)

**Default state:** Large search bar, database stats banner, recent reports grid  
**Upload mode:** Toggle button switches to drag-and-drop + form  
**After submit:** Navigate to processing state → `/scout/[jobId]` while polling → redirect to `/scout/[reportId]` when complete

**Search autocomplete:** Debounce 300ms, min 2 chars, max 10 results

---

## Scout Report Page (`/scout/[id]`)

- `id` can be a `job_id` (still processing) OR a `report_id` (complete)
- **If job is processing:** Full-screen processing state with animated progress
- **If report is complete:** Full `GamePlanReport` component
- **If report not found:** 404 state with "Back to Scout" CTA

```tsx
// Detect job vs report:
// - Try GET /jobs/{id}/status first
// - If 404 → it's a report ID, fetch GET /scout/reports/{id}
// - If status === 'processing' → render ProcessingView
// - If status === 'complete' → resultId is the report ID → redirect
```

---

## Training Page (`/training`)

**Layout:**
- Upload zone at top (collapsible after first upload)
- Progress overview chart (30 days)
- Session history list below

---

## Training Feedback Page (`/training/[id]`)

Same job_id → report_id detection pattern as Scout report page.

---

## Whoop Page (`/whoop`)

```tsx
// Conditional render based on connection status
const { data: status } = useQuery({ queryKey: ['whoop', 'status'], queryFn: getWhoopStatus });

if (!status?.connected) return <WhoopConnectView />;
return <WhoopDashboard />;
```

**WhoopConnectView:** Permission list + "Connect Whoop" button  
**WhoopDashboard:** RecoveryPanel + BiometricChart + CorrelationInsight list + SleepTrend + StrainVolume

---

## Whoop Callback Page (`/whoop/callback`)

```tsx
'use client';
// This page handles the OAuth redirect from Whoop
// 1. Read ?code and ?state from URL
// 2. Validate state === sessionStorage.getItem('whoop_oauth_state')
// 3. POST /whoop/connect with { code, state }
// 4. On success → toast success → router.push('/whoop')
// 5. On error → toast error → router.push('/whoop')
// 6. Render: full-screen loading spinner while processing
```

---

## API Routes

### `/api/whoop/auth` (GET)
- Generates random state, saves to session/cookie
- Returns redirect to Whoop OAuth URL with correct params
- Scopes: `offline read:recovery read:sleep read:workout read:profile`

### `/api/webhooks` (POST)  
- Receives job completion from backend
- Validates `X-Webhook-Secret` header
- Emits to Supabase Realtime channel for the user
- Returns `{ received: true }`

---

## History Page (`/history`)

- Unified list: game plans + training sessions, sorted by date
- Filter buttons: [All] [Game Plans] [Training]
- Date range picker
- Search by name/date
- Paginated: 20 per page (cursor-based)
- Each row: type icon + title + date + score + status badge

---

## Settings Page (`/settings`)

**Sections:**
1. Profile — name, email, belt, weight class, photo upload
2. Subscription — current plan, usage counters, upgrade CTA
3. Integrations — Whoop connection status + disconnect
4. Notifications — email preferences toggles
5. Security — password change form
6. Danger Zone — delete account (requires confirmation modal)

---

## Metadata (SEO)

```tsx
// Each page should export metadata:
export const metadata: Metadata = {
  title: 'Scout — Be A Pro',
  description: 'Analyze opponents and generate AI game plans',
};

// Or dynamic:
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: `Game Plan vs ${opponent.name} — Be A Pro` };
}
```

---

## Loading and Error Boundaries

```tsx
// Each route segment can have:
// loading.tsx → shown while page data loads (Suspense boundary)
// error.tsx  → shown if page throws
// not-found.tsx → shown for 404s

// loading.tsx pattern:
export default function Loading() {
  return <PageSkeleton />;  // skeleton matching page layout
}

// error.tsx pattern:
'use client';
export default function Error({ error, reset }) {
  return (
    <ErrorState 
      message={error.message} 
      onRetry={reset}
    />
  );
}
```
