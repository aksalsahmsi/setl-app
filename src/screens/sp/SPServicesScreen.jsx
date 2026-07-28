const GRADS = {
  'Network Technician': 'linear-gradient(135deg,#C9A54B,#7A5E1E)',
  'Smart Home Installation': 'linear-gradient(135deg,#8AA8C8,#4A6785)',
  Plumber: 'linear-gradient(135deg,#4A7FB5,#1E3D5C)',
  'Car Cleaning': 'linear-gradient(135deg,#4B5A68,#1D242B)',
  'Pest Control': 'linear-gradient(135deg,#B5533C,#6E2A1B)',
  Electrician: 'linear-gradient(135deg,#B58A3C,#5C4415)',
}

// The services the company offers, plus its category pricing at a glance.
export default function SPServicesScreen({ company, onBack }) {
  const services = company.services ?? []
  const pricing = company.profile?.pricing ?? {}
  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-24">
      <div className="relative bg-linear-[90deg,#C05CF7,#8442FF] px-4 pt-5 pb-5">
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Go back" className="absolute top-4 left-2 cursor-pointer p-2 text-white">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </button>
        )}
        <h1 className="text-center text-lg font-semibold text-white">Services</h1>
      </div>

      <div className="px-4 pt-5">
        <div className="grid grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s} className="relative h-28 overflow-hidden rounded-xl" style={{ background: GRADS[s] ?? 'linear-gradient(135deg,#8442FF,#C05CF7)' }}>
              <span className="absolute inset-x-0 bottom-0 bg-black/40 px-3 py-1.5 text-sm text-white">{s}</span>
            </div>
          ))}
        </div>

        <h2 className="mt-6 mb-2 text-lg font-semibold text-black">Pricing</h2>
        <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between border-b border-gray-50 py-2 text-sm"><span className="text-gray-500">Price per hour</span><span className="font-medium text-black">{company.profile?.pricePerHour || '—'} AED</span></div>
          <div className="flex justify-between border-b border-gray-50 py-2 text-sm"><span className="text-gray-500">Normal task</span><span className="font-medium text-black">{pricing.normal || '—'} AED</span></div>
          <div className="flex justify-between border-b border-gray-50 py-2 text-sm"><span className="text-gray-500">Technical fix</span><span className="font-medium text-black">{pricing.technical || '—'} AED</span></div>
          <div className="flex justify-between py-2 text-sm"><span className="text-gray-500">Hard task</span><span className="font-medium text-black">{pricing.hard || '—'} AED</span></div>
        </div>
      </div>
    </div>
  )
}
