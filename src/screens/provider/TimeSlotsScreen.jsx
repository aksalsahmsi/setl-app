import { useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import GradientButton from '../../components/GradientButton.jsx'
import { WEEK_DAYS } from '../../data/providers.js'

const HOURS = ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM']

// Provider onboarding step 3: weekly working hours (provider mockup 5).
export default function TimeSlotsScreen({ onConfirm, onBack }) {
  const [slots, setSlots] = useState(
    Object.fromEntries(WEEK_DAYS.map((d) => [d, { from: '9 AM', to: '6 PM' }])),
  )

  function update(day, field, value) {
    setSlots({ ...slots, [day]: { ...slots[day], [field]: value } })
  }

  return (
    <GradientHeader title="Time slots" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="flex grow flex-col gap-3 px-3 pb-8">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="font-semibold text-black">{day}</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <span>From:</span>
              <select
                value={slots[day].from}
                onChange={(e) => update(day, 'from', e.target.value)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-black outline-none"
              >
                {HOURS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
              <span className="ml-3">To:</span>
              <select
                value={slots[day].to}
                onChange={(e) => update(day, 'to', e.target.value)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-black outline-none"
              >
                {HOURS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <GradientButton className="mx-auto mt-3 max-w-80" onClick={() => onConfirm(slots)}>
          Confirm
        </GradientButton>
      </div>
    </GradientHeader>
  )
}
