
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Storage utility that works in both environments
const storage = {
  getItem: (key: string) => {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch {
      // Fail silently in environments without localStorage
    }
  }
};

interface NigerianWalletProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const NigerianWallet = ({ balance, onBalanceChange }: NigerianWalletProps) => {
  const { toast } = useToast();

  const handleTopUp = (amount: number) => {
    const newBalance = balance + amount;
    onBalanceChange(newBalance);
    storage.setItem('nigerianWallet', newBalance.toString());
    toast({
      title: 'Wallet Topped Up',
      description: `₦${amount.toLocaleString()} added to your wallet`,
    });
  };

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-green-600" />
          <span className="font-bold text-lg">Wallet Balance: {formatNaira(balance)}</span>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => handleTopUp(500)} 
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            +₦500
          </Button>
          <Button 
            onClick={() => handleTopUp(1000)} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            +₦1,000
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NigerianWallet;
export { storage };
