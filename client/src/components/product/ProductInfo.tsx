import { useState } from 'react';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/contexts/CartContext';
import { 
  ShoppingBag, 
  Minus, 
  Plus,
  Check,
  X,
  MessageCircle,
  Heart
} from 'lucide-react';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { handleAddToCart, isAddingToCart } = useCart();
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };
  
  const isInStock = Number(product.stock) > 0;
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-poppins mb-2">{product.name}</h1>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl font-bold text-primary">
          {formatCurrency(product.price)}
        </span>
        
        {product.isFeatured && (
          <Badge variant="destructive" className="bg-primary/20 text-primary hover:bg-primary/30">
            Bestseller
          </Badge>
        )}
        
        <div className="flex items-center ml-4">
          {isInStock ? (
            <>
              <Check className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm">In Stock</span>
            </>
          ) : (
            <>
              <X className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 text-sm">Out of Stock</span>
            </>
          )}
        </div>
      </div>
      
      <div className="prose mb-6 text-gray-700">
        <p>{product.description}</p>
      </div>
      
      <div className="flex flex-col space-y-6">
        {/* Quantity selector */}
        <div className="flex items-center">
          <span className="text-sm font-medium mr-4">Quantity:</span>
          <div className="flex items-center border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={decrementQuantity} 
              disabled={quantity <= 1 || !isInStock}
              className="h-10 w-10 rounded-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              disabled={!isInStock}
              className="w-16 h-10 text-center border-0 rounded-none"
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={incrementQuantity} 
              disabled={!isInStock}
              className="h-10 w-10 rounded-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => handleAddToCart(product, quantity)} 
            disabled={isAddingToCart || !isInStock}
            className="flex-1"
            size="lg"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            disabled={!isInStock}
            className="flex-1"
          >
            <Heart className="mr-2 h-5 w-5" />
            Add to Wishlist
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center justify-center"
          onClick={() => {
            const message = `Hello, I'm interested in the ${product.name} (${formatCurrency(product.price)}). Can you provide more information?`;
            window.open(`https://wa.me/2348068989798?text=${encodeURIComponent(message)}`, '_blank');
          }}
        >
          <MessageCircle className="mr-2 h-5 w-5 text-green-600" />
          <span className="text-green-600">Inquire via WhatsApp</span>
        </Button>
      </div>
    </div>
  );
}
