'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import dinámico del componente 3D
const ProcessScene3D = dynamic(
  () => import('./ProcessScene3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-black to-gold-900/20 rounded-2xl animate-pulse" />
    )
  }
);

const STEPS = [
  {
    icon: 'Compass',
    title: 'The Brief',
    body: 'A private call to map intention, calendar and constraints. Nothing is searched until we know exactly what you are searching for.',
  },
  {
    icon: 'Folio',
    title: 'The Shortlist',
    body: 'Within a week, we return with three to five residences — half of which are off-market and unseen on any public portal.',
  },
  {
    icon: 'Pin',
    title: 'The Visit',
    body: 'Discreet, accompanied viewings. Mornings for villas, late afternoons for terraces. No competing agents in the room.',
  },
  {
    icon: 'Pen',
    title: 'The Offer',
    body: 'We negotiate price, conditions and timing on your behalf — usually two to three measured rounds before agreement.',
  },
  {
    icon: 'Deed',
    title: 'The Deed',
    body: 'Aurelia coordinates notary, bank, lawyers and architect. You sign once, in one room. We attend everything else.',
  },
  {
    icon: 'Key',
    title: 'The Keys',
    body: 'Handover, household setup, security, staffing — and the first dinner at the new table. The relationship continues from here.',
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const [activeStep, setActiveStep] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  
  const foldRotateX = useTransform(scrollYProgress, [0.88, 1], [0, -30]);
  const foldScale = useTransform(scrollYProgress, [0.88, 1], [1, 0.78]);
  const foldOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0.08]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Control de scroll manual sin GSAP
  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    
    // Altura total del scroll dentro de la sección
    const scrollHeight = window.innerHeight * 5; // 500% como el PIN_END
    
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const sectionTop = section.offsetTop;
      
      // Progreso del scroll dentro de la sección
      let progress = (scrollTop - sectionTop) / scrollHeight;
      progress = Math.max(0, Math.min(1, progress));
      
      // El wheel se completa al 82% del scroll total
      const wheelProgress = Math.min(1, progress / 0.82);
      progressRef.current = wheelProgress;
      setScrollProgress(wheelProgress);
      
      // Actualizar barra de progreso
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${wheelProgress})`;
      }
      
      // Actualizar step activo
      const idx = Math.max(
        0,
        Math.min(STEPS.length - 1, Math.floor(wheelProgress * STEPS.length))
      );
      setActiveStep(idx);
      
      // Aplicar transformaciones al container
      if (progress >= 0.88) {
        const foldProgress = (progress - 0.88) / 0.12;
        const rotate = foldProgress * -30;
        const scale = 1 - foldProgress * 0.22;
        const opacity = 1 - foldProgress * 0.92;
        
        container.style.transform = `rotateX(${rotate}deg) scale(${scale})`;
        container.style.opacity = String(Math.max(0, opacity));
      } else {
        container.style.transform = 'rotateX(0deg) scale(1)';
        container.style.opacity = '1';
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamada inicial
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="process" 
      ref={sectionRef} 
      className="relative bg-black"
      style={{ height: '500vh' }}
    >
      <div 
        ref={containerRef}
        className="fixed top-0 left-0 w-full h-screen overflow-hidden"
        style={{ 
          perspective: 1800,
          transformOrigin: '50% 0%',
          willChange: 'transform, opacity'
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

          {/* 3D wheel panel */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 h-[55svh] lg:h-full bg-black rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              {isMounted && <ProcessScene3D progressRef={progressRef} />}
            </div>
            {/* Soft glow under wheel */}
            <div className="absolute inset-x-12 bottom-12 h-32 bg-[radial-gradient(ellipse_at_center,rgba(201,163,104,0.18),transparent_70%)] pointer-events-none" />
          </div>
        </div>

        {/* Bottom: overall progress bar */}
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
      </div>
    </section>
  );
}