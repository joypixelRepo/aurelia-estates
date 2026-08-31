'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProcessGallery, { GallerySlide } from './ProcessGallery';

// Registrar el plugin de GSAP de forma segura en el cliente
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Step = GallerySlide & { body: string };

const STEPS: Step[] = [
  {
    title: 'The Brief',
    meta: 'Private call',
    caption: 'Intention, calendar and constraints — mapped before a single search begins.',
    body: 'A private call to map intention, calendar and constraints. Nothing is searched until we know exactly what you are searching for.',
    image:
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'The Shortlist',
    meta: 'Off-market',
    caption: 'Three to five residences, half of them never listed on a public portal.',
    body: 'Within a week, we return with three to five residences — half of which are off-market and unseen on any public portal.',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'The Visit',
    meta: 'Accompanied',
    caption: 'Mornings for villas, late afternoons for terraces. No competing agents.',
    body: 'Discreet, accompanied viewings. Mornings for villas, late afternoons for terraces. No competing agents in the room.',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'The Offer',
    meta: 'Negotiation',
    caption: 'Price, conditions and timing — two or three measured rounds.',
    body: 'We negotiate price, conditions and timing on your behalf — usually two to three measured rounds before agreement.',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'The Deed',
    meta: 'Notary',
    caption: 'Notary, bank, lawyers and architect coordinated into a single signature.',
    body: 'Aurelia coordinates notary, bank, lawyers and architect. You sign once, in one room. We attend everything else.',
    image:
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'The Keys',
    meta: 'Handover',
    caption: 'Household setup, security, staffing — and the first dinner at the new table.',
    body: 'Handover, household setup, security, staffing — and the first dinner at the new table. The relationship continues from here.',
    image:
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80',
  },
];

const PIN_END = '+=500%';
const GALLERY_COMPLETE_AT = 0.82;

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const [activeStep, setActiveStep] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const foldRotateX = useTransform(scrollYProgress, [0.88, 1], [0, -30]);
  const foldScale = useTransform(scrollYProgress, [0.88, 1], [1, 0.78]);
  const foldOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0.08]);

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const initScrollTrigger = () => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: PIN_END,
          scrub: 0.5,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const galleryProgress = Math.min(1, self.progress / GALLERY_COMPLETE_AT);
            progressRef.current = galleryProgress;

            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${galleryProgress})`;
            }

            const idx = Math.max(
              0,
              Math.min(STEPS.length - 1, Math.round(galleryProgress * (STEPS.length - 1)))
            );
            setActiveStep((prev) => (prev === idx ? prev : idx));
          },
        });
      }, sectionRef);
    };

    // Solo esperamos a las fuentes, que sí cambian la altura del texto de arriba.
    // Las imágenes no: todas van en cajas de proporción fija, así que cargar no
    // mueve el layout. (Esperarlas además nunca terminaba: las de abajo son
    // lazy y no disparan 'load' hasta que entran en pantalla.)
    const start = () => {
      if (cancelled) return;
      initScrollTrigger();
      ScrollTrigger.refresh();
    };

    if ('fonts' in document) {
      document.fonts.ready.then(() => requestAnimationFrame(start));
    } else {
      start();
    }

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative bg-black"
      // Reserva la altura del pin antes de que GSAP arranque (la inicialización
      // está diferida hasta document.fonts.ready), para que no dé un salto.
      style={{ minHeight: '600svh' }}
    >
      <div
        ref={pinRef}
        className="h-[100svh] w-full relative overflow-hidden"
        style={{ perspective: 1800 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            rotateX: foldRotateX,
            scale: foldScale,
            opacity: foldOpacity,
            transformOrigin: '50% 0%',
            transformPerspective: 1800,
            willChange: 'transform, opacity',
          }}
        >
          {/* Ambient gradient backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,163,104,0.08),transparent_60%)] pointer-events-none" />

          <div className="relative h-full max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-28 pb-12 lg:py-0">
            {/* Text panel */}
            <div className="lg:col-span-5 lg:col-start-1 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                <span className="block h-px w-12 bg-gold-500" />
                <span className="eyebrow">The Aurelia Process</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-[5rem] leading-[1.02] text-sand-50 mb-4">
                Six measured steps
                <br />
                <span className="text-gold-400 italic font-light">to a residence that lasts.</span>
              </h2>
              <p className="text-sand-200/70 text-sm md:text-base font-light leading-relaxed mb-10 max-w-md">
                From the first private call to the moment the keys turn — every stage is choreographed,
                documented and quietly attended to by the house.
              </p>

              {/* Step content (crossfade) */}
              <div className="relative min-h-[200px] md:min-h-[220px]">
                {STEPS.map((s, i) => (
                  <div
                    key={s.title}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      i === activeStep
                        ? 'opacity-100 translate-y-0'
                        : i < activeStep
                        ? 'opacity-0 -translate-y-6 pointer-events-none'
                        : 'opacity-0 translate-y-6 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="font-display text-5xl md:text-6xl text-gold-400 leading-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="eyebrow">Step / 06</span>
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl text-sand-50 mb-3">
                      {s.title}
                    </h3>
                    <p className="text-sand-200/80 text-sm md:text-base font-light leading-relaxed max-w-md">
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Step indicators */}
              <div className="flex items-center gap-2 mt-10">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-px transition-all duration-500 ${
                      i === activeStep
                        ? 'w-14 bg-gold-500'
                        : i < activeStep
                        ? 'w-6 bg-sand-50/40'
                        : 'w-6 bg-sand-50/10'
                    }`}
                  />
                ))}
                <span className="ml-4 text-[10px] tracking-ultra uppercase text-sand-200/50">
                  {String(activeStep + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Horizontal parallax gallery panel */}
            <div className="lg:col-span-7 relative order-1 lg:order-2 h-[55svh] lg:h-full overflow-hidden">
              <div className="absolute inset-0 lg:py-24">
                <ProcessGallery slides={STEPS} progressRef={progressRef} />
              </div>
              {/* Soft glow under the strip */}
              <div className="absolute inset-x-12 bottom-12 h-32 bg-[radial-gradient(ellipse_at_center,rgba(201,163,104,0.18),transparent_70%)] pointer-events-none" />
            </div>
          </div>

          {/* Bottom: overall progress bar */}
          <div className="absolute bottom-0 inset-x-0 px-6 md:px-12 pb-6">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between text-[10px] tracking-ultra uppercase text-sand-200/40 mb-2">
                <span>Scroll · the sequence advances</span>
                <span>Process · Aurelia Estates</span>
              </div>
              <div className="relative h-px bg-sand-50/10 overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="absolute inset-y-0 left-0 right-0 origin-left bg-gold-500"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
