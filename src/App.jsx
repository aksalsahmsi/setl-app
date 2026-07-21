import { useEffect, useRef, useState } from 'react'
import CustomerLogin from './screens/CustomerLogin.jsx'
import OtpScreen from './screens/OtpScreen.jsx'
import LocationScreen from './screens/LocationScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import AcServiceScreen from './screens/AcServiceScreen.jsx'
import ProvidersScreen from './screens/ProvidersScreen.jsx'
import OrderDetailsScreen from './screens/OrderDetailsScreen.jsx'
import OrderTrackingScreen from './screens/OrderTrackingScreen.jsx'
import InvoiceScreen from './screens/InvoiceScreen.jsx'
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
import { advance, createOrder, transition } from './data/orders.js'

const TAB_SCREENS = ['home', 'orders', 'profile']

// Customer flow (pay after completion — decision B):
//   login -> otp -> location -> home -> service -> providers -> confirm (0 due) -> success
//   ... work done (simulated) -> Orders "Awaiting payment" -> final invoice -> paid
//   Inspection: fee prepaid at checkout -> tracking (estimate arrives) ->
//   approve (confirm repair, 0 due) / reject (reason) -> same invoice path
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
  const [successInfo, setSuccessInfo] = useState(null) // { variant, total, credit } for SuccessScreen
  const [payingOrderId, setPayingOrderId] = useState(null) // order open on the invoice screen
  const [providerProfile, setProviderProfile] = useState({ services: [], range: 15, slots: null })
  const workTimers = useRef(new Set()) // order ids with a work-completion sim scheduled

  // Simulated work completion (Phase 1): a while after a direct booking is
  // confirmed (or a repair approved), the provider "finishes" and the order
  // lands in awaiting_payment — paid from the Orders tab. Later this comes
  // from the backend / provider app.
  useEffect(() => {
    orders.forEach((ord) => {
      const path =
        ord.flowType === 'direct' && ord.state === 'scheduled'
          ? ['provider_en_route', 'in_progress', 'work_done', 'awaiting_payment']
          : ord.state === 'approved'
            ? ['work_in_progress', 'work_done', 'awaiting_payment']
            : null
      if (path && !workTimers.current.has(ord.id)) {
        workTimers.current.add(ord.id)
        setTimeout(() => {
          setOrders((o) =>
            o.map((x) =>
              x.id === ord.id && (x.state === 'scheduled' || x.state === 'approved')
                ? advance(x, path)
                : x,
            ),
          )
        }, 8000)
      }
    })
  }, [orders])

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
        // Inspection pricing is Setl's, standardized per service (decision B)
        price:
          variant === 'inspection' ? SERVICES[service].standardInspectionFee : provider.bookingFee,
      })
      setScreen('orderDetails')
    }
  }

  // Checkout finished. Only the inspection variant moves money here; the
  // other two just confirm the booking (AED 0 due now — decision B) and the
  // work-completion sim takes the order to awaiting_payment.
  function handleCheckout(total, { items, discount, inspectionCredit }) {
    const service = SERVICES[booking.service]
    if (booking.variant === 'inspection') {
      const order = createOrder({
        serviceKey: booking.service,
        service: service.inspectionLabel,
        flowType: 'inspection',
        provider: booking.provider,
        date: booking.date,
        time: booking.time,
        total, // fee prepaid here
        items,
      })
      setOrders((o) => [...o, order])
      setBooking({ ...booking, total, orderId: order.id })
      setSuccessInfo({ variant: 'inspection', total })
    } else if (booking.variant === 'maintenance') {
      setOrders((o) =>
        o.map((ord) =>
          ord.id === booking.orderId
            ? {
                ...transition(ord, 'approved', { items, amountDue: total }),
                service: service.maintenanceLabel,
                items,
                discount,
                inspectionCredit,
                amountDue: total,
              }
            : ord,
        ),
      )
      setBooking(null)
      setSuccessInfo({ variant: 'maintenance', credit: inspectionCredit })
    } else {
      const order = createOrder({
        serviceKey: booking.service,
        service: service.maintenanceLabel,
        flowType: 'direct',
        provider: booking.provider,
        date: booking.date,
        time: booking.time,
        total: 0, // nothing paid yet
        items,
        discount,
        amountDue: total,
        meta: { payAfterCompletion: true },
      })
      setOrders((o) => [...o, order])
      setBooking(null)
      setSuccessInfo({ variant: 'booking' })
    }
    setScreen('success')
  }

  // Final invoice settled from the Orders tab.
  function handleInvoicePaid(amount, meta) {
    setOrders((o) =>
      o.map((ord) =>
        ord.id === payingOrderId
          ? { ...transition(ord, 'paid', { amount, ...meta }), total: ord.total + amount }
          : ord,
      ),
    )
    setPayingOrderId(null)
    setSuccessInfo({ variant: 'paid', total: amount })
    setScreen('success')
  }

  // The inspector's estimate arrived (simulated in the tracking screen).
  // Guarded on 'scheduled' so revisiting the screen can't double-advance.
  function handleEstimateReady(products) {
    setOrders((o) =>
      o.map((ord) =>
        ord.id === booking.orderId && ord.state === 'scheduled'
          ? advance(ord, ['provider_en_route', 'in_progress', 'estimate_ready'], { products })
          : ord,
      ),
    )
  }

  function handleRejected(reason, note) {
    setOrders((o) =>
      o.map((ord) =>
        ord.id === booking.orderId ? transition(ord, 'estimate_declined', { reason, note }) : ord,
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
    setSuccessInfo(null)
    setPayingOrderId(null)
    workTimers.current = new Set()
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
        onOpenOrder={(order, action) => {
          if (action === 'pay') {
            setPayingOrderId(order.id)
            setScreen('invoice')
          } else {
            setScreen('tracking')
          }
        }}
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
        onPay={handleCheckout}
      />
    ),
    invoice: payingOrderId && (
      <InvoiceScreen
        order={orders.find((o) => o.id === payingOrderId)}
        onPay={handleInvoicePaid}
        onBack={() => {
          setPayingOrderId(null)
          setScreen('orders')
        }}
      />
    ),
    tracking: (
      <OrderTrackingScreen
        booking={booking}
        counts={counts}
        onBack={() => setScreen('orders')}
        onEstimateReady={handleEstimateReady}
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
        {...(successInfo ?? {})}
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
