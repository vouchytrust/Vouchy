import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, MessageSquareText, Check, Send, Cpu, ChevronLeft, Sparkles, Quote } from "lucide-react";
import VideoRecorder from "@/components/collection/VideoRecorder";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/** * UI COMPONENT: Precision Field
 * High-impact but vertically compact.
 */
function MinimalField({ label, ...props }: any) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
      <input
        {...props}
        className="w-full h-11 px-4 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all duration-300 font-semibold placeholder:text-slate-300 shadow-sm"
      />
    </div>
  );
}

/** * UI COMPONENT: Responsive Method Card
 * Tactile and bold, scales to fit.
 */
function MethodCard({ icon, label, description, onClick, accentColor }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative p-8 lg:p-10 rounded-[3rem] bg-white border border-slate-200 hover:border-slate-900 hover:shadow-2xl transition-all duration-700 flex flex-col items-center text-center overflow-hidden h-full justify-center"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-700 transform group-hover:rotate-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">{label}</h3>
      <p className="text-slate-600 text-xs font-bold leading-relaxed max-w-[200px]">{description}</p>
      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-[9px] font-black uppercase tracking-[0.3em] text-slate-900">
        Start Now →
      </div>
    </button>
  );
}

export default function CollectionPage() {
  const { slug } = useParams();
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState<"choose" | "text" | "video" | "success">("choose");
  const [form, setForm] = useState({ name: "", email: "", company: "", title: "", content: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [aiEnhancing, setAiEnhancing] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSpace() {
      try {
        const { data: spaceData, error: spaceErr } = await supabase
          .from("spaces")
          .select("id, name, slug, form_config, user_id")
          .eq("slug", slug)
          .single();
        if (spaceErr || !spaceData) { setNotFound(true); return; }
        const { data: profileData } = await supabase
          .from("profiles")
          .select("company_name, brand_color, logo_url, plan")
          .eq("user_id", spaceData.user_id)
          .single();
        setSpace({ ...spaceData, profiles: profileData });
      } catch { setNotFound(true); } finally { setLoading(false); }
    }
    if (slug) loadSpace();
  }, [slug]);

  const accentColor = space?.profiles?.brand_color || "#000000";
  const workspaceName = space?.profiles?.company_name || "Vouchy";

  const handleAiEnhance = async (style: string) => {
    if (!form.content.trim()) return;
    setAiEnhancing(style);
    try {
      const { data } = await supabase.functions.invoke("ai-processor", {
        body: { action: "enhance_text", text: form.content, style, spaceOwnerId: space.user_id },
      });
      if (data?.result) setForm(f => ({ ...f, content: data.result }));
    } catch (e) { toast({ title: "AI Error", variant: "destructive" }); } finally { setAiEnhancing(null); }
  };

  const submitText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return toast({ title: "Quick Check", description: "Confirm your feedback." });
    setSubmitting(true);
    try {
      const { error } = await supabase.from("testimonials").insert({
        space_id: space.id, user_id: space.user_id,
        author_name: form.name, author_email: form.email,
        author_company: form.company, author_title: form.title,
        content: form.content, rating: form.rating, type: "text",
      });
      if (error) throw error;
      setMode("success");
    } catch (err: any) { toast({ title: "Error", variant: "destructive" }); } finally { setSubmitting(false); }
  };

  if (loading) return null;
  if (notFound) return <div className="h-screen flex items-center justify-center font-black text-slate-200">SPACE NOT FOUND</div>;

  if (mode === "video") {
    return (
      <VideoRecorder
        spaceId={space!.id} spaceUserId={space!.user_id} accentColor={accentColor}
        workspaceName={workspaceName} logoUrl={space.profiles?.logo_url}
        questions={[]} onBack={() => setMode("choose")} onSuccess={() => setMode("success")}
      />
    );
  }
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-900 selection:text-white relative flex flex-col items-center">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-100/30 rounded-full blur-[120px]" />
      </div>

      {/* CONSOLIDATED 3-ROW HEADER */}
      <div className="w-full pt-12 pb-4 flex flex-col items-center relative z-10 shrink-0">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          {/* ROW 1: BRAND IDENTITY */}
          <div className="flex items-center justify-center">
            {space.profiles?.logo_url ? (
              <img 
                src={space.profiles.logo_url} 
                alt={workspaceName} 
                className="h-10 lg:h-12 w-auto object-contain drop-shadow-sm" 
              />
            ) : (
              <span className="text-lg font-black tracking-tighter uppercase text-slate-950 italic">{workspaceName}</span>
            )}
          </div>

          <div className="space-y-2">
            {/* ROW 2: PRIMARY ACTION */}
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-950">
              Share your <span className="text-slate-400">story.</span>
            </h1>

            {/* ROW 3: CONTEXT */}
            <p className="text-slate-500 font-bold text-sm lg:text-base tracking-tight">
              Tell us about your experience with <span className="text-slate-900">{workspaceName}</span>
            </p>
          </div>
        </motion.div>
      </div>

      <main className="w-full max-w-5xl flex-1 flex flex-col items-center justify-start px-6 py-2 relative z-10 min-h-0">
        <AnimatePresence mode="wait">

          {mode === "choose" && (
            <motion.div 
              key="choose" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.02 }} 
              className="w-full flex flex-col items-center justify-center text-center py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 w-full max-w-xl mx-auto items-stretch">
                <MethodCard accentColor={accentColor} icon={<Video className="w-8 h-8 md:w-9 md:h-9" />} label="Video" description="Record a quick, authentic message." onClick={() => setMode("video")} />
                <MethodCard accentColor={accentColor} icon={<MessageSquareText className="w-8 h-8 md:w-9 md:h-9" />} label="Writing" description="Classic, clear, and curated story." onClick={() => setMode("text")} />
              </div>
            </motion.div>
          )}

          {mode === "text" && (
            <motion.div 
              key="text" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full flex flex-col max-w-5xl h-full lg:max-h-[600px]"
            >
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setMode("choose")} className="group flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-950 transition-all">
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
                </button>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Step 2 of 2</span>
              </div>

              <form onSubmit={submitText} className="grid grid-cols-12 gap-4 lg:gap-8 items-stretch h-full">
                <div className="col-span-12 lg:col-span-12 xl:col-span-8 flex flex-col">
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 lg:p-8 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.02)] flex flex-col h-full group focus-within:border-slate-900 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6 shrink-0">
                      <h2 className="text-xl font-black tracking-tight text-slate-950">The Review</h2>
                      <div className="flex gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-100/50">
                        {[1, 2, 3, 4, 5].map(i => (
                          <button key={i} type="button" onClick={() => setForm({ ...form, rating: i })} className="p-0.5 transition-transform hover:scale-125">
                            <Star className="w-5 h-5" style={{ fill: form.rating >= i ? '#FFB800' : 'none', color: form.rating >= i ? '#FFB800' : '#E2E8F0' }} strokeWidth={2.5} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea 
                      required 
                      placeholder="What was your experience like? Be as detailed as you want..." 
                      className="w-full flex-1 bg-transparent outline-none resize-none text-lg lg:text-xl font-medium leading-relaxed placeholder:text-slate-300 text-slate-900 min-h-[150px] lg:min-h-0" 
                      value={form.content} 
                      onChange={(e) => setForm({ ...form, content: e.target.value })} 
                    />

                    <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-2 items-center shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest mr-0.5">
                        <Sparkles className="w-3 h-3" strokeWidth={3} /> AI Magic
                      </div>
                      {['Polish', 'Punchy', 'Professional'].map(style => (
                        <button key={style} type="button" onClick={() => handleAiEnhance(style.toLowerCase())} disabled={!!aiEnhancing || !form.content} className="px-5 py-2 rounded-full border border-slate-100 bg-white text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all">
                          {aiEnhancing === style.toLowerCase() ? "..." : style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-12 xl:col-span-4 flex flex-col gap-4">
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-6 lg:p-8 space-y-6 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.02)] flex-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950">About You</h3>
                    <div className="space-y-4">
                      <MinimalField label="Full Name" placeholder="Jane Doe" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} required />
                      <MinimalField label="Email Address" type="email" placeholder="jane@example.com" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} required />
                      <div className="grid grid-cols-2 gap-3">
                        <MinimalField label="Company" placeholder="Acme Inc." value={form.company} onChange={(e: any) => setForm({ ...form, company: e.target.value })} />
                        <MinimalField label="Role" placeholder="CEO" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
                      </div>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group pt-2">
                      <div className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${agreed ? 'bg-slate-950 border-slate-950' : 'bg-white border-slate-200'}`}>
                        {agreed && <Check className="w-3 h-3 text-white" strokeWidth={5} />}
                        <input type="checkbox" className="hidden" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-950 uppercase tracking-widest leading-relaxed">
                        I confirm this is honest.
                      </span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting || !agreed} 
                    className="group relative w-full h-16 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-20 shadow-xl shadow-slate-900/10 shrink-0"
                  >
                    {submitting ? "Sharing..." : "Post Review"}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {mode === "success" && (
            <motion.div 
              key="success" 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="text-center space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-slate-200">
                  <Check className="w-10 h-10" strokeWidth={6} />
                </div>
                <div className="absolute inset-0 bg-slate-900/10 blur-3xl rounded-full scale-125 -z-0" />
              </div>
              <div className="space-y-3">
                <h2 className="text-5xl lg:text-7xl font-black tracking-tightest leading-none">Thank you.</h2>
                <p className="text-slate-400 font-bold text-lg lg:text-xl">
                  Story for <span className="text-slate-900">{workspaceName}</span> received.
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 hover:text-slate-900 transition-all border-b border-transparent hover:border-slate-900 pb-1"
              >
                Share Another?
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="w-full flex justify-center py-8 shrink-0">
        <a 
          href="/" 
          className="flex items-center gap-3 transition-transform active:scale-95 cursor-pointer no-underline"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400/60 pb-0.5">Powered by</span>
          <div className="flex items-center gap-2.5">
            <img src="/logo-icon.svg" alt="" className="h-7 w-7 object-contain" />
            <span className="text-xl font-black tracking-tight text-slate-950">Vouchy</span>
          </div>
        </a>
      </footer>
    </div>
  );
}