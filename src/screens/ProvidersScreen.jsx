import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import ProviderCard from '../components/ProviderCard.jsx'
import Stepper from '../components/Stepper.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'
import { PROVIDERS, PLUMBER_PROVIDERS, PREVIOUS_PROVIDERS } from '../data/providers.js'

// Provider lists for both services:
//  - AC "booking":     title "Providers", search bar, price = booking fee   (screen 11)
//  - AC "inspection":  title "Inspection options", stepper                  (screen 5)
//  - plumber:          notice + stepper + per-hour rates + previous providers (plumber 5)
export default function ProvidersScreen({ service = 'ac', variant, onConfirm, onBack }) {
  const isPlumber = service === 'plumber'
  const isInspection = variant === 'inspection'
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null) // provider whose date/time sheet is open

  const all = isPlumber ? PLUMBER_PROVIDERS : PROVIDERS
  const providers = all.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))

  const title = isPlumber ? 'Plumber' : isInspection ? 'Inspection options' : 'Providers'

  return (
    <div className="relative">
      <GradientHeader title={title} onBack={onBack} sheetClassName="bg-[#F5F4F7]">
        {isPlumber && (
          <p className="mx-4 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white">
              !
            </span>
            Please note: a prior inspection of your issue is necessary before proceeding, ensuring a
            seamless and efficient experience with our services.
          </p>
        )}

        {isInspection || isPlumber ? (
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

        {(isInspection || isPlumber) && (
          <h2 className="px-4 pt-4 text-lg font-semibold text-black">Providers</h2>
        )}

        <div className="flex flex-col gap-3 px-3 pt-4 pb-4">
          {providers.map((p, i) => (
            <ProviderCard
              key={`${p.id}-${i}`}
              provider={p}
              price={isInspection || isPlumber ? p.inspectionFee : p.bookingFee}
              priceSuffix={p.perHour ? ' AED/Hr' : ' AED'}
              buttonLabel={isPlumber ? 'Book' : isInspection ? 'Book inspection' : 'Book'}
              onBook={() => setSelected(p)}
            />
          ))}
        </div>

        {isPlumber && (
          <>
            <h2 className="px-4 pt-2 text-lg font-semibold text-black">Previous Providers</h2>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 pt-3 pb-8">
              {PREVIOUS_PROVIDERS.map((p) => (
                <div
                  key={p.id}
                  className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ background: p.color }}
                  >
                    {p.name[0].toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </GradientHeader>

      {selected && (
        <DateTimeSheet
          provider={selected}
          title={
            isPlumber
              ? 'Inspection time & date'
              : isInspection
                ? 'Inspection time & date'
                : 'AC Refilling & Cleaning'
          }
          onClose={() => setSelected(null)}
          onConfirm={({ date, time }) => onConfirm(selected, date, time)}
        />
      )}
    </div>
  )
}
