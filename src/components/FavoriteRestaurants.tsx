
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
}

interface FavoriteRestaurantsProps {
  restaurants: Restaurant[];
  onToggleFavorite: (restaurantId: string) => void;
  favoriteIds: string[];
}

const FavoriteRestaurants = ({ restaurants, onToggleFavorite, favoriteIds }: FavoriteRestaurantsProps) => {
  const { toast } = useToast();

  const handleToggleFavorite = (restaurantId: string, restaurantName: string) => {
    onToggleFavorite(restaurantId);
    const isFavorite = favoriteIds.includes(restaurantId);
    
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `${restaurantName} ${isFavorite ? 'removed from' : 'added to'} your favorites`,
    });
  };

  const favoriteRestaurants = restaurants.filter(restaurant => 
    favoriteIds.includes(restaurant.id)
  );

  if (favoriteRestaurants.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No favorite restaurants yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tap the heart icon on any restaurant to add it to your favorites
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Your Favorite Restaurants</h3>
      <div className="grid grid-cols-1 gap-4">
        {favoriteRestaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-32 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => handleToggleFavorite(restaurant.id, restaurant.name)}
                >
                  <Heart 
                    className="w-4 h-4 text-red-500 fill-red-500" 
                  />
                </Button>
              </div>
              <div className="p-4">
                <h4 className="font-semibold">{restaurant.name}</h4>
                <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">⭐ {restaurant.rating}</span>
                  <span className="text-sm text-muted-foreground">{restaurant.deliveryTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoriteRestaurants;
