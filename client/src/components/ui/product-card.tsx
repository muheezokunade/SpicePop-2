import { Link } from 'wouter';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Plus, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCartActions } from '@/hooks/use-cart';
import { formatCurrency, truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { handleAddToCart, isAddingToCart } = useCartActions();
  
  const isNewProduct = () => {
    const now = new Date();
    const createdAt = new Date(product.createdAt);
    // Check if product was created within the last 30 days
    return Math.abs(now.getTime() - createdAt.getTime()) < 30 * 24 * 60 * 60 * 1000;
  };
  
  return (
    <div className={cn("bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow", className)}>
      <Link 
        href={`/product/${product.id}`}
        className="block aspect-square overflow-hidden"
      >
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No Image
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">
            <Link 
              href={`/product/${product.id}`}
              className="hover:text-primary transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          
          {isNewProduct() && (
            <Badge variant="secondary" className="bg-secondary/20 text-secondary hover:bg-secondary/30">
              New
            </Badge>
          )}
          
          {product.isFeatured && !isNewProduct() && (
            <Badge variant="destructive" className="bg-primary/20 text-primary hover:bg-primary/30">
              Bestseller
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {truncateText(product.description, 80)}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
          
          <Button 
            size="icon"
            className="bg-primary hover:bg-primary/90 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => handleAddToCart(product)}
            disabled={isAddingToCart || Number(product.stock) <= 0}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        {Number(product.stock) <= 0 && (
          <p className="text-destructive text-sm mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
}
