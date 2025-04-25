import { Link } from 'wouter';
import { Category } from '@shared/schema';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${category.slug}`}>
      <a className={cn("group relative overflow-hidden rounded-lg aspect-square", className)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        
        {category.imageUrl ? (
          <img 
            src={category.imageUrl} 
            alt={category.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-lg">No Image</span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-white font-poppins font-medium text-lg">{category.name}</h3>
        </div>
      </a>
    </Link>
  );
}
