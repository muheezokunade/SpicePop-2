import { Link } from 'wouter';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Plus, Award, Eye, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/contexts/CartContext';
import { formatCurrency, truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { handleAddToCart, isAddingToCart } = useCart();
  
  const isNewProduct = () => {
    const now = new Date();
    const createdAt = new Date(product.createdAt);
    // Check if product was created within the last 30 days
    return Math.abs(now.getTime() - createdAt.getTime()) < 30 * 24 * 60 * 60 * 1000;
  };
  
  return (
    <div 
      className={cn(
        "group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
        "border border-gray-100 hover:border-primary/20",
        className
      )}
    >
      <div className="relative">
        <Link 
          href={`/product/${product.id}`}
          className="block aspect-square overflow-hidden"
        >
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNewProduct() && (
            <Badge className="bg-secondary text-white hover:bg-secondary/90 px-2.5 py-0.5">
              New
            </Badge>
          )}
          
          {product.isFeatured && !isNewProduct() && (
            <Badge className="bg-primary text-white hover:bg-primary/90 px-2.5 py-0.5">
              Best Seller
            </Badge>
          )}
        </div>
        
        {/* Quick action buttons */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/product/${product.id}`}>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-9 w-9 rounded-full shadow-md bg-white text-primary hover:bg-primary hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>View details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-9 w-9 rounded-full shadow-md bg-white text-primary hover:bg-primary hover:text-white"
                  aria-label={`Add ${product.name} to cart`}
                  onClick={() => handleAddToCart(product)}
                  disabled={isAddingToCart || Number(product.stock) <= 0}
                >
                  {Number(product.stock) <= 0 ? (
                    <ShoppingCart className="h-4 w-4 opacity-50" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{Number(product.stock) <= 0 ? 'Out of stock' : 'Add to cart'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-2">
          <h3 className="font-medium text-lg truncate">
            <Link 
              href={`/product/${product.id}`}
              className="hover:text-primary transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          
          <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[40px]">
            {truncateText(product.description, 80)}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-900">{formatCurrency(product.price)}</span>
            {Number(product.stock) <= 5 && Number(product.stock) > 0 && (
              <span className="text-xs text-amber-600">Only {product.stock} left</span>
            )}
            {Number(product.stock) <= 0 && (
              <span className="text-xs text-destructive font-medium">Out of stock</span>
            )}
          </div>
          
          <Button 
            className="bg-primary/10 hover:bg-primary hover:text-white text-primary font-medium rounded-lg"
            size="sm"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => handleAddToCart(product)}
            disabled={isAddingToCart || Number(product.stock) <= 0}
          >
            <Plus className="h-4 w-4 mr-1" />
            {Number(product.stock) <= 0 ? 'Sold Out' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
