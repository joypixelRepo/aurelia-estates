'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SERVICES = [
  {
    n: '01',
    title: 'Private Acquisitions',
    body:
      'Off-market sourcing of villas, estates and trophy assets across the Mediterranean coast — with full legal, tax and architectural due diligence.',
  },
  {
    n: '02',
    title: 'Investment Advisory',
    body:
      'Long-horizon investment strategies for HNW and family offices, from beachfront land banking to boutique hotel conversions.',
  },
  {
    n: '03',
    title: 'Architecture & Interiors',
    body:
      'In-house collaboration with award-winning studios in Madrid, Milan and Marrakech — from cosmetic refresh to full ground-up construction.',
  },
  {
    n: '04',
    title: 'Relocation & Residency',
    body:
      'Discreet support for Golden Visa, Beckham Law and family relocation, including schooling, security, and household staffing.',
  },
  {
    n: '05',
    title: 'Yacht & Aviation Liaison',
    body:
      'Coordinated berthing at Puerto Banús, Sotogrande and Gibraltar, plus private aviation through partner FBOs in Málaga and Marbella.',
  },
  {
    n: '06',
    title: 'Estate Management',
    body:
      'Year-round household, maintenance, security and concierge for non-resident owners. Your house, kept exactly as you left it.',
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const foldRotateX = useTransform(scrollYProgress, [0.82, 1], [0, -32]);
  const foldScale = useTransform(scrollYProgress, [0.82, 1], [1, 0.78]);
  const foldOpacity = useTransform(scrollYProgress, [0.82, 1], [1, 0.05]);

  // Parallax background — moves slower than the section itself
  const bgProgress = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  }).scrollYProgress;
  const bgY = useTransform(bgProgress, [0, 1], ['-12%', '12%']);
  const bgScale = useTransform(bgProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      if (headRef.current) {
        gsap.fromTo(
          headRef.current.querySelectorAll('.split-char'),
          { y: '110%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 1,
            stagger: 0.015,
            ease: 'power3.out',
            scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>('.svc-row').forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 85%' },
          }
        );

        const underline = row.querySelector('.svc-underline');
        if (underline) {
          gsap.fromTo(
            underline,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.6,
              ease: 'power3.out',
              scrollTrigger: { trigger: row, start: 'top 85%' },
            }
          );
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const splitChars = (text: string) =>
    text.split('').map((c, i) => (
      <span key={i} className="mask">
        <span className="split-char inline-block">{c === ' ' ? ' ' : c}</span>
      </span>
    ));

  return (
    <section
      id="services"
      ref={ref}
      className="relative bg-ink-900 overflow-hidden"
      style={{ perspective: 1800 }}
    >
      {/* Parallax background image */}
      <motion.div
        aria-hidden
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 will-change-transform pointer-events-none"
      >
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
        {/* Darkening overlay so the content stays legible */}
        <div className="absolute inset-0 bg-ink-950/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/70 to-ink-950" />
      </motion.div>

      <motion.div
        className="relative py-32 md:py-44"
        style={{
          rotateX: foldRotateX,
          scale: foldScale,
          opacity: foldOpacity,
          transformOrigin: '50% 0%',
          transformPerspective: 1800,
          willChange: 'transform, opacity',
        }}
      >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 md:mb-28">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-6">
              <span className="block h-px w-12 bg-gold-500" />
              <span className="eyebrow">Services · A complete house</span>
            </div>
            <h2
              ref={headRef}
              className="font-display text-5xl md:text-7xl lg:text-[6rem] leading-[0.98] text-sand-50"
            >
              {splitChars('Six disciplines.')}
              <br />
              <span className="text-gold-400">{splitChars('One quiet team.')}</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pl-10 self-end">
            <p className="text-sand-200/80 text-base md:text-lg font-light leading-relaxed">
              Aurelia is structured as a private house rather than a brokerage. Every client is
              assigned a single partner, supported by specialists in law, design and finance —
              and bound by a written code of discretion.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10">
          {SERVICES.map((s) => (
            <div
              key={s.n}
              className="svc-row group relative grid grid-cols-12 gap-6 py-10 md:py-14 cursor-default"
              data-hover
            >
              <div className="col-span-2 md:col-span-1 eyebrow text-gold-400">{s.n}</div>
              <h3 className="col-span-10 md:col-span-4 font-display text-2xl md:text-4xl text-sand-50 transition-transform duration-700 group-hover:translate-x-2">
                {s.title}
              </h3>
              <p className="col-span-12 md:col-span-6 md:col-start-7 text-sand-200/70 text-sm md:text-base font-light leading-relaxed">
                {s.body}
              </p>
              <span className="svc-underline absolute bottom-0 left-0 right-0 h-px bg-white/10 origin-left" />
              <span className="absolute bottom-0 left-0 right-0 h-px bg-gold-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
      </motion.div>
    </section>
  );
}
