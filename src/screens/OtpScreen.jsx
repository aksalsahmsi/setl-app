import { useEffect, useRef, useState } from 'react'
import GradientButton from '../components/GradientButton.jsx'

const OTP_LENGTH = 5
const RESEND_SECONDS = 30

export default function OtpScreen({ onVerify }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resendIn, setResendIn] = useState(RESEND_SECONDS)
  const inputsRef = useRef([])

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  function verify() {
    const code = digits.join('')
    if (code.length < OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit code`)
      return
    }
    setError('')
    setVerifying(true)
    // Simulated verification delay; later this is the backend call
    setTimeout(() => onVerify(code), 700)
  }

  // Auto-submit as soon as the last digit is typed
  useEffect(() => {
    if (!verifying && digits.every((d) => d !== '')) verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits])

  function handleChange(i, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = digit
    setDigits(next)
    setError('')
    if (digit && i < OTP_LENGTH - 1) inputsRef.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus()
  }

  function resend() {
    setDigits(Array(OTP_LENGTH).fill(''))
    setError('')
    setResendIn(RESEND_SECONDS)
    inputsRef.current[0]?.focus()
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
            disabled={verifying}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`OTP digit ${i + 1}`}
            className="w-8 border-b border-gray-400 pb-0.5 text-center text-lg text-black outline-none focus:border-[#8442FF]"
          />
        ))}
      </div>

      {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}

      <GradientButton className="mt-10" loading={verifying} onClick={verify}>
        Verify
      </GradientButton>

      <p className="mt-4 text-right text-sm text-black">Didn&apos;t receive OTP?</p>
      <button
        type="button"
        onClick={resend}
        disabled={resendIn > 0}
        className="mt-1 cursor-pointer py-1 text-right text-sm text-[#2790C3] disabled:cursor-default disabled:text-gray-400"
      >
        {resendIn > 0 ? `Resend OTP (0:${String(resendIn).padStart(2, '0')})` : 'Resend OTP'}
      </button>
    </div>
  )
}
