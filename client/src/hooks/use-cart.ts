import { useState } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function useCartActions() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    try {
      setIsAddingToCart(true);
      
      // Add to cart
      addItem({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price.toString()),
        quantity,
        imageUrl: product.imageUrl
      });
      
      // Show success toast
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return {
    handleAddToCart,
    isAddingToCart
  };
}
