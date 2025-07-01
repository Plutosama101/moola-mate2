
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Heart, ShoppingBag, Bell } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import RestaurantCard from '@/components/RestaurantCard';
import NigerianWallet from '@/components/NigerianWallet';
import { storage } from '@/utils/storage';
import QRScanner from '@/components/QRScanner';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import OrderTracking from '@/components/OrderTracking';
import CartSidebar from '@/components/CartSidebar';
import FavoriteRestaurants from '@/components/FavoriteRestaurants';
import NotificationSystem, { Notification } from '@/components/NotificationSystem';
import DeliveryTracking from '@/components/DeliveryTracking';
import { nigerianFoodCategories, nigerianRestaurants } from '@/data/nigerianFood';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
}

interface Order {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  estimatedTime: number;
  timestamp: number;
}

const StudentDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const { toast } = useToast();

  // Initialize data from localStorage
  useEffect(() => {
    const savedBalance = storage.getItem('nigerianWallet');
    if (savedBalance) {
      try {
        setWalletBalance(parseInt(savedBalance));
      } catch {
        setWalletBalance(5000);
        storage.setItem('nigerianWallet', '5000');
      }
    } else {
      setWalletBalance(5000);
      storage.setItem('nigerianWallet', '5000');
    }

    // Load favorites
    const savedFavorites = storage.getItem('favoriteRestaurants');
    if (savedFavorites) {
      try {
        setFavoriteIds(JSON.parse(savedFavorites));
      } catch {
        setFavoriteIds([]);
      }
    }

    // Load cart items
    const savedCart = storage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }

    // Load orders
    const savedOrders = storage.getItem('userOrders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch {
        setOrders([]);
      }
    }

    // Initialize sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Welcome to SnappyEats!',
        message: 'Enjoy quick and delicious meals at your fingertips',
        type: 'system',
        timestamp: Date.now() - 3600000,
        read: false
      },
      {
        id: '2',
        title: '20% Off Today!',
        message: 'Get 20% off your first order from any restaurant',
        type: 'promotion',
        timestamp: Date.now() - 7200000,
        read: false
      }
    ];
    setNotifications(sampleNotifications);
  }, []);

  // Save data to localStorage
  const saveCartItems = (items: CartItem[]) => {
    setCartItems(items);
    storage.setItem('cartItems', JSON.stringify(items));
  };

  const saveOrders = (orderList: Order[]) => {
    setOrders(orderList);
    storage.setItem('userOrders', JSON.stringify(orderList));
  };

  const saveFavorites = (favorites: string[]) => {
    setFavoriteIds(favorites);
    storage.setItem('favoriteRestaurants', JSON.stringify(favorites));
  };

  // Filter restaurants based on category and search
  const filteredRestaurants = nigerianRestaurants.filter(restaurant => {
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.foods.some(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === '' ||
      restaurant.foods.some(food => food.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? '' : categoryName);
  };

  const handlePaymentComplete = (amount: number) => {
    const newBalance = walletBalance - amount;
    setWalletBalance(newBalance);
    storage.setItem('nigerianWallet', newBalance.toString());
  };

  const handleAddToCart = (restaurantId: string, foodId: string, name: string, price: number) => {
    const restaurant = nigerianRestaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;

    const existingItem = cartItems.find(item => item.id === foodId);
    if (existingItem) {
      const updatedItems = cartItems.map(item =>
        item.id === foodId ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCartItems(updatedItems);
    } else {
      const newItem: CartItem = {
        id: foodId,
        name,
        price,
        quantity: 1,
        restaurant: restaurant.name
      };
      saveCartItems([...cartItems, newItem]);
    }

    toast({
      title: "Added to Cart",
      description: `${name} added to your cart`,
    });
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveFromCart(id);
      return;
    }
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCartItems(updatedItems);
  };

  const handleRemoveFromCart = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    saveCartItems(updatedItems);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (totalAmount > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₦${(totalAmount - walletBalance).toLocaleString()} more`,
        variant: "destructive",
      });
      return;
    }

    // Create new order
    const newOrder: Order = {
      id: Date.now().toString(),
      restaurantName: cartItems[0].restaurant,
      items: cartItems.map(item => `${item.name} (${item.quantity}x)`),
      total: totalAmount,
      status: 'pending',
      estimatedTime: 30,
      timestamp: Date.now()
    };

    saveOrders([...orders, newOrder]);
    handlePaymentComplete(totalAmount);
    saveCartItems([]);

    // Add notification
    const orderNotification: Notification = {
      id: Date.now().toString(),
      title: 'Order Placed Successfully!',
      message: `Your order from ${newOrder.restaurantName} is being prepared`,
      type: 'order',
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [orderNotification, ...prev]);

    toast({
      title: "Order Placed!",
      description: `Your order from ${newOrder.restaurantName} is being prepared`,
    });

    setActiveTab('orders');
  };

  const handleToggleFavorite = (restaurantId: string) => {
    const isFavorite = favoriteIds.includes(restaurantId);
    const updatedFavorites = isFavorite
      ? favoriteIds.filter(id => id !== restaurantId)
      : [...favoriteIds, restaurantId];
    saveFavorites(updatedFavorites);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Sample delivery info for demo
  const sampleDelivery = orders.find(order => order.status === 'ready') ? {
    orderId: orders[0]?.id || '',
    status: 'on_the_way' as const,
    driverName: 'John Doe',
    driverPhone: '+234 123 456 7890',
    estimatedArrival: '15 minutes',
    currentLocation: 'Victoria Island'
  } : null;

  return (
    <div className="px-4 space-y-6">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Header with Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-orange-600">SnappyEats</h1>
          <p className="text-muted-foreground">Quick, delicious meals delivered</p>
        </div>
        <NotificationSystem
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onDismiss={handleDismissNotification}
        />
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search restaurants or dishes..." 
              className="pl-10 bg-background/50 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Food Categories</h3>
            <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
              {nigerianFoodCategories.map((category) => (
                <div 
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`cursor-pointer transition-all ${
                    selectedCategory === category.name ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <CategoryCard {...category} />
                </div>
              ))}
            </div>
            {selectedCategory && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing restaurants with {selectedCategory} • 
                <button 
                  onClick={() => setSelectedCategory('')}
                  className="text-orange-600 hover:underline ml-1"
                >
                  Clear filter
                </button>
              </p>
            )}
          </div>

          {/* Restaurants */}
          <div>
            <h3 className="font-semibold mb-3">
              {selectedCategory ? `${selectedCategory} Restaurants` : 'Featured Restaurants'}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => (
                  <RestaurantCard 
                    key={restaurant.id} 
                    {...restaurant}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={() => handleToggleFavorite(restaurant.id)}
                    isFavorite={favoriteIds.includes(restaurant.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No restaurants found matching your criteria.</p>
                  {selectedCategory && (
                    <button 
                      onClick={() => setSelectedCategory('')}
                      className="text-orange-600 hover:underline mt-2"
                    >
                      View all restaurants
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Your Orders</h3>
            <OrderTracking orders={orders} />
          </div>
          
          {sampleDelivery && (
            <DeliveryTracking delivery={sampleDelivery} />
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <FavoriteRestaurants
            restaurants={nigerianRestaurants}
            onToggleFavorite={handleToggleFavorite}
            favoriteIds={favoriteIds}
          />
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          {/* Nigerian Wallet */}
          <NigerianWallet 
            balance={walletBalance} 
            onBalanceChange={setWalletBalance}
          />

          {/* QR Scanner */}
          <div className="mb-4">
            <QRScanner 
              walletBalance={walletBalance}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Cart Sidebar */}
      <CartSidebar
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        walletBalance={walletBalance}
      />
    </div>
  );
};

export default StudentDashboard;
