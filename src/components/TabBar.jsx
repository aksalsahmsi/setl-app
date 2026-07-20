const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'orders', label: 'Orders' },
  { id: 'profile', label: 'Profile' },
]

function TabIcon({ id, active }) {
  const stroke = active ? '#8442FF' : '#9C9AA5'
  if (id === 'home')
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
      </svg>
    )
  if (id === 'orders')
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" strokeLinejoin="round" />
        <path d="M9 7h6M9 11h6" strokeLinecap="round" />
      </svg>
    )
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" strokeLinecap="round" />
    </svg>
  )
}

// Bottom navigation, shown on the main tabs (Home / Orders / Profile).
export default function TabBar({ active, onChange, ordersBadge = 0 }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[375px] border-t border-gray-100 bg-white pt-1 pb-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="relative flex flex-1 cursor-pointer flex-col items-center gap-0.5 py-1.5"
          >
            <span className="relative">
              <TabIcon id={tab.id} active={active === tab.id} />
              {tab.id === 'orders' && ordersBadge > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8442FF] px-1 text-[10px] font-semibold text-white">
                  {ordersBadge}
                </span>
              )}
            </span>
            <span className={`text-[11px] ${active === tab.id ? 'font-medium text-[#8442FF]' : 'text-[#9C9AA5]'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
