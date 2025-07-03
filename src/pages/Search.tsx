
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '@/components/RestaurantCard';
import CategoryCard from '@/components/CategoryCard';
import { nigerianRestaurants, nigerianFoodCategories } from '@/data/nigerianFood';
import { storage } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load favorites and cart from storage
    const savedFavorites = storage.getItem('favoriteRestaurants');
    if (savedFavorites) {
      try {
        setFavoriteIds(JSON.parse(savedFavorites));
      } catch {
        setFavoriteIds([]);
      }
    }

    const savedCart = storage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  const handleAddToCart = (restaurantId: string, foodId: string, name: string, price: number) => {
    const restaurant = nigerianRestaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;

    const existingItem = cartItems.find(item => item.id === foodId);
    let updatedItems;
    
    if (existingItem) {
      updatedItems = cartItems.map(item =>
        item.id === foodId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      const newItem = {
        id: foodId,
        name,
        price,
        quantity: 1,
        restaurant: restaurant.name
      };
      updatedItems = [...cartItems, newItem];
    }
    
    setCartItems(updatedItems);
    storage.setItem('cartItems', JSON.stringify(updatedItems));
    
    toast({
      title: "Added to Cart",
      description: `${name} added to your cart`,
    });
  };

  const handleToggleFavorite = (restaurantId: string) => {
    const isFavorite = favoriteIds.includes(restaurantId);
    const updatedFavorites = isFavorite
      ? favoriteIds.filter(id => id !== restaurantId)
      : [...favoriteIds, restaurantId];
    
    setFavoriteIds(updatedFavorites);
    storage.setItem('favoriteRestaurants', JSON.stringify(updatedFavorites));
    
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `Restaurant ${isFavorite ? 'removed from' : 'added to'} your favorites`,
    });
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? '' : categoryName);
  };

  const filteredRestaurants = nigerianRestaurants.filter(restaurant => {
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.foods.some(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === '' ||
      restaurant.foods.some(food => food.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

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
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search restaurants, dishes..." 
              className="pl-10 pr-4 border-gray-200 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="p-2 rounded-xl">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
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

        {/* Results */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Restaurants'}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredRestaurants.length} found)
            </span>
          </h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  {...restaurant}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={() => handleToggleFavorite(restaurant.id)}
                  isFavorite={favoriteIds.includes(restaurant.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? `No restaurants found for "${searchQuery}"` : 'No restaurants match your filters'}
              </p>
              {(searchQuery || selectedCategory) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
