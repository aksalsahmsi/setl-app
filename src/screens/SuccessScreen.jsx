import SetlLogo from '../components/SetlLogo.jsx'
import GradientButton from '../components/GradientButton.jsx'

// One success screen, four moments:
//  - inspection:  fee prepaid, inspector on the way (tracking offered)
//  - booking:     direct work confirmed — AED 0 due now (decision B)
//  - maintenance: repair confirmed after the estimate — 0 due, credit noted
//  - paid:        final invoice settled
function content({ variant, total, credit }) {
  if (variant === 'inspection')
    return {
      title: 'Inspection booked',
      body: `${total} AED paid. Your inspector is on the way — the itemized quote will show on your order once the visit is done. The fee is credited toward your repair if you proceed.`,
      track: true,
    }
  if (variant === 'maintenance')
    return {
      title: 'Repair booked',
      body: `AED 0 due now — pay when the work is done. Your ${credit} AED inspection fee is credited on the final invoice.`,
      track: false,
    }
  if (variant === 'paid')
    return {
      title: 'Payment successful',
      body: `${total} AED paid. Thanks for using Setl!`,
      track: false,
    }
  return {
    title: 'Booking confirmed',
    body: 'AED 0 due now — pay when the work is done. The final invoice will appear in your Orders.',
    track: false,
  }
}

export default function SuccessScreen({ variant, total, credit, onDone, onTrack }) {
  const { title, body, track } = content({ variant, total, credit })
  return (
    <div className="font-poppins flex min-h-screen flex-col items-center justify-center brand-splash px-6 text-center text-white">
      <div className="pop-enter flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
        <svg width="46" height="36" viewBox="0 0 24 18" fill="none">
          <path
            className="draw-check"
            d="m2 9 7 7L22 2"
            stroke="#8442FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <SetlLogo className="mt-6 h-[43px] w-[30px]" />
      <h1 className="mt-6 text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-white/90">{body}</p>
      {track ? (
        <>
          <GradientButton className="mt-10 !bg-white !bg-none !text-[#8442FF]" onClick={onTrack}>
            Track your order
          </GradientButton>
          <button type="button" onClick={onDone} className="mt-4 cursor-pointer text-sm text-white/80 underline">
            Back to home
          </button>
        </>
      ) : (
        <GradientButton className="mt-10 !bg-white !bg-none !text-[#8442FF]" onClick={onDone}>
          Back to home
        </GradientButton>
      )}
    </div>
  )
}
