// Provider data shown in the lists. Colors are used for the logo avatar circles.
// AC providers charge per visit; plumbers charge per hour (perHour: true).
export const PROVIDERS = [
  { id: 1, name: 'Breezcool', inspectionFee: 50, bookingFee: 76, rating: 4.7, color: '#1D7FC4' },
  { id: 2, name: 'Al Imran Technical Sevices', inspectionFee: 20, bookingFee: 50, rating: 4.9, color: '#C43B1D' },
  { id: 3, name: 'pacventac', inspectionFee: 40, bookingFee: 60, rating: 4.7, color: '#5A5A5A' },
  { id: 4, name: 'pacventac', inspectionFee: 40, bookingFee: 45, rating: 4.7, color: '#E0442B' },
  { id: 5, name: 'pacventac', inspectionFee: 40, bookingFee: 76, rating: 4.7, color: '#0FA3A3' },
]

// Next 5 days from the real calendar: Today, Tomorrow, then weekday names.
export function getDates() {
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const day = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : names[d.getDay()]
    return { day, num: d.getDate() }
  })
}

export const TIMES = ['12:00pm', '12:15pm', '12:30pm', '12:45pm', '1:00pm', '1:15pm']

export const AC_PRICE_PER_UNIT = 40

export const PLUMBER_PROVIDERS = [
  { id: 'pl1', name: 'We will fix it', inspectionFee: 20, bookingFee: 20, rating: 4.9, color: '#D9B80E', perHour: true },
  { id: 'pl2', name: 'UltraTec Water Treatment LLC', inspectionFee: 30, bookingFee: 30, rating: 4.2, color: '#2E9E4F', perHour: true },
  { id: 'pl3', name: 'Nu Flow', inspectionFee: 18, bookingFee: 18, rating: 4.7, color: '#1D3F8F', perHour: true },
]

export const PREVIOUS_PROVIDERS = [
  { id: 'pp1', name: 'AAA', color: '#0FA3C4' },
  { id: 'pp2', name: 'UltraTec', color: '#2E9E4F' },
  { id: 'pp3', name: 'We will fix it', color: '#D9B80E' },
]

// What the inspector proposes after the visit, per service.
// market = fair market price range shown to the customer for transparency.
export function getInspectionProducts(service, counts) {
  if (service === 'plumber') {
    return [
      { name: 'Faucet', qty: 2, price: 50, market: [30, 50], icon: 'faucet' },
      { name: 'Pipe', qty: 1, price: 20, market: [25, 30], icon: 'pipe' },
    ]
  }
  const refill = counts?.refill || 1
  const clean = counts?.clean || 1
  return [
    { name: 'AC refilling', qty: refill, price: refill * AC_PRICE_PER_UNIT, market: [30, 50], icon: 'ac' },
    { name: 'AC cleaning', qty: clean, price: clean * AC_PRICE_PER_UNIT, market: [30, 45], icon: 'ac' },
  ].filter((p) => p.qty > 0)
}

export const REJECT_REASONS = ['Poor quality', 'High price', 'I have my own products', 'Something else']

// Everything service-specific in one place. Adding a new service to the
// customer app = adding an entry here (plus its screen for choosing options,
// if it needs one).
export const SERVICES = {
  ac: {
    label: 'AC cleaning & refilling',
    inspectionLabel: 'AC inspection',
    maintenanceLabel: 'AC cleaning & refilling',
    providers: PROVIDERS,
    // AC can be booked directly, so no "inspection first" notice
    requiresInspection: false,
    bookingSheetTitle: 'AC Refilling & Cleaning',
    listTitle: { booking: 'Providers', inspection: 'Inspection options' },
  },
  plumber: {
    label: 'Plumber',
    inspectionLabel: 'Plumber inspection',
    maintenanceLabel: 'Plumbing maintenance',
    providers: PLUMBER_PROVIDERS,
    requiresInspection: true,
    previousProviders: PREVIOUS_PROVIDERS,
    listTitle: { inspection: 'Plumber' },
  },
}

// Provider-app onboarding data
export const PROVIDER_SERVICES = [
  'Part time cleaners',
  'Smart Home Installation',
  'Plumber',
  'Car Cleaning',
  'Pest Control',
  'Electrician',
]

export const WEEK_DAYS = ['Monday', 'Sunday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
