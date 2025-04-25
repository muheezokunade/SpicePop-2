import { FEATURES } from '@/lib/constants';
import { 
  Leaf, 
  Truck, 
  Award
} from 'lucide-react';

export default function Features() {
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Leaf':
        return <Leaf className="h-6 w-6" />;
      case 'Truck':
        return <Truck className="h-6 w-6" />;
      case 'Award':
        return <Award className="h-6 w-6" />;
      default:
        return null;
    }
  };
  
  const getIconBgColor = (color: string) => {
    switch(color) {
      case 'primary':
        return 'bg-primary/20 text-primary';
      case 'secondary':
        return 'bg-secondary/20 text-secondary';
      case 'dark':
        return 'bg-cream bg-opacity-50 text-dark';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-12">
          Why Choose SpicePop
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <div className={`${getIconBgColor(feature.color)} rounded-full w-16 h-16 flex items-center justify-center mb-4`}>
                {getIcon(feature.icon)}
              </div>
              
              <h3 className="font-poppins font-semibold text-xl mb-3">{feature.title}</h3>
              
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
