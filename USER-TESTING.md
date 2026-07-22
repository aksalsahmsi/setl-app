# Setl — Usability Test Script

Test on the live app: https://aksalsahmsi.github.io/setl-app/ (participant's
own phone, not yours). 5–7 participants is enough to find most problems.

## How to run each session (15–20 min)

- Read tasks aloud as **scenarios**, never as instructions. Say "your house
  needs cleaning" — never "tap the House cleaning card". If they ask "should
  I press this?", answer "do whatever you would do at home".
- Ask them to **think aloud** the whole time ("say what you're looking at,
  what you expect, what confuses you").
- **Never help.** If they're stuck >2 minutes, note it as a failure and move
  on. A failure is data, not a problem.
- After each task ask: **"How easy was that, 1 (very hard) to 7 (very
  easy)?"** and note the score.
- Record per task: success / partial / fail, roughly how long it took, where
  they hesitated, and anything they said while confused.
- Notes for you, not them: any UAE phone format + any OTP code works; a page
  refresh resets everything (do it between participants); the inspection
  estimate arrives ~4s after opening tracking; work "completes" ~15s after a
  booking is confirmed.

## Warm-up (2 min, before any tasks)

1. "Have you ever booked a home service (cleaning, AC, plumber) online or
   through an app? Which one? How was it?"
2. Open the app on the home screen, let them look for 5 seconds, then take
   the phone back: **"What do you think this app is for? What stuck out?"**

---

## Block A — "I need my usual thing" (routine booking)

**Task 1 — Book a cleaning.**
"Your house needs about 3 hours of cleaning tomorrow morning. Arrange it."
- Success: reaches the "Booking confirmed" screen with 3 hours picked.
- Watch for: do they find House cleaning from the catalog? Do they
  understand the hours picker? Do the availability chips on providers help
  them pick? At the confirm screen — do they hesitate at "AED 0 due now"?
- After: **"How much money has left your account right now?"** (Correct
  answer: nothing. If they say 71 AED, our core payment message failed.)

**Task 2 — Book a car wash.**
"Your SUV is filthy. Get someone to come wash it."
- Success: SUV wash selected → provider → confirmed.
- Watch for: do they find car wash (it's in a second row)? Do they
  understand the call-out fee added at checkout?

## Block B — "Something's broken" (the wizard & inspection engine)

**Task 3 — Broken but nameable.**
"The light in your kitchen stopped working and you're pretty sure the
fixture needs replacing. Get it fixed."
- Success: electrician flow with "Light fixture installation" (via wizard
  OR catalog — both are valid; note which they chose).
- Watch for: does the "Something broken?" button get noticed at all? This
  task tells you whether intent-first entry earns its place on Home.

**Task 4 — Broken and mysterious.**
"Your AC is making a strange noise and you have no idea what's wrong.
Do whatever you'd do."
- Success: books an AC inspection.
- Watch for: wizard vs. AC card; how they answer "Do you already know the
  service you need?"; reaction to paying 30 AED now.
- After: **"What happens to the 30 AED you just paid?"** (Correct: credited
  toward the repair if they proceed. This is our #1 trust message — if
  fewer than ~5 of 7 get it, the copy isn't working.)

**Task 5 — Review the estimate.**
(Continue from Task 4: open tracking, wait for the estimate.)
"The inspector sent this. You only want the refilling done, not the
cleaning — and you think the price is a bit high. Do whatever you'd do."
- Success: uses "Edit selected work" to deselect + approves selected work,
  and/or uses "Ask a question" / "Request another quote".
- Watch for: is "Edit selected work" discoverable? Do the "Within typical
  Setl range" badges mean anything to them? (Ask directly: **"What does
  this green label tell you? Do you believe it?"**)

**Task 6 — Pay at the end.**
"A while later your phone says the work is done. Settle up."
- Success: finds the order in Orders (Awaiting payment / Pay now), opens
  the invoice, applies nothing or the voucher, pays.
- Watch for: do they know to look in Orders? Does the itemized invoice
  (discount, inspection credit line) make sense read aloud?

**Task 7 — Use a voucher.**
"You have the discount code SETL10 — use it on this payment."
- Success: applies it on the invoice screen and sees the discount line.

## Block C — "I'm just looking" (browsing & trust)

**Task 8 — Compare prices without committing.**
"You're thinking about a plumber sometime next month. Find out roughly what
it would cost, without booking anything."
- Success: reaches the plumber providers list, reads rates, backs out.
- Watch for: do they feel forced into booking? Is the inspection-first
  notice for plumbing understood?

**Task 9 — Pick a provider and justify it.**
"Book any AC cleaning — but tell me out loud why you picked the provider
you picked."
- Listen for: rating vs. price vs. availability chips vs. name. This tells
  you which card element carries the decision.

## Wrap-up questions (3 min)

1. "In one sentence, how does paying work in this app?" (Tests whether
   pay-after-completion landed.)
2. "Was there any moment you didn't trust the app? Where?"
3. "What almost made you give up?"
4. "Compared to [app they named in warm-up], what's better here? What's
   worse?"
5. "Would you use this for real? What's missing before you would?"

## Scoring sheet (per participant)

| Task | Result (✓/±/✗) | Ease 1–7 | Where they hesitated |
|------|----------------|----------|----------------------|
| 1    |                |          |                      |
| 2    |                |          |                      |
| 3    |                |          |                      |
| 4    |                |          |                      |
| 5    |                |          |                      |
| 6    |                |          |                      |
| 7    |                |          |                      |
| 8    |                |          |                      |
| 9    |                |          |                      |

Key comprehension checks (count across participants):
- Understood AED 0 due now: __ / __
- Understood inspection credit: __ / __
- Trusted "typical Setl range" labels: __ / __
- Found "Edit selected work" unprompted: __ / __
- Noticed the "Something broken?" wizard: __ / __
