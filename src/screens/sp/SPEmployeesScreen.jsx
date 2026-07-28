import { useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import GradientButton from '../../components/GradientButton.jsx'
import { EMPLOYEE_ROLES, EMPLOYEE_COLORS } from '../../data/providers.js'

// SP onboarding: the company's roster. Add employees (workers) — each gets a
// coverage range and schedule in the next steps.
export default function SPEmployeesScreen({ title, employees, onAdd, onRemove, onContinue, onBack, manage = false }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', role: EMPLOYEE_ROLES[1], email: '', phone: '' })

  function submit() {
    if (!form.name.trim()) return
    onAdd({
      id: `emp-${Date.now()}`,
      name: form.name.trim(),
      role: form.role,
      email: form.email.trim() || 'name@email.com',
      phone: form.phone.trim() || '+971 50 000 0000',
      color: EMPLOYEE_COLORS[employees.length % EMPLOYEE_COLORS.length],
    })
    setForm({ name: '', role: EMPLOYEE_ROLES[1], email: '', phone: '' })
    setAdding(false)
  }

  return (
    <GradientHeader title={title} onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="flex grow flex-col px-4 pb-6">
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F5A623] text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
          </span>
          <span className="font-medium text-black">Add Employee</span>
        </button>

        <div className="mt-4 flex flex-col gap-4">
          {employees.map((e) => (
            <div key={e.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="relative h-16 bg-linear-[90deg,#C05CF7,#8442FF]">
                <div className="absolute -bottom-7 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white text-xl font-bold text-white" style={{ background: e.color }}>
                  {e.name[0].toUpperCase()}
                </div>
                <button type="button" onClick={() => onRemove(e.id)} aria-label="Remove" className="absolute top-2 right-2 cursor-pointer rounded-full bg-white/25 p-1 text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
              </div>
              <div className="px-4 pt-9 pb-4 text-center">
                <p className="font-semibold text-black">{e.name}</p>
                <p className="text-xs text-gray-400">{e.role}</p>
                <div className="mt-3 space-y-1.5 text-left">
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9C9AA5" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" strokeLinecap="round" /></svg>
                    {e.name}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9C9AA5" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
                    {e.email}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9C9AA5" strokeWidth="1.8"><path d="M4 5c0 9 6 15 15 15l1-4-5-2-2 2a12 12 0 0 1-5-5l2-2-2-5-4 1Z" strokeLinejoin="round" /></svg>
                    {e.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grow" />
        {(manage || employees.length > 0) && (
          <GradientButton className="mt-6" onClick={onContinue}>
            {manage ? 'Done' : `Continue (${employees.length} ${employees.length === 1 ? 'employee' : 'employees'})`}
          </GradientButton>
        )}
      </div>

      {/* Add employee sheet */}
      {adding && (
        <div className="fixed inset-0 z-30 mx-auto flex w-full max-w-[375px] items-end bg-black/40" onClick={() => setAdding(false)}>
          <div className="w-full rounded-t-3xl bg-white p-5 pb-8" onClick={(ev) => ev.stopPropagation()}>
            <h3 className="mb-3 text-lg font-semibold text-black">Add employee</h3>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className="mb-3 w-full rounded-xl border border-gray-200 p-3 text-sm text-black outline-none focus:border-[#8442FF]"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mb-3 w-full rounded-xl border border-gray-200 p-3 text-sm text-black outline-none focus:border-[#8442FF]"
            >
              {EMPLOYEE_ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="mb-3 w-full rounded-xl border border-gray-200 p-3 text-sm text-black outline-none focus:border-[#8442FF]"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
              className="mb-4 w-full rounded-xl border border-gray-200 p-3 text-sm text-black outline-none focus:border-[#8442FF]"
            />
            <GradientButton disabled={!form.name.trim()} onClick={submit}>Add</GradientButton>
          </div>
        </div>
      )}
    </GradientHeader>
  )
}
