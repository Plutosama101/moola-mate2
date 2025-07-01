
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Heart, Plus, MapPin, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface Food {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  foods: Food[];
  onAddToCart?: (restaurantId: string, foodId: string, name: string, price: number) => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

const RestaurantCard = ({ 
  id, 
  name, 
  image, 
  rating, 
  deliveryTime, 
  cuisine, 
  foods,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false
}: RestaurantCardProps) => {
  const navigate = useNavigate();

  const handleAddToCart = (food: Food) => {
    if (onAddToCart) {
      onAddToCart(id, food.id, food.name, food.price);
    }
  };

  const handleCardClick = () => {
    navigate(`/restaurant/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white border border-gray-100 cursor-pointer">
      <CardContent className="p-0" onClick={handleCardClick}>
        <div className="relative">
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/400x200/f97316/ffffff?text=${encodeURIComponent(name)}`;
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            <Badge className="bg-green-500 text-white border-0 shadow-sm">
              <Truck className="w-3 h-3 mr-1" />
              Free Delivery
            </Badge>
          </div>
          
          {/* Favorite button */}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm"
              onClick={handleFavoriteClick}
            >
              <Heart 
                className={`w-4 h-4 ${
                  isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'
                }`} 
              />
            </Button>
          </div>
          
          {/* Rating badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-white/95 text-gray-800 border-0 shadow-sm">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {rating}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{name}</h3>
              <div className="flex items-center space-x-1 mb-2">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-600">{cuisine}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{deliveryTime}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                ₦{Math.min(...foods.map(f => f.price)).toLocaleString()}+
              </span>
              <Dialog>
                <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="sm" 
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 shadow-sm"
                  >
                    View Menu
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-gray-900">
                      {name} Menu
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    {foods.map((food) => (
                      <Card key={food.id} className="border border-gray-100 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex space-x-3">
                            <img 
                              src={food.image} 
                              alt={food.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/100x100/f97316/ffffff?text=${encodeURIComponent(food.name.charAt(0))}`;
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{food.name}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {food.description}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-orange-600 text-lg">
                                  ₦{food.price.toLocaleString()}
                                </span>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddToCart(food)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Popular items preview */}
          <div className="flex flex-wrap gap-1 mt-3">
            {foods.slice(0, 2).map((food) => (
              <Badge key={food.id} variant="secondary" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                {food.name}
              </Badge>
            ))}
            {foods.length > 2 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{foods.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
