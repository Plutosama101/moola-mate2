
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User, Phone } from 'lucide-react';

interface DeliveryInfo {
  orderId: string;
  status: 'assigned' | 'picked_up' | 'on_the_way' | 'delivered';
  driverName: string;
  driverPhone: string;
  estimatedArrival: string;
  currentLocation: string;
}

interface DeliveryTrackingProps {
  delivery: DeliveryInfo | null;
}

const DeliveryTracking = ({ delivery }: DeliveryTrackingProps) => {
  if (!delivery) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-orange-100 text-orange-800';
      case 'on_the_way':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'Driver Assigned';
      case 'picked_up':
        return 'Order Picked Up';
      case 'on_the_way':
        return 'On The Way';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Delivery Tracking</CardTitle>
          <Badge className={getStatusColor(delivery.status)}>
            {getStatusText(delivery.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{delivery.driverName}</p>
            <p className="text-sm text-muted-foreground">Your delivery driver</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm">{delivery.driverPhone}</p>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Estimated arrival</p>
            <p className="text-sm text-muted-foreground">{delivery.estimatedArrival}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Current location</p>
            <p className="text-sm text-muted-foreground">{delivery.currentLocation}</p>
          </div>
        </div>

        {/* Simple progress indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Restaurant</span>
            <span>On the way</span>
            <span>Your location</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: delivery.status === 'assigned' ? '25%' : 
                       delivery.status === 'picked_up' ? '50%' : 
                       delivery.status === 'on_the_way' ? '75%' : '100%'
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTracking;
