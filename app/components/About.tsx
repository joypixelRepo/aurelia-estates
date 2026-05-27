'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const STATS = [
  { value: '€2.4B', label: 'Curated transaction volume' },
  { value: '14', label: 'Years on the Costa del Sol' },
  { value: '37', label: 'Active private clients' },
  { value: '9', label: 'Languages spoken in-house' },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<HTMLDivElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  // Fold transform near end of section
  const foldProgress = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  }).scrollYProgress;
  const foldRotateX = useTransform(foldProgress, [0.82, 1], [0, -32]);
  const foldScale = useTransform(foldProgress, [0.82, 1], [1, 0.78]);
  const foldOpacity = useTransform(foldProgress, [0.82, 1], [1, 0.05]);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { y: '110%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: i * 0.06,
            scrollTrigger: { trigger: line, start: 'top 85%' },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.about-stat').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: 'top 90%' },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const setLineRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) lineRefs.current[i] = el;
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative bg-ink-950 overflow-hidden"
      style={{ perspective: 1800 }}
    >
      <motion.div
        className="py-32 md:py-44"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <motion.div
            ref={imageWrapRef}
            className="lg:col-span-5 relative aspect-[3/4] overflow-hidden"
          >
            <motion.div
              style={{ y: imgY, scale: imgScale }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80"
                alt="The Aurelia House — interior"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[11px] tracking-ultra uppercase text-sand-100">
              <span>The Aurelia House</span>
              <span className="text-gold-400">Marbella · 2011</span>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8">
              <span className="block h-px w-12 bg-gold-500" />
              <span className="eyebrow">The House</span>
            </div>

            <h2 className="font-display text-4xl md:text-6xl lg:text-[5rem] leading-[1.05] text-sand-50 mb-12">
              <div className="mask">
                <div ref={setLineRef(0)} className="inline-block">
                  We do not sell houses.
                </div>
              </div>
              <div className="mask">
                <div ref={setLineRef(1)} className="inline-block text-gold-400 italic font-light">
                  We place lives.
                </div>
              </div>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <p className="text-sand-200/80 text-base md:text-lg font-light leading-relaxed">
                Aurelia Estates was founded in 2011 by a small group of architects, lawyers and
                long-time residents of the Costa del Sol — united by one frustration: that the
                most beautiful homes on the coast were being sold like commodities.
              </p>
              <p className="text-sand-200/80 text-base md:text-lg font-light leading-relaxed">
                Today, we represent fewer than fourteen residences at a time. Each is documented
                in person, photographed in natural light, and offered only to clients we have met
                in conversation. It is the slowest way to sell real estate. It is also, we
                believe, the only honest one.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10">
              {STATS.map((s) => (
                <div key={s.label} className="about-stat">
                  <div className="font-display text-4xl md:text-5xl text-sand-50">{s.value}</div>
                  <div className="eyebrow mt-2 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </section>
  );
}
