import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation, useGoogleLoginMutation } from '../features/auth/authApiSlice';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !role) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await register({ name, email, password, role }).unwrap();
      toast.success('Registration successful! Welcome to StayEase.');
      
      if (role === 'hotelOwner') {
        toast('Your account needs admin approval before you can list hotels', {
          icon: '⏳',
          duration: 6000,
        });
      }
      
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient blur background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-6 relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-neutral-400 mt-2 text-sm">Join StayEase to book or list properties</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 font-sans">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:outline-none transition-all placeholder:text-neutral-600 focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:outline-none transition-all placeholder:text-neutral-600 focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              I want to register as
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:outline-none transition-all focus:ring-1 focus:ring-indigo-500 text-sm capitalize"
              required
            >
              <option value="user">Customer / Guest</option>
              <option value="hotelOwner">Hotel Owner / Vendor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 pr-12 text-white outline-none focus:outline-none transition-all placeholder:text-neutral-600 focus:ring-1 focus:ring-indigo-500 text-sm"
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 pr-12 text-white outline-none focus:outline-none transition-all placeholder:text-neutral-600 focus:ring-1 focus:ring-indigo-500 text-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-indigo-400 transition cursor-pointer"
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/20 py-3 rounded-2xl transition duration-300 cursor-pointer text-center text-sm mt-3"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center z-10">
          <span className="bg-neutral-900 px-4 text-xs text-neutral-500 relative z-10 uppercase tracking-widest">
            Or sign up with
          </span>
          <div className="absolute w-full h-[1px] bg-neutral-800 top-1/2 left-0 -z-0"></div>
        </div>

        {/* Google Sign-Up */}
        <div className="flex justify-center mb-4 relative z-10" style={{ minHeight: '44px' }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await googleLogin({ token: credentialResponse.credential }).unwrap();
                toast.success('Successfully signed up with Google!');
                navigate('/');
              } catch (err) {
                toast.error(err?.data?.message || 'Google sign-up failed. Try again.');
              }
            }}
            onError={() => {
              toast.error('Google sign-up failed. Try again.');
            }}
            theme="filled_dark"
            shape="pill"
            text="signup_with"
            width="340px"
          />
        </div>

        <p className="text-center text-sm text-neutral-400 relative z-10 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
