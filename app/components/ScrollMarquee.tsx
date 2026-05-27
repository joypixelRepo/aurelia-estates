'use client';

import { Fragment, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CITIES = [
  'Marbella',
  'Sotogrande',
  'Estepona',
  'Benahavís',
  'Casares',
  'Mijas',
  'Ronda',
  'Nerja',
  'Frigiliana',
  'Fuengirola',
  'Benalmádena',
  'Torremolinos',
  'Antequera',
  'Manilva',
  'Vélez-Málaga',
  'Coín',
  'Alhaurín el Grande',
  'Ojén'
];
const COPIES = 11;
const INITIAL_CITY = 1;       // Sotogrande
const AUTO_SPEED = 220;       // px/sec when auto carousel is running
const IDLE_MS = 1000;         // 1s with no scroll → auto carousel resumes
const WHEEL_THRESHOLD = 8;    // minimum deltaY for a wheel event to advance

export default function ScrollMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let segmentWidth = 0;
    let isVisible = false;
    let idleTimer: number | undefined;
    let autoTween: gsap.core.Tween | null = null;

    const measure = () => {
      segmentWidth = track.scrollWidth / COPIES;
    };

    const wrapValue = (v: number) => {
      if (segmentWidth <= 0) return v;
      let r = v;
      while (r <= -segmentWidth) r += segmentWidth;
      while (r > 0) r -= segmentWidth;
      return r;
    };

    const getX = () => (gsap.getProperty(track, 'x') as number) || 0;

    const centerIndex = (idx: number, animate: boolean) => {
      const word = wordRefs.current[idx];
      if (!word) return;
      const targetX = wrap.offsetWidth / 2 - (word.offsetLeft + word.offsetWidth / 2);
      gsap.killTweensOf(track);
      autoTween = null;
      if (animate) {
        gsap.to(track, { x: targetX, duration: 0.9, ease: 'expo.out' });
      } else {
        gsap.set(track, { x: targetX });
      }
    };

    // Find the word in the given direction that's closest to center but hasn't passed it
    const findNextWord = (dir: 1 | -1) => {
      const wrapCenter = wrap.offsetWidth / 2;
      const currentX = getX();
      let bestIdx = -1;
      let bestDist = Infinity;
      wordRefs.current.forEach((word, i) => {
        if (!word) return;
        const wc = word.offsetLeft + word.offsetWidth / 2 + currentX;
        const off = (wc - wrapCenter) * dir;
        if (off > 1 && off < bestDist) {
          bestDist = off;
          bestIdx = i;
        }
      });
      if (bestIdx >= 0) return bestIdx;
      // Fallback: closest absolute (rare — only if all words are on the opposite side)
      let closestDist = Infinity;
      wordRefs.current.forEach((word, i) => {
        if (!word) return;
        const wc = word.offsetLeft + word.offsetWidth / 2 + currentX;
        const d = Math.abs(wc - wrapCenter);
        if (d < closestDist) {
          closestDist = d;
          bestIdx = i;
        }
      });
      return bestIdx;
    };

    const advance = (dir: 1 | -1) => {
      const idx = findNextWord(dir);
      if (idx < 0) return;
      centerIndex(idx, true);
    };

    const startAuto = () => {
      if (!segmentWidth) measure();
      if (!segmentWidth) return;
      gsap.killTweensOf(track);
      autoTween = gsap.to(track, {
        x: `-=${segmentWidth}`,
        duration: segmentWidth / AUTO_SPEED,
        ease: 'none',
        repeat: -1,
        modifiers: {
          // Wrap x into (-segmentWidth, 0] so the loop is seamless and never drifts
          x: (x) => `${wrapValue(parseFloat(x))}px`,
        },
      });
    };

    const armIdle = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (isVisible) startAuto();
      }, IDLE_MS);
    };

    // Initial position: Sotogrande centred
    const setInitial = () => {
      measure();
      centerIndex(Math.floor(COPIES / 2) * CITIES.length + INITIAL_CITY, false);
    };
    const r1 = requestAnimationFrame(() => requestAnimationFrame(setInitial));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    const io = new IntersectionObserver(
      (entries) => {
        const visibleNow = (entries[0]?.intersectionRatio ?? 0) >= 0.5;
        if (visibleNow && !isVisible) {
          isVisible = true;
          armIdle();
        } else if (!visibleNow && isVisible) {
          isVisible = false;
          if (autoTween) {
            autoTween.kill();
            autoTween = null;
          }
          if (idleTimer) {
            window.clearTimeout(idleTimer);
            idleTimer = undefined;
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    io.observe(wrap);

    const onWheel = (e: WheelEvent) => {
      if (!isVisible) return;
      // Only react to downward scroll. Ignore wheel-up entirely.
      if (e.deltaY < WHEEL_THRESHOLD) return;
      advance(1);
      armIdle();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isVisible) return;
      const dy = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
      // Only react to downward swipes (finger moves up → dy > 0).
      if (dy < 24) return;
      advance(1);
      armIdle();
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(r1);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      io.disconnect();
      if (idleTimer) window.clearTimeout(idleTimer);
      gsap.killTweensOf(track);
    };
  }, []);

  const setWordRef = (i: number) => (el: HTMLSpanElement | null) => {
    wordRefs.current[i] = el;
  };

  return (
    <div ref={wrapRef} className="relative">
      <div
        ref={trackRef}
        className="whitespace-nowrap flex items-center will-change-transform"
      >
        {Array.from({ length: COPIES }).map((_, copy) =>
          CITIES.map((city, i) => {
            const globalIndex = copy * CITIES.length + i;
            return (
              <Fragment key={`${copy}-${i}`}>
                <span
                  ref={setWordRef(globalIndex)}
                  className="font-display text-[14vw] md:text-[10vw] leading-none px-8"
                >
                  {city}
                </span>
                <span className="font-display text-[14vw] md:text-[10vw] leading-none text-gold-400 px-2">
                  ·
                </span>
              </Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}
