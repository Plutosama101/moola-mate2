
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, CreditCard, Bell, HelpCircle, LogOut, ArrowLeft, Edit2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { 
      icon: Edit2, 
      label: 'Edit Profile', 
      description: 'Update your personal information',
      onClick: () => toast({ title: "Coming Soon", description: "Profile editing will be available soon" })
    },
    { 
      icon: MapPin, 
      label: 'Addresses', 
      description: 'Manage delivery addresses',
      onClick: () => toast({ title: "Coming Soon", description: "Address management will be available soon" })
    },
    { 
      icon: CreditCard, 
      label: 'Payment Methods', 
      description: 'Add or remove payment options',
      onClick: () => navigate('/?tab=wallet')
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      description: 'Customize your notifications',
      onClick: () => toast({ title: "Coming Soon", description: "Notification settings will be available soon" })
    },
    { 
      icon: Settings, 
      label: 'App Settings', 
      description: 'Configure app preferences',
      onClick: () => toast({ title: "Coming Soon", description: "App settings will be available soon" })
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      description: 'Get help or contact us',
      onClick: () => toast({ title: "Coming Soon", description: "Help & support will be available soon" })
    },
  ];

  // Get user name from metadata or fall back to email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'user@example.com';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-semibold mb-1">{userName}</h2>
            <p className="text-white/90 text-sm mb-3">{userEmail}</p>
            <Badge className="bg-white/20 text-white border-white/30">
              Student Account
            </Badge>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">0</div>
              <div className="text-xs text-gray-500">Total Orders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">₦0</div>
              <div className="text-xs text-gray-500">Money Saved</div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Card 
              key={item.label} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={item.onClick}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.label}</h3>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full border-red-200 text-red-600 hover:bg-red-50" 
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
