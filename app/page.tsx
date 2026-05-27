import Header from './components/Header';
import Hero from './components/Hero';
import Properties from './components/Properties';
import Process from './components/Process';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Properties />

      <About />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
