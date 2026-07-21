function ProductIcon({ icon }) {
  if (icon === 'faucet')
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#8A8894" strokeWidth="2.5" strokeLinecap="round">
        <path d="M14 44V26c0-8 5-13 12-13s12 5 12 13" />
        <path d="M38 26v6M33 32h10M10 44h8M14 13v-4M10 9h8" />
      </svg>
    )
  if (icon === 'pipe')
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#8A8894" strokeWidth="2.5" strokeLinecap="round">
        <path d="M10 36c0-12 8-22 20-22 8 0 12 5 12 12" />
        <path d="M6 32h8v8H6zM38 22h8v8h-8z" strokeLinejoin="round" />
      </svg>
    )
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#8A8894" strokeWidth="2.5" strokeLinecap="round">
      <rect x="8" y="14" width="36" height="18" rx="4" strokeLinejoin="round" />
      <path d="M16 38c0 3-2 4-2 4M26 38c0 3-2 4-2 4M36 38c0 3-2 4-2 4M14 26h24" />
    </svg>
  )
}

// One-glance verdict on how this provider's price compares to the typical
// range from recent Setl jobs (defensible wording — we can substantiate our
// own job data, not "the market").
function priceVerdict(unit, lo, hi) {
  if (unit < lo) return { label: 'Below typical Setl range', className: 'bg-green-50 text-green-600', good: true }
  if (unit <= hi) return { label: 'Within typical Setl range', className: 'bg-green-50 text-green-600', good: true }
  return { label: 'Above typical Setl range', className: 'bg-orange-50 text-orange-500', good: false }
}

// Product proposed by the inspector: name, quantity, price, and a clear
// comparison against the typical range from recent Setl jobs.
export default function ProductCard({ product }) {
  const [lo, hi] = product.market
  const unit = product.price / product.qty
  const verdict = priceVerdict(unit, lo, hi)

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F6F5F8]">
        <ProductIcon icon={product.icon} />
      </div>
      <div className="min-w-0 grow">
        <p className="font-semibold text-black">{product.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-lg bg-[#F6F5F8] px-2.5 py-1 text-xs text-gray-400">
            Qt.{product.qty}
          </span>
          <span className="text-[15px] font-semibold text-black">{product.price} AED</span>
        </div>
      </div>
      <div className="w-[118px] shrink-0 text-right">
        <span className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-left text-[11px] leading-tight font-medium ${verdict.className}`}>
          {verdict.good ? (
            <svg width="10" height="8" viewBox="0 0 24 18" fill="none">
              <path d="m2 9 7 7L22 2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="8" height="10" viewBox="0 0 12 16" fill="none">
              <path d="M6 15V2M1 7l5-5 5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {verdict.label}
        </span>
        <p className="mt-1.5 text-[11px] text-gray-400">
          Recent Setl jobs: {lo}–{hi} AED
        </p>
      </div>
    </div>
  )
}
