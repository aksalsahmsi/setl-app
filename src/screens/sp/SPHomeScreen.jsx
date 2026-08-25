// Service Provider dashboard: a grid launcher (mockup 30). Each tile opens a
// section; the bottom tab bar (rendered by App) gives quick access.
const TILES = [
  { id: 'spExistingRequests', label: 'Existing requests', icon: 'requests', countKey: 'existing' },
  { id: 'spPreviousRequests', label: 'Previous requests', icon: 'history', countKey: 'previous' },
  { id: 'spServices', label: 'Services', icon: 'services' },
  { id: 'spNotifications', label: 'Notifications', icon: 'bell', countKey: 'notif' },
  { id: 'spEmployees', label: 'Employees', icon: 'team', countKey: 'employees' },
]

function TileIcon({ icon }) {
  const p = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: '#8442FF', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (icon === 'requests') return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
  if (icon === 'history') return <svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 4v4h4M12 8v4l3 2" /></svg>
  if (icon === 'services') return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
  if (icon === 'bell') return <svg {...p}><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
  return <svg {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20c1-3.2 3.5-4.5 5.5-4.5s4.5 1.3 5.5 4.5" /><path d="M16 6.5a3 3 0 0 1 0 5.8M18 20c-.6-2-1.7-3.2-3-3.9" /></svg>
}

export default function SPHomeScreen({ company, counts, onOpen }) {
  return (
    <div className="font-poppins min-h-screen bg-[#F5F4F7] pb-24">
      <div className="brand-header px-4 pt-8 pb-8 text-white">
        <p className="text-xs text-white/80">Service Provider</p>
        <p className="text-xl font-semibold">{company.profile?.name || 'Your company'}</p>
        <p className="mt-0.5 text-sm text-white/85">
          {(company.employees ?? []).length} employees · {(company.services ?? []).length} services
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 pt-6">
        {TILES.map((t) => {
          const count = t.countKey ? counts?.[t.countKey] ?? 0 : 0
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onOpen(t.id)}
              className="relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform duration-100 active:scale-[0.97]"
            >
              {count > 0 && (
                <span className="absolute top-3 right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8442FF] px-1 text-[11px] font-semibold text-white">{count}</span>
              )}
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1ECFB]">
                <TileIcon icon={t.icon} />
              </span>
              <span className="text-sm font-medium text-black">{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
