import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md mx-auto my-12 shadow-xl">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Login to StayEase</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">Email Address</label>
          <input
            type="email"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 transition"
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">Password</label>
          <input
            type="password"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 transition"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl transition duration-200"
        >
          Sign In
        </button>
      </form>
      <p className="text-center text-sm text-neutral-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-indigo-400 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
