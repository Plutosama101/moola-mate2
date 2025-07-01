
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Loader2, Shield, CheckCircle } from 'lucide-react';
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
  const [paymentStep, setPaymentStep] = useState<'input' | 'processing' | 'success'>('input');
  const { toast } = useToast();

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];

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
    setPaymentStep('processing');

    try {
      const reference = `wallet_topup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('Initiating payment:', { amount: paymentAmount, email, reference });

      const { data, error } = await supabase.functions.invoke('paystack-payment', {
        body: {
          amount: paymentAmount,
          email,
          reference,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Payment initialization response:', data);

      if (data.success) {
        // Open Paystack checkout in a new tab
        const paymentWindow = window.open(data.authorization_url, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        if (!paymentWindow) {
          throw new Error('Please allow popups for payment processing');
        }
        
        // Poll for payment completion
        const pollPayment = setInterval(async () => {
          if (paymentWindow?.closed) {
            clearInterval(pollPayment);
            
            // Verify payment
            console.log('Verifying payment:', reference);
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: { reference },
            });

            if (!verifyError && verifyData?.success) {
              console.log('Payment verified successfully:', verifyData);
              onPaymentSuccess(verifyData.amount, reference);
              setPaymentStep('success');
              
              setTimeout(() => {
                setIsOpen(false);
                resetForm();
              }, 2000);
              
              toast({
                title: "Payment Successful!",
                description: `₦${verifyData.amount.toLocaleString()} has been added to your wallet`,
              });
            } else {
              console.error('Payment verification failed:', verifyError || verifyData);
              setPaymentStep('input');
              toast({
                title: "Payment Verification Failed",
                description: "Please try again or contact support",
                variant: "destructive",
              });
            }
            setIsLoading(false);
          }
        }, 2000);

        // Clear polling after 10 minutes
        setTimeout(() => {
          clearInterval(pollPayment);
          if (!paymentWindow?.closed) {
            setIsLoading(false);
            setPaymentStep('input');
          }
        }, 600000);
      } else {
        throw new Error(data.error || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStep('input');
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setEmail('');
    setPaymentStep('input');
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <CreditCard className="w-4 h-4 mr-2" />
          Add Money with Card
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Secure Payment
          </DialogTitle>
        </DialogHeader>
        
        {paymentStep === 'input' && (
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <p className="text-sm text-blue-800">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Powered by Paystack - Your payment is secure and encrypted
                </p>
              </CardContent>
            </Card>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
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
                className="mt-1"
              />
            </div>

            <div>
              <Label>Quick Select</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
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
              Secured by Paystack • SSL Encrypted
            </p>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold mb-2">Processing Payment</h3>
            <p className="text-sm text-muted-foreground">
              Please complete your payment in the popup window
            </p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground">
              Your wallet has been topped up successfully
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaystackPayment;
