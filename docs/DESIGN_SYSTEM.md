# Design System — Be A Pro

## Brand Identity

**Personality:** Precision. Data. Dominance.  
**Aesthetic Direction:** Dark, tactical, high-performance — like a war room meets sports analytics. Think F1 data dashboard crossed with combat sport energy.  
**References:** Whoop app dark UI, F1 telemetry dashboards, military intelligence briefings, UFC Fight Night broadcast graphics.

---

## Color System

```css
:root {
  /* Primary Brand */
  --color-brand:          #E8FF3A;   /* Electric Yellow-Green — the "intelligence" accent */
  --color-brand-dim:      #C5D932;   /* Muted brand for hover states */
  --color-brand-glow:     rgba(232, 255, 58, 0.15); /* Subtle glow effect */

  /* Background Hierarchy */
  --color-bg-base:        #0A0A0C;   /* Deepest black — app background */
  --color-bg-surface:     #111114;   /* Cards, panels */
  --color-bg-elevated:    #18181D;   /* Modals, dropdowns */
  --color-bg-subtle:      #222228;   /* Input backgrounds, hover states */

  /* Borders */
  --color-border:         #2A2A32;   /* Default border */
  --color-border-strong:  #3D3D4A;   /* Focused/selected states */
  --color-border-brand:   rgba(232, 255, 58, 0.3); /* Brand-accented border */

  /* Text */
  --color-text-primary:   #F0F0F5;   /* Primary text — slightly cool white */
  --color-text-secondary: #8A8A9A;   /* Secondary, metadata */
  --color-text-muted:     #505060;   /* Disabled, placeholders */
  --color-text-brand:     #E8FF3A;   /* Brand-colored text */

  /* Semantic */
  --color-success:        #3AFFA0;   /* Green — good metrics */
  --color-warning:        #FFB830;   /* Amber — caution */
  --color-danger:         #FF4D4D;   /* Red — poor metrics, errors */
  --color-info:           #4D9EFF;   /* Blue — neutral info */

  /* Whoop-specific */
  --color-recovery-high:  #3AFFA0;   /* Recovery > 66% */
  --color-recovery-mid:   #FFB830;   /* Recovery 34–66% */
  --color-recovery-low:   #FF4D4D;   /* Recovery < 34% */
}
```

---

## Typography

```css
/* Font Stack */
--font-display: 'Barlow Condensed', sans-serif;  /* Headers, stats, numbers */
--font-body:    'DM Sans', sans-serif;            /* Body text, UI */
--font-mono:    'JetBrains Mono', monospace;      /* Data, timestamps, code */

/* Scale */
--text-xs:   0.75rem;    /* 12px — labels, meta */
--text-sm:   0.875rem;   /* 14px — body small */
--text-base: 1rem;       /* 16px — body default */
--text-lg:   1.125rem;   /* 18px — body large */
--text-xl:   1.25rem;    /* 20px — section titles */
--text-2xl:  1.5rem;     /* 24px — page titles */
--text-3xl:  1.875rem;   /* 30px — hero headings */
--text-4xl:  2.25rem;    /* 36px — display */
--text-6xl:  3.75rem;    /* 60px — big stats */

/* Weight */
--font-normal:    400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
--font-extrabold: 800;
```

**Import (add to globals.css):**
```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

---

## Spacing System

```css
/* Spacing scale (Tailwind-compatible) */
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
```

---

## Border Radius

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-2xl:  24px;
--radius-full: 9999px;
```

---

## Shadows & Glow

```css
--shadow-sm:    0 1px 3px rgba(0,0,0,0.4);
--shadow-md:    0 4px 16px rgba(0,0,0,0.5);
--shadow-lg:    0 8px 32px rgba(0,0,0,0.6);
--shadow-brand: 0 0 20px rgba(232, 255, 58, 0.2);
--shadow-inner: inset 0 1px 0 rgba(255,255,255,0.05);
```

---

## Core Components

### Button

```tsx
// Variants: primary | secondary | ghost | danger
// Sizes: sm | md | lg

// Primary (brand CTA)
className="bg-[var(--color-brand)] text-[#0A0A0C] font-semibold 
           rounded-[var(--radius-md)] px-5 py-2.5 hover:opacity-90 
           transition-all duration-150 active:scale-[0.98]"

// Secondary (outlined)
className="border border-[var(--color-border-strong)] text-[var(--color-text-primary)]
           rounded-[var(--radius-md)] px-5 py-2.5 hover:border-[var(--color-brand)] 
           hover:text-[var(--color-brand)] transition-all duration-150"

// Ghost
className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
           hover:bg-[var(--color-bg-subtle)] rounded-[var(--radius-md)] px-4 py-2"
```

### Card

```tsx
className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] 
           rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-md)]"

// Highlighted card (brand accent)
className="bg-[var(--color-bg-surface)] border border-[var(--color-border-brand)] 
           rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-brand)]"
```

### Badge

```tsx
// Status badges
const variants = {
  success: "bg-[rgba(58,255,160,0.1)] text-[var(--color-success)] border border-[rgba(58,255,160,0.2)]",
  warning: "bg-[rgba(255,184,48,0.1)] text-[var(--color-warning)] border border-[rgba(255,184,48,0.2)]",
  danger:  "bg-[rgba(255,77,77,0.1)] text-[var(--color-danger)] border border-[rgba(255,77,77,0.2)]",
  brand:   "bg-[var(--color-brand-glow)] text-[var(--color-brand)] border border-[var(--color-border-brand)]",
}
// Base: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
```

### Input

```tsx
className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] 
           rounded-[var(--radius-md)] px-4 py-2.5 text-[var(--color-text-primary)]
           placeholder:text-[var(--color-text-muted)] w-full
           focus:outline-none focus:border-[var(--color-brand)] 
           focus:shadow-[0_0_0_3px_var(--color-brand-glow)]
           transition-all duration-150"
```

### Stat Display

```tsx
// For showing key metrics (e.g., recovery score, submission rate)
<div className="flex flex-col gap-1">
  <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest font-medium">
    {label}
  </span>
  <span className="font-[var(--font-display)] text-5xl font-bold text-[var(--color-brand)]">
    {value}
  </span>
  <span className="text-[var(--color-text-secondary)] text-sm">
    {description}
  </span>
</div>
```

---

## Layout Shell

```
┌─────────────────────────────────────────────────┐
│  SIDEBAR (240px, fixed)  │  MAIN CONTENT AREA    │
│                          │                        │
│  [Logo]                  │  [Topbar: page title + │
│                          │   user avatar]         │
│  Nav:                    │                        │
│  ● Dashboard             │  [Page Content]        │
│  ● Scout                 │                        │
│  ● Training              │                        │
│  ● Whoop                 │                        │
│  ● History               │                        │
│                          │                        │
│  [bottom: User + Plan]   │                        │
└─────────────────────────────────────────────────┘
```

- Sidebar: `bg-[var(--color-bg-surface)]` with right border
- Content area: `bg-[var(--color-bg-base)]`
- Mobile: bottom nav (5 icons)

---

## Iconography

Use **Lucide React** icons throughout. Key icons by feature:

| Feature | Icon |
|---|---|
| Dashboard | `LayoutDashboard` |
| Scout / Opponent | `Target` |
| Training | `Dumbbell` |
| Whoop | `Activity` |
| History | `Clock` |
| Settings | `Settings2` |
| Upload | `Upload` |
| Search | `Search` |
| Game Plan | `Crosshair` |
| Recovery | `Heart` |
| Video | `Video` |
| Report | `FileText` |

---

## Motion Principles

- **Page transitions:** fade + slide-up (300ms, ease-out)
- **Cards entering:** staggered fade-in (50ms delay per item)
- **Processing state:** pulsing skeleton with brand color shimmer
- **Stats counting:** number count-up animation on mount
- **Upload progress:** smooth bar fill with glow effect
- **Hover states:** 150ms transitions only

```css
/* Skeleton shimmer keyframe */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-elevated) 25%,
    var(--color-bg-subtle) 50%,
    var(--color-bg-elevated) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## Loading States Pattern

Every data-dependent section must have 3 states:
1. **Loading** — Skeleton matching the shape of the content
2. **Empty** — Branded empty state with CTA (never blank)
3. **Error** — Inline error with retry option

```tsx
// Empty state pattern
<div className="flex flex-col items-center justify-center py-16 gap-4">
  <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-elevated)] 
                  flex items-center justify-center border border-[var(--color-border)]">
    <Target className="w-8 h-8 text-[var(--color-text-muted)]" />
  </div>
  <div className="text-center">
    <p className="text-[var(--color-text-primary)] font-semibold">No analyses yet</p>
    <p className="text-[var(--color-text-muted)] text-sm mt-1">
      Search for an opponent to generate your first game plan
    </p>
  </div>
  <Button variant="primary" size="sm">Scout an opponent</Button>
</div>
```
