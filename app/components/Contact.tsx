'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const foldRotateX = useTransform(scrollYProgress, [0.85, 1], [0, -28]);
  const foldScale = useTransform(scrollYProgress, [0.85, 1], [1, 0.82]);
  const foldOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0.1]);

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
            duration: 1.1,
            stagger: 0.02,
            ease: 'power3.out',
            scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>('.contact-field').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 90%' },
          }
        );
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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // No backend — simulate a soft confirmation
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-ink-950"
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
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <span className="block h-px w-12 bg-gold-500" />
              <span className="eyebrow">Contact · By appointment</span>
            </div>
            <h2
              ref={headRef}
              className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-sand-50 mb-10"
            >
              {splitChars('Begin the')}
              <br />
              <span className="text-gold-400">{splitChars('conversation.')}</span>
            </h2>

            <p className="text-sand-200/75 text-base md:text-lg font-light leading-relaxed mb-12 max-w-md">
              Every introduction begins with a private call. Share a few words about what you are
              looking for — or simply what draws you to the coast — and we will respond within
              twenty-four hours.
            </p>

            <div className="space-y-6 text-sand-200/80">
              <div>
                <div className="eyebrow mb-1.5">House Marbella</div>
                <div className="font-light">Avenida del Mar, 27 · 29602 Marbella, Spain</div>
              </div>
              <div>
                <div className="eyebrow mb-1.5">Direct</div>
                <a
                  href="tel:+34952000000"
                  data-hover
                  className="font-light hover:text-gold-400 transition-colors"
                >
                  +34 952 000 000
                </a>
              </div>
              <div>
                <div className="eyebrow mb-1.5">Mail</div>
                <a
                  href="mailto:house@aurelia-estates.com"
                  data-hover
                  className="font-light hover:text-gold-400 transition-colors"
                >
                  house@aurelia-estates.com
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {!submitted ? (
              <form onSubmit={onSubmit} className="space-y-10">
                <div className="contact-field">
                  <label htmlFor="name" className="eyebrow block mb-3">
                    01 · Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Alessandro Marés"
                    className="w-full bg-transparent border-b border-white/15 focus:border-gold-500 outline-none py-3 text-lg md:text-xl text-sand-50 placeholder:text-sand-50/25 transition-colors"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email" className="eyebrow block mb-3">
                    02 · Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="alessandro@private.com"
                    className="w-full bg-transparent border-b border-white/15 focus:border-gold-500 outline-none py-3 text-lg md:text-xl text-sand-50 placeholder:text-sand-50/25 transition-colors"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="interest" className="eyebrow block mb-3">
                    03 · Area of interest
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    defaultValue=""
                    className="w-full bg-transparent border-b border-white/15 focus:border-gold-500 outline-none py-3 text-lg md:text-xl text-sand-50 transition-colors"
                  >
                    <option value="" disabled className="bg-ink-900">
                      Select one…
                    </option>
                    <option className="bg-ink-900" value="acquisition">
                      Private acquisition
                    </option>
                    <option className="bg-ink-900" value="investment">
                      Investment advisory
                    </option>
                    <option className="bg-ink-900" value="relocation">
                      Relocation & residency
                    </option>
                    <option className="bg-ink-900" value="other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="contact-field">
                  <label htmlFor="message" className="eyebrow block mb-3">
                    04 · A few words
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us, briefly, what brings you to the coast."
                    className="w-full bg-transparent border-b border-white/15 focus:border-gold-500 outline-none py-3 text-lg md:text-xl text-sand-50 placeholder:text-sand-50/25 transition-colors resize-none"
                  />
                </div>

                <div className="contact-field flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
                  <label className="flex items-center gap-3 text-sand-200/70 text-sm font-light">
                    <input
                      type="checkbox"
                      required
                      className="accent-gold-500 w-4 h-4"
                    />
                    I agree to the discreet handling of my data.
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    data-hover
                    className="group inline-flex items-center gap-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-ink-950 px-8 py-4 text-[11px] tracking-ultra uppercase transition-all duration-500"
                  >
                    {loading ? 'Sending…' : 'Send introduction'}
                    <span className="block h-px w-8 bg-ink-950 group-hover:w-12 transition-all" />
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="border border-gold-500/40 p-10 md:p-14"
              >
                <div className="eyebrow mb-4">Received with thanks</div>
                <h3 className="font-display text-4xl md:text-5xl text-sand-50 mb-6">
                  We will be in touch within twenty-four hours.
                </h3>
                <p className="text-sand-200/80 font-light leading-relaxed max-w-lg">
                  A partner will read your message personally. In the meantime, you may wish to
                  re-read Chapter II of the journey — it remains our favourite.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      </motion.div>
    </section>
  );
}
