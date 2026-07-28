import { useEffect, useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
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
export default function OrderTrackingScreen({ booking, order, counts, onProceedToPay, onReject, onBack, onEstimateReady, onOrderEvent }) {
  // When a real worker has taken this job (autopilot off), the estimate comes
  // from their "Add products" screen — not the simulation below.
  const workerDriven = order?.autopilot === false
  const [localProducts, setLocalProducts] = useState(null)
  const [editing, setEditing] = useState(false) // "Edit selected work" mode
  const [deselected, setDeselected] = useState(() => new Set()) // dropped line items
  const [asking, setAsking] = useState(false) // question sheet open
  const [question, setQuestion] = useState('')
  const [questionSent, setQuestionSent] = useState(false)
  const [quoteRequested, setQuoteRequested] = useState(false)
  const [arrived, setArrived] = useState(false) // staging: en route -> inspecting

  useEffect(() => {
    const t = setTimeout(() => setArrived(true), 2000)
    return () => clearTimeout(t)
  }, [])

  // Standalone (no worker) demo keeps the simulated estimate that "arrives" a
  // few seconds after the visit. Once a worker is on the job, we wait for the
  // estimate they actually send instead.
  useEffect(() => {
    if (workerDriven) return undefined
    const t = setTimeout(() => {
      const arrived = getInspectionProducts(booking.service, counts)
      setLocalProducts(arrived)
      onEstimateReady?.(arrived) // advances the order to estimate_ready
    }, 4000)
    return () => clearTimeout(t)
  }, [booking.service, counts, workerDriven])

  // The estimate to show: the worker's real line items once they've sent it,
  // otherwise the simulated one. `null` = still waiting (skeleton).
  const products = workerDriven
    ? order?.state === 'estimate_ready' || order?.state === 'approved'
      ? (order.products ?? [])
      : null
    : localProducts

  // While worker-driven and still waiting, reflect where the worker actually is.
  const waitingText = workerDriven
    ? order?.state === 'in_progress'
      ? 'Inspection in progress — the estimate will show here once it’s done'
      : `${booking.provider.name} is on the way to you`
    : arrived
      ? 'Inspection in progress — the products & prices will show here once it’s done'
      : `${booking.provider.name} is on the way to you`

  const selected = (products ?? []).filter((p) => !deselected.has(p.name))
  const total = selected.reduce((sum, p) => sum + p.price, 0)

  function toggleProduct(name) {
    const next = new Set(deselected)
    if (next.has(name)) next.delete(name)
    else next.add(name)
    setDeselected(next)
  }

  return (
    <GradientHeader title="Order details" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-3 pb-6">
      <div className="mt-1">
        <AppointmentCard booking={booking} label="Inspection visit — paid" price={booking.price} />
      </div>

      <div className="mt-6">
        <ProgressSteps current="approve" />
      </div>

      {!products ? (
        <>
          <p className="mt-5 text-center text-sm text-gray-400">{waitingText}</p>
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
      ) : products.length === 0 ? (
        <>
          <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="font-semibold text-black">No parts needed</p>
            <p className="mt-1 text-sm text-gray-400">
              The inspector found nothing to replace — the visit is covered by your inspection fee.
            </p>
          </div>
          <div className="grow" />
          <GradientButton className="mt-5" onClick={() => onProceedToPay([])}>
            Approve &amp; close
          </GradientButton>
        </>
      ) : (
        <>
          <h2 className="mt-5 text-lg font-semibold text-black">Products</h2>
          <p className="mb-2 text-xs text-gray-400">
            Each price is compared with the typical range from recent Setl jobs, so you know it&apos;s fair.
          </p>
          <div className="screen-enter flex flex-col gap-3">
            {products.map((p) => (
              <ProductCard
                key={p.name}
                product={p}
                selectable={editing}
                selected={!deselected.has(p.name)}
                onToggle={() => toggleProduct(p.name)}
              />
            ))}
          </div>

          {questionSent && (
            <p className="mt-3 rounded-xl bg-green-50 p-2.5 text-center text-xs text-green-600">
              Question sent — the inspector will reply here.
            </p>
          )}
          {quoteRequested && (
            <p className="mt-3 rounded-xl bg-green-50 p-2.5 text-center text-xs text-green-600">
              Request sent — we&apos;ll notify you when another quote arrives.
            </p>
          )}

          <div className="grow" />

          {/* Estimate actions (PLAN.md): Approve / Edit selected work /
              Ask a question / Request another quote / Decline */}
          <GradientButton
            className="mt-5"
            disabled={selected.length === 0}
            onClick={() => onProceedToPay(selected)}
          >
            {deselected.size > 0 ? `Approve selected work (${total} AED)` : 'Approve'}
          </GradientButton>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="mt-3 h-12 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white text-[15px] font-medium text-[#8442FF] transition-transform duration-100 active:scale-[0.98]"
          >
            {editing ? 'Done editing' : 'Edit selected work'}
          </button>
          <div className="mt-3 flex items-center justify-center gap-2 text-[13px]">
            <button
              type="button"
              onClick={() => setAsking(true)}
              className="cursor-pointer text-[#8442FF] underline"
            >
              Ask a question
            </button>
            <span className="text-gray-300">·</span>
            <button
              type="button"
              disabled={quoteRequested}
              onClick={() => {
                setQuoteRequested(true)
                onOrderEvent?.('second_quote_requested')
              }}
              className="cursor-pointer text-[#8442FF] underline disabled:cursor-default disabled:text-gray-300 disabled:no-underline"
            >
              Request another quote
            </button>
            <span className="text-gray-300">·</span>
            <button
              type="button"
              onClick={() => onReject(products)}
              className="cursor-pointer text-red-500 underline"
            >
              Decline
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-gray-400">
            Total {total} AED. Your {booking.price} AED inspection fee is credited toward the repair if you approve.
          </p>
        </>
      )}

      {/* Ask-a-question sheet */}
      {asking && (
        <div className="fixed inset-0 z-20 mx-auto flex w-full max-w-[375px] items-end bg-black/40" onClick={() => setAsking(false)}>
          <div
            className="w-full rounded-t-3xl bg-white p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-black">Ask your inspector</h3>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="e.g. Is the pipe replacement really necessary?"
              className="mt-3 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#8442FF]"
            />
            <GradientButton
              className="mt-4"
              disabled={!question.trim()}
              onClick={() => {
                onOrderEvent?.('question', { question: question.trim() })
                setQuestionSent(true)
                setQuestion('')
                setAsking(false)
              }}
            >
              Send
            </GradientButton>
          </div>
        </div>
      )}
      </div>
    </GradientHeader>
  )
}
