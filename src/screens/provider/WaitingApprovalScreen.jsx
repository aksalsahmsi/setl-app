import GradientButton from '../../components/GradientButton.jsx'

// After the worker sends an estimate. While the order sits at estimate_ready
// the customer is deciding; when they approve (state → approved) the worker
// gets the green light to start the work. Declined estimates end here too.
export default function WaitingApprovalScreen({ order, onStartWork, onBack }) {
  if (!order) return null
  const approved = order.state === 'approved'
  const declined = ['estimate_declined', 'estimate_expired'].includes(order.state)

  if (approved || declined) {
    return (
      <div className={`font-poppins flex min-h-screen flex-col items-center justify-center px-6 text-center text-white ${approved ? 'bg-linear-[180deg,#C05CF7,#8442FF]' : 'bg-linear-[180deg,#8A8A96,#5B5B66]'}`}>
        <div className="pop-enter flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
          {approved ? (
            <svg width="46" height="36" viewBox="0 0 24 18" fill="none">
              <path className="draw-check" d="m2 9 7 7L22 2" stroke="#8442FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5B5B66" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          )}
        </div>
        <h1 className="mt-6 text-2xl font-semibold">{approved ? 'Customer approved!' : 'Estimate declined'}</h1>
        <p className="mt-2 text-white/90">
          {approved
            ? 'They approved your estimate. Start the work whenever you’re ready.'
            : 'The customer declined this estimate. No further action needed.'}
        </p>
        {approved ? (
          <GradientButton className="mt-10 !bg-white !bg-none !text-[#8442FF]" onClick={() => onStartWork(order)}>
            Start the work
          </GradientButton>
        ) : (
          <button type="button" onClick={onBack} className="mt-10 cursor-pointer rounded-full bg-white px-8 py-3 font-medium text-[#5B5B66]">
            Back to jobs
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="font-poppins flex min-h-screen flex-col items-center justify-center bg-linear-[180deg,#7C3AED,#C05CF7] px-8 text-center">
      <h1 className="text-4xl leading-tight font-bold text-white">
        Waiting for<br />Customer<br />approval
      </h1>
      <div className="mt-8 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/90" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <button type="button" onClick={onBack} className="mt-12 cursor-pointer text-sm text-white/80 underline">
        Back to jobs
      </button>
    </div>
  )
}
