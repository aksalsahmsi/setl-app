import GradientHeader from '../../components/GradientHeader.jsx'
import GradientButton from '../../components/GradientButton.jsx'

// SP onboarding: review every employee with their weekly schedule before
// setting the company profile.
export default function SPPreviewScreen({ employees, onDone, onBack }) {
  return (
    <GradientHeader title="Preview" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="flex grow flex-col px-4 pb-6">
        <div className="flex flex-col gap-5">
          {employees.map((e) => (
            <div key={e.id} className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: e.color }}>
                  {e.name[0].toUpperCase()}
                </div>
                <p className="mt-2 font-semibold text-black">{e.name}</p>
                <p className="text-xs text-gray-400">{e.role} · {e.coverage ?? 15} KM</p>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {(e.schedule ?? []).map((b, bi) => (
                  <div key={bi} className="rounded-xl bg-linear-[90deg,#EDE4FD,#F6F0FF] p-3">
                    <p className="flex items-center gap-2 text-sm font-medium text-[#8442FF]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" /></svg>
                      {b.from === b.to ? b.from : `${b.from} – ${b.to}`}
                    </p>
                    <div className="mt-1 pl-6">
                      {b.slots.map((s, si) => (
                        <p key={si} className="text-xs text-gray-500">● {s.from} – {s.to}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grow" />
        <GradientButton className="mt-6" onClick={onDone}>Done</GradientButton>
      </div>
    </GradientHeader>
  )
}
