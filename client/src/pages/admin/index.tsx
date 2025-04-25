import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';
import { API_ENDPOINTS, ORDER_STATUSES } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@shared/schema';
import { Helmet } from 'react-helmet';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  // Fetch recent orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: [API_ENDPOINTS.orders.list],
  });
  
  // Update document title
  useEffect(() => {
    document.title = 'Admin Dashboard | SpicePop';
  }, []);
  
  // Get recent orders (latest 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    const statusItem = ORDER_STATUSES.find(s => s.value === status);
    if (!statusItem) return 'default';
    
    switch (statusItem.color) {
      case 'yellow': return 'warning';
      case 'blue': return 'info';
      case 'purple': return 'secondary';
      case 'green': return 'success';
      default: return 'default';
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | SpicePop</title>
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-500">Welcome to your admin dashboard</p>
          </div>
          
          <DashboardStats />
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest 5 orders received
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <p className="text-center py-6 text-gray-500">No orders found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(order.status)}>
                            {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
}
