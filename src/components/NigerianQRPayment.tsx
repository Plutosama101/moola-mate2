import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NigerianFood } from '@/data/nigerianFood';
import { storage } from '@/utils/storage';

interface NigerianQRPaymentProps {
  food: NigerianFood;
  walletBalance: number;
  onBalanceChange: (newBalance: number) => void;
}

const NigerianQRPayment = ({ food, walletBalance, onBalanceChange }: NigerianQRPaymentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrData, setQRData] = useState('');
  const { toast } = useToast();

  const generateQRCode = () => {
    const paymentData = {
      type: 'nigerian_food_payment',
      foodId: food.id,
      foodName: food.name,
      amount: food.price,
      currency: 'NGN',
      restaurant: food.restaurant,
      timestamp: Date.now(),
      paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    };
    
    const qrString = JSON.stringify(paymentData);
    setQRData(qrString);
    setIsOpen(true);
    
    toast({
      title: 'QR Code Generated',
      description: `Payment link created for ${food.name}`,
    });
  };

  const handleWalletPayment = () => {
    if (walletBalance >= food.price) {
      const newBalance = walletBalance - food.price;
      onBalanceChange(newBalance);
      storage.setItem('nigerianWallet', newBalance.toString());
      
      toast({
        title: 'Payment Successful!',
        description: `₦${food.price.toLocaleString()} paid for ${food.name}`,
      });
      setIsOpen(false);
    } else {
      toast({
        title: 'Insufficient Balance',
        description: `You need ₦${(food.price - walletBalance).toLocaleString()} more to complete this purchase`,
        variant: 'destructive',
      });
    }
  };

  const qrCodeUrl = qrData ? 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}` : 
    '';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={generateQRCode}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <QrCode className="h-4 w-4 mr-1" />
          Pay ₦{food.price.toLocaleString()}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Pay for {food.name}</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">{food.name}</h3>
            <p className="text-sm text-gray-600">{food.restaurant}</p>
            <p className="text-xl font-bold text-green-600">₦{food.price.toLocaleString()}</p>
          </div>
          
          {qrData && (
            <div className="space-y-2">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="mx-auto border rounded"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/200x200/10B981/ffffff?text=QR+Code`;
                }}
              />
              <p className="text-sm text-gray-600">
                Scan this QR code with your payment app
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              onClick={handleWalletPayment}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={walletBalance < food.price}
            >
              Pay from Wallet (₦{walletBalance.toLocaleString()})
            </Button>
            
            {walletBalance < food.price && (
              <p className="text-sm text-red-600">
                Insufficient balance. Need ₦{(food.price - walletBalance).toLocaleString()} more.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NigerianQRPayment;
