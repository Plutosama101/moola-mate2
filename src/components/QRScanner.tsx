
import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  walletBalance: number;
  onPaymentComplete: (amount: number) => void;
}

const QRScanner = ({ walletBalance, onPaymentComplete }: QRScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const { toast } = useToast();

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code scanned:', result.data);
          handlePaymentResult(result.data);
        },
        {
          onDecodeError: (error) => {
            console.log('QR decode error:', error);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      
      await qrScannerRef.current.start();
    } catch (error) {
      console.error('Error starting QR scanner:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handlePaymentResult = (qrData: string) => {
    try {
      const paymentData = JSON.parse(qrData);
      
      if (paymentData.type === 'nigerian_food_payment' && paymentData.amount) {
        const amount = paymentData.amount;
        
        if (walletBalance >= amount) {
          onPaymentComplete(amount);
          toast({
            title: "Payment Successful!",
            description: `₦${amount.toLocaleString()} paid for ${paymentData.foodName || 'food item'}`,
          });
          stopScanning();
          setIsOpen(false);
        } else {
          toast({
            title: "Insufficient Balance",
            description: `You need ₦${(amount - walletBalance).toLocaleString()} more to complete this purchase`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid QR Code",
          description: "This QR code is not a valid payment code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "Unable to process this QR code.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanning();
    } else if (!isOpen && isScanning) {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <Camera className="w-4 h-4 mr-2" />
          Scan QR to Pay
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Scan Payment QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-64 h-64 bg-black border rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-500">Starting camera...</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Point your camera at a vendor's payment QR code
          </p>
          <p className="text-lg font-semibold">Wallet Balance: ₦{walletBalance.toLocaleString()}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="mt-4"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
