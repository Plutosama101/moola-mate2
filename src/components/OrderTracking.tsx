
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Truck, User } from 'lucide-react';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';

interface Order {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: OrderStatus;
  estimatedTime: number;
  timestamp: number;
}

interface OrderTrackingProps {
  orders: Order[];
  onOrderUpdate?: (orderId: string, status: OrderStatus) => void;
}

const OrderTracking = ({ orders, onOrderUpdate }: OrderTrackingProps) => {
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <User className="w-4 h-4" />;
      case 'ready':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'delivered');

  if (activeOrders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No active orders</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activeOrders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{order.restaurantName}</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Items: {order.items.join(', ')}
              </p>
              <p className="font-semibold">₦{order.total.toLocaleString()}</p>
              {order.status !== 'delivered' && (
                <p className="text-sm text-blue-600">
                  Estimated time: {order.estimatedTime} minutes
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderTracking;
