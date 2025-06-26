
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Filter } from 'lucide-react';
import RestaurantCard from '@/components/RestaurantCard';
import { nigerianRestaurants } from '@/data/nigerianFood';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const handleAddToCart = (restaurantId: string, foodId: string, name: string, price: number) => {
    console.log('Adding to cart:', { restaurantId, foodId, name, price });
    // This would integrate with the cart system
  };

  const handleToggleFavorite = (restaurantId: string) => {
    setFavoriteIds(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const filteredRestaurants = nigerianRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.foods.some(food => 
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="px-4 space-y-4">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search restaurants, dishes..." 
            className="pl-10 h-12 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {searchQuery ? `Results for "${searchQuery}"` : 'Popular restaurants'}
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              image={restaurant.image}
              rating={restaurant.rating}
              deliveryTime={restaurant.deliveryTime}
              cuisine={restaurant.cuisine}
              foods={restaurant.foods}
              onAddToCart={handleAddToCart}
              onToggleFavorite={() => handleToggleFavorite(restaurant.id)}
              isFavorite={favoriteIds.includes(restaurant.id)}
            />
          ))}
        </div>
        
        {filteredRestaurants.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No restaurants found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
