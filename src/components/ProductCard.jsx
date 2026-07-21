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

// Product proposed by the inspector: name, quantity, price, and the fair
// market price range (transparency feature from the design).
export default function ProductCard({ product }) {
  const [lo, hi] = product.market
  // where this provider's unit price sits inside the market range (0..1)
  const unit = product.price / product.qty
  const pos = Math.max(0, Math.min(1, (unit - lo) / (hi - lo)))

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
      <div className="w-24 shrink-0">
        <p className="rounded-lg bg-[#F6F5F8] px-2 py-1 text-center text-[11px] text-gray-500">
          Market price
        </p>
        <div className="relative mx-1 mt-2 h-[3px] rounded bg-gray-200">
          <span className="absolute -top-[2.5px] h-2 w-2 rounded-full border border-[#8442FF] bg-white" style={{ left: '-2px' }} />
          <span className="absolute -top-[2.5px] h-2 w-2 rounded-full border border-[#8442FF] bg-white" style={{ right: '-2px' }} />
          <span
            className="absolute -top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#8442FF]"
            style={{ left: `${pos * 100}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-gray-400">
          <span>{lo} aed</span>
          <span>{hi} aed</span>
        </div>
      </div>
    </div>
  )
}
