# 🏰 GetNest — Luxury Hotel & Resort Booking Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-emerald.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.0-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4.svg)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-v2.0-764ABC.svg)](https://redux-toolkit.js.org/)
[![Stripe API](https://img.shields.io/badge/Stripe-Payment%20Gateway-635BFF.svg)](https://stripe.com/)

**GetNest** is an industry-standard, full-stack **MERN (MongoDB, Express, React, Node.js)** luxury hotel and resort reservation platform. Designed with modern aesthetics inspired by high-end hospitality brands, GetNest connects discerning travelers with world-class hotels, beach resorts, and private villas across premier international destinations.

---

## ✨ Key Features & Capabilities

### 🌟 1. Customer Luxury Gateway & Booking Experience
* **Hero Search Engine**: Real-time city search, check-in/check-out date validation, and guest counter powered by **GSAP** micro-animations.
* **International Destinations Grid**: Curated hotspots including **Tokyo (Japan)**, **Dubai (UAE)**, **Paris (France)**, **London (UK)**, **Bangkok (Thailand)**, **Bali (Indonesia)**, **New York (USA)**, and **Rome (Italy)**.
* **Live Verified Hotel Listings**: Instant filtering of real-time registered backend properties with category tags, pricing, ratings, and amenity icons.
* **Special Offers & Promotions**: Interactive promo code claiming (`SUMMER25`, `LUXEVALENTINE`) with instant clipboard copy and toast notifications.
* **Signature Luxury Experiences**: Showcasing infinity ocean pools, Michelin-caliber dining, organic spa therapies, and 24/7 butler services.
* **Secure Stripe Payment Gateway**: Integrated Stripe checkout supporting instant booking confirmation and receipt management.
* **Light / Dark Mode Luxury Theme**: Seamless color palette transition utilizing CSS custom variables (`Warm Ivory`, `Forest Green`, and `Accent Gold`).

### 🔑 2. Multi-Vendor Hotel Owner Dashboard
* **Hotel Management**: Create, update, and manage hotel listings with custom amenities, descriptions, and address coordinates.
* **Direct Cloudinary Image Upload**: Drag-and-drop image upload with real-time upload progress tracking and cloud storage integration.
* **Room Inventory Control**: Add and edit room types (Deluxe Suite, Ocean View, Presidential Villa) with capacity, pricing per night, and bed configuration.
* **Luxury Confirmation Dialogs**: Interactive **SweetAlert2** modals for critical deletion/deactivation actions.

### 👑 3. Admin Moderation & Approval System
* **Vendor Approval Workflow**: Admin review and approval pipeline for new hotel vendor registrations.
* **Hotel Listing Verification**: Approve or suspend hotel listings to maintain verified 5-star quality standards.
* **System Metrics Dashboard**: Overview of platform-wide bookings, revenue analytics, registered users, and active hotels.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (`apps/client`)**
* **Core**: React 19, Vite, React Router 7
* **State Management**: Redux Toolkit & RTK Query
* **Styling & Motion**: Vanilla CSS Tokens, Tailwind CSS v4, Framer Motion, GSAP
* **UI Utilities**: SweetAlert2, React Hot Toast, Lucide React Icons
* **Authentication**: JWT Decode, `@react-oauth/google`
* **Payments**: `@stripe/react-stripe-js`, `@stripe/stripe-js`

### **Backend (`apps/server`)**
* **Runtime & Framework**: Node.js, Express.js
* **Database**: MongoDB with Mongoose ORM
* **Security & Auth**: JSON Web Tokens (JWT), Bcrypt.js, Helmet, CORS, Cookie Parser
* **Cloud Storage**: Cloudinary SDK (Direct & Server Uploads)
* **Payment Processor**: Stripe Node.js SDK

---

## 📂 Project Structure

```text
Hotel_Booking/
├── apps/
│   ├── client/                         # React 19 Frontend Application
│   │   ├── src/
│   │   │   ├── app/                    # Redux Store & Root App
│   │   │   ├── components/
│   │   │   │   ├── common/             # Navbar, Footer, Logo, ThemeToggle, CloudinaryUpload
│   │   │   │   ├── home/               # HeroSearch, PopularDestinations, SpecialOffers, etc.
│   │   │   │   ├── hotel/              # HotelCard, HotelDetails
│   │   │   │   └── room/               # RoomCard, RoomDetails
│   │   │   ├── features/               # RTK Query API Slices (auth, hotels, rooms, bookings, payments)
│   │   │   ├── layouts/                # Customer, Owner & Admin Layouts
│   │   │   ├── pages/                  # Route Pages (Home, ExploreHotels, HotelDetails, BookingPage, etc.)
│   │   │   └── utils/                  # Confirmation dialogs & helpers
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── server/                         # Express.js API Backend
│       ├── src/
│       │   ├── config/                 # DB Connection & Cloudinary Config
│       │   ├── middleware/             # Auth, Role Guard, Error Handler
│       │   ├── modules/
│       │   │   ├── auth/               # Controller, Route, Model
│       │   │   ├── user/               # Controller, Route, Model
│       │   │   ├── hotel/              # Controller, Route, Model
│       │   │   ├── room/               # Controller, Route, Model
│       │   │   ├── booking/            # Controller, Route, Model
│       │   │   └── payment/            # Stripe Payment Intent & Webhook Controller
│       │   └── app.js
│       ├── package.json
│       └── .env.example
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed locally:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas URL)
- **Cloudinary Account** (For image uploads)
- **Stripe Account** (For payment gateway testing)

---

### 📥 1. Installation

Clone the repository and install dependencies for both client and server:

```bash
git clone https://github.com/iamsondev/hotel-booking-mern.git
cd hotel-booking-mern

# Install client dependencies
cd apps/client
npm install

# Install server dependencies
cd ../server
npm install
```

---

### ⚙️ 2. Environment Configuration

#### Backend Environment (`apps/server/.env`)
Create a `.env` file inside `apps/server/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/hotel_booking
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

#### Frontend Environment (`apps/client/.env`)
Create a `.env` file inside `apps/client/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

---

### 🏃 3. Running Locally

Start the backend server and frontend client in separate terminal windows:

```bash
# Terminal 1: Backend Server (Port 5000)
cd apps/server
npm run dev

# Terminal 2: Frontend Client (Port 5173)
cd apps/client
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to explore **GetNest**.

---

## 📡 API Endpoints Overview

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | Public | Register new customer or hotel owner |
| `/api/auth/login` | `POST` | Public | Authenticate user & return JWT cookie |
| `/api/hotels` | `GET` | Public | Get paginated list of verified hotels |
| `/api/hotels/:id` | `GET` | Public | Get single hotel details with rooms |
| `/api/hotels` | `POST` | Owner/Admin | Register a new hotel listing |
| `/api/rooms/hotel/:hotelId` | `GET` | Public | Fetch available room types for a hotel |
| `/api/bookings` | `POST` | Customer | Create a room reservation booking |
| `/api/payments/create-intent`| `POST` | Customer | Create Stripe payment intent for reservation |
| `/api/admin/vendors/pending` | `GET` | Admin | List pending vendor applications |

---

## 🎨 Luxury Design System & Aesthetic Tokens

GetNest uses a tailored color tokens system configured in `apps/client/src/index.css`:

| Token | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-card` | `#FFFFFF` | `#1A2421` | Card backgrounds & Modals |
| `--color-primary` | `#1E3F35` (Forest Green) | `#2A574A` | Primary Buttons & Badges |
| `--color-accent` | `#D4A847` (Warm Gold) | `#E6BC5C` | Highlights & Icons |
| `--text-primary` | `#1A202C` | `#F7FAFC` | Main Headings & Body |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

Crafted with care by **Sondip Roy (iamsondev)**.

- **GitHub**: [@iamsondev](https://github.com/iamsondev)
- **Project Repository**: [hotel-booking-mern](https://github.com/iamsondev/hotel-booking-mern)
