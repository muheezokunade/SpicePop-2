import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Category } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, X, Tag, ArrowDownUp, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ProductFiltersProps {
  className?: string;
  onUpdateFilters: (filters: Record<string, string>) => void;
  initialFilters: Record<string, string>;
}

export default function ProductFilters({ 
  className, 
  onUpdateFilters,
  initialFilters
}: ProductFiltersProps) {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [priceRange, setPriceRange] = useState<number[]>([
    parseInt(initialFilters.minPrice || '0'), 
    parseInt(initialFilters.maxPrice || '10000')
  ]);
  const [sortOption, setSortOption] = useState(initialFilters.sort || 'name-asc');
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: [API_ENDPOINTS.categories.list],
  });
  
  // Apply filters
  const applyFilters = () => {
    const filters: Record<string, string> = {};
    
    if (searchTerm) filters.search = searchTerm;
    if (selectedCategory) filters.category = selectedCategory;
    if (priceRange[0] > 0) filters.minPrice = priceRange[0].toString();
    if (priceRange[1] < 10000) filters.maxPrice = priceRange[1].toString();
    if (sortOption) filters.sort = sortOption;
    
    onUpdateFilters(filters);
  };
  
  // Handle filter changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, priceRange, sortOption]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSortOption('name-asc');
    onUpdateFilters({});
    setLocation('/shop');
  };
  
  const hasActiveFilters = searchTerm || selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000 || sortOption !== 'name-asc';
  
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm", className)}>
      <form onSubmit={handleSearch} className="mb-6 space-y-2">
        <Label htmlFor="product-search" className="text-sm font-medium text-gray-700">Search</Label>
        <div className="flex items-center relative">
          <Input
            id="product-search"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 border-gray-200 focus:border-primary focus:ring-primary/20"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0 text-gray-400 hover:text-primary"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
      <div className="space-y-6">
        {/* Categories Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Categories</h3>
          </div>
          
          <div className="border rounded-lg p-3 bg-gray-50/50">
            {isLoadingCategories ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <RadioGroup
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="category-all" />
                  <Label htmlFor="category-all" className="text-sm cursor-pointer">
                    All Categories
                  </Label>
                </div>
                
                {categories?.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                    <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Price Range Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Banknote className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Price Range</h3>
          </div>
          
          <div className="px-1 space-y-6">
            <Slider
              min={0}
              max={10000}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
              className="[&>[role=slider]]:bg-primary [&>[role=slider]]:border-primary [&>.range]:bg-primary"
            />
            
            <div className="flex items-center justify-between gap-4">
              <div className="w-1/2">
                <Label htmlFor="min-price" className="text-xs text-gray-500 mb-1 block">Min</Label>
                <div className="border border-gray-200 rounded-md p-2 text-center text-sm bg-gray-50">
                  ₦{priceRange[0].toLocaleString()}
                </div>
              </div>
              <div className="w-1/2">
                <Label htmlFor="max-price" className="text-xs text-gray-500 mb-1 block">Max</Label>
                <div className="border border-gray-200 rounded-md p-2 text-center text-sm bg-gray-50">
                  ₦{priceRange[1].toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Sort By Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownUp className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Sort By</h3>
          </div>
          
          <Select 
            value={sortOption} 
            onValueChange={(value) => {
              setSortOption(value);
              const newFilters = { ...initialFilters };
              
              if (value === 'name-asc') {
                // Default sorting is name-asc, so no need to include it in filters
                const { sort, ...rest } = newFilters;
                Object.assign(newFilters, rest);
              } else {
                newFilters.sort = value;
              }
              
              onUpdateFilters(newFilters);
            }}
          >
            <SelectTrigger className="w-full border-gray-200">
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
        
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Active Filters</h3>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-primary text-sm"
                  onClick={resetFilters}
                >
                  Reset All
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge 
                    variant="outline" 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1"
                  >
                    Search: {searchTerm}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setSearchTerm('');
                        const newFilters = { ...initialFilters };
                        delete newFilters.search;
                        onUpdateFilters(newFilters);
                      }}
                    />
                  </Badge>
                )}
                
                {selectedCategory && categories && (
                  <Badge 
                    variant="outline" 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1"
                  >
                    Category: {categories.find(c => c.id === selectedCategory)?.name || 'Unknown'}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setSelectedCategory('');
                        const newFilters = { ...initialFilters };
                        delete newFilters.category;
                        onUpdateFilters(newFilters);
                      }}
                    />
                  </Badge>
                )}
                
                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <Badge 
                    variant="outline" 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1"
                  >
                    Price: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setPriceRange([0, 10000]);
                        const newFilters = { ...initialFilters };
                        delete newFilters.minPrice;
                        delete newFilters.maxPrice;
                        onUpdateFilters(newFilters);
                      }}
                    />
                  </Badge>
                )}
                
                {sortOption !== 'name-asc' && (
                  <Badge 
                    variant="outline" 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1"
                  >
                    Sort: {
                      sortOption === 'name-desc' ? 'Name: Z to A' :
                      sortOption === 'price-asc' ? 'Price: Low to High' :
                      sortOption === 'price-desc' ? 'Price: High to Low' :
                      sortOption === 'newest' ? 'Newest First' : 'Default'
                    }
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setSortOption('name-asc');
                        const { sort, ...rest } = initialFilters;
                        onUpdateFilters(rest);
                      }}
                    />
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
