import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Utensils, Star, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream min-h-[85vh] flex items-center">
      {/* Left section with content */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
        <div className="flex flex-col justify-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            Premium Nigerian Spices & Foodstuffs
          </div>
          
          <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-dark">
            Taste the <span className="text-primary">Authentic</span> Nigerian Cuisine
          </h1>
          
          <p className="text-lg text-gray-700 max-w-xl mb-8">
            Discover our carefully selected Nigerian spices, foodstuffs, and protein products. 
            Bringing the rich flavors and traditions of Nigeria directly to your kitchen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 rounded-xl transition-all"
              size="lg"
            >
              <Link href="/shop" className="flex items-center gap-2">
                <ShoppingBag size={20} />
                Browse Products
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="bg-transparent border-2 border-dark/20 hover:border-dark/40 text-dark font-medium px-8 py-6 rounded-xl transition-all"
              size="lg"
            >
              <Link href="/about" className="flex items-center gap-2">
                About SpicePop
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-8 mt-10">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/20 w-10 h-10 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-dark">Quality Assured</p>
                <p className="text-xs text-gray-500">Premium sourced ingredients</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center">
                <Utensils className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-dark">Traditional Recipes</p>
                <p className="text-xs text-gray-500">Authentic Nigerian dishes</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center justify-center relative">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="relative h-[250px] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80" 
                alt="Colorful Nigerian spices in bowls" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 text-primary text-xs px-3 py-1 rounded-full inline-block">Spices</span>
              </div>
            </div>
            
            <div className="relative h-[250px] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&q=80" 
                alt="Premium protein products" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 text-primary text-xs px-3 py-1 rounded-full inline-block">Protein</span>
              </div>
            </div>
            
            <div className="relative h-[250px] rounded-2xl overflow-hidden shadow-xl col-span-2">
              <img 
                src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200&q=80" 
                alt="Nigerian foodstuffs and ingredients" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 text-primary text-xs px-3 py-1 rounded-full inline-block">Foodstuffs</span>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -right-10 top-20 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-float">
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
              <div className="bg-secondary/20 w-10 h-10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-dark">Most Popular</p>
                <p className="text-xs text-gray-500">Our best-selling products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
    </section>
  );
}
