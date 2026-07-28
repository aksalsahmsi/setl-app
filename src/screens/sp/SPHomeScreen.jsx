import { useState } from 'react'
import { statusLabel } from '../../data/orders.js'

function orderNo(o) {
  return `SETL-${String(o.id).padStart(4, '0')}`
}
function money(o) {
  return o.amountDue ?? o.total ?? 0
}

// Service Provider dashboard: incoming customer jobs the company assigns to
// one of its workers, plus the team roster. (Onboarding mockups end at the
// profile; this operational screen is designed to fit the agreed flow:
// customer books -> SP assigns -> worker fulfills.)
export default function SPHomeScreen({ company, orders, onAssign, onSwitchCustomer, onSwitchWorker, onLogout }) {
  const [assigning, setAssigning] = useState(null) // order being assigned
  const employees = company.employees ?? []

  const unassigned = orders.filter((o) => o.state === 'scheduled' && !o.assignedName)
  const assigned = orders.filter((o) => o.assignedName && !['paid', 'closed', 'cancelled_by_customer', 'cancelled_by_provider', 'estimate_declined', 'estimate_expired'].includes(o.state))

  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-6">
      <div className="bg-linear-[90deg,#C05CF7,#8442FF] px-4 pt-8 pb-8 text-white">
        <p className="text-xs text-white/80">Service Provider</p>
        <p className="text-xl font-semibold">{company.profile?.name || 'Your company'}</p>
        <p className="mt-0.5 text-sm text-white/85">{employees.length} employees · {(company.services ?? []).length} services</p>
      </div>

      <div className="px-4 pt-5">
        {/* Incoming (unassigned) */}
        <h2 className="mb-3 text-lg font-semibold text-black">
          Incoming requests <span className="text-[#8442FF]">({unassigned.length})</span>
        </h2>
        {unassigned.length === 0 ? (
          <p className="mb-6 rounded-2xl bg-white p-4 text-center text-sm text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            No new customer requests waiting to be assigned.
          </p>
        ) : (
          <div className="mb-6 flex flex-col gap-3">
            {unassigned.map((o) => (
              <div key={o.id} className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">{orderNo(o)} · {o.date.day} {o.date.num}, {o.time}</p>
                    <p className="font-semibold text-black">{o.service}</p>
                  </div>
                  <span className="text-sm font-bold text-black">{money(o)} AED</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAssigning(o)}
                  disabled={employees.length === 0}
                  className="mt-3 h-10 w-full cursor-pointer rounded-full bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] text-sm font-medium text-white active:opacity-90 disabled:opacity-40"
                >
                  {employees.length === 0 ? 'Add employees to assign' : 'Assign to a worker'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Assigned / in progress */}
        {assigned.length > 0 && (
          <>
            <h2 className="mb-3 text-lg font-semibold text-black">In progress</h2>
            <div className="mb-6 flex flex-col gap-3">
              {assigned.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  <div>
                    <p className="text-xs text-gray-400">{orderNo(o)} · {o.assignedName}</p>
                    <p className="font-semibold text-black">{o.service}</p>
                    <span className="mt-1 inline-block rounded-full bg-[#EDE4FD] px-2 py-0.5 text-[11px] font-medium text-[#8442FF]">{statusLabel(o.state)}</span>
                  </div>
                  <span className="text-sm font-bold text-black">{money(o)} AED</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Team */}
        <h2 className="mb-3 text-lg font-semibold text-black">Team</h2>
        <div className="mb-6 flex flex-col gap-2">
          {employees.map((e) => {
            const jobs = assigned.filter((o) => o.assignedName === e.name).length
            return (
              <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: e.color }}>{e.name[0].toUpperCase()}</div>
                <div className="grow">
                  <p className="text-sm font-semibold text-black">{e.name}</p>
                  <p className="text-xs text-gray-400">{e.role} · {e.coverage ?? 15} KM</p>
                </div>
                {jobs > 0 && <span className="rounded-full bg-[#EDE4FD] px-2 py-0.5 text-[11px] font-medium text-[#8442FF]">{jobs} active</span>}
              </div>
            )
          })}
        </div>

        {/* Role switches */}
        <button type="button" onClick={onSwitchCustomer} className="mb-2 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <span className="text-[15px] font-medium text-[#8442FF]">Switch to customer app</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8442FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4M4 7h13M16 21l4-4-4-4M20 17H7" /></svg>
        </button>
        <button type="button" onClick={onSwitchWorker} className="mb-2 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <span className="text-[15px] font-medium text-[#8442FF]">Switch to worker app (Alana)</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8442FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4M4 7h13M16 21l4-4-4-4M20 17H7" /></svg>
        </button>
        <button type="button" onClick={onLogout} className="rounded-2xl bg-white px-4 py-3.5 text-left text-[15px] text-red-500 shadow-[0_2px_8px_rgba(0,0,0,0.06)] w-full">Log out</button>
      </div>

      {/* Assign sheet */}
      {assigning && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/40" onClick={() => setAssigning(null)}>
          <div className="w-full rounded-t-3xl bg-white p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1 text-lg font-semibold text-black">Assign {assigning.service}</h3>
            <p className="mb-3 text-xs text-gray-400">Pick a worker to send this job to.</p>
            <div className="flex flex-col gap-2">
              {employees.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => { onAssign(assigning.id, e); setAssigning(null) }}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 text-left active:bg-gray-50"
                >
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
