// Order state model (PLAN.md — "Order state model"). Data layer only for
// now: screens keep rendering the same four status labels; exception states
// get their own UI in Phase 4. Orders are immutable — transition() returns a
// new object — and every change is recorded in `history` so tracking and
// support flows can be built later without migrations.

// Happy path:
//   draft -> scheduled -> provider_en_route -> in_progress
//   -> [inspection flows only] estimate_ready -> approved
//   -> work_in_progress -> work_done -> awaiting_payment -> paid -> closed
export const TRANSITIONS = {
  draft: ['scheduled', 'cancelled_by_customer'],
  scheduled: [
    'provider_en_route',
    'cancelled_by_customer',
    'cancelled_by_provider',
    'customer_no_show',
    'provider_no_show',
  ],
  provider_en_route: ['in_progress', 'customer_no_show', 'cancelled_by_provider'],
  // estimate_ready is the inspection fork; direct work goes straight to done
  in_progress: ['estimate_ready', 'work_done'],
  estimate_ready: ['approved', 'estimate_declined', 'estimate_expired'],
  approved: ['work_in_progress', 'cancelled_by_customer', 'cancelled_by_provider'],
  work_in_progress: ['work_done'],
  work_done: ['awaiting_payment'],
  awaiting_payment: ['paid', 'payment_failed'],
  payment_failed: ['awaiting_payment', 'cancelled_by_customer'],
  paid: ['closed', 'disputed'],
  disputed: ['closed'],
  // no-shows can be recovered by rebooking; the rest are terminal
  customer_no_show: ['scheduled'],
  provider_no_show: ['scheduled'],
  estimate_declined: [],
  estimate_expired: [],
  cancelled_by_customer: [],
  cancelled_by_provider: [],
  closed: [],
}

export const ORDER_STATES = Object.keys(TRANSITIONS)

// What the customer sees on the Orders screen — one label per state
// (Phase 4: the full lifecycle is surfaced, including exception states).
const STATUS_LABELS = {
  draft: 'Scheduled',
  scheduled: 'Scheduled',
  provider_en_route: 'On the way',
  in_progress: 'In progress',
  estimate_ready: 'Estimate ready',
  approved: 'Repair booked',
  work_in_progress: 'In progress',
  work_done: 'Done',
  awaiting_payment: 'Awaiting payment',
  payment_failed: 'Payment failed',
  paid: 'Completed',
  closed: 'Completed',
  estimate_declined: 'Rejected',
  estimate_expired: 'Rejected',
  cancelled_by_customer: 'Cancelled',
  cancelled_by_provider: 'Cancelled',
  customer_no_show: 'No-show',
  provider_no_show: 'No-show',
  disputed: 'Disputed',
}

export function statusLabel(state) {
  return STATUS_LABELS[state] ?? state
}

// Orders that still need something to happen (drives the tab-bar badge).
const TERMINAL_STATES = [
  'paid',
  'closed',
  'estimate_declined',
  'estimate_expired',
  'cancelled_by_customer',
  'cancelled_by_provider',
]

export function isActive(order) {
  return !TERMINAL_STATES.includes(order.state)
}

// What tapping the order in the list does: pay the final invoice, follow the
// inspection/estimate, or nothing (chevron hidden).
export function orderAction(order) {
  if (order.state === 'awaiting_payment' || order.state === 'payment_failed') return 'pay'
  if (
    order.flowType === 'inspection' &&
    ['scheduled', 'provider_en_route', 'in_progress', 'estimate_ready'].includes(order.state)
  )
    return 'track'
  return null
}

let nextOrderId = 1

// flowType: 'inspection' (visit -> estimate -> approval) | 'direct' (booked work).
// `service` is the label shown in lists; `serviceKey` indexes SERVICES config.
// Money fields: `total` = paid so far, `amountDue` = final-invoice amount
// (with `items` / `discount` / `inspectionCredit` as its breakdown).
// `meta` lands on the first history entry; other fields are stored verbatim.
export function createOrder({ meta, ...fields }) {
  const order = {
    id: nextOrderId++,
    ...fields,
    state: 'scheduled',
    history: [{ state: 'scheduled', at: Date.now(), ...(meta && { meta }) }],
  }
  return { ...order, status: statusLabel(order.state) }
}

export function canTransition(order, toState) {
  return (TRANSITIONS[order.state] ?? []).includes(toState)
}

// Returns a new order in `toState` (meta lands on the history entry, e.g.
// the estimate's products or a decline reason). Throws on transitions the
// model forbids — a simulation bug, not a user error.
export function transition(order, toState, meta) {
  if (!canTransition(order, toState))
    throw new Error(`Invalid order transition: ${order.state} -> ${toState}`)
  return {
    ...order,
    state: toState,
    status: statusLabel(toState),
    history: [...order.history, { state: toState, at: Date.now(), ...(meta && { meta }) }],
  }
}

// Walk several states in one call. The demo compresses real-world time
// (e.g. approve + pay in one tap covers approved -> ... -> paid), but the
// history still records the full, valid path.
export function advance(order, states, meta) {
  return states.reduce((ord, state, i) => transition(ord, state, i === states.length - 1 ? meta : undefined), order)
}

// Events are things that happen to an order without changing its state
// (a question to the inspector, a second-quote request, a reschedule).
// They land in the same history, tagged with the current state.
export function recordEvent(order, event, meta) {
  return {
    ...order,
    history: [...order.history, { state: order.state, at: Date.now(), meta: { event, ...meta } }],
  }
}

// Rescheduling is an event, not a state: the order stays 'scheduled' with
// new date/time, and the move is recorded in history.
export function reschedule(order, date, time) {
  return {
    ...recordEvent(order, 'rescheduled', { from: { date: order.date, time: order.time } }),
    date,
    time,
  }
}
