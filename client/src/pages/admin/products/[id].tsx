import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { API_ENDPOINTS } from '@/lib/constants';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function EditProductPage() {
  const [match, params] = useRoute('/admin/products/:id');
  const [, setLocation] = useLocation();
  const productId = params?.id;
  
  // Fetch product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [API_ENDPOINTS.products.detail(productId || '')],
    enabled: !!productId,
  });
  
  // Update document title
  useEffect(() => {
    if (product) {
      document.title = `Edit ${product.name} | SpicePop Admin`;
    } else {
      document.title = 'Edit Product | SpicePop Admin';
    }
  }, [product]);
  
  if (!match) {
    setLocation('/admin/products');
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>{product ? `Edit ${product.name}` : 'Edit Product'} | SpicePop Admin</title>
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => setLocation('/admin/products')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Button>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isLoading ? (
                <Skeleton className="h-9 w-48" />
              ) : error ? (
                'Product Not Found'
              ) : (
                `Edit ${product?.name}`
              )}
            </h1>
            <p className="text-gray-500">Update product information</p>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Product Not Found</h3>
              <p className="text-gray-500 mb-6">
                The product you're trying to edit doesn't exist or has been deleted.
              </p>
              <Button onClick={() => setLocation('/admin/products')}>
                Back to Products
              </Button>
            </div>
          ) : (
            <ProductForm productId={productId} />
          )}
        </div>
      </AdminLayout>
    </>
  );
}
