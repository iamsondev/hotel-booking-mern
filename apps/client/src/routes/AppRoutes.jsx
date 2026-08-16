import { Routes, Route, Navigate } from 'react-router-dom';
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
import ProtectedRoute from '../components/common/ProtectedRoute';

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

      {/* Owner Protected Routes */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['hotelOwner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/hotels"
        element={
          <ProtectedRoute allowedRoles={['hotelOwner']}>
            <MyHotels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/hotels/add"
        element={
          <ProtectedRoute allowedRoles={['hotelOwner']}>
            <AddHotel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/hotels/:hotelId/rooms"
        element={
          <ProtectedRoute allowedRoles={['hotelOwner']}>
            <ManageRooms />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pending-hotels"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PendingHotels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AllBookings />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
