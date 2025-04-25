import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ProductCard } from '@/components/ui/product-card';
import { API_ENDPOINTS } from '@/lib/constants';
import { Product } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [API_ENDPOINTS.products.featured],
  });
  
  // Loading skeletons
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-light">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl">Featured Products</h2>
            <Link href="/shop">
              <a className="text-primary hover:text-primary/80 font-medium flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 h-[300px]">
                <Skeleton className="h-[160px] w-full mb-4 rounded-md" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
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
  
  return (
    <section className="py-16 bg-gray-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-poppins font-bold text-2xl md:text-3xl">Featured Products</h2>
          <Link href="/shop">
            <a className="text-primary hover:text-primary/80 font-medium flex items-center">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
