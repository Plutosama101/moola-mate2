
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

interface QRPaymentProps {
  amount: number;
  orderId: string;
}

const QRPayment = ({ amount, orderId }: QRPaymentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate QR code data (in a real app, this would come from your payment provider)
  const qrData = `payment://order=${orderId}&amount=${amount}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8">
          <QrCode className="w-3 h-3 mr-1" />
          Pay
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>QR Code Payment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-48 h-48 bg-white border rounded-lg flex items-center justify-center">
            <div className="w-44 h-44 bg-black text-white flex items-center justify-center text-xs font-mono break-all p-2">
              QR Code for ${amount.toFixed(2)}
              <br />
              Order: {orderId}
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Scan this QR code with your payment app to complete the transaction
          </p>
          <p className="text-lg font-semibold">${amount.toFixed(2)}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRPayment;
