
import React from 'react';
import { Bell, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, role, logout } = useUser();
  const navigate = useNavigate();

  // Get user name from metadata or fall back to email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  const handleProfileClick = () => {
    if (role === 'student') {
      navigate('/profile');
    }
  };

  const handleNotificationClick = () => {
    // Toggle notifications - implement notification panel
    console.log('Notifications clicked');
  };

  // Don't render header for vendors - they have their own dashboard layout
  if (role === 'vendor') {
    return null;
  }

  return (
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
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
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
  );
};

export default Header;
