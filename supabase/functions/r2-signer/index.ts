// ─── AWS V4 SIGNING UTILS (NO EXTERNAL DEPENDENCIES) ───
// This implementation avoids the fragile esm.sh imports that frequently cause 502 Bad Gateway 
// errors in Supabase Edge Functions.

async function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  
  const kDateBuf = await crypto.subtle.sign('HMAC', 
    await crypto.subtle.importKey('raw', encoder.encode('AWS4' + key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
    encoder.encode(dateStamp)
  );
  
  const kRegionBuf = await crypto.subtle.sign('HMAC',
    await crypto.subtle.importKey('raw', kDateBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
    encoder.encode(regionName)
  );
  
  const kServiceBuf = await crypto.subtle.sign('HMAC',
    await crypto.subtle.importKey('raw', kRegionBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
    encoder.encode(serviceName)
  );
  
  const kSigningBuf = await crypto.subtle.sign('HMAC',
    await crypto.subtle.importKey('raw', kServiceBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
    encoder.encode('aws4_request')
  );
  
  return await crypto.subtle.importKey('raw', kSigningBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { fileName } = await req.json();
    if (!fileName) throw new Error('fileName required');

    const ACCESS_KEY = Deno.env.get('R2_ACCESS_KEY_ID') || "2eb6e2f74c84aed00864ab63e012f25b";
    const SECRET_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY') || "a10dc3667bd68b7c7903b1aa7fdda7e14add0a172e654a332266c737d36644d5";
    const BUCKET = Deno.env.get('R2_BUCKET_NAME') || "vouchy-storage";
    const ACCOUNT_ID = Deno.env.get('R2_ACCOUNT_ID') || "69ec1206dcb450faf9b30b2af2940351";
    const PUBLIC_URL = Deno.env.get('R2_PUBLIC_URL') || "https://pub-856078d2fef7426ead17ca7c0ea0921c.r2.dev";

    const method = 'PUT';
    const region = 'auto';
    const service = 's3';
    const host = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const endpoint = `https://${host}/${BUCKET}/${fileName}`;
    
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    const datestamp = amzDate.slice(0, 8);
    const expiry = 3600;

    const credentialScope = `${datestamp}/${region}/${service}/aws4_request`;
    const canonicalUri = `/${BUCKET}/${fileName}`;
    const canonicalQuerystring = `X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${encodeURIComponent(ACCESS_KEY + '/' + credentialScope)}&X-Amz-Date=${amzDate}&X-Amz-Expires=${expiry}&X-Amz-SignedHeaders=host`;
    const canonicalHeaders = `host:${host}\n`;
    const signedHeaders = 'host';
    const payloadHash = 'UNSIGNED-PAYLOAD';
    
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalRequest));
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${hashHex}`;
    
    const signingKey = await getSignatureKey(SECRET_KEY, datestamp, region, service);
    const signatureBuffer = await crypto.subtle.sign('HMAC', signingKey, new TextEncoder().encode(stringToSign));
    const signature = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const signedUrl = `${endpoint}?${canonicalQuerystring}&X-Amz-Signature=${signature}`;
    const publicUrl = `${PUBLIC_URL.replace(/\/$/, '')}/${fileName}`;

    return new Response(JSON.stringify({ uploadUrl: signedUrl, publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
