# StayEase — Hotel Booking Frontend

A multi-vendor hotel booking platform frontend built with **React 19**, **Vite**, **Redux Toolkit (RTK Query)**, and **Tailwind CSS v4**.

---

## 🚀 Quick Setup

### Prerequisites

- Node.js ≥ 18
- Backend server running at `http://localhost:5000`

### Install & Run

```bash
# From the monorepo root
npm install

# Or from apps/client directly
cd apps/client
npm install
npm run dev
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (default: `http://localhost:5173`) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🔑 Environment Variables

Create an `.env` file in `apps/client/` based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (must end with `/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID from Google Cloud Console |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key from Stripe Dashboard |

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── apiSlice.js          # RTK Query base API (auth headers, credentials)
│   ├── store.js             # Redux store (all reducers + middleware)
│   └── App.jsx              # Root component (Navbar + Routes + Footer)
│
├── features/
│   ├── auth/
│   │   ├── authApiSlice.js  # RTK Query: login, register, googleLogin, logout
│   │   └── authSlice.js     # Redux slice: user, token, isAuthenticated
│   ├── hotels/
│   │   └── hotelApiSlice.js # RTK Query: CRUD + owner/admin hotel endpoints
│   ├── rooms/
│   │   └── roomApiSlice.js  # RTK Query: room CRUD per hotel
│   ├── bookings/
│   │   └── bookingApiSlice.js # RTK Query: create, list, cancel bookings
│   └── payments/
│       └── paymentApiSlice.js # RTK Query: Stripe payment intent
│
├── pages/
│   ├── Home.jsx             # Hotel search + grid + pagination
│   ├── HotelDetails.jsx     # Image gallery, amenities, room list
│   ├── Login.jsx            # Email/password + Google OAuth login
│   ├── Register.jsx         # User/hotelOwner registration form
│   ├── BookingPage.jsx      # Dates/guests form + price calculator
│   ├── MyBookings.jsx       # User booking history + cancel/pay actions
│   ├── PaymentPage.jsx      # Stripe Elements secure checkout
│   ├── NotFound.jsx         # 404 page
│   ├── owner/
│   │   ├── OwnerDashboard.jsx  # Stats overview + quick links
│   │   ├── MyHotels.jsx        # Hotel list with status badges
│   │   ├── AddHotel.jsx        # Hotel registration form
│   │   └── ManageRooms.jsx     # Room CRUD with inline edit
│   └── admin/
│       ├── AdminDashboard.jsx  # Platform stats + quick links
│       ├── PendingHotels.jsx   # Approve/reject hotel submissions
│       └── AllBookings.jsx     # Filterable bookings table
│
├── components/
│   ├── common/
│   │   ├── Navbar.jsx       # Dynamic auth-aware navigation
│   │   ├── Footer.jsx       # Site footer with links
│   │   ├── Loader.jsx       # Animated loading spinner
│   │   └── ProtectedRoute.jsx # Role-based auth guard
│   ├── hotel/
│   │   └── HotelCard.jsx    # Hotel listing card
│   └── room/
│       └── RoomCard.jsx     # Room details + Book Now button
│
├── routes/
│   └── AppRoutes.jsx        # All route definitions (public/protected)
│
└── utils/
    └── stripe.js            # Singleton loadStripe() promise
```

---

## ✨ Main Features

### 🔐 Authentication & Role-Based Access
- **JWT authentication** with access token stored in `localStorage` and refresh token via HTTP-only cookie
- **Google OAuth 2.0** login via `@react-oauth/google`
- Three user roles: `user`, `hotelOwner`, `admin`
- `ProtectedRoute` component enforces role-based access at the frontend routing level

### 🏨 Hotel Approval Flow
1. `hotelOwner` registers hotel → status: `pending`
2. Admin reviews submission in **Pending Hotels** panel
3. Admin approves → hotel goes live; or rejects → owner must resubmit
4. RTK Query `invalidatesTags` ensures UI auto-refreshes after actions

### 📅 Booking Flow
1. Guest browses hotels → selects hotel → views available rooms
2. Clicks **Book Now** → fills in dates, guests, number of rooms
3. Price auto-calculated: `pricePerNight × nights × numberOfRooms`
4. Booking created → redirected to **Payment** page
5. Stripe Payment Intent created from backend → `PaymentElement` rendered
6. On payment success, booking marked as paid

### 💳 Stripe Payment Integration
- `loadStripe()` singleton in `utils/stripe.js` (initialized once)
- `createPaymentIntent` mutation fetches `client_secret` from backend
- `<Elements>` + `<PaymentElement>` renders Stripe-hosted secure card form
- `stripe.confirmPayment()` handles submission

### 🛠️ State Management
- **RTK Query** for all API data fetching, caching, and cache invalidation
- **Redux Slice** (`authSlice`) for local auth state (user, token, isAuthenticated)
- All feature API slices use `injectEndpoints()` on a shared base `apiSlice`

---

## 🧑‍💻 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| Redux Toolkit | 2 | State management + RTK Query |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | v4 | Utility-first styling |
| @react-oauth/google | latest | Google OAuth login |
| @stripe/stripe-js | latest | Stripe payment processing |
| react-hot-toast | 2 | Toast notifications |
