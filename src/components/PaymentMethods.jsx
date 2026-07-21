const PAYMENT_METHODS = [
  { id: 'apple', label: 'Apple pay' },
  { id: 'cash', label: 'Cash pay' },
  { id: 'card', label: 'Card pay' },
]

function PayIcon({ id }) {
  if (id === 'apple')
    return (
      <span className="flex h-7 w-11 items-center justify-center rounded border border-[#8442FF] text-[10px] font-semibold text-black">
        Pay
      </span>
    )
  if (id === 'cash')
    return (
      <svg width="34" height="24" viewBox="0 0 34 24" fill="none" stroke="#8442FF" strokeWidth="1.6">
        <rect x="1" y="4" width="32" height="16" rx="3" />
        <circle cx="17" cy="12" r="4.5" />
        <path d="M6 12h.01M28 12h.01" strokeLinecap="round" strokeWidth="3" />
      </svg>
    )
  return (
    <svg width="34" height="24" viewBox="0 0 34 24" fill="none" stroke="#8442FF" strokeWidth="1.6">
      <rect x="1" y="2" width="32" height="20" rx="3" />
      <path d="M1 8h32" strokeWidth="4" />
    </svg>
  )
}

// Radio list of payment methods (shared by the inspection checkout and the
// final invoice).
export default function PaymentMethods({ method, onChange }) {
  return (
    <div className="mt-2 rounded-xl bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {PAYMENT_METHODS.map((m) => (
        <label key={m.id} className="flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2.5">
          <input
            type="radio"
            name="payment"
            checked={method === m.id}
            onChange={() => onChange(m.id)}
            className="h-5 w-5 accent-[#8442FF]"
          />
          <PayIcon id={m.id} />
          <span className="text-[16px] text-black">{m.label}</span>
        </label>
      ))}
    </div>
  )
}
