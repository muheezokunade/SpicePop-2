import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Product } from '@shared/schema';
import { API_ENDPOINTS } from '@/lib/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function ProductPage() {
  const [match, params] = useRoute('/product/:id');
  const productId = params?.id;
  
  // Fetch product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [API_ENDPOINTS.products.detail(productId || '')],
    enabled: !!productId,
  });
  
  // Update document title
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | SpicePop`;
    } else {
      document.title = 'Product Details | SpicePop';
    }
  }, [product]);
  
  if (!match) {
    return <div>Product not found</div>;
  }
  
  return (
    <>
      {product && (
        <Helmet>
          <title>{product.name} | SpicePop</title>
          <meta name="description" content={product.description.substring(0, 160)} />
        </Helmet>
      )}
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="mb-4"
              >
                <Link href="/shop">
                  <a className="flex items-center">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Shop
                  </a>
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="aspect-square rounded-lg" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="pt-4">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                <p className="text-gray-600 mb-6">
                  The product you're looking for might have been removed or doesn't exist.
                </p>
                <Button asChild>
                  <Link href="/shop">
                    <a>Continue Shopping</a>
                  </Link>
                </Button>
              </div>
            ) : product ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProductGallery 
                  images={product.imageUrl ? [product.imageUrl] : []} 
                  productName={product.name} 
                />
                <ProductInfo product={product} />
              </div>
            ) : null}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
