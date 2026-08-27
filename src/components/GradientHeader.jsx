// Purple gradient page header with a centered title, optional back arrow,
// and a white content sheet with big rounded top corners sliding over it.
export default function GradientHeader({ title, onBack, children, sheetClassName = 'bg-white' }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative shrink-0 brand-header rounded-b-[30px] pt-4 pb-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="absolute top-3 left-2 cursor-pointer p-2 text-white"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1 2 9l7 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <h1 className="text-center text-lg font-semibold text-white">{title}</h1>
      </div>
      <div className={`-mt-6 flex grow flex-col rounded-t-[30px] pt-6 ${sheetClassName}`}>
        {children}
      </div>
    </div>
  )
}
