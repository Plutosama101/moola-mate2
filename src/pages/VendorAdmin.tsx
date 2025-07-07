import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Store, DollarSign, Users, LogOut } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const VendorAdmin = () => {
  const [vendorInfo, setVendorInfo] = useState({
    name: 'Tony\'s Pizza Palace',
    id: 'vendor-001',
    address: '123 Campus Street'
  });

  const [paymentAmount, setPaymentAmount] = useState('');
  const [customOrderId, setCustomOrderId] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data for analytics
  const analytics = {
    totalRevenue: 2450.75,
    totalOrders: 87,
    pendingOrders: 5,
    completedToday: 23
  };

  const recentOrders = [
    { id: 'ORD-001', amount: 24.99, status: 'paid', time: '2 mins ago' },
    { id: 'ORD-002', amount: 18.50, status: 'pending', time: '5 mins ago' },
    { id: 'ORD-003', amount: 32.00, status: 'paid', time: '12 mins ago' },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your vendor account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {vendorInfo.name}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qr-generator">QR Generator</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.pendingOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.completedToday}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr-generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Payment QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Payment Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="orderId">Custom Order ID (Optional)</Label>
                    <Input
                      id="orderId"
                      placeholder="Enter custom order ID"
                      value={customOrderId}
                      onChange={(e) => setCustomOrderId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vendor Information</Label>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Name: {vendorInfo.name}</p>
                      <p>ID: {vendorInfo.id}</p>
                      <p>Address: {vendorInfo.address}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <QRCodeGenerator vendorInfo={vendorInfo} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Order management features coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input
                    id="vendorName"
                    value={vendorInfo.name}
                    onChange={(e) => setVendorInfo({...vendorInfo, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorAddress">Address</Label>
                  <Input
                    id="vendorAddress"
                    value={vendorInfo.address}
                    onChange={(e) => setVendorInfo({...vendorInfo, address: e.target.value})}
                  />
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorAdmin;
