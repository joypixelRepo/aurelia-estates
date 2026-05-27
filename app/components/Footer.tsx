'use client';

import ScrollMarquee from './ScrollMarquee';

export default function Footer() {
  return (
    <footer className="relative bg-ink-950 border-t border-white/5 overflow-hidden">
      <div className="py-20 md:py-28 text-sand-50/90">
        <div className="flex flex-col items-center justify-center gap-4 mb-12 md:mb-16 px-6">
          <span className="block h-px w-12 bg-gold-500" />
          <span className="eyebrow text-center">Coverage · Costa del Sol</span>
        </div>
        <ScrollMarquee />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="font-display text-2xl text-sand-50 mb-4">AURELIA</div>
            <p className="text-sand-200/60 text-sm font-light leading-relaxed max-w-xs">
              Private real estate house. Marbella · Sotogrande · Costa del Sol.
            </p>
          </div>

          <div>
            <div className="eyebrow mb-4">House</div>
            <ul className="space-y-3 text-sand-200/80 text-sm font-light">
              <li>
                <a href="/about" className="hover:text-gold-400 transition-colors">
                  About Aurelia
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-400 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-gold-400 transition-colors">
                  Portfolio
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">Contact</div>
            <ul className="space-y-3 text-sand-200/80 text-sm font-light">
              <li>Avenida del Mar, 27</li>
              <li>29602 Marbella · Spain</li>
              <li>
                <a href="tel:+34952000000" className="hover:text-gold-400 transition-colors">
                  +34 952 000 000
                </a>
              </li>
              <li>
                <a
                  href="mailto:house@aurelia-estates.com"
                  className="hover:text-gold-400 transition-colors"
                >
                  house@aurelia-estates.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">Visit</div>
            <ul className="space-y-3 text-sand-200/80 text-sm font-light">
              <li>By appointment only</li>
              <li>Mon — Fri · 10:00 — 19:00</li>
              <li>Sat · 11:00 — 16:00</li>
            </ul>
          </div>
        </div>

        <div className="hairline mb-8" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] tracking-ultra uppercase text-sand-200/50">
          <span>© {new Date().getFullYear()} Aurelia Estates · All rights reserved</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-400 transition-colors">
              Legal
            </a>
            <a href="#" className="hover:text-gold-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gold-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
