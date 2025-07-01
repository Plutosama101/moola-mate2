
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaystackPaymentProps {
  onPaymentSuccess: (amount: number, reference: string) => void;
}

const PaystackPayment = ({ onPaymentSuccess }: PaystackPaymentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const predefinedAmounts = [500, 1000, 2000, 5000];

  const handlePayment = async () => {
    if (!amount || !email) {
      toast({
        title: "Missing Information",
        description: "Please enter both amount and email address",
        variant: "destructive",
      });
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum payment amount is ₦100",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const reference = `wallet_topup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { data, error } = await supabase.functions.invoke('paystack-payment', {
        body: {
          amount: paymentAmount,
          email,
          reference,
        },
      });

      if (error) throw error;

      if (data.success) {
        // Open Paystack checkout in a new tab
        const paymentWindow = window.open(data.authorization_url, '_blank');
        
        // Poll for payment completion
        const pollPayment = setInterval(async () => {
          if (paymentWindow?.closed) {
            clearInterval(pollPayment);
            
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: { reference },
            });

            if (!verifyError && verifyData.success) {
              onPaymentSuccess(verifyData.amount, reference);
              setIsOpen(false);
              setAmount('');
              setEmail('');
              toast({
                title: "Payment Successful!",
                description: `₦${verifyData.amount.toLocaleString()} has been added to your wallet`,
              });
            }
          }
        }, 2000);

        // Clear polling after 5 minutes
        setTimeout(() => clearInterval(pollPayment), 300000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <CreditCard className="w-4 h-4 mr-2" />
          Add Money with Card
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="100"
            />
          </div>

          <div>
            <Label>Quick Select</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {predefinedAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  className="text-sm"
                >
                  ₦{preset.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={isLoading || !amount || !email}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4 mr-2" />
            )}
            Pay ₦{amount ? parseFloat(amount).toLocaleString() : '0'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Powered by Paystack • Secure payment processing
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaystackPayment;
