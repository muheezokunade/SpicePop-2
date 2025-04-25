import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative bg-dark text-white">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-16 md:py-32 flex flex-col items-center justify-center text-center">
        <h1 className="font-poppins font-bold text-3xl md:text-5xl lg:text-6xl mb-6">
          Authentic Nigerian Spices
        </h1>
        
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Experience the rich flavors of Nigeria with our premium quality spices and foodstuffs delivered to your doorstep.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            asChild
            className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 rounded-md transition-all transform hover:scale-105"
            size="lg"
          >
            <Link href="/shop">
              <a>Shop Now</a>
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            className="bg-transparent border-2 border-cream hover:bg-cream/20 text-white font-medium px-8 py-6 rounded-md transition-all"
            size="lg"
          >
            <Link href="/about">
              <a>Learn More</a>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d" 
          alt="Colorful Nigerian spices" 
          className="w-full h-full object-cover" 
        />
      </div>
    </section>
  );
}
