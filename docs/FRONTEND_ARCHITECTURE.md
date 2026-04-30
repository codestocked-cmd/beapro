# Frontend Architecture — Be A Pro

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR/SSG for SEO, file-based routing, server components |
| **Language** | TypeScript | Type safety, better DX with large codebases |
| **Styling** | Tailwind CSS + CSS Modules for complex components | Utility-first, fast iteration |
| **State Management** | Zustand (global) + React Query (server state) | Lightweight, minimal boilerplate |
| **Auth** | Supabase Auth | Native integration with backend, OAuth support |
| **Video Upload** | Supabase Storage + tus protocol (resumable) | Large file support |
| **Whoop OAuth** | Custom OAuth 2.0 flow via Next.js API Routes | Required by Whoop Developer Platform |
| **Charts/Data Viz** | Recharts | Lightweight, composable, works with React |
| **Animations** | Framer Motion | Page transitions, micro-interactions |
| **Icons** | Lucide React | Consistent, minimal icon set |
| **Form Validation** | React Hook Form + Zod | Performant, schema-based |
| **Notifications** | Sonner (toast) | Minimal, beautiful toasts |

---

## Project Structure

```
beapro/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (no nav)
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Main app (with sidebar nav)
│   │   ├── layout.tsx            # Sidebar + topbar shell
│   │   ├── page.tsx              # Dashboard Home
│   │   ├── scout/                # Competitor Analysis
│   │   │   ├── page.tsx          # Search/upload opponent
│   │   │   └── [id]/page.tsx     # Game Plan Report
│   │   ├── training/             # Training Analysis
│   │   │   ├── page.tsx          # Upload + history
│   │   │   └── [id]/page.tsx     # Analysis Result
│   │   ├── whoop/                # Whoop Integration
│   │   │   ├── page.tsx          # Connect + Dashboard
│   │   │   └── callback/page.tsx # OAuth callback
│   │   ├── history/              # Past analyses
│   │   └── settings/             # Account settings
│   └── api/                      # Next.js API Routes
│       ├── whoop/
│       │   ├── auth/route.ts     # Initiate OAuth
│       │   └── callback/route.ts # Handle OAuth callback
│       └── webhooks/route.ts     # Async job callbacks from backend
├── components/
│   ├── ui/                       # Base design system components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── Skeleton.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileNav.tsx
│   ├── scout/
│   │   ├── OpponentSearch.tsx    # Search bar + autocomplete
│   │   ├── VideoUpload.tsx       # Drag-and-drop upload
│   │   ├── GamePlanCard.tsx      # Report card component
│   │   ├── GamePlanReport.tsx    # Full report page
│   │   └── FightTimeline.tsx     # Key moments timeline
│   ├── training/
│   │   ├── TrainingUpload.tsx
│   │   ├── FeedbackCard.tsx
│   │   ├── ProgressChart.tsx
│   │   └── PatternHeatmap.tsx
│   ├── whoop/
│   │   ├── WhoopConnect.tsx      # OAuth connect button
│   │   ├── RecoveryPanel.tsx     # Daily readiness widget
│   │   ├── BiometricChart.tsx    # HRV / sleep charts
│   │   └── CorrelationInsight.tsx # AI insight card
│   └── dashboard/
│       ├── ActivityStreak.tsx
│       ├── QuickActions.tsx
│       └── RecentReports.tsx
├── hooks/
│   ├── useVideoUpload.ts         # Upload progress, resumable
│   ├── useJobStatus.ts           # Poll async job status
│   ├── useWhoop.ts               # Whoop data hooks
│   └── useAuth.ts                # Auth state
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   ├── api/
│   │   ├── scout.ts              # Scout API calls
│   │   ├── training.ts           # Training API calls
│   │   └── whoop.ts              # Whoop API calls
│   ├── utils/
│   │   ├── format.ts             # Date, number formatters
│   │   └── video.ts              # Video helpers
│   └── constants.ts
├── stores/
│   ├── authStore.ts              # User session
│   └── uploadStore.ts            # Active upload state
├── types/
│   ├── scout.ts
│   ├── training.ts
│   ├── whoop.ts
│   └── api.ts
└── styles/
    ├── globals.css               # CSS vars, base styles
    └── animations.css            # Keyframes
```

---

## Routing Map

```
/                    → Redirect to /dashboard or /login
/login               → Auth: Login page
/signup              → Auth: Signup page

/dashboard           → Home dashboard
/scout               → Competitor analysis home
/scout/[id]          → Game Plan Report view
/training            → Training analysis home
/training/[id]       → Training feedback result
/whoop               → Whoop integration page
/whoop/callback      → Whoop OAuth callback (internal)
/history             → All past analyses
/settings            → User account + subscription
```

---

## Async Video Processing Flow

```
User uploads video
       ↓
Frontend → Supabase Storage (direct upload, progress tracked)
       ↓
Frontend → Backend API: POST /analyze { storage_url, type }
       ↓
Backend returns: { job_id }
       ↓
Frontend polls: GET /jobs/{job_id}/status (every 5s)
       ↓
When status = "complete":
Frontend → GET /jobs/{job_id}/result
       ↓
Render Game Plan / Feedback Card
```

OR (preferred): Backend sends webhook to `/api/webhooks` → Supabase Realtime notifies frontend.

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Backend API
NEXT_PUBLIC_API_BASE_URL=

# Whoop OAuth
WHOOP_CLIENT_ID=
WHOOP_CLIENT_SECRET=
WHOOP_REDIRECT_URI=https://yourapp.com/whoop/callback

# App
NEXT_PUBLIC_APP_URL=
```

---

## Performance Guidelines

- Use Next.js `Image` component for all images
- Lazy load video previews (IntersectionObserver)
- Skeleton loaders for all async data states
- Optimistic UI updates where possible
- Paginate history lists (cursor-based, 20 items)
- Memoize heavy chart renders with `useMemo`
