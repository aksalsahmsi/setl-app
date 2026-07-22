import { useEffect, useRef, useState } from 'react'
import GradientHeader from '../components/GradientHeader.jsx'
import GradientButton from '../components/GradientButton.jsx'
import DateTimeSheet from '../components/DateTimeSheet.jsx'
import { SERVICES, getInspectionProducts } from '../data/providers.js'

// Base ballpark for the service: sum the low/high of the typical ranges from
// recent Setl jobs. Each responding pro then quotes a little differently.
function baseRange(serviceKey) {
  const products = getInspectionProducts(serviceKey, { refill: 1, clean: 1 })
  const lo = products.reduce((s, p) => s + (p.market?.[0] ?? 0), 0)
  const hi = products.reduce((s, p) => s + (p.market?.[1] ?? 0), 0)
  return [lo, hi]
}

// Give each responding pro a slightly different quote so the customer has a
// real choice (deterministic per position — no randomness).
const QUOTE_FACTORS = [1.0, 0.88, 1.14]

function proQuotes(serviceKey) {
  const [lo, hi] = baseRange(serviceKey)
  return SERVICES[serviceKey].providers.slice(0, 3).map((p, i) => {
    const f = QUOTE_FACTORS[i] ?? 1
    return { provider: p, lo: Math.round(lo * f), hi: Math.round(hi * f) }
  })
}

// Photo-first triage (inspired by Mahara, and by how people already send
// WhatsApp photos to a handyman): the customer snaps a photo + describes the
// problem; it goes to several pros in that field; the customer chats with a
// pro and books whoever they like — or falls back to a paid inspection.
export default function PhotoTriageScreen({ serviceKey, onChoosePro, onBookInspection, onBack }) {
  const service = SERVICES[serviceKey]
  const [photos, setPhotos] = useState([]) // { url, name }
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('compose') // compose | sending | replied | chat
  const [chatPro, setChatPro] = useState(null) // { provider, lo, hi } being chatted with
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [chosen, setChosen] = useState(null) // pro whose date sheet is open
  const fileRef = useRef(null)

  // Free the object URLs when we leave the screen
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos])

  function addPhotos(fileList) {
    const next = Array.from(fileList)
      .slice(0, 4 - photos.length)
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }))
    setPhotos((p) => [...p, ...next])
  }

  function openChat(q) {
    setChatPro(q)
    setMessages([
      { from: 'me', photos: photos.map((p) => p.url), text: note.trim() },
      {
        from: 'pro',
        text: `Thanks for the photos. A job like this usually runs AED ${q.lo}–${q.hi}. I can confirm the exact price on site — happy to come whenever suits you.`,
      },
    ])
    setStatus('chat')
  }

  function send() {
    const t = draft.trim()
    if (!t) return
    setMessages((m) => [...m, { from: 'me', text: t }])
    setDraft('')
    // Simulated reply so the chat feels alive; later this is the real pro.
    setTimeout(
      () => setMessages((m) => [...m, { from: 'pro', text: 'Sounds good — tap Book and pick a time that works for you.' }]),
      1200,
    )
  }

  const canSend = photos.length > 0 || note.trim().length > 0
  const quotes = proQuotes(serviceKey)

  const headerTitle = status === 'chat' ? chatPro.provider.name : 'Send a pro a photo'
  function handleBack() {
    if (status === 'chat') {
      setStatus('replied')
      setChatPro(null)
    } else onBack()
  }

  return (
    <GradientHeader title={headerTitle} onBack={handleBack}>
      <div className="flex grow flex-col px-4 pt-5 pb-6">
        {status === 'chat' ? (
          <>
            <div className="flex grow flex-col gap-2 overflow-y-auto pb-3">
              {messages.map((m, i) => (
                <div key={i} className={m.from === 'me' ? 'self-end' : 'self-start'}>
                  <div
                    className={`max-w-[240px] rounded-2xl px-3 py-2 text-sm ${
                      m.from === 'me' ? 'bg-[#8442FF] text-white' : 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    {m.photos?.length > 0 && (
                      <div className="mb-1.5 flex flex-wrap gap-1.5">
                        {m.photos.map((url) => (
                          <img key={url} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                    {m.text && <p>{m.text}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Message…"
                className="h-11 grow rounded-full border border-gray-200 px-4 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#8442FF]"
              />
              <button
                type="button"
                onClick={send}
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#8442FF] text-white disabled:opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
                </svg>
              </button>
            </div>

            <GradientButton className="mt-3" onClick={() => setChosen(chatPro)}>
              Book {chatPro.provider.name.split(' ')[0]}
            </GradientButton>
          </>
        ) : status !== 'replied' ? (
          <>
            <h2 className="text-2xl font-semibold text-black">Show us the problem</h2>
            <p className="mt-1 text-sm text-gray-400">
              Add a photo or two and a quick note. We&apos;ll send it to Setl{' '}
              {service.label.toLowerCase()} pros — they reply with a ballpark and you pick who
              comes. No visit needed to start.
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
                setTimeout(() => setStatus('replied'), 2600)
              }}
            >
              Send to pros
            </GradientButton>
            {!canSend && (
              <p className="mt-2 text-center text-xs text-gray-400">
                Add a photo or a short description to send
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-black">{quotes.length} pros replied</h2>
            <p className="mt-1 text-sm text-gray-400">
              Tap a pro to chat, then book whoever you like. The exact price is confirmed on site —
              you pay after the work is done.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {quotes.map((q) => (
                <button
                  key={q.provider.id}
                  type="button"
                  onClick={() => openChat(q)}
                  className="rounded-2xl bg-white p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: q.provider.color }}
                    >
                      {q.provider.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 grow">
                      <p className="truncate font-semibold text-black">{q.provider.name}</p>
                      <p className="text-xs text-gray-400">
                        ★ {q.provider.rating}
                        {q.provider.slots?.[0] ? ` · earliest ${q.provider.slots[0]}` : ''}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-black">
                        AED {q.lo}–{q.hi}
                      </p>
                      <p className="text-[10px] text-gray-400">ballpark</p>
                    </div>
                  </div>
                  <span className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] text-sm font-medium text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
                    </svg>
                    Chat with {q.provider.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-3 text-center text-[11px] text-gray-400">
              Ballparks from recent Setl jobs — not final quotes.
            </p>

            <div className="grow" />

            <button
              type="button"
              onClick={onBookInspection}
              className="mt-4 h-12 w-full cursor-pointer rounded-xl border border-[#8442FF] bg-white text-[15px] font-medium text-[#8442FF] transition-transform duration-100 active:scale-[0.98]"
            >
              Book an inspection instead
            </button>
            <p className="mt-2 text-center text-[11px] text-gray-400">
              Inspection fee is credited toward your repair if you proceed
            </p>
          </>
        )}
      </div>

      {chosen && (
        <DateTimeSheet
          provider={chosen.provider}
          title="Pick a time"
          onClose={() => setChosen(null)}
          onConfirm={({ date, time }) => onChoosePro(chosen.provider, date, time, [chosen.lo, chosen.hi])}
        />
      )}
    </GradientHeader>
  )
}
