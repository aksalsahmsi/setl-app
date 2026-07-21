import { useState } from 'react'
import GradientButton from '../../components/GradientButton.jsx'
import FakeMap from '../../components/FakeMap.jsx'

// Provider onboarding step 2: how far you're willing to travel (provider mockup 4).
export default function CoverageScreen({ onConfirm, onBack }) {
  const [range, setRange] = useState(15)

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-white">
      <div className="relative shrink-0 bg-linear-[90deg,#C05CF7,#8442FF] pt-4 pb-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="absolute top-3 left-2 cursor-pointer p-2 text-white"
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="text-center text-lg font-semibold text-white">Range of availability</h1>
      </div>

      <div className="relative">
        <FakeMap className="h-[330px] w-full" coverage />
        <div className="absolute inset-x-4 top-3 flex h-11 items-center gap-3 rounded-xl bg-white px-4 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
          <svg width="16" height="16" viewBox="0 0 22 22" fill="none" stroke="#9C9AA5" strokeWidth="2">
            <circle cx="9" cy="9" r="6.5" />
            <path d="m14.5 14.5 5 5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search Location"
            className="w-full bg-transparent text-base text-black outline-none placeholder:text-[#B9B7BF]"
          />
        </div>
      </div>

      <div className="flex grow flex-col px-4 pt-4 pb-6">
        <h2 className="text-center text-lg font-semibold text-black">Location Details</h2>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
          <span className="text-[15px] text-black">Service coverage range</span>
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="decrease range"
              onClick={() => setRange((r) => Math.max(5, r - 5))}
              className="h-9 w-9 cursor-pointer rounded-md bg-gray-100 text-gray-500"
            >
              –
            </button>
            <span className="flex h-9 w-16 items-center justify-center rounded-md border border-[#8442FF] text-sm text-[#8442FF]">
              {range} KM
            </span>
            <button
              type="button"
              aria-label="increase range"
              onClick={() => setRange((r) => Math.min(100, r + 5))}
              className="h-9 w-9 cursor-pointer rounded-md bg-gray-100 text-gray-500"
            >
              +
            </button>
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F3EDFE] px-4 py-3.5">
          <span className="text-[15px] text-[#8442FF]">Al Wattah Division, Ain Al Fayda</span>
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none" stroke="#8442FF" strokeWidth="1.8">
            <path d="M9 1a7 7 0 0 1 7 7c0 5-7 12.5-7 12.5S2 13 2 8a7 7 0 0 1 7-7Z" />
            <circle cx="9" cy="8" r="2.5" />
          </svg>
        </div>

        <div className="grow" />
        <GradientButton className="mx-auto max-w-80" onClick={() => onConfirm(range)}>
          Confirm
        </GradientButton>
      </div>
    </div>
  )
}
