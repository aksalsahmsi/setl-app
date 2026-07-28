import { CUSTOMER_ME } from '../data/providers.js'

// Provider appointment summary card, shared by checkout and order tracking.
export default function AppointmentCard({ booking, label, price, onChange }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
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
          <p className="text-xs text-[#8442FF]">{label}</p>
        </div>
        <p className="text-black">{price} AED</p>
      </div>
      <div className="mt-1 pl-12 text-sm text-gray-400">
        <p>{CUSTOMER_ME.name}</p>
        <p>{CUSTOMER_ME.phone}</p>
        <div className="flex items-end justify-between">
          <p>{CUSTOMER_ME.address}</p>
          {onChange && (
            <button type="button" onClick={onChange} className="cursor-pointer text-[15px] text-[#8442FF]">
              Change
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
