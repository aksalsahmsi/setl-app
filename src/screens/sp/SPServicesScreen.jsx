import { useEffect, useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import { defaultTasksFor } from '../../data/providers.js'

const GRADS = {
  'Network Technician': 'linear-gradient(135deg,#C9A54B,#7A5E1E)',
  'Smart Home Installation': 'linear-gradient(135deg,#8AA8C8,#4A6785)',
  Plumber: 'linear-gradient(135deg,#4A7FB5,#1E3D5C)',
  'Car Cleaning': 'linear-gradient(135deg,#4B5A68,#1D242B)',
  'Pest Control': 'linear-gradient(135deg,#B5533C,#6E2A1B)',
  Electrician: 'linear-gradient(135deg,#B58A3C,#5C4415)',
}

// The services the company offers and the price of each real job it does.
// Pricing is per trade (the actual jobs), not abstract difficulty tiers: the
// SP tweaks the seeded defaults, adds/removes jobs, and it saves as they go.
export default function SPServicesScreen({ company, onUpdatePricing, onBack }) {
  const services = company.services ?? []
  const pricing = company.servicePricing ?? {}
  const [adding, setAdding] = useState({}) // { [service]: { label, price } }

  // Seed any offered service that doesn't have a price list yet (e.g. a
  // company saved before per-service pricing existed).
  useEffect(() => {
    services.forEach((s) => {
      if (!pricing[s]) onUpdatePricing(s, defaultTasksFor(s))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setPrice(service, i, value) {
    const tasks = (pricing[service] ?? defaultTasksFor(service)).map((t, j) =>
      j === i ? { ...t, price: value.replace(/\D/g, '') } : t,
    )
    onUpdatePricing(service, tasks)
  }

  function removeTask(service, i) {
    onUpdatePricing(service, (pricing[service] ?? []).filter((_, j) => j !== i))
  }

  function addTask(service) {
    const draft = adding[service]
    if (!draft?.label?.trim() || !draft?.price) return
    onUpdatePricing(service, [
      ...(pricing[service] ?? []),
      { label: draft.label.trim(), price: draft.price },
    ])
    setAdding((a) => ({ ...a, [service]: { label: '', price: '' } }))
  }

  return (
    <GradientHeader title="Services & pricing" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-4 pb-24">
        {services.length === 0 && (
          <p className="mt-2 rounded-2xl bg-white p-5 text-center text-sm text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            No services yet.
          </p>
        )}

        {services.map((service) => {
          const tasks = pricing[service] ?? defaultTasksFor(service)
          const draft = adding[service] ?? { label: '', price: '' }
          return (
            <section key={service} className="mt-3">
              <div className="relative h-24 overflow-hidden rounded-2xl" style={{ background: GRADS[service] ?? 'linear-gradient(135deg,#8442FF,#C05CF7)' }}>
                <span className="absolute inset-x-0 bottom-0 bg-black/40 px-3 py-2 text-sm font-medium text-white">{service}</span>
              </div>

              <p className="mt-3 mb-1.5 px-1 text-xs font-semibold text-gray-500">Job prices</p>
              <div className="rounded-2xl bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                {tasks.map((t, i) => (
                  <div key={`${t.label}-${i}`} className="flex items-center gap-2 border-b border-gray-50 px-2 py-2 last:border-0">
                    <span className="grow text-sm text-black">{t.label}</span>
                    <div className="flex items-center gap-1 rounded-lg bg-[#F5F4F7] px-2 py-1">
                      <input
                        value={t.price}
                        onChange={(e) => setPrice(service, i, e.target.value)}
                        inputMode="numeric"
                        aria-label={`Price for ${t.label}`}
                        className="w-14 bg-transparent text-right text-sm font-semibold text-black outline-none"
                      />
                      <span className="text-xs text-gray-400">AED</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTask(service, i)}
                      aria-label={`Remove ${t.label}`}
                      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                    </button>
                  </div>
                ))}

                {/* Add a custom job */}
                <div className="mt-1 flex items-center gap-2 rounded-xl bg-[#F5F4F7] px-2 py-2">
                  <input
                    value={draft.label}
                    onChange={(e) => setAdding((a) => ({ ...a, [service]: { ...draft, label: e.target.value } }))}
                    placeholder="Add a job"
                    className="grow bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
                  />
                  <input
                    value={draft.price}
                    onChange={(e) => setAdding((a) => ({ ...a, [service]: { ...draft, price: e.target.value.replace(/\D/g, '') } }))}
                    inputMode="numeric"
                    placeholder="AED"
                    className="w-14 bg-transparent text-right text-sm text-black outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => addTask(service)}
                    disabled={!draft.label?.trim() || !draft.price}
                    aria-label="Add job"
                    className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#8442FF] text-white active:opacity-90 disabled:opacity-40"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </GradientHeader>
  )
}
