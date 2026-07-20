import { useState } from 'react'
import CustomerLogin from './screens/CustomerLogin.jsx'
import OtpScreen from './screens/OtpScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import AcServiceScreen from './screens/AcServiceScreen.jsx'
import ProvidersScreen from './screens/ProvidersScreen.jsx'
import OrderDetailsScreen from './screens/OrderDetailsScreen.jsx'
import SuccessScreen from './screens/SuccessScreen.jsx'

// AC customer flow:
// login -> otp -> home -> acService -> providers/inspection -> orderDetails -> success
function App() {
  const [screen, setScreen] = useState('login')
  const [counts, setCounts] = useState({ refill: 1, clean: 1 })
  const [booking, setBooking] = useState(null) // { provider, date, time, price }

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

  const screens = {
    login: <CustomerLogin onContinue={() => setScreen('otp')} />,
    otp: <OtpScreen onVerify={() => setScreen('home')} />,
    home: <HomeScreen onOpenService={() => setScreen('acService')} />,
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
        onBack={() => setScreen(booking?.variant === 'inspection' ? 'inspection' : 'providers')}
        onPay={(total) => {
          setBooking({ ...booking, total })
          setScreen('success')
        }}
      />
    ),
    success: (
      <SuccessScreen
        total={booking?.total}
        variant={booking?.variant}
        onDone={() => setScreen('home')}
      />
    ),
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[375px] overflow-hidden bg-white shadow-xl">
      <div key={screen} className="screen-enter">
        {screens[screen]}
      </div>
    </div>
  )
}

export default App
