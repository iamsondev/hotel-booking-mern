import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'How do I modify or cancel my hotel booking?',
    answer: 'You can easily view and manage all your bookings by logging into your account and clicking "My Bookings". Free cancellation is available up to 24 hours prior to check-in for most partner hotels.',
  },
  {
    question: 'Are there any hidden fees or extra taxes at check-in?',
    answer: 'No. All rates displayed on GetNest include applicable VAT, service charges, and local resort fees so you see the final price upfront before confirming.',
  },
  {
    question: 'How can I register my hotel or property on GetNest?',
    answer: 'You can sign up as a Partner by choosing "Hotel Owner" during registration or clicking "Become a Partner" in the navigation bar to list your property within minutes.',
  },
  {
    question: 'What payment methods are supported on GetNest?',
    answer: 'We support all major Credit/Debit cards (Visa, MasterCard, Amex), bKash, Nagad, and direct online banking through our secure payment gateway.',
  },
  {
    question: 'Do you offer instant confirmation for bookings?',
    answer: 'Yes! Once your booking is completed, you instantly receive a digital booking voucher on screen and via email with your QR check-in code.',
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="space-y-8 scroll-mt-20 py-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>GOT QUESTIONS?</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Everything you need to know about booking luxury stays and partner policies with GetNest.
        </p>
      </div>

      {/* Accordions */}
      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden transition-all shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-[var(--text-primary)] hover:text-[var(--color-primary)] transition cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[var(--color-primary)]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)]/50 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
