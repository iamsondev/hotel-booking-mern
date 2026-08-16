export default function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute animate-ping h-8 w-8 rounded-full bg-indigo-500 opacity-20"></div>
        {/* Inner rotating spinner */}
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  );
}
