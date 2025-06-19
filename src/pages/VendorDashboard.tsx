
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Store, DollarSign, Users, Plus, Trash2, Eye } from 'lucide-react';
import { storage } from '@/components/NigerianWallet';
import { useToast } from '@/hooks/use-toast';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

interface Payment {
  id: string;
  amount: number;
  foodName: string;
  timestamp: number;
  status: 'completed';
}

const VendorDashboard = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '', description: '' });
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load existing food items
    const savedItems = storage.getItem('vendorFoodItems');
    if (savedItems) {
      try {
        setFoodItems(JSON.parse(savedItems));
      } catch {
        setFoodItems([]);
      }
    }

    // Load payment history
    const savedPayments = storage.getItem('vendorPayments');
    if (savedPayments) {
      try {
        setPayments(JSON.parse(savedPayments));
      } catch {
        setPayments([]);
      }
    }
  }, []);

  const saveItems = (items: FoodItem[]) => {
    setFoodItems(items);
    storage.setItem('vendorFoodItems', JSON.stringify(items));
  };

  const addFoodItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Error",
        description: "Please fill in name and price",
        variant: "destructive",
      });
      return;
    }

    const item: FoodItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category || 'Other',
      description: newItem.description,
      image: `https://source.unsplash.com/400x300/?nigerian,food,${encodeURIComponent(newItem.name)}`
    };

    const updatedItems = [...foodItems, item];
    saveItems(updatedItems);
    setNewItem({ name: '', price: '', category: '', description: '' });
    
    toast({
      title: "Item Added",
      description: `${item.name} has been added to your menu`,
    });
  };

  const deleteFoodItem = (id: string) => {
    const updatedItems = foodItems.filter(item => item.id !== id);
    saveItems(updatedItems);
    
    toast({
      title: "Item Deleted",
      description: "Food item has been removed from your menu",
    });
  };

  const generateQRCode = (item?: FoodItem, amount?: number) => {
    const paymentData = {
      type: 'nigerian_food_payment',
      vendorId: 'current-vendor',
      amount: amount || item?.price || 0,
      foodName: item?.name || 'Custom Amount',
      foodId: item?.id,
      timestamp: Date.now(),
    };

    return JSON.stringify(paymentData);
  };

  const getQRCodeUrl = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  };

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const todaysRevenue = payments
    .filter(p => new Date(p.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-600">Vendor Dashboard</h1>
        <p className="text-muted-foreground">Manage your Nigerian restaurant</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{foodItems.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{todaysRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payments.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Food Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Food Name</Label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="e.g., Jollof Rice with Chicken"
                  />
                </div>
                <div>
                  <Label>Price (₦)</Label>
                  <Input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    placeholder="e.g., 800"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    placeholder="e.g., Rice Dishes"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Brief description"
                  />
                </div>
              </div>
              <Button onClick={addFoodItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Food Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foodItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="text-lg font-bold text-green-600">₦{item.price.toLocaleString()}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setQrDialogOpen(true);
                          }}
                        >
                          <QrCode className="w-3 h-3 mr-1" />
                          QR
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteFoodItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {foodItems.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No food items yet. Add some delicious Nigerian dishes!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr-codes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Custom Amount (₦)</Label>
                <Input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <Button
                onClick={() => {
                  if (customAmount) {
                    const qrData = generateQRCode(undefined, parseFloat(customAmount));
                    setSelectedItem({ 
                      id: 'custom',
                      name: `Custom Amount: ₦${customAmount}`,
                      price: parseFloat(customAmount),
                      category: 'Custom'
                    });
                    setQrDialogOpen(true);
                  }
                }}
                disabled={!customAmount}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.foodName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{payment.amount.toLocaleString()}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No payments received yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Payment QR Code</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            {selectedItem && (
              <>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold">{selectedItem.name}</h3>
                  <p className="text-xl font-bold text-green-600">₦{selectedItem.price.toLocaleString()}</p>
                </div>
                <img 
                  src={getQRCodeUrl(generateQRCode(selectedItem))} 
                  alt="QR Code" 
                  className="mx-auto border rounded"
                />
                <p className="text-sm text-gray-600">
                  Students can scan this code to pay for this item
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorDashboard;
