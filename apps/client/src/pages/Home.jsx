import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetHotelsQuery } from '../features/hotels/hotelApiSlice';
import HotelCard from '../components/hotel/HotelCard';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';
import HeroSearch from '../components/home/HeroSearch';
import PopularDestinations from '../components/home/PopularDestinations';
import SpecialOffers from '../components/home/SpecialOffers';
import SignatureExperiences from '../components/home/SignatureExperiences';
import WhyChooseUs from '../components/home/WhyChooseUs';
import GuestReviews from '../components/home/GuestReviews';
import HomeFAQ from '../components/home/HomeFAQ';
import NewsletterBanner from '../components/home/NewsletterBanner';

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Home() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, error } = useGetHotelsQuery({
    page,
    limit,
    search: search || undefined,
  });

  const handleSearch = (city) => {
    setSearch(city);
    setPage(1);
    setTimeout(() => {
      document.getElementById('all-hotels')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClaimOffer = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    toast.success(`Promo code "${code}" copied to clipboard! Use it at checkout.`, {
      duration: 4000,
      icon: '🎁',
      style: {
        borderRadius: '16px',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
      },
    });
  };

  return (
    <div className="space-y-20 pb-16 font-sans overflow-x-hidden">
      {/* 1. Hero Search Banner */}
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <HeroSearch onSearch={handleSearch} />
      </motion.div>

      {/* 2. Featured Real Hotels Grid (Directly below Banner) */}
      <motion.section
        id="all-hotels"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariants}
        className="space-y-8 scroll-mt-20"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VERIFIED REAL-TIME STAYS</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {search ? (
                <>
                  Hotels in{' '}
                  <span style={{ color: 'var(--color-accent)' }}>{search}</span>
                </>
              ) : (
                'All Featured Luxury Hotels & Resorts'
              )}
            </h2>
            {data && !isLoading && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Showing live registered properties · {data.total ?? data.hotels?.length ?? 0} available for instant booking
              </p>
            )}
          </div>

          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1); }}
              className="text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm hover:scale-105"
              style={{
                color: 'var(--color-primary)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
              }}
            >
              ✕ Clear Filter: &ldquo;{search}&rdquo;
            </button>
          )}
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <div
            className="text-center p-8 rounded-2xl text-red-400 text-sm max-w-md mx-auto"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}
          >
            Failed to load hotels. Please check your backend connection.
          </div>
        ) : !data?.hotels || data.hotels.length === 0 ? (
          <div
            className="text-center py-16 space-y-4 rounded-3xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <Building2 className="w-12 h-12 mx-auto opacity-30" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {search
                ? `No hotels found for "${search}". Try searching another destination.`
                : 'No registered hotels available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.hotels.map((hotel) => (
                <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
              ))}
            </div>
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </motion.section>

      {/* 3. Popular International Destinations */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
        <PopularDestinations onCitySelect={handleSearch} />
      </motion.div>

      {/* 4. Special Offers & Limited Promotions */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
        <SpecialOffers onClaimOffer={handleClaimOffer} />
      </motion.div>

      {/* 5. Signature Luxury Experiences */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
        <SignatureExperiences />
      </motion.div>

      {/* 6. Why GetNest */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
        <WhyChooseUs />
      </motion.div>

      {/* 7. Verified Guest Feedback */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
        <GuestReviews />
      </motion.div>

      {/* 8. Frequently Asked Questions */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
        <HomeFAQ />
      </motion.div>

      {/* 9. VIP Newsletter Subscription */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
        <NewsletterBanner />
      </motion.div>
    </div>
  );
}
