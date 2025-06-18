
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import RestaurantCard from '@/components/RestaurantCard';
import CategoryCard from '@/components/CategoryCard';

const Home = () => {
  const categories = [
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Sushi', emoji: '🍣' },
    { name: 'Dessert', emoji: '🍰' },
    { name: 'Coffee', emoji: '☕' },
  ];

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
    {
      name: 'Sweet Dreams Bakery',
      cuisine: 'Bakery • Desserts',
      rating: 4.7,
      deliveryTime: '15-25 min',
      image: '/placeholder.svg',
    },
  ];

  return (
    <div className="px-4 space-y-6">
      {/* Hero Section */}
      <div className="gradient-primary rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Delicious food,<br />delivered fast
        </h1>
        <p className="text-white/90 text-sm">
          Order from your favorite restaurants
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search for restaurants or dishes" 
          className="pl-10 h-12 rounded-xl"
        />
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              emoji={category.emoji}
            />
          ))}
        </div>
      </div>

      {/* Featured Restaurants */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Near you</h2>
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

export default Home;
