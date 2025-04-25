import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream min-h-[85vh] flex items-center">
      {/* Left section with content */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
        <div className="flex flex-col justify-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            100% Authentic Nigerian Flavors
          </div>
          
          <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-dark">
            Discover the <span className="text-primary">Taste</span> of Nigeria
          </h1>
          
          <p className="text-lg text-gray-700 max-w-xl mb-8">
            Experience the rich and vibrant flavors of Nigerian cuisine with our premium spices, 
            foodstuffs, and authentic ingredients delivered to your doorstep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 rounded-xl transition-all"
              size="lg"
            >
              <Link href="/shop" className="flex items-center gap-2">
                <ShoppingBag size={20} />
                Shop Now
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="bg-transparent border-2 border-dark/20 hover:border-dark/40 text-dark font-medium px-8 py-6 rounded-xl transition-all"
              size="lg"
            >
              <Link href="/shop/category/protein" className="flex items-center gap-2">
                Explore Protein
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-6 mt-10">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://randomuser.me/api/portraits/women/${i + 20}.jpg`} 
                    alt="Customer" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">From over 3,000+ reviews</p>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center justify-center relative">
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80" 
              alt="Colorful Nigerian spices" 
              className="w-full h-full object-cover object-center" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -right-10 top-10 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-float">
            <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-dark">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over ₦15,000</p>
            </div>
          </div>
          
          <div className="absolute -left-10 bottom-20 bg-white p-4 rounded-xl shadow-lg animate-float-delayed">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src="https://randomuser.me/api/portraits/women/32.jpg" 
                  alt="Customer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-dark">Amaka J.</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">"The spices are incredibly fresh and authentic!"</p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
    </section>
  );
}
