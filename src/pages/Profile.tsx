
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  LogOut, 
  Wallet,
  Settings,
  Bell,
  Shield,
  Save,
  X
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, logout, role } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    phone_number: user?.user_metadata?.phone_number || user?.user_metadata?.phone || '',
    department: user?.user_metadata?.department || '',
    matric_number: user?.user_metadata?.matric_number || ''
  });

  // Get wallet balance from localStorage for demo
  const walletBalance = localStorage.getItem('nigerianWallet') || '5000';

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update user metadata in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: editData.full_name,
          name: editData.full_name, // Keep both for compatibility
          phone_number: editData.phone_number,
          phone: editData.phone_number, // Keep both for compatibility
          department: editData.department,
          matric_number: editData.matric_number
        }
      });

      if (authError) {
        console.error('Auth update error:', authError);
        toast({
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Try to update profile table if it exists
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user?.id,
            email: user?.email,
            full_name: editData.full_name,
            phone_number: editData.phone_number,
            department: editData.department,
            matric_number: editData.matric_number,
            role: role === 'student' ? 'student' : 'vendor'
          }, {
            onConflict: 'user_id'
          });

        if (profileError) {
          console.log('Profile table update failed (may not exist):', profileError);
        }
      } catch (profileTableError) {
        console.log('Profile table does not exist or other error:', profileTableError);
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
      phone_number: user?.user_metadata?.phone_number || user?.user_metadata?.phone || '',
      department: user?.user_metadata?.department || '',
      matric_number: user?.user_metadata?.matric_number || ''
    });
    setIsEditing(false);
  };

  const profileStats = [
    { label: 'Total Orders', value: '12', icon: '🍽️' },
    { label: 'Favorite Restaurants', value: '5', icon: '❤️' },
    { label: 'Points Earned', value: '240', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 pt-16 pb-8">
        <div className="px-4 text-center text-white">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold mb-1">
            {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
          </h1>
          <Badge className="bg-white/20 text-white border-white/30">
            {role === 'student' ? 'Student' : 'Vendor'}
          </Badge>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Wallet Card - Only show for students */}
        {role === 'student' && (
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Wallet Balance</p>
                  <p className="text-2xl font-bold">₦{Number(walletBalance).toLocaleString()}</p>
                </div>
                <Wallet className="w-8 h-8 text-green-100" />
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-3 bg-white/20 hover:bg-white/30 text-white border-0"
              >
                Add Money
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards - Only show for students */}
        {role === 'student' && (
          <div className="grid grid-cols-3 gap-3">
            {profileStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-3 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Profile Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Profile Information</CardTitle>
            {!isEditing ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Full Name</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.full_name}
                      onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="font-medium">{user?.user_metadata?.full_name || user?.user_metadata?.name || 'Not set'}</p>
                  )}
                </div>
              </div>

              {role === 'student' && (
                <>
                  <Separator />
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <Label className="text-sm text-gray-500">Matric Number</Label>
                      {isEditing ? (
                        <Input 
                          value={editData.matric_number}
                          onChange={(e) => setEditData({...editData, matric_number: e.target.value})}
                          className="mt-1"
                          placeholder="Enter your matric number"
                        />
                      ) : (
                        <p className="font-medium">{user?.user_metadata?.matric_number || 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <Label className="text-sm text-gray-500">Department</Label>
                      {isEditing ? (
                        <Input 
                          value={editData.department}
                          onChange={(e) => setEditData({...editData, department: e.target.value})}
                          className="mt-1"
                          placeholder="Enter your department"
                        />
                      ) : (
                        <p className="font-medium">{user?.user_metadata?.department || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Phone Number</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.phone_number}
                      onChange={(e) => setEditData({...editData, phone_number: e.target.value})}
                      className="mt-1"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="font-medium">{user?.user_metadata?.phone_number || user?.user_metadata?.phone || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleSaveProfile} 
                  className="flex-1"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  className="flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="w-5 h-5 mr-3" />
              Notification Settings
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-5 h-5 mr-3" />
              App Settings
            </Button>

            <Separator />

            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
