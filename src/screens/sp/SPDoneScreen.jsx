import SetlLogo from '../../components/SetlLogo.jsx'

// End of Service Provider onboarding (mockup "Your all SETLed!").
export default function SPDoneScreen({ onDone }) {
  return (
    <button
      type="button"
      onClick={onDone}
      className="font-poppins flex min-h-screen w-full cursor-pointer flex-col items-center justify-center brand-splash px-8 text-center"
    >
      <div className="pop-enter flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
        <svg width="46" height="36" viewBox="0 0 24 18" fill="none">
          <path className="draw-check" d="m2 9 7 7L22 2" stroke="#8442FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <SetlLogo className="mt-8 h-[40px] w-[28px]" />
      <h1 className="mt-6 text-4xl font-bold text-white">Your all<br />SETLed !</h1>
      <p className="mt-4 text-sm text-white/85">Your company is live. Tap to open your dashboard.</p>
    </button>
  )
}
