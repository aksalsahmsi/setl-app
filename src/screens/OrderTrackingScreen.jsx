import { useEffect, useState } from 'react'
import GradientButton from '../components/GradientButton.jsx'
import ProductCard from '../components/ProductCard.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import { getInspectionProducts } from '../data/providers.js'

// Tracking screen after an inspection is booked (mockup 8/9a) — shared by
// every service. While the inspection is in progress the products area shows
// gray skeleton boxes; when the inspector finishes, the proposed products
// appear with their prices and the fair market range. The customer accepts
// (Next) or rejects with a reason.
export default function OrderTrackingScreen({ booking, counts, onProceedToPay, onReject, onBack, onEstimateReady }) {
  const [products, setProducts] = useState(null)

  // Simulated for now: the inspector's product list "arrives" a few seconds
  // after the visit. Later this comes from the backend instead.
  useEffect(() => {
    const t = setTimeout(() => {
      const arrived = getInspectionProducts(booking.service, counts)
      setProducts(arrived)
      onEstimateReady?.(arrived) // advances the order to estimate_ready
    }, 4000)
    return () => clearTimeout(t)
  }, [booking.service, counts])

  const total = (products ?? []).reduce((sum, p) => sum + p.price, 0)

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

      <div className="mt-5">
        <AppointmentCard booking={booking} label="Inspection visit — paid" price={booking.price} />
      </div>

      <div className="mt-6">
        <ProgressSteps current="approve" />
      </div>

      {!products ? (
        <>
          <p className="mt-5 text-center text-sm text-gray-400">
            Inspection in progress — the products &amp; prices will show here once it&apos;s done
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
          <h2 className="mt-5 text-lg font-semibold text-black">Products</h2>
          <p className="mb-2 text-xs text-gray-400">
            Each price is compared with the typical range from recent Setl jobs, so you know it&apos;s fair.
          </p>
          <div className="screen-enter flex flex-col gap-3">
            {products.map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
          </div>

          <div className="grow" />
          <GradientButton className="mt-6" onClick={() => onProceedToPay(products)}>
            Next
          </GradientButton>
          <button
            type="button"
            onClick={() => onReject(products)}
            className="mt-3 h-12 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white text-[16px] font-medium text-[#8442FF] transition-transform duration-100 active:scale-[0.98]"
          >
            Reject
          </button>
          <p className="mt-2 text-center text-[11px] text-gray-400">
            Total {total} AED. Your {booking.price} AED inspection fee is credited toward the repair if you approve.
          </p>
        </>
      )}
    </div>
  )
}
