import { TESTIMONIALS } from '@/lib/constants';
import { Star, StarHalf } from 'lucide-react';

export default function Testimonials() {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-primary text-primary" />);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-primary text-primary" />);
    }
    
    return stars;
  };
  
  return (
    <section className="py-16 bg-gray-light">
      <div className="container mx-auto px-4">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-12">
          What Our Customers Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="text-primary flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-500">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
