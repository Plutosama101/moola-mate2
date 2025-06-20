
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Store } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const RoleSelection = () => {
  const { setShowAuthDialog } = useUser();

  const handleRoleSelect = (selectedRole: 'student' | 'vendor') => {
    setShowAuthDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">Welcome to SnappyEats 🍽️</h1>
          <p className="text-gray-600">Choose your role to get started</p>
        </div>

        <div className="space-y-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-blue-200"
            onClick={() => handleRoleSelect('student')}
          >
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-blue-600">Student</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-600 text-sm mb-4">
                Order food and pay with QR codes
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Continue as Student
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-green-200"
            onClick={() => handleRoleSelect('vendor')}
          >
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Store className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-600">Vendor</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-600 text-sm mb-4">
                Manage your restaurant and receive payments
              </p>
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
