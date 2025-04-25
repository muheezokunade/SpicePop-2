import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import { Helmet } from 'react-helmet';

export default function HomePage() {
  // Update document title
  useEffect(() => {
    document.title = 'SpicePop | Nigerian Spices & Foodstuffs';
  }, []);
  
  return (
    <>
      <Helmet>
        <title>SpicePop | Nigerian Spices & Foodstuffs</title>
        <meta name="description" content="Premium Nigerian spices, foodstuffs, and snacks delivered to your doorstep." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main>
          <HeroSection />
          <CategorySection />
          <FeaturedProducts />
          <Features />
          <Testimonials />
          <Newsletter />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
