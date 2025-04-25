import { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { Helmet } from 'react-helmet';

export default function NewProductPage() {
  // Update document title
  useEffect(() => {
    document.title = 'New Product | SpicePop Admin';
  }, []);
  
  return (
    <>
      <Helmet>
        <title>New Product | SpicePop Admin</title>
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
            <p className="text-gray-500">Create a new product in your inventory</p>
          </div>
          
          <ProductForm />
        </div>
      </AdminLayout>
    </>
  );
}
