'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type Lenis from 'lenis';

const NAV = [
  { id: 'hero', label: 'Origin' },
  { id: 'properties', label: 'Portfolio' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'House' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const scrollTo = (id: string) => {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    // Defer scroll so the menu close animation can settle
    requestAnimationFrame(() => {
      const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
      if (lenis) {
        lenis.scrollTo(target, { offset: -10, duration: 1.6 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-ink-950/70 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto max-w-[1600px] px-6 md:px-12 py-5 md:py-6 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="font-display text-2xl md:text-[26px] tracking-wide leading-none"
            aria-label="Aurelia Estates — Home"
          >
            <span className="text-sand-50">AURELIA</span>
            <span className="text-gold-500"> · </span>
            <span className="text-sand-300 text-base tracking-ultra uppercase">Estates</span>
          </button>

          <ul className="hidden lg:flex items-center gap-10">
            {NAV.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className="group relative text-[12px] tracking-ultra uppercase text-sand-100/80 hover:text-sand-50 transition-colors"
                >
                  {item.label}
                  <span className="block h-px w-0 bg-gold-500 group-hover:w-full transition-all duration-500 mt-1" />
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-6">
            <span className="text-[11px] tracking-ultra uppercase text-sand-200/60">EN · ES</span>
            <button
              onClick={() => scrollTo('contact')}
              className="border border-gold-500/60 text-gold-400 hover:bg-gold-500 hover:text-ink-950 transition-all duration-500 px-5 py-2.5 text-[11px] tracking-ultra uppercase"
            >
              Private Viewing
            </button>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden flex flex-col gap-1.5 p-2 relative z-[60]"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span
              className={`block h-px w-6 bg-sand-50 transition-transform duration-500 ${
                open ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-px w-6 bg-sand-50 transition-opacity duration-500 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-px w-6 bg-sand-50 transition-transform duration-500 ${
                open ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu — always mounted, visibility animated by state (avoids AnimatePresence insertBefore issues) */}
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-2xl lg:hidden flex items-center justify-center"
        aria-hidden={!open}
      >
        <ul className="flex flex-col items-center gap-8">
          {NAV.map((item, i) => (
            <motion.li
              key={item.id}
              initial={false}
              animate={{ opacity: open ? 1 : 0, y: open ? 0 : 24 }}
              transition={{
                duration: 0.6,
                delay: open ? 0.08 + i * 0.06 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <button
                onClick={() => scrollTo(item.id)}
                className="font-display text-4xl text-sand-50 hover:text-gold-400 transition-colors"
              >
                {item.label}
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
