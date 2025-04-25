import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCheckout } from '@/hooks/use-checkout';
import { useToast } from '@/hooks/use-toast';

const checkoutFormSchema = z.object({
  customerName: z.string().min(3, 'Full name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  shippingAddress: z.string().min(10, 'Complete address is required')
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { handleCheckout, isCheckingOut } = useCheckout();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'whatsapp'>('whatsapp');
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
    },
  });
  
  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      const result = await handleCheckout(values, paymentMethod);
      
      if (result && onSuccess) {
        onSuccess(result.id);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was a problem processing your order. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+234 123 456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Shipping Information</h3>
          
          <FormField
            control={form.control}
            name="shippingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your full address including city and state"
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Method</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'whatsapp' ? 'border-primary bg-primary/5' : 'hover:border-gray-400'}`}
              onClick={() => setPaymentMethod('whatsapp')}
            >
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  name="payment" 
                  id="whatsapp" 
                  checked={paymentMethod === 'whatsapp'} 
                  onChange={() => setPaymentMethod('whatsapp')}
                  className="mr-2"
                />
                <label htmlFor="whatsapp" className="font-medium cursor-pointer">Order via WhatsApp</label>
              </div>
              <p className="text-sm text-gray-500">Get cart details on WhatsApp and pay on delivery</p>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'paystack' ? 'border-primary bg-primary/5' : 'hover:border-gray-400'}`}
              onClick={() => setPaymentMethod('paystack')}
            >
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  name="payment" 
                  id="paystack" 
                  checked={paymentMethod === 'paystack'} 
                  onChange={() => setPaymentMethod('paystack')}
                  className="mr-2"
                />
                <label htmlFor="paystack" className="font-medium cursor-pointer">Pay with Paystack</label>
              </div>
              <p className="text-sm text-gray-500">Secure online payment using debit/credit card</p>
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-6" 
          size="lg"
          disabled={isCheckingOut}
        >
          {isCheckingOut
            ? 'Processing...'
            : paymentMethod === 'whatsapp'
              ? 'Complete Order via WhatsApp'
              : 'Proceed to Payment'
          }
        </Button>
      </form>
    </Form>
  );
}
