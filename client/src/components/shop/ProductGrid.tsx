import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product, Category } from '@shared/schema';
import { ProductCard } from '@/components/ui/product-card';
import { API_ENDPOINTS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { PackageSearch, Filter, GridIcon, LayoutListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  filters: Record<string, string>;
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileSort, setMobileSort] = useState(filters.sort || 'name-asc');
  
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: [API_ENDPOINTS.products.list],
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: [API_ENDPOINTS.categories.list],
  });
  
  // Apply filters whenever filters or products change
  useEffect(() => {
    if (!products || !categories) return;
    
    console.log('ProductGrid received filters:', filters);
    let result = [...products];
    
    // Apply category filter
    if (filters.category) {
      // First try to find category by slug
      const categoryBySlug = categories.find(c => c.slug === filters.category);
      
      if (categoryBySlug) {
        // If found by slug, filter by categoryId
        result = result.filter(product => product.categoryId === categoryBySlug.id);
        console.log(`Filtering by category slug: ${filters.category}, found ID: ${categoryBySlug.id}, products: ${result.length}`);
      } else {
        // Fall back to filtering by category ID
        result = result.filter(product => product.categoryId === filters.category);
        console.log(`Filtering by category ID: ${filters.category}, products: ${result.length}`);
      }
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
    // Default sorting is name-asc
    if (!filters.sort || filters.sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      switch(filters.sort) {
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
          result.sort((a, b) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime());
          break;
      }
    }
    
    setFilteredProducts(result);
  }, [products, filters]);
  
  // Update mobile sort
  useEffect(() => {
    setMobileSort(filters.sort || 'name-asc');
  }, [filters.sort]);
  
  // Add a function to communicate with parent
  const onUpdateFilters = (newFilters: Record<string, string>) => {
    // Update URL with new filters
    const searchParams = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });
    
    const searchString = searchParams.toString();
    const newUrl = searchString ? `/shop?${searchString}` : '/shop';
    
    // Update URL without triggering a navigation
    window.history.replaceState(null, '', newUrl);
    
    // This will trigger a re-render with updated filters
    window.dispatchEvent(new Event('popstate'));
  };

  // Handle sort change
  const handleMobileSortChange = (value: string) => {
    // Update the local state 
    setMobileSort(value);
    
    // Create a fresh copy of the filters
    const newFilters = { ...filters };
    
    // Handle default sort
    if (value === 'name-asc') {
      delete newFilters.sort;
    } else {
      newFilters.sort = value;
    }
    
    // Update the filters through the URL
    onUpdateFilters(newFilters);
  };
  
  // Loading state
  if (isLoadingProducts) {
    return (
      <div>
        <div className="hidden lg:flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">Loading products...</p>
          <div className="flex gap-2 items-center">
            <div className="h-8 w-24"><Skeleton className="h-full w-full rounded-md" /></div>
            <div className="h-8 w-20"><Skeleton className="h-full w-full rounded-md" /></div>
          </div>
        </div>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <Skeleton className="h-[240px] w-full" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
        <div className="flex justify-center mb-4">
          <PackageSearch className="h-12 w-12 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn't find any products matching your current filters. Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Results header with count and view options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filteredProducts.length}</span> products
        </p>
        
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Sort select */}
          <div className="block flex-1 sm:w-48">
            <Select value={mobileSort} onValueChange={handleMobileSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* View toggle */}
          <div className="bg-white border border-gray-200 rounded-lg flex">
            <Button 
              variant="ghost" 
              size="sm"
              className={cn(
                "rounded-l-md rounded-r-none border-r border-gray-200",
                viewMode === 'grid' 
                  ? "bg-gray-50 text-primary" 
                  : "text-gray-500 hover:text-gray-900"
              )}
              onClick={() => setViewMode('grid')}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={cn(
                "rounded-r-md rounded-l-none",
                viewMode === 'list' 
                  ? "bg-gray-50 text-primary" 
                  : "text-gray-500 hover:text-gray-900"
              )}
              onClick={() => setViewMode('list')}
            >
              <LayoutListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="w-full sm:w-1/3 aspect-square">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    <a 
                      href={`/product/${product.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {product.name}
                    </a>
                  </h3>
                  
                  <p className="text-gray-500 mb-4">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-gray-900">₦{parseFloat(product.price.toString()).toLocaleString()}</span>
                    {Number(product.stock) <= 5 && Number(product.stock) > 0 && (
                      <span className="text-xs text-amber-600">Only {product.stock} left</span>
                    )}
                    {Number(product.stock) <= 0 && (
                      <span className="text-xs text-destructive font-medium">Out of stock</span>
                    )}
                  </div>
                  
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    disabled={Number(product.stock) <= 0}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
