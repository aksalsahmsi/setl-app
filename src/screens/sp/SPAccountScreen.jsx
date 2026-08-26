// SP account tab: company identity + earnings, roster shortcut, and the role
// switches (which used to clutter the home).
export default function SPAccountScreen({ company, orders = [], onOpenEmployees, onSwitchCustomer, onSwitchWorker, onLogout }) {
  const paid = orders.filter((o) => o.state === 'paid' || o.state === 'closed')
  const earnings = paid.reduce((s, o) => s + (o.total ?? 0), 0)
  const name = company.profile?.name || 'Your company'

  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-24">
      <div className="brand-header px-4 pt-8 pb-10 text-center text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/25 text-2xl font-semibold">{name[0]?.toUpperCase()}</div>
          <div>
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-sm text-white/85">Service Provider · {(company.employees ?? []).length} staff</p>
          </div>
        </div>
      </div>

      <div className="-mt-5 mx-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-2xl font-bold text-black">{earnings} AED</p>
          <p className="text-xs text-gray-400">Earnings</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-2xl font-bold text-black">{paid.length}</p>
          <p className="text-xs text-gray-400">Jobs completed</p>
        </div>
      </div>

      <button type="button" onClick={onOpenEmployees} className="mx-3 mt-4 flex w-[calc(100%-1.5rem)] items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <span className="text-[15px] text-black">Manage employees</span>
        <svg width="7" height="12" viewBox="0 0 10 18" fill="none"><path d="m1 1 7 8-7 8" stroke="#C9C7D1" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>

      <button type="button" onClick={onSwitchCustomer} className="mx-3 mt-4 flex w-[calc(100%-1.5rem)] items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <span className="text-[15px] font-medium text-[#8442FF]">Switch to customer app</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8442FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4M4 7h13M16 21l4-4-4-4M20 17H7" /></svg>
      </button>
      <button type="button" onClick={onSwitchWorker} className="mx-3 mt-3 flex w-[calc(100%-1.5rem)] items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <span className="text-[15px] font-medium text-[#8442FF]">Open a worker view (Alana)</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8442FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4M4 7h13M16 21l4-4-4-4M20 17H7" /></svg>
      </button>
      <button type="button" onClick={onLogout} className="mx-3 mt-3 w-[calc(100%-1.5rem)] rounded-2xl bg-white px-4 py-3.5 text-left text-[15px] text-red-500 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">Log out</button>

      <p className="mt-6 text-center text-xs text-gray-300">Setl Service Provider v0.1.0</p>
    </div>
  )
}
