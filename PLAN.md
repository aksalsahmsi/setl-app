# Setl — Product Design & Delivery Plan (canonical)

Merged July 2026 from the FigJam board, the original product plan, and the
"Setl — Product Design and Delivery Plan" review. This file is the single
source of truth; earlier plans are superseded.

## How users think (design for these, not for categories)

1. **"Something's broken."** Stressed, wants a trustworthy person fast, can't
   always name the exact service. Needs guidance and price transparency later
   (at approval), not upfront forms.
2. **"I need my usual thing."** (cleaning, AC top-up) Knows exactly what
   they want. Speed wins — minimum taps from open to booked.
3. **"I'm just looking."** Compares prices before committing. Needs rates
   visible without commitment.

The 3 service categories (no inspection / optional / required) stay as the
**engine** in `SERVICES` config — never as something users must understand.
The app asks human questions and the config decides the flow.

## Locked product decisions

| # | Decision | Choice |
|---|----------|--------|
| A | Entry for uncertain repairs | **Symptom-first wizard**: problem area → symptoms → "Do you already know the service you need?" Provider choice comes only after that. Confident users skip the wizard via the catalog |
| B | Payment timing | **Pay after completion** for services — **AED 0 due now** at booking. Inspection fee stays prepaid (small, standardized) |
| C | Inspection fee | Prepaid **and credited toward the repair** if the customer proceeds — say it everywhere the fee appears |
| D | Home entry | Both: a prominent **"Something broken? Get it fixed"** intent button + the browsable catalog |
| E | Provider cards | Show **availability chips**: next free slot + 2 quick alternative slots, so "soonest" and "Saturday morning" users are both served without opening the sheet |
| F | Price transparency | Labels must be **defensible**: "Below / Within / Above typical Setl range", sourced as "based on recent Setl jobs" — never "market price", which we can't substantiate |
| G | MVP discipline | **House cleaning + AC only** until inspection → estimate → approval → payment is solid end-to-end. No new service verticals before that |

## Copy standards (canonical strings — use verbatim)

- **Price verdict chips**: `Below typical Setl range` / `Within typical Setl
  range` / `Above typical Setl range`, always near the source note
  `Based on recent Setl jobs`. Never "market price".
- **Payment timing**: `AED 0 due now — pay when the work is done.`
- **Inspection fee**: `Credited toward your repair if you proceed.`
  (appears with the fee at booking, checkout, tracking, and estimate approval)
- **Diagnosis question**: `Do you already know the service you need?`
  (wizard); catalog-screen variant: `Not sure what's wrong? Book an
  inspection.`

## User journeys (target state)

### 1. Fix something (inspection engine underneath)
Home "Get it fixed" → pick problem area (AC / plumbing / electrical / network
/ appliance) → pick symptoms → "Do you already know the service you need?"
- **Yes** → service options (counts / problem checkboxes) → providers with
  availability chips → confirm booking (AED 0 due now) → track → work done →
  pay
- **Not sure** → inspection providers (standardized fee, credited toward the
  repair) → schedule → prepay fee → track → inspector's itemized estimate
  with Setl-range verdicts → estimate actions (below) → work → pay on
  completion (inspection fee credited)

**Estimate actions** (richer than approve/reject): **Approve** · **Edit
selected work** (deselect line items) · **Ask a question** · **Request
another quote** · **Decline** (reason optional).

### 2. Routine service (hourly)
Catalog card (House cleaning) → providers with AED/hr + availability chips →
pick hours needed + time → confirm (AED 0 due now) → provider arrives →
done → pay.

### 3. Browsing
Catalog → provider lists show rates upfront, no commitment required.

## Order state model (data model now, UI later)

Happy path:

```
draft → scheduled → provider_en_route → in_progress
      → [inspection flows only] estimate_ready → approved
      → work_in_progress → work_done → awaiting_payment → paid → closed
```

Exception states (modeled from day one, surfaced in UI in Phase 4):

- `estimate_declined`, `estimate_expired` (customer never responded)
- `cancelled_by_customer`, `cancelled_by_provider`
- `customer_no_show`, `provider_no_show`
- `rescheduled` (event, returns to `scheduled`)
- `payment_failed` (returns to `awaiting_payment`)
- `disputed`

Every order stores its state history (state, timestamp) so tracking screens
and support flows can be built without migrations later.

## Build phases

- **Phase 0 — Foundations as code (one week)**
  - Extended `SERVICES` config schema: per-service flags for inspection
    requirement, pricing model (fixed / hourly / estimate), wizard symptoms,
    standardized inspection fee
  - Order state model above implemented in the data layer (in-memory for
    now), with state history
- **Phase 1 — Trust & checkout changes** (touches existing screens)
  - Pay-after-completion: checkout becomes "Confirm booking — AED 0 due now,
    pay when the work is done"; orders gain an **awaiting_payment** state
    paid from Orders
  - Itemized final invoice at payment time
  - Inspection credit: "− inspection fee" line in the repair checkout + the
    canonical credit copy on every fee surface
  - Availability chips (next slot + 2 quick slots) on provider cards
- **Phase 2 — Hourly services (house cleaning)**
  - Hours-needed picker, hourly checkout math (rate × hours)
  - House cleaning wired from Home (MVP scope; car wash and others wait —
    decision G)
- **Phase 3 — Symptom-first entry**
  - "Something broken?" wizard on Home: problem area → symptoms → "Do you
    already know the service you need?" → routes into existing flows
  - Richer estimate actions on the estimate screen (Approve / Edit selected
    work / Ask a question / Request another quote / Decline)
- **Phase 4 — Order lifecycle UI**
  - Surface the state model: Scheduled → On the way → In progress → Done →
    Awaiting payment → Paid, plus exception states
  - "Provider on the way" tracking state + notification simulation
- **Phase 5 — Backend** (replaces simulations one at a time)
  - Real OTP, providers, orders, price updates via API; then payments;
    then provider app connected to customer orders

Each phase is shippable on its own. Order chosen so trust-critical changes
land first and every phase demos end-to-end.

## Current simulations to replace (tracked)

- OTP accepts any code
- Inspection estimate arrives via 4s `setTimeout` in `OrderTrackingScreen`
- Providers / orders are hardcoded, in-memory
- Payment is a 1.2s `setTimeout`
