'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PROPERTIES = [
  {
    code: 'AE-01',
    name: 'Villa Solenne',
    location: 'Cascada de Camoján · Marbella',
    type: 'Beachfront villa',
    price: 'POA · €18.4M',
    image:
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
    specs: ['7 Bedrooms', '9 Bathrooms', '1.840 m²', 'Sea view'],
  },
  {
    code: 'AE-02',
    name: 'Casa Lumière',
    location: 'La Reserva · Sotogrande',
    type: 'Cliffside residence',
    price: '€12.9M',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    specs: ['6 Bedrooms', '7 Bathrooms', '1.220 m²', 'Private pool'],
  },
  {
    code: 'AE-03',
    name: 'Atelier Marés',
    location: 'Puente Romano · Marbella',
    type: 'Architect penthouse',
    price: '€7.6M',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    specs: ['4 Bedrooms', '5 Bathrooms', '480 m²', 'Roof terrace'],
  },
  {
    code: 'AE-04',
    name: 'Finca del Viento',
    location: 'Benahavís · Costa del Sol',
    type: 'Country estate',
    price: '€21.0M',
    image:
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1600&q=80',
    specs: ['9 Bedrooms', '11 Bathrooms', '3.400 m²', 'Equestrian'],
  },
];

export default function Properties() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!wrapRef.current) return;

    const ctx = gsap.context(() => {
      // Headline reveal
      const headChars = headRef.current?.querySelectorAll('.split-char');
      if (headChars) {
        gsap.to(headChars, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 80%',
          },
        });
      }

      const cards = gsap.utils.toArray<HTMLElement>('.property-card');
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
            delay: (i % 2) * 0.1,
          }
        );

        // Image parallax inside the card
        const img = card.querySelector('.property-img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  // helper to split chars
  const splitTitle = (text: string) =>
    text.split('').map((c, i) => (
      <span key={i} className="mask">
        <span className="split-char inline-block">{c === ' ' ? ' ' : c}</span>
      </span>
    ));

  return (
    <section
      id="properties"
      ref={sectionRef}
      className="relative bg-ink-950"
    >
      <div ref={wrapRef} className="py-32 md:py-44">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 md:mb-28">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="block h-px w-12 bg-gold-500" />
              <span className="eyebrow">Portfolio · Selected works</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-[7rem] leading-[0.95] text-sand-50">
              {splitTitle('Four houses,')}
              <br />
              <span className="text-gold-400">{splitTitle('one quiet ambition.')}</span>
            </h2>
          </div>
          <p className="max-w-md text-sand-200/70 text-base md:text-lg font-light leading-relaxed">
            Every Aurelia listing is the result of months of negotiation, due diligence and
            on-site review. We work with fewer than a dozen residences at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-20 md:gap-y-32">
          {PROPERTIES.map((p, i) => (
            <article
              key={p.code}
              className={`property-card group relative ${
                i % 2 === 1 ? 'lg:translate-y-32' : ''
              }`}
            >
              <a href="#contact" data-hover className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
                  <div className="property-img absolute inset-0 will-change-transform">
                    <Image
                      src={p.image}
                      alt={`${p.name} — ${p.location}`}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.06]"
                      priority={i < 2}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/20 pointer-events-none" />
                  <div className="absolute top-6 left-6 right-6 flex items-start justify-between text-[11px] tracking-ultra uppercase text-sand-100">
                    <span>{p.code}</span>
                    <span className="text-gold-400">{p.type}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="overflow-hidden">
                      <h3 className="font-display text-3xl md:text-5xl text-sand-50 leading-tight transition-transform duration-700 group-hover:-translate-y-1">
                        {p.name}
                      </h3>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sand-100/80 text-sm">{p.location}</span>
                      <span className="text-gold-400 text-sm tracking-wider">{p.price}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-4 border-t border-white/10 pt-5">
                  {p.specs.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] tracking-ultra uppercase text-sand-200/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-32 flex items-center justify-center">
          <a
            href="#contact"
            data-hover
            className="group inline-flex items-center gap-5 text-sand-50 hover:text-gold-400 transition-colors"
          >
            <span className="block h-px w-16 bg-sand-50/40 group-hover:bg-gold-400 group-hover:w-24 transition-all duration-700" />
            <span className="text-[11px] tracking-ultra uppercase">Request the full portfolio</span>
            <span className="block h-px w-16 bg-sand-50/40 group-hover:bg-gold-400 group-hover:w-24 transition-all duration-700" />
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
