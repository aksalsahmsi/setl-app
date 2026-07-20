// Inline UAE flag so we don't depend on an image file.
export default function UAEFlag({ className = '' }) {
  return (
    <svg
      viewBox="0 0 32 22"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="United Arab Emirates"
    >
      <rect width="32" height="22" rx="3" fill="#fff" />
      <rect width="32" height="7.33" fill="#00843D" rx="3" />
      <rect y="5" width="32" height="4" fill="#00843D" />
      <rect y="14.67" width="32" height="7.33" fill="#000" rx="3" />
      <rect y="13" width="32" height="4" fill="#000" />
      <rect y="7.33" width="32" height="7.34" fill="#fff" />
      <path d="M0 3a3 3 0 0 1 3-3h7v22H3a3 3 0 0 1-3-3V3Z" fill="#EF3340" />
    </svg>
  )
}
