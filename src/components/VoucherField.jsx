import { useState } from 'react'

// Demo voucher: SETL10 gives an extra 10% off
const VOUCHERS = { SETL10: 0.1 }

// Voucher input + Apply button (shared by the inspection checkout and the
// final invoice). Reports the applied rate + code to the parent.
export default function VoucherField({ onApplied }) {
  const [code, setCode] = useState('')
  const [state, setState] = useState(null) // null | 'invalid' | number (rate)

  function apply() {
    const rate = VOUCHERS[code.trim().toUpperCase()]
    setState(rate ?? 'invalid')
    onApplied(rate ?? 0, code.trim().toUpperCase())
  }

  return (
    <>
      <div className="mt-4 flex items-center rounded-xl bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setState(null)
            onApplied(0, '')
          }}
          placeholder="Voucher code"
          className="w-full bg-transparent px-3 text-base text-black outline-none placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={apply}
          disabled={!code.trim()}
          className="shrink-0 cursor-pointer rounded-xl border border-[#8442FF] bg-white px-7 py-2.5 text-lg text-[#8442FF] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply
        </button>
      </div>
      {state === 'invalid' && <p className="mt-1 pl-2 text-xs text-red-500">Invalid voucher code</p>}
      {typeof state === 'number' && (
        <p className="mt-1 pl-2 text-xs text-green-600">Voucher applied — {state * 100}% off</p>
      )}
    </>
  )
}
