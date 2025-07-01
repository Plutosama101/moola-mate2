
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, email, reference } = await req.json()
    console.log('Payment request:', { amount, email, reference })
    
    // Get the Paystack secret key from Supabase secrets
    const paystackKey = Deno.env.get('sk_test_a151f672274e8237ca37316387f5df69d156e6b8')
    
    if (!paystackKey) {
      console.error('Paystack secret key not found')
      throw new Error('Payment service configuration error')
    }
    
    // Initialize payment with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Paystack expects amount in kobo
        email,
        reference,
        currency: 'NGN',
        callback_url: `${req.headers.get('origin')}/payment-success`,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      }),
    })

    const data = await paystackResponse.json()
    console.log('Paystack response:', data)
    
    if (!data.status) {
      console.error('Paystack error:', data.message)
      throw new Error(data.message || 'Payment initialization failed')
    }

    return new Response(
      JSON.stringify({
        success: true,
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Paystack payment error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
