// Full-width purple gradient button used across the app (matches the Figma design).
// Pass `loading` to show a spinner and block taps (e.g. while a payment processes).
export default function GradientButton({ children, className = '', loading = false, disabled, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-xl bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] text-[17px] font-medium text-white transition-transform duration-100 active:scale-[0.98] active:opacity-90 ${loading ? 'cursor-wait' : 'disabled:cursor-not-allowed disabled:opacity-40'} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        children
      )}
    </button>
  )
}
