'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

// Registrar el plugin de GSAP de forma segura en el cliente
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Longitud del pin. Fija a propósito: si dependiera de la duración del vídeo,
// el pin no existiría hasta que el vídeo termina de descargarse y las secciones
// de abajo medirían mal su posición durante ese rato.
const PIN_END = '+=500%';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fold transform driven by the section's scroll progress (engages near the end)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const foldRotateX = useTransform(scrollYProgress, [0.86, 1], [0, -30]);
  const foldScale = useTransform(scrollYProgress, [0.86, 1], [1, 0.78]);
  const foldOpacity = useTransform(scrollYProgress, [0.86, 1], [1, 0.05]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const video = videoRef.current;
    if (!section || !pin || !video) return;

    // En táctiles no fijamos nada: el hero mide una pantalla y el scroll pasa
    // de largo al instante. Además saltar fotograma a fotograma con currentTime
    // va a tirones en móvil, así que ahí el vídeo se reproduce en bucle.
    //
    // La misma condición está en el className de la sección como
    // '[@media(pointer:fine)]:min-h-[600svh]'. Si cambias una, cambia la otra:
    // reservar 600svh sin pin dejaría 500svh de hueco vacío.
    const wantsScrub =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ctx: gsap.Context | undefined;

    if (wantsScrub) {
      // El pin se crea ya, sin esperar al vídeo: así la altura de la página es
      // la misma desde el primer frame y las secciones de abajo miden bien.
      ctx = gsap.context(() => {
        const scrubbed = { progress: 0 };
        gsap.to(scrubbed, {
          progress: 1,
          ease: 'none',
          onUpdate: () => {
            // El scrub no hace nada hasta que hay metadata del vídeo.
            const duration = video.duration;
            if (!isFinite(duration) || duration <= 0 || video.readyState < 2) return;
            const t = Math.min(duration - 0.001, Math.max(0, scrubbed.progress * duration));
            if (Math.abs(video.currentTime - t) > 0.016) {
              video.currentTime = t;
            }
          },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: PIN_END,
            scrub: 0.6,
            pin: pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, section);
    } else {
      video.loop = true;
    }

    // Cebar el vídeo para que admita seek. No toca el layout.
    //
    // Ojo con iOS: ignora preload="auto" y no descarga nada hasta que se llama
    // a play(). Si esperásemos a 'canplay' para llamarlo nos quedaríamos
    // bloqueados — no hay datos porque no hemos pedido play, y no pedimos play
    // porque no hay datos. Así que lo intentamos ya, y reintentamos en cada
    // evento de carga por si el primer intento se rechazó.
    let warmedUp = false;
    const warmUp = () => {
      if (warmedUp) return;
      const warm = video.play();
      if (warm && typeof warm.then === 'function') {
        warm
          .then(() => {
            warmedUp = true;
            // Si no hacemos scrub, lo dejamos reproduciéndose en bucle.
            if (wantsScrub) video.pause();
          })
          .catch(() => {
            /* Modo de bajo consumo o sin gesto previo: reintentamos al tocar. */
          });
      } else {
        warmedUp = true;
        if (wantsScrub) video.pause();
      }
    };

    warmUp();
    video.addEventListener('loadedmetadata', warmUp);
    video.addEventListener('loadeddata', warmUp);
    video.addEventListener('canplay', warmUp);
    // Último recurso: en modo de bajo consumo iOS bloquea toda reproducción
    // automática, y solo la desbloquea un gesto del usuario.
    window.addEventListener('touchstart', warmUp, { once: true, passive: true });

    return () => {
      video.removeEventListener('loadedmetadata', warmUp);
      video.removeEventListener('loadeddata', warmUp);
      video.removeEventListener('canplay', warmUp);
      window.removeEventListener('touchstart', warmUp);
      ctx?.revert();
    };
  }, []);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      // Reserva la altura del pin para que la página no cambie de alto al
      // hidratar. Solo con puntero fino: en táctiles no hay pin (ver el efecto).
      className="relative w-full [@media(pointer:fine)]:min-h-[600svh]"
    >
      <div
        ref={pinRef}
        className="h-[100svh] w-full relative overflow-hidden vignette grain"
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
          {/* Background video: scrub por scroll en escritorio, bucle en tactiles */}
          <video
            ref={videoRef}
            src="/hero-video.mp4"
            poster="/hero-poster.jpg"
            // autoPlay es lo que hace que iOS se digne a descargar el vídeo:
            // ignora preload="auto", pero sí respeta autoplay si va muted +
            // playsInline. El scrub lo pausa en cuanto arranca.
            autoPlay
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/55 via-ink-950/15 to-ink-950/25 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,12,0.55)_100%)] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-b from-transparent via-ink-950/80 to-ink-950 pointer-events-none" />

          {/* Content overlay */}
          <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-between pt-32 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4"
            >
              <span className="block h-px w-12 bg-gold-500" />
              <span className="eyebrow">Marbella · Sotogrande · Costa del Sol</span>
            </motion.div>

            <div className="max-w-5xl">
              <h1 className="font-display text-[14vw] md:text-[10vw] lg:text-[7.5vw] leading-[0.95] tracking-tight text-sand-50">
                {['Where', 'the', 'sea', 'meets', 'silence.'].map((word, i) => (
                  <span key={i} className="mask">
                    <motion.span
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: 1.4,
                        delay: 0.9 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block pr-[0.25em]"
                    >
                      {i === 4 ? <em className="not-italic text-gold-400">{word}</em> : word}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 max-w-xl text-sand-200/85 text-base md:text-lg leading-relaxed font-light"
              >
                A private portfolio of beachfront villas, cliffside residences and investment estates
                on the Spanish Mediterranean — curated for those who choose with intention.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex flex-wrap items-center gap-5"
              >
                <button
                  type="button"
                  data-hover
                  onClick={() => scrollTo('properties')}
                  className="group inline-flex items-center gap-4 bg-gold-500 hover:bg-gold-400 text-ink-950 px-8 py-4 text-[11px] tracking-ultra uppercase transition-all duration-500"
                >
                  View the Portfolio
                  <span className="block h-px w-8 bg-ink-950 group-hover:w-12 transition-all" />
                </button>
                <button
                  type="button"
                  data-hover
                  onClick={() => scrollTo('process')}
                  className="text-[11px] tracking-ultra uppercase text-sand-100 hover:text-gold-400 transition-colors"
                >
                  Begin the journey →
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.4 }}
              className="flex items-end justify-between"
            >
              <div className="flex items-center gap-3 text-sand-200/70 text-[11px] tracking-ultra uppercase">
                <span className="block h-px w-8 bg-sand-200/60 animate-pulse" />
                Scroll to play
              </div>
              <div className="hidden md:flex items-center gap-12 text-sand-200/80">
                <div>
                  <div className="font-display text-3xl text-sand-50">€2.4B</div>
                  <div className="eyebrow mt-1">Curated Volume</div>
                </div>
                <div>
                  <div className="font-display text-3xl text-sand-50">14</div>
                  <div className="eyebrow mt-1">Years on the Coast</div>
                </div>
                <div>
                  <div className="font-display text-3xl text-sand-50">37</div>
                  <div className="eyebrow mt-1">Private Clients</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
