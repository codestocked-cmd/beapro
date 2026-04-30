# Development Rules & Conventions — Be A Pro

> This file defines the standards, patterns, and rules for all frontend development on Be A Pro.  
> Every developer (human or AI) must follow these conventions.

---

## Core Principles

1. **Mobile-first** — design for 390px screens, enhance upward
2. **Dark UI only** — the design system is dark; never render light backgrounds without explicit reason
3. **Performance matters** — every millisecond counts for athlete UX; avoid unnecessary re-renders
4. **Async-first** — video processing is always async; the UI must handle all states (loading, processing, complete, error)
5. **Type everything** — no `any` in TypeScript; all API responses must be typed

---

## File & Naming Conventions

```
// Components: PascalCase
GamePlanCard.tsx
RecoveryPanel.tsx

// Hooks: camelCase with 'use' prefix
useVideoUpload.ts
useWhoopDaily.ts

// API functions: camelCase
getScoutReport()
postTrainingAnalysis()

// Types: PascalCase
type GamePlanReport = { ... }
interface WhoopRecovery { ... }

// Constants: SCREAMING_SNAKE_CASE
const MAX_VIDEO_SIZE_MB = 2048;
const WHOOP_OAUTH_URL = 'https://api.prod.whoop.com/oauth/oauth2/auth';

// CSS classes: use Tailwind utilities, avoid custom class names unless in globals.css
```

---

## Component Structure Pattern

```tsx
// Every component follows this structure:

// 1. Imports (external → internal → types → styles)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { useScoutReport } from '@/hooks/useScout';
import type { GamePlanReport } from '@/types/scout';

// 2. Types (local only)
interface GamePlanCardProps {
  report: GamePlanReport;
  onSelect?: (id: string) => void;
}

// 3. Component
export function GamePlanCard({ report, onSelect }: GamePlanCardProps) {
  // 4. Hooks first
  const [expanded, setExpanded] = useState(false);

  // 5. Derived state / memos
  const confidenceColor = report.confidence_score >= 70 
    ? 'var(--color-success)' 
    : 'var(--color-warning)';

  // 6. Handlers
  const handleClick = () => onSelect?.(report.id);

  // 7. Render
  return (
    <Card onClick={handleClick}>
      {/* ... */}
    </Card>
  );
}
```

---

## Data Fetching Rules

```tsx
// ✅ ALWAYS use React Query for server state
const { data, isLoading, error } = useQuery({
  queryKey: ['scout', 'report', reportId],
  queryFn: () => getScoutReport(reportId),
  enabled: !!reportId,
});

// ✅ ALWAYS handle all three states
if (isLoading) return <GamePlanCardSkeleton />;
if (error) return <ErrorState message="Failed to load report" onRetry={refetch} />;
if (!data) return <EmptyState />;
return <GamePlanReport data={data} />;

// ❌ NEVER fetch in useEffect unless absolutely necessary
// ❌ NEVER store server data in useState
```

---

## Video Upload Pattern

```tsx
// Use the useVideoUpload hook for ALL video uploads
// It handles: file validation, progress tracking, Supabase storage, error recovery

const { upload, progress, status, error } = useVideoUpload();

// status: 'idle' | 'validating' | 'uploading' | 'complete' | 'error'
// progress: 0–100 (percentage)

const handleFileSelect = async (file: File) => {
  const storageUrl = await upload(file, {
    bucket: 'training-videos',
    maxSizeMB: 2048,
    allowedTypes: ['video/mp4', 'video/quicktime', 'video/avi'],
  });
  // storageUrl is ready to send to backend
};
```

---

## Async Job Polling Pattern

```tsx
// ALWAYS use the useJobStatus hook for polling
const { status, progress, resultId } = useJobStatus(jobId, {
  onComplete: (resultId) => {
    router.push(`/scout/${resultId}`);
  },
  onError: (error) => {
    toast.error(`Analysis failed: ${error}`);
  },
});
```

---

## Form Rules

```tsx
// ALWAYS use React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  opponent_name: z.string().min(2, 'Name must be at least 2 characters'),
  competition_name: z.string().optional(),
});

const form = useForm({ resolver: zodResolver(schema) });
```

---

## Error Handling Rules

```tsx
// ✅ Wrap all API calls in try/catch in lib/api/ files
export async function getScoutReport(id: string): Promise<GamePlanReport> {
  const res = await fetch(`${API_BASE}/scout/reports/${id}`, {
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new APIError(error.error.code, error.error.message, res.status);
  }

  return res.json();
}

// ✅ Use typed error class
class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
  }
}

// ✅ Handle 402 (quota exceeded) globally
// In React Query default options:
onError: (error) => {
  if (error instanceof APIError && error.status === 402) {
    router.push('/settings?upgrade=true');
  }
}
```

---

## Skeleton Loading Pattern

```tsx
// Every data-heavy component needs a Skeleton variant

// GamePlanCard.tsx
export function GamePlanCardSkeleton() {
  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] 
                    rounded-[var(--radius-xl)] p-6 animate-pulse">
      <div className="skeleton h-4 w-32 rounded mb-3" />
      <div className="skeleton h-8 w-20 rounded mb-4" />
      <div className="skeleton h-4 w-full rounded mb-2" />
      <div className="skeleton h-4 w-3/4 rounded" />
    </div>
  );
}

// Use it:
if (isLoading) return <div className="grid grid-cols-3 gap-4">
  {Array.from({ length: 3 }).map((_, i) => <GamePlanCardSkeleton key={i} />)}
</div>;
```

---

## Animation Rules

```tsx
// Page entry animation (apply to all main page containers)
const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: 'easeOut' } 
  },
};

// List stagger (apply to grids/lists)
const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

// Stats count-up (use on mount for score displays)
// Use: react-countup or framer-motion useMotionValue + useTransform
```

---

## CSS Rules

```css
/* Only use CSS variables from the design system */
/* ✅ */ color: var(--color-brand);
/* ❌ */ color: #E8FF3A; /* hardcoded values only in globals.css */

/* Tailwind is preferred for layout/spacing */
/* Use CSS modules for complex component-specific styles only */

/* Never use important! unless overriding third-party library */
/* Never use z-index values > 1000 (modal layer) */
```

---

## Accessibility Rules

- All interactive elements must have `aria-label` if they lack visible text
- All images must have `alt` text
- Focus styles must be visible (don't suppress `outline` without replacing it)
- Color alone must not be the only way to convey information (pair colors with icons/labels)
- Form inputs must have associated `<label>` elements

---

## Git Conventions

```
feat: add opponent search autocomplete
fix: correct recovery score color threshold
ui: update GamePlanCard skeleton loading state
refactor: extract useJobStatus hook
docs: update API_CONTRACTS.md with new /whoop/daily endpoint
```

**Branch naming:**
```
feat/scout-search-autocomplete
fix/whoop-oauth-callback-state
ui/dashboard-skeleton-loading
```

---

## Environment Setup

```bash
# Install dependencies
npm install

# Copy env vars
cp .env.example .env.local
# Fill in: SUPABASE keys, API_BASE_URL, WHOOP credentials

# Run dev server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint
```

---

## Key Dependencies Summary

```json
{
  "next": "14.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "@supabase/supabase-js": "2.x",
  "@supabase/ssr": "latest",
  "@tanstack/react-query": "5.x",
  "framer-motion": "11.x",
  "react-hook-form": "7.x",
  "zod": "3.x",
  "zustand": "4.x",
  "recharts": "2.x",
  "lucide-react": "latest",
  "sonner": "latest"
}
```
