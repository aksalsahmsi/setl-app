import { useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import { SERVICES } from '../data/providers.js'

// Areas the wizard offers — derived from every SERVICES entry that declares
// a problemArea (all real, bookable services now).
const AREAS = Object.entries(SERVICES)
  .filter(([, s]) => s.problemArea)
  .map(([key, s]) => ({ key, label: s.problemArea }))

// Symptom-first wizard (decision A): problem area -> symptoms -> "Do you
// already know the service you need?". Provider choice only comes after.
// Selected symptoms travel with the booking into the order history.
export default function WizardScreen({ onRoute, onBack }) {
  const [step, setStep] = useState(0) // 0 area, 1 symptoms, 2 know-the-service
  const [area, setArea] = useState(null) // SERVICES key
  const [symptoms, setSymptoms] = useState(() => new Set())

  const service = area ? SERVICES[area] : null

  function toggleSymptom(s) {
    const next = new Set(symptoms)
    if (next.has(s)) next.delete(s)
    else next.add(s)
    setSymptoms(next)
  }

  return (
    <GradientHeader title="Get it fixed" onBack={step === 0 ? onBack : () => setStep(step - 1)}>
      <div className="flex grow flex-col px-4 pt-5 pb-6">
        {step === 0 && (
          <>
            <h2 className="text-2xl font-semibold text-black">Where&apos;s the problem?</h2>
            <div className="mt-4 flex flex-col gap-3">
              {AREAS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => {
                    setArea(a.key)
                    setSymptoms(new Set())
                    setStep(1)
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left text-[15px] text-black active:border-[#8442FF]"
                >
                  {a.label}
                  <svg width="8" height="14" viewBox="0 0 10 18" fill="none">
                    <path d="m1 1 7 8-7 8" stroke="#9C9AA5" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold text-black">What&apos;s happening?</h2>
            <p className="mt-1 text-sm text-gray-400">
              Pick everything that applies — it helps your provider come prepared.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              {service.symptoms.map((s) => (
                <label
                  key={s}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 text-[15px] text-black has-[:checked]:border-[#8442FF]"
                >
                  <input
                    type="checkbox"
                    checked={symptoms.has(s)}
                    onChange={() => toggleSymptom(s)}
                    className="h-5 w-5 accent-[#8442FF]"
                  />
                  {s}
                </label>
              ))}
            </div>
            <div className="grow" />
            <GradientButton onClick={() => setStep(2)}>Continue</GradientButton>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-3 cursor-pointer text-center text-sm text-gray-400 underline"
            >
              Skip — not sure what to pick
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Canonical diagnosis question (PLAN.md copy standards) */}
            <h2 className="text-2xl font-semibold text-black">
              Do you already know the service you need?
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onRoute(area, true, [...symptoms])}
                className="cursor-pointer rounded-xl border border-[#8442FF] bg-white p-4 text-left active:scale-[0.99]"
              >
                <span className="block text-[16px] font-medium text-[#8442FF]">
                  Yes — choose the service
                </span>
                <span className="mt-0.5 block text-xs text-gray-400">
                  {service.requiresInspection
                    ? 'This service starts with an inspection visit'
                    : 'Pick exactly what you need and book directly'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onRoute(area, false, [...symptoms])}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 text-left active:scale-[0.99]"
              >
                <span className="block text-[16px] font-medium text-black">
                  {service.requiresInspection ? 'Not sure — book an inspection' : 'Not sure — send a pro a photo'}
                </span>
                <span className="mt-0.5 block text-xs text-gray-400">
                  {service.requiresInspection
                    ? 'Standardized fee, credited toward your repair if you proceed'
                    : 'Get a ballpark from real pros — no visit needed to start'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </GradientHeader>
  )
}
