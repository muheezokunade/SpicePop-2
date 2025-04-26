import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductFilters from '@/components/shop/ProductFilters';
import ProductGrid from '@/components/shop/ProductGrid';
import { Helmet } from 'react-helmet';
import { Category } from '@shared/schema';
import { API_ENDPOINTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';

export default function ShopPage() {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: [API_ENDPOINTS.categories.list],
  });
  
  // Parse URL search params on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    
    const initialFilters: Record<string, string> = {};
    
    // Use forEach instead of for...of to avoid downlevelIteration issues
    searchParams.forEach((value, key) => {
      initialFilters[key] = value;
    });
    
    setFilters(initialFilters);
    
    // Set active tab based on category filter
    if (initialFilters.category && categories) {
      // First check if the category parameter is a slug
      const categoryBySlug = categories.find(c => c.slug === initialFilters.category);
      
      if (categoryBySlug) {
        setActiveTab(categoryBySlug.slug);
      } else {
        // Fall back to checking by ID (for backward compatibility)
        const categoryById = categories.find(c => c.id === initialFilters.category);
        if (categoryById) {
          setActiveTab(categoryById.slug);
        }
      }
    } else {
      setActiveTab("all");
    }
  }, [location, categories]);
  
  // Update URL with filters
  const handleUpdateFilters = (newFilters: Record<string, string>) => {
    // Set state with the new filters
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
    
    // Dispatch a popstate event to trigger a re-render with updated filters
    window.dispatchEvent(new Event('popstate'));
  };
  
  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { ...filters };
    
    if (categoryId) {
      newFilters.category = categoryId;
    } else {
      delete newFilters.category;
    }
    
    handleUpdateFilters(newFilters);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "all") {
      const newFilters = { ...filters };
      delete newFilters.category;
      handleUpdateFilters(newFilters);
    } else {
      // Use the slug directly instead of converting to ID
      const newFilters = { ...filters };
      newFilters.category = value; // This is the slug
      handleUpdateFilters(newFilters);
    }
  };
  
  const resetFilters = () => {
    setFilters({});
    setActiveTab("all");
    setLocation('/shop');
  };
  
  const hasActiveFilters = Object.keys(filters).length > 0;
  
  return (
    <>
      <Helmet>
        <title>Shop | SpicePop</title>
        <meta name="description" content="Browse our collection of authentic Nigerian spices, foodstuffs, and snacks." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 bg-cream py-12">
          <div className="container mx-auto px-4">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-xl mb-10 bg-gradient-to-r from-primary to-secondary text-white">
              <div className="relative z-10 py-12 px-8 md:px-12 lg:w-2/3">
                <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">Explore Our Collection</h1>
                <p className="text-lg md:text-xl mb-8 text-white/90">
                  Authentic Nigerian spices, foodstuffs, and snacks to bring home the taste of West Africa
                </p>
                <div className="flex gap-3">
                  <Button className="bg-white text-primary hover:bg-white/90" onClick={() => setFiltersOpen(true)}>
                    <Filter className="mr-2 h-4 w-4" /> Filter Products
                  </Button>
                  {hasActiveFilters && (
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" onClick={resetFilters}>
                      <X className="mr-2 h-4 w-4" /> Clear Filters
                    </Button>
                  )}
                </div>
              </div>
              <div 
                className="absolute inset-0 opacity-20" 
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
            </div>
            
            {/* Category Tabs */}
            <div className="mb-8">
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <div className="overflow-x-auto py-1 no-scrollbar">
                  <TabsList className="mb-6 h-12 bg-background/80 backdrop-blur-sm w-auto inline-flex whitespace-nowrap">
                    <TabsTrigger value="all" className="h-10 px-4 sm:px-6 rounded-full">
                      All Products
                    </TabsTrigger>
                    
                    {categories?.map(category => (
                      <TabsTrigger 
                        key={category.slug} 
                        value={category.slug}
                        className="h-10 px-4 sm:px-6 rounded-full mx-1"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-poppins">
                    {activeTab === "all" 
                      ? "All Products" 
                      : categories?.find(c => c.slug === activeTab)?.name}
                  </h2>
                  
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-auto">
                      <SheetHeader>
                        <SheetTitle>Filter Products</SheetTitle>
                        <SheetDescription>
                          Refine your search to find exactly what you're looking for.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                        <ProductFilters 
                          onUpdateFilters={handleUpdateFilters} 
                          initialFilters={filters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                  {/* Filters - Desktop */}
                  <div className="hidden lg:block">
                    <div className="sticky top-24">
                      <ProductFilters 
                        onUpdateFilters={handleUpdateFilters} 
                        initialFilters={filters}
                      />
                    </div>
                  </div>
                  
                  {/* Product Grid */}
                  <div className="lg:col-span-3">
                    <ProductGrid filters={filters} />
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
