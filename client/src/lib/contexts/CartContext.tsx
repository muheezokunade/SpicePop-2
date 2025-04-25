import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@shared/schema';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce((total, item) => {
    return total + (parseFloat(item.price.toString()) * item.quantity);
  }, 0);
  
  function addItem(item: CartItem) {
    setItems(currentItems => {
      // Check if item already exists
      const existingItemIndex = currentItems.findIndex(
        existingItem => existingItem.productId === item.productId
      );
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += item.quantity;
        return newItems;
      } else {
        // Add new item
        return [...currentItems, item];
      }
    });
  }
  
  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  }
  
  function removeItem(productId: string) {
    setItems(currentItems => 
      currentItems.filter(item => item.productId !== productId)
    );
  }
  
  function clearCart() {
    setItems([]);
  }
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      itemCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
