
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

const BottomNavigation = () => {
  const { role } = useUser();

  const studentNavItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/?tab=wallet', icon: Wallet, label: 'Wallet' },
  ];

  // Don't show bottom navigation for vendors since they have their own dashboard
  if (role === 'vendor') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {studentNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                isActive || (to.includes('tab=wallet') && window.location.search.includes('tab=wallet'))
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
