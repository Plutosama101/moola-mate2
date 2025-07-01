
import React from 'react';
import { MapPin, Bell, LogOut, User, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const Header = () => {
  const { user, role, logout } = useUser();

  // Get user name from metadata or fall back to email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            role === 'vendor' ? 'bg-green-600' : 'bg-orange-600'
          }`}>
            {role === 'vendor' ? (
              <Store className="w-4 h-4 text-white" />
            ) : (
              <span className="text-white font-bold text-sm">S</span>
            )}
          </div>
          <div>
            <p className={`text-sm font-medium ${
              role === 'vendor' ? 'text-green-600' : 'text-orange-600'
            }`}>
              SnappyEats {role === 'vendor' ? 'Vendor' : ''}
            </p>
            <p className="text-xs text-muted-foreground">Welcome {userName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {role === 'student' && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-600 rounded-full"></span>
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <User className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
