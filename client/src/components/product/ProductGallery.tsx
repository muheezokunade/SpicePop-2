import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export default function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || '');
  
  // If no images provided, show placeholder
  if (!images.length) {
    return (
      <div className={cn("aspect-square bg-gray-100 rounded-lg flex items-center justify-center", className)}>
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }
  
  // If only one image
  if (images.length === 1) {
    return (
      <div className={cn("overflow-hidden rounded-lg", className)}>
        <img 
          src={images[0]} 
          alt={productName} 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* Main image */}
      <div className="aspect-square overflow-hidden rounded-lg mb-4">
        <img 
          src={mainImage} 
          alt={productName} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "aspect-square rounded-md overflow-hidden border-2", 
              mainImage === image ? "border-primary" : "border-transparent"
            )}
            onClick={() => setMainImage(image)}
          >
            <img 
              src={image} 
              alt={`${productName} thumbnail ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
