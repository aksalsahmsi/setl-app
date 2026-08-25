import { statusLabel } from '../../data/orders.js'

function orderNo(o) {
  return `SETL-${String(o.id).padStart(4, '0')}`
}
function money(o) {
  return o.amountDue ?? o.total ?? 0
}

const STATUS_STYLE = {
  Scheduled: 'bg-blue-50 text-blue-600',
  'On the way': 'bg-[#EDE4FD] text-[#8442FF]',
  'In progress': 'bg-[#EDE4FD] text-[#8442FF]',
  'Estimate ready': 'bg-orange-50 text-orange-500',
  'Repair booked': 'bg-blue-50 text-blue-600',
  Done: 'bg-green-50 text-green-600',
  'Awaiting payment': 'bg-orange-50 text-orange-500',
  Completed: 'bg-green-50 text-green-600',
}

// Service Provider's request lists (mockup "Existing requests" / "Previous
// requests"). Each card opens the request detail, where the dispatcher sees
// the customer + location and assigns a worker.
export default function SPRequestsScreen({ title, heading, orders, onOpen, onBack }) {
  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-24">
      <div className="relative brand-header px-4 pt-5 pb-5">
        <button type="button" onClick={onBack} aria-label="Go back" className="absolute top-4 left-2 cursor-pointer p-2 text-white">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </button>
        <h1 className="text-center text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="px-4 pt-5">
        <h2 className="mb-3 text-lg font-semibold text-black">
          {heading} <span className="text-[#8442FF]">({orders.length})</span>
        </h2>
        {orders.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-center text-sm text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">Nothing here yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((o) => {
              const unassigned = o.state === 'scheduled' && !o.assignedName
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onOpen(o)}
                  className="w-full rounded-2xl bg-white p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:bg-gray-50"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{o.time}</span>
                    <span>{o.date.day} {o.date.num}</span>
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Order no : {orderNo(o)}</p>
                      <p className="font-semibold text-black">{o.service}</p>
                      <p className="text-lg font-bold text-black">{money(o)} AED</p>
                      {o.assignedName && <p className="mt-0.5 text-xs text-gray-400">Worker: {o.assignedName}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {o.flowType === 'inspection' && <span className="rounded-full bg-[#8442FF] px-2.5 py-0.5 text-[11px] font-medium text-white">Inspection</span>}
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${unassigned ? 'bg-orange-50 text-orange-500' : STATUS_STYLE[statusLabel(o.state)] ?? 'bg-gray-100 text-gray-500'}`}>
                        {unassigned ? 'Needs a worker' : statusLabel(o.state)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-1 border-t border-gray-100 pt-2.5 text-xs font-medium text-[#8442FF]">
                    {unassigned ? 'View & assign' : 'View details'}
                    <svg width="6" height="10" viewBox="0 0 10 18" fill="none"><path d="m1 1 7 8-7 8" stroke="#8442FF" strokeWidth="2.5" strokeLinecap="round" /></svg>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
