import SetlLogo from '../components/SetlLogo.jsx'
import GradientButton from '../components/GradientButton.jsx'

export default function SuccessScreen({ total, onDone }) {
  return (
    <div className="font-poppins flex min-h-screen flex-col items-center justify-center bg-linear-[180deg,#C05CF7,#8442FF] px-6 text-center text-white">
      <SetlLogo className="h-[85px] w-[60px]" />
      <h1 className="mt-6 text-2xl font-semibold">Payment successful</h1>
      <p className="mt-2 text-white/90">{total} AED paid. Your provider is on the way!</p>
      <GradientButton className="mt-10 !bg-white !bg-none !text-[#8442FF]" onClick={onDone}>
        Back to home
      </GradientButton>
    </div>
  )
}
