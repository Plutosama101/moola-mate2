
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MapPin, CreditCard, Bell, HelpCircle, LogOut } from 'lucide-react';

const Profile = () => {
  const menuItems = [
    { icon: User, label: 'Edit Profile', description: 'Update your personal information' },
    { icon: MapPin, label: 'Addresses', description: 'Manage delivery addresses' },
    { icon: CreditCard, label: 'Payment Methods', description: 'Add or remove payment options' },
    { icon: Bell, label: 'Notifications', description: 'Customize your notifications' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get help or contact us' },
  ];

  return (
    <div className="px-4 space-y-6">
      {/* Profile Header */}
      <Card className="gradient-primary text-white">
        <CardContent className="p-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold mb-1">John Doe</h2>
          <p className="text-white/90 text-sm">john.doe@email.com</p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">47</div>
            <div className="text-xs text-muted-foreground">Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">$284</div>
            <div className="text-xs text-muted-foreground">Saved</div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Card key={item.label} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Logout */}
      <Button variant="outline" className="w-full" size="lg">
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default Profile;
