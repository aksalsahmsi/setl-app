// Two-step progress track (Inspection done -> Products/Pay), shared by
// order tracking and the maintenance checkout.
export default function ProgressSteps({ secondLabel, secondActive = false }) {
  return (
    <div className="flex items-center px-2">
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8442FF]">
          <svg width="20" height="15" viewBox="0 0 24 18" fill="none">
            <path d="m2 9 7 7L22 2" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-1 text-sm text-black">Inspection</p>
      </div>
      <div
        className={`mx-1 mb-5 h-1 grow rounded ${
          secondActive ? 'bg-[#8442FF]' : 'bg-gradient-to-r from-[#8442FF] to-gray-300'
        }`}
      />
      <div className="flex flex-col items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-lg ${
            secondActive ? 'bg-[#B15CF3] text-white' : 'border-2 border-gray-300 bg-white text-gray-400'
          }`}
        >
          2
        </div>
        <p className="mt-1 text-sm text-black">{secondLabel}</p>
      </div>
    </div>
  )
}
