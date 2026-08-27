import { PROVIDER_ME } from '../../data/providers.js'

const BREAKDOWN = [
  { stars: 5, pct: 82 },
  { stars: 4, pct: 12 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
]

const REVIEWS = [
  { name: 'Ahmed A.', stars: 5, text: 'On time, fixed the leak fast and explained the estimate clearly.' },
  { name: 'Layla M.', stars: 5, text: 'Very professional. The price matched exactly what was quoted.' },
  { name: 'Omar K.', stars: 4, text: 'Good work overall, arrived a little late but kept me updated.' },
]

function Stars({ n }) {
  return (
    <span className="text-[#F5A623]">
      {'★★★★★'.slice(0, n)}
      <span className="text-gray-200">{'★★★★★'.slice(n)}</span>
    </span>
  )
}

export default function ProviderRatingsScreen() {
  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-24">
      <div className="brand-header rounded-b-[30px] px-4 pt-8 pb-6 text-white">
        <h1 className="text-center text-lg font-semibold">Ratings</h1>
      </div>

      <div className="-mt-3 mx-3 rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className="text-4xl font-bold text-black">{PROVIDER_ME.rating}</p>
            <Stars n={Math.round(PROVIDER_ME.rating)} />
            <p className="mt-1 text-xs text-gray-400">{PROVIDER_ME.jobsDone} jobs</p>
          </div>
          <div className="grow">
            {BREAKDOWN.map((b) => (
              <div key={b.stars} className="flex items-center gap-2 py-0.5">
                <span className="w-3 text-xs text-gray-400">{b.stars}</span>
                <div className="h-2 grow overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-[#F5A623]" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs text-gray-400">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-3 mt-4 flex flex-col gap-3">
        {REVIEWS.map((r) => (
          <div key={r.name} className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-black">{r.name}</p>
              <Stars n={r.stars} />
            </div>
            <p className="mt-1.5 text-sm text-gray-500">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
