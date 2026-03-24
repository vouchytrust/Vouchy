import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to Cloudflare R2 via a Supabase Edge Function signer.
 * @param file The file or blob to upload
 * @param path The target path in the R2 bucket (e.g., 'videos/123/test.webm')
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(file: File | Blob, path: string): Promise<string> {
  console.log(`[R2-STORAGE] Requesting signer for: ${path} (${file.type})`);
  
  // 1. Get presigned URL from Supabase Edge Function
  const { data, error: signerError } = await supabase.functions.invoke('r2-signer', {
    body: {
      fileName: path,
      contentType: file.type || 'application/octet-stream',
    },
  });

  if (signerError || data?.error) {
    console.error('[R2-STORAGE] Signer Error:', signerError || data?.error);
    throw new Error('Failed to authorize upload. Check R2 secrets.');
  }

  const { uploadUrl, publicUrl, contentType } = data;
  
  if (!uploadUrl) {
    throw new Error('Signer returned no upload URL');
  }

  // 2. Upload directly to R2
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType || file.type || 'application/octet-stream',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[R2-STORAGE] PUT Failed:', response.status, errorText);
      throw new Error(`R2 rejected upload (${response.status})`);
    }

    console.log(`[R2-STORAGE] Successfully uploaded to: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error('[R2-STORAGE] Network Error during PUT:', err);
    throw err;
  }
}
