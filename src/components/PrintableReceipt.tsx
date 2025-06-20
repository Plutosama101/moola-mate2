
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Printer, Eye } from 'lucide-react';

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptProps {
  receiptId: string;
  customerName?: string;
  items: ReceiptItem[];
  total: number;
  timestamp: number;
  vendorName: string;
}

const PrintableReceipt = ({ receiptId, customerName, items, total, timestamp, vendorName }: ReceiptProps) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SnappyEats Receipt</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 300px; 
                margin: 0 auto; 
                padding: 20px;
                font-size: 12px;
              }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
              .logo { font-size: 20px; font-weight: bold; color: #ea580c; }
              .receipt-info { margin-bottom: 15px; }
              .items { border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px; }
              .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .total { font-weight: bold; font-size: 14px; text-align: right; }
              .footer { text-align: center; margin-top: 15px; font-size: 10px; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">SnappyEats</div>
              <div>${vendorName}</div>
            </div>
            
            <div class="receipt-info">
              <div>Receipt #: ${receiptId}</div>
              <div>Date: ${new Date(timestamp).toLocaleString()}</div>
              ${customerName ? `<div>Customer: ${customerName}</div>` : ''}
            </div>
            
            <div class="items">
              ${items.map(item => `
                <div class="item">
                  <span>${item.quantity}x ${item.name}</span>
                  <span>₦${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              `).join('')}
            </div>
            
            <div class="total">
              Total: ₦${total.toLocaleString()}
            </div>
            
            <div class="footer">
              <div>Thank you for choosing SnappyEats!</div>
              <div>Visit us again soon</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Eye className="w-3 h-3" />
          Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
        </DialogHeader>
        
        <Card className="w-full">
          <CardHeader className="text-center pb-4 border-b">
            <h2 className="text-xl font-bold text-orange-600">SnappyEats</h2>
            <p className="text-sm font-medium">{vendorName}</p>
          </CardHeader>
          
          <CardContent className="p-4 space-y-3">
            <div className="text-xs space-y-1">
              <div>Receipt #: {receiptId}</div>
              <div>Date: {new Date(timestamp).toLocaleString()}</div>
              {customerName && <div>Customer: {customerName}</div>}
            </div>
            
            <div className="border-t pt-3 space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500 pt-3 border-t">
              <div>Thank you for choosing SnappyEats!</div>
              <div>Visit us again soon</div>
            </div>
          </CardContent>
        </Card>
        
        <Button onClick={handlePrint} className="w-full gap-2">
          <Printer className="w-4 h-4" />
          Print Receipt
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PrintableReceipt;
