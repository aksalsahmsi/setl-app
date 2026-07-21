import SetlLogo from '../../components/SetlLogo.jsx'
import GradientButton from '../../components/GradientButton.jsx'

// End of provider onboarding: profile submitted for verification.
export default function ProviderDoneScreen({ services, range, onDone }) {
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
      <h1 className="mt-6 text-2xl font-semibold">You&apos;re all set!</h1>
      <p className="mt-2 text-white/90">
        Your provider profile — {services.length} {services.length === 1 ? 'service' : 'services'},{' '}
        {range} KM coverage — was submitted. We&apos;ll verify your details and activate your
        account, then job requests will appear here.
      </p>
      <GradientButton className="mt-10 !bg-white !bg-none !text-[#8442FF]" onClick={onDone}>
        Done
      </GradientButton>
    </div>
  )
}
