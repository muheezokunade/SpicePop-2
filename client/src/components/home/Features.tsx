import { FEATURES } from '@/lib/constants';
import { 
  Leaf, 
  Truck, 
  Award,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Features() {
  const featureIcons: Record<string, React.ReactNode> = {
    'Leaf': <Leaf className="h-6 w-6" />,
    'Truck': <Truck className="h-6 w-6" />,
    'Award': <Award className="h-6 w-6" />,
    'Shield': <ShieldCheck className="h-6 w-6" />,
    'Sparkles': <Sparkles className="h-6 w-6" />,
    'Utensils': <UtensilsCrossed className="h-6 w-6" />,
    'Clock': <Clock className="h-6 w-6" />
  };
  
  const getIcon = (iconName: string) => {
    return featureIcons[iconName] || null;
  };
  
  const getIconBgColor = (color: string) => {
    switch(color) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'secondary':
        return 'bg-secondary/10 text-secondary';
      case 'dark':
        return 'bg-cream bg-opacity-50 text-dark';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Enhanced features with new descriptions for spices
  const enhancedFeatures = [
    {
      title: "Premium Quality",
      description: "Our spices are sourced directly from Nigerian farmers, ensuring the highest quality and freshness.",
      icon: "Award",
      color: "primary"
    },
    {
      title: "Fast Delivery",
      description: "We deliver to your doorstep across Nigeria within 2-3 business days.",
      icon: "Truck",
      color: "secondary"
    },
    {
      title: "Authentic Flavors",
      description: "Experience the rich, authentic tastes of traditional Nigerian cuisine.",
      icon: "Utensils",
      color: "primary"
    },
    {
      title: "Quality Guaranteed",
      description: "All our products are tested for quality and authenticity before shipping.",
      icon: "Shield",
      color: "secondary" 
    }
  ];
  
  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-medium">Our Commitment</span>
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-dark mt-2 mb-4">
            Why Choose SpicePop
          </h2>
          <p className="text-gray-600 mb-6">
            We're dedicated to bringing you the finest Nigerian spices and foodstuffs with quality, 
            authenticity, and convenience at the heart of everything we do.
          </p>
          <Button 
            asChild
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary/5"
          >
            <Link href="/about" className="px-6">
              Learn More About Our Story
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {enhancedFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div className={`${getIconBgColor(feature.color)} rounded-full w-14 h-14 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                {getIcon(feature.icon)}
              </div>
              
              <h3 className="font-poppins font-semibold text-xl mb-3 text-dark">{feature.title}</h3>
              
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
}
