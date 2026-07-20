import GradientButton from '../components/GradientButton.jsx'

const STATUS_STYLES = {
  'In progress': 'bg-[#EDE4FD] text-[#8442FF]',
  Scheduled: 'bg-blue-50 text-blue-600',
  Completed: 'bg-green-50 text-green-600',
}

export default function OrdersScreen({ orders, onOpenOrder, onBook }) {
  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F5F4F7] px-3 pt-5 pb-24">
      <h1 className="text-center text-2xl font-semibold text-black">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex grow flex-col items-center justify-center pb-16">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C9C7D1" strokeWidth="1.5">
            <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" strokeLinejoin="round" />
            <path d="M9 7h6M9 11h6" strokeLinecap="round" />
          </svg>
          <p className="mt-4 font-medium text-black">No orders yet</p>
          <p className="mt-1 text-sm text-gray-400">Book a service and track it here</p>
          <GradientButton className="mt-8 max-w-56" onClick={onBook}>
            Book a service
          </GradientButton>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {orders.map((order) => {
            const openable = order.status === 'In progress'
            return (
              <button
                key={order.id}
                type="button"
                onClick={openable ? () => onOpenOrder(order) : undefined}
                className={`flex items-center gap-3 rounded-xl bg-white p-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${openable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: order.provider.color }}
                >
                  {order.provider.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 grow">
                  <p className="truncate font-semibold text-black">{order.provider.name}</p>
                  <p className="text-xs text-gray-400">
                    {order.service} · {order.date.day} {order.date.num}, {order.time}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-500'}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-black">{order.total} AED</span>
                  {openable && (
                    <svg width="8" height="14" viewBox="0 0 10 18" fill="none">
                      <path d="m1 1 7 8-7 8" stroke="#9C9AA5" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
