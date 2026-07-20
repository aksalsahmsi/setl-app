// Full-width purple gradient button used across the app (matches the Figma design).
export default function GradientButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`h-[52px] w-full cursor-pointer rounded-xl bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] text-[17px] font-medium text-white active:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
