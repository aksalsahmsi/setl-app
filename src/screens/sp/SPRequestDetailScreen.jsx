import GradientHeader from '../../components/GradientHeader.jsx'
import { statusLabel } from '../../data/orders.js'
import { CUSTOMER_ME, jobDistanceKm, jobWeekday, rankWorkersForJob } from '../../data/providers.js'

function orderNo(o) {
  return `SETL-${String(o.id).padStart(4, '0')}`
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

// The dispatcher's view of one request: who the customer is, where the job is,
// what they reported — and a worker picker that ranks the company's workers by
// who actually covers the area and is on shift that day (using the coverage +
// schedule collected in onboarding).
export default function SPRequestDetailScreen({ order, employees = [], onAssign, onBack }) {
  if (!order) return null

  const money = order.amountDue ?? order.total ?? 0
  const symptoms = order.history?.find((h) => h.meta?.symptoms)?.meta?.symptoms ?? []
  const distanceKm = jobDistanceKm(order)
  const weekday = jobWeekday(order)
  const unassigned = order.state === 'scheduled' && !order.assignedName
  const ranked = rankWorkersForJob(employees, order)

  return (
    <GradientHeader title={orderNo(order)} onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-4 pb-24">
        {/* Job summary */}
        <div className="mt-1 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-black">{order.service}</p>
              <p className="mt-0.5 text-sm text-gray-400">
                {order.date.day} {order.date.num} · {order.time}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {order.flowType === 'inspection' && (
                <span className="rounded-full bg-[#8442FF] px-2.5 py-0.5 text-[11px] font-medium text-white">
                  Inspection
                </span>
              )}
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  STATUS_STYLE[statusLabel(order.state)] ?? 'bg-gray-100 text-gray-500'
                }`}
              >
                {statusLabel(order.state)}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-400">{order.flowType === 'inspection' ? 'Inspection fee' : 'Job total'}</span>
            <span className="text-lg font-bold text-black">{money} AED</span>
          </div>
        </div>

        {/* Customer */}
        <h2 className="mt-5 mb-2 px-1 text-sm font-semibold text-gray-500">Customer</h2>
        <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8442FF] text-lg font-semibold text-white">
              {CUSTOMER_ME.name[0]}
            </div>
            <div>
              <p className="font-medium text-black">{CUSTOMER_ME.name}</p>
              <p className="text-xs text-gray-400">{CUSTOMER_ME.phone}</p>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-2 border-t border-gray-100 pt-3">
            <svg width="16" height="18" viewBox="0 0 18 22" fill="none" stroke="#8442FF" strokeWidth="1.8" className="mt-0.5 shrink-0">
              <path d="M9 1a7 7 0 0 1 7 7c0 5-7 12.5-7 12.5S2 13 2 8a7 7 0 0 1 7-7Z" />
              <circle cx="9" cy="8" r="2.5" />
            </svg>
            <p className="text-sm text-black">
              {CUSTOMER_ME.address}
              <span className="mt-0.5 block text-xs text-gray-400">≈ {distanceKm} KM from base</span>
            </p>
          </div>
        </div>

        {/* What the customer reported */}
        {symptoms.length > 0 && (
          <>
            <h2 className="mt-5 mb-2 px-1 text-sm font-semibold text-gray-500">Reported</h2>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((s) => (
                <span key={s} className="rounded-full bg-[#EDE4FD] px-3 py-1.5 text-xs font-medium text-[#8442FF]">
                  {s}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Assignment */}
        <h2 className="mt-5 mb-2 px-1 text-sm font-semibold text-gray-500">
          {unassigned ? `Assign a worker · ${weekday}` : 'Assigned worker'}
        </h2>

        {order.assignedName && (
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0FA3A3] text-sm font-bold text-white">
              {order.assignedName[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-black">{order.assignedName}</p>
              <p className="text-xs text-gray-400">On this job</p>
            </div>
          </div>
        )}

        {unassigned &&
          (employees.length === 0 ? (
            <p className="rounded-2xl bg-white p-5 text-center text-sm text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              Add employees before you can assign this job.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {ranked.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => onAssign(order.id, e)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:bg-gray-50 ${
                    e.inRange && e.available ? 'border-[#D9CBF7]' : 'border-transparent'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: e.color }}>
                    {e.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 grow">
                    <p className="truncate text-sm font-medium text-black">{e.name}</p>
                    <p className="text-xs text-gray-400">{e.role}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          e.inRange ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'
                        }`}
                      >
                        {e.inRange ? `Covers area · ${e.coverage} KM` : `Out of range · ${e.coverage} KM`}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          e.available ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {e.available ? `On shift ${weekday}` : `Off ${weekday}`}
                      </span>
                      {e.availableNow && (
                        <span className="rounded-full bg-[#EDE4FD] px-2 py-0.5 text-[10px] font-medium text-[#8442FF]">Online now</span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#8442FF] px-3 py-1.5 text-xs font-medium text-white">
                    Assign
                  </span>
                </button>
              ))}
            </div>
          ))}

        {!unassigned && !order.assignedName && (
          <p className="rounded-2xl bg-white p-5 text-center text-sm text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            This request was handled without a worker assignment.
          </p>
        )}
      </div>
    </GradientHeader>
  )
}
