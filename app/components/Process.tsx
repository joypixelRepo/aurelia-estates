'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar el plugin de GSAP de forma segura en el cliente
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ProcessScene3D = dynamic(() => import('./ProcessScene3D'), { ssr: false });

const STEPS = [
  {
    icon: 'Compass',
    title: 'The Brief',
    body:
      'A private call to map intention, calendar and constraints. Nothing is searched until we know exactly what you are searching for.',
  },
  {
    icon: 'Folio',
    title: 'The Shortlist',
    body:
      'Within a week, we return with three to five residences — half of which are off-market and unseen on any public portal.',
  },
  {
    icon: 'Pin',
    title: 'The Visit',
    body:
      'Discreet, accompanied viewings. Mornings for villas, late afternoons for terraces. No competing agents in the room.',
  },
  {
    icon: 'Pen',
    title: 'The Offer',
    body:
      'We negotiate price, conditions and timing on your behalf — usually two to three measured rounds before agreement.',
  },
  {
    icon: 'Deed',
    title: 'The Deed',
    body:
      'Aurelia coordinates notary, bank, lawyers and architect. You sign once, in one room. We attend everything else.',
  },
  {
    icon: 'Key',
    title: 'The Keys',
    body:
      'Handover, household setup, security, staffing — and the first dinner at the new table. The relationship continues from here.',
  },
];

const PIN_END = '+=500%';
const WHEEL_COMPLETE_AT = 0.82;

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

    let ctx: gsap.Context;

    // Función contenedora de la lógica de inicialización de GSAP
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
            const wheelProgress = Math.min(1, self.progress / WHEEL_COMPLETE_AT);
            progressRef.current = wheelProgress;

            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${wheelProgress})`;
            }

            const idx = Math.max(
              0,
              Math.min(STEPS.length - 1, Math.round(wheelProgress * (STEPS.length - 1)))
            );
            setActiveStep((prev) => (prev === idx ? prev : idx));
          },
        });
      }, sectionRef);
    };

    // SOLUCIÓN AL MODO INCÓGNITO: Esperar a que las fuentes alteren el DOM antes de medir
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
          initScrollTrigger();
          ScrollTrigger.refresh();
        });
      });
    } else {
      // Fallback para entornos donde document.fonts no esté disponible
      const handleLoad = () => {
        initScrollTrigger();
        ScrollTrigger.refresh();
      };
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section 
      id="process" 
      ref={sectionRef} 
      className="relative bg-black"
      style={{ minHeight: '600vh' }}
    >
      <div
        ref={pinRef}
        className="h-screen w-full relative overflow-hidden"
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,163,104,0.08),transparent_60%)] pointer-events-none" />

          <div className="relative h-full max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-28 pb-12 lg:py-0">
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

            {/* Optimización de desbordamiento en el contenedor 3D */}
            <div className="lg:col-span-7 relative order-1 lg:order-2 h-[55svh] lg:h-full bg-black overflow-hidden">
              <ProcessScene3D progressRef={progressRef} />
              <div className="absolute inset-x-12 bottom-12 h-32 bg-[radial-gradient(ellipse_at_center,rgba(201,163,104,0.18),transparent_70%)] pointer-events-none" />
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 px-6 md:px-12 pb-6">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between text-[10px] tracking-ultra uppercase text-sand-200/40 mb-2">
                <span>Scroll · the wheel turns</span>
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
