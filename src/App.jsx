import CustomerLogin from './screens/CustomerLogin.jsx'

// Phone-sized frame so the app previews nicely on a desktop browser.
// On a real phone (or when packaged as an app) it fills the screen.
function App() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[375px] overflow-hidden bg-white shadow-xl">
      <CustomerLogin />
    </div>
  )
}

export default App
