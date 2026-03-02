// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PRODUCT_PLAN_MAP = {
    'pdt_0NVVmIlZrdWC90xs1ZgOm': 'pro',
    'pdt_0NVVmba1bevOgK6sfV8Wx': 'agency',
};

Deno.serve(async (req) => {
    try {
        const payload = await req.json();
        console.log("Webhook received:", payload);
        const eventType = payload.type || payload.event_type;

        if (['payment.succeeded', 'subscription.created'].includes(eventType)) {
            const customerEmail = payload.customer?.email;
            const productId = payload.product_id;
            const plan = PRODUCT_PLAN_MAP[productId] || 'unknown';

            console.log(`Fulfilling purchase: ${customerEmail} - plan: ${plan}`);

            const supabase = createClient(
                Deno.env.get('SUPABASE_URL'),
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
            );

            const { data, error } = await supabase
                .from('profiles')
                .update({
                    plan,
                    updated_at: new Date().toISOString()
                })
                .eq('email', customerEmail.toLowerCase());

            if (error) {
                console.error("Database update error:", error);
                throw error;
            }
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
        return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (err) {
        console.error("Webhook processing error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
});
