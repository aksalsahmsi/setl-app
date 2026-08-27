import { PROVIDER_ME } from '../../data/providers.js'

// Worker account: identity, earnings, availability, and the switch back to
// the customer app (so the two-sided flow is demoable on one device).
export default function ProviderAccountScreen({ orders = [], availableNow, onOpenAvailability, onSwitchToCustomer, onLogout }) {
  const paid = orders.filter((o) => o.state === 'paid' || o.state === 'closed')
  const earnings = paid.reduce((s, o) => s + (o.total ?? 0), 0)
  const jobsDone = PROVIDER_ME.jobsDone + paid.length

  const menu = [
    { id: 'availability', label: 'My availability', value: availableNow ? 'Available now' : 'Off', accent: availableNow, onClick: onOpenAvailability },
    { id: 'services', label: 'My services' },
    { id: 'payout', label: 'Payout method' },
    { id: 'help', label: 'Help & support' },
  ]

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F5F4F7] pb-24">
      <div className="brand-header rounded-b-[30px] px-4 pt-8 pb-10 text-center text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/25 text-2xl font-semibold" style={{ background: PROVIDER_ME.color }}>
            {PROVIDER_ME.name[0]}
          </div>
          <div>
            <p className="text-lg font-semibold">{PROVIDER_ME.name}</p>
            <p className="text-sm text-white/85">{PROVIDER_ME.trade} · ★ {PROVIDER_ME.rating}</p>
          </div>
        </div>
      </div>

      <div className="-mt-5 mx-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-2xl font-bold text-black">{earnings} AED</p>
          <p className="text-xs text-gray-400">Earnings</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-2xl font-bold text-black">{jobsDone}</p>
          <p className="text-xs text-gray-400">Jobs done</p>
        </div>
      </div>

      <div className="mx-3 mt-4 rounded-2xl bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {menu.map((item, i) => (
          <button key={item.id} type="button" onClick={item.onClick} className={`flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left ${i < menu.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <span className="text-[15px] text-black">{item.label}</span>
            <span className="flex items-center gap-2">
              {item.value && <span className={`text-sm ${item.accent ? 'font-medium text-green-600' : 'text-gray-400'}`}>{item.value}</span>}
              <svg width="7" height="12" viewBox="0 0 10 18" fill="none"><path d="m1 1 7 8-7 8" stroke="#C9C7D1" strokeWidth="2" strokeLinecap="round" /></svg>
            </span>
          </button>
        ))}
      </div>

      <button type="button" onClick={onSwitchToCustomer} className="mx-3 mt-4 flex cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <span className="text-[15px] font-medium text-[#8442FF]">Switch to customer app</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8442FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4M4 7h13M16 21l4-4-4-4M20 17H7" /></svg>
      </button>

      <button type="button" onClick={onLogout} className="mx-3 mt-3 cursor-pointer rounded-2xl bg-white px-4 py-3.5 text-left text-[15px] text-red-500 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        Log out
      </button>

      <p className="mt-6 text-center text-xs text-gray-300">Setl Worker v0.1.0</p>
    </div>
  )
}
