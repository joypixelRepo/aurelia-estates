'use client';

import { useEffect, useRef } from 'react';

export default function LuxCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Hide on touch
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let posX = mouseX;
    let posY = mouseY;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      posX += (mouseX - posX) * 0.18;
      posY += (mouseY - posY) * 0.18;
      cursor.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    let raf = requestAnimationFrame(tick);

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-hover]')) cursor.classList.add('is-hover');
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-hover]')) cursor.classList.remove('is-hover');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={cursorRef} className="lux-cursor hidden md:block" aria-hidden />;
}
