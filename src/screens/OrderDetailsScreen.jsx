import { useState } from 'react'
import GradientButton from '../components/GradientButton.jsx'
import { AC_PRICE_PER_UNIT } from '../data/providers.js'

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

export default function OrderDetailsScreen({ booking, counts, onPay }) {
  const [method, setMethod] = useState('apple')
  const [voucher, setVoucher] = useState('')

  const items = [
    { label: `1x Ac refilling`, qty: counts.refill, price: counts.refill * AC_PRICE_PER_UNIT },
    { label: `1x Ac Cleaning`, qty: counts.clean, price: counts.clean * AC_PRICE_PER_UNIT },
  ].filter((it) => it.qty > 0)

  const subtotal = items.reduce((sum, it) => sum + it.price, 0)
  const discount = Math.round(subtotal * 0.05)
  const total = subtotal - discount

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F5F4F7] px-3 pt-5 pb-6">
      <h1 className="text-center text-2xl font-semibold text-black">Order Details</h1>

      {/* Provider / appointment card */}
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
          </div>
          <p className="text-black">{booking.price} AED</p>
        </div>
        <div className="mt-1 pl-12 text-sm text-gray-400">
          <p>Ahmed Alshamsi</p>
          <p>0501234567</p>
          <div className="flex items-end justify-between">
            <p>9 Yaw Hayah St-Ni&quot;mah-Abu Dhabi</p>
            <button type="button" className="cursor-pointer text-[15px] text-[#8442FF]">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Progress: Inspection done -> Pay */}
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

      {/* Payment method */}
      <h2 className="mt-4 text-xl font-semibold text-black">Payment method</h2>
      <div className="mt-2 rounded-xl bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {PAYMENT_METHODS.map((m) => (
          <label key={m.id} className="flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2.5">
            <input
              type="radio"
              name="payment"
              checked={method === m.id}
              onChange={() => setMethod(m.id)}
              className="h-5 w-5 accent-[#8442FF]"
            />
            <PayIcon id={m.id} />
            <span className="text-[16px] text-black">{m.label}</span>
          </label>
        ))}
      </div>

      {/* Voucher */}
      <div className="mt-4 flex items-center rounded-xl bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <input
          type="text"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder="Voucher code"
          className="w-full bg-transparent px-3 text-sm text-black outline-none placeholder:text-gray-400"
        />
        <button
          type="button"
          className="shrink-0 cursor-pointer rounded-xl border border-[#8442FF] bg-white px-7 py-2.5 text-lg text-[#8442FF]"
        >
          Apply
        </button>
      </div>

      {/* Order summary */}
      <div className="mt-4 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h3 className="font-semibold text-black">Order Summary</h3>
        {items.map((it) => (
          <div key={it.label} className="mt-1 flex justify-between text-xs text-gray-400">
            <span>{it.qty}x {it.label.slice(3)}</span>
            <span>{it.price} AED</span>
          </div>
        ))}
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-black">
            Subtotal <span className="text-xs text-gray-400">({items.length} items)</span>
          </span>
          <span className="text-black">{subtotal}.00 AED</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-black">
            Saving &amp; Discounts <span className="text-xs text-[#8442FF]">(Discount applied 5%)</span>
          </span>
          <span className="text-[#8442FF]">- {discount}AED</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-gray-100 pt-2">
          <span className="text-xs text-gray-400">(VAT included)</span>
          <span className="text-lg font-semibold text-black">{total} AED</span>
        </div>
      </div>

      <div className="grow" />

      <GradientButton className="mt-6" onClick={() => onPay(total)}>
        Pay
      </GradientButton>
    </div>
  )
}
