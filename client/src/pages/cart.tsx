import { useEffect } from 'react';
import { Link } from 'wouter';
import { useCart } from '@/lib/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  
  // Update document title
  useEffect(() => {
    document.title = 'Your Cart | SpicePop';
  }, []);
  
  // Calculate delivery fee (free above 5000)
  const deliveryFee = subtotal > 5000 ? 0 : 1000;
  
  // Calculate total
  const total = subtotal + deliveryFee;
  
  // Empty cart
  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart | SpicePop</title>
          <meta name="description" content="View and manage your shopping cart." />
        </Helmet>
        
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-1 bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold font-poppins mb-8">Your Cart</h1>
              
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button asChild size="lg">
                  <Link href="/shop">
                    <a>Start Shopping</a>
                  </Link>
                </Button>
              </div>
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
        <title>Your Cart | SpicePop</title>
        <meta name="description" content="View and manage your shopping cart." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold font-poppins mb-8">Your Cart</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Product</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>
                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-red-500"
                              onClick={() => removeItem(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    asChild
                  >
                    <Link href="/shop">
                      <a>Continue Shopping</a>
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatCurrency(deliveryFee)
                        )}
                      </span>
                    </div>
                    
                    {deliveryFee === 0 && (
                      <div className="text-xs text-green-600">
                        Free delivery on orders above ₦5,000
                      </div>
                    )}
                    
                    <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    asChild
                  >
                    <Link href="/checkout">
                      <a className="flex items-center justify-center">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
