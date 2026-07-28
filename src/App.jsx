import { useEffect, useRef, useState } from 'react'
import CustomerLogin from './screens/CustomerLogin.jsx'
import OtpScreen from './screens/OtpScreen.jsx'
import LocationScreen from './screens/LocationScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import AcServiceScreen from './screens/AcServiceScreen.jsx'
import CleaningServiceScreen from './screens/CleaningServiceScreen.jsx'
import ServiceOptionsScreen from './screens/ServiceOptionsScreen.jsx'
import PhotoTriageScreen from './screens/PhotoTriageScreen.jsx'
import CleanerProfileScreen from './screens/CleanerProfileScreen.jsx'
import ProvidersScreen from './screens/ProvidersScreen.jsx'
import OrderDetailsScreen from './screens/OrderDetailsScreen.jsx'
import OrderTrackingScreen from './screens/OrderTrackingScreen.jsx'
import InvoiceScreen from './screens/InvoiceScreen.jsx'
import RejectReasonScreen from './screens/RejectReasonScreen.jsx'
import SuccessScreen from './screens/SuccessScreen.jsx'
import OrdersScreen from './screens/OrdersScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import ChooseServiceScreen from './screens/provider/ChooseServiceScreen.jsx'
import ProviderHomeScreen from './screens/provider/ProviderHomeScreen.jsx'
import ProviderOrderScreen from './screens/provider/ProviderOrderScreen.jsx'
import ProviderNavigateScreen from './screens/provider/ProviderNavigateScreen.jsx'
import ProviderJobScreen from './screens/provider/ProviderJobScreen.jsx'
import WaitingApprovalScreen from './screens/provider/WaitingApprovalScreen.jsx'
import ProviderRatingsScreen from './screens/provider/ProviderRatingsScreen.jsx'
import ProviderNotificationsScreen from './screens/provider/ProviderNotificationsScreen.jsx'
import ProviderAccountScreen from './screens/provider/ProviderAccountScreen.jsx'
import SPEmployeesScreen from './screens/sp/SPEmployeesScreen.jsx'
import SPCoverageScreen from './screens/sp/SPCoverageScreen.jsx'
import SPTimeSlotsScreen from './screens/sp/SPTimeSlotsScreen.jsx'
import SPProfileScreen from './screens/sp/SPProfileScreen.jsx'
import SPDoneScreen from './screens/sp/SPDoneScreen.jsx'
import SPHomeScreen from './screens/sp/SPHomeScreen.jsx'
import SPRequestsScreen from './screens/sp/SPRequestsScreen.jsx'
import SPServicesScreen from './screens/sp/SPServicesScreen.jsx'
import SPNotificationsScreen from './screens/sp/SPNotificationsScreen.jsx'
import SPAccountScreen from './screens/sp/SPAccountScreen.jsx'
import TabBar from './components/TabBar.jsx'
import ProviderTabBar from './components/ProviderTabBar.jsx'
import SPTabBar from './components/SPTabBar.jsx'
import { SERVICES, PROVIDER_ME, emptyCompany } from './data/providers.js'
import WizardScreen from './screens/WizardScreen.jsx'
import { advance, createOrder, isActive, recordEvent, seedOrderIds, transition } from './data/orders.js'

const TAB_SCREENS = ['home', 'orders', 'profile']
const PROVIDER_TAB_SCREENS = ['providerHome', 'providerRatings', 'providerNotifications', 'providerAccount']
// SP screens that show the SP bottom tab bar (all but onboarding + SETLed).
const SP_TAB_SCREENS = [
  'spHome', 'spExistingRequests', 'spPreviousRequests', 'spServices', 'spNotifications', 'spEmployeesManage', 'spAccount',
]

// Orders are shared between the customer and provider apps and persisted so
// the two-sided flow survives role-switching (and a reload) on one device.
const ORDERS_KEY = 'setl_orders'
function loadOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    if (Array.isArray(saved)) {
      seedOrderIds(saved)
      return saved
    }
  } catch {
    // ignore corrupt storage
  }
  return []
}

// The Service Provider (company) profile, persisted through onboarding.
const SP_KEY = 'setl_sp_company'
function loadCompany() {
  try {
    const saved = JSON.parse(localStorage.getItem(SP_KEY) || 'null')
    if (saved && typeof saved === 'object') return saved
  } catch {
    // ignore
  }
  return emptyCompany()
}

// Customer flow (pay after completion — decision B):
//   login -> otp -> location -> home -> service -> providers -> confirm (0 due) -> success
//   ... work done (simulated) -> Orders "Awaiting payment" -> final invoice -> paid
//   Inspection: fee prepaid at checkout -> tracking (estimate arrives) ->
//   approve (confirm repair, 0 due) / reject (reason) -> same invoice path
// Worker (provider) app: login -> otp -> providerHome (the SP configures the
// worker, so there's no separate worker self-onboarding).
function App() {
  const [mode, setMode] = useState('customer') // 'customer' | 'provider'
  const [screen, setScreen] = useState('login')
  const [phone, setPhone] = useState('')
  const [counts, setCounts] = useState({ refill: 1, clean: 1 })
  const [hours, setHours] = useState(2) // hourly services (house cleaning)
  const [serviceOptions, setServiceOptions] = useState([]) // jobs picked on the options screen
  // The customer's regular cleaner — persisted so "default" actually sticks
  const [favoriteCleaner, setFavoriteCleaner] = useState(() => {
    try {
      const s = localStorage.getItem('setl_regular_cleaner')
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })
  const [profileCleaner, setProfileCleaner] = useState(null) // cleaner whose profile is open
  const [profileBack, setProfileBack] = useState('providers') // screen to return to from a profile

  function openProfile(cleaner, from) {
    setProfileCleaner(cleaner)
    setProfileBack(from)
    setScreen('cleanerProfile')
  }

  function toggleFavorite(provider) {
    setFavoriteCleaner((cur) => {
      const next = cur?.id === provider.id ? null : provider
      try {
        if (next) localStorage.setItem('setl_regular_cleaner', JSON.stringify(next))
        else localStorage.removeItem('setl_regular_cleaner')
      } catch {
        // ignore storage errors (private mode, etc.)
      }
      return next
    })
  }
  const [flow, setFlow] = useState({ service: 'ac', variant: 'booking' }) // which provider list is open
  const [booking, setBooking] = useState(null) // { provider, date, time, variant, service, ... }
  const [orders, setOrders] = useState(loadOrders)
  const [workerOrderId, setWorkerOrderId] = useState(null) // job the worker has open
  const [company, setCompany] = useState(loadCompany) // Service Provider company
  const [spEmpIndex, setSpEmpIndex] = useState(0) // per-employee onboarding cursor
  const [successInfo, setSuccessInfo] = useState(null) // { variant, total, credit } for SuccessScreen
  const [payingOrderId, setPayingOrderId] = useState(null) // order open on the invoice screen
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

  // Persist orders so the customer/provider hand-off survives role-switching
  // and reloads (the two-sided flow is demoed on one device).
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    } catch {
      // ignore storage errors (private mode, quota)
    }
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem(SP_KEY, JSON.stringify(company))
    } catch {
      // ignore
    }
  }, [company])

  // Residual auto-simulation for orders no human is driving yet. A freshly
  // booked order now WAITS at 'scheduled' — the Service Provider dispatches it
  // to a Worker who drives the lifecycle (autopilot off). This only nudges an
  // order already mid-flight so the demo never gets wedged.
  function simStep(ord) {
    if (ord.flowType === 'direct') {
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
      // A worker has taken this job — the provider app drives it now, not the
      // sim (autopilot flipped off on Accept). Untouched orders still auto-run.
      if (ord.autopilot === false) return
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

  // ---- Provider (worker) app: acting on the shared order ----
  const workerOrder = orders.find((o) => o.id === workerOrderId) ?? null
  // The worker (Alana) sees jobs that are unassigned or assigned to her.
  const workerOrders = orders.filter((o) => !o.assignedName || o.assignedName === PROVIDER_ME.name)
  // The SP employee record that maps to the worker app (links role/company).
  const workerEmployee = company.employees.find((e) => e.name === PROVIDER_ME.name) ?? null
  // Service Provider request lists + grid tile counts.
  const spActive = orders.filter(isActive)
  const spPrevious = orders.filter((o) => !isActive(o))
  const spNotifCount = orders.filter(
    (o) => (o.state === 'scheduled' && !o.assignedName) || o.state === 'estimate_ready' || o.state === 'awaiting_payment',
  ).length
  const spCounts = {
    existing: spActive.length,
    previous: spPrevious.length,
    notif: spNotifCount,
    employees: company.employees.length,
  }

  function updateOrder(id, updater) {
    setOrders((os) => os.map((o) => (o.id === id ? updater(o) : o)))
  }

  // Accept a new request: take it off autopilot (the worker drives it now) and
  // head out to the customer.
  function acceptJob(order) {
    updateOrder(order.id, (o) => ({ ...transition(o, 'provider_en_route'), autopilot: false }))
    setWorkerOrderId(order.id)
    setScreen('providerNavigate')
    notify(`On the way to ${order.service}`)
  }

  function declineJob(order) {
    updateOrder(order.id, (o) => ({ ...transition(o, 'cancelled_by_provider'), autopilot: false }))
    setWorkerOrderId(null)
    setScreen('providerHome')
  }

  function arrivedJob(order) {
    updateOrder(order.id, (o) => transition(o, 'in_progress'))
    setScreen('providerJob')
  }

  // Resume an accepted job from its details screen — go to the right step.
  function continueJob(order) {
    setWorkerOrderId(order.id)
    if (order.state === 'provider_en_route') setScreen('providerNavigate')
    else if (order.state === 'estimate_ready') setScreen('providerWaiting')
    else if (order.state === 'approved') startWork(order)
    else setScreen('providerJob')
  }

  // Inspection done: send the itemized estimate to the customer to approve.
  // The products land on the order so the customer's tracking shows exactly
  // what the worker chose (this replaces the old setTimeout fake estimate).
  function sendEstimate(products) {
    if (!workerOrderId) return
    updateOrder(workerOrderId, (o) => ({ ...transition(o, 'estimate_ready', { products }), products }))
    setScreen('providerWaiting')
    notify('Estimate sent — waiting for the customer')
  }

  // Customer approved (order → approved): worker starts the actual work.
  function startWork(order) {
    updateOrder(order.id, (o) => transition(o, 'work_in_progress'))
    setWorkerOrderId(order.id)
    setScreen('providerJob')
  }

  // Job finished on site. Direct jobs go in_progress → work_done; approved
  // repairs go work_in_progress → work_done. Then it awaits customer payment.
  function completeJob(order) {
    updateOrder(order.id, (o) => transition(transition(o, 'work_done'), 'awaiting_payment'))
    setWorkerOrderId(null)
    setScreen('providerHome')
    notify('Job marked done — customer will be asked to pay')
  }

  function reportJob(order, toState, reason) {
    updateOrder(order.id, (o) => transition(o, toState, { reason }))
    setWorkerOrderId(null)
    setScreen('providerHome')
  }

  function switchToWorker() {
    setMode('provider')
    setWorkerOrderId(null)
    setScreen('providerHome')
  }

  function switchToCustomer() {
    setMode('customer')
    setScreen('home')
  }

  function switchToSP() {
    setMode('sp')
    setScreen(company.employees.length ? 'spHome' : 'spChooseService')
  }

  // ---- Service Provider (company) onboarding + dispatch ----
  function setEmployee(index, patch) {
    setCompany((c) => ({ ...c, employees: c.employees.map((e, i) => (i === index ? { ...e, ...patch } : e)) }))
  }

  // Assign an incoming customer job to one of the company's workers. It then
  // surfaces in that worker's New Requests (Alana's app in this demo). Taken
  // off autopilot so the worker — not the sim — drives it.
  function assignJob(orderId, employee) {
    updateOrder(orderId, (o) => ({ ...o, assignedTo: employee.id, assignedName: employee.name, autopilot: false }))
    notify(`Assigned to ${employee.name}`)
  }

  function logout() {
    setMode('customer')
    setScreen('login')
    setWorkerOrderId(null)
    setCompany(emptyCompany())
    setSpEmpIndex(0)
    setPhone('')
    setCounts({ refill: 1, clean: 1 })
    setHours(2)
    setServiceOptions([])
    setFavoriteCleaner(null)
    setProfileCleaner(null)
    try {
      localStorage.removeItem('setl_regular_cleaner')
    } catch {
      // ignore
    }
    setBooking(null)
    setOrders([])
    setSuccessInfo(null)
    setPayingOrderId(null)
    workTimers.current = new Set()
  }

  const screens = {
    login: (
      <CustomerLogin
        asProvider={mode !== 'customer'}
        onSwitchMode={() => setMode(mode === 'customer' ? 'sp' : 'customer')}
        onContinue={(p) => {
          setPhone(p)
          setScreen('otp')
        }}
      />
    ),
    otp: (
      <OtpScreen
        onVerify={() =>
          setScreen(
            mode === 'sp'
              ? company.employees.length
                ? 'spHome'
                : 'spChooseService'
              : mode === 'provider'
                ? 'providerHome'
                : 'location',
          )
        }
      />
    ),
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
            // Rebuild the tracking context from the live order (so tracking
            // works whether reached from booking or from the Orders list).
            setBooking({
              provider: order.provider,
              date: order.date,
              time: order.time,
              variant: order.flowType === 'inspection' ? 'inspection' : 'booking',
              service: order.serviceKey,
              symptoms: order.history?.find((h) => h.meta?.symptoms)?.meta?.symptoms,
              orderId: order.id,
              price: order.total,
            })
            setScreen('tracking')
          }
        }}
        onBook={() => setScreen('home')}
      />
    ),
    profile: <ProfileScreen phone={phone} onSwitchMode={switchToSP} onLogout={logout} />,
    acService: (
      <AcServiceScreen
        counts={counts}
        setCounts={setCounts}
        onSearchProviders={() => openProviders('ac', 'booking')}
        onSendPhoto={() => openTriage('ac')}
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
        onSendPhoto={() => openTriage(flow.service, flow.symptoms)}
        onBack={() => setScreen('home')}
      />
    ),
    cleaningService: (
      <CleaningServiceScreen
        hours={hours}
        setHours={setHours}
        favorite={favoriteCleaner}
        onRebook={(provider, date, time) => confirmBooking('cleaning', 'booking')(provider, date, time)}
        onClearFavorite={() => toggleFavorite(favoriteCleaner)}
        onOpenProfile={(cleaner) => openProfile(cleaner, 'cleaningService')}
        onSearchProviders={() => openProviders('cleaning', 'booking')}
        onBack={() => setScreen('home')}
      />
    ),
    cleanerProfile: profileCleaner && (
      <CleanerProfileScreen
        cleaner={profileCleaner}
        hours={hours}
        isFavorite={favoriteCleaner?.id === profileCleaner.id}
        onToggleFavorite={() => toggleFavorite(profileCleaner)}
        onBook={(cleaner, date, time) => confirmBooking('cleaning', 'booking')(cleaner, date, time)}
        onBack={() => setScreen(profileBack)}
      />
    ),
    providers: (
      <ProvidersScreen
        service={flow.service}
        variant={flow.variant}
        onConfirm={confirmBooking(flow.service, flow.variant, flow.symptoms)}
        favoriteId={favoriteCleaner?.id}
        onToggleFavorite={flow.service === 'cleaning' && flow.variant === 'booking' ? toggleFavorite : undefined}
        onOpenProfile={
          flow.service === 'cleaning' && flow.variant === 'booking'
            ? (cleaner) => openProfile(cleaner, 'providers')
            : undefined
        }
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
        order={orders.find((o) => o.id === booking?.orderId) ?? null}
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
    // Provider (worker) app
    providerHome: (
      <ProviderHomeScreen
        orders={workerOrders}
        employee={workerEmployee}
        companyName={company.profile?.name}
        onOpenOrder={(order) => {
          setWorkerOrderId(order.id)
          setScreen('providerOrder')
        }}
      />
    ),
    providerOrder: (
      <ProviderOrderScreen
        order={workerOrder}
        onAccept={acceptJob}
        onDecline={declineJob}
        onContinue={continueJob}
        onBack={() => setScreen('providerHome')}
      />
    ),
    providerNavigate: (
      <ProviderNavigateScreen
        order={workerOrder}
        onArrived={arrivedJob}
        onBack={() => setScreen('providerHome')}
      />
    ),
    providerJob: (
      <ProviderJobScreen
        order={workerOrder}
        onSendEstimate={sendEstimate}
        onDone={completeJob}
        onReport={reportJob}
        onDial={() => notify('Calling the customer…')}
        onBack={() => setScreen('providerHome')}
      />
    ),
    providerWaiting: (
      <WaitingApprovalScreen
        order={workerOrder}
        onStartWork={startWork}
        onBack={() => setScreen('providerHome')}
      />
    ),
    providerRatings: <ProviderRatingsScreen />,
    providerNotifications: <ProviderNotificationsScreen orders={workerOrders} />,
    providerAccount: (
      <ProviderAccountScreen orders={workerOrders} onSwitchToCustomer={switchToCustomer} onLogout={logout} />
    ),
    // Service Provider (company) app
    spChooseService: (
      <ChooseServiceScreen
        onConfirm={(services) => {
          setCompany((c) => ({ ...c, services }))
          setScreen('spEmployees')
        }}
        onBack={() => setScreen('login')}
      />
    ),
    spEmployees: (
      <SPEmployeesScreen
        title={company.services?.[0] ?? 'Employees'}
        employees={company.employees}
        onAdd={(emp) => setCompany((c) => ({ ...c, employees: [...c.employees, emp] }))}
        onRemove={(id) => setCompany((c) => ({ ...c, employees: c.employees.filter((e) => e.id !== id) }))}
        onContinue={() => {
          setSpEmpIndex(0)
          setScreen('spCoverage')
        }}
        onBack={() => setScreen('spChooseService')}
      />
    ),
    spCoverage: (
      <SPCoverageScreen
        employees={company.employees}
        index={spEmpIndex}
        onSet={(i, km) => setEmployee(i, { coverage: km })}
        onApplyAll={(km) => {
          setCompany((c) => ({ ...c, employees: c.employees.map((e) => ({ ...e, coverage: km })) }))
          setSpEmpIndex(0)
          setScreen('spSchedule')
        }}
        onNext={() => {
          if (spEmpIndex < company.employees.length - 1) setSpEmpIndex(spEmpIndex + 1)
          else {
            setSpEmpIndex(0)
            setScreen('spSchedule')
          }
        }}
        onBack={() => setScreen('spEmployees')}
      />
    ),
    spSchedule: (
      <SPTimeSlotsScreen
        employees={company.employees}
        index={spEmpIndex}
        onSet={(i, schedule) => setEmployee(i, { schedule })}
        onApplyAll={(schedule) => {
          setCompany((c) => ({ ...c, employees: c.employees.map((e) => ({ ...e, schedule })) }))
          setScreen('spProfile')
        }}
        onNext={() => {
          if (spEmpIndex < company.employees.length - 1) setSpEmpIndex(spEmpIndex + 1)
          else setScreen('spProfile')
        }}
        onBack={() => setScreen('spCoverage')}
      />
    ),
    spProfile: (
      <SPProfileScreen
        profile={company.profile}
        onDone={(profile) => {
          setCompany((c) => ({ ...c, profile }))
          setScreen('spDone')
        }}
        onBack={() => setScreen('spSchedule')}
      />
    ),
    spDone: <SPDoneScreen onDone={() => setScreen('spHome')} />,
    spHome: <SPHomeScreen company={company} counts={spCounts} onOpen={(tile) => setScreen(tile === 'spEmployees' ? 'spEmployeesManage' : tile)} />,
    spExistingRequests: (
      <SPRequestsScreen
        title="Existing requests"
        heading="Active jobs"
        orders={spActive}
        employees={company.employees}
        onAssign={assignJob}
        onBack={() => setScreen('spHome')}
      />
    ),
    spPreviousRequests: (
      <SPRequestsScreen
        title="Previous requests"
        heading="Completed"
        orders={spPrevious}
        employees={company.employees}
        onAssign={assignJob}
        onBack={() => setScreen('spHome')}
      />
    ),
    spServices: <SPServicesScreen company={company} onBack={() => setScreen('spHome')} />,
    spNotifications: <SPNotificationsScreen orders={orders} onBack={() => setScreen('spHome')} />,
    spEmployeesManage: (
      <SPEmployeesScreen
        title="Employees"
        manage
        employees={company.employees}
        onAdd={(emp) => setCompany((c) => ({ ...c, employees: [...c.employees, emp] }))}
        onRemove={(id) => setCompany((c) => ({ ...c, employees: c.employees.filter((e) => e.id !== id) }))}
        onContinue={() => setScreen('spHome')}
        onBack={() => setScreen('spHome')}
      />
    ),
    spAccount: (
      <SPAccountScreen
        company={company}
        orders={orders}
        onOpenEmployees={() => setScreen('spEmployeesManage')}
        onSwitchCustomer={switchToCustomer}
        onSwitchWorker={switchToWorker}
        onLogout={logout}
      />
    ),
  }

  const activeOrders = orders.filter(isActive).length
  const newRequests = workerOrders.filter((o) => o.state === 'scheduled').length
  const providerAlerts = orders.filter((o) =>
    ['scheduled', 'approved', 'awaiting_payment'].includes(o.state),
  ).length

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
      {mode === 'provider' && PROVIDER_TAB_SCREENS.includes(screen) && (
        <ProviderTabBar
          active={screen}
          onChange={setScreen}
          requestBadge={newRequests}
          notifBadge={providerAlerts}
        />
      )}
      {mode === 'sp' && SP_TAB_SCREENS.includes(screen) && (
        <SPTabBar active={screen} onChange={setScreen} notifBadge={spNotifCount} />
      )}
    </div>
  )
}

export default App
