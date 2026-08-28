import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Sarah & David Jenkins',
    role: 'Honeymoon Travelers from UK',
    stay: 'Oceanview Suite, Cox’s Bazar',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment: 'An absolutely magical stay! The private balcony sunset views were unreal, and the booking process on GetNest was smoother than any other site we used.',
  },
  {
    id: 2,
    name: 'Tanvir Hossain',
    role: 'Corporate Executive, Dhaka',
    stay: 'Tea Resort Villa, Sylhet',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'The attention to detail and hospitality was top notch. Fast Wi-Fi, serene environment, and instant check-in confirmation saved our business weekend trip.',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Solo Luxury Blogger',
    stay: 'Boutique Hotel, Sreemangal',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    comment: 'GetNest curated the best luxury cabin stay I have experienced in South Asia. Highly recommend their verified stays filter for genuine 5-star quality!',
  },
];

export default function GuestReviews() {
  return (
    <section className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>VERIFIED GUEST FEEDBACK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Loved By Thousands Of Travelers
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
            Read real experiences from guests who booked their luxury stays through GetNest.
          </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <Quote className="absolute -right-2 -top-2 w-24 h-24 text-[var(--border-color)] opacity-20 pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Star rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] italic leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)] relative z-10">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)]"
              />
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] truncate">
                  {review.name}
                </h4>
                <p className="text-[10px] text-[var(--text-muted)] truncate">
                  {review.role} · <span className="text-[var(--color-accent)] font-semibold">{review.stay}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
