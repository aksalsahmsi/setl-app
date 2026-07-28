import { useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import GradientButton from '../../components/GradientButton.jsx'
import { SCHEDULE_DAYS, defaultSchedule } from '../../data/providers.js'

const TIMES = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '12:30 PM', '1:00 PM', '3:00 PM', '3:30 PM', '5:00 PM', '6:00 PM', '9:00 PM']

// SP onboarding: each employee's weekly schedule. "Apply Schedule to all
// employees" copies it; otherwise move to the next employee (or Done on last).
export default function SPTimeSlotsScreen({ employees, index, onSet, onApplyAll, onNext, onBack }) {
  const emp = employees[index]
  const [blocks, setBlocks] = useState(() => emp?.schedule ?? defaultSchedule())
  if (!emp) return null
  const next = employees[index + 1]

  function update(bi, patch) {
    setBlocks((bs) => bs.map((b, i) => (i === bi ? { ...b, ...patch } : b)))
  }
  function setSlot(bi, si, patch) {
    setBlocks((bs) => bs.map((b, i) => (i === bi ? { ...b, slots: b.slots.map((s, j) => (j === si ? { ...s, ...patch } : s)) } : b)))
  }
  function addSlot(bi) {
    setBlocks((bs) => bs.map((b, i) => (i === bi ? { ...b, slots: [...b.slots, { from: '9:00 AM', to: '5:00 PM' }] } : b)))
  }
  function addBlock() {
    setBlocks((bs) => [...bs, { from: 'Saturday', to: 'Saturday', slots: [{ from: '9:00 AM', to: '5:00 PM' }] }])
  }

  const DaySelect = ({ value, onChange }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-gray-200 px-2 py-1 text-sm text-black outline-none focus:border-[#8442FF]">
      {SCHEDULE_DAYS.map((d) => <option key={d}>{d}</option>)}
    </select>
  )
  const TimeSelect = ({ value, onChange }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-gray-200 px-1.5 py-1 text-xs text-black outline-none focus:border-[#8442FF]">
      {TIMES.map((t) => <option key={t}>{t}</option>)}
    </select>
  )

  return (
    <GradientHeader title={`${emp.name} Time slots`} onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="flex grow flex-col px-4 pb-6">
        <button type="button" onClick={addBlock} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F5A623] text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
          </span>
          <span className="font-medium text-black">Time Slots</span>
        </button>

        <div className="mt-4 flex flex-col gap-4">
          {blocks.map((b, bi) => (
            <div key={bi} className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">From:</span>
                <DaySelect value={b.from} onChange={(v) => update(bi, { from: v })} />
                <span className="text-gray-500">To:</span>
                <DaySelect value={b.to} onChange={(v) => update(bi, { to: v })} />
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {b.slots.map((s, si) => (
                  <div key={si} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F5A623] text-white" onClick={() => addSlot(bi)} role="button">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                    </span>
                    <TimeSelect value={s.from} onChange={(v) => setSlot(bi, si, { from: v })} />
                    <span className="text-xs text-gray-400">Till</span>
                    <TimeSelect value={s.to} onChange={(v) => setSlot(bi, si, { to: v })} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grow" />
        <button
          type="button"
          onClick={() => onApplyAll(blocks)}
          className="mb-3 h-12 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white text-[15px] font-medium text-[#8442FF] active:scale-[0.98]"
        >
          Apply Schedule to all employees
        </button>
        <GradientButton onClick={() => { onSet(index, blocks); onNext() }}>
          {next ? `${next.name} time slots →` : 'Done'}
        </GradientButton>
      </div>
    </GradientHeader>
  )
}
