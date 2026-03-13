import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Play, Square, RotateCcw, Sparkles, RotateCw, Maximize2, Type, Zap, X, Send, Check, Quote } from "lucide-react";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import { supabase } from "@/integrations/supabase/client";
import { uploadToR2 } from "@/lib/storage";

interface Props {
  spaceId: string; spaceUserId: string; accentColor: string;
  workspaceName: string; logoUrl?: string | null; spaceName?: string;
  questions: string[]; onBack: () => void; onSuccess: () => void;
}

export default function VideoRecorder({ spaceId, spaceUserId, accentColor, workspaceName, logoUrl, questions, onBack, onSuccess }: Props) {
  const recorder = useVideoRecorder(120);
  const [form, setForm] = useState({ name: "", email: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [script, setScript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showScriptMobile, setShowScriptMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<"script" | "settings">("script");

  const [tSpeed, setTSpeed] = useState(4);
  const [tSize, setTSize] = useState(24);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number | null>(null);

  const MAX_AI = 5;
  const aiCallsLeft = Math.max(0, MAX_AI - parseInt(sessionStorage.getItem(`v_ai_${spaceId}`) || "0"));

  const trackAI = () => {
    const k = `v_ai_${spaceId}`;
    sessionStorage.setItem(k, String(parseInt(sessionStorage.getItem(k) || "0") + 1));
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pct = Math.min(100, (recorder.elapsed / recorder.maxDurationSec) * 100);
  const isLive = ["previewing", "countdown", "recording"].includes(recorder.state);
  const isReview = recorder.state === "review";
  const showHUD = (recorder.state === "recording" || recorder.state === "previewing");

  const fallback = questions.length > 0
    ? questions.join("\n\n")
    : "Share how this helped you.\n\nWhat results did you see?\n\nWho would you recommend this to?";
  const displayScript = script.trim() || fallback;

  useEffect(() => {
    if (recorder.state === "recording") {
      scrollTimer.current = window.setInterval(() => {
        if (scrollRef.current) scrollRef.current.scrollTop += tSpeed * 0.4;
      }, 50);
    }
    return () => { if (scrollTimer.current) window.clearInterval(scrollTimer.current); };
  }, [recorder.state, tSpeed]);

  const callAI = async (action: string, extra: Record<string, unknown>) => {
    const res = await supabase.functions.invoke("ai-processor", { body: { action, spaceOwnerId: spaceUserId, ...extra } });
    if (res.error) throw new Error(res.error.message);
    if (res.data?.error) throw new Error(res.data.error);
    return res.data.result as string;
  };

  const generateScript = async () => {
    if (!script.trim()) return;
    if (aiCallsLeft <= 0) { setAiError(`AI limit reached.`); return; }
    setGenerating(true); setAiError(null);
    try { setScript(await callAI("generate_script", { mainIdea: script })); trackAI(); }
    catch (e: any) { setAiError(e.message); }
    finally { setGenerating(false); }
  };

  const enhanceScript = async (style: string) => {
    if (!script.trim()) return;
    if (aiCallsLeft <= 0) { setAiError(`AI limit reached.`); return; }
    setEnhancing(style); setAiError(null);
    try { setScript(await callAI("enhance_text", { text: script, style })); trackAI(); }
    catch (e: any) { setAiError(e.message); }
    finally { setEnhancing(null); }
  };

  const handleSubmit = async () => {
    console.log("[SUBMIT] Button clicked. Blob:", !!recorder.videoBlob, "Name:", form.name);
    if (!recorder.videoBlob || !form.name.trim()) return;
    setSubmitting(true); setSubmitError(null);
    try {
      let avatarUrl = null;
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `avatars/${spaceId}/${Date.now()}.${ext}`;
        avatarUrl = await uploadToR2(avatarFile, path);
      }

      // Ensure we have a valid mime type for R2
      // Ensure we have a valid mime type for R2
      const videoExt = 'webm';
      const fileName = `videos/${spaceId}/${Date.now()}.${videoExt}`;
      const videoFile = new File([recorder.videoBlob], `video.${videoExt}`, { type: 'video/webm' });
      
      console.log(`[SUBMIT] Uploading video to R2: ${fileName}`);
      
      // 2. Upload to Cloudflare R2
      const publicUrl = await uploadToR2(videoFile, fileName);
      console.log(`[SUBMIT] Video Uploaded successfully. URL: ${publicUrl}`);
      
      // 3. Submit to database with correct columns
      const { error: dbError } = await supabase.from("testimonials").insert({
        space_id: spaceId,
        user_id: spaceUserId,
        author_name: form.name,
        author_email: form.email || null,
        content: "(Video Testimonial)",
        author_avatar_url: avatarUrl,
        rating: 5,
        type: "video",
        video_url: publicUrl,
        video_duration: fmt(recorder.elapsed),
      });

      if (dbError) throw dbError;

      recorder.reset(); 
      onSuccess();
    } catch (e: any) { 
      console.error("[SUBMIT-ERROR]", e);
      setSubmitError(e.message || "Upload failed. Please try again."); 
    }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#FAFAFA] z-[100] overflow-hidden overscroll-none" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── MOBILE HEADER (Hidden on Desktop) ── */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-slate-100/50 sticky top-0 z-[110] shrink-0 h-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"><ArrowLeft className="h-5 w-5" /></button>
        <div className="flex-1 flex justify-center px-4">
          <div className="bg-white/50 border border-white shadow-sm rounded-full px-4 py-1.5 flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={workspaceName} className="h-3.5 w-auto object-contain grayscale opacity-60" />
            ) : (
              <span className="font-black text-slate-300 text-[9px] tracking-[0.2em] uppercase">{workspaceName}</span>
            )}
            <div className="w-[1px] h-2.5 bg-slate-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
        <button 
          onClick={() => setShowScriptMobile(!showScriptMobile)} 
          className={`flex items-center gap-2.5 px-4 h-12 rounded-2xl transition-all duration-500 ${showScriptMobile ? 'bg-slate-900 text-white shadow-xl shadow-slate-950/20' : 'text-slate-600 bg-slate-100/50 hover:bg-slate-100 border border-slate-200/50'}`}
        >
          {showScriptMobile ? (
            <X className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {showScriptMobile ? 'Hide' : 'Script'}
          </span>
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative h-full">

        {/* ── SIDEBAR / DRAWER ── */}
        <div className={`
          absolute lg:relative inset-x-0 bottom-0 lg:bottom-auto z-50 lg:z-10 bg-white border-t lg:border-t-0 lg:border-r border-slate-100 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${showScriptMobile ? 'h-[75vh] lg:h-auto lg:w-[380px] rounded-t-[2.5rem] lg:rounded-none shadow-2xl lg:shadow-none' : 'h-0 lg:h-auto lg:w-[380px] overflow-hidden'}
        `}>

          <div className="hidden lg:flex items-center justify-between p-8 border-b border-slate-50">
            <button onClick={onBack} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-[0.3em] group">
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              <span>Exit Studio</span>
            </button>
            {logoUrl && <img src={logoUrl} alt={workspaceName} className="h-3.5 w-auto grayscale opacity-20" />}
          </div>

          <div className="flex-1 flex flex-col min-h-0 p-6 lg:p-8">
            <div className="flex bg-slate-50 p-1 rounded-xl mb-8">
              <button onClick={() => setActiveTab("script")} className={`flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'script' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Prompter</button>
              <button onClick={() => setActiveTab("settings")} className={`flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'settings' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Settings</button>
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
              {activeTab === 'script' ? (
                <div className="flex-1 flex flex-col min-h-0 space-y-6">
                  <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest">
                      <Sparkles className="h-2 w-2" /> {aiCallsLeft} / {MAX_AI}
                    </div>
                    {script.length > 5 && (
                      <div className="flex gap-4">
                        {['Punchy', 'Natural'].map(st => (
                          <button key={st} onClick={() => enhanceScript(st.toLowerCase())} disabled={!!enhancing} className="text-[9px] font-black text-slate-900/40 hover:text-slate-900 uppercase tracking-widest border-b border-transparent hover:border-slate-900 pb-0.5 transition-all outline-none">
                            {enhancing === st.toLowerCase() ? '...' : st}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm relative group overflow-hidden flex flex-col focus-within:border-slate-900 transition-all duration-500 min-h-[250px] lg:min-h-0">
                    <textarea value={script} onChange={e => setScript(e.target.value)} className="relative z-10 w-full flex-1 p-0 text-lg font-medium text-slate-900 bg-transparent border-none outline-none resize-none no-scrollbar placeholder:text-slate-200 leading-relaxed pt-2" placeholder="Write ideas here..." />
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10 shrink-0">
                      <p className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">AI Suite</p>
                      <button onClick={() => generateScript()} disabled={generating || !script.trim()} className="h-10 px-5 bg-slate-950 text-white rounded-lg shadow-lg hover:scale-105 active:scale-95 disabled:opacity-20 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        {generating ? <RotateCw className="h-3 w-3 animate-spin text-emerald-400" /> : <><Sparkles className="h-3 w-3 text-emerald-400" /> Magic</>}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-10 py-4 px-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Speed</label>
                      <span className="text-slate-950 font-black text-[10px] tracking-widest bg-slate-50 px-2 py-1 rounded-md">{tSpeed}x</span>
                    </div>
                    <input type="range" min={1} max={10} value={tSpeed} onChange={e => setTSpeed(+e.target.value)} className="w-full h-1 bg-slate-100 rounded-full appearance-none accent-slate-900 cursor-pointer" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Font</label>
                      <span className="text-slate-950 font-black text-[10px] tracking-widest bg-slate-50 px-2 py-1 rounded-md">{tSize}px</span>
                    </div>
                    <input type="range" min={18} max={64} value={tSize} onChange={e => setTSize(+e.target.value)} className="w-full h-1 bg-slate-100 rounded-full appearance-none accent-slate-900 cursor-pointer" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── VIEWPORT ── */}
        <div className="flex-1 flex flex-col relative min-h-0 bg-[#f8f9fa] p-4 lg:p-8 items-center justify-center">

          <div className="relative w-full aspect-[4/5] lg:aspect-video lg:max-h-[65vh] max-w-5xl rounded-[32px] lg:rounded-[48px] overflow-hidden bg-slate-950 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.5)] lg:ring-[12px] ring-white">
            <video ref={recorder.previewRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" style={{ transform: "scaleX(-1)", display: isLive ? "block" : "none" }} />
            {isReview && recorder.videoUrl && <video src={recorder.videoUrl} controls className="absolute inset-0 w-full h-full object-cover" />}

            <AnimatePresence>
              {showHUD && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex flex-col pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.6) 100%)' }}>
                  <div className="flex items-center justify-between p-6 lg:p-10 shrink-0">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl px-4 py-2 rounded-xl border border-white/10">
                      <div className={`w-2 h-2 rounded-full ${recorder.state === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{recorder.state === 'recording' ? 'Live' : 'Ready'}</span>
                      {recorder.state === 'recording' && <span className="text-sm font-mono font-black text-white pl-4 border-l border-white/10 ml-3">{fmt(recorder.elapsed)}</span>}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-start pt-8 lg:pt-16 px-8 md:px-16 lg:px-32">
                    <div ref={scrollRef} className="max-h-[50%] lg:max-h-[300px] overflow-hidden text-center">
                      <p className="text-white font-black leading-[1.3] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" style={{ fontSize: tSize }}>
                        {displayScript}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {recorder.state === "countdown" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-2xl z-40 flex items-center justify-center">
                  <motion.div key={recorder.countdown} initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 3, opacity: 0 }} transition={{ type: "spring", damping: 12 }} className="text-[35vw] font-black text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.4)]">{recorder.countdown}</motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {recorder.state === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
                <div className="w-20 lg:w-24 h-20 lg:h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-10 backdrop-blur-md shadow-2xl">
                  <Maximize2 className="h-8 lg:h-10 w-8 lg:w-10 text-white/20" />
                </div>
                <p className="text-white/20 text-[10px] lg:text-[12px] font-black uppercase tracking-[0.8em]">Recording Studio</p>
              </div>
            )}
          </div>

          <div className="mt-10 shrink-0 flex items-center justify-center w-full px-6">
            <div className="bg-white border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-3 flex items-center gap-4 lg:gap-6 lg:ring-[12px] ring-slate-100/40">
              {recorder.state === "idle" && (
                <button onClick={recorder.startPreview} className="h-14 lg:h-18 px-10 lg:px-14 flex items-center gap-3 rounded-[1.5rem] bg-slate-950 text-white font-black text-[11px] lg:text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.03] active:scale-[0.97] shadow-2xl shadow-slate-950/20">
                  <Mic className="h-5 lg:h-6 w-5 lg:w-6 text-emerald-400" />
                  Activate Studio
                </button>
              )}
              {recorder.state === "previewing" && (
                <button onClick={recorder.startCountdown} className="h-14 lg:h-18 px-12 lg:px-16 flex items-center gap-3 rounded-[1.5rem] text-white font-black text-[11px] lg:text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.05] active:scale-[0.95] shadow-2xl" style={{ background: accentColor }}>
                  <Play className="h-5 lg:h-6 w-5 lg:w-6 fill-current" />
                  Take Video
                </button>
              )}
              {recorder.state === "recording" && (
                <button onClick={recorder.stopRecording} className="h-14 lg:h-18 px-12 lg:px-16 flex items-center gap-3 rounded-[1.5rem] bg-red-600 text-white font-black text-[11px] lg:text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.05] active:scale-[0.95] shadow-2xl shadow-red-600/20 animate-pulse">
                  <Square className="h-5 lg:h-6 w-5 lg:w-6 fill-current" />
                  Stop Recording
                </button>
              )}
              {(isReview || recorder.state === "previewing") && (
                <button onClick={recorder.retake} className="w-14 lg:w-18 h-14 lg:h-18 flex items-center justify-center rounded-[1.5rem] border border-slate-100 bg-white text-slate-400 hover:text-slate-950 transition-all shadow-sm" title="Retake">
                  <RotateCcw className="h-5 lg:h-6 w-5 lg:w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isReview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] w-full max-w-xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[80px] pointer-events-none" />
              
              <button onClick={() => recorder.retake()} className="absolute top-10 right-10 text-slate-300 hover:text-slate-950 transition-colors z-10"><X className="h-7 w-7" /></button>
              
              <div className="flex items-center gap-5 mb-12 relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 flex items-center justify-center text-white shadow-2xl"><Send className="h-7 w-7" /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight">Final Details</h3>
                  <p className="text-slate-400 text-sm font-medium">Add your credentials to finish.</p>
                </div>
              </div>

              <div className="space-y-6 mb-12 relative z-10 w-full overflow-y-auto max-h-[40vh] pr-2 no-scrollbar">
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

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Your Full Name</label>
                  <input placeholder="Jane Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-50 outline-none focus:ring-4 ring-slate-900/5 focus:bg-white transition-all text-sm font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Email (Optional)</label>
                  <input placeholder="jane@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-50 outline-none focus:ring-4 ring-slate-900/5 focus:bg-white transition-all text-sm font-bold" />
                </div>
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                {submitError && (
                  <div className="p-3 mb-2 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold text-center">
                    {submitError}
                  </div>
                )}
                <button 
                  onClick={handleSubmit} 
                  disabled={submitting || !form.name.trim()} 
                  className="group w-full h-20 rounded-[1.5rem] text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-4" 
                  style={{ background: accentColor }}
                >
                  {submitting ? 'Sharing story...' : <><Check className="h-5 w-5" /> Post Recommendation</>}
                </button>
                <button onClick={() => recorder.retake()} className="w-full h-14 rounded-2xl text-slate-300 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] transition-all">Not happy? Retake</button>
              </div>

              {/* TRUST BADGE */}
              <div className="mt-8 flex items-center justify-center gap-3 opacity-30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Securely processed by Vouchy Studios</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
