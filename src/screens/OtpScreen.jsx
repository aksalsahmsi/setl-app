import { useRef, useState } from 'react'
import GradientButton from '../components/GradientButton.jsx'

const OTP_LENGTH = 5

export default function OtpScreen({ onVerify }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const inputsRef = useRef([])

  function handleChange(i, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = digit
    setDigits(next)
    if (digit && i < OTP_LENGTH - 1) inputsRef.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus()
  }

  return (
    <div className="font-poppins flex min-h-screen flex-col bg-white px-4 pt-14">
      {/* Illustration: phone with a check mark */}
      <div className="flex justify-center">
        <div className="relative flex h-32 w-20 items-center justify-center rounded-2xl border-4 border-[#3F3D56]">
          <div className="absolute -top-0 h-2 w-10 rounded-b-lg bg-[#3F3D56]" />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CF0]">
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
              <path d="m2 9 7 7L22 2" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="mt-8 text-center text-xl font-semibold text-black">Enter your OTP</h1>
      <p className="mt-2 text-center text-sm text-[#6B6B6B]">Enter OTP sent to your phone number</p>

      <div className="mt-8 flex h-12 items-center justify-around rounded-xl border-[0.5px] border-[#2790C3] bg-white px-4">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`OTP digit ${i + 1}`}
            className="w-8 border-b border-gray-400 pb-0.5 text-center text-lg text-black outline-none focus:border-[#8442FF]"
          />
        ))}
      </div>

      <GradientButton className="mt-10" onClick={() => onVerify(digits.join(''))}>
        Verify
      </GradientButton>

      <p className="mt-4 text-right text-sm text-black">Didn&apos;t receive OTP?</p>
      <button type="button" className="mt-2 cursor-pointer text-right text-sm text-[#2790C3]">
        Resend OTP
      </button>
    </div>
  )
}
