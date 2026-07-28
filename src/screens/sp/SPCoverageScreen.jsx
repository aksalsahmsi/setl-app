import { useState } from 'react'
import FakeMap from '../../components/FakeMap.jsx'
import GradientButton from '../../components/GradientButton.jsx'

// SP onboarding: set each employee's service coverage range. "Apply range for
// all employees" copies it to everyone; otherwise move to the next employee.
export default function SPCoverageScreen({ employees, index, onSet, onApplyAll, onNext, onBack }) {
  const emp = employees[index]
  const [km, setKm] = useState(emp?.coverage ?? 15)
  if (!emp) return null
  const next = employees[index + 1]

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-white">
      <div className="relative shrink-0 bg-linear-[90deg,#C05CF7,#8442FF] pt-4 pb-4">
        <button type="button" onClick={onBack} aria-label="Go back" className="absolute top-3 left-2 cursor-pointer p-2 text-white">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </button>
        <h1 className="text-center text-lg font-semibold text-white">{emp.name} range of availability</h1>
      </div>

      <div className="relative">
        <div className="absolute inset-x-3 top-3 z-10 flex h-11 items-center gap-3 rounded-xl bg-white px-4 shadow">
          <svg width="16" height="16" viewBox="0 0 22 22" fill="none" stroke="#9C9AA5" strokeWidth="2"><circle cx="9" cy="9" r="6.5" /><path d="m14.5 14.5 5 5" strokeLinecap="round" /></svg>
          <span className="text-sm text-[#B9B7BF]">Search Location</span>
        </div>
        <FakeMap className="h-72 w-full" coverage />
      </div>

      <div className="flex grow flex-col px-4 pt-4 pb-6">
        <h2 className="text-center text-lg font-semibold text-black">Location Details</h2>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 p-3">
          <span className="text-sm text-black">Service coverage range</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setKm(Math.max(1, km - 1))} className="h-7 w-7 cursor-pointer rounded-md bg-gray-100 text-gray-500">–</button>
            <span className="min-w-14 rounded-md border border-[#8442FF] px-2 py-1 text-center text-sm text-[#8442FF]">{km} KM</span>
            <button type="button" onClick={() => setKm(km + 1)} className="h-7 w-7 cursor-pointer rounded-md bg-gray-100 text-gray-500">+</button>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1 text-sm text-[#8442FF]">
          Al Wattah Division, Ain Al Fayda
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.5" /></svg>
        </p>

        <div className="grow" />
        <button
          type="button"
          onClick={() => onApplyAll(km)}
          className="mb-3 h-12 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white text-[15px] font-medium text-[#8442FF] active:scale-[0.98]"
        >
          Apply range for all employees
        </button>
        <GradientButton onClick={() => { onSet(index, km); onNext() }}>
          {next ? `${next.name} Range →` : 'Continue →'}
        </GradientButton>
      </div>
    </div>
  )
}
