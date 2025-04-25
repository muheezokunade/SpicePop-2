import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { isValidEmail } from '@/lib/utils';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, we would send this to an API
    setTimeout(() => {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive our newsletter with exclusive offers and recipes.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-4">Stay Updated</h2>
          
          <p className="mb-8">
            Subscribe to our newsletter for exclusive offers, new product announcements, and Nigerian recipes.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <Input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary h-12"
              required
            />
            
            <Button 
              type="submit" 
              className="bg-dark hover:bg-dark/80 text-white font-medium px-6 py-3 h-12 transition-colors whitespace-nowrap"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
