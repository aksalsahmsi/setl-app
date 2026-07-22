import { useEffect, useRef, useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import { SERVICES, getInspectionProducts } from '../data/providers.js'

// Rough ballpark for the pro's remote reply: sum the low/high of the typical
// ranges from recent Setl jobs for this service.
function estimateRange(serviceKey) {
  const products = getInspectionProducts(serviceKey, { refill: 1, clean: 1 })
  const lo = products.reduce((s, p) => s + (p.market?.[0] ?? 0), 0)
  const hi = products.reduce((s, p) => s + (p.market?.[1] ?? 0), 0)
  return [lo, hi]
}

// Photo-first triage (inspired by Mahara, and by how people already send
// WhatsApp photos to a handyman): instead of committing to a paid inspection
// visit, the customer snaps a photo + describes the problem, and a pro replies
// remotely with a ballpark and a recommendation. Lighter than an inspection;
// the paid inspection stays available as the fallback.
export default function PhotoTriageScreen({ serviceKey, onBookService, onBookInspection, onBack }) {
  const service = SERVICES[serviceKey]
  const [photos, setPhotos] = useState([]) // { url, name }
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('compose') // compose | sending | replied
  const fileRef = useRef(null)

  // Free the object URLs when we leave the screen
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos])

  function addPhotos(fileList) {
    const next = Array.from(fileList)
      .slice(0, 4 - photos.length)
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }))
    setPhotos((p) => [...p, ...next])
  }

  const canSend = photos.length > 0 || note.trim().length > 0
  const [lo, hi] = estimateRange(serviceKey)

  return (
    <GradientHeader title="Send a pro a photo" onBack={onBack}>
      <div className="flex grow flex-col px-4 pt-5 pb-6">
        {status !== 'replied' ? (
          <>
            <h2 className="text-2xl font-semibold text-black">Show us the problem</h2>
            <p className="mt-1 text-sm text-gray-400">
              Add a photo or two and a quick note. A Setl {service.label.toLowerCase()} pro will
              send you a ballpark — no visit needed to start.
            </p>

            {/* Photo tiles */}
            <div className="mt-4 flex flex-wrap gap-3">
              {photos.map((p) => (
                <div key={p.url} className="relative h-24 w-24 overflow-hidden rounded-xl">
                  <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((list) => list.filter((x) => x.url !== p.url))}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-sm text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
              {photos.length < 4 && status === 'compose' && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="6" width="18" height="14" rx="2" />
                    <path d="M8 6l1.5-2h5L16 6M12 11v5M9.5 13.5h5" />
                  </svg>
                  <span className="text-[11px]">Add photo</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              hidden
              onChange={(e) => {
                addPhotos(e.target.files)
                e.target.value = '' // allow re-selecting the same file
              }}
            />

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              disabled={status === 'sending'}
              placeholder="Describe what's happening — e.g. water pooling under the sink since this morning"
              className="mt-4 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#8442FF] disabled:opacity-60"
            />

            <div className="grow" />

            <GradientButton
              className="mt-4"
              loading={status === 'sending'}
              disabled={!canSend}
              onClick={() => {
                setStatus('sending')
                // Simulated: a pro reviews the photos and replies. Later this
                // is a real message from an available professional.
                setTimeout(() => setStatus('replied'), 2600)
              }}
            >
              Send to a professional
            </GradientButton>
            {!canSend && (
              <p className="mt-2 text-center text-xs text-gray-400">
                Add a photo or a short description to send
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-black">A pro replied</h2>

            {/* The pro's reply */}
            <div className="mt-4 flex gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: service.providers[0].color }}
              >
                {service.providers[0].name[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-black">{service.providers[0].name}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Thanks for the photo. Based on what I can see, a job like this usually runs{' '}
                  <span className="font-semibold text-black">
                    AED {lo}–{hi}
                  </span>
                  . I can confirm the exact price on site. Want me to come do it, or book a full
                  inspection first?
                </p>
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] text-gray-400">
              Ballpark from recent Setl jobs — not a final quote.
            </p>

            <div className="grow" />

            <GradientButton className="mt-4" onClick={onBookService}>
              Book this repair
            </GradientButton>
            <button
              type="button"
              onClick={onBookInspection}
              className="mt-3 h-12 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white text-[15px] font-medium text-[#8442FF] transition-transform duration-100 active:scale-[0.98]"
            >
              Book an inspection instead
            </button>
            <p className="mt-2 text-center text-[11px] text-gray-400">
              Inspection fee is credited toward your repair if you proceed
            </p>
          </>
        )}
      </div>
    </GradientHeader>
  )
}
