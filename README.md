# Setl

On-demand home services app for the UAE — book an inspection, receive an offer, and pay,
all in one place. UI converted from the Figma design into React.

## Customer app

1. **Login** — phone number entry (UAE +971), with a provider-mode switch
2. **OTP** — 5-digit verification, auto-submit, resend countdown
3. **Location details** — map, Indoor/outdoor/Villa
4. **Home** — search, promo banner, home services, car services, bottom tab bar
5. **AC cleaning & refilling** — choose how many ACs need refilling/cleaning
6. **Plumber** — inspection-first notice, per-hour providers, previous providers
7. **Providers / Inspection options** — search, ratings, date & time bottom sheet
8. **Checkout** — timing, location, service, payment method, voucher, order summary
9. **Order tracking** — inspection progress, then the inspector's proposed
   products appear with market price ranges; accept (pay) or reject (with reason)
10. **My Orders** — status per order (In progress / Scheduled / Completed / Rejected)
11. **Profile** — account info, settings, logout

## Provider app (onboarding)

1. **Choose Service** — multi-select service grid with search
2. **Range of availability** — coverage radius on the map
3. **Time slots** — working hours for each weekday

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- No router — screens are switched with React state in `src/App.jsx`

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173 (looks best in a mobile viewport, 375px wide).

## Project structure

```
src/
  components/   shared UI (buttons, header, provider card, date/time sheet, logo)
  screens/      one file per app screen
  data/         providers, dates, times, prices
  App.jsx       screen navigation + shared state
```
