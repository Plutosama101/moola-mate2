
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReceiptData {
  id: string;
  type: 'wallet_topup' | 'food_order';
  amount: number;
  reference: string;
  timestamp: number;
  customerEmail?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  restaurantName?: string;
}

interface DownloadableReceiptProps {
  receipt: ReceiptData;
}

const DownloadableReceipt = ({ receipt }: DownloadableReceiptProps) => {
  const receiptRef = React.useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`snappyeats-receipt-${receipt.reference}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Eye className="w-3 h-3" />
          Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
        </DialogHeader>
        
        <div ref={receiptRef} className="bg-white p-4">
          <Card className="w-full">
            <CardHeader className="text-center pb-4 border-b">
              <h2 className="text-2xl font-bold text-orange-600">SnappyEats</h2>
              <p className="text-sm text-muted-foreground">Payment Receipt</p>
            </CardHeader>
            
            <CardContent className="p-4 space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Receipt ID:</span>
                  <span className="font-mono text-xs">{receipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-mono text-xs">{receipt.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDate(receipt.timestamp)}</span>
                </div>
                {receipt.customerEmail && (
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{receipt.customerEmail}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="capitalize">
                    {receipt.type === 'wallet_topup' ? 'Wallet Top-up' : 'Food Order'}
                  </span>
                </div>
              </div>
              
              {receipt.items && receipt.items.length > 0 && (
                <div className="border-t pt-3 space-y-2">
                  <h4 className="font-semibold text-sm">Order Items:</h4>
                  {receipt.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  {receipt.restaurantName && (
                    <div className="text-xs text-muted-foreground">
                      From: {receipt.restaurantName}
                    </div>
                  )}
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-green-600">₦{receipt.amount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground pt-3 border-t">
                <div>Thank you for choosing SnappyEats!</div>
                <div>For support, contact us at support@snappyeats.com</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button onClick={downloadPDF} className="w-full gap-2">
          <Download className="w-4 h-4" />
          Download PDF Receipt
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadableReceipt;
