import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PaystackPayment from './PaystackPayment';
import DownloadableReceipt from './DownloadableReceipt';
import { storage } from '@/utils/storage';

interface PaymentHistory {
  id: string;
  type: 'wallet_topup' | 'food_order';
  amount: number;
  reference: string;
  timestamp: number;
  customerEmail?: string;
}

interface NigerianWalletProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const NigerianWallet = ({ balance, onBalanceChange }: NigerianWalletProps) => {
  const { toast } = useToast();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

  useEffect(() => {
    // Load payment history from localStorage
    const savedHistory = storage.getItem('paymentHistory');
    if (savedHistory) {
      try {
        setPaymentHistory(JSON.parse(savedHistory));
      } catch {
        setPaymentHistory([]);
      }
    }
  }, []);

  const savePaymentHistory = (history: PaymentHistory[]) => {
    setPaymentHistory(history);
    storage.setItem('paymentHistory', JSON.stringify(history));
  };

  const handleTopUp = (amount: number) => {
    const newBalance = balance + amount;
    onBalanceChange(newBalance);
    storage.setItem('nigerianWallet', newBalance.toString());
    toast({
      title: 'Wallet Topped Up',
      description: `₦${amount.toLocaleString()} added to your wallet`,
    });
  };

  const handlePaystackSuccess = (amount: number, reference: string) => {
    const newBalance = balance + amount;
    onBalanceChange(newBalance);
    storage.setItem('nigerianWallet', newBalance.toString());

    // Add to payment history
    const newPayment: PaymentHistory = {
      id: `payment_${Date.now()}`,
      type: 'wallet_topup',
      amount,
      reference,
      timestamp: Date.now(),
    };

    const updatedHistory = [newPayment, ...paymentHistory];
    savePaymentHistory(updatedHistory);

    toast({
      title: 'Payment Successful!',
      description: `₦${amount.toLocaleString()} added to your wallet via Paystack`,
    });
  };

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
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

      {/* Paystack Payment */}
      <PaystackPayment onPaymentSuccess={handlePaystackSuccess} />

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4" />
              <h3 className="font-semibold">Recent Transactions</h3>
            </div>
            <div className="space-y-2">
              {paymentHistory.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">
                      {payment.type === 'wallet_topup' ? 'Wallet Top-up' : 'Food Order'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">
                      +₦{payment.amount.toLocaleString()}
                    </span>
                    <DownloadableReceipt 
                      receipt={{
                        id: payment.id,
                        type: payment.type,
                        amount: payment.amount,
                        reference: payment.reference,
                        timestamp: payment.timestamp,
                        customerEmail: payment.customerEmail,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NigerianWallet;
