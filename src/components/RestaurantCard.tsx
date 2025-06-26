
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Heart, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const handleAddToCart = (food: Food) => {
    if (onAddToCart) {
      onAddToCart(id, food.id, food.name, food.price);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={image} 
              alt={name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/80 hover:bg-white"
                  onClick={onToggleFavorite}
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'
                    }`} 
                  />
                </Button>
              )}
            </div>
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-white/90 text-gray-800">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {rating}
              </Badge>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-sm text-muted-foreground">{cuisine}</p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {deliveryTime}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1">
                {foods.slice(0, 3).map((food) => (
                  <Badge key={food.id} variant="secondary" className="text-xs">
                    {food.name}
                  </Badge>
                ))}
                {foods.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{foods.length - 3} more
                  </Badge>
                )}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    View Menu
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{name} Menu</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    {foods.map((food) => (
                      <Card key={food.id}>
                        <CardContent className="p-4">
                          <div className="flex space-x-3">
                            <img 
                              src={food.image} 
                              alt={food.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{food.name}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {food.description}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="font-semibold text-orange-600">
                                  ₦{food.price.toLocaleString()}
                                </span>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddToCart(food)}
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
        </CardContent>
      </Card>
    </>
  );
};

export default RestaurantCard;
