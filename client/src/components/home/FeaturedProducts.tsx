import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ProductCard } from '@/components/ui/product-card';
import { API_ENDPOINTS } from '@/lib/constants';
import { Product } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ShoppingBasket, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [API_ENDPOINTS.products.featured],
  });
  
  // Loading skeletons
  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-5 w-32" />
              </div>
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-dark mb-2">
                <Skeleton className="h-10 w-64" />
              </h2>
              <div className="text-gray-600 max-w-lg">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm h-[360px]">
                <Skeleton className="h-[200px] w-full mb-4 rounded-xl" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (!products || products.length === 0) {
    return null;
  }
  
  // Group protein products first, then others
  const proteinProducts = products.filter(product => 
    product.categoryId === '4b123304-5818-4eb6-8241-f2f233f74bad'
  );
  const otherProducts = products.filter(product => 
    product.categoryId !== '4b123304-5818-4eb6-8241-f2f233f74bad'
  );
  
  // Combine with protein products first
  const organizedProducts = [...proteinProducts, ...otherProducts].slice(0, 4);
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <span className="text-primary font-medium">Featured Collection</span>
            </div>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-dark mb-2">
              Our Most Popular Products
            </h2>
            <p className="text-gray-600 max-w-lg">
              Discover our bestselling products, loved by customers for their authentic flavor and premium quality.
            </p>
          </div>
          <Button 
            asChild
            variant="outline" 
            className="mt-6 md:mt-0 border-2 border-primary/30 hover:border-primary text-primary hover:bg-primary/5"
          >
            <Link href="/shop" className="flex items-center gap-2">
              <ShoppingBasket className="h-4 w-4" />
              Browse All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {organizedProducts.map((product, index) => (
            <div key={product.id} className={`relative ${index === 0 ? 'sm:col-span-2 lg:col-span-2 row-span-1 lg:row-span-1' : ''}`}>
              <ProductCard product={product} />
              {index === 0 && (
                <div className="absolute top-4 left-4 z-10 bg-primary text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
