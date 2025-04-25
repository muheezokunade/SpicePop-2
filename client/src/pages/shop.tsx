import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductFilters from '@/components/shop/ProductFilters';
import ProductGrid from '@/components/shop/ProductGrid';
import { Helmet } from 'react-helmet';

export default function ShopPage() {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  // Parse URL search params on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    
    const initialFilters: Record<string, string> = {};
    
    for (const [key, value] of searchParams.entries()) {
      initialFilters[key] = value;
    }
    
    setFilters(initialFilters);
  }, [location]);
  
  // Update URL with filters
  const handleUpdateFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    
    // Convert filters to URL search params
    const searchParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(newFilters)) {
      if (value) {
        searchParams.append(key, value);
      }
    }
    
    const searchString = searchParams.toString();
    const newUrl = searchString ? `/shop?${searchString}` : '/shop';
    
    // Update URL without triggering a navigation
    window.history.replaceState(null, '', newUrl);
  };
  
  // Update document title
  useEffect(() => {
    document.title = 'Shop | SpicePop';
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Shop | SpicePop</title>
        <meta name="description" content="Browse our collection of authentic Nigerian spices, foodstuffs, and snacks." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-poppins mb-2">Shop</h1>
              <p className="text-gray-600">
                Discover our authentic Nigerian spices, foodstuffs, and snacks
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <ProductFilters 
                  onUpdateFilters={handleUpdateFilters} 
                  initialFilters={filters}
                />
              </div>
              
              <div className="lg:col-span-3">
                <ProductGrid filters={filters} />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
