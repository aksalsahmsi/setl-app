const TABS = [
  { id: 'providerHome', label: 'Home' },
  { id: 'providerRatings', label: 'Ratings' },
  { id: 'providerNotifications', label: 'Notifications' },
  { id: 'providerAccount', label: 'Account' },
]

function TabIcon({ id, active }) {
  const stroke = active ? '#8442FF' : '#9C9AA5'
  if (id === 'providerHome')
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
      </svg>
    )
  if (id === 'providerRatings')
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#8442FF' : 'none'} stroke={stroke} strokeWidth="1.6">
        <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.9 6.2 20.9l1.1-6.45-4.7-4.6 6.5-.95L12 2.5Z" strokeLinejoin="round" />
      </svg>
    )
  if (id === 'providerNotifications')
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" strokeLinejoin="round" />
        <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
      </svg>
    )
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c1-3.2 3.5-4.5 5.5-4.5s4.5 1.3 5.5 4.5" strokeLinecap="round" />
      <path d="M16 6.5a3 3 0 0 1 0 5.8M18 20c-.6-2-1.7-3.2-3-3.9" strokeLinecap="round" />
    </svg>
  )
}

// Bottom navigation for the provider (worker) app.
export default function ProviderTabBar({ active, onChange, requestBadge = 0, notifBadge = 0 }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[375px] border-t border-gray-100 bg-white pt-1 pb-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex">
        {TABS.map((tab) => {
          const badge = tab.id === 'providerHome' ? requestBadge : tab.id === 'providerNotifications' ? notifBadge : 0
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="relative flex flex-1 cursor-pointer flex-col items-center gap-0.5 py-1.5"
            >
              <span className="relative">
                <TabIcon id={tab.id} active={active === tab.id} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8442FF] px-1 text-[10px] font-semibold text-white">
                    {badge}
                  </span>
                )}
              </span>
              <span className={`text-[11px] ${active === tab.id ? 'font-medium text-[#8442FF]' : 'text-[#9C9AA5]'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
