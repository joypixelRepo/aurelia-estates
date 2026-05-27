import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Aurelia',
  description: 'About Aurelia Estates — a private real estate house on the Costa del Sol.',
};

export default function AboutAureliaPage() {
  return (
    <main className="relative min-h-screen bg-ink-950 text-sand-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-32 md:py-44">
        <div className="flex items-center gap-4 mb-8">
          <span className="block h-px w-12 bg-gold-500" />
          <span className="eyebrow">About · Aurelia</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] leading-[0.98] mb-12">
          About Aurelia.
        </h1>

        <p className="text-sand-200/70 text-base md:text-lg font-light leading-relaxed max-w-2xl mb-16">
          Página en construcción.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-4 text-sand-50 hover:text-gold-400 transition-colors"
        >
          <span className="block h-px w-10 bg-sand-50/40" />
          <span className="text-[11px] tracking-ultra uppercase">Back to home</span>
        </Link>
      </div>
    </main>
  );
}
