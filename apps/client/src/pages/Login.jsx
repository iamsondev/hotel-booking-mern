import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation, useGoogleLoginMutation } from '../features/auth/authApiSlice';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter all credentials');
      return;
    }
    try {
      const res = await login({ email, password }).unwrap();
      toast.success('Successfully logged in!');
      const userRole = res?.data?.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'hotelOwner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/my-bookings');
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient blur background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-neutral-400 mt-2 text-sm">Sign in to manage bookings and stays</p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="mb-6 bg-neutral-950/70 border border-neutral-800 rounded-2xl p-3 relative z-10">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 text-center">
            Quick Fill Demo Accounts:
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@stayease.com');
                setPassword('adminpassword123');
              }}
              className="bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/50 text-indigo-300 py-1.5 rounded-xl transition cursor-pointer font-medium text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('owner@stayease.com');
                setPassword('ownerpassword123');
              }}
              className="bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/50 text-purple-300 py-1.5 rounded-xl transition cursor-pointer font-medium text-center"
            >
              Hotel Owner
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('user@stayease.com');
                setPassword('userpassword123');
              }}
              className="bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/50 text-emerald-300 py-1.5 rounded-xl transition cursor-pointer font-medium text-center"
            >
              Customer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10 font-sans">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-3 text-white outline-none focus:outline-none transition-all placeholder:text-neutral-600 focus:ring-1 focus:ring-indigo-500"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-3 pr-12 text-white outline-none focus:outline-none transition-all placeholder:text-neutral-600 focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-indigo-400 transition cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/20 py-3 rounded-2xl transition duration-300 cursor-pointer text-center"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6 text-center z-10">
          <span className="bg-neutral-900 px-4 text-xs text-neutral-500 relative z-10 uppercase tracking-widest">
            Or continue with
          </span>
          <div className="absolute w-full h-[1px] bg-neutral-800 top-1/2 left-0 -z-0"></div>
        </div>

        <div className="flex justify-center mb-6 relative z-10 w-full" style={{ minHeight: '44px' }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await googleLogin({ token: credentialResponse.credential }).unwrap();
                toast.success('Successfully logged in with Google!');
                const userRole = res?.data?.role;
                if (userRole === 'admin') {
                  navigate('/admin/dashboard');
                } else if (userRole === 'hotelOwner') {
                  navigate('/owner/dashboard');
                } else {
                  navigate('/');
                }
              } catch (err) {
                toast.error(err?.data?.message || 'Google authentication failed');
              }
            }}
            onError={() => {
              toast.error('Google login failed. Try again.');
            }}
            theme="filled_dark"
            shape="pill"
            text="continue_with"
            width="340px"
          />
        </div>

        <p className="text-center text-sm text-neutral-400 relative z-10 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
