
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
  timestamp: number;
  read: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const NotificationSystem = ({ notifications, onMarkAsRead, onDismiss }: NotificationSystemProps) => {
  const { toast } = useToast();

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead(id);
    toast({
      title: "Notification marked as read",
      duration: 1000,
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '🍽️';
      case 'promotion':
        return '🎉';
      case 'system':
        return '⚙️';
      default:
        return '📱';
    }
  };

  const recentNotifications = notifications
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <Card className="w-80 shadow-lg border-0 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Notifications</span>
          <Badge variant="secondary" className="text-xs">
            {notifications.filter(n => !n.read).length} new
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-80 overflow-y-auto space-y-3">
          {recentNotifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-1 h-6 w-6"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss(notification.id)}
                      className="p-1 h-6 w-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {recentNotifications.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => notifications.forEach(n => !n.read && onMarkAsRead(n.id))}
            >
              Mark all as read
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
