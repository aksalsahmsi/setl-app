import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'

const MIN_HOURS = 1
const MAX_HOURS = 8

// Hours-needed picker for hourly services (Phase 2, category 1).
// Providers charge per hour; the total is rate x hours at checkout.
// If the customer has set a regular cleaner, she shows up top for one-tap
// rebooking (the retention loop — "book your regular").
export default function CleaningServiceScreen({
  hours,
  setHours,
  favorite,
  onRebook,
  onClearFavorite,
  onOpenProfile,
  onSearchProviders,
  onBack,
}) {
  const [rebooking, setRebooking] = useState(false) // date sheet for the regular

  return (
    <GradientHeader title="House cleaning" onBack={onBack}>
      <div className="flex grow flex-col px-4 pt-5 pb-6">
        {/* Your regular cleaner (retention loop) */}
        {favorite && (
          <div className="mb-5 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <p className="text-xs font-medium text-[#8442FF]">Your regular cleaner</p>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenProfile?.(favorite)}
                className="flex min-w-0 grow cursor-pointer items-center gap-3 text-left"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ background: favorite.color }}
                >
                  {favorite.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 grow">
                  <p className="truncate font-semibold text-black">{favorite.name}</p>
                  <p className="text-xs text-gray-400">
                    ★ {favorite.rating} · {favorite.bookingFee} AED/hr · View profile
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={onClearFavorite}
                className="shrink-0 cursor-pointer text-xs text-gray-400 underline"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              onClick={() => setRebooking(true)}
              className="mt-3 h-11 w-full cursor-pointer rounded-full bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] text-sm font-medium text-white active:opacity-90"
            >
              Book {favorite.name.split(' ')[0]} again · {hours} {hours === 1 ? 'hr' : 'hrs'}
            </button>
          </div>
        )}

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
              −
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

        <GradientButton onClick={onSearchProviders}>
          {favorite ? 'See other cleaners' : 'Search for providers'}
        </GradientButton>
      </div>

      {rebooking && favorite && (
        <DateTimeSheet
          provider={favorite}
          title="Pick a time"
          onClose={() => setRebooking(false)}
          onConfirm={({ date, time }) => {
            onRebook(favorite, date, time)
            setRebooking(false)
          }}
        />
      )}
    </GradientHeader>
  )
}
