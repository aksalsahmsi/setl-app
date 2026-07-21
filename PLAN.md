# Setl — Product Plan

Planned user-first (July 2026). Source: FigJam board + product decisions below.

## How users think (design for these, not for categories)

1. **"Something's broken."** Stressed, wants a trustworthy person fast, can't
   always name the exact service. Needs guidance and price transparency later
   (at approval), not upfront forms.
2. **"I need my usual thing."** (maid, car wash, AC top-up) Knows exactly what
   they want. Speed wins — minimum taps from open to booked.
3. **"I'm just looking."** Compares prices before committing. Needs rates
   visible without commitment.

The 3 service categories (no inspection / optional / required) stay as the
**engine** in `SERVICES` config — never as something users must understand.
The app asks human questions ("Do you know what needs fixing?") and the
config decides the flow.

## Locked product decisions

| # | Decision | Choice |
|---|----------|--------|
| A | Booking order | Provider-first, but every provider card shows their **next free slot** ("Today 4:00pm") so both "soonest" and "Saturday morning" users are served |
| B | Payment timing | **Pay after completion** for services (0 AED at booking). Inspection fee stays prepaid (small, standardized) |
| C | Inspection fee | **Credited toward the repair** if the customer proceeds — say it everywhere the fee appears |
| D | Home entry | Both: a prominent **"Something broken? Get it fixed"** intent button + the browsable catalog |

## User journeys (target state)

### 1. Fix something (inspection engine underneath)
Home "Get it fixed" → pick problem area (AC / plumbing / electrical / network
/ appliance) → "Do you know what needs fixing?"
- **Yes** → service options (counts / problem checkboxes) → providers with
  availability → confirm booking (0 AED now) → track → work done → pay
- **Not sure** → inspection providers (standardized fee, "credited toward
  your repair") → schedule → prepay fee → track → inspector's products +
  explanation with market-price verdicts → approve (fee credited, pay on
  completion) or reject (reason optional)

### 2. Routine service (hourly)
Catalog card (House maid / Car wash) → providers with AED/hr + next slot →
pick hours needed (e.g. 3:30) + time → confirm (0 AED now) → provider
arrives → done → pay.

### 3. Browsing
Catalog → provider lists show rates upfront, no commitment required.

## Build phases

- **Phase 1 — Trust & checkout changes** (touches existing screens)
  - Pay-after-completion: checkout becomes "Confirm booking — pay when the
    work is done"; orders gain an *Awaiting payment* state paid from Orders
  - Inspection credit: "- 20 AED inspection credit" line in maintenance
    checkout + copy on fee screens
  - Availability chip ("Today 4:00pm") on provider cards
- **Phase 2 — Category 1: hourly services**
  - Hours-needed picker, hourly checkout math (rate × hours)
  - House maid + Car wash services wired from Home
- **Phase 3 — Intent-first entry**
  - "Something broken?" wizard on Home (2 questions → routes into existing flows)
  - Problem-picker options screen (technician: TV/router, appliance repair,
    smart home; network: Wi-Fi optimization, coverage)
- **Phase 4 — Order lifecycle**
  - Statuses: Scheduled → On the way → In progress → Done → Paid
  - "Driver on the way" state on tracking + notification simulation
- **Phase 5 — Backend** (replaces simulations one at a time)
  - Real OTP, providers, orders, price updates via API; then payments;
    then provider app connected to customer orders

Each phase is shippable on its own. Order chosen so trust-critical changes
land first and every phase demos end-to-end.
