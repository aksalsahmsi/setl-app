import { useEffect, useRef, useState } from 'react'

// Horizontal card row with a small slide indicator underneath
// (the purple thumb moves as you scroll).
export default function ScrollRow({ children, className = '' }) {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0) // 0..1
  const [scrollable, setScrollable] = useState(false)

  function measure() {
    const el = ref.current
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

  return (
    <div>
      <div
        ref={ref}
        onScroll={measure}
        className={`no-scrollbar flex gap-3 overflow-x-auto scroll-smooth ${className}`}
      >
        {children}
      </div>
      {scrollable && (
        <div className="relative mx-auto mt-3 h-1 w-24 overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute h-full w-2/5 rounded-full bg-[#8442FF]"
            style={{ left: `${progress * 60}%` }}
          />
        </div>
      )}
    </div>
  )
}
