# Screens Map — Be A Pro

## Screen Inventory

| Screen | Route | Auth Required |
|---|---|---|
| Login | `/login` | No |
| Signup | `/signup` | No |
| Dashboard | `/dashboard` | Yes |
| Scout Home | `/scout` | Yes |
| Game Plan Report | `/scout/[id]` | Yes |
| Training Home | `/training` | Yes |
| Training Feedback | `/training/[id]` | Yes |
| Whoop Dashboard | `/whoop` | Yes |
| Whoop Callback | `/whoop/callback` | Yes |
| History | `/history` | Yes |
| Settings | `/settings` | Yes |

---

## Screen Specs

---

### 1. Login / Signup

**Purpose:** Authentication entry point  
**Layout:** Full-screen split — left: branding/visual, right: form  

**Left panel:**
- Full-height dark panel with brand color accent
- App logo + tagline: "Intelligence for Grappling"
- Rotating stat: "8,000+ hours of fight data analyzed"
- Background: subtle jiu jitsu mat texture or silhouette graphic

**Right panel form (Login):**
- Email input
- Password input
- "Forgot password" link
- Primary CTA: "Enter the mat"
- Divider: "or"
- Google SSO button
- Link to Signup

**Right panel form (Signup):**
- Name input
- Email input
- Password input
- Belt level selector (dropdown: White → Black)
- Competition level (Recreational / Amateur / Competitor / Pro)
- Primary CTA: "Create my account"

---

### 2. Dashboard (Home)

**Purpose:** Command center — daily overview + quick actions  
**Layout:** 3-column grid (desktop), stacked (mobile)

**Sections:**

**A. Header Bar**
- "Good morning, [Name]" greeting
- Date + day of week
- Notification bell

**B. Whoop Readiness Panel** (if connected)
- Recovery score (large number, color-coded)
- HRV + Sleep score secondary stats
- AI insight: "You're at 78% recovery. Good day for intense drilling."
- CTA: "See full Whoop data" (if not connected: "Connect Whoop")

**C. Quick Actions**
- [Scout an Opponent] button
- [Upload Training Video] button
- [View Last Report] shortcut

**D. Recent Game Plans** (last 3)
- Opponent name + thumbnail
- Date generated
- Confidence score badge
- "View full report" link

**E. Training Summary (last 7 days)**
- Mini bar chart: sessions/week
- Streak counter
- Most recent feedback summary

**F. Processing Queue** (if any videos pending)
- Active jobs with progress indicator
- Estimated time remaining

---

### 3. Scout — Competitor Analysis Home

**Purpose:** Entry point for opponent scouting  
**Layout:** Search-first, with history below

**Sections:**

**A. Search Bar (prominent, center)**
- Large search input: "Search competitor by name..."
- Autocomplete dropdown showing athlete names from database
- Toggle: [Search Database] / [Upload Video]

**B. Upload Video Mode** (toggled)
- Drag & drop zone
- Supported formats: MP4, MOV, AVI (max 2GB)
- OR: paste YouTube link field
- Opponent name input (required)
- Competition name (optional)
- Event date (optional)
- CTA: "Analyze this fight"

**C. Recent Analyses** (past game plans)
- Grid of GamePlanCards (3 per row)
- Each card: athlete photo/avatar, name, belt, date, confidence score badge

**D. Database Stats Banner**
- "8,247 hours analyzed · 3,412 athletes in database · Updated daily"

---

### 4. Game Plan Report

**Purpose:** Full AI-generated opponent analysis  
**Layout:** Long-form report, sticky sidebar navigation

**Header:**
- Opponent name + photo (from database or placeholder)
- Belt level + weight class
- "Game Plan for [User Name]" subtitle
- Generated date
- Confidence Score: large display (e.g., "87%")
- Action buttons: [Save PDF] [Share with Coach]

**Section 1: Opponent Overview**
- Fighting style summary (text)
- Top 3 signature moves (badges)
- Guard preference: Spider / De la Riva / Closed / etc. (visual indicator)
- Passing preference: Pressure / Torreando / Leg drag
- Win rate from database (if available)

**Section 2: Threat Assessment**
- Heatmap or visual grid of positions
- "Danger zones" (where opponent is most dangerous)
- "Opportunity zones" (where you have advantage)

**Section 3: Recommended Game Plan**
- Step-by-step strategic plan:
  - Phase 1: Grip fighting & takedown approach
  - Phase 2: Preferred position to achieve
  - Phase 3: Submission setups
- Confidence indicators per phase

**Section 4: Key Moments** (if video analyzed)
- Timeline scrubber showing tagged moments
- Timestamped clips: "02:34 — Guard pass attempt"
- Each moment: description + category badge

**Section 5: Training Recommendations**
- 3–5 specific techniques to drill before this match
- Links to instructional references (if integrated)

---

### 5. Training Analysis Home

**Purpose:** Upload & track training sessions  
**Layout:** Upload zone + session history

**Sections:**

**A. Upload Zone**
- Drag & drop (same pattern as Scout upload)
- Session type: [Drilling] [Sparring] [Competition]
- Date of session
- Duration (auto-detected from video if possible)
- Optional notes: "Focused on passing the guard today"
- CTA: "Analyze session"

**B. Progress Overview**
- Line chart: performance score over time (last 30 days)
- Trend arrow: improving / declining / stable
- Most improved area (badge): "Guard Retention +12%"
- Needs work area (badge): "Takedowns"

**C. Session History**
- List of past sessions: date, type, duration, score
- Quick feedback preview on hover
- Click → Training Feedback screen

---

### 6. Training Feedback

**Purpose:** Full AI feedback for a single session  
**Layout:** Structured report similar to Game Plan

**Header:**
- Session date + type + duration
- Overall session score (0–100)
- "vs. your average" delta

**Section 1: What You Did Well**
- 3–5 positive observations with timestamps
- Green-coded cards

**Section 2: Areas to Improve**
- 3–5 observations with context
- Orange-coded cards
- Suggested drill for each issue

**Section 3: Technical Patterns**
- Positional flow diagram: how you moved through positions
- Submission attempts (success/fail breakdown)
- Guard passes / sweeps count

**Section 4: Compared to Last Session**
- Side-by-side comparison of key metrics
- Trend arrows per metric

**Section 5: AI Coach Message**
- 2–3 sentence personalized insight
- "Focus on this before your next session" recommendation

---

### 7. Whoop Integration Dashboard

**Purpose:** Connect Whoop + view biometric correlation  
**Layout:** Connection state → full dashboard

**State A: Not Connected**
- Whoop logo + explanation: "Connect your Whoop to correlate training quality with recovery data"
- What data will be accessed (list)
- CTA: "Connect Whoop" (initiates OAuth flow)

**State B: Connected Dashboard**

**Section 1: Today's Readiness**
- Recovery Score (big number, color-coded)
- HRV + Resting HR + Sleep Performance

**Section 2: Weekly Correlation Chart**
- Dual-axis line chart:
  - X: Days of the week
  - Y1: Training quality score (from Be A Pro)
  - Y2: Recovery score (from Whoop)
- Visual correlation highlighting

**Section 3: AI Insights**
- "Your top 10% training sessions happen at recovery > 72%"
- "Your sleep performance dropped 15% during competition week"
- "HRV below 55ms correlates with poor guard retention for you"

**Section 4: Sleep Trend**
- Bar chart: 7-day sleep performance
- Stage breakdown if available

**Section 5: Strain vs. Volume**
- Scatter plot: Whoop Strain vs. Training Duration
- Highlights over-training risk days

---

### 8. History

**Purpose:** All past analyses in one place  
**Layout:** Filterable list

**Filters:**
- Type: [All] [Game Plans] [Training Sessions]
- Date range picker
- Search by name/date

**List:**
- Each row: type icon, title, date, score, status badge
- Pagination: 20 per page
- Bulk actions: [Export selected] [Delete]

---

### 9. Settings

**Sections:**
- Profile (name, email, belt level, weight class, photo)
- Subscription & Plan (current plan, upgrade CTA, billing)
- Whoop Connection (status, disconnect option)
- Notifications (email preferences)
- Password change
- Danger zone: Delete account
