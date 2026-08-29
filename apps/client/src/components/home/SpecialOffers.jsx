import { Tag, Gift, Clock, ArrowRight } from 'lucide-react';

const OFFERS = [
  {
    id: 1,
    tag: 'EARLY BIRD DEALS',
    discount: '25% OFF',
    title: 'Summer Luxury Coastal Retreats',
    description: 'Book 30 days in advance and unlock exclusive savings on oceanfront suites in Cox’s Bazar.',
    code: 'SUMMER25',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    validTill: 'Limited Time Offer',
  },
  {
    id: 2,
    tag: 'WEEKEND ESCAPE',
    discount: 'FLAT $100 OFF',
    title: 'Serene Tea Garden Bungalows',
    description: 'Enjoy complimentary breakfast & private spa vouchers for 2-night weekend stays in Sylhet.',
    code: 'SYLHET100',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    validTill: 'Valid until Sunday',
  },
  {
    id: 3,
    tag: 'HONEYMOON PACKAGE',
    discount: 'FREE UPGRADE',
    title: 'Private Pool Villa Luxury',
    description: 'Complimentary candle-lit dinner, champagne on arrival, and airport luxury transfers included.',
    code: 'LUXEVALENTINE',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    validTill: 'Exclusive Stays',
  },
];

export default function SpecialOffers({ onClaimOffer }) {
  return (
    <section id="special-offers" className="space-y-8 scroll-mt-20 py-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>EXCLUSIVE PROMOTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Special Offers & Limited Deals
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
            Save on your next dream getaway with our handpicked promotional packages and partner discounts.
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="group relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Banner */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {offer.discount}
              </div>

              {/* Offer Tag */}
              <span className="absolute bottom-3 left-4 text-amber-300 font-black text-[10px] uppercase tracking-widest">
                {offer.tag}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                  {offer.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {offer.description}
                </p>
              </div>

              {/* Promo code box & action button */}
              <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{offer.validTill}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    CODE: {offer.code}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onClaimOffer && onClaimOffer(offer.code)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow transition cursor-pointer"
                  style={{ background: 'var(--color-primary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
                >
                  <span>Claim Promotion</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
