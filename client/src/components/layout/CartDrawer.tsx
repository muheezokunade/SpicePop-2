import { useEffect } from 'react';
import { Link } from 'wouter';
import { useCart } from '@/lib/contexts/CartContext';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

export default function CartDrawer() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    isCartOpen, 
    setIsCartOpen,
    itemCount,
    subtotal
  } = useCart();

  // Close drawer when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCartOpen]);
  
  // Close drawer when clicking outside
  useEffect(() => {
    if (!isCartOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('fixed')) {
        setIsCartOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isCartOpen, setIsCartOpen]);
  
  // Empty cart display
  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg font-medium mb-2">Your cart is empty</p>
      <p className="text-gray-400 text-sm mb-6 text-center">
        Looks like you haven't added any products to your cart yet.
      </p>
      <Button onClick={() => setIsCartOpen(false)}>
        Continue Shopping
      </Button>
    </div>
  );
  
  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="sm:max-w-md w-full fixed right-0 h-full flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span>Your Cart ({itemCount})</span>
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>
          
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="flex-grow overflow-y-auto py-4">
              {items.map(item => (
                <div key={item.productId} className="flex items-center py-4 border-b">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <span className="w-8 text-center">{item.quantity}</span>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(item.productId)}
                    className="ml-2 text-gray-400 hover:text-primary"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <SheetFooter className="sm:justify-start border-t pt-4">
              <div className="w-full">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">{formatCurrency(subtotal)}</span>
                </div>
                
                <Link href="/checkout">
                  <a className="w-full">
                    <Button 
                      className="w-full mb-2" 
                      onClick={() => setIsCartOpen(false)}
                    >
                      Proceed to Checkout
                    </Button>
                  </a>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={() => {
                    // Create WhatsApp cart message
                    const cartItems = items.map(item => 
                      `${item.name} (${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`
                    ).join('\n');
                    
                    const message = 
                      `Hello, I would like to order the following items from SpicePop:\n\n${cartItems}\n\nTotal: ${formatCurrency(subtotal)}`;
                    
                    window.open(`https://wa.me/2349876543210?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Order via WhatsApp
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
