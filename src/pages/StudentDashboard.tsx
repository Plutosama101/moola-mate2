
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Heart, ShoppingBag, Bell, Star, Clock, TrendingUp, Zap } from 'lucide-react';
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
import DownloadableReceipt from '@/components/DownloadableReceipt';
import { nigerianFoodCategories, nigerianRestaurants } from '@/data/nigerianFood';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

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

interface PaymentHistory {
  id: string;
  type: 'wallet_topup' | 'food_order';
  amount: number;
  reference: string;
  timestamp: number;
  customerEmail?: string;
}

const StudentDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Get initial tab from URL params
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'home';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update tab when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab') || 'home';
    setActiveTab(tab);
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigate('/', { replace: true });
    } else {
      navigate(`/?tab=${tab}`, { replace: true });
    }
  };

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

    // Load payment history
    const savedHistory = storage.getItem('paymentHistory');
    if (savedHistory) {
      try {
        setPaymentHistory(JSON.parse(savedHistory));
      } catch {
        setPaymentHistory([]);
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

  const savePaymentHistory = (history: PaymentHistory[]) => {
    setPaymentHistory(history);
    storage.setItem('paymentHistory', JSON.stringify(history));
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

    // Add to payment history
    const orderPayment: PaymentHistory = {
      id: `order_${Date.now()}`,
      type: 'food_order',
      amount: totalAmount,
      reference: `order_${newOrder.id}`,
      timestamp: Date.now(),
    };
    savePaymentHistory([orderPayment, ...paymentHistory]);

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
    <div className="bg-gray-50 min-h-screen">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      <div className="px-4 pt-6 space-y-6">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-gray-100">
            <TabsTrigger value="home" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Home
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Orders
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 mt-6">
            {/* Search Bar with Modern Design */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search for cafeterias, dishes..." 
                className="pl-12 pr-4 py-4 bg-white border-gray-200 rounded-2xl shadow-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Promotional Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <Badge className="bg-white/20 text-white border-white/30">
                    Campus Special
                  </Badge>
                </div>
                <h2 className="text-xl font-bold mb-2">Free Delivery Today! 🚀</h2>
                <p className="text-white/90 text-sm mb-4">Order from your favorite campus cafeterias</p>
                <Button size="sm" className="bg-white text-orange-500 hover:bg-white/90 font-semibold">
                  Order Now
                </Button>
              </div>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-500">This Week</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{orders.length}</p>
                <p className="text-xs text-gray-600">Orders</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-gray-500">Saved</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{favoriteIds.length}</p>
                <p className="text-xs text-gray-600">Favorites</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-gray-500">Rating</span>
                </div>
                <p className="text-lg font-bold text-gray-900">4.8</p>
                <p className="text-xs text-gray-600">Average</p>
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Browse Categories</h3>
                <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                  See all
                </Button>
              </div>
              <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
                {nigerianFoodCategories.map((category) => (
                  <div 
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`cursor-pointer transition-all ${
                      selectedCategory === category.name ? 'ring-2 ring-orange-500 scale-105' : ''
                    }`}
                  >
                    <CategoryCard {...category} />
                  </div>
                ))}
              </div>
              {selectedCategory && (
                <div className="flex items-center space-x-2 mt-3">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {selectedCategory}
                  </Badge>
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            {/* Restaurants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedCategory ? `${selectedCategory} Cafeterias` : 'Campus Cafeterias'}
                </h3>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">15-30 min</span>
                </div>
              </div>
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
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-6xl mb-4">🍽️</div>
                    <p className="text-gray-600 mb-2">No cafeterias found</p>
                    {selectedCategory && (
                      <button 
                        onClick={() => setSelectedCategory('')}
                        className="text-orange-500 hover:text-orange-600 font-medium"
                      >
                        View all cafeterias
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6 mt-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Orders</h3>
              <OrderTracking orders={orders} />
            </div>
            
            {sampleDelivery && (
              <DeliveryTracking delivery={sampleDelivery} />
            )}

            {/* Enhanced Payment History with Downloadable Receipts */}
            {paymentHistory.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>
                <div className="space-y-3">
                  {paymentHistory.slice(0, 10).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.type === 'wallet_topup' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {payment.type === 'wallet_topup' ? '💰' : '🍽️'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.type === 'wallet_topup' ? 'Wallet Top-up' : 'Food Order'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`font-bold ${
                          payment.type === 'wallet_topup' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {payment.type === 'wallet_topup' ? '+' : '-'}₦{payment.amount.toLocaleString()}
                        </span>
                        <DownloadableReceipt receipt={payment} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6 mt-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <FavoriteRestaurants
                restaurants={nigerianRestaurants}
                onToggleFavorite={handleToggleFavorite}
                favoriteIds={favoriteIds}
              />
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6 mt-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <NigerianWallet 
                balance={walletBalance} 
                onBalanceChange={setWalletBalance}
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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

        {/* Notifications */}
        <NotificationSystem
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onDismiss={handleDismissNotification}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
