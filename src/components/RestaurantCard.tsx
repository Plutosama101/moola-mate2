
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  id?: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  specialty?: string;
}

const RestaurantCard = ({ id, name, cuisine, rating, deliveryTime, image, specialty }: RestaurantCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/restaurant/${id}`);
    }
  };

  return (
    <Card 
      className={`shadow-soft overflow-hidden ${id ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={handleClick}
    >
      <div className="aspect-video relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/400x300/10B981/ffffff?text=${encodeURIComponent(name)}`;
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{cuisine}</p>
        {specialty && (
          <p className="text-xs text-green-600 mb-2">{specialty}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{deliveryTime}</span>
            </div>
          </div>
          {id && (
            <span className="text-xs text-primary font-medium">View Menu →</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
