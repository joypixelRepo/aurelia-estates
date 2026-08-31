'use client';

import Image from 'next/image';
import { MutableRefObject, useEffect, useRef } from 'react';

export type GallerySlide = {
  title: string;
  meta: string;
  caption: string;
  image: string;
};

type ProcessGalleryProps = {
  slides: GallerySlide[];
  /** 0 → 1 scroll progress, written by the pinned ScrollTrigger in <Process />. */
  progressRef: MutableRefObject<number>;
};

/**
 * Editorial rhythm for the filmstrip: each frame gets its own width, height and
 * vertical drift so the row never reads as a uniform carousel. Cycled, so the
 * pattern survives any number of slides.
 */
const LAYOUT = [
  { w: 'clamp(240px, 30vw, 420px)', h: '78%', y: 0 },
  { w: 'clamp(300px, 38vw, 520px)', h: '62%', y: -7 },
  { w: 'clamp(220px, 26vw, 360px)', h: '86%', y: 5 },
  { w: 'clamp(280px, 34vw, 460px)', h: '66%', y: -4 },
  { w: 'clamp(240px, 30vw, 400px)', h: '80%', y: 7 },
  { w: 'clamp(320px, 40vw, 560px)', h: '70%', y: -2 },
];

const LERP = 0.1; // track easing towards the scroll position
const VEL_LERP = 0.18; // velocity smoothing, feeds the momentum skew
const PARALLAX = 0.12; // inner image travel, as a fraction of its frame width
const GHOST_SPEED = 0.3; // background numerals — slowest layer
const FORE_SPEED = 1.2; // foreground hairlines — fastest layer
const SKEW_MAX = 3.5;
const SKEW_GAIN = 420;
const FOCUS_RANGE = 0.6; // distance from centre (in viewport widths) that still reads as "active"

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function ProcessGallery({ slides, progressRef }: ProcessGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const foreRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current = 0;
    let velocity = 0;
    let frame = 0;

    /**
     * Track offset for a given progress value. Instead of sliding the strip by a
     * flat "scrollWidth - viewport", we interpolate between slide *centres*: at
     * p = i/(n-1) frame i sits dead centre, which keeps the strip locked to the
     * step copy in the left column even though every frame has a different width.
     * The per-segment smoothstep makes each image settle before moving on.
     */
    const offsetFor = (p: number) => {
      const viewport = root.clientWidth;
      const centreOf = (i: number) => {
        const slide = slideRefs.current[i];
        return slide ? slide.offsetLeft + slide.offsetWidth / 2 : 0;
      };
      const last = slideRefs.current.length - 1;
      if (last < 1) return viewport / 2 - centreOf(0);

      const seg = clamp(p, 0, 1) * last;
      const i = Math.min(last - 1, Math.floor(seg));
      const t = clamp(seg - i, 0, 1);
      const eased = reduced ? t : t * t * (3 - 2 * t);
      return viewport / 2 - (centreOf(i) + (centreOf(i + 1) - centreOf(i)) * eased);
    };

    const draw = () => {
      const viewport = root.clientWidth;
      const x = offsetFor(current);

      const skew = reduced ? 0 : clamp(velocity * SKEW_GAIN, -SKEW_MAX, SKEW_MAX);
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(3)}deg)`;

      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate3d(${(x * GHOST_SPEED).toFixed(2)}px, 0, 0)`;
      }
      if (foreRef.current) {
        foreRef.current.style.transform = `translate3d(${(x * FORE_SPEED).toFixed(2)}px, 0, 0)`;
      }

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        const width = slide.offsetWidth;
        const centre = slide.offsetLeft + width / 2 + x;
        const rel = clamp((centre - viewport / 2) / viewport, -1.4, 1.4);
        const focus = 1 - Math.min(1, Math.abs(rel) / FOCUS_RANGE);
        const { y } = LAYOUT[i % LAYOUT.length];

        slide.style.transform = `translate3d(0, ${y}%, 0) scale(${(0.9 + 0.1 * focus).toFixed(4)})`;
        slide.style.filter = `brightness(${(0.42 + 0.58 * focus).toFixed(3)}) saturate(${(
          0.5 +
          0.5 * focus
        ).toFixed(3)})`;
        slide.style.zIndex = String(10 + Math.round(focus * 10));

        const media = slide.querySelector<HTMLElement>('.pg-media');
        if (media) {
          media.style.transform = `translate3d(${(-rel * PARALLAX * width).toFixed(2)}px, 0, 0)`;
        }

        const caption = slide.querySelector<HTMLElement>('.pg-caption');
        if (caption) {
          caption.style.opacity = (0.06 + 0.94 * focus).toFixed(3);
          caption.style.transform = `translate3d(0, ${((1 - focus) * 24).toFixed(2)}px, 0)`;
        }
      });
    };

    const tick = () => {
      const target = clamp(progressRef.current || 0, 0, 1);
      const previous = current;
      current += (target - current) * (reduced ? 1 : LERP);
      const delta = current - previous;
      velocity += (delta - velocity) * VEL_LERP;
      draw();
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const observer = new ResizeObserver(() => draw());
    observer.observe(root);
    observer.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [progressRef, slides.length]);

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden bg-ink-950">
      {/* Layer 1 — oversized numerals drifting at a third of the speed */}
      <div
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-0 flex w-max select-none items-center gap-[16vw] px-[12vw] will-change-transform"
      >
        {slides.map((s, i) => (
          <span
            key={`ghost-${s.title}`}
            className="font-display text-[26vh] leading-none text-transparent"
            style={{ WebkitTextStroke: '1px rgba(201,163,104,0.16)' }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Layer 2 — the filmstrip */}
      <div
        ref={trackRef}
        className="absolute inset-y-0 left-0 z-10 flex w-max items-center gap-[clamp(20px,4vw,72px)] px-[clamp(16px,3vw,56px)] will-change-transform"
      >
        {slides.map((slide, i) => {
          const layout = LAYOUT[i % LAYOUT.length];
          return (
            <figure
              key={slide.title}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="relative shrink-0 overflow-hidden bg-ink-900 will-change-transform"
              style={{
                width: layout.w,
                height: layout.h,
                transform: `translate3d(0, ${layout.y}%, 0)`,
              }}
            >
              <div className="pg-media absolute -inset-x-[14%] inset-y-0 will-change-transform">
                <Image
                  src={slide.image}
                  alt={`${slide.title} — ${slide.meta}`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 80vw"
                  className="object-cover"
                  priority={i < 2}
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/5 to-ink-950/35" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-sand-50/10" />

              <div className="absolute inset-x-5 top-5 flex items-center justify-between text-[10px] uppercase tracking-ultra text-sand-100/80">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span className="text-gold-400">{slide.meta}</span>
              </div>

              <figcaption className="pg-caption absolute inset-x-0 bottom-0 p-5 will-change-transform md:p-7">
                <h4 className="font-display text-2xl leading-tight text-sand-50 md:text-4xl">
                  {slide.title}
                </h4>
                <p className="mt-2 max-w-[34ch] text-[11px] font-light leading-relaxed text-sand-200/70 md:text-xs">
                  {slide.caption}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* Layer 3 — hairlines sweeping past faster than the frames */}
      <div
        ref={foreRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-20 flex w-max items-stretch gap-[24vw] px-[18vw] will-change-transform"
      >
        {slides.map((s) => (
          <span
            key={`line-${s.title}`}
            className="w-px bg-gradient-to-b from-transparent via-gold-500/25 to-transparent"
          />
        ))}
      </div>

      {/* Cinematic edge falloff + grain */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[14%] bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-[14%] bg-gradient-to-l from-ink-950 to-transparent" />
      <div className="grain pointer-events-none absolute inset-0 z-30" />
    </div>
  );
}
