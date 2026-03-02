import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DODO_API_URLS = ["https://test.dodopayments.com", "https://live.dodopayments.com"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DODO_API_KEY = Deno.env.get("DODO_PAYMENTS_API_KEY")?.trim();
    if (!DODO_API_KEY) throw new Error("DODO_PAYMENTS_API_KEY not configured");
    console.log("DODO key length:", DODO_API_KEY.length, "first 4:", DODO_API_KEY.substring(0, 4));

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey =
      Deno.env.get("SUPABASE_ANON_KEY") ||
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ||
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase env vars: SUPABASE_URL and key");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    const userEmail = claimsData.claims.email;

    const { product_id, return_url } = await req.json();

    // Create Dodo checkout session (live first, then test fallback for product mismatch)
    const checkoutPayload = {
      product_cart: [{ product_id, quantity: 1 }],
      customer: {
        email: userEmail,
      },
      payment_link: true,
      return_url: return_url || undefined,
      metadata: {
        user_id: userId,
      },
    };

    let data: any = null;
    let response: Response | null = null;

    for (const baseUrl of DODO_API_URLS) {
      response = await fetch(`${baseUrl}/checkouts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DODO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutPayload),
      });

      const raw = await response.text();
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { message: raw };
      }
      if (response.ok) break;

      const message =
        typeof data?.message === "string"
          ? data.message
          : typeof data?.error === "string"
            ? data.error
            : "";

      const isProductMissing =
        response.status === 422 &&
        message.toLowerCase().includes("does not exist");

      if (!isProductMissing) break;
    }

    if (!response?.ok) {
      throw new Error(`Dodo API error [${response?.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ checkout_url: data.checkout_url, session_id: data.session_id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
