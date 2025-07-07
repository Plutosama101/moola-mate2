
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import RestaurantCard from '@/components/RestaurantCard';
import CategoryCard from '@/components/CategoryCard';
import FavoriteRestaurants from '@/components/FavoriteRestaurants';
import NigerianWallet from '@/components/NigerianWallet';
import QRScanner from '@/components/QRScanner';
import NigerianQRPayment from '@/components/NigerianQRPayment';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star,
  TrendingUp,
  Clock,
  Utensils,
  Coffee,
  Pizza,
  IceCream
} from 'lucide-react';
import { getAllNigerianFoods, nigerianRestaurants } from '@/data/nigerianFood';

const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('nigerianWallet');
    return saved ? parseInt(saved) : 5000;
  });
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteRestaurants');
    return saved ? JSON.parse(saved) : [];
  });

  const categories = [
    { id: 'all', name: 'All', emoji: '🍽️' },
    { id: 'Rice Dishes', name: 'Rice', emoji: '🍚' },
    { id: 'Soups & Stews', name: 'Soup', emoji: '🍲' },
    { id: 'Snacks', name: 'Snacks', emoji: '🥟' },
  ];

  const popularRestaurants = nigerianRestaurants.map(restaurant => ({
    id: restaurant.id,
    name: restaurant.name,
    image: restaurant.image,
    rating: restaurant.rating,
    deliveryTime: restaurant.deliveryTime,
    categories: [restaurant.cuisine],
    isOpen: true,
    distance: "0.5 km"
  }));

  const allFoods = getAllNigerianFoods();
  const filteredFoods = allFoods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePaymentComplete = (amount: number) => {
    const newBalance = walletBalance - amount;
    setWalletBalance(newBalance);
    localStorage.setItem('nigerianWallet', newBalance.toString());
  };

  const handleToggleFavorite = (restaurantId: string) => {
    const newFavorites = favoriteRestaurantIds.includes(restaurantId)
      ? favoriteRestaurantIds.filter(id => id !== restaurantId)
      : [...favoriteRestaurantIds, restaurantId];
    
    setFavoriteRestaurantIds(newFavorites);
    localStorage.setItem('favoriteRestaurants', JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      {/* Quick Actions */}
      <div className="px-4 pt-4 space-y-4">
        <NigerianWallet balance={walletBalance} onBalanceChange={setWalletBalance} />
        
        {/* QR Scanner for Students */}
        <QRScanner walletBalance={walletBalance} onPaymentComplete={handlePaymentComplete} />
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search food or restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 bg-white border-gray-200 focus:border-orange-500"
          />
          <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              emoji={category.emoji}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Orders This Week</p>
              <p className="text-xl font-bold text-gray-900">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Avg. Delivery</p>
              <p className="text-xl font-bold text-gray-900">18 min</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Restaurants */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Popular Restaurants</h2>
          <Button variant="ghost" size="sm" className="text-orange-600">
            See All
          </Button>
        </div>
        <div className="space-y-3">
          {popularRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
      </div>

      {/* Food Items */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {selectedCategory === 'all' ? 'Popular Foods' : `${categories.find(c => c.id === selectedCategory)?.name} Foods`}
          </h2>
          <Badge variant="secondary">{filteredFoods.length} items</Badge>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {filteredFoods.map((food) => (
            <Card key={food.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{food.name}</h3>
                    <p className="text-sm text-gray-600">{food.restaurant}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.5</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">15-20 min</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₦{food.price.toLocaleString()}</p>
                    <NigerianQRPayment 
                      food={food}
                      walletBalance={walletBalance}
                      onBalanceChange={setWalletBalance}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Favorite Restaurants */}
      <div className="px-4 mb-6">
        <FavoriteRestaurants 
          restaurants={nigerianRestaurants}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteRestaurantIds}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
