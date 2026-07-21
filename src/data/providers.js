// Provider data shown in the lists. Colors are used for the logo avatar circles.
// AC providers charge per visit; plumbers charge per hour (perHour: true).
// slots = next free slot + 2 quick alternatives, shown as availability chips
// (hardcoded until providers come from the backend).
export const PROVIDERS = [
  { id: 1, name: 'Breezcool', inspectionFee: 50, bookingFee: 76, rating: 4.7, color: '#1D7FC4', slots: ['Today 4:00pm', 'Today 6:30pm', 'Tomorrow 9:00am'] },
  { id: 2, name: 'Al Imran Technical Sevices', inspectionFee: 20, bookingFee: 50, rating: 4.9, color: '#C43B1D', slots: ['Today 2:15pm', 'Tomorrow 10:00am', 'Tomorrow 4:30pm'] },
  { id: 3, name: 'pacventac', inspectionFee: 40, bookingFee: 60, rating: 4.7, color: '#5A5A5A', slots: ['Tomorrow 9:00am', 'Tomorrow 11:30am', 'Tomorrow 2:00pm'] },
  { id: 4, name: 'pacventac', inspectionFee: 40, bookingFee: 45, rating: 4.7, color: '#E0442B', slots: ['Today 5:45pm', 'Tomorrow 1:00pm', 'Tomorrow 6:15pm'] },
  { id: 5, name: 'pacventac', inspectionFee: 40, bookingFee: 76, rating: 4.7, color: '#0FA3A3', slots: ['Tomorrow 8:30am', 'Tomorrow 3:00pm', 'Tomorrow 7:45pm'] },
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
  { id: 'pl1', name: 'We will fix it', inspectionFee: 20, bookingFee: 20, rating: 4.9, color: '#D9B80E', perHour: true, slots: ['Today 3:30pm', 'Today 7:00pm', 'Tomorrow 11:00am'] },
  { id: 'pl2', name: 'UltraTec Water Treatment LLC', inspectionFee: 30, bookingFee: 30, rating: 4.2, color: '#2E9E4F', perHour: true, slots: ['Tomorrow 9:15am', 'Tomorrow 2:45pm', 'Tomorrow 5:30pm'] },
  { id: 'pl3', name: 'Nu Flow', inspectionFee: 18, bookingFee: 18, rating: 4.7, color: '#1D3F8F', perHour: true, slots: ['Today 1:45pm', 'Tomorrow 10:30am', 'Tomorrow 4:00pm'] },
]

// Category 1 (hourly, no inspection): rate is per hour.
export const CLEANING_PROVIDERS = [
  { id: 'cl1', name: 'Sparkle Home Cleaning', bookingFee: 25, rating: 4.8, color: '#7C3AED', perHour: true, slots: ['Today 3:00pm', 'Today 5:30pm', 'Tomorrow 9:00am'] },
  { id: 'cl2', name: 'Maid in UAE', bookingFee: 30, rating: 4.9, color: '#0FA3A3', perHour: true, slots: ['Today 1:30pm', 'Tomorrow 8:30am', 'Tomorrow 2:00pm'] },
  { id: 'cl3', name: 'CleanCo Services', bookingFee: 22, rating: 4.5, color: '#E0442B', perHour: true, slots: ['Tomorrow 10:00am', 'Tomorrow 12:30pm', 'Tomorrow 5:00pm'] },
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
//
// Schema (PLAN.md Phase 0):
//   pricingModel          'fixed' (priced per unit upfront) | 'hourly'
//                         (rate x hours, Phase 2) | 'estimate' (price known
//                         only after the inspection)
//   requiresInspection    true = can't book the work directly; an inspection
//                         visit always comes first
//   standardInspectionFee the standardized Setl fee (AED) — decision B says
//                         inspection pricing is ours, not per-provider; the
//                         UI switches from provider.inspectionFee to this in
//                         Phase 1
//   problemArea/symptoms  what the symptom-first wizard (Phase 3) shows for
//                         this service
export const SERVICES = {
  ac: {
    label: 'AC cleaning & refilling',
    inspectionLabel: 'AC inspection',
    maintenanceLabel: 'AC cleaning & refilling',
    providers: PROVIDERS,
    // AC can be booked directly, so no "inspection first" notice
    requiresInspection: false,
    pricingModel: 'fixed',
    standardInspectionFee: 30,
    problemArea: 'AC & cooling',
    symptoms: ['Not cooling', 'Water leaking', 'Bad smell', 'Strange noise', 'Not turning on'],
    bookingSheetTitle: 'AC Refilling & Cleaning',
    listTitle: { booking: 'Providers', inspection: 'Inspection options' },
  },
  plumber: {
    label: 'Plumber',
    inspectionLabel: 'Plumber inspection',
    maintenanceLabel: 'Plumbing maintenance',
    providers: PLUMBER_PROVIDERS,
    requiresInspection: true,
    pricingModel: 'estimate',
    standardInspectionFee: 20,
    problemArea: 'Plumbing & water',
    symptoms: ['Leak or dripping', 'Blocked drain', 'Low water pressure', 'No hot water', 'Bad smell from drain'],
    previousProviders: PREVIOUS_PROVIDERS,
    listTitle: { inspection: 'Plumber' },
  },
  // Category 1: hourly, booked directly, no inspection offered (so no
  // inspectionLabel / standardInspectionFee)
  cleaning: {
    label: 'House cleaning',
    maintenanceLabel: 'House cleaning',
    providers: CLEANING_PROVIDERS,
    requiresInspection: false,
    pricingModel: 'hourly',
    bookingSheetTitle: 'House cleaning',
    listTitle: { booking: 'Cleaning providers' },
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
