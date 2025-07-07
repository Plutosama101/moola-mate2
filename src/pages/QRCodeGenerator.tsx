
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VendorInfo {
  name: string;
  id: string;
  address: string;
}

interface QRCodeGeneratorProps {
  vendorInfo?: VendorInfo;
}

const QRCodeGenerator = ({ vendorInfo }: QRCodeGeneratorProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [itemName, setItemName] = useState<string>('');
  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const { toast } = useToast();

  const defaultVendorInfo: VendorInfo = {
    name: vendorInfo?.name || 'Campus Vendor',
    id: vendorInfo?.id || 'vendor_001',
    address: vendorInfo?.address || 'University Campus'
  };

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  };

  const generateQRCodeData = () => {
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    
    return JSON.stringify({
      type: 'vendor_payment',
      orderId: newOrderId,
      amount: amount,
      currency: 'NGN',
      itemName: itemName || 'Food Item',
      vendor: defaultVendorInfo.name,
      vendorId: defaultVendorInfo.id,
      vendorAddress: defaultVendorInfo.address,
      timestamp: Date.now()
    });
  };

  const generateSimpleQR = (text: string) => {
    const size = 200;
    const modules = 21;
    const moduleSize = size / modules;
    
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${size}" height="${size}" fill="white"/>`;
    
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        const shouldFill = ((hash + i * j) % 3) === 0;
        if (shouldFill) {
          svg += `<rect x="${i * moduleSize}" y="${j * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
        }
      }
    }
    
    const cornerSize = moduleSize * 7;
    const positions = [[0, 0], [size - cornerSize, 0], [0, size - cornerSize]];
    
    positions.forEach(([x, y]) => {
      svg += `<rect x="${x}" y="${y}" width="${cornerSize}" height="${cornerSize}" fill="black"/>`;
      svg += `<rect x="${x + moduleSize}" y="${y + moduleSize}" width="${cornerSize - 2 * moduleSize}" height="${cornerSize - 2 * moduleSize}" fill="white"/>`;
      svg += `<rect x="${x + 2 * moduleSize}" y="${y + 2 * moduleSize}" width="${cornerSize - 4 * moduleSize}" height="${cornerSize - 4 * moduleSize}" fill="black"/>`;
    });
    
    svg += '</svg>';
    return svg;
  };

  const generateQRCode = () => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    const qrData = generateQRCodeData();
    const svgData = generateSimpleQR(qrData);
    setQrCodeSvg(svgData);
    
    toast({
      title: "QR Code Generated",
      description: `Payment QR code created for ₦${amount.toLocaleString()}`,
    });
  };

  const downloadQRCode = () => {
    if (!qrCodeSvg) return;
    
    const blob = new Blob([qrCodeSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-qr-${orderId}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (amount > 0) {
      generateQRCode();
    }
  }, [amount, itemName]);

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Vendor QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              type="text"
              placeholder="e.g., Jollof Rice"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            {qrCodeSvg && amount > 0 ? (
              <div className="flex flex-col items-center space-y-4">
                <div 
                  className="w-48 h-48 border rounded"
                  dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                />
                <div className="text-center space-y-1">
                  <p className="font-semibold text-lg">₦{amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{itemName || 'Food Item'}</p>
                  <p className="text-xs text-muted-foreground">{orderId}</p>
                  <p className="text-xs text-muted-foreground">{defaultVendorInfo.name}</p>
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-white rounded mx-auto">
                <span className="text-sm text-gray-500 text-center">
                  {amount <= 0 ? 'Enter amount and item name to generate QR code' : 'Generating QR code...'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={generateQRCode} 
              disabled={amount <= 0}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button 
              onClick={downloadQRCode} 
              disabled={!qrCodeSvg || amount <= 0}
              size="sm"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
