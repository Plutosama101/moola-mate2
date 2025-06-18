
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';

interface OrderCardProps {
  restaurantName: string;
  items: string[];
  status: 'preparing' | 'on-the-way' | 'delivered';
  estimatedTime?: string;
  total: number;
}

const OrderCard = ({ restaurantName, items, status, estimatedTime, total }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-the-way':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'on-the-way':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="shadow-soft">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-sm">{restaurantName}</h3>
            <p className="text-xs text-muted-foreground">{items.join(', ')}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
        </div>
        
        {estimatedTime && status !== 'delivered' && (
          <div className="flex items-center space-x-1 mb-3">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{estimatedTime}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="font-semibold">${total.toFixed(2)}</span>
          {status !== 'delivered' && (
            <Button size="sm" variant="outline" className="h-8">
              <MapPin className="w-3 h-3 mr-1" />
              Track
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
