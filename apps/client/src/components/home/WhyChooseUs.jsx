import { ShieldCheck, BadgePercent, Headset } from 'lucide-react';

const features = [
  {
    icon: BadgePercent,
    title: 'Best Price Guarantee',
    description: "We match any lower price you find. Book with confidence — you'll always get the best deal available.",
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    icon: Headset,
    title: '24/7 Customer Support',
    description: 'Our dedicated support team is available around the clock to assist you at any stage of your trip.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: 'Every transaction is encrypted end-to-end with Stripe. Your payment details are always protected.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Why Choose <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">StayEase?</span>
        </h2>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          Designed for modern travelers — transparent, secure, and always available.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, description, color, bg }) => (
          <div
            key={title}
            className="bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-3xl p-7 flex flex-col gap-4 shadow-md hover:shadow-xl transition duration-300 group"
            style={{ borderColor: '#222' }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-2xl border ${bg}`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-indigo-300 transition">{title}</h3>
              <p className="text-neutral-450 text-sm leading-relaxed" style={{ color: '#aaa' }}>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
