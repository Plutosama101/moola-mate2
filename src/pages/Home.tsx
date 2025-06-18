
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import RestaurantCard from '@/components/RestaurantCard';

const Home = () => {
  const categories = [
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Burger', emoji: '🍔' },
    { name: 'Sushi', emoji: '🍣' },
    { name: 'Dessert', emoji: '🍰' },
    { name: 'Coffee', emoji: '☕' },
    { name: 'Salad', emoji: '🥗' },
  ];

  const restaurants = [
    {
      name: "Tony's Pizza Palace",
      cuisine: 'Italian • Pizza',
      rating: 4.5,
      deliveryTime: '20-30 min',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
    },
    {
      name: 'Burger Junction',
      cuisine: 'American • Burgers',
      rating: 4.3,
      deliveryTime: '15-25 min',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
    },
    {
      name: 'Sakura Sushi',
      cuisine: 'Japanese • Sushi',
      rating: 4.7,
      deliveryTime: '25-35 min',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop'
    },
    {
      name: 'Sweet Dreams Bakery',
      cuisine: 'Bakery • Desserts',
      rating: 4.6,
      deliveryTime: '10-20 min',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
    },
  ];

  return (
    <div className="px-4 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search for restaurants or dishes..." 
          className="pl-10 bg-background/50 backdrop-blur-sm"
        />
      </div>

      {/* Promotional Banner */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Free Delivery on First Order! 🎉</h2>
        <p className="text-white/90 text-sm">Use code WELCOME to get free delivery on orders over $15</p>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Browse by Category</h3>
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>

      {/* Popular Restaurants */}
      <div>
        <h3 className="font-semibold mb-3">Popular Near You</h3>
        <div className="grid grid-cols-1 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.name} {...restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
