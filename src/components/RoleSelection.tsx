
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Store } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const RoleSelection = () => {
  const { setRole, setUser } = useUser();

  const handleRoleSelect = (selectedRole: 'student' | 'vendor') => {
    // Create a mock user for demo purposes
    const mockUser = {
      id: Date.now().toString(),
      email: `${selectedRole}@example.com`,
      role: selectedRole,
      name: selectedRole === 'student' ? 'Student User' : 'Vendor User'
    };
    
    setUser(mockUser);
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">Welcome to FoodieQR 🇳🇬</h1>
          <p className="text-xl text-gray-600">Choose your role to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => handleRoleSelect('student')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-600">I'm a Student</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Browse Nigerian restaurants, scan QR codes to pay, manage your wallet, and track your orders.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• Scan QR codes to pay vendors</li>
                <li>• Manage your wallet balance</li>
                <li>• Track order history</li>
                <li>• Browse authentic Nigerian food</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Continue as Student
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => handleRoleSelect('vendor')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">I'm a Vendor</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Manage your Nigerian restaurant, create QR payment codes, track sales, and receive payments.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• Add and manage food items</li>
                <li>• Generate payment QR codes</li>
                <li>• Track sales and revenue</li>
                <li>• Manage incoming orders</li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Continue as Vendor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
