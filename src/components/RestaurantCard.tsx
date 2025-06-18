
import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  onClick?: () => void;
}

const RestaurantCard = ({ name, cuisine, rating, deliveryTime, image, onClick }: RestaurantCardProps) => {
  return (
    <Card 
      className="overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative h-32 bg-gradient-to-br from-orange-100 to-red-100">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          🍕
        </div>
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating}</span>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm mb-1">{name}</h3>
        <p className="text-xs text-muted-foreground mb-2">{cuisine}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{deliveryTime}</span>
          </div>
          <span className="text-xs text-primary font-medium">Free delivery</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
