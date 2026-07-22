import { CUSTOMER_ME } from '../../data/providers.js'
import { statusLabel } from '../../data/orders.js'
import GradientButton from '../../components/GradientButton.jsx'

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="shrink-0 text-sm text-black">{label}</span>
      <span className="text-right text-sm text-gray-400">{value}</span>
    </div>
  )
}

// Provider view of a booked job: the customer's details and what to do next.
// A brand-new request can be accepted or declined; an accepted job shows its
// current status and a button to continue (navigate / work / build estimate).
export default function ProviderOrderScreen({ order, onAccept, onDecline, onContinue, onBack }) {
  if (!order) return null
  const isNew = order.state === 'scheduled'
  const total = order.amountDue ?? order.total ?? 0
  const symptoms = order.history?.find((h) => h.meta?.symptoms)?.meta?.symptoms

  // Where "continue" leads for an accepted job
  const continueLabel = {
    provider_en_route: 'Continue — navigate',
    in_progress: order.flowType === 'inspection' ? 'Continue — inspection' : 'Continue — job',
    estimate_ready: 'Waiting for approval',
    approved: 'Start the work',
    work_in_progress: 'Continue — job',
  }[order.state]

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#EFEEF2] px-3 pt-4 pb-6">
      <div className="relative mb-2 flex items-center">
        <button type="button" onClick={onBack} aria-label="Go back" className="cursor-pointer p-2 text-black">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className="grow text-center font-semibold text-black">
          SETL-{String(order.id).padStart(4, '0')}
        </span>
        <span className={`text-xs font-medium ${isNew ? 'text-green-500' : 'text-[#8442FF]'}`}>
          {isNew ? 'new' : statusLabel(order.state)}
        </span>
      </div>

      <h2 className="mt-2 mb-2 px-1 text-lg font-semibold text-black">Customer data</h2>
      <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <Row label="Name" value={CUSTOMER_ME.name} />
        <Row label="Phone number" value={CUSTOMER_ME.phone} />
        <Row label="Address" value={CUSTOMER_ME.address} />
        <Row label="Service" value={order.service} />
        <Row label="Date" value={`${order.date.day} ${order.date.num}`} />
        <Row label="Time" value={order.time} />
      </div>

      {symptoms?.length > 0 && (
        <>
          <h2 className="mt-5 mb-2 px-1 text-lg font-semibold text-black">What the customer reported</h2>
          <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            {symptoms.map((s) => (
              <span key={s} className="rounded-full bg-[#F1ECFB] px-3 py-1 text-xs text-[#8442FF]">
                {s}
              </span>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-5 mb-2 px-1 text-lg font-semibold text-black">Location</h2>
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <span className="text-sm text-gray-400">{CUSTOMER_ME.area}</span>
        <span className="flex items-center gap-1 text-sm font-medium text-[#8442FF]">
          Maps
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </span>
      </div>

      <h2 className="mt-5 mb-2 px-1 text-lg font-semibold text-black">Price</h2>
      <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        {order.flowType === 'inspection' ? (
          <>
            <Row label="Inspection fee (prepaid)" value={`${order.total ?? 0} AED`} />
            <p className="pt-1 text-xs text-gray-400">
              Repair price is set from your on-site estimate, credited by the inspection fee.
            </p>
          </>
        ) : (
          <Row label="Job total (paid after completion)" value={`${total} AED`} />
        )}
      </div>

      <div className="grow" />

      {isNew ? (
        <>
          <GradientButton className="mt-6" onClick={() => onAccept(order)}>
            Accept &amp; start
          </GradientButton>
          <button
            type="button"
            onClick={() => onDecline(order)}
            className="mt-3 h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white text-[15px] font-medium text-gray-500 transition-transform duration-100 active:scale-[0.98]"
          >
            Decline
          </button>
        </>
      ) : continueLabel ? (
        <GradientButton
          className="mt-6"
          disabled={order.state === 'estimate_ready'}
          onClick={() => onContinue(order)}
        >
          {continueLabel}
        </GradientButton>
      ) : (
        <p className="mt-6 text-center text-sm text-gray-400">
          {statusLabel(order.state)} — nothing to do here.
        </p>
      )}
    </div>
  )
}
