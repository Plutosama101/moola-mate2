
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import QRCodeGenerator from 'qrcode';

interface QRPaymentProps {
  amount: number;
  orderId: string;
}

const QRPayment = ({ amount, orderId }: QRPaymentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate QR code data (in a real app, this would come from your payment provider)
  const qrData = JSON.stringify({
    type: 'payment',
    orderId,
    amount,
    currency: 'USD',
    merchant: 'Campus Eats',
    timestamp: Date.now()
  });

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const dataUrl = await QRCodeGenerator.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, qrData]);

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
          <div className="w-48 h-48 bg-white border rounded-lg flex items-center justify-center p-4">
            {qrCodeDataUrl ? (
              <img 
                src={qrCodeDataUrl} 
                alt="Payment QR Code" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm text-gray-500">Generating QR code...</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Scan this QR code with your payment app to complete the transaction
          </p>
          <p className="text-lg font-semibold">${amount.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Order ID: {orderId}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRPayment;
