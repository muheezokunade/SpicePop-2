import { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import OrderTable from '@/components/admin/OrderTable';
import { Helmet } from 'react-helmet';

export default function AdminOrdersPage() {
  // Update document title
  useEffect(() => {
    document.title = 'Manage Orders | SpicePop Admin';
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Manage Orders | SpicePop Admin</title>
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Orders</h1>
            <p className="text-gray-500">Manage customer orders</p>
          </div>
          
          <OrderTable />
        </div>
      </AdminLayout>
    </>
  );
}
