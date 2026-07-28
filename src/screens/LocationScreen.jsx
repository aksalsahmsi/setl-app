import { useState } from 'react'
import GradientButton from '../components/GradientButton.jsx'
import FakeMap from '../components/FakeMap.jsx'

const PLACE_TYPES = ['Indoor', 'Outdoor', 'Villa']

// Pick your location after logging in (plumber mockup 3).
export default function LocationScreen({ onConfirm }) {
  const [type, setType] = useState('Indoor')
  const [nameNumber, setNameNumber] = useState('')

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-white">
      <div className="relative">
        <FakeMap className="h-[300px] w-full" />
        <div className="absolute inset-x-4 top-4 flex h-12 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="#9C9AA5" strokeWidth="2">
            <circle cx="9" cy="9" r="6.5" />
            <path d="m14.5 14.5 5 5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search Location"
            className="w-full bg-transparent text-base text-black outline-none placeholder:text-[#B9B7BF]"
          />
        </div>
        <div className="absolute top-20 left-4 flex overflow-hidden rounded-lg bg-white text-sm shadow">
          <span className="px-3 py-1.5 font-semibold text-black">Maps</span>
          <span className="px-3 py-1.5 text-gray-400">Satellite</span>
        </div>
      </div>

      <div className="flex grow flex-col px-4 pt-5 pb-6">
        <h1 className="text-center text-xl font-semibold text-black">Location Details</h1>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F3EDFE] px-4 py-3.5">
          <span className="text-[15px] text-black">Abu Dhabi</span>
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none" stroke="#8442FF" strokeWidth="1.8">
            <path d="M9 1a7 7 0 0 1 7 7c0 5-7 12.5-7 12.5S2 13 2 8a7 7 0 0 1 7-7Z" />
            <circle cx="9" cy="8" r="2.5" />
          </svg>
        </div>

        <div className="mt-4 flex gap-3">
          {PLACE_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`cursor-pointer rounded-lg border px-5 py-2 text-[15px] shadow-sm transition-colors ${
                type === t ? 'border-[#8442FF] bg-white text-[#8442FF]' : 'border-transparent bg-white text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={nameNumber}
          onChange={(e) => setNameNumber(e.target.value)}
          placeholder="Building name or number"
          className="mt-4 rounded-xl bg-[#F3F2F5] px-4 py-3.5 text-base text-black outline-none placeholder:text-[#B9B7BF]"
        />

        <div className="grow" />
        <GradientButton className="mx-auto max-w-72" onClick={() => onConfirm({ type, nameNumber })}>
          Confirm
        </GradientButton>
      </div>
    </div>
  )
}
