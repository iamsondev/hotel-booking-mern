const destinations = [
  {
    city: 'Cox\'s Bazar',
    country: 'Bangladesh',
    hotels: 48,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Dhaka',
    country: 'Bangladesh',
    hotels: 134,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Sylhet',
    country: 'Bangladesh',
    hotels: 62,
    image: 'https://images.unsplash.com/photo-1552558636-fb8b47a7e661?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Bangkok',
    country: 'Thailand',
    hotels: 210,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    hotels: 178,
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    hotels: 295,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  },
];

export default function PopularDestinations({ onCitySelect }) {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Popular Destinations
        </h2>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          Explore top picks from travellers worldwide. Click to browse hotels in that city.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {destinations.map(({ city, country, hotels, image }) => (
          <button
            key={city}
            onClick={() => onCitySelect(city)}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer text-left w-full"
          >
            {/* Background image */}
            <img
              src={image}
              alt={city}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />

            {/* Text */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-bold text-base md:text-lg leading-tight">{city}</p>
              <p className="text-neutral-350 text-xs" style={{ color: '#ccc' }}>
                {country} · {hotels}+ hotels
              </p>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-500/50 transition duration-300 pointer-events-none" />
          </button>
        ))}
      </div>
    </section>
  );
}
