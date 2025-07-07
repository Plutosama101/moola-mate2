
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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const { toast } = useToast();

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      // Stop the stream immediately, we just needed to request permission
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      setHasPermission(false);
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access to scan QR codes for payments.",
        variant: "destructive",
      });
      return false;
    }
  };

  const startScanning = async () => {
    if (!videoRef.current) return;

    const hasCamera = await requestCameraPermission();
    if (!hasCamera) return;

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
          preferredCamera: 'environment',
        }
      );
      
      await qrScannerRef.current.start();
    } catch (error) {
      console.error('Error starting QR scanner:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions and try again.",
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
      
      if (paymentData.type === 'vendor_payment' && paymentData.amount) {
        const amount = paymentData.amount;
        
        if (walletBalance >= amount) {
          onPaymentComplete(amount);
          toast({
            title: "Payment Successful!",
            description: `₦${amount.toLocaleString()} paid for ${paymentData.itemName || 'food item'}`,
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
          description: "This QR code is not a valid payment code from a vendor.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "Unable to process this QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = async () => {
    if (hasPermission === null) {
      const granted = await requestCameraPermission();
      if (granted) {
        setIsOpen(true);
      }
    } else if (hasPermission) {
      setIsOpen(true);
    } else {
      await requestCameraPermission();
    }
  };

  useEffect(() => {
    if (isOpen && hasPermission && !isScanning) {
      startScanning();
    } else if (!isOpen && isScanning) {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen, hasPermission]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleOpenDialog}
        >
          <Camera className="w-4 h-4 mr-2" />
          Scan Vendor QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Scan Vendor Payment QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-64 h-64 bg-black border rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {!isScanning && hasPermission && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                <span className="text-sm text-white">Starting camera...</span>
              </div>
            )}
            {hasPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 text-white text-center p-4">
                <Camera className="w-8 h-8 mb-2" />
                <span className="text-sm">Camera access required</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-black"
                  onClick={requestCameraPermission}
                >
                  Grant Access
                </Button>
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
