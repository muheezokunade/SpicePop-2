import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { API_ENDPOINTS } from '@/lib/constants';
import { Category } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

export default function CategorySection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: [API_ENDPOINTS.categories.list],
  });
  
  // Loading skeletons
  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-dark mb-2">
                <Skeleton className="h-10 w-40" />
              </h2>
              <div className="text-gray-600 max-w-md">
                <Skeleton className="h-4 w-80" />
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`${i === 0 ? 'md:col-span-2 md:row-span-2' : ''} rounded-xl overflow-hidden`}>
                <Skeleton className="w-full h-40 md:h-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (!categories || categories.length === 0) {
    return null;
  }
  
  // Find the protein category for special highlighting
  const proteinCategory = categories.find(category => category.slug === 'protein');
  const otherCategories = categories.filter(category => category.slug !== 'protein');
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-dark mb-2">
              Explore Our Categories
            </h2>
            <p className="text-gray-600 max-w-md">
              From spices to proteins, discover the best of Nigerian cuisine
            </p>
          </div>
          <Link href="/shop" className="flex items-center gap-2 font-medium text-primary hover:underline mt-4 md:mt-0">
            View All Categories
            <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
          {/* Protein category highlighted (or first category if protein not found) */}
          <div className="relative md:col-span-2 md:row-span-2 rounded-xl overflow-hidden group">
            <Link href={`/shop/category/${proteinCategory?.slug || categories[0].slug}`} className="block w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
              <img 
                src={proteinCategory?.imageUrl || categories[0].imageUrl || ''} 
                alt={proteinCategory?.name || categories[0].name}
                className="w-full h-full object-cover aspect-[3/4] md:aspect-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
                <span className="bg-primary/90 text-white text-xs px-3 py-1 rounded-full mb-2 inline-block">Featured</span>
                <h3 className="font-semibold text-lg md:text-xl text-white mb-1">{proteinCategory?.name || categories[0].name}</h3>
                <p className="text-white/80 text-sm">Explore our selection</p>
              </div>
            </Link>
          </div>
        
          {/* Other categories in a grid */}
          {otherCategories.slice(0, 5).map((category, index) => (
            <div key={category.id} className="relative rounded-xl overflow-hidden group h-40 md:h-auto">
              <Link href={`/shop/category/${category.slug}`} className="block w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
                <img 
                  src={category.imageUrl || ''} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20">
                  <h3 className="font-medium text-sm md:text-base text-white">{category.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
