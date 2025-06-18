
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface QRCodeGeneratorProps {
  amount: number;
  vendorInfo: {
    name: string;
    id: string;
    address: string;
  };
  customOrderId?: string;
}

const QRCodeGenerator = ({ amount, vendorInfo, customOrderId }: QRCodeGeneratorProps) => {
  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  const generateOrderId = () => {
    return customOrderId || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  };

  const generateQRCodeData = () => {
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    
    return JSON.stringify({
      type: 'payment',
      orderId: newOrderId,
      amount: amount,
      currency: 'USD',
      merchant: vendorInfo.name,
      vendorId: vendorInfo.id,
      vendorAddress: vendorInfo.address,
      timestamp: Date.now()
    });
  };

  const generateSimpleQR = (text: string) => {
    // Simple SVG QR code placeholder - in a real app, you'd use a proper QR library
    const size = 200;
    const modules = 21; // Standard QR code size
    const moduleSize = size / modules;
    
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${size}" height="${size}" fill="white"/>`;
    
    // Generate a simple pattern based on the text hash
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
    
    // Add corner squares (finder patterns)
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
    const qrData = generateQRCodeData();
    const svgData = generateSimpleQR(qrData);
    setQrCodeSvg(svgData);
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
  }, [amount, vendorInfo, customOrderId]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-white">
        {qrCodeSvg && amount > 0 ? (
          <div className="flex flex-col items-center space-y-4">
            <div 
              className="w-48 h-48"
              dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
            />
            <div className="text-center space-y-1">
              <p className="font-semibold text-lg">${amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{orderId}</p>
              <p className="text-xs text-muted-foreground">{vendorInfo.name}</p>
            </div>
          </div>
        ) : (
          <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded">
            <span className="text-sm text-gray-500">
              {amount <= 0 ? 'Enter amount to generate QR code' : 'Generating QR code...'}
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
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
        <Button 
          onClick={downloadQRCode} 
          disabled={!qrCodeSvg || amount <= 0}
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
