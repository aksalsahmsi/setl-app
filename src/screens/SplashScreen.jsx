import { useEffect } from 'react'
import SetlLogo from '../components/SetlLogo.jsx'

// The brand splash (Figma screen 1): the full-screen purple->pink gradient with
// the Setl logo, shown briefly on launch before the login screen. Auto-advances
// after a moment, or on tap.
export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1900)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <button
      type="button"
      onClick={onDone}
      aria-label="Continue to Setl"
      className="brand-splash flex min-h-screen w-full cursor-pointer items-center justify-center"
    >
      <div className="pop-enter flex items-center gap-3">
        <SetlLogo className="h-[101px] w-[69px]" />
        <span className="font-league-spartan text-[64px] leading-none font-semibold text-white">
          Setl
        </span>
      </div>
    </button>
  )
}
