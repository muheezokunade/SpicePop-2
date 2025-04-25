import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/lib/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, CheckCircle, ShoppingBag } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { items } = useCart();
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Update document title
  useEffect(() => {
    document.title = 'Checkout | SpicePop';
  }, []);
  
  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isCompleted) {
      setLocation('/cart');
    }
  }, [items, isCompleted, setLocation]);
  
  // If cart is empty and not completed, show loading until redirect
  if (items.length === 0 && !isCompleted) {
    return null;
  }
  
  // Handle successful checkout
  const handleCheckoutSuccess = (id: string) => {
    setOrderId(id);
    setIsCompleted(true);
  };
  
  // Show order confirmation
  if (isCompleted) {
    return (
      <>
        <Helmet>
          <title>Order Confirmed | SpicePop</title>
          <meta name="description" content="Your order has been successfully placed." />
        </Helmet>
        
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-1 bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6 px-6 pb-8">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold font-poppins mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-6">
                      Thank you for your order. We've received your purchase request.
                    </p>
                    
                    {orderId && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-md inline-block">
                        <p className="text-sm text-gray-500">Order Reference</p>
                        <p className="font-medium">{orderId.substring(0, 8)}...</p>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                      <Button asChild variant="outline">
                        <Link href="/">
                          <a>Return to Home</a>
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/shop">
                          <a>Continue Shopping</a>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout | SpicePop</title>
        <meta name="description" content="Complete your purchase of authentic Nigerian spices and foodstuffs." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="mb-4"
              >
                <Link href="/cart">
                  <a className="flex items-center">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Cart
                  </a>
                </Link>
              </Button>
              
              <h1 className="text-3xl font-bold font-poppins">Checkout</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CheckoutForm onSuccess={handleCheckoutSuccess} />
              </div>
              
              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
