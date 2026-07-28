import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import { REJECT_REASONS } from '../data/providers.js'

// Shown when the customer rejects the inspector's proposed products (mockup 10).
// Optional: they can add details or skip entirely — feedback should never
// block the exit.
export default function RejectReasonScreen({ onSubmit, onBack }) {
  const [reason, setReason] = useState(REJECT_REASONS[0])
  const [note, setNote] = useState('')

  return (
    <GradientHeader title="Reason for rejection" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-3 pb-6">
      <div className="mt-2 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {REJECT_REASONS.map((r) => (
          <label key={r} className="flex cursor-pointer items-center justify-between py-3.5">
            <span className="text-[15px] font-medium text-black">{r}</span>
            <input
              type="radio"
              name="reason"
              checked={reason === r}
              onChange={() => setReason(r)}
              className="peer sr-only"
            />
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                reason === r ? 'bg-[#8442FF]' : 'bg-gray-200'
              }`}
            >
              {reason === r && (
                <svg width="16" height="12" viewBox="0 0 24 18" fill="none">
                  <path d="m2 9 7 7L22 2" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </label>
        ))}

        {reason === 'Something else' && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tell us what went wrong (optional)"
            rows={3}
            className="screen-enter mt-2 w-full resize-none rounded-xl bg-[#F3F2F5] p-3 text-base text-black outline-none placeholder:text-gray-400"
          />
        )}
      </div>

      <div className="grow" />
      <GradientButton
        className="mx-auto mt-6 max-w-56"
        onClick={() => onSubmit(reason, note.trim())}
      >
        Submit
      </GradientButton>
      <button
        type="button"
        onClick={() => onSubmit(null, '')}
        className="mx-auto mt-3 cursor-pointer py-2 text-sm text-gray-400 underline underline-offset-2"
      >
        Skip
      </button>
      </div>
    </GradientHeader>
  )
}
