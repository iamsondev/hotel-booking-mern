import { motion } from 'framer-motion';
import { BadgePercent, Headset, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: BadgePercent,
    title: 'Best Price Guarantee',
    description: "We match any lower price you find. Book with confidence — you'll always get the best deal.",
    iconColor: 'var(--color-primary)',
    iconBg: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
    iconBorder: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
  },
  {
    icon: Headset,
    title: '24/7 Concierge Support',
    description: 'Our dedicated luxury support team is available around the clock — wherever you are in the world.',
    iconColor: 'var(--color-accent)',
    iconBg: 'color-mix(in srgb, var(--color-accent) 12%, transparent)',
    iconBorder: 'color-mix(in srgb, var(--color-accent) 22%, transparent)',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Every transaction is end-to-end encrypted. Your payment details are always safe and protected.',
    iconColor: 'var(--status-success)',
    iconBg: 'color-mix(in srgb, var(--status-success) 10%, transparent)',
    iconBorder: 'color-mix(in srgb, var(--status-success) 20%, transparent)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="space-y-10 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-2"
      >
        <p
          className="text-xs font-black uppercase tracking-[0.2em]"
          style={{ color: 'var(--color-accent)' }}
        >
          Why GetNest
        </p>
        <h2
          className="text-2xl md:text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Trusted By Thousands Of Travelers
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Premium hospitality standards — transparent pricing, secure payments, and always on hand.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {features.map(({ icon: Icon, title, description, iconColor, iconBg, iconBorder }) => (
          <motion.div
            key={title}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-3xl p-7 flex flex-col gap-4 group cursor-default"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-card)',
              transition: 'box-shadow 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
          >
            <div
              className="w-12 h-12 flex items-center justify-center rounded-2xl"
              style={{ backgroundColor: iconBg, border: `1px solid ${iconBorder}` }}
            >
              <Icon className="w-6 h-6" style={{ color: iconColor }} />
            </div>
            <div>
              <h3
                className="font-bold text-base mb-1.5 transition-colors duration-200 group-hover:text-[var(--color-primary)]"
                style={{ color: 'var(--text-primary)' }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
