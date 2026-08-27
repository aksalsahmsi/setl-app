import { PROVIDER_ME } from '../../data/providers.js'
import { statusLabel } from '../../data/orders.js'

// How a worker sees each order state (buckets on their home screen).
function bucket(state) {
  if (state === 'scheduled') return 'new'
  if (['provider_en_route', 'in_progress', 'work_in_progress', 'approved'].includes(state)) return 'active'
  if (state === 'estimate_ready') return 'waiting'
  if (['work_done', 'awaiting_payment', 'paid', 'closed'].includes(state)) return 'done'
  return 'other' // cancelled / declined / no-show
}

const STATUS_STYLE = {
  active: 'bg-[#EDE4FD] text-[#8442FF]',
  waiting: 'bg-orange-50 text-orange-500',
  done: 'bg-green-50 text-green-600',
}

function orderNo(order) {
  return `SETL-${String(order.id).padStart(4, '0')}`
}

function money(order) {
  return order.amountDue ?? order.total ?? 0
}

function duration(order) {
  if (order.hours) return `${order.hours} hr${order.hours === 1 ? '' : 's'}`
  if (order.flowType === 'inspection') return '≈ 30 min'
  return '≈ 1–2 hrs'
}

function JobCard({ order, onOpen }) {
  const b = bucket(order.state)
  return (
    <button
      type="button"
      onClick={() => onOpen(order)}
      className="w-full rounded-2xl bg-white p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-transform duration-100 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" />
          </svg>
          {order.time}
        </span>
        <span className="flex items-center gap-1.5">
          {order.date.day} {order.date.num}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div className="min-w-0">
          <p className="truncate text-[13px] text-gray-400">
            Order no : <span className="text-gray-500">{orderNo(order)}</span>
          </p>
          <p className="mt-1 truncate text-[15px] font-semibold text-black">{order.service}</p>
          <p className="mt-0.5 text-lg font-bold text-black">{money(order)} AED</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {order.flowType === 'inspection' && (
            <span className="rounded-full bg-[#8442FF] px-2.5 py-0.5 text-[11px] font-medium text-white">
              Inspection
            </span>
          )}
          {b !== 'new' && (
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[b] ?? 'bg-gray-100 text-gray-500'}`}>
              {statusLabel(order.state)}
            </span>
          )}
          <span className="rounded-full bg-[#FBEED0] px-2.5 py-0.5 text-[11px] font-medium text-[#B5820E]">
            {duration(order)}
          </span>
        </div>
      </div>
    </button>
  )
}

// Provider (worker) home: incoming job requests and jobs in progress.
export default function ProviderHomeScreen({ orders, onOpenOrder, employee, companyName }) {
  // Show the role/company that employs this worker when linked to an SP
  // (else fall back to the standalone trade) — keeps identity consistent.
  const subtitle = employee
    ? `${employee.role}${companyName ? ` · ${companyName}` : ''}`
    : PROVIDER_ME.trade
  const relevant = orders.filter((o) => bucket(o.state) !== 'other')
  const groups = [
    { key: 'new', title: 'New Request', items: relevant.filter((o) => bucket(o.state) === 'new') },
    { key: 'active', title: 'In progress', items: relevant.filter((o) => bucket(o.state) === 'active') },
    { key: 'waiting', title: 'Waiting on customer', items: relevant.filter((o) => bucket(o.state) === 'waiting') },
    { key: 'done', title: 'Completed', items: relevant.filter((o) => bucket(o.state) === 'done') },
  ]

  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-24">
      {/* Header with the worker's identity */}
      <div className="relative brand-header rounded-b-[30px] pb-10">
        <div className="flex flex-col items-center pt-10">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/40 text-2xl font-bold text-white shadow-lg"
            style={{ background: PROVIDER_ME.color }}
          >
            {PROVIDER_ME.name[0]}
          </div>
          <p className="mt-3 text-lg font-semibold text-white">{PROVIDER_ME.name}</p>
          <p className="text-sm text-white/85">{subtitle}</p>
        </div>
      </div>

      <div className="-mt-5 rounded-t-[26px] bg-[#F5F4F7] px-4 pt-6">
        {relevant.length === 0 ? (
          <div className="flex flex-col items-center pt-20 text-center">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#C9C7D1" strokeWidth="1.5">
              <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
            </svg>
            <p className="mt-4 font-medium text-black">No jobs yet</p>
            <p className="mt-1 text-sm text-gray-400">
              When a customer books, their request appears here.
            </p>
          </div>
        ) : (
          groups
            .filter((g) => g.items.length > 0)
            .map((g) => (
              <div key={g.key} className="mb-6">
                <h2 className="mb-3 text-lg font-semibold text-black">
                  {g.title}
                  {g.key === 'new' && (
                    <span className="text-[#8442FF]">({g.items.length})</span>
                  )}
                </h2>
                <div className="flex flex-col gap-3">
                  {g.items.map((o) => (
                    <JobCard key={o.id} order={o} onOpen={onOpenOrder} />
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}
