import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'
import PaymentMethods from '../components/PaymentMethods.jsx'
import VoucherField from '../components/VoucherField.jsx'
import { AC_PRICE_PER_UNIT, SERVICES } from '../data/providers.js'

// Checkout in three flavors:
//  - inspection:  the standardized fee is prepaid here (payment methods +
//                 voucher stay on this screen)
//  - booking:     direct work — confirm only, AED 0 due now; payment happens
//                 from Orders once the work is done (Phase 1)
//  - maintenance: approved estimate — same 0-due confirm, with the prepaid
//                 inspection fee credited on the projected total
export default function OrderDetailsScreen({ booking, counts, onPay, onBack, onReschedule, onChangeProvider }) {
  const [method, setMethod] = useState('apple')
  const [voucherRate, setVoucherRate] = useState(0)
  const [confirming, setConfirming] = useState(false)
  const [rescheduling, setRescheduling] = useState(false) // date/time sheet open

  const isInspection = booking.variant === 'inspection'
  const isMaintenance = booking.variant === 'maintenance'
  const service = SERVICES[booking.service]

  // What is being paid for depends on the flow:
  //  - inspection booking -> only the standardized inspection fee
  //  - maintenance        -> the products the inspector proposed (accepted by the customer)
  //  - direct options     -> call-out fee + the jobs picked on the options screen
  //  - direct hourly      -> the provider's rate x hours needed
  //  - direct AC          -> the selected AC services
  const items = isInspection
    ? [{ label: 'Inspection visit', qty: 1, price: booking.price }]
    : isMaintenance
      ? booking.products.map((p) => ({ label: p.name, qty: p.qty, price: p.price }))
      : booking.photoQuote
        ? [
            {
              label: 'Service (from your photos)',
              qty: 1,
              price: Math.round((booking.photoQuote[0] + booking.photoQuote[1]) / 2),
            },
          ]
        : booking.options
        ? [
            { label: 'Visit & labor', qty: 1, price: booking.provider.bookingFee },
            ...booking.options.map((o) => ({ label: o.label, qty: 1, price: o.price })),
          ]
        : service.pricingModel === 'hourly'
        ? [
            {
              label: `${service.label} hour (${booking.provider.bookingFee} AED/hr)`,
              qty: booking.hours,
              price: booking.hours * booking.provider.bookingFee,
            },
          ]
        : [
            { label: 'Ac refilling', qty: counts.refill, price: counts.refill * AC_PRICE_PER_UNIT },
            { label: 'Ac Cleaning', qty: counts.clean, price: counts.clean * AC_PRICE_PER_UNIT },
          ].filter((it) => it.qty > 0)

  const subtotal = items.reduce((sum, it) => sum + it.price, 0)
  // 10% off accepted maintenance (mockup 11a), 5% off direct bookings (mockup 13)
  const baseRate = isMaintenance ? 0.1 : isInspection ? 0 : 0.05
  const baseDiscount = Math.round(subtotal * baseRate)
  // The prepaid inspection fee comes off the repair total (decision C) —
  // whatever was actually paid, in case a voucher discounted it
  const credit = isMaintenance ? (booking.total ?? booking.price) : 0
  const voucherDiscount = isInspection ? Math.round(subtotal * voucherRate) : 0
  const total = Math.max(0, subtotal - baseDiscount - credit - voucherDiscount)

  return (
    <GradientHeader
      title={isInspection ? 'Check out' : isMaintenance ? 'Confirm repair' : 'Confirm booking'}
      onBack={onBack}
      sheetClassName="bg-[#F5F4F7]"
    >
      <div className="font-poppins flex grow flex-col px-3 pb-6">
      {/* Inspection checkout (mockup 7): timing + location sections */}
      {isInspection && (
        <>
          {service.requiresInspection && (
            <p className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3 text-xs text-gray-500 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white">
                !
              </span>
              An inspection visit comes first so you get a clear, itemized quote. The inspection
              fee is credited toward your repair if you proceed.
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
          After the inspection you approve or decline the repair. The fee is credited toward the
          repair if you proceed — non-refundable otherwise.
        </p>
      )}

      {/* Progress (maintenance flow): approving now, payment comes after the work */}
      {isMaintenance && (
        <div className="mt-6">
          <ProgressSteps current="approve" />
        </div>
      )}

      {/* Payment method + voucher only where money moves now (inspection fee) */}
      {isInspection && (
        <>
          <h2 className="mt-4 text-xl font-semibold text-black">Payment method</h2>
          <PaymentMethods method={method} onChange={setMethod} />
          <VoucherField onApplied={(rate) => setVoucherRate(rate)} />
        </>
      )}

      {/* Pay after completion (decision B) */}
      {!isInspection && (
        <div className="mt-4 rounded-xl bg-[#EDE4FD] p-3 text-center text-sm font-medium text-[#8442FF]">
          AED 0 due now — pay when the work is done.
        </div>
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
        {credit > 0 && (
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="text-black">
              Inspection fee credit <span className="text-xs text-[#8442FF]">(paid at booking)</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-[#8442FF]">- {credit} AED</span>
          </div>
        )}
        {voucherDiscount > 0 && (
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="text-black">Voucher</span>
            <span className="shrink-0 whitespace-nowrap text-[#8442FF]">- {voucherDiscount} AED</span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-gray-100 pt-2">
          <span className="text-xs text-gray-400">
            {isInspection ? '(VAT included)' : 'Due after completion'}
          </span>
          <span className="text-lg font-semibold text-black">{total} AED</span>
        </div>
      </div>

      <div className="grow" />

      <GradientButton
        className="mt-6"
        loading={confirming}
        onClick={() => {
          setConfirming(true)
          // Simulated processing; later the payment gateway (inspection) or
          // the booking API (confirm variants)
          setTimeout(
            () => onPay(total, { items, discount: baseDiscount, inspectionCredit: credit }),
            1200,
          )
        }}
      >
        {isInspection ? 'Confirm' : isMaintenance ? 'Confirm repair' : 'Confirm booking'}
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
    </GradientHeader>
  )
}
