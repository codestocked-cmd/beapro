# Be A Pro — Claude Code Context

## What This App Is

**Be A Pro** is a BJJ/grappling competitive intelligence SaaS. It analyzes opponent fight footage (from a proprietary 8,000+ hour database), generates AI game plans, analyzes training videos, and correlates performance with Whoop biometric data.

**This repo is FRONTEND ONLY.** Backend is handled separately by a partner. We consume a REST API.

---

## Stack (non-negotiable)

- **Next.js 14** — App Router, TypeScript strict mode
- **Tailwind CSS** — utility-first, no CSS-in-JS
- **Supabase** — Auth + Storage (video uploads)
- **React Query (@tanstack/react-query v5)** — ALL server state
- **Zustand** — global client state only (upload queue, UI state)
- **Framer Motion** — animations and page transitions
- **React Hook Form + Zod** — all forms
- **Recharts** — all data visualizations
- **Lucide React** — icons only, no other icon library
- **Sonner** — toast notifications

---

## Absolute Rules (never break these)

1. **NO `any` in TypeScript.** If you don't know the type, define it in `/types/`.
2. **ALL server data via React Query.** Never `useState` + `useEffect` for fetching.
3. **ALL forms via React Hook Form + Zod.** Never uncontrolled inputs.
4. **ALWAYS handle 3 states:** loading (skeleton) → error (inline error) → empty (branded empty state) → data.
5. **Dark UI only.** Every background uses CSS design tokens. Never hardcode hex colors.
6. **Mobile-first.** Write `sm:` breakpoints, not `max-sm:`.
7. **No `console.log` in committed code.** Use proper error boundaries.
8. **Never store tokens or secrets in client code.** Whoop OAuth handled via Next.js API routes.
9. **Video uploads always use `useVideoUpload` hook.** Never roll a custom upload.
10. **Async jobs always use `useJobStatus` hook.** Never poll manually in components.

---

## Design Tokens — Use These Everywhere

```css
/* BACKGROUNDS */
--color-bg-base:       #0A0A0C   /* app background */
--color-bg-surface:    #111114   /* cards, panels */
--color-bg-elevated:   #18181D   /* modals, dropdowns */
--color-bg-subtle:     #222228   /* inputs, hover */

/* BRAND */
--color-brand:         #E8FF3A   /* electric yellow-green — primary CTA */
--color-brand-dim:     #C5D932
--color-brand-glow:    rgba(232,255,58,0.15)

/* TEXT */
--color-text-primary:  #F0F0F5
--color-text-secondary:#8A8A9A
--color-text-muted:    #505060
--color-text-brand:    #E8FF3A

/* BORDERS */
--color-border:        #2A2A32
--color-border-strong: #3D3D4A
--color-border-brand:  rgba(232,255,58,0.3)

/* SEMANTIC */
--color-success:       #3AFFA0
--color-warning:       #FFB830
--color-danger:        #FF4D4D
--color-info:          #4D9EFF

/* WHOOP RECOVERY */
--color-recovery-high: #3AFFA0   /* score ≥ 67 */
--color-recovery-mid:  #FFB830   /* score 34–66 */
--color-recovery-low:  #FF4D4D   /* score < 34 */
```

**Tailwind custom classes (tailwind.config.ts already maps these):**
```
bg-surface, bg-elevated, bg-subtle
text-primary, text-secondary, text-muted, text-brand
border-default, border-strong, border-brand
brand (for bg-brand, text-brand)
success, warning, danger, info
```

---

## Typography

```
Font display:  'Barlow Condensed' — headers, big stats, numbers
Font body:     'DM Sans' — all body text and UI
Font mono:     'JetBrains Mono' — timestamps, data values
```

Use `font-display` class for stat numbers and section headings. Use `font-mono` for timestamps.

---

## File Structure

```
app/
  (auth)/login/page.tsx
  (auth)/signup/page.tsx
  (dashboard)/layout.tsx          ← sidebar + topbar shell
  (dashboard)/page.tsx            ← Dashboard home
  (dashboard)/scout/page.tsx      ← Opponent search + upload
  (dashboard)/scout/[id]/page.tsx ← Game Plan Report
  (dashboard)/training/page.tsx   ← Training upload + history
  (dashboard)/training/[id]/page.tsx ← Training Feedback
  (dashboard)/whoop/page.tsx      ← Whoop dashboard
  (dashboard)/whoop/callback/page.tsx ← OAuth callback
  (dashboard)/history/page.tsx
  (dashboard)/settings/page.tsx
  api/whoop/auth/route.ts         ← Initiate Whoop OAuth
  api/whoop/callback/route.ts     ← Handle Whoop token exchange
  api/webhooks/route.ts           ← Receive async job completion

components/
  ui/           ← Button, Card, Badge, Input, Modal, Skeleton, EmptyState
  layout/       ← Sidebar, Topbar, MobileNav
  scout/        ← OpponentSearch, VideoUpload, GamePlanCard, GamePlanReport, FightTimeline
  training/     ← TrainingUpload, FeedbackCard, ProgressChart, PatternHeatmap
  whoop/        ← WhoopConnect, RecoveryPanel, BiometricChart, CorrelationInsight
  dashboard/    ← ActivityStreak, QuickActions, RecentReports, ProcessingQueue

hooks/
  useVideoUpload.ts
  useJobStatus.ts
  useWhoop.ts
  useAuth.ts

lib/
  supabase/client.ts
  supabase/server.ts
  api/scout.ts
  api/training.ts
  api/whoop.ts
  utils/format.ts

stores/
  authStore.ts
  uploadStore.ts

types/
  scout.ts
  training.ts
  whoop.ts
  api.ts
```

---

## Core Component Patterns

### Standard Component File

```tsx
// 1. imports: external → internal → types
// 2. local interface
// 3. component
// 4. skeleton variant (if data-dependent)
// 5. default export

interface Props { ... }

export function ComponentName({ prop }: Props) {
  // hooks first
  // derived state / memos
  // handlers
  // render
}

export function ComponentNameSkeleton() { ... }
```

### Page Pattern (App Router)

```tsx
// app/(dashboard)/scout/page.tsx
import { Suspense } from 'react';

export default function ScoutPage() {
  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      <PageHeader title="Scout" subtitle="Analyze your next opponent" />
      <Suspense fallback={<ScoutPageSkeleton />}>
        <ScoutContent />
      </Suspense>
    </motion.div>
  );
}
```

### Data Fetching Pattern

```tsx
// ALWAYS this pattern, never useEffect for fetching
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['scout', 'reports'],
  queryFn: getScoutReports,
  staleTime: 1000 * 60 * 5,
});

if (isLoading) return <ReportListSkeleton />;
if (error) return <ErrorState message="Failed to load reports" onRetry={refetch} />;
if (!data?.length) return <EmptyState icon={Target} title="No game plans yet" cta="Scout an opponent" />;
return <ReportList reports={data} />;
```

### Button Variants

```tsx
// Primary (brand CTA)
<button className="bg-brand text-[#0A0A0C] font-semibold rounded-lg px-5 py-2.5 
                   hover:opacity-90 transition-all duration-150 active:scale-[0.98]">

// Secondary (outlined)
<button className="border border-strong text-primary rounded-lg px-5 py-2.5
                   hover:border-brand hover:text-brand transition-all duration-150">

// Ghost
<button className="text-secondary hover:text-primary hover:bg-subtle 
                   rounded-lg px-4 py-2 transition-all duration-150">

// Danger
<button className="bg-[rgba(255,77,77,0.1)] text-danger border border-[rgba(255,77,77,0.2)]
                   rounded-lg px-5 py-2.5 hover:bg-[rgba(255,77,77,0.2)] transition-all">
```

### Card Variants

```tsx
// Default card
<div className="bg-surface border border-default rounded-xl p-6 shadow-md">

// Brand-accented card (highlighted/selected)
<div className="bg-surface border border-brand rounded-xl p-6 shadow-[0_0_20px_rgba(232,255,58,0.1)]">

// Interactive card (clickable)
<div className="bg-surface border border-default rounded-xl p-6 cursor-pointer
                hover:border-strong hover:bg-elevated transition-all duration-150">
```

### Empty State Pattern

```tsx
<div className="flex flex-col items-center justify-center py-16 gap-4">
  <div className="w-16 h-16 rounded-2xl bg-elevated border border-default 
                  flex items-center justify-center">
    <IconComponent className="w-8 h-8 text-muted" />
  </div>
  <div className="text-center">
    <p className="text-primary font-semibold">{title}</p>
    <p className="text-muted text-sm mt-1">{description}</p>
  </div>
  {cta && <Button variant="primary" size="sm">{cta}</Button>}
</div>
```

### Skeleton Pattern

```tsx
// Use this base class on skeleton elements:
<div className="bg-elevated animate-pulse rounded-lg h-4 w-32" />

// Skeleton shimmer (add to globals.css, use .skeleton class):
// Gradient sweep animation — see DESIGN_SYSTEM.md for keyframes
```

---

## Animation Patterns

```tsx
// Page entry (apply to every page root div)
const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

// List stagger (apply to grids and lists)
const containerVariants = {
  visible: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// Use on all interactive transitions:
// transition-all duration-150 (hover/focus states)
// transition-all duration-300 (page/modal transitions)
```

---

## API Calls Pattern

```tsx
// lib/api/scout.ts — ALL API functions live here, never in components
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getAuthHeaders() {
  const supabase = createBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
}

export async function getScoutReports(): Promise<ScoutReport[]> {
  const res = await fetch(`${API_BASE}/scout/reports`, {
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new APIError(await res.json());
  return res.json();
}
```

---

## Async Job Flow

Every video analysis follows this flow:

```
1. Upload video → Supabase Storage → get storage_url
2. POST /scout/analyze or /training/analyze → get job_id
3. useJobStatus(job_id) polls GET /jobs/{job_id} every 5s
4. When status === 'complete' → navigate to result page
5. When status === 'failed' → show error with retry
```

Always show `<ProcessingStatus jobId={jobId} />` component while waiting.

---

## Whoop OAuth Flow

```
User clicks "Connect Whoop"
→ Generate random state → save to sessionStorage
→ Redirect to Whoop auth URL (/api/whoop/auth initiates it)
→ Whoop redirects to /whoop/callback?code=X&state=Y
→ Validate state (CSRF protection)
→ Send code to backend: POST /whoop/connect
→ Backend exchanges tokens (never in frontend)
→ Redirect to /whoop dashboard
```

**Never** exchange Whoop tokens client-side. Always via Next.js API route → backend.

---

## Error Handling

```tsx
// APIError class lives in lib/api/errors.ts
class APIError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
  }
}

// Global React Query error handler:
// 402 → redirect to /settings?upgrade=true (quota exceeded)
// 401 → redirect to /login (session expired)
// 503 → show "Analysis service unavailable, try again later"

// Component-level: always show inline error, never silent failures
<ErrorState 
  message={error instanceof APIError ? error.message : 'Something went wrong'} 
  onRetry={refetch} 
/>
```

---

## Form Pattern

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  opponent_name: z.string().min(2, 'Name must be at least 2 characters'),
  competition_name: z.string().optional(),
  event_date: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ScoutForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = 
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => { ... };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('opponent_name')} error={errors.opponent_name?.message} />
      <Button type="submit" loading={isSubmitting}>Analyze</Button>
    </form>
  );
}
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_WHOOP_CLIENT_ID=
WHOOP_CLIENT_SECRET=          ← server-only, never NEXT_PUBLIC_
```

---

## Reference Files

For full specs, see:
- `docs/PRD.md` — product requirements
- `docs/DESIGN_SYSTEM.md` — full design tokens and component library
- `docs/SCREENS_MAP.md` — all screen specs in detail
- `docs/API_CONTRACTS.md` — all endpoint request/response schemas
- `docs/WHOOP_INTEGRATION.md` — full Whoop OAuth + data spec
- `docs/COMPETITIVE_ANALYSIS.md` — market context
- `docs/FRONTEND_ARCHITECTURE.md` — full project structure and dependencies
