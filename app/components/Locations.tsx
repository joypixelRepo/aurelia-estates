'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type Panel = {
  eyebrow: string;
  title: string;
  body: string;
  meta: string;
  image: string;
};

const PANELS: Panel[] = [
  {
    eyebrow: 'Costa del Sol · 01',
    title: 'Marbella',
    body: 'The Golden Mile and Sierra Blanca — where the mountain shelters the sea and the light holds until nine in the evening.',
    meta: 'Beachfront villas · Gated estates',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=80',
  },
  {
    eyebrow: 'Costa del Sol · 02',
    title: 'Sotogrande',
    body: 'Cork oaks, polo fields and a marina that has never needed to raise its voice. The quietest address on the coast.',
    meta: 'Cliffside residences · La Reserva',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=2400&q=80',
  },
  {
    eyebrow: 'Costa del Sol · 03',
    title: 'Benahavís',
    body: 'Ten minutes inland and four hundred metres up. Country estates with the whole bay laid out beneath them.',
    meta: 'Country estates · Panoramic plots',
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2400&q=80',
  },
];

/**
 * La imagen ocupa un 140% del alto del panel y sobresale un 20% por arriba y por
 * abajo. Se desplaza como mucho un 13% de su propio alto — o sea un 18,2% del
 * panel — así que nunca llega a descubrir el borde.
 */
const IMAGE_SHIFT = 13;
const TEXT_SHIFT = 16;

function ParallaxPanel({ panel }: { panel: Panel }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ['0%', '0%'] : [`-${IMAGE_SHIFT}%`, `${IMAGE_SHIFT}%`]
  );
  // El texto va en sentido contrario y más despacio: de ahí la profundidad.
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ['0%', '0%'] : [`${TEXT_SHIFT}%`, `-${TEXT_SHIFT}%`]
  );
  const textOpacity = useTransform(scrollYProgress, [0.08, 0.3, 0.7, 0.92], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-[100svh] w-full overflow-hidden vignette grain">
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform"
      >
        <Image
          src={panel.image}
          alt={`${panel.title} — ${panel.meta}`}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Oscurecido para que el texto se lea sobre cualquier zona de la foto */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 will-change-transform md:px-12 md:pb-32"
      >
        <div className="mb-6 flex items-center gap-4">
          <span className="block h-px w-12 bg-gold-500" />
          <span className="eyebrow">{panel.eyebrow}</span>
        </div>

        <h3 className="font-display text-6xl leading-[0.9] text-sand-50 md:text-8xl lg:text-[9rem]">
          {panel.title}
        </h3>

        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-sand-200/80 md:text-lg">
          {panel.body}
        </p>

        <div className="mt-8 flex items-center gap-4">
          <span className="block h-px w-10 bg-sand-50/30" />
          <span className="text-[11px] uppercase tracking-ultra text-sand-200/60">{panel.meta}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Locations() {
  return (
    <section id="locations" className="relative bg-ink-950">
      {PANELS.map((panel) => (
        <ParallaxPanel key={panel.title} panel={panel} />
      ))}
    </section>
  );
}
