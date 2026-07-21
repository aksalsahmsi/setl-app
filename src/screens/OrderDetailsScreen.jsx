import { useState } from 'react'
import GradientButton from '../components/GradientButton.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'
import { AC_PRICE_PER_UNIT, SERVICES } from '../data/providers.js'

const PAYMENT_METHODS = [
  { id: 'apple', label: 'Apple pay' },
  { id: 'cash', label: 'Cash pay' },
  { id: 'card', label: 'Card pay' },
]

// Demo voucher: SETL10 gives an extra 10% off
const VOUCHERS = { SETL10: 0.1 }

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

export default function OrderDetailsScreen({ booking, counts, onPay, onBack, onReschedule, onChangeProvider }) {
  const [method, setMethod] = useState('apple')
  const [voucher, setVoucher] = useState('')
  const [voucherState, setVoucherState] = useState(null) // null | 'invalid' | number (rate)
  const [paying, setPaying] = useState(false)
  const [rescheduling, setRescheduling] = useState(false) // date/time sheet open

  const isInspection = booking.variant === 'inspection'
  const isMaintenance = booking.variant === 'maintenance'
  const service = SERVICES[booking.service]

  // What is being paid for depends on the flow:
  //  - inspection booking -> only the provider's inspection visit fee
  //  - maintenance        -> the products the inspector proposed (accepted by the customer)
  //  - direct booking     -> the selected AC services
  const items = isInspection
    ? [{ label: 'Inspection visit', qty: 1, price: booking.price }]
    : isMaintenance
      ? booking.products.map((p) => ({ label: p.name, qty: p.qty, price: p.price }))
      : [
          { label: 'Ac refilling', qty: counts.refill, price: counts.refill * AC_PRICE_PER_UNIT },
          { label: 'Ac Cleaning', qty: counts.clean, price: counts.clean * AC_PRICE_PER_UNIT },
        ].filter((it) => it.qty > 0)

  const subtotal = items.reduce((sum, it) => sum + it.price, 0)
  // 10% off accepted maintenance (mockup 11a), 5% off direct bookings (mockup 13)
  const baseRate = isMaintenance ? 0.1 : isInspection ? 0 : 0.05
  const baseDiscount = Math.round(subtotal * baseRate)
  const voucherRate = typeof voucherState === 'number' ? voucherState : 0
  const voucherDiscount = Math.round(subtotal * voucherRate)
  const total = subtotal - baseDiscount - voucherDiscount

  function applyVoucher() {
    const rate = VOUCHERS[voucher.trim().toUpperCase()]
    setVoucherState(rate ?? 'invalid')
  }

  return (
    <div className="font-poppins relative flex min-h-screen flex-col bg-[#F5F4F7] px-3 pt-5 pb-6">
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
        <h1 className="text-center text-2xl font-semibold text-black">
          {isInspection ? 'Check out' : 'Order Details'}
        </h1>
      </div>

      {/* Inspection checkout (mockup 7): timing + location sections */}
      {isInspection && (
        <>
          {service.requiresInspection && (
            <p className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3 text-xs text-gray-500 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white">
                !
              </span>
              Please note: a prior inspection of your issue is necessary before proceeding, ensuring
              a seamless and efficient experience with our services.
            </p>
          )}
          <h2 className="mt-4 text-lg font-semibold text-black">Timing</h2>
          <div className="mt-1 flex items-center justify-between rounded-xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div>
              <p className="text-[15px] text-black">
                {booking.date.day} {booking.date.num}
              </p>
              <p className="text-sm text-gray-400">{booking.time}</p>
            </div>
            <button
              type="button"
              onClick={() => setRescheduling(true)}
              className="cursor-pointer text-[15px] text-[#8442FF]"
            >
              Change
            </button>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-black">Location</h2>
          <div className="mt-1 rounded-xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="text-[15px] text-black">9 Yaw Hayah St-Ni&quot;mah-Abu Dhabi</p>
            <div className="mt-2 flex gap-2">
              {['Indoor', 'outdoor', 'Villa'].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-lg border px-4 py-1.5 text-sm ${
                    i === 0 ? 'border-[#8442FF] text-[#8442FF]' : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-black">Service</h2>
        </>
      )}

      {/* Provider / appointment card; Change picks a different provider */}
      <div className="mt-5">
        <AppointmentCard
          booking={booking}
          label={isInspection ? service.inspectionLabel : service.maintenanceLabel}
          price={total}
          onChange={isInspection ? onChangeProvider : undefined}
        />
      </div>

      {isInspection && (
        <p className="mt-1 px-2 text-[11px] text-gray-400">
          After inspection approve or cancel maintenance. Inspection fees are non refundable.
        </p>
      )}

      {/* Progress (maintenance flow): products accepted, paying now */}
      {isMaintenance && (
        <div className="mt-6">
          <ProgressSteps current="pay" />
        </div>
      )}

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
          onChange={(e) => {
            setVoucher(e.target.value)
            setVoucherState(null)
          }}
          placeholder="Voucher code"
          className="w-full bg-transparent px-3 text-base text-black outline-none placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={applyVoucher}
          disabled={!voucher.trim()}
          className="shrink-0 cursor-pointer rounded-xl border border-[#8442FF] bg-white px-7 py-2.5 text-lg text-[#8442FF] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply
        </button>
      </div>
      {voucherState === 'invalid' && (
        <p className="mt-1 pl-2 text-xs text-red-500">Invalid voucher code</p>
      )}
      {voucherRate > 0 && (
        <p className="mt-1 pl-2 text-xs text-green-600">
          Voucher applied — {voucherRate * 100}% off
        </p>
      )}

      {/* Order summary */}
      <div className="mt-4 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h3 className="font-semibold text-black">Order Summary</h3>
        {items.map((it) => (
          <div key={it.label} className="mt-1 flex justify-between text-xs text-gray-400">
            <span>
              {it.qty}x {it.label}
            </span>
            <span>{it.price} AED</span>
          </div>
        ))}
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-black">
            Subtotal <span className="text-xs text-gray-400">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          </span>
          <span className="text-black">{subtotal}.00 AED</span>
        </div>
        {baseDiscount > 0 && (
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="text-black">
              Saving &amp; Discounts{' '}
              <span className="text-xs text-[#8442FF]">(Discount applied {baseRate * 100}%)</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-[#8442FF]">- {baseDiscount} AED</span>
          </div>
        )}
        {voucherDiscount > 0 && (
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="text-black">
              Voucher <span className="text-xs text-[#8442FF]">({voucher.trim().toUpperCase()})</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-[#8442FF]">- {voucherDiscount} AED</span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-gray-100 pt-2">
          <span className="text-xs text-gray-400">(VAT included)</span>
          <span className="text-lg font-semibold text-black">{total} AED</span>
        </div>
      </div>

      <div className="grow" />

      <GradientButton
        className="mt-6"
        loading={paying}
        onClick={() => {
          setPaying(true)
          // Simulated payment processing; later this is the payment gateway call
          setTimeout(() => onPay(total), 1200)
        }}
      >
        {isInspection ? 'Confirm' : 'Pay'}
      </GradientButton>

      {rescheduling && (
        <DateTimeSheet
          provider={booking.provider}
          title="Inspection time & date"
          onClose={() => setRescheduling(false)}
          onConfirm={({ date, time }) => {
            onReschedule(date, time)
            setRescheduling(false)
          }}
        />
      )}
    </div>
  )
}
