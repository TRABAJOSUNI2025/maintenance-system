import { PublicNavbar } from '@/components/PublicNavbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background-dark text-white">
      <PublicNavbar />
      <main className="flex flex-col">
        <Hero />
        <Features />
        <Footer />
      </main>
    </div>
  );
};
