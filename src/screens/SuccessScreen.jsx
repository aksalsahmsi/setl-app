import SetlLogo from '../components/SetlLogo.jsx'
import GradientButton from '../components/GradientButton.jsx'

export default function SuccessScreen({ total, variant, onDone, onTrack }) {
  const isInspection = variant === 'inspection'
  return (
    <div className="font-poppins flex min-h-screen flex-col items-center justify-center bg-linear-[180deg,#C05CF7,#8442FF] px-6 text-center text-white">
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
      <h1 className="mt-6 text-2xl font-semibold">
        {isInspection ? 'Inspection booked' : 'Payment successful'}
      </h1>
      <p className="mt-2 text-white/90">
        {total} AED paid.{' '}
        {isInspection
          ? 'Your inspector is on the way — the itemized quote will show on your order once the visit is done. The fee is credited toward your repair if you proceed.'
          : 'Your provider is on the way!'}
      </p>
      {isInspection ? (
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
