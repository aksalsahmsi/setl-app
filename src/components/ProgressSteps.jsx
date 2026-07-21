import { Fragment } from 'react'

// One consistent 3-step journey track: Inspection -> Products -> Pay.
// `current` is the step the customer is on; earlier steps render as done,
// later ones as not-yet. Filled segments run flush into the circles and
// animate in when the screen mounts.
const STEPS = ['Inspection', 'Products', 'Pay']

export default function ProgressSteps({ current }) {
  const activeIdx = STEPS.indexOf(current)

  return (
    <div className="flex items-start px-3">
      {STEPS.map((label, i) => {
        const done = i < activeIdx
        const active = i === activeIdx
        return (
          <Fragment key={label}>
            {i > 0 && (
              <div className="relative z-0 mx-[-12px] mt-[21px] h-[3px] flex-1 overflow-hidden bg-gray-200">
                {(done || active) && <div className="fill-enter h-full w-full bg-[#8442FF]" />}
              </div>
            )}
            <div className="relative z-10 flex w-16 flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-semibold ${
                  done
                    ? 'bg-[#8442FF] text-white'
                    : active
                      ? 'border-2 border-[#8442FF] bg-white text-[#8442FF]'
                      : 'border-2 border-gray-300 bg-white text-gray-400'
                }`}
              >
                {done ? (
                  <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
                    <path d="m2 9 7 7L22 2" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <p className={`mt-1 text-xs ${active ? 'font-semibold text-black' : 'text-gray-500'}`}>
                {label}
              </p>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
