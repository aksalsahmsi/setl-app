import { useState } from 'react'
import SetlLogo from '../components/SetlLogo.jsx'
import UAEFlag from '../components/UAEFlag.jsx'

export default function CustomerLogin() {
  const [phone, setPhone] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: send the number to the backend / go to the OTP screen
    alert(`Continue with +971 ${phone}`)
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
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            maxLength={9}
            className="font-inter w-full bg-transparent text-[15px] text-black outline-none placeholder:text-[#817777]/70"
          />
        </div>

        <button
          type="submit"
          className="font-inter mt-14 h-[52px] w-full cursor-pointer rounded-xl bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] text-[17px] font-medium text-white active:opacity-90"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
