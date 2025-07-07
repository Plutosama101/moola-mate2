
import React, { useState } from 'react';
import { Bell, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import NotificationSystem, { Notification } from '@/components/NotificationSystem';

const Header = () => {
  const { user, role } = useUser();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to SnappyEats!',
      message: 'Enjoy quick and delicious meals at your fingertips',
      type: 'system',
      timestamp: Date.now() - 3600000,
      read: false
    },
    {
      id: '2',
      title: '20% Off Today!',
      message: 'Get 20% off your first order from any restaurant',
      type: 'promotion',
      timestamp: Date.now() - 7200000,
      read: false
    }
  ]);

  // Get user name from metadata or fall back to email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  const handleProfileClick = () => {
    if (role === 'student') {
      navigate('/profile');
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Don't render header for vendors - they have their own dashboard layout
  if (role === 'vendor') {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Location & Greeting */}
          <div className="flex-1">
            <div className="flex items-center space-x-1 mb-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Campus Location</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">
              Hello, {userName} 👋
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 hover:bg-gray-100 rounded-full"
              onClick={handleNotificationClick}
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={handleProfileClick}
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Single Notification System - Positioned to float */}
      {showNotifications && (
        <div className="fixed top-20 right-4 z-50">
          <NotificationSystem
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onDismiss={handleDismissNotification}
          />
        </div>
      )}
    </>
  );
};

export default Header;
