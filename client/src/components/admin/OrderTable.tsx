import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderStatus } from '@shared/schema';
import { API_ENDPOINTS, ORDER_STATUSES } from '@/lib/constants';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye } from 'lucide-react';

export default function OrderTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Fetch orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: [API_ENDPOINTS.orders.list],
  });
  
  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const response = await apiRequest('PATCH', API_ENDPOINTS.orders.updateStatus(id), { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.orders.list] });
      toast({
        title: 'Status Updated',
        description: 'Order status has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update order status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Handle status change
  const handleStatusChange = (orderId: string, status: string) => {
    updateStatusMutation.mutate({
      id: orderId,
      status: status as OrderStatus,
    });
  };
  
  // Get status badge color
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
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // Empty state
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <h3 className="text-xl font-medium mb-2">No orders found</h3>
        <p className="text-gray-500">
          Orders will appear here once customers start placing them.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        <Badge variant={getStatusBadge(order.status)}>
                          {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      {selectedOrder && (
                        <>
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                              Order ID: {selectedOrder.id}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div>
                              <h3 className="font-medium mb-2">Customer Information</h3>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                                <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                                <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                              </div>
                              
                              <h3 className="font-medium mt-4 mb-2">Shipping Address</h3>
                              <p className="text-sm whitespace-pre-line">{selectedOrder.shippingAddress}</p>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2">Order Items</h3>
                              <ul className="space-y-3">
                                {selectedOrder.items.map((item, index) => (
                                  <li key={index} className="text-sm border-b pb-2">
                                    <div className="flex justify-between font-medium">
                                      <span>{item.name}</span>
                                      <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                    <div className="text-gray-500">
                                      {item.quantity} x {formatCurrency(item.price)}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="mt-4 pt-2 border-t flex justify-between font-medium">
                                <span>Total Amount:</span>
                                <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
