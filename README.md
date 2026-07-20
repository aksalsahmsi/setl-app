# Setl

On-demand home services app for the UAE — book an inspection, receive an offer, and pay,
all in one place. UI converted from the Figma design into React.

## Screens (AC customer flow)

1. **Login** — phone number entry (UAE +971)
2. **OTP** — 5-digit verification code
3. **Home** — search, promo banner, home services, car services
4. **AC cleaning & refilling** — choose how many ACs need refilling/cleaning
5. **Providers** — search and book a provider directly
6. **Inspection options** — book inspection → approve maintenance → pay
7. **Date & time picker** — bottom sheet for scheduling
8. **Order details** — appointment info, payment method, voucher, order summary
9. **Payment success**

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
