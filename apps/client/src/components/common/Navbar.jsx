import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../features/auth/authApiSlice';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:opacity-90 transition">
          StayEase
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-neutral-300 hover:text-white transition">
            Home
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-400">
                Hi, <strong className="text-neutral-200">{user?.name || 'User'}</strong> 
                {user?.role && (
                  <span className="ml-2 text-xs bg-indigo-900/60 text-indigo-300 border border-indigo-800/80 px-2 py-0.5 rounded-full capitalize">
                    {user.role}
                  </span>
                )}
              </span>

              {/* Role-based Dashboard link */}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-sm font-medium text-indigo-450 hover:text-indigo-350 transition" style={{ color: '#818cf8' }}>
                  Admin Dashboard
                </Link>
              )}
              {user?.role === 'hotelOwner' && (
                <Link to="/owner/dashboard" className="text-sm font-medium text-indigo-450 hover:text-indigo-350 transition" style={{ color: '#818cf8' }}>
                  Owner Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-sm bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded-xl transition duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-4 rounded-xl transition duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
