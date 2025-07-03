
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Loader2, Shield, CheckCircle, Lock, AlertCircle } from 'lucide-react';
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
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
      if (errors.cardNumber) {
        setErrors(prev => ({ ...prev, cardNumber: '' }));
      }
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
      if (errors.expiryDate) {
        setErrors(prev => ({ ...prev, expiryDate: '' }));
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      setCvv(value);
      if (errors.cvv) {
        setErrors(prev => ({ ...prev, cvv: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!amount || parseFloat(amount) < 100) {
      newErrors.amount = 'Minimum amount is ₦100';
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!expiryDate || expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!cvv || cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for validation errors",
        variant: "destructive",
      });
      return;
    }

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
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Payment initialization failed');
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
            toast({
              title: "Payment timeout",
              description: "Please try again",
              variant: "destructive",
            });
          }
        }, 600000);
      } else {
        throw new Error(data.error || 'Payment initialization failed');
      }
    } catch (error: any) {
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
    setErrors({});
  };

  const InputField = ({ 
    id, 
    label, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    error 
  }: {
    id: string;
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
  }) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`mt-1 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      />
      {error && (
        <div className="flex items-center space-x-1 mt-1">
          <AlertCircle className="w-3 h-3 text-red-500" />
          <span className="text-xs text-red-500">{error}</span>
        </div>
      )}
    </div>
  );

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

            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <InputField
              id="amount"
              label="Amount (₦)"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
            />

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
              
              <InputField
                id="cardholderName"
                label="Cardholder Name"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                error={errors.cardholderName}
              />

              <InputField
                id="cardNumber"
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                error={errors.cardNumber}
              />

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  id="expiryDate"
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  error={errors.expiryDate}
                />
                <InputField
                  id="cvv"
                  label="CVV"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  error={errors.cvv}
                />
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
