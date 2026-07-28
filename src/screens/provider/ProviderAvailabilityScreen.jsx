import GradientHeader from '../../components/GradientHeader.jsx'
import { AVAILABILITY_TIMES, defaultAvailability } from '../../data/providers.js'

function Toggle({ on, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${on ? 'bg-[#8442FF]' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

// The worker owns their own availability. The SP sees it live when assigning
// (on-shift + available-now badges), so nobody has to hand-enter everyone's
// hours. A per-day on/off with one or more time windows, plus a real-time
// "Available now" switch for on-demand jobs.
export default function ProviderAvailabilityScreen({ availability, availableNow, onSetAvailability, onSetAvailableNow, onBack }) {
  const days = availability?.length ? availability : defaultAvailability()

  function setDay(i, patch) {
    onSetAvailability(days.map((d, j) => (j === i ? { ...d, ...patch } : d)))
  }
  function toggleDay(i) {
    const d = days[i]
    const windows = d.windows?.length ? d.windows : [{ from: '9:00 AM', to: '6:00 PM' }]
    setDay(i, { on: !d.on, windows })
  }
  function setWindow(i, wi, patch) {
    setDay(i, { windows: days[i].windows.map((w, j) => (j === wi ? { ...w, ...patch } : w)) })
  }
  function addWindow(i) {
    setDay(i, { on: true, windows: [...(days[i].windows ?? []), { from: '9:00 AM', to: '6:00 PM' }] })
  }
  function removeWindow(i, wi) {
    const windows = days[i].windows.filter((_, j) => j !== wi)
    setDay(i, { windows, on: windows.length > 0 })
  }

  const TimeSelect = ({ value, onChange }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-gray-200 px-1.5 py-1 text-xs text-black outline-none focus:border-[#8442FF]">
      {AVAILABILITY_TIMES.map((t) => <option key={t}>{t}</option>)}
    </select>
  )

  return (
    <GradientHeader title="My availability" onBack={onBack} sheetClassName="bg-[#F5F4F7]">
      <div className="font-poppins flex grow flex-col px-4 pb-24">
        {/* Available now */}
        <div className="mt-1 flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="pr-3">
            <p className="font-semibold text-black">Available now</p>
            <p className="mt-0.5 text-xs text-gray-400">
              {availableNow ? "You're online — new jobs can be sent to you." : "You're offline — you won't get new jobs."}
            </p>
          </div>
          <Toggle on={!!availableNow} onClick={() => onSetAvailableNow(!availableNow)} label="Available now" />
        </div>

        {/* Weekly hours */}
        <p className="mt-5 mb-2 px-1 text-sm font-semibold text-gray-500">Weekly hours</p>
        <div className="flex flex-col gap-2.5">
          {days.map((d, i) => (
            <div key={d.day} className="rounded-2xl bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${d.on ? 'text-black' : 'text-gray-400'}`}>{d.day}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{d.on ? 'Working' : 'Off'}</span>
                  <Toggle on={d.on} onClick={() => toggleDay(i)} label={`${d.day} on or off`} />
                </div>
              </div>

              {d.on && (
                <div className="mt-3 flex flex-col gap-2 border-t border-gray-50 pt-3">
                  {(d.windows ?? []).map((w, wi) => (
                    <div key={wi} className="flex items-center gap-2">
                      <TimeSelect value={w.from} onChange={(v) => setWindow(i, wi, { from: v })} />
                      <span className="text-xs text-gray-400">to</span>
                      <TimeSelect value={w.to} onChange={(v) => setWindow(i, wi, { to: v })} />
                      <div className="grow" />
                      <button
                        type="button"
                        onClick={() => removeWindow(i, wi)}
                        aria-label="Remove hours"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addWindow(i)}
                    className="mt-0.5 flex w-fit cursor-pointer items-center gap-1 text-xs font-medium text-[#8442FF]"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    Add hours
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GradientHeader>
  )
}
