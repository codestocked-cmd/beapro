# PRD — Be A Pro: Intelligence for Grappling

## Product Overview

**Name:** Be A Pro  
**Tagline:** Intelligence for Grappling  
**Category:** Sports AI / Performance Analytics  
**Platform:** Web App (SaaS) — mobile-first responsive  
**Stack:** React (Next.js) + Supabase + Vercel  

---

## Problem Statement

Elite BJJ and grappling athletes lack access to data-driven competitive intelligence. Currently:
- Match analysis is done manually by coaches, time-consuming and subjective
- There's no platform that builds a specific **game plan against a named opponent** using historical fight data
- Training feedback is based on perception, not measurable patterns
- Recovery data (Whoop, Garmin) is disconnected from grappling performance metrics

**Be A Pro** bridges this gap: a professional-grade AI layer on top of 8,000+ hours of competitive fight footage, delivering opponent scouting reports, training feedback, and biometric correlation — all in one platform.

---

## Target Users

| Persona | Description | Primary Need |
|---|---|---|
| **Competitive Athlete** | BJJ competitor (blue to black belt), 3–5x/week training | Opponent scouting, game plan generation |
| **Amateur / Hobbyist** | Training enthusiast without competitive focus | Training analysis, progress tracking |
| **Coach** | BJJ instructor managing multiple athletes | Athlete performance dashboard, team insights |
| **Academy** | BJJ school (future tier) | Bulk athlete management |

---

## Core Features

### 1. Competition Analysis (Opponent Scout)
- Search competitor by name in the database (8,000+ hours of fights)
- Manual upload of fight video (MP4/YouTube link)
- AI generates a **Game Plan Report** with:
  - Opponent's preferred guard, top game, submissions, patterns
  - Your strongest positions vs. their weaknesses
  - Match-specific strategy with confidence score
  - Timestamps of key moments in the analyzed footage

### 2. Training Analysis
- Upload training session video (sparring/drilling)
- AI evaluates:
  - What you did well
  - What needs improvement
  - Positional patterns over time
  - Progress tracking across sessions
- Generates a **Training Feedback Card** with key insights

### 3. Whoop Integration
- Connect Whoop via OAuth 2.0
- Correlate training sessions with biometric data:
  - Recovery score on training days
  - HRV trends vs. performance quality
  - Sleep score impact on grappling output
  - Strain vs. training volume
- AI insights: "Your best training sessions happen when recovery > 67%"

### 4. Dashboard / Home
- Training streaks and weekly activity
- Upcoming analysis queue
- Recent game plan cards
- Whoop daily readiness panel (if connected)
- Quick action: "Analyze a new opponent" / "Upload training video"

---

## Out of Scope (v1)
- Real-time video analysis (live match)
- Direct social sharing
- Multi-user team/academy management (v2)
- iOS/Android native app (v2)

---

## Success Metrics (v1)
| Metric | Target (Month 3) |
|---|---|
| Weekly Active Users | 200+ |
| Game Plans Generated | 500+ |
| Training Videos Analyzed | 1,000+ |
| Whoop Accounts Connected | 30% of users |
| Avg. Session Time | 8+ minutes |

---

## Pricing Model (Suggested)

| Plan | Price | Features |
|---|---|---|
| **Starter** | Free | 3 game plans/month, 5 training uploads |
| **Pro** | $29/month | Unlimited analysis, Whoop integration, history |
| **Elite** | $79/month | All Pro + coach dashboard, team features |

---

## Technical Constraints
- Video uploads: max 2GB per file, formats MP4/MOV/AVI
- AI processing time: 2–5 min per video (async with notification)
- Backend: handled by partner (API-first, REST)
- Frontend: React/Next.js, deployed on Vercel
- Auth: Supabase Auth (email + Google SSO)
- Storage: Supabase Storage for video files
