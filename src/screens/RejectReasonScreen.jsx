import { useState } from 'react'
import GradientButton from '../components/GradientButton.jsx'
import { REJECT_REASONS } from '../data/providers.js'

// Shown when the customer rejects the inspector's proposed products (mockup 10).
export default function RejectReasonScreen({ onSubmit, onBack }) {
  const [reason, setReason] = useState(REJECT_REASONS[0])

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F5F4F7] px-3 pt-5 pb-6">
      <h1 className="text-center text-2xl font-semibold text-black">Reason for rejection</h1>
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="mt-1 w-fit cursor-pointer p-2 text-gray-400"
      >
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="mt-2 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {REJECT_REASONS.map((r) => (
          <label key={r} className="flex cursor-pointer items-center justify-between py-4">
            <span className="text-[15px] font-medium text-black">{r}</span>
            <input
              type="radio"
              name="reason"
              checked={reason === r}
              onChange={() => setReason(r)}
              className="peer sr-only"
            />
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                reason === r ? 'bg-[#8442FF]' : 'bg-gray-200'
              }`}
            >
              {reason === r && (
                <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
                  <path d="m2 9 7 7L22 2" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </label>
        ))}
      </div>

      <div className="grow" />
      <GradientButton className="mx-auto mt-6 max-w-56" onClick={() => onSubmit(reason)}>
        Submit
      </GradientButton>
    </div>
  )
}
