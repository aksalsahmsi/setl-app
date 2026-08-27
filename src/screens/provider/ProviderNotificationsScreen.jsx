// Notifications derived from the shared orders — so what the worker sees here
// reflects the real state of their jobs, not a canned list.
function notificationsFor(orders) {
  const items = []
  for (const o of orders) {
    const no = `SETL-${String(o.id).padStart(4, '0')}`
    if (o.state === 'scheduled') items.push({ id: `${o.id}-new`, icon: 'new', title: 'New job request', body: `${o.service} · ${no}` })
    else if (o.state === 'approved') items.push({ id: `${o.id}-appr`, icon: 'ok', title: 'Estimate approved', body: `${o.service} · start the work` })
    else if (o.state === 'estimate_ready') items.push({ id: `${o.id}-wait`, icon: 'wait', title: 'Estimate sent', body: `Waiting on customer · ${no}` })
    else if (o.state === 'awaiting_payment') items.push({ id: `${o.id}-done`, icon: 'ok', title: 'Job completed', body: `Awaiting customer payment · ${no}` })
    else if (o.state === 'paid' || o.state === 'closed') items.push({ id: `${o.id}-paid`, icon: 'pay', title: 'Payment received', body: `${o.total ?? 0} AED · ${no}` })
    else if (['estimate_declined', 'estimate_expired'].includes(o.state)) items.push({ id: `${o.id}-dec`, icon: 'no', title: 'Estimate declined', body: `${o.service} · ${no}` })
  }
  return items.reverse()
}

const ICON = {
  new: { bg: 'bg-[#EDE4FD]', fg: '#8442FF', d: 'M12 3v18M3 12h18' },
  ok: { bg: 'bg-green-50', fg: '#22A366', d: 'm5 13 4 4L19 7' },
  wait: { bg: 'bg-orange-50', fg: '#F0942B', d: 'M12 7v5l3 2' },
  pay: { bg: 'bg-green-50', fg: '#22A366', d: 'M3 10h18M6 15h4' },
  no: { bg: 'bg-red-50', fg: '#EF4444', d: 'M6 6l12 12M18 6 6 18' },
}

export default function ProviderNotificationsScreen({ orders = [] }) {
  const items = notificationsFor(orders)
  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-24">
      <div className="brand-header rounded-b-[30px] px-4 pt-8 pb-6 text-white">
        <h1 className="text-center text-lg font-semibold">Notifications</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center pt-24 text-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#C9C7D1" strokeWidth="1.5">
            <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" strokeLinejoin="round" />
            <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
          </svg>
          <p className="mt-4 font-medium text-black">No notifications</p>
        </div>
      ) : (
        <div className="mx-3 mt-4 flex flex-col gap-2.5">
          {items.map((n) => {
            const ic = ICON[n.icon]
            return (
              <div key={n.id} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ic.bg}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ic.fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={ic.d} /></svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-black">{n.title}</p>
                  <p className="truncate text-xs text-gray-400">{n.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
