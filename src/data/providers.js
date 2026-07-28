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

// Category 1 (hourly, no inspection): individual cleaners the customer can
// browse, view a profile for, book, and set as their regular. Rate is per
// hour. Profile fields (jobsDone, years, languages, verified, bio) power the
// worker-profile screen — the "who's coming into my home" trust piece.
export const CLEANING_PROVIDERS = [
  {
    id: 'cl1',
    name: 'Maria S.',
    bookingFee: 25,
    rating: 4.8,
    color: '#7C3AED',
    perHour: true,
    slots: ['Today 3:00pm', 'Today 5:30pm', 'Tomorrow 9:00am'],
    jobsDone: 214,
    years: 6,
    languages: ['English', 'Arabic'],
    verified: true,
    bio: 'Detail-focused deep cleaning, pet-friendly. Brings her own supplies on request.',
  },
  {
    id: 'cl2',
    name: 'Grace A.',
    bookingFee: 30,
    rating: 4.9,
    color: '#0FA3A3',
    perHour: true,
    slots: ['Today 1:30pm', 'Tomorrow 8:30am', 'Tomorrow 2:00pm'],
    jobsDone: 389,
    years: 8,
    languages: ['English', 'Tagalog'],
    verified: true,
    bio: 'Kitchens and bathrooms are her specialty. Punctual and quiet — great for work-from-home days.',
  },
  {
    id: 'cl3',
    name: 'Aisha K.',
    bookingFee: 22,
    rating: 4.5,
    color: '#E0442B',
    perHour: true,
    slots: ['Tomorrow 10:00am', 'Tomorrow 12:30pm', 'Tomorrow 5:00pm'],
    jobsDone: 127,
    years: 3,
    languages: ['English', 'Arabic', 'Hindi'],
    verified: true,
    bio: 'Friendly and thorough, comfortable with families and villas. Ironing on request.',
  },
]

// Providers for the rest of the catalog (FigJam board): bookingFee is the
// call-out / visit charge shown on the card; selected job options are added
// on top at checkout.
export const TECH_PROVIDERS = [
  { id: 'tc1', name: 'FixIt Technicians', bookingFee: 40, rating: 4.6, color: '#B25B0E', perVisit: true, slots: ['Today 2:30pm', 'Today 6:00pm', 'Tomorrow 10:00am'] },
  { id: 'tc2', name: 'HomeGenie Tech', bookingFee: 35, rating: 4.8, color: '#0E5BB2', perVisit: true, slots: ['Tomorrow 9:00am', 'Tomorrow 1:30pm', 'Tomorrow 6:30pm'] },
  { id: 'tc3', name: 'Repair Hub UAE', bookingFee: 45, rating: 4.4, color: '#5B0EB2', perVisit: true, slots: ['Today 4:45pm', 'Tomorrow 11:15am', 'Tomorrow 3:00pm'] },
]

export const ELECTRICIAN_PROVIDERS = [
  { id: 'el1', name: 'PowerPro Electric', bookingFee: 40, rating: 4.7, color: '#C4A21D', perVisit: true, slots: ['Today 3:15pm', 'Today 7:30pm', 'Tomorrow 9:30am'] },
  { id: 'el2', name: 'Al Noor Electrical', bookingFee: 30, rating: 4.9, color: '#1DC46B', perVisit: true, slots: ['Tomorrow 8:00am', 'Tomorrow 12:00pm', 'Tomorrow 4:00pm'] },
  { id: 'el3', name: 'Spark Masters', bookingFee: 50, rating: 4.5, color: '#C41D50', perVisit: true, slots: ['Today 5:00pm', 'Tomorrow 10:45am', 'Tomorrow 2:30pm'] },
]

export const NETWORK_PROVIDERS = [
  { id: 'nw1', name: 'NetBoost UAE', bookingFee: 35, rating: 4.6, color: '#1D8FC4', perVisit: true, slots: ['Today 1:00pm', 'Today 5:15pm', 'Tomorrow 9:00am'] },
  { id: 'nw2', name: 'WiFi Doctors', bookingFee: 30, rating: 4.8, color: '#7C3AED', perVisit: true, slots: ['Tomorrow 10:00am', 'Tomorrow 2:00pm', 'Tomorrow 6:00pm'] },
]

export const CURTAIN_PROVIDERS = [
  { id: 'cu1', name: 'Emirates Curtains', bookingFee: 30, rating: 4.7, color: '#B23A0E', perVisit: true, slots: ['Today 4:30pm', 'Tomorrow 11:00am', 'Tomorrow 5:00pm'] },
  { id: 'cu2', name: 'Drape & Shade Co', bookingFee: 25, rating: 4.5, color: '#0EA5B2', perVisit: true, slots: ['Tomorrow 9:30am', 'Tomorrow 1:00pm', 'Tomorrow 4:45pm'] },
]

export const OUTDOOR_PROVIDERS = [
  { id: 'of1', name: 'Patio Pros', bookingFee: 35, rating: 4.6, color: '#3A7D2C', perVisit: true, slots: ['Today 3:00pm', 'Tomorrow 10:30am', 'Tomorrow 3:30pm'] },
  { id: 'of2', name: 'Desert Breeze Outdoor', bookingFee: 40, rating: 4.4, color: '#8A5A2B', perVisit: true, slots: ['Tomorrow 8:30am', 'Tomorrow 12:30pm', 'Tomorrow 5:30pm'] },
]

export const CARWASH_PROVIDERS = [
  { id: 'cw1', name: 'Shiny Mobile Wash', bookingFee: 20, rating: 4.8, color: '#1D50C4', perVisit: true, slots: ['Today 1:30pm', 'Today 5:45pm', 'Tomorrow 9:15am'] },
  { id: 'cw2', name: 'EcoWash UAE', bookingFee: 15, rating: 4.6, color: '#1DC4A2', perVisit: true, slots: ['Today 3:45pm', 'Tomorrow 10:15am', 'Tomorrow 2:15pm'] },
  { id: 'cw3', name: 'Desert Shine', bookingFee: 25, rating: 4.7, color: '#C47A1D', perVisit: true, slots: ['Tomorrow 8:45am', 'Tomorrow 1:45pm', 'Tomorrow 6:45pm'] },
]

// What the inspector proposes after the visit, per service.
// market = typical range from recent Setl jobs, shown for transparency.
export function getInspectionProducts(service, counts) {
  if (service === 'plumber') {
    return [
      { name: 'Faucet', qty: 2, price: 50, market: [30, 50], icon: 'faucet' },
      { name: 'Pipe', qty: 1, price: 20, market: [25, 30], icon: 'pipe' },
    ]
  }
  if (service === 'electrician') {
    return [
      { name: 'Wiring repair', qty: 1, price: 120, market: [90, 140] },
      { name: 'Breaker replacement', qty: 1, price: 80, market: [60, 90] },
    ]
  }
  if (service === 'technician') {
    return [
      { name: 'Spare part', qty: 1, price: 150, market: [120, 180] },
      { name: 'Repair labor', qty: 1, price: 100, market: [80, 120] },
    ]
  }
  if (service === 'network') {
    return [
      { name: 'Router replacement', qty: 1, price: 180, market: [150, 220] },
      { name: 'Wi-Fi extender', qty: 1, price: 120, market: [100, 150] },
    ]
  }
  if (service === 'curtains') {
    return [
      { name: 'Track replacement', qty: 1, price: 90, market: [70, 110] },
      { name: 'Motor repair', qty: 1, price: 150, market: [120, 200] },
    ]
  }
  if (service === 'outdoor') {
    return [
      { name: 'Frame parts', qty: 1, price: 110, market: [90, 140] },
      { name: 'Repair labor', qty: 1, price: 120, market: [100, 150] },
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
  // The rest of the board's category-2 services: `options` = jobs the
  // customer can pick when they know what they need (priced on top of the
  // provider's call-out fee); the inspection path covers "not sure".
  technician: {
    label: 'Technician',
    inspectionLabel: 'Technician inspection',
    maintenanceLabel: 'Technician service',
    providers: TECH_PROVIDERS,
    requiresInspection: false,
    pricingModel: 'fixed',
    standardInspectionFee: 25,
    problemArea: 'Appliances & devices',
    symptoms: ['Appliance not turning on', 'TV or screen issue', 'Device needs setup', 'Strange noise or smell', 'Something else'],
    options: [
      { label: 'TV mounting', price: 80 },
      { label: 'Router / device setup', price: 60 },
      { label: 'Smart home device installation', price: 90 },
      { label: 'Appliance check & minor fix', price: 100 },
    ],
    bookingSheetTitle: 'Technician visit',
    listTitle: { booking: 'Technicians', inspection: 'Inspection options' },
  },
  electrician: {
    label: 'Electrician',
    inspectionLabel: 'Electrical inspection',
    maintenanceLabel: 'Electrical service',
    providers: ELECTRICIAN_PROVIDERS,
    requiresInspection: false,
    pricingModel: 'fixed',
    standardInspectionFee: 25,
    problemArea: 'Electrical & lighting',
    symptoms: ['Power outage in a room', 'Breaker keeps tripping', 'Light not working', 'Sparking or burning smell', 'New fixture needed'],
    options: [
      { label: 'Light fixture installation', price: 60 },
      { label: 'Socket or switch replacement', price: 40 },
      { label: 'Ceiling fan installation', price: 90 },
      { label: 'Chandelier installation', price: 150 },
    ],
    bookingSheetTitle: 'Electrician visit',
    listTitle: { booking: 'Electricians', inspection: 'Inspection options' },
  },
  network: {
    label: 'Network technician',
    inspectionLabel: 'Network inspection',
    maintenanceLabel: 'Network service',
    providers: NETWORK_PROVIDERS,
    requiresInspection: false,
    pricingModel: 'fixed',
    standardInspectionFee: 20,
    problemArea: 'Wi-Fi & network',
    symptoms: ['Slow internet', 'Weak signal in some rooms', 'Frequent disconnections', 'New router to set up'],
    options: [
      { label: 'Wi-Fi optimization', price: 100 },
      { label: 'Coverage extension (extender setup)', price: 120 },
      { label: 'New router installation', price: 80 },
    ],
    bookingSheetTitle: 'Network visit',
    listTitle: { booking: 'Network technicians', inspection: 'Inspection options' },
  },
  curtains: {
    label: 'Curtains',
    inspectionLabel: 'Curtains inspection',
    maintenanceLabel: 'Curtains service',
    providers: CURTAIN_PROVIDERS,
    requiresInspection: false,
    pricingModel: 'fixed',
    standardInspectionFee: 20,
    problemArea: 'Curtains & blinds',
    symptoms: ['Curtain motor stuck', 'Track broken or loose', 'New curtains to install', 'Blinds not closing'],
    options: [
      { label: 'Curtain installation (per window)', price: 50 },
      { label: 'Blinds installation (per window)', price: 60 },
      { label: 'Curtain motor setup', price: 150 },
    ],
    bookingSheetTitle: 'Curtains visit',
    listTitle: { booking: 'Curtain fitters', inspection: 'Inspection options' },
  },
  outdoor: {
    label: 'Outdoor furniture',
    inspectionLabel: 'Outdoor furniture inspection',
    maintenanceLabel: 'Outdoor furniture service',
    providers: OUTDOOR_PROVIDERS,
    requiresInspection: false,
    pricingModel: 'fixed',
    standardInspectionFee: 20,
    options: [
      { label: 'Furniture assembly (per item)', price: 70 },
      { label: 'Swing / gazebo assembly', price: 180 },
      { label: 'Furniture repair', price: 90 },
    ],
    bookingSheetTitle: 'Outdoor furniture visit',
    listTitle: { booking: 'Outdoor specialists', inspection: 'Inspection options' },
  },
  // Category 1: direct booking per visit, no inspection
  carwash: {
    label: 'Car wash',
    maintenanceLabel: 'Car wash',
    providers: CARWASH_PROVIDERS,
    requiresInspection: false,
    pricingModel: 'fixed',
    options: [
      { label: 'Sedan wash', price: 30 },
      { label: 'SUV wash', price: 45 },
      { label: 'Interior deep clean', price: 80 },
      { label: 'Full detail', price: 150 },
    ],
    bookingSheetTitle: 'Car wash',
    listTitle: { booking: 'Car wash providers' },
  },
}

// The logged-in worker (provider app). In the sim there's one worker on the
// device; jobs the customer books surface in their New Requests. Later this
// comes from the provider's authenticated account.
export const PROVIDER_ME = {
  id: 'me',
  name: 'Alana Cary',
  trade: 'Plumber',
  tradeKey: 'plumber',
  color: '#7C3AED',
  rating: 4.8,
  jobsDone: 214,
  phone: '501234567',
}

// The customer as the worker sees them (single demo customer on the device).
// Later this is the real customer attached to each order.
export const CUSTOMER_ME = {
  name: 'Ahmed Alshamsi',
  phone: '+971 50 123 4567',
  address: 'Villa 12, Al Nahyan St — Abu Dhabi',
  area: 'Al Nahyan, Abu Dhabi',
}

// Parts/line items a worker can add when building an estimate on site
// (the "Add products" screen). Prices are the default unit price; the worker
// can override. `market` = typical range from recent Setl jobs, reused by the
// customer's ProductCard so the estimate they approve shows the same verdict
// chips. Falls back to a generic list for trades without a specific catalog.
export const PART_CATALOG = {
  plumber: [
    { name: 'Kitchen Faucet', price: 45, icon: 'faucet', market: [30, 50] },
    { name: 'Bathroom Faucet', price: 40, icon: 'faucet', market: [30, 50] },
    { name: 'Water Heater Hose', price: 35, icon: 'pipe', market: [25, 40] },
    { name: 'Pipe (per metre)', price: 20, icon: 'pipe', market: [15, 30] },
    { name: 'Drain unblocking', price: 60, icon: 'pipe', market: [50, 90] },
    { name: 'Mixer valve', price: 55, icon: 'faucet', market: [40, 70] },
  ],
  electrician: [
    { name: 'Wiring repair', price: 120, icon: 'tool', market: [90, 140] },
    { name: 'Breaker replacement', price: 80, icon: 'tool', market: [60, 90] },
    { name: 'Socket / switch', price: 40, icon: 'tool', market: [30, 50] },
    { name: 'Light fixture', price: 60, icon: 'tool', market: [45, 80] },
  ],
  technician: [
    { name: 'Spare part', price: 150, icon: 'tool', market: [120, 180] },
    { name: 'Repair labour', price: 100, icon: 'tool', market: [80, 120] },
    { name: 'Replacement unit', price: 220, icon: 'tool', market: [180, 260] },
  ],
  network: [
    { name: 'Router replacement', price: 180, icon: 'tool', market: [150, 220] },
    { name: 'Wi-Fi extender', price: 120, icon: 'tool', market: [100, 150] },
    { name: 'Cabling (per point)', price: 70, icon: 'tool', market: [50, 90] },
  ],
  curtains: [
    { name: 'Track replacement', price: 90, icon: 'tool', market: [70, 110] },
    { name: 'Motor repair', price: 150, icon: 'tool', market: [120, 200] },
  ],
  outdoor: [
    { name: 'Frame parts', price: 110, icon: 'tool', market: [90, 140] },
    { name: 'Repair labour', price: 120, icon: 'tool', market: [100, 150] },
  ],
  ac: [
    { name: 'AC refilling', price: 40, icon: 'ac', market: [30, 50] },
    { name: 'AC cleaning', price: 40, icon: 'ac', market: [30, 45] },
    { name: 'Compressor part', price: 180, icon: 'ac', market: [150, 220] },
  ],
}

// A worker's on-site parts catalog for their trade (or a generic fallback).
export function getPartCatalog(serviceKey) {
  return (
    PART_CATALOG[serviceKey] ?? [
      { name: 'Replacement part', price: 100, icon: 'tool', market: [80, 120] },
      { name: 'Repair labour', price: 80, icon: 'tool', market: [60, 100] },
    ]
  )
}

// Provider-app onboarding data
export const PROVIDER_SERVICES = [
  'Network Technician',
  'Smart Home Installation',
  'Plumber',
  'Car Cleaning',
  'Pest Control',
  'Electrician',
]

export const WEEK_DAYS = ['Monday', 'Sunday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// ---- Service Provider (company) app ----
// The SP is the business that employs Workers. It onboards by choosing the
// services it offers, adding employees (its workers), giving each a coverage
// range + weekly schedule, and setting company pricing.

export const EMPLOYEE_ROLES = ['Manager', 'Device installer', 'Technician', 'Plumber', 'Electrician', 'Cleaner']

// Avatar circle colors cycled for employee cards.
export const EMPLOYEE_COLORS = ['#7C3AED', '#0FA3A3', '#E0442B', '#2563EB', '#B5820E', '#2E9E4F']

// A company prices the real jobs its trade actually does (not abstract
// difficulty tiers). Each SP service has a default job list with typical
// prices; the SP tweaks the numbers and can add/remove jobs on the Services
// screen. `afterInspection: true` jobs are quoted on site, not upfront.
export const SP_SERVICE_TASKS = {
  Plumber: [
    { label: 'Fix / replace tap or faucet', price: 90 },
    { label: 'Unblock drain or sink', price: 120 },
    { label: 'Fix leaking pipe', price: 100 },
    { label: 'Install / replace water heater', price: 250 },
    { label: 'Fix toilet or flush', price: 150 },
    { label: 'Call-out / inspection', price: 50 },
  ],
  Electrician: [
    { label: 'Light fixture installation', price: 60 },
    { label: 'Socket or switch replacement', price: 40 },
    { label: 'Ceiling fan installation', price: 90 },
    { label: 'Breaker replacement', price: 80 },
    { label: 'Wiring repair', price: 120 },
    { label: 'Call-out / inspection', price: 40 },
  ],
  'Network Technician': [
    { label: 'Wi-Fi optimization', price: 100 },
    { label: 'Coverage extender setup', price: 120 },
    { label: 'New router installation', price: 80 },
    { label: 'New cabling point', price: 70 },
    { label: 'Call-out / inspection', price: 35 },
  ],
  'Smart Home Installation': [
    { label: 'Smart device installation', price: 90 },
    { label: 'Security camera installation', price: 120 },
    { label: 'Smart lock installation', price: 150 },
    { label: 'Full smart-home setup', price: 300 },
    { label: 'Call-out / consultation', price: 50 },
  ],
  'Car Cleaning': [
    { label: 'Sedan wash', price: 30 },
    { label: 'SUV wash', price: 45 },
    { label: 'Interior deep clean', price: 80 },
    { label: 'Full detail', price: 150 },
  ],
  'Pest Control': [
    { label: 'General pest spray', price: 120 },
    { label: 'Cockroach treatment', price: 150 },
    { label: 'Bed bug treatment', price: 300 },
    { label: 'Termite inspection', price: 100 },
  ],
}

// The default job list for a service (a copy, so edits don't mutate the
// template), falling back to a generic list for trades without a specific one.
export function defaultTasksFor(serviceLabel) {
  const tasks = SP_SERVICE_TASKS[serviceLabel] ?? [
    { label: 'Standard job', price: 100 },
    { label: 'Call-out / inspection', price: 50 },
  ]
  return tasks.map((t) => ({ ...t }))
}

// Seed a company's per-service price lists from the templates when it picks
// the services it offers.
export function seedServicePricing(services = []) {
  return services.reduce((acc, s) => ({ ...acc, [s]: defaultTasksFor(s) }), {})
}

// ---- Dispatch matching (SP assign) ----
// The SP collects each worker's coverage radius + weekly schedule in
// onboarding; these helpers put that data to work when assigning a job.

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// There's no real geolocation in the demo, so derive a stable "distance from
// base" for a job from its id (the worker's navigate screen shows the same).
export function jobDistanceKm(order) {
  return 6 + ((order?.id ?? 0) % 10)
}

// Resolve a booking date label ('Today' / 'Tomorrow' / a weekday) to the
// actual weekday name, so it can be matched against a worker's schedule.
export function jobWeekday(order) {
  const label = order?.date?.day
  if (label && DAY_ORDER.includes(label)) return label
  const d = new Date()
  if (label === 'Tomorrow') d.setDate(d.getDate() + 1)
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]
}

// Legacy: does an old block-style schedule include the given weekday?
// (Kept only for companies saved before workers owned their availability.)
function scheduleCoversDay(schedule, weekday) {
  if (!schedule?.length) return true
  const wi = DAY_ORDER.indexOf(weekday)
  return schedule.some((b) => {
    const fi = DAY_ORDER.indexOf(b.from)
    const ti = DAY_ORDER.indexOf(b.to)
    return fi >= 0 && ti >= 0 && fi <= wi && wi <= ti
  })
}

// Is a worker on shift on a given weekday? Workers own their availability (a
// per-day on/off with time windows); fall back to the legacy block schedule,
// then to "flexible" if neither is set.
export function employeeAvailableOn(e, weekday) {
  if (Array.isArray(e?.availability)) {
    const day = e.availability.find((a) => a.day === weekday)
    return day ? !!day.on : false
  }
  return scheduleCoversDay(e?.schedule, weekday)
}

// Annotate a company's workers for a specific job — who covers the area, is
// on shift that day, and is online now — and rank the best matches first.
export function rankWorkersForJob(employees, order) {
  const distanceKm = jobDistanceKm(order)
  const weekday = jobWeekday(order)
  return employees
    .map((e) => {
      const coverage = e.coverage ?? 15
      const inRange = coverage >= distanceKm
      const available = employeeAvailableOn(e, weekday)
      const availableNow = !!e.availableNow
      return {
        ...e,
        coverage,
        distanceKm,
        weekday,
        inRange,
        available,
        availableNow,
        score: (inRange ? 2 : 0) + (available ? 1 : 0) + (availableNow ? 1 : 0),
      }
    })
    .sort((a, b) => b.score - a.score)
}

// Times offered in the availability from/to dropdowns.
export const AVAILABILITY_TIMES = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
  '8:00 PM', '9:00 PM', '10:00 PM',
]

// A fresh worker's default availability: on weekdays 9am–6pm, weekend off.
// One entry per weekday with an on/off flag and one or more time windows —
// workers add/remove windows and toggle days in the worker app.
export function defaultAvailability() {
  return DAY_ORDER.map((day) => ({
    day,
    on: day !== 'Saturday' && day !== 'Sunday',
    windows: [{ from: '9:00 AM', to: '6:00 PM' }],
  }))
}

// A fresh, empty SP company profile the onboarding fills in.
export function emptyCompany() {
  return {
    services: [],
    employees: [],
    profile: { name: '', customerService: '' },
    // Per-service job price lists (keyed by service label), seeded from the
    // templates when the company picks its services.
    servicePricing: {},
  }
}
