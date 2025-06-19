
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import RestaurantCard from '@/components/RestaurantCard';
import NigerianWallet, { storage } from '@/components/NigerianWallet';
import { nigerianFoodCategories, nigerianRestaurants, getAllNigerianFoods, getFoodsByCategory } from '@/data/nigerianFood';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

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

  return (
    <div className="px-4 space-y-6">
      {/* Nigerian Wallet */}
      <NigerianWallet 
        balance={walletBalance} 
        onBalanceChange={setWalletBalance}
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search for Nigerian restaurants or dishes..." 
          className="pl-10 bg-background/50 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Promotional Banner */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Welcome to Nigerian Food Delivery! 🇳🇬</h2>
        <p className="text-white/90 text-sm">Authentic Nigerian cuisine delivered to your doorstep</p>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Browse Nigerian Food Categories</h3>
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
          {nigerianFoodCategories.map((category) => (
            <div 
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`cursor-pointer transition-all ${
                selectedCategory === category.name ? 'ring-2 ring-primary' : ''
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
              className="text-primary hover:underline ml-1"
            >
              Clear filter
            </button>
          </p>
        )}
      </div>

      {/* Nigerian Restaurants */}
      <div>
        <h3 className="font-semibold mb-3">
          {selectedCategory ? `${selectedCategory} Restaurants` : 'Nigerian Restaurants Near You'}
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
                  className="text-primary hover:underline mt-2"
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

export default Home;
