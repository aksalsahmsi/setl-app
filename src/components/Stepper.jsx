const STEPS = [
  { key: 'inspection', label: 'book\ninspection', icon: 'search' },
  { key: 'approve', label: 'approve\nmaintenance', icon: 'check' },
  { key: 'pay', label: 'Pay', icon: 'pay' },
]

function StepIcon({ icon }) {
  if (icon === 'search')
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#8442FF" strokeWidth="1.5">
        <circle cx="9" cy="9" r="6" />
        <path d="m14 14 5 5" strokeLinecap="round" />
      </svg>
    )
  if (icon === 'check')
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#8442FF" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" strokeDasharray="3 2" />
        <path d="m7.5 11 2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  return (
    <svg width="26" height="22" viewBox="0 0 26 22" fill="none" stroke="#8442FF" strokeWidth="1.5">
      <rect x="1" y="5" width="18" height="12" rx="2" />
      <rect x="5" y="2" width="18" height="12" rx="2" fill="#fff" />
      <circle cx="14" cy="8" r="2.5" />
    </svg>
  )
}

// "book inspection — approve maintenance — Pay" progress row.
export default function Stepper() {
  return (
    <div className="flex items-start justify-between px-5 pt-5">
      {STEPS.map((step, i) => (
        <div key={step.key} className="relative flex flex-1 flex-col items-center">
          {i > 0 && (
            <div className="absolute top-[22px] right-1/2 -z-10 h-[3px] w-full translate-x-[-28px] bg-gray-300" />
          )}
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8442FF]/40 bg-white">
            <StepIcon icon={step.icon} />
          </div>
          <p className="mt-1 text-center text-xs whitespace-pre-line text-black">{step.label}</p>
        </div>
      ))}
    </div>
  )
}
