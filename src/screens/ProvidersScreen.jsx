import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import ProviderCard from '../components/ProviderCard.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'
import { SERVICES } from '../data/providers.js'

// One provider list for every service and both variants, driven by the
// SERVICES config:
//  - booking:    search bar, booking fees                        (AC screen 11)
//  - inspection: stepper, inspection fees                        (AC screen 5)
//    + "inspection first" notice and previous providers if the
//      service config has them                                   (plumber screen 5)
export default function ProvidersScreen({ service: serviceId, variant, onConfirm, onBack }) {
  const service = SERVICES[serviceId]
  const isInspection = variant === 'inspection'
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null) // provider whose date/time sheet is open

  const providers = service.providers.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  )
  const title = service.listTitle[variant] ?? service.label

  return (
    <div className="relative">
      <GradientHeader title={title} onBack={onBack} sheetClassName="bg-[#F5F4F7]">
        {isInspection && service.requiresInspection && (
          <p className="mx-4 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white">
              !
            </span>
            An inspection visit comes first so you get a clear, itemized quote. The inspection fee
            is credited toward your repair if you proceed.
          </p>
        )}

        {isInspection ? (
          <div className="pt-4">
            <ProgressSteps current="inspection" />
          </div>
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
              placeholder={service.providers[0]?.name}
              className="w-full bg-transparent text-base text-black outline-none placeholder:text-[#C2C0C9]"
            />
          </div>
        )}

        {isInspection && <h2 className="px-4 pt-4 text-lg font-semibold text-black">Providers</h2>}

        <div className="flex flex-col gap-3 px-3 pt-4 pb-4">
          {providers.map((p, i) => (
            <ProviderCard
              key={`${p.id}-${i}`}
              provider={p}
              price={isInspection ? p.inspectionFee : p.bookingFee}
              priceSuffix={p.perHour ? ' AED/Hr' : ' AED'}
              buttonLabel={isInspection && !service.requiresInspection ? 'Book inspection' : 'Book'}
              onBook={() => setSelected(p)}
            />
          ))}
        </div>

        {service.previousProviders && (
          <>
            <h2 className="px-4 pt-2 text-lg font-semibold text-black">Previous Providers</h2>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 pt-3 pb-8">
              {service.previousProviders.map((p) => (
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
          title={isInspection ? 'Inspection time & date' : service.bookingSheetTitle}
          onClose={() => setSelected(null)}
          onConfirm={({ date, time }) => onConfirm(selected, date, time)}
        />
      )}
    </div>
  )
}
