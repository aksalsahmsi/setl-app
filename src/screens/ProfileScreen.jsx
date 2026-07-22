const MENU = [
  { id: 'addresses', label: 'My addresses' },
  { id: 'payments', label: 'Payment methods' },
  { id: 'language', label: 'Language', value: 'English' },
  { id: 'help', label: 'Help & support' },
]

export default function ProfileScreen({ phone, onSwitchMode, onLogout }) {
  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F5F4F7] pb-24">
      <div className="bg-linear-[90deg,#C05CF7,#8442FF] px-4 pt-8 pb-10 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/25 text-2xl font-semibold">
            A
          </div>
          <div>
            <p className="text-lg font-semibold">Ahmed Alshamsi</p>
            <p className="text-sm text-white/85">+971 {phone || '501234567'}</p>
          </div>
        </div>
      </div>

      <div className="-mt-5 mx-3 rounded-2xl bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {MENU.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left ${
              i < MENU.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <span className="text-[15px] text-black">{item.label}</span>
            <span className="flex items-center gap-2">
              {item.value && <span className="text-sm text-gray-400">{item.value}</span>}
              <svg width="7" height="12" viewBox="0 0 10 18" fill="none">
                <path d="m1 1 7 8-7 8" stroke="#C9C7D1" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {onSwitchMode && (
        <button
          type="button"
          onClick={onSwitchMode}
          className="mx-3 mt-4 flex cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        >
          <span className="text-[15px] font-medium text-[#8442FF]">Switch to worker app</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8442FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3 4 7l4 4M4 7h13M16 21l4-4-4-4M20 17H7" />
          </svg>
        </button>
      )}

      <button
        type="button"
        onClick={onLogout}
        className="mx-3 mt-3 cursor-pointer rounded-2xl bg-white px-4 py-3.5 text-left text-[15px] text-red-500 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      >
        Log out
      </button>

      <p className="mt-6 text-center text-xs text-gray-300">Setl v0.1.0</p>
    </div>
  )
}
