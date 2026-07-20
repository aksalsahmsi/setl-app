import { useState } from 'react'
import SetlLogo from '../components/SetlLogo.jsx'
import UAEFlag from '../components/UAEFlag.jsx'

export default function CustomerLogin({ onContinue }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // UAE mobile numbers: 9 digits starting with 5 (e.g. 501234567)
    if (!/^5\d{8}$/.test(phone)) {
      setError('Please enter a valid UAE mobile number (9 digits, starts with 5)')
      return
    }
    setError('')
    setSending(true)
    // Simulated SMS send delay; later this is the backend call
    setTimeout(() => onContinue(phone), 700)
  }

  return (
    <div className="font-poppins relative min-h-screen w-full bg-white">
      {/* Purple header with the V-shaped bottom edge */}
      <header className="relative">
        <svg
          viewBox="0 0 375 191"
          className="block w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M0 0H375V113L187.5 191L0 113V0Z" fill="#8442FF" />
        </svg>
        <div className="absolute inset-x-0 top-[38%] flex items-center justify-center gap-2">
          <SetlLogo className="h-[85px] w-[60px]" />
          <span className="font-league-spartan pt-3 text-[40px] leading-none font-semibold text-white">
            Setl
          </span>
        </div>
      </header>

      <h1 className="mt-4 text-center text-xl font-semibold tracking-[0.025em] text-black">
        Welcome Back
      </h1>

      <form onSubmit={handleSubmit} className="mt-16 px-4">
        <label htmlFor="phone" className="text-xs tracking-[0.0417em] text-black">
          Enter mobile number
        </label>

        <div className="mt-2 flex h-12 items-center gap-2 rounded-xl border-[0.5px] border-[#2790C3] bg-white px-2">
          <button type="button" className="flex shrink-0 cursor-pointer items-center gap-1">
            <UAEFlag className="h-[22px] w-8" />
            <svg width="9" height="7" viewBox="0 0 9 7" className="fill-black">
              <path d="M4.5 7 0 0h9L4.5 7Z" />
            </svg>
          </button>
          <div className="h-8 w-px shrink-0 bg-black/20" />
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="50*******"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ''))
              setError('')
            }}
            maxLength={9}
            className="font-inter w-full bg-transparent text-[15px] text-black outline-none placeholder:text-[#817777]/70"
          />
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="font-inter mt-14 inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-xl bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] text-[17px] font-medium text-white transition-transform duration-100 active:scale-[0.98] active:opacity-90"
        >
          {sending ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            'Continue'
          )}
        </button>
      </form>
    </div>
  )
}
