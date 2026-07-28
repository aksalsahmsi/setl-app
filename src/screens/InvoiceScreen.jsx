import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import PaymentMethods from '../components/PaymentMethods.jsx'
import VoucherField from '../components/VoucherField.jsx'

// Final invoice, opened from Orders once the work is done (awaiting_payment).
// Itemized: work items, base discount, inspection fee credit (repairs),
// voucher — then the actual payment happens here (Phase 1, decision B).
export default function InvoiceScreen({ order, onPay, onBack }) {
  const [method, setMethod] = useState('apple')
  const [voucherRate, setVoucherRate] = useState(0)
  const [voucherCode, setVoucherCode] = useState('')
  const [paying, setPaying] = useState(false)

  const subtotal = order.items.reduce((sum, it) => sum + it.price, 0)
  const discount = order.discount ?? 0
  const credit = order.inspectionCredit ?? 0
  const voucherDiscount = Math.round(subtotal * voucherRate)
  const due = Math.max(0, subtotal - discount - credit - voucherDiscount)

  return (
    <GradientHeader title="Final invoice" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-3 pb-6">
      <div className="mt-1">
        <AppointmentCard booking={order} label="Work completed — payment due" price={due} />
      </div>

      {order.flowType === 'inspection' && (
        <div className="mt-6">
          <ProgressSteps current="pay" />
        </div>
      )}

      <h2 className="mt-4 text-xl font-semibold text-black">Payment method</h2>
      <PaymentMethods method={method} onChange={setMethod} />
      <VoucherField
        onApplied={(rate, code) => {
          setVoucherRate(rate)
          setVoucherCode(code)
        }}
      />

      {/* Itemized final invoice */}
      <div className="mt-4 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h3 className="font-semibold text-black">Invoice</h3>
        {order.items.map((it) => (
          <div key={it.label} className="mt-1 flex justify-between text-xs text-gray-400">
            <span>
              {it.qty}x {it.label}
            </span>
            <span>{it.price} AED</span>
          </div>
        ))}
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-black">
            Subtotal{' '}
            <span className="text-xs text-gray-400">
              ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
            </span>
          </span>
          <span className="text-black">{subtotal}.00 AED</span>
        </div>
        {discount > 0 && (
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="text-black">Saving &amp; Discounts</span>
            <span className="shrink-0 whitespace-nowrap text-[#8442FF]">- {discount} AED</span>
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
            <span className="text-black">
              Voucher <span className="text-xs text-[#8442FF]">({voucherCode})</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-[#8442FF]">- {voucherDiscount} AED</span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-gray-100 pt-2">
          <span className="text-xs text-gray-400">(VAT included)</span>
          <span className="text-lg font-semibold text-black">{due} AED</span>
        </div>
      </div>

      <div className="grow" />

      <GradientButton
        className="mt-6"
        loading={paying}
        onClick={() => {
          setPaying(true)
          // Simulated payment processing; later this is the payment gateway call
          setTimeout(() => onPay(due, { method, ...(voucherCode && { voucher: voucherCode }) }), 1200)
        }}
      >
        Pay {due} AED
      </GradientButton>
      </div>
    </GradientHeader>
  )
}
