// En tu archivo page.tsx:
import dynamic from 'next/dynamic'; // <-- Importa dynamic
import Header from './components/Header';
import Hero from './components/Hero';
import Properties from './components/Properties';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Carga Process de forma dinámica deshabilitando SSR
const Process = dynamic(() => import('./components/Process'), { 
  ssr: false 
});

export default function HomePage() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Properties />
      <Process /> {/* Ahora no se ejecutará hasta estar 100% en el navegador */}
      <About />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}