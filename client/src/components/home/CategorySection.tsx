import { useQuery } from '@tanstack/react-query';
import { CategoryCard } from '@/components/ui/category-card';
import { API_ENDPOINTS } from '@/lib/constants';
import { Category } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategorySection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: [API_ENDPOINTS.categories.list],
  });
  
  // Loading skeletons
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-12">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square">
                <Skeleton className="w-full h-full rounded-lg" />
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
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-12">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
