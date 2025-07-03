
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, CheckCircle, Package, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderTracking from '@/components/OrderTracking';
import { storage } from '@/utils/storage';

interface Order {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  estimatedTime: number;
  timestamp: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load orders from storage
    const savedOrders = storage.getItem('userOrders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch {
        setOrders([]);
      }
    }
  }, []);

  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
  );
  
  const pastOrders = orders.filter(order => order.status === 'delivered');

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'preparing': return <Package className="w-4 h-4 text-orange-500" />;
      case 'ready': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'delivered': return <Truck className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{order.restaurantName}</h3>
          <p className="text-sm text-gray-500">Order #{order.id.slice(-6)}</p>
        </div>
        <Badge className={getStatusColor(order.status)}>
          {getStatusIcon(order.status)}
          <span className="ml-1 capitalize">{order.status}</span>
        </Badge>
      </div>
      
      <div className="space-y-1 mb-3">
        {order.items.map((item, index) => (
          <p key={index} className="text-sm text-gray-600">• {item}</p>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          {new Date(order.timestamp).toLocaleDateString()}
        </div>
        <div className="font-semibold text-gray-900">
          ₦{order.total.toLocaleString()}
        </div>
      </div>
      
      {order.status !== 'delivered' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-orange-600">
            <Clock className="w-4 h-4" />
            <span>Estimated: {order.estimatedTime} mins</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Your Orders</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white shadow-sm border border-gray-100">
            <TabsTrigger value="active" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Active ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Past Orders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {activeOrders.length > 0 ? (
              <>
                <OrderTracking orders={activeOrders} />
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-lg font-semibold mb-2">No active orders</h3>
                <p className="text-gray-600 mb-4">Start browsing to place your first order</p>
                <Button onClick={() => navigate('/')}>
                  Browse Restaurants
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastOrders.length > 0 ? (
              pastOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold mb-2">No past orders</h3>
                <p className="text-gray-600">Your completed orders will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
