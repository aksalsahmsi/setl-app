import { useState } from 'react'
import CustomerLogin from './screens/CustomerLogin.jsx'
import OtpScreen from './screens/OtpScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import AcServiceScreen from './screens/AcServiceScreen.jsx'
import ProvidersScreen from './screens/ProvidersScreen.jsx'
import OrderDetailsScreen from './screens/OrderDetailsScreen.jsx'
import OrderTrackingScreen from './screens/OrderTrackingScreen.jsx'
import SuccessScreen from './screens/SuccessScreen.jsx'
import OrdersScreen from './screens/OrdersScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import TabBar from './components/TabBar.jsx'

const TAB_SCREENS = ['home', 'orders', 'profile']

// AC customer flow:
// login -> otp -> home -> acService -> providers/inspection -> orderDetails -> success
// After an inspection: success -> tracking (price update arrives) -> orderDetails -> success
function App() {
  const [screen, setScreen] = useState('login')
  const [phone, setPhone] = useState('')
  const [counts, setCounts] = useState({ refill: 1, clean: 1 })
  const [booking, setBooking] = useState(null) // { provider, date, time, variant, price, ... }
  const [orders, setOrders] = useState([])

  function confirmBooking(variant) {
    return (provider, date, time) => {
      setBooking({
        provider,
        date,
        time,
        variant,
        price: variant === 'inspection' ? provider.inspectionFee : provider.bookingFee,
      })
      setScreen('orderDetails')
    }
  }

  function handlePaid(total) {
    if (booking.variant === 'inspection') {
      const id = orders.length + 1
      setOrders((o) => [
        ...o,
        {
          id,
          provider: booking.provider,
          date: booking.date,
          time: booking.time,
          service: 'AC inspection',
          status: 'In progress',
          total,
        },
      ])
      setBooking({ ...booking, total, orderId: id })
    } else if (booking.variant === 'maintenance') {
      setOrders((o) =>
        o.map((ord) =>
          ord.id === booking.orderId
            ? { ...ord, status: 'Completed', service: 'AC cleaning & refilling', total: ord.total + total }
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
          service: 'AC cleaning & refilling',
          status: 'Scheduled',
          total,
        },
      ])
      setBooking({ ...booking, total })
    }
    setScreen('success')
  }

  function logout() {
    setScreen('login')
    setPhone('')
    setCounts({ refill: 1, clean: 1 })
    setBooking(null)
    setOrders([])
  }

  const screens = {
    login: (
      <CustomerLogin
        onContinue={(p) => {
          setPhone(p)
          setScreen('otp')
        }}
      />
    ),
    otp: <OtpScreen onVerify={() => setScreen('home')} />,
    home: <HomeScreen onOpenService={() => setScreen('acService')} />,
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
        onSearchProviders={() => setScreen('providers')}
        onBookInspection={() => setScreen('inspection')}
        onBack={() => setScreen('home')}
      />
    ),
    providers: (
      <ProvidersScreen
        variant="booking"
        onConfirm={confirmBooking('booking')}
        onBack={() => setScreen('acService')}
      />
    ),
    inspection: (
      <ProvidersScreen
        variant="inspection"
        onConfirm={confirmBooking('inspection')}
        onBack={() => setScreen('acService')}
      />
    ),
    orderDetails: (
      <OrderDetailsScreen
        booking={booking}
        counts={counts}
        onBack={() =>
          setScreen(
            booking?.variant === 'maintenance'
              ? 'tracking'
              : booking?.variant === 'inspection'
                ? 'inspection'
                : 'providers',
          )
        }
        onPay={handlePaid}
      />
    ),
    tracking: (
      <OrderTrackingScreen
        booking={booking}
        counts={counts}
        onBack={() => setScreen('orders')}
        onProceedToPay={(found) => {
          setBooking({ ...booking, variant: 'maintenance', found })
          setScreen('orderDetails')
        }}
      />
    ),
    success: (
      <SuccessScreen
        total={booking?.total}
        variant={booking?.variant}
        onDone={() => setScreen('home')}
        onTrack={() => setScreen('tracking')}
      />
    ),
  }

  const activeOrders = orders.filter((o) => o.status === 'In progress').length

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[375px] overflow-hidden bg-white shadow-xl">
      <div key={screen} className="screen-enter">
        {screens[screen]}
      </div>
      {TAB_SCREENS.includes(screen) && (
        <TabBar active={screen} onChange={setScreen} ordersBadge={activeOrders} />
      )}
    </div>
  )
}

export default App
