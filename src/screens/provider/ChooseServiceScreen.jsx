import { useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import GradientButton from '../../components/GradientButton.jsx'
import { PROVIDER_SERVICES } from '../../data/providers.js'

const TILE_GRADIENTS = [
  'linear-gradient(135deg,#C9A54B,#7A5E1E)',
  'linear-gradient(135deg,#8AA8C8,#4A6785)',
  'linear-gradient(135deg,#4A7FB5,#1E3D5C)',
  'linear-gradient(135deg,#4B5A68,#1D242B)',
  'linear-gradient(135deg,#B5533C,#6E2A1B)',
  'linear-gradient(135deg,#B58A3C,#5C4415)',
]

// Provider onboarding step 1: pick the services you offer (provider mockup 3).
export default function ChooseServiceScreen({ onConfirm, onBack }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(new Set())

  const services = PROVIDER_SERVICES.filter((s) => s.toLowerCase().includes(query.toLowerCase()))

  function toggle(name) {
    const next = new Set(selected)
    if (next.has(name)) next.delete(name)
    else next.add(name)
    setSelected(next)
  }

  return (
    <GradientHeader title="Choose Service" onBack={onBack}>
      <div className="flex grow flex-col px-4 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 grow items-center gap-3 rounded-xl bg-[#F3F2F5] px-4">
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none" stroke="#9C9AA5" strokeWidth="2">
              <circle cx="9" cy="9" r="6.5" />
              <path d="m14.5 14.5 5 5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Service"
              className="w-full bg-transparent text-base text-black outline-none placeholder:text-[#B9B7BF]"
            />
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8442FF]">
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="#8442FF" strokeWidth="1.8" strokeLinecap="round">
              <path d="M1 2h16M4 7h10M7 12h4" />
            </svg>
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          {services.map((name) => {
            const active = selected.has(name)
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggle(name)}
                className={`relative h-36 cursor-pointer overflow-hidden rounded-xl text-left transition-transform duration-100 active:scale-[0.98] ${
                  active ? 'ring-3 ring-[#8442FF]' : ''
                }`}
                style={{ background: TILE_GRADIENTS[PROVIDER_SERVICES.indexOf(name) % TILE_GRADIENTS.length] }}
              >
                {active && (
                  <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#8442FF]">
                    <svg width="12" height="9" viewBox="0 0 24 18" fill="none">
                      <path d="m2 9 7 7L22 2" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-black/40 px-3 py-1.5 text-sm text-white">
                  {name}
                </span>
              </button>
            )
          })}
        </div>

        <div className="grow" />
        <GradientButton
          className="mt-6"
          disabled={selected.size === 0}
          onClick={() => onConfirm([...selected])}
        >
          Confirm {selected.size > 0 && `(${selected.size})`}
        </GradientButton>
      </div>
    </GradientHeader>
  )
}
