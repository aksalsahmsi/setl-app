import { useState } from 'react'
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
// requests"). Incoming unassigned jobs get an Assign action; assigned jobs
// show who's on them and the live status.
export default function SPRequestsScreen({ title, heading, orders, employees, onAssign, onBack }) {
  const [assigning, setAssigning] = useState(null)

  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-24">
      <div className="relative bg-linear-[90deg,#C05CF7,#8442FF] px-4 pt-5 pb-5">
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
                <div key={o.id} className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
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
                      {!unassigned && <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[statusLabel(o.state)] ?? 'bg-gray-100 text-gray-500'}`}>{statusLabel(o.state)}</span>}
                    </div>
                  </div>
                  {unassigned && (
                    <button
                      type="button"
                      onClick={() => setAssigning(o)}
                      disabled={employees.length === 0}
                      className="mt-3 h-10 w-full cursor-pointer rounded-full bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] text-sm font-medium text-white active:opacity-90 disabled:opacity-40"
                    >
                      {employees.length === 0 ? 'Add employees to assign' : 'Assign to a worker'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {assigning && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/40" onClick={() => setAssigning(null)}>
          <div className="w-full rounded-t-3xl bg-white p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1 text-lg font-semibold text-black">Assign {assigning.service}</h3>
            <p className="mb-3 text-xs text-gray-400">Pick a worker to send this job to.</p>
            <div className="flex flex-col gap-2">
              {employees.map((e) => (
                <button key={e.id} type="button" onClick={() => { onAssign(assigning.id, e); setAssigning(null) }} className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 text-left active:bg-gray-50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: e.color }}>{e.name[0].toUpperCase()}</div>
                  <div>
                    <p className="text-sm font-medium text-black">{e.name}</p>
                    <p className="text-xs text-gray-400">{e.role} · {e.coverage ?? 15} KM</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
