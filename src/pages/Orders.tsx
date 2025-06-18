
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderCard from '@/components/OrderCard';

const Orders = () => {
  const activeOrders = [
    {
      restaurantName: "Tony's Pizza Palace",
      items: ['Margherita Pizza', 'Garlic Bread'],
      status: 'preparing' as const,
      estimatedTime: '25 mins',
      total: 24.99,
    },
    {
      restaurantName: 'Burger Junction',
      items: ['Classic Burger', 'Fries', 'Coke'],
      status: 'on-the-way' as const,
      estimatedTime: '10 mins',
      total: 18.50,
    },
  ];

  const pastOrders = [
    {
      restaurantName: 'Sakura Sushi',
      items: ['California Roll', 'Salmon Sashimi'],
      status: 'delivered' as const,
      total: 32.00,
    },
    {
      restaurantName: 'Sweet Dreams Bakery',
      items: ['Chocolate Cake', 'Coffee'],
      status: 'delivered' as const,
      total: 15.99,
    },
  ];

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeOrders.length > 0 ? (
            activeOrders.map((order, index) => (
              <OrderCard key={index} {...order} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold mb-2">No active orders</h3>
              <p className="text-muted-foreground">Start browsing to place your first order</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastOrders.map((order, index) => (
            <OrderCard key={index} {...order} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
