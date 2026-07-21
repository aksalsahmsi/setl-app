// Stylized map placeholder (like the Figma mockup) — later replaced by a real
// map SDK. Optionally draws a coverage circle around the pin.
export default function FakeMap({ className = '', coverage = false }) {
  return (
    <div className={`relative overflow-hidden bg-[#F4F3F6] ${className}`}>
      <svg viewBox="0 0 375 260" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* roads */}
        <g stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round">
          <path d="M-10 60 C 80 40, 150 90, 240 70 S 380 40, 400 60" />
          <path d="M40 -10 C 60 60, 30 140, 70 200 S 90 260, 80 280" />
          <path d="M-10 170 C 90 150, 180 200, 280 180 S 380 150, 400 170" />
          <path d="M200 -10 C 210 60, 180 120, 220 190 S 240 250, 230 280" />
          <path d="M300 -10 C 320 70, 280 140, 330 220" />
        </g>
        <g stroke="#E4E2E8" strokeWidth="2" strokeDasharray="5 5" fill="none">
          <path d="M0 110 C 100 95, 200 130, 375 110" />
          <path d="M120 0 C 130 80, 100 180, 140 260" />
        </g>
        <text x="90" y="130" fill="#B9B7BF" fontSize="11" fontFamily="sans-serif" letterSpacing="2">
          UNION
        </text>
        <text x="255" y="220" fill="#B9B7BF" fontSize="10" fontFamily="sans-serif" letterSpacing="1">
          STREET
        </text>

        {coverage && <circle cx="187" cy="130" r="95" fill="#8442FF" opacity="0.12" />}

        {/* pin */}
        <circle cx="187" cy="150" r="26" fill="#000" opacity="0.08" />
        <path
          d="M187 100a22 22 0 0 1 22 22c0 15-22 36-22 36s-22-21-22-36a22 22 0 0 1 22-22Z"
          fill="#7C3AED"
        />
        <circle cx="187" cy="122" r="8" fill="#fff" />
      </svg>
    </div>
  )
}
