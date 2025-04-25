import { useEffect } from 'react';
import { Link } from 'wouter';
import { useCart } from '@/lib/contexts/CartContext';
import { 
  X, 
  ShoppingBag
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
  // Use a try/catch block to gracefully handle potential errors
  try {
    const { 
      cart,
      handleRemoveFromCart,
      handleUpdateQuantity,
      isCartOpen, 
      setIsCartOpen,
      itemCount
    } = useCart();
    
    // Make sure cart and cart.items are defined before using them
    const items = cart?.items || [];
    const subtotal = cart?.total || 0;
    
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
        <SheetContent className="flex flex-col w-full max-w-md sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <>
              <Separator />
              <SheetFooter className="gap-2 sm:gap-0">
                <div className="flex items-center justify-between w-full py-4">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="grid w-full gap-2">
                  <Button asChild>
                    <Link href="/checkout">
                      Checkout
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/cart">
                      View Cart
                    </Link>
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    );
  } catch (error) {
    // Return a silent fallback in case of errors
    console.error('Error rendering CartDrawer:', error);
    return null;
  }
}