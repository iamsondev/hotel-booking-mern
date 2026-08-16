// Root component wrapping app with Redux Provider and RouterProvider (AppRoutes)
export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-905 text-white font-sans" style={{ background: '#111' }}>
      <div className="text-center p-8 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          Hotel Booking Platform
        </h1>
        <p className="mt-4 text-neutral-400">
          Modular folder structure & Tailwind CSS v4 are setup successfully!
        </p>
      </div>
    </div>
  )
}
