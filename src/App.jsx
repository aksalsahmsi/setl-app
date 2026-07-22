import { useEffect, useRef, useState } from 'react'
import CustomerLogin from './screens/CustomerLogin.jsx'
import OtpScreen from './screens/OtpScreen.jsx'
import LocationScreen from './screens/LocationScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import AcServiceScreen from './screens/AcServiceScreen.jsx'
import CleaningServiceScreen from './screens/CleaningServiceScreen.jsx'
import ServiceOptionsScreen from './screens/ServiceOptionsScreen.jsx'
import PhotoTriageScreen from './screens/PhotoTriageScreen.jsx'
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
import WizardScreen from './screens/WizardScreen.jsx'
import { advance, createOrder, isActive, recordEvent, transition } from './data/orders.js'

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
  const [hours, setHours] = useState(2) // hourly services (house cleaning)
  const [serviceOptions, setServiceOptions] = useState([]) // jobs picked on the options screen
  const [flow, setFlow] = useState({ service: 'ac', variant: 'booking' }) // which provider list is open
  const [booking, setBooking] = useState(null) // { provider, date, time, variant, service, ... }
  const [orders, setOrders] = useState([])
  const [successInfo, setSuccessInfo] = useState(null) // { variant, total, credit } for SuccessScreen
  const [payingOrderId, setPayingOrderId] = useState(null) // order open on the invoice screen
  const [providerProfile, setProviderProfile] = useState({ services: [], range: 15, slots: null })
  const [toast, setToast] = useState(null) // simulated push notification { key, text }
  const workTimers = useRef(new Set()) // `${orderId}:${state}` steps already scheduled

  function notify(text) {
    setToast({ key: Date.now(), text })
  }

  // Toasts dismiss themselves (or on tap)
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  // The next move the simulated provider makes from this state (Phase 4:
  // staged, so the lifecycle is visible on Orders). Inspection orders before
  // the estimate are driven by the tracking screen instead. Later all of
  // this comes from the backend / provider app.
  function simStep(ord) {
    if (ord.flowType === 'direct') {
      if (ord.state === 'scheduled') return ['provider_en_route', 4000]
      if (ord.state === 'provider_en_route') return ['in_progress', 4000]
      if (ord.state === 'in_progress') return ['work_done', 5000]
    }
    if (ord.state === 'approved') return ['work_in_progress', 4000]
    if (ord.state === 'work_in_progress') return ['work_done', 5000]
    if (ord.state === 'work_done') return ['awaiting_payment', 1500]
    return null
  }

  useEffect(() => {
    orders.forEach((ord) => {
      const step = simStep(ord)
      if (!step) return
      const key = `${ord.id}:${ord.state}`
      if (workTimers.current.has(key)) return
      workTimers.current.add(key)
      const [next, delay] = step
      setTimeout(() => {
        setOrders((o) =>
          o.map((x) => (x.id === ord.id && x.state === ord.state ? transition(x, next) : x)),
        )
        // Simulated push notifications on the transitions that matter
        if (next === 'provider_en_route') notify(`${ord.provider.name} is on the way`)
        if (next === 'awaiting_payment') notify('Work done — your invoice is ready in Orders')
      }, delay)
    })
  }, [orders])

  // symptoms: what the customer picked in the wizard (travels into the order)
  function openProviders(service, variant, symptoms) {
    setFlow({ service, variant, symptoms })
    setScreen('providers')
  }

  // Photo-first triage: the "not sure what's wrong" path. The pro's remote
  // reply then routes into the normal booking flow for that service.
  function openTriage(service, symptoms) {
    setFlow({ service, variant: 'booking', symptoms })
    setScreen('photoTriage')
  }

  // Proceed to book the repair for a service (used after triage / the wizard's
  // "I know the service"): its options screen, the AC screen, or providers.
  function bookService(service, symptoms) {
    if (service === 'ac') setScreen('acService')
    else if (SERVICES[service].options) {
      setFlow({ service, variant: 'booking', symptoms })
      setScreen('serviceOptions')
    } else openProviders(service, 'booking', symptoms)
  }

  function confirmBooking(service, variant, symptoms) {
    return (provider, date, time) => {
      setBooking({
        provider,
        date,
        time,
        variant,
        service,
        symptoms,
        hours, // used by hourly services (rate x hours at checkout)
        // jobs picked for options-based services (checkout adds the call-out fee)
        options: variant === 'booking' && SERVICES[service].options ? serviceOptions : undefined,
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
        // What the customer reported in the wizard, for the inspector
        meta: booking.symptoms?.length ? { symptoms: booking.symptoms } : undefined,
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
    notify('Your estimate is ready — review and approve it')
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
    setHours(2)
    setServiceOptions([])
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
          else if (target.startsWith('options:')) {
            setFlow({ service: target.slice('options:'.length), variant: 'booking' })
            setScreen('serviceOptions')
          } else setScreen(target)
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
        onBookInspection={() => openTriage('ac')}
        onBack={() => setScreen('home')}
      />
    ),
    wizard: (
      <WizardScreen
        onBack={() => setScreen('home')}
        onRoute={(service, knowsService, symptoms) => {
          // "Yes, I know the service" → book it. "Not sure" → photo triage,
          // except services that always require an inspection (plumber),
          // which go straight to inspection providers.
          if (knowsService) bookService(service, symptoms)
          else if (SERVICES[service].requiresInspection)
            openProviders(service, 'inspection', symptoms)
          else openTriage(service, symptoms)
        }}
      />
    ),
    photoTriage: (
      <PhotoTriageScreen
        serviceKey={flow.service}
        onChoosePro={(provider, date, time, quote) => {
          // Customer picked a pro from the photo replies — book that worker
          // to come; the exact price is confirmed on site, paid after.
          setBooking({
            provider,
            date,
            time,
            variant: 'booking',
            service: flow.service,
            symptoms: flow.symptoms,
            photoQuote: quote,
          })
          setScreen('orderDetails')
        }}
        onBookInspection={() => openProviders(flow.service, 'inspection', flow.symptoms)}
        onBack={() => setScreen('home')}
      />
    ),
    serviceOptions: (
      <ServiceOptionsScreen
        serviceKey={flow.service}
        onSearchProviders={(selected) => {
          setServiceOptions(selected)
          openProviders(flow.service, 'booking', flow.symptoms)
        }}
        onBookInspection={() => openTriage(flow.service, flow.symptoms)}
        onBack={() => setScreen('home')}
      />
    ),
    cleaningService: (
      <CleaningServiceScreen
        hours={hours}
        setHours={setHours}
        onSearchProviders={() => openProviders('cleaning', 'booking')}
        onBack={() => setScreen('home')}
      />
    ),
    providers: (
      <ProvidersScreen
        service={flow.service}
        variant={flow.variant}
        onConfirm={confirmBooking(flow.service, flow.variant, flow.symptoms)}
        onBack={() =>
          setScreen(
            { ac: 'acService', cleaning: 'cleaningService' }[flow.service] ??
              (SERVICES[flow.service].options ? 'serviceOptions' : 'home'),
          )
        }
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
        onOrderEvent={(event, meta) =>
          setOrders((o) =>
            o.map((ord) => (ord.id === booking.orderId ? recordEvent(ord, event, meta) : ord)),
          )
        }
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

  const activeOrders = orders.filter(isActive).length

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[375px] overflow-hidden bg-white shadow-xl">
      <div key={screen} className="screen-enter">
        {screens[screen]}
      </div>
      {/* Simulated push notification (Phase 4) */}
      {toast && (
        <button
          type="button"
          key={toast.key}
          onClick={() => setToast(null)}
          className="pop-enter absolute top-3 left-1/2 z-50 w-[92%] -translate-x-1/2 cursor-pointer rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-[0_6px_24px_rgba(0,0,0,0.18)]"
        >
          <span className="text-[11px] font-semibold text-[#8442FF]">Setl</span>
          <span className="block text-sm text-black">{toast.text}</span>
        </button>
      )}
      {mode === 'customer' && TAB_SCREENS.includes(screen) && (
        <TabBar active={screen} onChange={setScreen} ordersBadge={activeOrders} />
      )}
    </div>
  )
}

export default App
