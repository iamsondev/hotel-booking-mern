import { ShieldCheck, BadgePercent, Headset } from 'lucide-react';

const features = [
  {
    icon: BadgePercent,
    title: 'Best Price Guarantee',
    description: "We match any lower price you find. Book with confidence — you'll always get the best deal.",
    iconColor: 'var(--color-primary)',
    iconBg: 'rgba(27,67,50,0.08)',
    iconBorder: 'rgba(27,67,50,0.15)',
  },
  {
    icon: Headset,
    title: '24/7 Concierge Support',
    description: 'Our dedicated luxury support team is available around the clock — wherever you are in the world.',
    iconColor: 'var(--color-accent)',
    iconBg: 'rgba(201,169,110,0.1)',
    iconBorder: 'rgba(201,169,110,0.2)',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Every transaction is end-to-end encrypted with Stripe. Your payment is always safe and protected.',
    iconColor: 'var(--status-success)',
    iconBg: 'rgba(45,106,79,0.08)',
    iconBorder: 'rgba(45,106,79,0.15)',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="space-y-8 scroll-mt-20">
      <div className="text-center space-y-2">
        <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-accent)' }}>
          ✦ Why GetNest
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Trusted By Thousands Of Travelers
        </h2>
        <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
          Premium hospitality standards — transparent pricing, secure payments, and always on hand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, description, iconColor, iconBg, iconBorder }) => (
          <div
            key={title}
            className="card-base rounded-3xl p-7 flex flex-col gap-4 group"
          >
            <div
              className="w-12 h-12 flex items-center justify-center rounded-2xl border"
              style={{ backgroundColor: iconBg, borderColor: iconBorder }}
            >
              <Icon className="w-6 h-6" style={{ color: iconColor }} />
            </div>
            <div>
              <h3 className="text-[var(--text-primary)] font-bold text-base mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                {title}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
