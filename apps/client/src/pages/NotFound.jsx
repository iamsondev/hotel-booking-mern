import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      {/* Decorative blurs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <p className="text-[120px] md:text-[160px] font-extrabold leading-none bg-gradient-to-br from-indigo-400 to-purple-500 bg-clip-text text-transparent select-none">
          404
        </p>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-neutral-450 text-sm max-w-sm mx-auto" style={{ color: '#aaa' }}>
            The page you are looking for doesn&apos;t exist or has been moved to another location.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-2xl transition duration-200 shadow-lg hover:shadow-indigo-500/20 text-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Go to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
