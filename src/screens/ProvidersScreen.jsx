import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import ProviderCard from '../components/ProviderCard.jsx'
import Stepper from '../components/Stepper.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'
import { PROVIDERS } from '../data/providers.js'

// Two variants of the same list:
//  - "booking":    title "Providers", search bar, price = booking fee   (screen 11)
//  - "inspection": title "Inspection options", stepper, price = inspection fee (screen 5)
export default function ProvidersScreen({ variant, onConfirm, onBack }) {
  const isInspection = variant === 'inspection'
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null) // provider whose date/time sheet is open

  const providers = PROVIDERS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="relative">
      <GradientHeader
        title={isInspection ? 'Inspection options' : 'Providers'}
        onBack={onBack}
        sheetClassName="bg-[#F5F4F7]"
      >
        {isInspection ? (
          <Stepper />
        ) : (
          <div className="mx-4 mt-4 flex h-12 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="#9C9AA5" strokeWidth="2">
              <circle cx="9" cy="9" r="6.5" />
              <path d="m14.5 14.5 5 5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Breezcool"
              className="w-full bg-transparent text-[15px] text-black outline-none placeholder:text-[#C2C0C9]"
            />
          </div>
        )}

        {isInspection && <h2 className="px-4 pt-4 text-lg font-semibold text-black">Providers</h2>}

        <div className="flex flex-col gap-3 px-3 pt-4 pb-8">
          {providers.map((p, i) => (
            <ProviderCard
              key={`${p.id}-${i}`}
              provider={p}
              price={isInspection ? p.inspectionFee : p.bookingFee}
              buttonLabel={isInspection ? 'Book inspection' : 'Book'}
              onBook={() => setSelected(p)}
            />
          ))}
        </div>
      </GradientHeader>

      {selected && (
        <DateTimeSheet
          provider={selected}
          title={isInspection ? 'Inspection time & date' : 'AC Refilling & Cleaning'}
          onClose={() => setSelected(null)}
          onConfirm={({ date, time }) => onConfirm(selected, date, time)}
        />
      )}
    </div>
  )
}
