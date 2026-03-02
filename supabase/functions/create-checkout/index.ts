// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DODO_API_KEY = Deno.env.get('DODO_API_KEY') || Deno.env.get('DODO_PAYMENTS_API_KEY');
    if (!DODO_API_KEY) {
      throw new Error("DODO_API_KEY not configured in Supabase secrets");
    }

    const { productId, customerEmail, customerName, returnUrl } = await req.json();

    const isTestMode = DODO_API_KEY.startsWith('test_');
    const apiBaseUrl = isTestMode ? 'https://test.dodopayments.com' : 'https://live.dodopayments.com';

    console.log(`Creating checkout for ${customerEmail} - product: ${productId} (${isTestMode ? 'TEST' : 'LIVE'})`);

    const response = await fetch(`${apiBaseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DODO_API_KEY}`,
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: {
          email: customerEmail,
          name: customerName || customerEmail.split('@')[0]
        },
        payment_link: true,
        success_url: returnUrl || 'https://vouchy.click/dashboard?payment=success',
        metadata: { customer_email: customerEmail },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Dodo API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ paymentLink: data.checkout_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
