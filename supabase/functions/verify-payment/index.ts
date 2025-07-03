
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json()
    console.log('Verifying payment:', reference)
    
    // Get the Paystack secret key from Supabase secrets
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    
    if (!paystackKey) {
      console.error('Paystack secret key not found')
      throw new Error('Payment service configuration error')
    }
    
    // Verify payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await verifyResponse.json()
    console.log('Verification response:', data)
    
    if (!data.status || data.data.status !== 'success') {
      console.error('Payment verification failed:', data)
      throw new Error('Payment verification failed')
    }

    return new Response(
      JSON.stringify({
        success: true,
        amount: data.data.amount / 100, // Convert from kobo to naira
        status: data.data.status,
        reference: data.data.reference,
        paid_at: data.data.paid_at,
        customer: data.data.customer,
        authorization: data.data.authorization,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
