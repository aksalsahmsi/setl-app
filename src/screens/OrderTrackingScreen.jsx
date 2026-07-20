import { useEffect, useState } from 'react'
import GradientButton from '../components/GradientButton.jsx'
import { AC_PRICE_PER_UNIT } from '../data/providers.js'

// Tracking screen after an inspection is booked (mockup 8).
// While the inspection is in progress the price area shows gray skeleton
// boxes; when the inspector finishes, the price update appears on screen
// and the customer can pay.
export default function OrderTrackingScreen({ booking, counts, onProceedToPay, onBack }) {
  const [update, setUpdate] = useState(null) // what the inspector found

  // Simulated for now: the price update "arrives" a few seconds after the
  // visit. Later this comes from the backend instead.
  useEffect(() => {
    const t = setTimeout(() => {
      setUpdate({ refill: counts.refill || 1, clean: counts.clean || 1 })
    }, 4000)
    return () => clearTimeout(t)
  }, [counts])

  const items = update
    ? [
        { label: 'Ac refilling', qty: update.refill, price: update.refill * AC_PRICE_PER_UNIT },
        { label: 'Ac Cleaning', qty: update.clean, price: update.clean * AC_PRICE_PER_UNIT },
      ].filter((it) => it.qty > 0)
    : []
  const total = items.reduce((sum, it) => sum + it.price, 0)

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F5F4F7] px-3 pt-5 pb-6">
      <div className="relative">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="absolute top-1 left-1 cursor-pointer p-2 text-black"
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="text-center text-2xl font-semibold text-black">Order Details</h1>
      </div>

      {/* Appointment card */}
      <div className="mt-5 rounded-xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="flex items-start gap-2">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: booking.provider.color }}
          >
            {booking.provider.name[0].toUpperCase()}
          </div>
          <div className="grow">
            <p className="font-semibold text-black">{booking.provider.name}</p>
            <p className="text-sm text-black">
              {booking.date.day} {booking.date.num}, {booking.time}
            </p>
            <p className="text-xs text-[#8442FF]">Inspection visit — paid</p>
          </div>
          <p className="text-black">{booking.price} AED</p>
        </div>
        <div className="mt-1 pl-12 text-sm text-gray-400">
          <p>Ahmed Alshamsi</p>
          <p>0501234567</p>
          <p>9 Yaw Hayah St-Ni&quot;mah-Abu Dhabi</p>
        </div>
      </div>

      {/* Progress: inspection done -> pay */}
      <div className="mt-6 flex items-center px-2">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8442FF]">
            <svg width="20" height="15" viewBox="0 0 24 18" fill="none">
              <path d="m2 9 7 7L22 2" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mt-1 text-sm text-black">Inspection</p>
        </div>
        <div className="mx-1 mb-5 h-1 grow rounded bg-gradient-to-r from-[#8442FF] to-gray-300" />
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-lg text-gray-400">
            2
          </div>
          <p className="mt-1 text-sm text-black">Pay</p>
        </div>
      </div>

      {!update ? (
        <>
          <p className="mt-5 text-center text-sm text-gray-400">
            Inspection in progress — the price will show here once it&apos;s ready
          </p>
          {/* Skeleton placeholders, like the design */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="mt-4 flex animate-pulse items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            >
              <div className="h-20 w-20 shrink-0 rounded-2xl bg-gray-100" />
              <div className="grow">
                <div className="h-4 w-20 rounded-full bg-gray-100" />
                <div className="mt-2 h-4 w-32 rounded-full bg-gray-100" />
                <div className="mt-3 h-2.5 w-24 rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {/* The price update from the inspector */}
          <div className="screen-enter mt-5 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                <svg width="12" height="9" viewBox="0 0 24 18" fill="none">
                  <path d="m2 9 7 7L22 2" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="font-semibold text-black">Inspection completed</p>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Price update from {booking.provider.name}:
            </p>
            <div className="mt-3 border-t border-gray-100 pt-2">
              {items.map((it) => (
                <div key={it.label} className="flex justify-between py-1 text-sm">
                  <span className="text-black">
                    {it.qty}x {it.label}
                  </span>
                  <span className="text-black">{it.price} AED</span>
                </div>
              ))}
              <div className="mt-1 flex justify-between border-t border-gray-100 pt-2">
                <span className="font-semibold text-black">Total</span>
                <span className="font-semibold text-black">{total} AED</span>
              </div>
            </div>
          </div>

          <div className="grow" />
          <GradientButton className="mt-6" onClick={() => onProceedToPay(update)}>
            Pay {total} AED
          </GradientButton>
        </>
      )}
    </div>
  )
}
