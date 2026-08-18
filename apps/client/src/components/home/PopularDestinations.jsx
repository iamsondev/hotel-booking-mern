const destinations = [
  {
    city: 'Cox\'s Bazar',
    country: 'Bangladesh',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Dhaka',
    country: 'Bangladesh',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Sylhet',
    country: 'Bangladesh',
    image: 'https://images.unsplash.com/photo-1552558636-fb8b47a7e661?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Chittagong',
    country: 'Bangladesh',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
  },
];

export default function PopularDestinations({ onCitySelect }) {
  return (
    <section id="destinations" className="space-y-8 scroll-mt-20">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Popular Destinations
        </h2>
        <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
          Explore partner properties by city. Click to view hotels in your target location.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
        {destinations.map(({ city, country, image }) => (
          <button
            key={city}
            onClick={() => onCitySelect(city)}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer text-left w-full border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Background image */}
            <img
              src={image}
              alt={city}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Text */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-bold text-base md:text-lg leading-tight">{city}</p>
              <p className="text-neutral-300 text-xs font-medium">
                {country}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
