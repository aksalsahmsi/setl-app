import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import { SERVICES } from '../data/providers.js'

// Generic "pick the jobs you need" screen for every catalog service that
// defines `options` in SERVICES (technician, electrician, network, curtains,
// outdoor furniture, car wash). The two-option pattern from the FigJam
// board: know what you need -> pick it here; not sure -> book an inspection.
export default function ServiceOptionsScreen({ serviceKey, onSearchProviders, onBookInspection, onBack }) {
  const service = SERVICES[serviceKey]
  const [picked, setPicked] = useState(() => new Set())

  function toggle(label) {
    const next = new Set(picked)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    setPicked(next)
  }

  const selected = service.options.filter((o) => picked.has(o.label))
  const total = selected.reduce((sum, o) => sum + o.price, 0)

  return (
    <GradientHeader title={service.label} onBack={onBack}>
      <div className="flex grow flex-col px-4 pt-5 pb-6">
        <h2 className="text-2xl font-semibold text-black">What do you need done?</h2>

        <div className="mt-4 flex flex-col gap-2.5">
          {service.options.map((o) => (
            <label
              key={o.label}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 text-[15px] text-black has-[:checked]:border-[#8442FF]"
            >
              <input
                type="checkbox"
                checked={picked.has(o.label)}
                onChange={() => toggle(o.label)}
                className="h-5 w-5 accent-[#8442FF]"
              />
              <span className="grow">{o.label}</span>
              <span className="shrink-0 text-sm font-semibold">{o.price} AED</span>
            </label>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-400">
          The provider&apos;s call-out fee is added at checkout. AED 0 due now — pay when the work
          is done.
        </p>

        <div className="grow" />

        {selected.length === 0 && (
          <p className="mb-2 text-center text-xs text-gray-400">
            Select at least one job to search for providers
          </p>
        )}
        <GradientButton
          disabled={selected.length === 0}
          onClick={() => onSearchProviders(selected)}
        >
          Search for providers{total > 0 ? ` — ${total} AED` : ''}
        </GradientButton>

        {service.inspectionLabel && (
          <button
            type="button"
            onClick={onBookInspection}
            className="mt-4 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white py-3 text-center"
          >
            <span className="block text-sm text-[#2790C3]">Not sure what&apos;s wrong?</span>
            <span className="block text-lg font-medium text-[#8442FF]">Send a pro a photo</span>
            <span className="block text-xs text-gray-400">
              Get a ballpark — no visit needed to start
            </span>
          </button>
        )}
      </div>
    </GradientHeader>
  )
}
