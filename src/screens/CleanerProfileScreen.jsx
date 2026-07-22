import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 12 6 6L21 5" />
      </svg>
      ID verified
    </span>
  )
}

// Individual cleaner profile — who's actually coming into your home. Book her
// directly here, or set her as your regular. Hours were already chosen on the
// cleaning screen; booking flows into the normal hourly checkout.
export default function CleanerProfileScreen({ cleaner, hours, isFavorite, onToggleFavorite, onBook, onBack }) {
  const [booking, setBooking] = useState(false) // date sheet open

  return (
    <GradientHeader title="Cleaner profile" onBack={onBack}>
      <div className="flex grow flex-col px-4 pt-5 pb-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ background: cleaner.color }}
          >
            {cleaner.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-black">{cleaner.name}</h2>
              {cleaner.verified && <VerifiedBadge />}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              ★ {cleaner.rating} · {cleaner.jobsDone} jobs done
            </p>
            <p className="text-sm font-semibold text-black">{cleaner.bookingFee} AED/hr</p>
          </div>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remove as regular' : 'Set as my regular'}
            className="ml-auto cursor-pointer self-start"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill={isFavorite ? '#8442FF' : 'none'} stroke={isFavorite ? '#8442FF' : '#C2C0C9'} strokeWidth="2">
              <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Facts */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="text-xs text-gray-400">Experience</p>
            <p className="text-[15px] font-semibold text-black">{cleaner.years} years</p>
          </div>
          <div className="rounded-xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="text-xs text-gray-400">Speaks</p>
            <p className="text-[15px] font-semibold text-black">{cleaner.languages.join(', ')}</p>
          </div>
        </div>

        {/* About */}
        <h3 className="mt-5 font-semibold text-black">About</h3>
        <p className="mt-1 text-sm text-gray-600">{cleaner.bio}</p>

        {/* Availability */}
        {cleaner.slots && (
          <>
            <h3 className="mt-5 font-semibold text-black">Next available</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {cleaner.slots.map((s, i) => (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    i === 0 ? 'bg-[#EDE4FD] text-[#8442FF]' : 'border border-gray-200 text-gray-400'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </>
        )}

        <div className="grow" />

        {isFavorite && (
          <p className="mt-4 text-center text-xs font-medium text-[#8442FF]">★ Your regular cleaner</p>
        )}
        <GradientButton className="mt-2" onClick={() => setBooking(true)}>
          Book {cleaner.name.split(' ')[0]} · {hours} {hours === 1 ? 'hr' : 'hrs'}
        </GradientButton>
      </div>

      {booking && (
        <DateTimeSheet
          provider={cleaner}
          title="Pick a time"
          onClose={() => setBooking(false)}
          onConfirm={({ date, time }) => {
            onBook(cleaner, date, time)
            setBooking(false)
          }}
        />
      )}
    </GradientHeader>
  )
}
