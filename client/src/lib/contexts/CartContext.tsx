import { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

type Cart = {
  items: CartItem[];
  total: number;
};

type CartContextType = {
  cart: Cart;
  handleAddToCart: (product: Product, quantity?: number) => Promise<void>;
  isAddingToCart: boolean;
  handleRemoveFromCart: (productId: string) => void;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  handleClearCart: () => void;
  
  // Additional properties
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
};

const defaultCart: Cart = {
  items: [],
  total: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  
  // Calculate total items count
  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleAddToCart = async (product: Product, quantity: number = 1): Promise<void> => {
    try {
      setIsAddingToCart(true);
      
      setCart(prevCart => {
        // Check if product already exists in cart
        const existingItemIndex = prevCart.items.findIndex(
          item => item.productId === product.id
        );
        
        let newItems;
        
        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          newItems = [...prevCart.items];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity
          };
        } else {
          // Add new item
          newItems = [
            ...prevCart.items,
            {
              productId: product.id,
              name: product.name,
              price: parseFloat(product.price.toString()),
              quantity,
              imageUrl: product.imageUrl
            }
          ];
        }
        
        const newTotal = calculateTotal(newItems);
        
        return {
          items: newItems,
          total: newTotal
        };
      });
      
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

  const handleRemoveFromCart = (productId: string): void => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.productId !== productId);
      const newTotal = calculateTotal(newItems);
      
      return {
        items: newItems,
        total: newTotal
      };
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const newItems = prevCart.items.map(item => {
        if (item.productId === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      const newTotal = calculateTotal(newItems);
      
      return {
        items: newItems,
        total: newTotal
      };
    });
  };

  const handleClearCart = (): void => {
    setCart(defaultCart);
  };

  return (
    <CartContext.Provider value={{
      cart,
      handleAddToCart,
      isAddingToCart,
      handleRemoveFromCart,
      handleUpdateQuantity,
      handleClearCart,
      isCartOpen,
      setIsCartOpen,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}