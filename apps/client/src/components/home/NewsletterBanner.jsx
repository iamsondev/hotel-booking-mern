import { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-white shadow-2xl my-8"
      style={{ background: 'linear-gradient(135deg, #1B4332 0%, #0F3524 50%, #081C15 100%)' }}>
      
      {/* Decorative blurred glow circles */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-amber-300 text-xs font-bold tracking-wide border border-white/15">
          <Mail className="w-3.5 h-3.5" />
          <span>GETNEST LUXURY CLUB</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Unlock Secret Deals & VIP Travel Discounts
        </h2>

        <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto font-medium">
          Subscribe to our private newsletter to receive up to 30% off secret promos, early cabin releases, and seasonal luxury guides.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-6 py-3.5 rounded-2xl font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Thank you for subscribing! Check your inbox for secret welcome perks.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 bg-white/15 border border-white/25 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/60 outline-none focus:border-amber-300 transition"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--color-accent)] hover:bg-[#B8914F] text-white font-extrabold text-sm shadow-lg transition cursor-pointer whitespace-nowrap"
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-white/50">
          No spam ever. Unsubscribe anytime with 1-click.
        </p>
      </div>
    </section>
  );
}
