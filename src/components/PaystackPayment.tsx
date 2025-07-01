
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Loader2, Shield, CheckCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaystackPaymentProps {
  onPaymentSuccess: (amount: number, reference: string) => void;
}

const PaystackPayment = ({ onPaymentSuccess }: PaystackPaymentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'input' | 'processing' | 'success'>('input');
  const { toast } = useToast();

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const validateForm = () => {
    if (!amount || !email || !cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      return false;
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum payment amount is ₦100",
        variant: "destructive",
      });
      return false;
    }

    if (cardNumber.replace(/\s/g, '').length < 13) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid card number",
        variant: "destructive",
      });
      return false;
    }

    if (expiryDate.length !== 5) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter a valid expiry date (MM/YY)",
        variant: "destructive",
      });
      return false;
    }

    if (cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid CVV",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    const paymentAmount = parseFloat(amount);
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
          card: {
            number: cardNumber.replace(/\s/g, ''),
            cvv,
            expiryMonth: expiryDate.split('/')[0],
            expiryYear: '20' + expiryDate.split('/')[1],
            name: cardholderName
          }
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
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Secure Card Payment
          </DialogTitle>
        </DialogHeader>
        
        {paymentStep === 'input' && (
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <p className="text-sm text-blue-800">
                  <Lock className="w-4 h-4 inline mr-1" />
                  SSL Encrypted • Powered by Paystack
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

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm">Card Information</h4>
              
              <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  type="text"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={isLoading}
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
              Secured by Paystack • SSL Encrypted • PCI Compliant
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
