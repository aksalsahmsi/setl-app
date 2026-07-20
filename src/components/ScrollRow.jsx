import { useEffect, useRef, useState } from 'react'

const THUMB = 0.4 // thumb width as a fraction of the track

// Horizontal card row with a slider underneath.
// The purple thumb follows the scroll AND can be dragged (or the track
// tapped) to scroll the cards — like a real slider control.
export default function ScrollRow({ children, className = '' }) {
  const rowRef = useRef(null)
  const trackRef = useRef(null)
  const [progress, setProgress] = useState(0) // 0..1
  const [scrollable, setScrollable] = useState(false)

  function measure() {
    const el = rowRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setScrollable(max > 4)
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Move the row so the thumb lands under the pointer.
  function seek(clientX) {
    const track = trackRef.current
    const el = rowRef.current
    if (!track || !el) return
    const rect = track.getBoundingClientRect()
    let f = (clientX - rect.left) / rect.width
    f = (f - THUMB / 2) / (1 - THUMB) // pointer grabs the middle of the thumb
    f = Math.max(0, Math.min(1, f))
    el.scrollLeft = f * (el.scrollWidth - el.clientWidth)
  }

  function onPointerDown(e) {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    if (rowRef.current) rowRef.current.style.scrollBehavior = 'auto' // instant while dragging
    seek(e.clientX)
  }

  function onPointerMove(e) {
    if (e.buttons & 1) seek(e.clientX)
  }

  function onPointerUp() {
    if (rowRef.current) rowRef.current.style.scrollBehavior = ''
  }

  return (
    <div>
      <div
        ref={rowRef}
        onScroll={measure}
        className={`no-scrollbar flex gap-3 overflow-x-auto scroll-smooth ${className}`}
      >
        {children}
      </div>
      {scrollable && (
        // py-2 pads the touch target; the visible track is the inner div
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="mx-auto mt-1 w-28 cursor-pointer touch-none py-2"
          role="scrollbar"
          aria-valuenow={Math.round(progress * 100)}
        >
          <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className="absolute h-full rounded-full bg-[#8442FF]"
              style={{ width: `${THUMB * 100}%`, left: `${progress * (1 - THUMB) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
