import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, MessageSquareText, CheckCircle2, ArrowLeft, Sparkles, User, Mail, Building2, Briefcase, Zap, ChevronRight, Layout, Info, PenTool, Check } from "lucide-react";
import VideoRecorder from "@/components/collection/VideoRecorder";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// ── MINIMAL COMPONENTS ──

function MinimalInput({ ...props }: any) {
  return (
    <input {...props} className="w-full h-11 px-0 text-[14px] text-slate-900 bg-transparent border-b border-slate-100 outline-none focus:border-slate-900 transition-all font-medium placeholder:text-slate-200" />
  );
}

function FormField({ label, required, children }: any) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</div>
      {children}
    </div>
  );
}

function MethodCard({ icon, label, description, onClick }: any) {
  return (
    <button type="button" onClick={onClick} className="p-10 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all text-center flex flex-col items-center group">
      <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{label}</h3>
      <p className="text-slate-400 text-xs font-medium leading-relaxed">{description}</p>
    </button>
  );
}

interface SpaceData {
  id: string;
  name: string;
  slug: string;
  form_config: any;
  user_id: string;
  profiles?: {
    company_name: string | null;
    brand_color: string | null;
    logo_url: string | null;
    plan: string | null;
  };
}

export default function CollectionPage() {
  const { slug } = useParams();
  const [space, setSpace] = useState<SpaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState<"choose" | "text" | "video" | "success">("choose");
  const [form, setForm] = useState({ name: "", email: "", company: "", title: "", content: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [aiEnhancing, setAiEnhancing] = useState<string | null>(null);

  const [honeypot, setHoneypot] = useState("");
  const [agreed, setAgreed] = useState(false);
  const textOpenedAt = useRef<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSpace() {
      try {
        const { data: spaceData, error: spaceErr } = await supabase
          .from("spaces")
          .select("id, name, slug, form_config, user_id")
          .eq("slug", slug)
          .eq("is_active", true)
          .single();
        if (spaceErr || !spaceData) { setNotFound(true); return; }
        const { data: profileData } = await supabase
          .from("profiles")
          .select("company_name, brand_color, logo_url, plan")
          .eq("user_id", spaceData.user_id)
          .single();
        setSpace({ ...spaceData, profiles: profileData } as unknown as SpaceData);
      } catch { setNotFound(true); } finally { setLoading(false); }
    }
    if (slug) loadSpace();
  }, [slug]);

  useEffect(() => {
    if (mode === "text") textOpenedAt.current = Date.now();
  }, [mode]);

  const accentColor = space?.profiles?.brand_color || "#16a34a";
  const workspaceName = space?.profiles?.company_name || "Vouchy";
  const logoUrl = space?.profiles?.logo_url;
  const isPro = space?.profiles?.plan && space.profiles.plan !== "free";

  const thankYouConfig = space?.form_config?.thankYouConfig || {
    message: "Thank you for your feedback!",
    ctaText: "",
    redirectUrl: "",
  };

  const enableVideo = isPro && space?.form_config?.enableVideo !== false;
  const enableText = space?.form_config?.enableText !== false;

  const submitText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;
    if (honeypot) return;
    if (Date.now() - textOpenedAt.current < 4000) {
      toast({ title: "Note", description: "Sharing a bit more detail would be great!", variant: "default" });
      return;
    }
    if (!agreed) {
      toast({ title: "Required", description: "Please confirm your testimonial.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("testimonials").insert({
        space_id: space.id, user_id: space.user_id,
        author_name: form.name, author_email: form.email || null,
        author_company: form.company || null, author_title: form.title || null,
        content: form.content, rating: form.rating, type: "text",
      });
      if (error) throw error;
      setMode("success");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const handleAiEnhance = async (style: string) => {
    if (!form.content.trim() || !space) return;
    setAiEnhancing(style);
    try {
      const res = await supabase.functions.invoke("ai-processor", {
        body: { action: "enhance_text", text: form.content, style, spaceOwnerId: space.user_id },
      });
      if (res.data?.result) { setForm(f => ({ ...f, content: res.data.result })); }
    } catch { } finally { setAiEnhancing(null); }
  };

  if (loading) return null;
  if (notFound) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-300">Not found</div>;

  if (mode === "video") {
    return (
      <VideoRecorder
        spaceId={space!.id} spaceUserId={space!.user_id} accentColor={accentColor}
        workspaceName={workspaceName} logoUrl={logoUrl}
        questions={[]} onBack={() => setMode("choose")} onSuccess={() => setMode("success")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      <main className="flex-1 flex flex-col items-center justify-start lg:justify-center p-5 md:p-8 lg:p-12 relative w-full max-w-7xl mx-auto">

        {/* TOP MINIMAL LOGO - Relative on mobile, absolute on desktop */}
        {logoUrl && (
          <div className="mb-10 lg:absolute lg:top-8 lg:mb-0 opacity-40">
            <img src={logoUrl} alt={workspaceName} className="h-4 lg:h-5 w-auto max-w-[100px] object-contain" />
          </div>
        )}

        <AnimatePresence mode="wait">

          {mode === "choose" && (
            <motion.div key="choose" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl text-center py-10 lg:py-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Share your story.</h1>
              <p className="text-slate-400 text-sm font-medium mb-12 px-6">How has {workspaceName} helped you succeed?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 text-left px-4">
                {enableVideo && (
                  <MethodCard icon={<Video className="h-6 w-6" />} label="Video" description="Record a quick testimonial." onClick={() => setMode("video")} />
                )}
                {enableText && (
                  <MethodCard icon={<MessageSquareText className="h-6 w-6" />} label="Written" description="Write a short review." onClick={() => setMode("text")} />
                )}
              </div>
            </motion.div>
          )}

          {mode === "text" && (
            <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col py-6 lg:py-0">

              <div className="mb-6 px-1">
                <button onClick={() => setMode("choose")} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors text-[10px] font-bold uppercase tracking-widest">
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
              </div>

              <form onSubmit={submitText} className="flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-6 w-full items-start">

                {/* MINIMAL LEFT CARD */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 flex flex-col w-full lg:min-h-[580px] shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-8">Review</h2>

                  <div className="space-y-8 flex-1 flex flex-col">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(i => {
                          const filled = hoveredStar !== null ? i <= hoveredStar : i <= form.rating;
                          return (
                            <button key={i} type="button" onMouseEnter={() => setHoveredStar(i)} onMouseLeave={() => setHoveredStar(null)} onClick={() => setForm({ ...form, rating: i })} className="transition-all transform hover:scale-110">
                              < Star className="h-6 w-6" style={{ fill: filled ? '#ff9b00' : 'none', color: filled ? '#ff9b00' : '#f1f5f9' }} strokeWidth={filled ? 0 : 2} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <FormField label="Full Name" required>
                        <MinimalInput placeholder="E.g. John Smith" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
                      </FormField>
                      <FormField label="Email" required>
                        <MinimalInput type="email" placeholder="john@example.com" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
                      </FormField>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Company">
                          <MinimalInput placeholder="E.g. Apple" value={form.company} onChange={v => setForm({ ...form, company: v })} />
                        </FormField>
                        <FormField label="Title">
                          <MinimalInput placeholder="Founder" value={form.title} onChange={v => setForm({ ...form, title: v })} />
                        </FormField>
                      </div>
                    </div>

                    <div className="mt-12 lg:mt-auto pt-8 border-t border-slate-50 lg:border-none">
                      <label className="flex items-start gap-2.5 cursor-pointer group mb-10">
                        <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${agreed ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}>
                          {agreed && <Check className="h-2 w-2 text-white" />}
                          <input type="checkbox" className="hidden" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium leading-tight group-hover:text-slate-600">I confirm this review is genuine.</span>
                      </label>

                      <button type="submit" disabled={submitting || !agreed} className="w-full h-12 flex items-center justify-center gap-2 text-white font-bold text-xs rounded-xl transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-20 shadow-sm" style={{ background: '#111827' }}>
                        {submitting ? 'Submitting...' : 'Submit Post'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* MINIMAL RIGHT CARD */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 flex flex-col w-full lg:min-h-[580px] shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 shrink-0">
                    <h2 className="text-lg font-bold text-slate-900">Your Story</h2>
                    {form.content.length > 5 && (
                      <div className="flex flex-col items-start md:items-end gap-3.5">
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto">
                          <span className="text-[8px] font-bold text-slate-200 uppercase tracking-[0.2em] pr-1 flex-shrink-0">Refine</span>
                          <div className="flex gap-4">
                            {['Polish', 'Punchy', 'Amplify', 'Concise'].map(st => (
                              <button key={st} type="button" onClick={() => handleAiEnhance(st.toLowerCase())} disabled={!!aiEnhancing} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 border-b border-transparent hover:border-slate-900 transition-all uppercase tracking-widest pb-0.5 whitespace-nowrap">
                                {aiEnhancing === st.toLowerCase() ? '...' : st}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto">
                          <span className="text-[8px] font-bold text-slate-200 uppercase tracking-[0.2em] pr-1 flex-shrink-0">Persona</span>
                          <div className="flex gap-4">
                            {['Professional', 'Casual', 'Persuasive', 'Simplify'].map(st => (
                              <button key={st} type="button" onClick={() => handleAiEnhance(st.toLowerCase())} disabled={!!aiEnhancing} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 border-b border-transparent hover:border-slate-900 transition-all uppercase tracking-widest pb-0.5 whitespace-nowrap">
                                {aiEnhancing === st.toLowerCase() ? '...' : st}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 relative min-h-[300px]">
                    <textarea
                      placeholder="What was your experience like? Be as detailed as you want."
                      value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                      className="w-full h-full p-0 text-[15px] lg:text-[16px] text-slate-950 font-medium placeholder:text-slate-200 bg-transparent outline-none resize-none leading-relaxed"
                    />
                    <div className="absolute bottom-0 right-0 text-[10px] font-bold text-slate-200 tracking-widest bg-white/80 py-1 pl-2">
                      {form.content.length} / 2000
                    </div>
                  </div>
                </div>

                <div className="hidden"><input tabIndex={-1} value={honeypot} onChange={e => setHoneypot(e.target.value)} /></div>
              </form>
            </motion.div>
          )}

          {mode === "success" && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 lg:py-0">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6 text-white">
                <Check className="h-6 w-6" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-bold text-slate-950 mb-2">Thank you</h2>
              <p className="text-slate-400 text-sm font-medium">Your feedback is appreciated.</p>
              {thankYouConfig.ctaText && thankYouConfig.redirectUrl && (
                <a href={thankYouConfig.redirectUrl} className="inline-block mt-8 text-xs font-bold text-slate-900 border-b border-slate-900 pb-0.5 hover:opacity-60 transition-all">
                  {thankYouConfig.ctaText}
                </a>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
