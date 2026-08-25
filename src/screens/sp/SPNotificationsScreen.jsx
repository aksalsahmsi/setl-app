// SP notifications derived from the shared orders — reflects real job state.
function notificationsFor(orders) {
  const items = []
  for (const o of orders) {
    const no = `SETL-${String(o.id).padStart(4, '0')}`
    if (o.state === 'scheduled' && !o.assignedName) items.push({ id: `${o.id}-new`, icon: 'new', title: 'New customer request', body: `${o.service} · needs assigning · ${no}` })
    else if (o.assignedName && ['scheduled', 'provider_en_route', 'in_progress', 'work_in_progress'].includes(o.state)) items.push({ id: `${o.id}-asg`, icon: 'ok', title: 'Job in progress', body: `${o.assignedName} · ${o.service} · ${no}` })
    else if (o.state === 'estimate_ready') items.push({ id: `${o.id}-est`, icon: 'wait', title: 'Estimate sent to customer', body: `${o.assignedName ?? ''} · ${no}` })
    else if (o.state === 'awaiting_payment') items.push({ id: `${o.id}-done`, icon: 'ok', title: 'Job completed', body: `Awaiting customer payment · ${no}` })
    else if (o.state === 'paid' || o.state === 'closed') items.push({ id: `${o.id}-paid`, icon: 'pay', title: 'Payment received', body: `${o.total ?? 0} AED · ${no}` })
  }
  return items.reverse()
}

const ICON = {
  new: { bg: 'bg-[#EDE4FD]', fg: '#8442FF', d: 'M12 3v18M3 12h18' },
  ok: { bg: 'bg-green-50', fg: '#22A366', d: 'm5 13 4 4L19 7' },
  wait: { bg: 'bg-orange-50', fg: '#F0942B', d: 'M12 7v5l3 2' },
  pay: { bg: 'bg-green-50', fg: '#22A366', d: 'M3 10h18M6 15h4' },
}

export default function SPNotificationsScreen({ orders = [], onBack }) {
  const items = notificationsFor(orders)
  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-24">
      <div className="relative brand-header px-4 pt-5 pb-5">
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Go back" className="absolute top-4 left-2 cursor-pointer p-2 text-white">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </button>
        )}
        <h1 className="text-center text-lg font-semibold text-white">Notifications</h1>
      </div>

      {items.length === 0 ? (
        <p className="mx-4 mt-6 rounded-2xl bg-white p-5 text-center text-sm text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">No notifications yet.</p>
      ) : (
        <div className="mx-4 mt-4 flex flex-col gap-2.5">
          {items.map((n) => {
            const ic = ICON[n.icon]
            return (
              <div key={n.id} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ic.bg}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ic.fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={ic.d} /></svg>
                </span>
                <div className="min-w-0"><p className="text-sm font-semibold text-black">{n.title}</p><p className="truncate text-xs text-gray-400">{n.body}</p></div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
