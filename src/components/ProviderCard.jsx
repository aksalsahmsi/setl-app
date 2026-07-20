// White provider card: logo avatar, name, price in AED, yellow rating badge, Book button.
export default function ProviderCard({ provider, price, buttonLabel = 'Book', onBook }) {
  const initials = provider.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
        style={{ background: provider.color }}
      >
        {initials}
      </div>
      <div className="min-w-0 grow">
        <p className="truncate font-semibold text-black">{provider.name}</p>
        <p className="mt-0.5 text-sm text-black">{price} AED</p>
        <button
          type="button"
          onClick={onBook}
          className="mt-1.5 cursor-pointer rounded-full bg-linear-[270deg,#366EE9_-95.36%,#F15CFA_212.48%] px-6 py-1 text-sm text-white active:opacity-90"
        >
          {buttonLabel}
        </button>
      </div>
      <span className="self-start rounded-md bg-[#FCD467] px-2.5 py-1 text-sm font-medium text-black">
        {provider.rating}
      </span>
    </div>
  )
}
