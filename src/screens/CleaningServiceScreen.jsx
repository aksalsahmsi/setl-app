import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'

const MIN_HOURS = 1
const MAX_HOURS = 8

// Hours-needed picker for hourly services (Phase 2, category 1).
// Providers charge per hour; the total is rate x hours at checkout.
export default function CleaningServiceScreen({ hours, setHours, onSearchProviders, onBack }) {
  return (
    <GradientHeader title="House cleaning" onBack={onBack}>
      <div className="flex grow flex-col px-4 pt-5 pb-6">
        <h2 className="text-2xl font-semibold text-black">How many hours do you need?</h2>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[15px] text-black">Hours of cleaning</p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="decrease"
              onClick={() => setHours(Math.max(MIN_HOURS, hours - 1))}
              className="h-10 w-10 cursor-pointer rounded-md bg-gray-100 text-lg text-gray-500 transition-transform duration-100 active:scale-95"
            >
              –
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-[#8442FF] text-[15px] text-black">
              {hours}
            </span>
            <button
              type="button"
              aria-label="increase"
              onClick={() => setHours(Math.min(MAX_HOURS, hours + 1))}
              className="h-10 w-10 cursor-pointer rounded-md bg-gray-100 text-lg text-gray-500 transition-transform duration-100 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Most 1-bedroom homes take 2–3 hours; villas usually need 4+. You pay the provider&apos;s
          hourly rate × hours, after the work is done.
        </p>

        <div className="grow" />

        <GradientButton onClick={onSearchProviders}>Search for providers</GradientButton>
      </div>
    </GradientHeader>
  )
}
