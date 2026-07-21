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

// What the customer sees on the Orders screen today. Every state maps onto
// the four existing badges; Phase 4 gives lifecycle/exception states their
// own labels ("On the way", "Awaiting payment", ...).
const IN_PROGRESS_STATES = [
  'provider_en_route',
  'in_progress',
  'estimate_ready',
  'approved',
  'work_in_progress',
  'work_done',
  'awaiting_payment',
  'payment_failed',
  'disputed',
]

export function statusLabel(state, flowType) {
  // An inspection order is "In progress" from the moment it's booked (the
  // visit + estimate are in flight); a direct booking is just "Scheduled".
  if (state === 'scheduled' || state === 'draft')
    return flowType === 'inspection' ? 'In progress' : 'Scheduled'
  if (IN_PROGRESS_STATES.includes(state)) return 'In progress'
  if (state === 'paid' || state === 'closed') return 'Completed'
  if (state === 'estimate_declined' || state === 'estimate_expired') return 'Rejected'
  return 'Cancelled' // cancellations + no-shows, unreachable from the UI today
}

let nextOrderId = 1

// flowType: 'inspection' (visit -> estimate -> approval) | 'direct' (booked work).
// `service` is the label shown in lists; `serviceKey` indexes SERVICES config.
export function createOrder({ serviceKey, service, flowType, provider, date, time, total, meta }) {
  const order = {
    id: nextOrderId++,
    serviceKey,
    service,
    flowType,
    provider,
    date,
    time,
    total,
    state: 'scheduled',
    history: [{ state: 'scheduled', at: Date.now(), ...(meta && { meta }) }],
  }
  return { ...order, status: statusLabel(order.state, flowType) }
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
    status: statusLabel(toState, order.flowType),
    history: [...order.history, { state: toState, at: Date.now(), ...(meta && { meta }) }],
  }
}

// Walk several states in one call. The demo compresses real-world time
// (e.g. approve + pay in one tap covers approved -> ... -> paid), but the
// history still records the full, valid path.
export function advance(order, states, meta) {
  return states.reduce((ord, state, i) => transition(ord, state, i === states.length - 1 ? meta : undefined), order)
}

// Rescheduling is an event, not a state: the order stays 'scheduled' with
// new date/time, and the move is recorded in history.
export function reschedule(order, date, time) {
  return {
    ...order,
    date,
    time,
    history: [
      ...order.history,
      { state: order.state, at: Date.now(), meta: { event: 'rescheduled', from: { date: order.date, time: order.time } } },
    ],
  }
}
