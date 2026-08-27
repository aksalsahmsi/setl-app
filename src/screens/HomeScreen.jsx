import ScrollRow from '../components/ScrollRow.jsx'
import { CUSTOMER_ME } from '../data/providers.js'
import acImg from '../assets/ac.png'
import sinkImg from '../assets/sink.png'
import electricImg from '../assets/electric.png'

// The real catalog from the FigJam board — every card opens a working flow.
const HOME_SERVICES = [
  { name: 'AC cleaning & refilling', img: acImg, target: 'acService' },
  { name: 'House cleaning', gradient: 'linear-gradient(135deg,#8442FF,#C05CF7)', target: 'cleaningService' },
  { name: 'Plumber', img: sinkImg, target: 'plumberProviders' },
  { name: 'Electrician', img: electricImg, target: 'options:electrician' },
  { name: 'Technician', gradient: 'linear-gradient(135deg,#B25B0E,#E8A34C)', target: 'options:technician' },
  { name: 'Network technician', gradient: 'linear-gradient(135deg,#1D8FC4,#6BD0F0)', target: 'options:network' },
  { name: 'Curtains', gradient: 'linear-gradient(135deg,#B23A0E,#E88B4C)', target: 'options:curtains' },
  { name: 'Outdoor furniture', gradient: 'linear-gradient(135deg,#3A7D2C,#8FC46B)', target: 'options:outdoor' },
]

const CAR_SERVICES = [
  { name: 'car wash', gradient: 'linear-gradient(135deg,#4B5A68,#1D242B)', target: 'options:carwash' },
]

function ServiceCard({ service, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-40 w-52 shrink-0 overflow-hidden rounded-lg bg-[#EEF0F4] text-left ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={service.gradient ? { background: service.gradient } : undefined}
    >
      {service.img && (
        <img src={service.img} alt="" className="h-full w-full object-contain p-4 pb-10" />
      )}
      <span className="absolute inset-x-0 bottom-0 bg-black/40 px-3 py-2 text-[15px] text-white">
        {service.name}
      </span>
    </button>
  )
}

export default function HomeScreen({ onOpenService }) {
  return (
    <div className="font-poppins flex min-h-screen flex-col bg-[#F2F1F4]">
      {/* Purple gradient header with a rounded bottom (rounded-rectangle band) */}
      <div className="relative shrink-0 brand-header rounded-b-[30px] pt-5 pb-16">
        <div className="flex items-center justify-between px-4">
          <button type="button" aria-label="Menu" className="cursor-pointer p-1">
            <svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
              <path d="M1 2h16M1 10h16M1 18h16" />
              <path d="M23 2h.01M23 10h.01M23 18h.01" />
            </svg>
          </button>
          <button type="button" className="flex cursor-pointer items-center gap-1.5 text-xl font-medium text-white">
            <svg width="18" height="22" viewBox="0 0 18 22" fill="none" stroke="#E4C9FF" strokeWidth="1.8">
              <path d="M9 1a7 7 0 0 1 7 7c0 5-7 12.5-7 12.5S2 13 2 8a7 7 0 0 1 7-7Z" />
              <circle cx="9" cy="8" r="2.5" />
            </svg>
            {CUSTOMER_ME.area}
            <svg width="12" height="8" viewBox="0 0 12 8" fill="#fff"><path d="M6 8 0 0h12L6 8Z" /></svg>
          </button>
          <button type="button" aria-label="Notifications" className="relative cursor-pointer p-1">
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="#fff" strokeWidth="1.8">
              <path d="M11 3a6 6 0 0 1 6 6c0 5 2 6.5 2 6.5H3S5 14 5 9a6 6 0 0 1 6-6ZM9 19.5a2.2 2.2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      {/* Content sheet */}
      <div className="-mt-10 grow rounded-t-[30px] bg-[#F2F1F4] px-4 pt-14 pb-24">
        {/* Search */}
        <div className="flex h-14 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="#9C9AA5" strokeWidth="2">
            <circle cx="9" cy="9" r="6.5" />
            <path d="m14.5 14.5 5 5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Smart home installation"
            className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-[#9C9AA5]"
          />
        </div>

        {/* Intent-first entry (decision D): for the "something's broken" user */}
        <button
          type="button"
          onClick={() => onOpenService('wizard')}
          className="mt-4 flex w-full cursor-pointer items-center justify-between rounded-2xl bg-linear-[110deg,#8442FF,#C05CF7] p-4 text-left text-white shadow-[0_4px_14px_rgba(132,66,255,0.35)] active:scale-[0.99]"
        >
          <span>
            <span className="block text-lg font-semibold">Something broken?</span>
            <span className="mt-0.5 block text-sm text-white/85">
              Get it fixed — answer 2 quick questions
            </span>
          </span>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="m1 1 8 8-8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Promo banner */}
        <div className="mt-4 rounded-2xl bg-linear-[110deg,#9E7BD9,#6C4BB8] p-4 text-white">
          <p className="max-w-[280px] text-[16px] leading-snug">
            Earn 10 dirhams for every friend who orders a favor with your code
          </p>
          <p className="mt-3 text-sm">View all</p>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          </div>
        </div>

        {/* Home services */}
        <section className="mt-5 rounded-2xl bg-white p-4">
          <h2 className="text-xl font-semibold text-black">Home services</h2>
          <ScrollRow className="mt-3">
            {HOME_SERVICES.map((s) => (
              <ServiceCard
                key={s.name}
                service={s}
                onClick={s.target ? () => onOpenService(s.target) : undefined}
              />
            ))}
          </ScrollRow>
        </section>

        {/* Car services */}
        <section className="mt-5 rounded-2xl bg-white p-4">
          <h2 className="text-xl font-semibold text-black">Car services</h2>
          <ScrollRow className="mt-3">
            {CAR_SERVICES.map((s) => (
              <ServiceCard
                key={s.name}
                service={s}
                onClick={s.target ? () => onOpenService(s.target) : undefined}
              />
            ))}
          </ScrollRow>
        </section>
      </div>
    </div>
  )
}
