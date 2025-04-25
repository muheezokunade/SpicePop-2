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
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className={cn("bg-white p-6 rounded-lg shadow-sm", className)}>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
      <Accordion type="multiple" defaultValue={['category', 'price', 'sort']}>
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            {isLoadingCategories ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="category-all"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="mr-2"
                  />
                  <Label htmlFor="category-all">All Categories</Label>
                </div>
                
                {categories?.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category.id}`}
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
                      className="mr-2"
                    />
                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              <Slider
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="min-price">Min Price</Label>
                  <div className="border rounded-md p-2 mt-1">₦{priceRange[0]}</div>
                </div>
                <div>
                  <Label htmlFor="max-price">Max Price</Label>
                  <div className="border rounded-md p-2 mt-1">₦{priceRange[1]}</div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sort">
          <AccordionTrigger>Sort By</AccordionTrigger>
          <AccordionContent>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={resetFilters}
          >
            <X className="mr-2 h-4 w-4" /> Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
