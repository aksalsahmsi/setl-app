import { useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import GradientButton from '../../components/GradientButton.jsx'
import { EMPLOYEE_ROLES, EMPLOYEE_COLORS } from '../../data/providers.js'

const BLANK = { name: '', role: EMPLOYEE_ROLES[1], email: '', phone: '' }

// SP roster. Add / edit / remove employees (workers). Each worker manages
// their own availability from the worker app; the SP just keeps the roster.
export default function SPEmployeesScreen({ title, employees, onAdd, onUpdate, onRemove, onContinue, onBack, manage = false }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingId, setEditingId] = useState(null) // null = adding a new one
  const [form, setForm] = useState(BLANK)
  const [confirmRemove, setConfirmRemove] = useState(null) // employee pending deletion

  function openAdd() {
    setEditingId(null)
    setForm(BLANK)
    setSheetOpen(true)
  }
  function openEdit(e) {
    setEditingId(e.id)
    setForm({ name: e.name, role: e.role, email: e.email, phone: e.phone })
    setSheetOpen(true)
  }
  function submit() {
    if (!form.name.trim()) return
    const patch = {
      name: form.name.trim(),
      role: form.role,
      email: form.email.trim() || 'name@email.com',
      phone: form.phone.trim() || '+971 50 000 0000',
    }
    if (editingId) {
      onUpdate(editingId, patch)
    } else {
      onAdd({ id: `emp-${Date.now()}`, ...patch, color: EMPLOYEE_COLORS[employees.length % EMPLOYEE_COLORS.length] })
    }
    setForm(BLANK)
    setEditingId(null)
    setSheetOpen(false)
  }

  return (
    <GradientHeader title={title} onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="flex grow flex-col px-4 pb-6">
        <button
          type="button"
          onClick={openAdd}
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
                <button type="button" onClick={() => openEdit(e)} aria-label={`Edit ${e.name}`} className="absolute top-2 left-2 cursor-pointer rounded-full bg-white/25 p-1.5 text-white active:bg-white/40">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h4L18 10l-4-4L4 16v4Z" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" onClick={() => setConfirmRemove(e)} aria-label={`Remove ${e.name}`} className="absolute top-2 right-2 cursor-pointer rounded-full bg-white/25 p-1.5 text-white active:bg-white/40">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
              </div>
              <div className="px-4 pt-9 pb-4 text-center">
                <p className="font-semibold text-black">{e.name}</p>
                <p className="text-xs text-gray-400">{e.role}</p>
                <div className="mt-3 space-y-1.5 text-left">
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

      {/* Add / edit employee sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-40 mx-auto flex w-full max-w-[375px] items-end bg-black/40" onClick={() => setSheetOpen(false)}>
          <div className="w-full rounded-t-3xl bg-white p-5 pb-8" onClick={(ev) => ev.stopPropagation()}>
            <h3 className="mb-3 text-lg font-semibold text-black">{editingId ? 'Edit employee' : 'Add employee'}</h3>
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
            <GradientButton disabled={!form.name.trim()} onClick={submit}>{editingId ? 'Save changes' : 'Add'}</GradientButton>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[375px] items-center justify-center bg-black/40 px-6" onClick={() => setConfirmRemove(null)}>
          <div className="w-full rounded-2xl bg-white p-5 text-center" onClick={(ev) => ev.stopPropagation()}>
            <h3 className="text-lg font-semibold text-black">Remove {confirmRemove.name}?</h3>
            <p className="mt-1 text-sm text-gray-400">They&apos;ll be taken off your roster and can no longer be assigned jobs.</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmRemove(null)}
                className="h-11 flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white text-[15px] font-medium text-black active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { onRemove(confirmRemove.id); setConfirmRemove(null) }}
                className="h-11 flex-1 cursor-pointer rounded-xl bg-red-500 text-[15px] font-medium text-white active:scale-[0.98]"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </GradientHeader>
  )
}
