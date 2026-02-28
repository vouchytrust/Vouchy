# Vouchy — Backend Setup Guide

Follow these steps **once** to get the full backend working.

---

## 1. Database Schema

The file `supabase/schema.sql` contains the complete, idempotent schema.  
It is **already applied** via Lovable Cloud migrations. No action needed here unless you're setting up a fresh project.

---

## 2. Required Secrets (Edge Functions)

Edge functions need these environment variables. Set them in **Lovable Cloud → Secrets**:

| Secret Name              | Where to get it                                        | Status       |
|--------------------------|--------------------------------------------------------|--------------|
| `SUPABASE_URL`           | Auto-configured by Lovable Cloud                       | ✅ Set       |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-configured by Lovable Cloud                    | ✅ Set       |
| `LOVABLE_API_KEY`        | Auto-configured by Lovable Cloud                       | ✅ Set       |
| `DODO_PAYMENTS_API_KEY`  | [Dodo Payments Dashboard](https://dashboard.dodopayments.com) → API Keys | ✅ Set (verify it's correct — see troubleshooting below) |

---

## 3. Dodo Payments Setup

### Verify API Key Mode
Your Dodo API key and product ID **must be from the same environment** (both test or both live):

- **Test mode** keys work with `https://test.dodopayments.com`
- **Live mode** keys work with `https://live.dodopayments.com`

The edge function tries **both** endpoints automatically, but the **API key must match the environment** where the product was created.

### Product ID
The Pro plan product ID is hardcoded in `src/pages/dashboard/SettingsPage.tsx`:
```
iBM6dbPHMsXqlV49.5Gd_LDMOfWCd34jiMSak8zc_d2rbC6zo71Y2tmc17f1HXR3Y
```
If you recreate the product in Dodo, update this ID in the Settings page.

### Webhook (Optional — for auto-upgrading plans)
To automatically upgrade users after payment:
1. In Dodo Dashboard → Webhooks, add a webhook URL pointing to a new edge function (e.g., `https://<project-ref>.supabase.co/functions/v1/dodo-webhook`)
2. Create the edge function to listen for `payment.completed` events and update the user's plan in the database

---

## 4. Google Sign-In

Google OAuth is managed automatically by Lovable Cloud. **No action needed.**

To use your own Google OAuth credentials (optional):
1. Go to Lovable Cloud → Users → Authentication Settings → Sign In Methods → Google
2. Enter your own Google Cloud OAuth client ID and secret

---

## 5. Storage Buckets

Two public buckets are created by the schema:

| Bucket   | Purpose                        | Public |
|----------|--------------------------------|--------|
| `logos`  | Company logos (onboarding)     | Yes    |
| `videos` | Video testimonial recordings  | Yes    |

These are **already created** via migrations. No action needed.

---

## 6. Edge Functions

| Function          | Purpose                              | Auth Required |
|-------------------|--------------------------------------|---------------|
| `create-checkout` | Creates Dodo Payments checkout URL   | Yes (JWT)     |

Edge functions deploy automatically when you push code changes.

---

## 7. Troubleshooting

### "supabaseKey is required" error
The edge function can't find the Supabase key. Check that `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` is set in secrets.

### Dodo returns 401
Your `DODO_PAYMENTS_API_KEY` doesn't match the environment. Go to [Dodo Dashboard](https://dashboard.dodopayments.com), copy the correct key (test or live), and update it in Lovable Cloud → Secrets.

### Dodo returns 422 "Product does not exist"
The product ID in `SettingsPage.tsx` doesn't exist in the Dodo environment that matches your API key. Either:
- Switch to the matching Dodo environment, or
- Create the product in the correct environment and update the ID

### Collection page shows "Page not found"
- Verify the space exists and `is_active = true`
- The profiles public-read policy must be applied (included in schema.sql)

### Testimonials not appearing in dashboard
- Check RLS: testimonials are only visible to `auth.uid() = user_id`
- Make sure the `user_id` on the testimonial matches the logged-in user
