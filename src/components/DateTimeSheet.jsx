import { useState } from 'react'
import GradientButton from './GradientButton.jsx'
import { DATES, TIMES } from '../data/providers.js'

// Bottom sheet for picking a date + time (used for inspections and bookings).
export default function DateTimeSheet({ provider, title, onConfirm, onClose }) {
  const [date, setDate] = useState(DATES[0])
  const [time, setTime] = useState(TIMES[0])

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      {/* dimmed backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative rounded-t-[24px] bg-[#F5F4F7] px-4 pt-3 pb-8">
        <div className="mx-auto mb-3 h-1 w-16 rounded-full bg-gray-300" />

        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: provider.color }}
          >
            {provider.name[0].toUpperCase()}
          </div>
          <h2 className="text-lg font-medium text-black">{title}</h2>
        </div>

        <p className="mt-4 text-sm font-semibold tracking-wide text-[#8442FF]">DATE</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {DATES.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setDate(d)}
              className={`shrink-0 cursor-pointer rounded-lg px-5 py-2 text-center shadow-sm ${
                date.day === d.day ? 'bg-[#8442FF] text-white' : 'bg-white text-black'
              }`}
            >
              <span className="block text-[15px]">{d.day}</span>
              <span className="block text-[15px]">{d.num}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm font-semibold tracking-wide text-[#8442FF]">TIME</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {TIMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTime(t)}
              className={`shrink-0 cursor-pointer rounded-lg px-4 py-1.5 text-[15px] shadow-sm ${
                time === t ? 'bg-[#8442FF] text-white' : 'bg-white text-black'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <GradientButton
          className="mx-auto mt-6 !h-11 !w-44 rounded-lg text-base"
          onClick={() => onConfirm({ date, time })}
        >
          Confirm
        </GradientButton>
      </div>
    </div>
  )
}
