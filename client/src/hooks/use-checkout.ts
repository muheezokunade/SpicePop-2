import { useState } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { getWhatsAppLink } from '@/lib/utils';
import { CONTACT_WHATSAPP } from '@/lib/constants';

interface CheckoutForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
}

export function useCheckout() {
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const handleCheckout = async (formData: CheckoutForm, method: 'paystack' | 'whatsapp') => {
    try {
      setIsCheckingOut(true);
      
      if (items.length === 0) {
        toast({
          title: "Error",
          description: "Your cart is empty",
          variant: "destructive",
        });
        return null;
      }
      
      // Create order object
      const order = {
        ...formData,
        items,
        totalAmount: subtotal.toString()
      };
      
      if (method === 'whatsapp') {
        // Format cart for WhatsApp
        const cartSummary = items.map(item => 
          `*${item.name}* - ${item.quantity} x ₦${item.price} = ₦${item.price * item.quantity}`
        ).join('\n');
        
        const message = 
          `*New Order from SpicePop*\n\n` +
          `*Customer:* ${formData.customerName}\n` +
          `*Email:* ${formData.customerEmail}\n` +
          `*Phone:* ${formData.customerPhone}\n` +
          `*Address:* ${formData.shippingAddress}\n\n` +
          `*Order Items:*\n${cartSummary}\n\n` +
          `*Total Amount:* ₦${subtotal}\n\n` +
          `Thank you for your order!`;
        
        // Open WhatsApp with message
        window.open(getWhatsAppLink(CONTACT_WHATSAPP, message), '_blank');
        
        // Still create the order in our system
        const response = await apiRequest('POST', '/api/orders', order);
        const orderData = await response.json();
        
        // Clear cart
        clearCart();
        
        toast({
          title: "Order Sent",
          description: "Your order has been sent via WhatsApp. We'll contact you soon!",
        });
        
        return orderData;
      } else {
        // In a real app, would implement Paystack integration here
        const response = await apiRequest('POST', '/api/orders', order);
        const orderData = await response.json();
        
        // Clear cart
        clearCart();
        
        toast({
          title: "Order Placed",
          description: "Your order has been placed successfully!",
        });
        
        return orderData;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  return {
    handleCheckout,
    isCheckingOut
  };
}
