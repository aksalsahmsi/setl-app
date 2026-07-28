import { useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import GradientButton from '../../components/GradientButton.jsx'
import { CATEGORY_TASKS } from '../../data/providers.js'

// SP onboarding final step: the company's public profile and pricing.
export default function SPProfileScreen({ profile, onDone, onBack }) {
  const [name, setName] = useState(profile?.name ?? '')
  const [pricePerHour, setPricePerHour] = useState(profile?.pricePerHour ?? '')
  const [pricing, setPricing] = useState(profile?.pricing ?? { normal: '', technical: '', hard: '' })
  const [customerService, setCustomerService] = useState(profile?.customerService ?? '')

  return (
    <GradientHeader title="Profile" onBack={onBack} sheetClassName="bg-white">
      <div className="flex grow flex-col px-4 pb-6">
        <div className="mx-auto mt-2 mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gray-100">
          <span className="relative">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9C7D1" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" strokeLinecap="round" /></svg>
            <span className="absolute -right-1 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#8442FF] text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h4L18 10l-4-4L4 16v4Z" strokeLinejoin="round" /></svg>
            </span>
          </span>
        </div>

        <label className="text-xs text-gray-400">Company Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Company name" className="mt-1 mb-4 w-full border-b border-gray-200 pb-2 text-sm text-black outline-none focus:border-[#8442FF]" />

        <label className="text-xs text-gray-400">Price per Hour</label>
        <input value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="AED / hr" className="mt-1 mb-4 w-full border-b border-gray-200 pb-2 text-sm text-black outline-none focus:border-[#8442FF]" />

        <label className="mb-2 block text-xs text-gray-400">Category Pricing</label>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {CATEGORY_TASKS.map((c) => (
            <div key={c.key} className="rounded-xl border border-gray-100 p-2 text-center">
              <span className="inline-block rounded-md px-2 py-1 text-[11px] font-medium text-white" style={{ background: c.color }}>{c.label}</span>
              <input
                value={pricing[c.key]}
                onChange={(e) => setPricing({ ...pricing, [c.key]: e.target.value.replace(/\D/g, '') })}
                inputMode="numeric"
                placeholder="AED"
                className="mt-2 w-full rounded-md border border-gray-200 py-1 text-center text-xs text-black outline-none focus:border-[#8442FF]"
              />
            </div>
          ))}
        </div>

        <label className="text-xs text-gray-400">Customer service (serial)</label>
        <input value={customerService} onChange={(e) => setCustomerService(e.target.value)} placeholder="Support number" className="mt-1 w-full border-b border-gray-200 pb-2 text-sm text-black outline-none focus:border-[#8442FF]" />

        <div className="grow" />
        <button type="button" onClick={() => onDone({ name, pricePerHour, pricing, customerService }, true)} className="mb-3 h-12 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white text-[15px] font-medium text-[#8442FF] active:scale-[0.98]">
          Assign later
        </button>
        <GradientButton onClick={() => onDone({ name, pricePerHour, pricing, customerService }, false)}>Done</GradientButton>
      </div>
    </GradientHeader>
  )
}
