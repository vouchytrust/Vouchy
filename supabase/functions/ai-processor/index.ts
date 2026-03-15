import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// As discovered in diagnostic: gemini-2.5-flash is the active one for this project
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

async function callAI(prompt: string): Promise<string> {
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

    let lastErr = '';
    for (const model of MODELS) {
        try {
            // Favor v1beta as per successful test
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
                }),
            });

            const data = await res.json();
            if (res.ok) {
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
                if (text) return text;
            } else {
                lastErr = `[${model}] ${data.error?.message || res.statusText}`;
            }
        } catch (e: any) {
            lastErr = `[${model}] ${e.message}`;
        }
    }
    throw new Error('AI Error: ' + lastErr);
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    const json = (body: object, status = 200) =>
        new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    try {
        const body = await req.json();
        const action = body.action || '';
        const payload = body.data || body;
        const text = payload.text || payload.mainIdea || '';
        const style = payload.style || payload.mode || 'natural';
        const spaceOwnerId = payload.spaceOwnerId || null;

        console.log(`[AI-PROCESSOR] Action: ${action}, Owner: ${spaceOwnerId}`);

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            return json({ error: 'Supabase credentials missing' }, 500);
        }

        const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // ── Determine Payer (Credit Owner) ──
        if (!spaceOwnerId) {
            return json({ error: 'No user context provided for credit tracking.' }, 401);
        }

        // ── Check Credits & Plan ──
        const { data: profile, error: pError } = await sb.from('profiles').select('ai_credits_used, ai_scripts_used, ai_text_used, plan').eq('user_id', spaceOwnerId).single();
        if (pError || !profile) {
            return json({ error: 'Profile not found. Owner must create a profile to use AI.' }, 404);
        }

        const limits: Record<string, number> = { free: 0, pro: 200, agency: 2000 };
        const userPlan = profile.plan?.toLowerCase() || 'free';
        const limit = limits[userPlan] ?? 0;
        const used = profile.ai_credits_used || 0;

        if (used >= limit) {
            return json({ error: `The owner of this collection has reached their AI credit limit (${userPlan}: ${limit}).` }, 429);
        }

        // ── Build Prompts ──
        let prompt = '';
        const nAction = action.replace(/_/g, '-');
        const isScriptAction = nAction === 'generate-script';

        if (isScriptAction) {
            const context = payload.keywords || payload.mainIdea || '';
            const questions = payload.questions || [];
            prompt = `Generate a natural conversational script for a video testimonial.\nContext: ${context}\nQuestions: ${questions.join(', ')}\n\nFormat: VERY SHORT (15s). Return ONLY the script text.`;
        } else {
            // Default to enhancement
            const t = style.toLowerCase();
            const promptMap: Record<string, string> = {
                polish: `As an expert testimonial editor, refine this feedback for perfect grammar, punctuation, and flow. Preserve the user's authentic voice but ensure the testimonial is boardroom-ready. Original: "${text}". Return ONLY the polished text.`,
                punchy: `Distill this testimonial into a high-impact, headline-style version. Focus on the most significant result or feeling. Make it sharp, memorable, and brief. Original: "${text}". Return ONLY the distilled text.`,
                amplify: `Subtly enhance this testimonial by elaborating on the reported benefits and results. Add descriptive depth while maintaining a 100% natural, human tone. Avoid corporate fluff. Original: "${text}". Return ONLY the enriched text.`,
                professional: `Elevate the tone of this testimonial to be more authoritative, sophisticated, and business-focused. Ideal for high-stakes enterprise landing pages. Original: "${text}". Return ONLY the rewritten text.`,
                casual: `Soften the tone to be more approachable, warm, and friendly. Make it feel like a recommendation to a close friend. Personable and sincere. Original: "${text}". Return ONLY the rewritten text.`,
                simplify: `Remove any complexity or jargon. Translate this into the clearest, most accessible version possible so the core value shines through instantly. Original: "${text}". Return ONLY the simplified text.`,
                concise: `Without losing any key information or results, make this testimonial as brief as possible. Every word must earn its place. Efficiency is key. Original: "${text}". Return ONLY the concise text.`,
                persuasive: `Harness the principles of social proof to make this testimonial more compelling. Emphasize the transformation and the problem solved. Convincing yet honest. Original: "${text}". Return ONLY the persuasive text.`,
            };
            prompt = promptMap[t] || `Improve this testimonial: "${text}". Return ONLY the result.`;
        }

        // ── Call AI ──
        const resultText = await callAI(prompt);

        // ── Increment Usage ──
        const updateData = { 
            ai_credits_used: used + 1,
            ai_scripts_used: isScriptAction ? (profile.ai_scripts_used || 0) + 1 : (profile.ai_scripts_used || 0),
            ai_text_used: !isScriptAction ? (profile.ai_text_used || 0) + 1 : (profile.ai_text_used || 0)
        };
        const { error: updateError } = await sb.from('profiles').update(updateData).eq('user_id', spaceOwnerId);

        if (updateError) {
            console.error('Usage update failed:', updateError);
        }

        return json({ result: resultText });

    } catch (err: any) {
        console.error('[FATAL] AI error:', err.message);
        return json({ error: err.message || 'Internal AI Error' }, 500);
    }
});
