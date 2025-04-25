import { useCart } from '@/lib/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function OrderSummary() {
  const { items, subtotal } = useCart();
  
  // Calculate delivery fee (free above 5000)
  const deliveryFee = subtotal > 5000 ? 0 : 1000;
  
  // Calculate total
  const total = subtotal + deliveryFee;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          Review your order details before proceeding.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.productId} className="flex justify-between py-1">
              <div>
                <span className="font-medium">{item.name}</span>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x {formatCurrency(item.price)}
                </p>
              </div>
              <span className="font-medium">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        
        <Separator />
        
        {/* Subtotal and fees */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>
              {deliveryFee === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatCurrency(deliveryFee)
              )}
            </span>
          </div>
          
          {deliveryFee === 0 && (
            <div className="text-xs text-green-600 text-right">
              Free delivery on orders above ₦5,000
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="w-full pt-4 border-t">
          <div className="flex justify-between">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-lg">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
