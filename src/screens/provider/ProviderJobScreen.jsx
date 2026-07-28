import { useState } from 'react'
import { CUSTOMER_ME, getPartCatalog } from '../../data/providers.js'
import GradientButton from '../../components/GradientButton.jsx'

function Stepper({ value, onDec, onInc, suffix }) {
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={onDec} className="h-8 w-8 cursor-pointer rounded-md bg-gray-100 text-lg text-gray-500 active:scale-95">−</button>
      <span className="min-w-14 text-center text-sm font-medium text-black">{value}{suffix}</span>
      <button type="button" onClick={onInc} className="h-8 w-8 cursor-pointer rounded-md bg-gray-100 text-lg text-gray-500 active:scale-95">+</button>
    </div>
  )
}

const REPORT_REASONS = [
  { label: 'Customer not home', state: 'customer_no_show' },
  { label: "Can't complete the job", state: 'cancelled_by_provider' },
  { label: 'Unsafe / access problem', state: 'cancelled_by_provider' },
]

// Provider on-site. For an inspection job this is the estimate builder
// ("Add products" in the mockup): the worker adds the parts needed, sets
// price + quantity, and sends the estimate for the customer to approve.
// For a direct / approved job it's a simple "mark as done".
export default function ProviderJobScreen({ order, onSendEstimate, onDone, onReport, onDial, onBack }) {
  const catalog = order ? getPartCatalog(order.serviceKey) : []
  const [lines, setLines] = useState([]) // [{ name, icon, market, unitPrice, qty }]
  const [customPrice, setCustomPrice] = useState(45)
  const [customQty, setCustomQty] = useState(1)
  const [reporting, setReporting] = useState(false)

  if (!order) return null

  const inspecting = order.flowType === 'inspection' && order.state === 'in_progress'
  const total = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)

  function addPart(part) {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.name === part.name && l.unitPrice === part.price)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + 1 }
        return next
      }
      return [...prev, { name: part.name, icon: part.icon, market: part.market, unitPrice: part.price, qty: 1 }]
    })
  }

  function setQty(idx, delta) {
    setLines((prev) =>
      prev
        .map((l, i) => (i === idx ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    )
  }

  function send(products) {
    // Shape each line the way the customer's ProductCard expects: price is the
    // line total, market is the typical Setl range for the verdict chip.
    onSendEstimate(
      products.map((l) => ({
        name: l.name,
        qty: l.qty,
        price: l.unitPrice * l.qty,
        market: l.market,
        icon: l.icon,
      })),
    )
  }

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F5F4F7] px-3 pt-4 pb-6">
      {/* Job header */}
      <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <button type="button" onClick={onBack} aria-label="Go back" className="mb-1 -ml-1 cursor-pointer p-1 text-black">
          <svg width="9" height="16" viewBox="0 0 10 18" fill="none">
            <path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-black">
              {inspecting ? 'Inspection' : order.service}
            </h1>
            <span className="rounded-full bg-[#FBEED0] px-2.5 py-0.5 text-[11px] font-medium text-[#B5820E]">
              {order.hours ? `${order.hours} hrs` : '30 min'}
            </span>
          </div>
          <span className="text-sm font-bold text-black">{order.amountDue ?? order.total ?? 0} AED</span>
        </div>
        <p className="mt-0.5 text-sm text-gray-400">{CUSTOMER_ME.name}</p>

        {/* Quick actions — the job is completed via the primary button below
            ("Send estimate" for inspections, "Mark as done" for direct work). */}
        <div className="mt-3 flex overflow-hidden rounded-lg border border-gray-100">
          <button type="button" onClick={() => setReporting(true)} className="flex-1 cursor-pointer bg-gray-100 py-2.5 text-sm font-medium text-gray-500 active:opacity-80">
            Report
          </button>
          <button type="button" onClick={onDial} className="flex-1 cursor-pointer bg-[#BFD3F5] py-2.5 text-sm font-medium text-[#2657B0] active:opacity-80">
            Dial
          </button>
        </div>
      </div>

      {inspecting ? (
        <>
          <h2 className="mt-5 mb-2 px-1 text-lg font-semibold text-black">Add products</h2>

          {/* Custom line + catalog grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <p className="text-xs text-gray-400">Pricing</p>
              <Stepper value={customPrice} suffix=" AED" onDec={() => setCustomPrice(Math.max(5, customPrice - 5))} onInc={() => setCustomPrice(customPrice + 5)} />
              <p className="mt-2 text-xs text-gray-400">Quantity</p>
              <Stepper value={customQty} onDec={() => setCustomQty(Math.max(1, customQty - 1))} onInc={() => setCustomQty(customQty + 1)} />
              <button
                type="button"
                onClick={() =>
                  setLines((prev) => [
                    ...prev,
                    { name: 'Custom part', icon: 'tool', market: [Math.max(0, customPrice - 10), customPrice + 10], unitPrice: customPrice, qty: customQty },
                  ])
                }
                className="mt-2 h-8 w-full cursor-pointer rounded-full bg-[#8442FF] text-sm font-medium text-white active:opacity-90"
              >
                Add
              </button>
            </div>

            {catalog.map((part) => (
              <div key={part.name} className="relative rounded-2xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <button
                  type="button"
                  onClick={() => addPart(part)}
                  aria-label={`Add ${part.name}`}
                  className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#8442FF] text-white active:opacity-90"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                </button>
                <div className="flex h-16 items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 52 52" fill="none" stroke="#8A8894" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M14 44V26c0-8 5-13 12-13s12 5 12 13" />
                    <path d="M38 26v6M33 32h10M10 44h8" />
                  </svg>
                </div>
                <p className="truncate text-center text-[13px] text-black">{part.name}</p>
                <p className="text-center text-xs text-gray-400">{part.price} AED</p>
              </div>
            ))}
          </div>

          {/* Cart / estimate so far */}
          {lines.length > 0 && (
            <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <p className="mb-2 text-sm font-semibold text-black">Estimate</p>
              {lines.map((l, i) => (
                <div key={`${l.name}-${i}`} className="flex items-center justify-between border-b border-gray-50 py-2 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-black">{l.name}</p>
                    <p className="text-xs text-gray-400">{l.unitPrice} AED each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stepper value={l.qty} onDec={() => setQty(i, -1)} onInc={() => setQty(i, 1)} />
                    <span className="w-16 text-right text-sm font-semibold text-black">{l.unitPrice * l.qty} AED</span>
                  </div>
                </div>
              ))}
              <div className="mt-2 flex justify-between pt-2 text-sm font-semibold text-black">
                <span>Total</span>
                <span>{total} AED</span>
              </div>
            </div>
          )}

          <div className="grow" />

          <GradientButton className="mt-5" disabled={lines.length === 0} onClick={() => send(lines)}>
            Send estimate{lines.length > 0 ? ` · ${total} AED` : ''}
          </GradientButton>
          <button
            type="button"
            onClick={() => send([])}
            className="mt-3 h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white text-[15px] font-medium text-gray-500 active:scale-[0.98]"
          >
            No products needed
          </button>
        </>
      ) : (
        <>
          {order.products?.length > 0 && (
            <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <p className="mb-2 text-sm font-semibold text-black">Approved work</p>
              {order.products.map((p) => (
                <div key={p.name} className="flex justify-between py-1 text-sm">
                  <span className="text-gray-500">{p.name} ×{p.qty}</span>
                  <span className="font-medium text-black">{p.price} AED</span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-5 px-2 text-center text-sm text-gray-400">
            Do the work, then mark the job done. The customer pays after completion.
          </p>
          <div className="grow" />
          <GradientButton className="mt-5" onClick={() => onDone(order)}>
            Mark as done
          </GradientButton>
        </>
      )}

      {/* Report sheet */}
      {reporting && (
        <div className="fixed inset-0 z-20 flex items-end bg-black/40" onClick={() => setReporting(false)}>
          <div className="w-full rounded-t-3xl bg-white p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-black">Report an issue</h3>
            <div className="mt-3 flex flex-col gap-2">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => {
                    setReporting(false)
                    onReport(order, r.state, r.label)
                  }}
                  className="w-full cursor-pointer rounded-xl border border-gray-200 px-4 py-3 text-left text-sm text-black active:bg-gray-50"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
