// Provider data shown in the lists. Colors are used for the logo avatar circles.
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
