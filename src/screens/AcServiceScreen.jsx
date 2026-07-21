import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'

const MAX_UNITS = 10

function Counter({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="decrease"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-10 w-10 cursor-pointer rounded-md bg-gray-100 text-lg text-gray-500 transition-transform duration-100 active:scale-95"
      >
        –
      </button>
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-[#8442FF] text-[15px] text-black">
        {value}
      </span>
      <button
        type="button"
        aria-label="increase"
        onClick={() => onChange(Math.min(MAX_UNITS, value + 1))}
        className="h-10 w-10 cursor-pointer rounded-md bg-gray-100 text-lg text-gray-500 transition-transform duration-100 active:scale-95"
      >
        +
      </button>
    </div>
  )
}

export default function AcServiceScreen({ counts, setCounts, onSearchProviders, onBookInspection, onBack }) {
  const nothingSelected = counts.refill + counts.clean === 0
  return (
    <GradientHeader title="AC cleaning & Refilling" onBack={onBack}>
      <div className="flex grow flex-col px-4 pt-5 pb-6">
        <h2 className="text-2xl font-semibold text-black">AC Services</h2>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[15px] text-black">How many AC&apos;s need refilling</p>
          <Counter value={counts.refill} onChange={(v) => setCounts({ ...counts, refill: v })} />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[15px] text-black">How many AC&apos;s need cleaning</p>
          <Counter value={counts.clean} onChange={(v) => setCounts({ ...counts, clean: v })} />
        </div>

        <div className="grow" />

        {nothingSelected && (
          <p className="mb-2 text-center text-xs text-gray-400">
            Select at least one AC service to search for providers
          </p>
        )}
        <GradientButton onClick={onSearchProviders} disabled={nothingSelected}>
          Search for providers
        </GradientButton>

        <button
          type="button"
          onClick={onBookInspection}
          className="mt-4 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white py-3 text-center"
        >
          <span className="block text-sm text-[#2790C3]">Not sure what&apos;s wrong?</span>
          <span className="block text-lg font-medium text-[#8442FF]">Book an inspection</span>
          <span className="block text-xs text-gray-400">Fee credited toward your repair if you proceed</span>
        </button>
      </div>
    </GradientHeader>
  )
}
