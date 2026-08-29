import { motion } from 'framer-motion';
import { MapPin, Globe } from 'lucide-react';

const destinations = [
  {
    city: 'Tokyo',
    country: 'Japan',
    properties: '84 Hotels',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    properties: '110 Hotels',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Paris',
    country: 'France',
    properties: '95 Hotels',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    properties: '78 Hotels',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Bangkok',
    country: 'Thailand',
    properties: '64 Hotels',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    properties: '72 Hotels',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'New York',
    country: 'United States',
    properties: '105 Hotels',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Rome',
    country: 'Italy',
    properties: '58 Hotels',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden:  { opacity: 0, scale: 0.94, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function PopularDestinations({ onCitySelect }) {
  return (
    <section id="destinations" className="space-y-8 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="text-center space-y-2"
      >
        <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-accent)' }}>
          World Exploration
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Popular International Destinations
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Explore world-class partner properties across premier international destinations. Click to search hotels.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {destinations.map(({ city, country, properties, image }) => (
          <motion.button
            key={city}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            onClick={() => onCitySelect(city)}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer text-left w-full"
            style={{ border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}
          >
            {/* Image */}
            <img
              src={image}
              alt={city}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Global Badge */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-md text-amber-300 border border-white/10 flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />
              <span>International</span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-1 mb-0.5">
                <MapPin className="w-3 h-3 text-amber-300 flex-shrink-0" />
                <span className="text-amber-300 text-[10px] font-semibold">{properties}</span>
              </div>
              <p className="text-white font-extrabold text-base md:text-lg leading-tight">{city}</p>
              <p className="text-neutral-300 text-xs font-medium mt-0.5">{country}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
