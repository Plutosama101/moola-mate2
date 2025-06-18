
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Filter } from 'lucide-react';
import RestaurantCard from '@/components/RestaurantCard';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const restaurants = [
    {
      name: "Tony's Pizza Palace",
      cuisine: 'Italian • Pizza',
      rating: 4.8,
      deliveryTime: '25-35 min',
      image: '/placeholder.svg',
    },
    {
      name: 'Burger Junction',
      cuisine: 'American • Burgers',
      rating: 4.6,
      deliveryTime: '30-40 min',
      image: '/placeholder.svg',
    },
    {
      name: 'Sakura Sushi',
      cuisine: 'Japanese • Sushi',
      rating: 4.9,
      deliveryTime: '20-30 min',
      image: '/placeholder.svg',
    },
  ];

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
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.name}
              {...restaurant}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
