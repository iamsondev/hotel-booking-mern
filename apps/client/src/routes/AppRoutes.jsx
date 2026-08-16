import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import HotelDetails from '../pages/HotelDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BookingPage from '../pages/BookingPage';
import MyBookings from '../pages/MyBookings';
import PaymentPage from '../pages/PaymentPage';
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import MyHotels from '../pages/owner/MyHotels';
import AddHotel from '../pages/owner/AddHotel';
import ManageRooms from '../pages/owner/ManageRooms';
import AdminDashboard from '../pages/admin/AdminDashboard';
import PendingHotels from '../pages/admin/PendingHotels';
import AllBookings from '../pages/admin/AllBookings';
import AdminLayout from '../layouts/AdminLayout';
import OwnerLayout from '../layouts/OwnerLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/hotels/:id" element={<HotelDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* General Protected Routes */}
      <Route
        path="/booking/:roomId"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:bookingId"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      {/* Owner Protected Routes with Layout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['hotelOwner']}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/hotels" element={<MyHotels />} />
        <Route path="/owner/hotels/add" element={<AddHotel />} />
        <Route path="/owner/hotels/:hotelId/rooms" element={<ManageRooms />} />
      </Route>

      {/* Admin Protected Routes with Layout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pending-hotels" element={<PendingHotels />} />
        <Route path="/admin/bookings" element={<AllBookings />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
