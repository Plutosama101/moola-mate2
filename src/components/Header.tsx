
import React from 'react';
import { MapPin, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const Header = () => {
  const { user, logout } = useUser();

  return (
    <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Welcome {user?.role}</p>
            <p className="text-xs text-muted-foreground">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
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
