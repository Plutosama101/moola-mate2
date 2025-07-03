
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

const BottomNavigation = () => {
  const { role } = useUser();

  const studentNavItems = [
    { to: '/', icon: Home, label: 'Home', exact: true },
    { to: '/search', icon: Search, label: 'Explore' },
    { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  // Don't show bottom navigation for vendors
  if (role === 'vendor') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-50 shadow-lg">
      <div className="flex items-center justify-around py-2 px-4">
        {studentNavItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-orange-500 bg-orange-50 scale-105"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
