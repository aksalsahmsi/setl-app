import { CUSTOMER_ME } from '../../data/providers.js'
import FakeMap from '../../components/FakeMap.jsx'
import GradientButton from '../../components/GradientButton.jsx'

// Provider is on the way: a route to the customer and an "Arrived" button
// that moves the job into the on-site (in progress) state.
export default function ProviderNavigateScreen({ order, onArrived, onBack }) {
  if (!order) return null
  return (
    <div className="font-poppins flex min-h-screen flex-col bg-white">
      <div className="relative shrink-0 bg-linear-[90deg,#C05CF7,#8442FF] pt-4 pb-10">
        <button type="button" onClick={onBack} aria-label="Go back" className="absolute top-3 left-2 cursor-pointer p-2 text-white">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="text-center text-lg font-semibold text-white">Location</h1>
      </div>

      <div className="-mt-6 flex grow flex-col rounded-t-[30px] bg-white px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl">
          <FakeMap className="h-72 w-full" />
          <div className="absolute top-3 left-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-black shadow">
            Maps <span className="ml-1 text-gray-400">Satellite</span>
          </div>
          <div className="absolute top-24 left-6 rounded-lg bg-[#2563EB] px-2.5 py-1.5 text-xs font-semibold text-white shadow">
            🏍 23 min · 15 KM
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F1ECFB] px-4 py-3">
          <span className="text-sm font-medium text-[#8442FF]">15 KM</span>
          <span className="text-sm font-medium text-[#8442FF]">≈ 23 min</span>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-sm font-semibold text-black">{CUSTOMER_ME.name}</p>
          <p className="mt-0.5 text-xs text-gray-400">{CUSTOMER_ME.address}</p>
        </div>

        <div className="grow" />
        <GradientButton className="mb-6" onClick={() => onArrived(order)}>
          Arrived
        </GradientButton>
      </div>
    </div>
  )
}
