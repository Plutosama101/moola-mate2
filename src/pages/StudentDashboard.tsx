import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import RestaurantCard from '@/components/RestaurantCard';
import NigerianWallet, { storage } from '@/components/NigerianWallet';
import QRScanner from '@/components/QRScanner';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { nigerianFoodCategories, nigerianRestaurants } from '@/data/nigerianFood';
import { useToast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const { toast } = useToast();

  // Initialize wallet balance from localStorage
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
  }, []);

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

  return (
    <div className="px-4 space-y-6">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

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

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Welcome to SnappyEats! 🍽️</h2>
        <p className="text-white/90 text-sm">Quick, easy, and delicious meals at your fingertips</p>
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
              <RestaurantCard key={restaurant.id} {...restaurant} />
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
    </div>
  );
};

export default StudentDashboard;
