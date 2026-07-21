import { useState } from 'react'
import CustomerLogin from './screens/CustomerLogin.jsx'
import OtpScreen from './screens/OtpScreen.jsx'
import LocationScreen from './screens/LocationScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import AcServiceScreen from './screens/AcServiceScreen.jsx'
import ProvidersScreen from './screens/ProvidersScreen.jsx'
import OrderDetailsScreen from './screens/OrderDetailsScreen.jsx'
import OrderTrackingScreen from './screens/OrderTrackingScreen.jsx'
import RejectReasonScreen from './screens/RejectReasonScreen.jsx'
import SuccessScreen from './screens/SuccessScreen.jsx'
import OrdersScreen from './screens/OrdersScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import ChooseServiceScreen from './screens/provider/ChooseServiceScreen.jsx'
import CoverageScreen from './screens/provider/CoverageScreen.jsx'
import TimeSlotsScreen from './screens/provider/TimeSlotsScreen.jsx'
import ProviderDoneScreen from './screens/provider/ProviderDoneScreen.jsx'
import TabBar from './components/TabBar.jsx'
import { SERVICES } from './data/providers.js'

const TAB_SCREENS = ['home', 'orders', 'profile']

// Customer flow:
//   login -> otp -> location -> home -> service -> providers -> checkout -> success
//   Inspection: success -> tracking (products arrive) -> accept (checkout) / reject (reason)
// Provider flow (onboarding):
//   login -> otp -> chooseService -> coverage -> timeSlots -> done
function App() {
  const [mode, setMode] = useState('customer') // 'customer' | 'provider'
  const [screen, setScreen] = useState('login')
  const [phone, setPhone] = useState('')
  const [counts, setCounts] = useState({ refill: 1, clean: 1 })
  const [flow, setFlow] = useState({ service: 'ac', variant: 'booking' }) // which provider list is open
  const [booking, setBooking] = useState(null) // { provider, date, time, variant, service, ... }
  const [orders, setOrders] = useState([])
  const [providerProfile, setProviderProfile] = useState({ services: [], range: 15, slots: null })

  function openProviders(service, variant) {
    setFlow({ service, variant })
    setScreen('providers')
  }

  function confirmBooking(service, variant) {
    return (provider, date, time) => {
      setBooking({
        provider,
        date,
        time,
        variant,
        service,
        price: variant === 'inspection' ? provider.inspectionFee : provider.bookingFee,
      })
      setScreen('orderDetails')
    }
  }

  function handlePaid(total) {
    const service = SERVICES[booking.service]
    if (booking.variant === 'inspection') {
      const id = orders.length + 1
      setOrders((o) => [
        ...o,
        {
          id,
          provider: booking.provider,
          date: booking.date,
          time: booking.time,
          service: service.inspectionLabel,
          status: 'In progress',
          total,
        },
      ])
      setBooking({ ...booking, total, orderId: id })
    } else if (booking.variant === 'maintenance') {
      setOrders((o) =>
        o.map((ord) =>
          ord.id === booking.orderId
            ? { ...ord, status: 'Completed', service: service.maintenanceLabel, total: ord.total + total }
            : ord,
        ),
      )
      setBooking({ ...booking, total })
    } else {
      setOrders((o) => [
        ...o,
        {
          id: o.length + 1,
          provider: booking.provider,
          date: booking.date,
          time: booking.time,
          service: service.maintenanceLabel,
          status: 'Scheduled',
          total,
        },
      ])
      setBooking({ ...booking, total })
    }
    setScreen('success')
  }

  function handleRejected(reason, note) {
    setOrders((o) =>
      o.map((ord) =>
        ord.id === booking.orderId ? { ...ord, status: 'Rejected', reason, note } : ord,
      ),
    )
    setBooking(null)
    setScreen('orders')
  }

  function logout() {
    setMode('customer')
    setScreen('login')
    setPhone('')
    setCounts({ refill: 1, clean: 1 })
    setBooking(null)
    setOrders([])
    setProviderProfile({ services: [], range: 15, slots: null })
  }

  const screens = {
    login: (
      <CustomerLogin
        asProvider={mode === 'provider'}
        onSwitchMode={() => setMode(mode === 'provider' ? 'customer' : 'provider')}
        onContinue={(p) => {
          setPhone(p)
          setScreen('otp')
        }}
      />
    ),
    otp: <OtpScreen onVerify={() => setScreen(mode === 'provider' ? 'chooseService' : 'location')} />,
    location: <LocationScreen onConfirm={() => setScreen('home')} />,
    home: (
      <HomeScreen
        onOpenService={(target) => {
          // plumber requires an inspection first, so it goes straight to providers
          if (target === 'plumberProviders') openProviders('plumber', 'inspection')
          else setScreen(target)
        }}
      />
    ),
    orders: (
      <OrdersScreen
        orders={orders}
        onOpenOrder={() => setScreen('tracking')}
        onBook={() => setScreen('home')}
      />
    ),
    profile: <ProfileScreen phone={phone} onLogout={logout} />,
    acService: (
      <AcServiceScreen
        counts={counts}
        setCounts={setCounts}
        onSearchProviders={() => openProviders('ac', 'booking')}
        onBookInspection={() => openProviders('ac', 'inspection')}
        onBack={() => setScreen('home')}
      />
    ),
    providers: (
      <ProvidersScreen
        service={flow.service}
        variant={flow.variant}
        onConfirm={confirmBooking(flow.service, flow.variant)}
        onBack={() => setScreen(flow.service === 'ac' ? 'acService' : 'home')}
      />
    ),
    orderDetails: (
      <OrderDetailsScreen
        booking={booking}
        counts={counts}
        onBack={() =>
          setScreen(booking?.variant === 'maintenance' ? 'tracking' : 'providers')
        }
        onReschedule={(date, time) => setBooking({ ...booking, date, time })}
        onChangeProvider={() => setScreen('providers')}
        onPay={handlePaid}
      />
    ),
    tracking: (
      <OrderTrackingScreen
        booking={booking}
        counts={counts}
        onBack={() => setScreen('orders')}
        onProceedToPay={(products) => {
          setBooking({ ...booking, variant: 'maintenance', products })
          setScreen('orderDetails')
        }}
        onReject={() => setScreen('rejectReason')}
      />
    ),
    rejectReason: <RejectReasonScreen onSubmit={handleRejected} onBack={() => setScreen('tracking')} />,
    success: (
      <SuccessScreen
        total={booking?.total}
        variant={booking?.variant}
        onDone={() => setScreen('home')}
        onTrack={() => setScreen('tracking')}
      />
    ),
    // Provider onboarding
    chooseService: (
      <ChooseServiceScreen
        onConfirm={(services) => {
          setProviderProfile({ ...providerProfile, services })
          setScreen('coverage')
        }}
        onBack={() => setScreen('otp')}
      />
    ),
    coverage: (
      <CoverageScreen
        onConfirm={(range) => {
          setProviderProfile((p) => ({ ...p, range }))
          setScreen('timeSlots')
        }}
        onBack={() => setScreen('chooseService')}
      />
    ),
    timeSlots: (
      <TimeSlotsScreen
        onConfirm={(slots) => {
          setProviderProfile((p) => ({ ...p, slots }))
          setScreen('providerDone')
        }}
        onBack={() => setScreen('coverage')}
      />
    ),
    providerDone: (
      <ProviderDoneScreen
        services={providerProfile.services}
        range={providerProfile.range}
        onDone={logout}
      />
    ),
  }

  const activeOrders = orders.filter((o) => o.status === 'In progress').length

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[375px] overflow-hidden bg-white shadow-xl">
      <div key={screen} className="screen-enter">
        {screens[screen]}
      </div>
      {mode === 'customer' && TAB_SCREENS.includes(screen) && (
        <TabBar active={screen} onChange={setScreen} ordersBadge={activeOrders} />
      )}
    </div>
  )
}

export default App
