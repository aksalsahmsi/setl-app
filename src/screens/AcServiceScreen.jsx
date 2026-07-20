import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'

function Counter({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="decrease"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-6 w-6 cursor-pointer rounded bg-gray-100 text-gray-500"
      >
        –
      </button>
      <span className="flex h-6 w-8 items-center justify-center rounded border border-[#8442FF] text-sm text-black">
        {value}
      </span>
      <button
        type="button"
        aria-label="increase"
        onClick={() => onChange(value + 1)}
        className="h-6 w-6 cursor-pointer rounded bg-gray-100 text-gray-500"
      >
        +
      </button>
    </div>
  )
}

export default function AcServiceScreen({ counts, setCounts, onSearchProviders, onBookInspection, onBack }) {
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

        <GradientButton onClick={onSearchProviders}>Search for providers</GradientButton>

        <button
          type="button"
          onClick={onBookInspection}
          className="mt-4 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white py-3 text-center"
        >
          <span className="block text-sm text-[#2790C3]">You are not sure ?</span>
          <span className="block text-lg font-medium text-[#8442FF]">Book Inspection Now !</span>
        </button>
      </div>
    </GradientHeader>
  )
}
