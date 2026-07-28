import { useState } from 'react'
import GradientHeader from '../../components/GradientHeader.jsx'
import GradientButton from '../../components/GradientButton.jsx'

// SP onboarding final step: the company's public profile. Per-job pricing is
// set on the Services screen (seeded from trade defaults), not here.
export default function SPProfileScreen({ profile, onDone, onBack }) {
  const [name, setName] = useState(profile?.name ?? '')
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

        <label className="text-xs text-gray-400">Customer service (support number)</label>
        <input value={customerService} onChange={(e) => setCustomerService(e.target.value)} placeholder="Support number" className="mt-1 w-full border-b border-gray-200 pb-2 text-sm text-black outline-none focus:border-[#8442FF]" />

        <p className="mt-4 rounded-xl bg-[#EDE4FD] p-3 text-xs text-[#8442FF]">
          Your job prices are set up from the standard list for your trade — adjust them any time on the Services screen.
        </p>

        <div className="grow" />
        <GradientButton onClick={() => onDone({ name, customerService })}>Done</GradientButton>
      </div>
    </GradientHeader>
  )
}
