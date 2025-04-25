import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { ProductCard } from '@/components/ui/product-card';
import { API_ENDPOINTS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  filters: Record<string, string>;
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [API_ENDPOINTS.products.list],
  });
  
  // Apply filters whenever filters or products change
  useEffect(() => {
    if (!products) return;
    
    let result = [...products];
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(product => product.categoryId === filters.category);
    }
    
    // Apply price filter
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice);
      result = result.filter(product => parseFloat(product.price.toString()) >= minPrice);
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      result = result.filter(product => parseFloat(product.price.toString()) <= maxPrice);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sorting
    if (filters.sort) {
      switch(filters.sort) {
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          result.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()));
          break;
        case 'price-desc':
          result.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()));
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }
    
    setFilteredProducts(result);
  }, [products, filters]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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
    );
  }
  
  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-gray-500">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
