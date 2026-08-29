import { Utensils, Waves, Compass, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

const EXPERIENCES = [
  {
    icon: Waves,
    title: 'Infinity Ocean Pools',
    description: 'Bask in luxury temperature-controlled infinity pools overlooking serene ocean waters and mountain views.',
    color: 'from-blue-500/20 to-cyan-500/20 text-cyan-500',
  },
  {
    icon: Utensils,
    title: 'Michelin-Caliber Fine Dining',
    description: 'Savor gourmet dishes crafted by world-class executive chefs with fresh local ingredient sourcing.',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-500',
  },
  {
    icon: Compass,
    title: 'Curated Private Tours',
    description: 'Personalized guided excursions, private yacht charters, and helicopter transfers upon request.',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-500',
  },
  {
    icon: Award,
    title: '5-Star Spa & Holistic Wellness',
    description: 'Rejuvenate your body and soul with organic herbal spa therapies, saunas, and daily yoga sessions.',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-500',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Butler Service',
    description: '24/7 personalized concierge and butler assistance tailored to your exact preferences.',
    color: 'from-rose-500/20 to-red-500/20 text-rose-500',
  },
  {
    icon: ShieldCheck,
    title: 'Seamless VIP Security',
    description: 'Discreet, high-grade safety standards and contactless check-in for maximum peace of mind.',
    color: 'from-indigo-500/20 to-sky-500/20 text-indigo-500',
  },
];

export default function SignatureExperiences() {
  return (
    <section id="experiences" className="space-y-8 scroll-mt-20 py-4">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          ELEVATED HOSPITALITY
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Signature Luxury Experiences
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Every stay at a GetNest property is designed to exceed expectations with world-class amenities and bespoke hospitality services.
        </p>
      </div>

      {/* Experience Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXPERIENCES.map((exp, idx) => {
          const Icon = exp.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${exp.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                {exp.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {exp.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
