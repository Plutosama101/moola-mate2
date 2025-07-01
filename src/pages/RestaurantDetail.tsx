import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Clock, MapPin } from 'lucide-react';
import { nigerianRestaurants, NigerianRestaurant, NigerianFood } from '@/data/nigerianFood';
import NigerianQRPayment from '@/components/NigerianQRPayment';
import { storage } from '@/utils/storage';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<NigerianRestaurant | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (id) {
      const foundRestaurant = nigerianRestaurants.find(r => r.id === id);
      setRestaurant(foundRestaurant || null);
    }

    // Load wallet balance
    const savedBalance = storage.getItem('nigerianWallet');
    if (savedBalance) {
      try {
        setWalletBalance(parseInt(savedBalance));
      } catch {
        setWalletBalance(5000);
      }
    } else {
      setWalletBalance(5000);
    }
  }, [id]);

  if (!restaurant) {
    return (
      <div className="px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Restaurant not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const categories = [...new Set(restaurant.foods.map(food => food.category))];
  const filteredFoods = selectedCategory 
    ? restaurant.foods.filter(food => food.category === selectedCategory)
    : restaurant.foods;

  return (
    <div className="px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Restaurant Menu</h1>
      </div>

      {/* Restaurant Info */}
      <Card className="overflow-hidden">
        <div className="aspect-video relative">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/400x200/10B981/ffffff?text=${encodeURIComponent(restaurant.name)}`;
            }}
          />
        </div>
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
          <p className="text-muted-foreground mb-3">{restaurant.specialty}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.cuisine}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div>
          <h3 className="font-semibold mb-3">Food Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              All Items
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Food Menu */}
      <div>
        <h3 className="font-semibold mb-3">
          {selectedCategory ? `${selectedCategory} Menu` : 'Full Menu'}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {filteredFoods.map(food => (
            <Card key={food.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="aspect-video md:aspect-square relative">
                    <img 
                      src={food.image} 
                      alt={food.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/300x200/10B981/ffffff?text=${encodeURIComponent(food.name)}`;
                      }}
                    />
                  </div>
                </div>
                <CardContent className="md:w-2/3 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{food.name}</h4>
                    <span className="text-lg font-bold text-green-600">₦{food.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{food.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{food.category}</span>
                    <NigerianQRPayment 
                      food={food}
                      walletBalance={walletBalance}
                      onBalanceChange={setWalletBalance}
                    />
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
