export default function Home() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-2xl mx-auto text-center my-12 shadow-xl">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
        StayEase Hotels
      </h2>
      <p className="text-neutral-400 mb-6 leading-relaxed">
        Welcome to StayEase! Find, view, and book the most luxurious spaces suited for your journey.
      </p>
      <div className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-xl transition duration-200">
        Browse Properties
      </div>
    </div>
  );
}
