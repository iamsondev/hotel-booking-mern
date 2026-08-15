# Multi-Vendor Hotel Booking Backend API

Modular & Feature-based backend architecture for Multi-Vendor Hotel Booking Platform built with **Node.js**, **Express 5**, **MongoDB & Mongoose 9**, **JWT**, **Zod**, and **Stripe Payment Gateway**.

---

## 🛠️ Project Setup Instructions

### 1. Installation
Navigate to the server directory and install dependencies:
```bash
cd apps/server
npm install
```

### 2. Environment Variables (.env)
Create a `.env` file in `apps/server/` directory using `.env.example` as a template:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/hotel_booking
JWT_SECRET=your_super_secret_access_jwt_key
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key
JWT_REFRESH_EXPIRE=30d
GOOGLE_CLIENT_ID=your_google_client_id
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 📡 API Endpoints Documentation

### 🔑 Authentication (`/api/auth`)
| Method | Path | Role / Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user or hotelOwner |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive access token + cookie |
| `POST` | `/api/auth/google` | Public | OAuth login via Google ID token |
| `POST` | `/api/auth/logout` | Authenticated | Logout user and clear refreshToken cookie |
| `POST` | `/api/auth/refresh-token` | Public (Cookie) | Re-issue new access token via refreshToken cookie |

---

### 🏨 Hotel Management (`/api/hotels`)
| Method | Path | Role / Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hotels` | Public | Get all approved hotels with search/filter & pagination |
| `GET` | `/api/hotels/:id` | Public | Get single hotel by MongoDB ID or slug |
| `POST` | `/api/hotels` | `hotelOwner`, `admin` | Create new hotel listing (starts with `pending` status) |
| `PUT` | `/api/hotels/:id` | `hotelOwner` (Owner), `admin` | Update hotel details |
| `DELETE` | `/api/hotels/:id` | `hotelOwner` (Owner), `admin` | Delete hotel listing |
| `GET` | `/api/hotels/owner/my-hotels` | `hotelOwner`, `admin` | Get all hotels owned by logged-in hotelOwner |
| `GET` | `/api/hotels/admin/pending` | `admin` | Get list of pending hotels awaiting approval |
| `PATCH` | `/api/hotels/:id/approve` | `admin` | Approve a hotel listing |
| `PATCH` | `/api/hotels/:id/reject` | `admin` | Reject a hotel listing |

---

### 🛏️ Room Management (`/api/rooms` & `/api/hotels/:hotelId/rooms`)
| Method | Path | Role / Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hotels/:hotelId/rooms` | Public | Get all active room types for a specific hotel |
| `POST` | `/api/hotels/:hotelId/rooms` | `hotelOwner` (Owner), `admin` | Create room type under a hotel |
| `GET` | `/api/rooms/:id` | Public | Get single room details |
| `PUT` | `/api/rooms/:id` | `hotelOwner` (Owner), `admin` | Update room details |
| `DELETE` | `/api/rooms/:id` | `hotelOwner` (Owner), `admin` | Soft delete room (`isActive = false`) |

---

### 📅 Booking Engine (`/api/bookings`)
| Method | Path | Role / Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | `user` | Reserve a room with date availability check |
| `GET` | `/api/bookings/my-bookings` | `user` | Get all bookings of logged-in user |
| `GET` | `/api/bookings/:id` | User Owner, Hotel Owner, Admin | Get single booking details with access checks |
| `PATCH` | `/api/bookings/:id/cancel` | User Owner, Admin | Cancel a pending/confirmed booking |
| `GET` | `/api/bookings/hotel/:hotelId` | `hotelOwner` (Owner), `admin` | Get all bookings for a specific hotel |
| `GET` | `/api/bookings/admin/all` | `admin` | Get all platform bookings with pagination |

---

### 💳 Stripe Payments (`/api/payments`)
| Method | Path | Role / Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-intent` | `user` | Create Stripe Payment Intent for pending booking |
| `POST` | `/api/payments/webhook` | Public (Stripe Signature) | Stripe event webhook listener to confirm booking |
| `GET` | `/api/payments/booking/:bookingId` | User Owner, Admin | Get payment transaction details by booking ID |

---

## 🧪 Testing with REST Client
Use the included `api-test.http` file with the VS Code **REST Client** extension to test all endpoints.
