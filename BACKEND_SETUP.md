# Vouchy — Backend Setup Guide

Follow these steps **once** to get the full backend working.

---

## 1. Database Schema

The file `supabase/schema.sql` contains the complete, idempotent schema.  
To apply it, run the SQL in your **Supabase Dashboard → SQL Editor** or use the Supabase CLI:
```sh
supabase db push
```

---

## 2. Required Secrets (Edge Functions)

Edge functions need these environment variables. Set them in your **Supabase Dashboard → Edge Functions → Secrets** or via CLI:

```sh
supabase secrets set DODO_PAYMENTS_API_KEY=your_key_here
```

| Secret Name              | Where to get it                                        |
|--------------------------|--------------------------------------------------------|
| `DODO_PAYMENTS_API_KEY`  | [Dodo Payments Dashboard](https://dashboard.dodopayments.com) → API Keys |

---

## 3. Dodo Payments Setup

### Verify API Key Mode
Your Dodo API key and product ID **must be from the same environment** (both test or both live):

- **Test mode** keys work with `https://test.dodopayments.com`
- **Live mode** keys work with `https://live.dodopayments.com`

### Product ID
The Pro plan product ID is hardcoded in `src/pages/dashboard/SettingsPage.tsx`. If you recreate the product in Dodo, update this ID in the Settings page.

---

## 4. Storage Buckets

Two public buckets are required:

| Bucket   | Purpose                        | Public |
|----------|--------------------------------|--------|
| `logos`  | Company logos (onboarding)     | Yes    |
| `videos` | Video testimonial recordings  | Yes    |

Ensure these are created in your **Supabase Dashboard → Storage**.

---

## 5. Troubleshooting

### Dodo returns 401
Your `DODO_PAYMENTS_API_KEY` doesn't match the environment (test vs live).

### Dodo returns 422 "Product does not exist"
The product ID in `SettingsPage.tsx` doesn't exist in the Dodo environment that matches your API key.

---

© 2026 Vouchy Labs — *Precision Social Proof Architecture.*
