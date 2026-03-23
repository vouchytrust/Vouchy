import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, MessageSquareText, Check, Send, Cpu, ChevronLeft, Sparkles, Quote } from "lucide-react";
import VideoRecorder from "@/components/collection/VideoRecorder";
import { fetchSpaceBySlug } from "@/lib/api";
import { VouchyLogo } from "@/components/VouchyLogo";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadToR2 } from "@/lib/storage";
import { PublicFooter } from "@/components/shared/PublicFooter";

/** * UI COMPONENT: Precision Field
 * High-impact but vertically compact.
 */
function MinimalField({ label, ...props }: any) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
      <input
        {...props}
        className="w-full h-11 px-4 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 transition-all duration-300 font-semibold placeholder:text-slate-300 shadow-sm"
        style={{ '--focus-ring': `${props.accentColor || '#000'}22` } as any}
        onFocus={(e) => e.target.style.borderColor = props.accentColor || '#000'}
        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
      />
    </div>
  );
}

/** * UI COMPONENT: Responsive Method Card
 * Tactile and bold, scales to fit.
 */
function MethodCard({ icon, label, description, onClick, accentColor, disabled }: any) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`group relative p-8 lg:p-10 rounded-[3rem] bg-white border flex flex-col items-center text-center overflow-hidden h-full justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed border-slate-100 grayscale' : 'border-slate-200 hover:border-slate-900 hover:shadow-2xl transition-all duration-700'}
      `}
    >
      <div
        className={`absolute inset-0 opacity-0 ${disabled ? '' : 'group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none'}`}
        style={{ backgroundColor: disabled ? 'transparent' : accentColor }}
      />
      <div 
        className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-slate-400 shadow-sm ${disabled ? '' : 'group-hover:text-white transition-all duration-700 transform group-hover:rotate-6'}`}
      >
        <div className={`absolute inset-0 rounded-2xl opacity-0 ${disabled ? '' : 'group-hover:opacity-100 transition-opacity duration-700'}`} style={{ backgroundColor: disabled ? 'transparent' : accentColor }} />
        <div className="relative z-10">{icon}</div>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">{label}</h3>
      <p className="text-slate-600 text-xs font-bold leading-relaxed max-w-[200px]">{description}</p>
      
      {!disabled && (
        <div 
          className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-[9px] font-black uppercase tracking-[0.3em]"
          style={{ color: accentColor }}
        >
          Start Now →
        </div>
      )}
    </button>
  );
}

export default function CollectionPage() {
  const { slug } = useParams();
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState<"choose" | "text" | "video" | "success" | "limit_reached">("choose");
  const [form, setForm] = useState({ name: "", email: "", company: "", title: "", content: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [aiEnhancing, setAiEnhancing] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const [videoLimitReached, setVideoLimitReached] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userIp, setUserIp] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data?.user));
    fetch("https://api64.ipify.org?format=json").then(r => r.json()).then(d => setUserIp(d.ip)).catch(() => {});

    async function loadSpace() {
      try {
        const { data: spaceData, error: spaceErr } = await supabase
          .from("spaces")
          .select("id, name, slug, form_config, user_id")
          .eq("slug", slug)
          .single();
        if (spaceErr || !spaceData) { setNotFound(true); return; }
        const { data: profileData } = await supabase
          .from("profile_branding")
          .select("company_name, brand_color, logo_url, plan")
          .eq("user_id", spaceData.user_id)
          .single();
          
        let limitHit = false;
        let vLimitHit = false;
        const plan = profileData?.plan?.toLowerCase() || 'free';
        
        if (plan === 'free') {
          const { count } = await supabase
            .from("testimonials")
            .select("*", { count: "exact", head: true })
            .eq("user_id", spaceData.user_id)
            .eq("type", "text");
          if (count !== null && count >= 50) {
            limitHit = true;
          }
        } else {
          const { count } = await supabase
            .from("testimonials")
            .select("*", { count: "exact", head: true })
            .eq("user_id", spaceData.user_id)
            .eq("type", "video");
            
          const maxVideos = plan === 'agency' ? 1000 : 500;
          if (count !== null && count >= maxVideos) {
            vLimitHit = true;
          }
        }
        
        setSpace({ ...spaceData, profiles: profileData });
        if (limitHit) {
          setMode("limit_reached");
        }
        setVideoLimitReached(vLimitHit);
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
      const isFounderIp = userIp === '196.189.29.192' || userIp === '::1' || userIp === '127.0.0.1' || !userIp;
      
      console.log("[SUBMIT-DEBUG-TEXT] User IP:", userIp, "Auth User ID:", currentUser?.id, "Space Owner:", space.user_id, "isFounderIp:", isFounderIp);

      if (currentUser?.id === space.user_id && !isFounderIp) {
        throw new Error("Founders cannot submit reviews for their own space. Use this page for your customers!");
      }

      if (userIp && !isFounderIp) {
        const { count: ipCount } = await supabase
          .from("testimonials")
          .select("*", { count: "exact", head: true })
          .eq("space_id", space.id)
          .eq("ip_address", userIp);
          
        if (ipCount !== null && ipCount >= 3) {
          throw new Error("Maximum review limit reached for this connection (3 reviews max).");
        }
      }

      const planLower = space.profiles?.plan?.toLowerCase() || 'free';
      if (planLower === 'free') {
        const { count } = await supabase
          .from("testimonials")
          .select("*", { count: "exact", head: true })
          .eq("user_id", space.user_id)
          .eq("type", "text");
          
        if (count !== null && count >= 50) {
          throw new Error("This space has reached the maximum of 50 text reviews for the free tier.");
        }
      }

      let avatarUrl = null;
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `avatars/${space.id}/${Date.now()}.${ext}`;
        avatarUrl = await uploadToR2(avatarFile, path);
      }

      const { error } = await supabase.from("testimonials").insert({
        space_id: space.id, user_id: space.user_id,
        author_name: form.name, author_email: form.email,
        author_company: form.company, author_title: form.title,
        author_avatar_url: avatarUrl,
        content: form.content, rating: form.rating, type: "text",
        status: "pending",
        ip_address: userIp,
      });
      if (error) throw error;
      setMode("success");
    } catch (err: any) { toast({ title: "Error", variant: "destructive", description: err.message }); } finally { setSubmitting(false); }
  };

  if (loading) return null;
  if (notFound) return <div className="h-screen flex items-center justify-center font-black text-slate-200">SPACE NOT FOUND</div>;

  if (mode === "video") {
    return (
      <VideoRecorder
        spaceId={space!.id} spaceUserId={space!.user_id} accentColor={accentColor}
        workspaceName={workspaceName} logoUrl={null}
        questions={[]} onBack={() => setMode("choose")} onSuccess={() => setMode("success")}
        plan={space.profiles?.plan}
      />
    );
  }
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-900 selection:text-white relative flex flex-col items-center">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Brand Orbs */}
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-[0.08]" 
          style={{ backgroundColor: accentColor }}
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-[0.05]" 
          style={{ backgroundColor: accentColor }}
        />
        <div className="absolute inset-0 bg-slate-100/10 pointer-events-none" />
      </div>

      {/* TOP ACCENT BAR */}
      <div 
        className="w-full h-1.5 shrink-0 relative z-50 shadow-sm"
        style={{ backgroundColor: accentColor }}
      />



      <main className="w-full max-w-5xl flex-1 flex flex-col items-center justify-start px-6 pt-12 pb-12 relative z-10 min-h-0">
        <AnimatePresence mode="wait">

          {mode === "choose" && (
            <motion.div 
              key="choose" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.02 }} 
              className="w-full flex flex-col items-center justify-center text-center py-4"
            >
              <div className="mb-10 space-y-6">
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
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-slate-950 leading-[0.9]">
                    Share your <span style={{ color: accentColor }}>story.</span>
                  </h1>
                  <p className="text-slate-500 font-bold text-sm lg:text-base tracking-tight">
                    Tell us about your experience with <span className="font-black" style={{ color: accentColor }}>{workspaceName}</span>
                  </p>
                </div>
              </div>
              <div className={`grid grid-cols-1 ${space.profiles?.plan !== 'free' ? 'md:grid-cols-2' : 'max-w-xs'} gap-3 lg:gap-4 w-full max-w-xl mx-auto items-stretch justify-center`}>
                {space.profiles?.plan !== 'free' && (
                  <MethodCard 
                    accentColor={accentColor} 
                    icon={<Video className="w-8 h-8 md:w-9 md:h-9" />} 
                    label="Video" 
                    description={videoLimitReached ? "Storage limit reached for this account." : "Record a quick, authentic message."} 
                    onClick={() => setMode("video")} 
                    disabled={videoLimitReached}
                  />
                )}
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
                    <div className="flex items-center justify-end mb-6 shrink-0">
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

                    {space.profiles?.plan !== 'free' && (
                      <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-2 items-center shrink-0">
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[8px] font-black uppercase tracking-widest mr-0.5"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Sparkles className="w-3 h-3" strokeWidth={3} /> AI Magic
                      </div>
                        {['Polish', 'Punchy', 'Professional'].map(style => (
                          <button key={style} type="button" onClick={() => handleAiEnhance(style.toLowerCase())} disabled={!!aiEnhancing || !form.content} className="px-5 py-2 rounded-full border border-slate-100 bg-white text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all">
                            {aiEnhancing === style.toLowerCase() ? "..." : style}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-12 xl:col-span-4 flex flex-col gap-4">
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-6 lg:p-8 space-y-6 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.02)] flex-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950">About You</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border-2 border-slate-100/50 shadow-sm shrink-0 hover:border-slate-300 transition-colors">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <span className="text-[8px] uppercase font-black tracking-widest leading-none mt-1">Photo</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setAvatarFile(file);
                              const reader = new FileReader();
                              reader.onload = () => setAvatarPreview(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Photo / Logo</p>
                          <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Optional. Helps build trust.</p>
                        </div>
                      </div>

                      <MinimalField label="Full Name" placeholder="Jane Doe" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} required accentColor={accentColor} />
                      <MinimalField label="Email Address" type="email" placeholder="jane@example.com" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} required accentColor={accentColor} />
                      <div className="grid grid-cols-2 gap-3">
                        <MinimalField label="Company" placeholder="Acme Inc." value={form.company} onChange={(e: any) => setForm({ ...form, company: e.target.value })} accentColor={accentColor} />
                        <MinimalField label="Role" placeholder="CEO" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} accentColor={accentColor} />
                      </div>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group pt-2">
                      <div 
                        className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${agreed ? 'border-transparent' : 'bg-white border-slate-200'}`}
                        style={{ backgroundColor: agreed ? accentColor : 'white' }}
                      >
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
                    className="group relative w-full h-14 lg:h-16 text-white rounded-[1.2rem] lg:rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.4em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-20 shadow-xl shrink-0 px-4"
                    style={{ backgroundColor: accentColor, boxShadow: `0 20px 40px -12px ${accentColor}33` }}
                  >
                    <span className="truncate">
                      {submitting ? "Sharing..." : "Post Review"}
                    </span>
                    <Send className="w-3.5 h-3.5 shrink-0" />
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
                <div 
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2.5rem] flex items-center justify-center mx-auto text-white shadow-xl transition-all duration-500"
                  style={{ backgroundColor: accentColor, boxShadow: `0 32px 64px -16px ${accentColor}66` }}
                >
                  <Check className="w-8 h-8 lg:w-10 lg:h-10" strokeWidth={6} />
                </div>
                <div className="absolute inset-0 blur-3xl rounded-full scale-150 -z-10" style={{ backgroundColor: `${accentColor}15` }} />
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

          {mode === "limit_reached" && (
            <motion.div 
              key="limit" 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="text-center space-y-8"
            >
              <div className="relative">
                <div 
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-400 shadow-xl transition-all duration-500 bg-slate-100"
                >
                  <MessageSquareText className="w-8 h-8 lg:w-10 lg:h-10" strokeWidth={2.5} />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-5xl lg:text-7xl font-black tracking-tightest leading-none">Limit Reached.</h2>
                <p className="text-slate-400 font-bold text-lg lg:text-xl">
                  {workspaceName} has reached their maximum number of text reviews.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      {/* Vouchy Public Footer */}
      <PublicFooter theme="light" plan={space?.profiles?.plan || "free"} />
    </div>
  );
}