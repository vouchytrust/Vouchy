import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Play, Square, RotateCcw, Sparkles, RotateCw, Maximize2, Type, Zap, X, Send, Check } from "lucide-react";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  spaceId: string; spaceUserId: string; accentColor: string;
  workspaceName: string; logoUrl?: string | null; spaceName?: string;
  questions: string[]; onBack: () => void; onSuccess: () => void;
}

export default function VideoRecorder({ spaceId, spaceUserId, accentColor, workspaceName, logoUrl, questions, onBack, onSuccess }: Props) {
  const recorder = useVideoRecorder(120);
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [scriptIdea, setScriptIdea] = useState("");
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
    if (!scriptIdea.trim()) return;
    if (aiCallsLeft <= 0) { setAiError(`AI limit reached.`); return; }
    setGenerating(true); setAiError(null);
    try { setScript(await callAI("generate_script", { mainIdea: scriptIdea })); trackAI(); }
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
    if (!recorder.videoBlob || !form.name.trim()) return;
    setSubmitting(true); setSubmitError(null);
    try {
      const fileName = `${spaceId}/${Date.now()}.webm`;
      const { error: upErr } = await supabase.storage.from("videos").upload(fileName, recorder.videoBlob!, { contentType: "video/webm" });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("videos").getPublicUrl(fileName);
      await supabase.from("testimonials").insert({
        space_id: spaceId, user_id: spaceUserId, author_name: form.name,
        author_email: form.email || null, content: "(video testimonial)",
        rating: 5, type: "video", video_url: urlData.publicUrl, video_duration: fmt(recorder.elapsed),
      });
      recorder.reset(); onSuccess();
    } catch (e: any) { setSubmitError(e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#fafafa] z-[100] overflow-hidden overscroll-none" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── MOBILE HEADER (Hidden on Desktop) ── */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900"><ArrowLeft className="h-5 w-5" /></button>
        {logoUrl ? <img src={logoUrl} alt={workspaceName} className="h-4 w-auto opacity-40" /> : <span className="font-bold text-slate-300 text-xs tracking-widest">{workspaceName}</span>}
        <button onClick={() => setShowScriptMobile(!showScriptMobile)} className={`p-2 rounded-xl transition-all ${showScriptMobile ? 'bg-slate-900 text-white' : 'text-slate-400'}`}><Type className="h-5 w-5" /></button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">

        {/* ── SIDEBAR / DRAWER ── */}
        <div className={`
          absolute lg:relative inset-x-0 bottom-0 lg:bottom-auto z-50 lg:z-10 bg-white border-t lg:border-t-0 lg:border-r border-slate-100 flex flex-col transition-all duration-300 ease-in-out
          ${showScriptMobile ? 'h-[75vh] lg:h-auto lg:w-[380px]' : 'h-0 lg:h-auto lg:w-[380px] overflow-hidden'}
        `}>

          <div className="hidden lg:flex items-center justify-between p-8 border-b border-slate-50">
            <button onClick={onBack} className="flex items-center gap-2.5 text-slate-400 hover:text-slate-900 transition-colors text-[10px] font-bold uppercase tracking-widest">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Exit Studio</span>
            </button>
            {logoUrl && <img src={logoUrl} alt={workspaceName} className="h-4 w-auto opacity-30" />}
          </div>

          <div className="flex-1 flex flex-col min-h-0 p-6 lg:p-8">
            <div className="flex bg-slate-50 p-1 rounded-2xl mb-8">
              <button onClick={() => setActiveTab("script")} className={`flex-1 h-10 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'script' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Script</button>
              <button onClick={() => setActiveTab("settings")} className={`flex-1 h-10 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Setup</button>
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
              {activeTab === 'script' ? (
                <div className="space-y-6 flex-1 flex flex-col min-h-0">
                  <div className="space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Idea</label>
                      <span className="text-[9px] font-bold text-indigo-400 flex items-center gap-1"><Zap className="h-2.5 w-2.5 fill-current" /> {aiCallsLeft} AI</span>
                    </div>
                    <div className="relative group">
                      <textarea placeholder="e.g. ROI improved by 20%..." value={scriptIdea} onChange={e => setScriptIdea(e.target.value)} className="w-full h-24 p-4 text-[13px] bg-slate-50 border-none rounded-2xl outline-none placeholder:text-slate-300 resize-none transition-all focus:bg-white focus:ring-1 ring-slate-100 font-medium" />
                      <button onClick={generateScript} disabled={generating || !scriptIdea.trim()} className="absolute bottom-3 right-3 p-2 bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 disabled:opacity-20 transition-all">
                        {generating ? <RotateCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 flex flex-col min-h-0 relative">
                    <div className="flex items-center justify-between shrink-0">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prompter</label>
                      {script.length > 5 && (
                        <div className="flex gap-2.5">
                          {['Natural', 'Concise'].map(st => (
                            <button key={st} onClick={() => enhanceScript(st.toLowerCase())} disabled={!!enhancing} className="text-[9px] font-bold text-indigo-500/50 hover:text-indigo-500 uppercase tracking-widest border-b border-transparent hover:border-indigo-500/50 pb-0.5">
                              {enhancing === st.toLowerCase() ? '...' : st}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <textarea value={script} onChange={e => setScript(e.target.value)} className="flex-1 w-full p-0 text-[15px] font-medium text-slate-900 border-none outline-none resize-none no-scrollbar placeholder:text-slate-100" placeholder="Paste your script here..." />
                  </div>
                </div>
              ) : (
                <div className="space-y-10 py-4">
                  <div className="space-y-5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scroll Pace</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min={1} max={10} value={tSpeed} onChange={e => setTSpeed(+e.target.value)} className="flex-1 h-1 bg-slate-100 rounded-full appearance-none accent-slate-900 cursor-pointer" />
                      <span className="text-slate-950 font-mono font-bold w-12 text-right text-xs">{tSpeed}x</span>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Font Size</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min={18} max={48} value={tSize} onChange={e => setTSize(+e.target.value)} className="flex-1 h-1 bg-slate-100 rounded-full appearance-none accent-slate-900 cursor-pointer" />
                      <span className="text-slate-950 font-mono font-bold w-12 text-right text-xs">{tSize}px</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── VIEWPORT ── */}
        <div className="flex-1 flex flex-col relative min-h-0 bg-[#f8f9fa] p-4 lg:p-12 items-center justify-center">

          <div className="relative w-full aspect-[3/4] lg:aspect-video lg:h-[70vh] max-w-6xl rounded-[32px] lg:rounded-[48px] overflow-hidden bg-slate-950 shadow-2xl lg:ring-[12px] ring-white">
            <video ref={recorder.previewRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" style={{ transform: "scaleX(-1)", display: isLive ? "block" : "none" }} />
            {isReview && recorder.videoUrl && <video src={recorder.videoUrl} controls className="absolute inset-0 w-full h-full object-cover" />}

            <AnimatePresence>
              {showHUD && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex flex-col pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.5) 100%)' }}>
                  <div className="flex items-center justify-between p-6 lg:p-10 shrink-0">
                    <div className="flex items-center gap-2 lg:gap-3 bg-black/40 backdrop-blur-xl px-4 lg:px-5 py-2 lg:py-2.5 rounded-full border border-white/10">
                      <div className={`w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full ${recorder.state === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
                      <span className="text-[9px] lg:text-[11px] font-bold text-white uppercase tracking-widest">{recorder.state === 'recording' ? 'Recording' : 'Ready'}</span>
                      {recorder.state === 'recording' && <span className="text-xs lg:text-[14px] font-mono font-bold text-white pl-3 lg:pl-4 border-l border-white/10 ml-2">{fmt(recorder.elapsed)}</span>}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-start pt-8 lg:pt-16 px-10 lg:px-40">
                    <div ref={scrollRef} className="max-h-[50%] lg:max-h-[300px] overflow-hidden text-center">
                      <p className="text-white font-bold leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ fontSize: tSize }}>
                        {displayScript}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {recorder.state === "countdown" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-xl z-40 flex items-center justify-center">
                  <motion.div key={recorder.countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 2, opacity: 0 }} className="text-[25vw] font-black text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.3)]">{recorder.countdown}</motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {recorder.state === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-2xl lg:rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-6 lg:mb-8 backdrop-blur-md">
                  <Maximize2 className="h-6 lg:h-8 w-6 lg:w-8 text-white/30" />
                </div>
                <p className="text-white/30 text-[9px] lg:text-[11px] font-bold uppercase tracking-[0.4em] lg:tracking-[0.6em]">Studio Active</p>
              </div>
            )}
          </div>

          <div className="mt-8 shrink-0 flex items-center justify-center w-full px-4">
            <div className="bg-white border border-slate-100 shadow-xl rounded-2xl lg:rounded-[32px] p-2 flex items-center gap-3 lg:gap-4 lg:ring-8 ring-slate-100/30">
              {recorder.state === "idle" && (
                <button onClick={recorder.startPreview} className="h-12 lg:h-14 px-8 lg:px-10 flex items-center gap-2.5 rounded-xl lg:rounded-[20px] bg-slate-950 text-white font-bold text-xs lg:text-sm transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg">
                  <Mic className="h-4 lg:h-5 w-4 lg:w-5 text-emerald-400" />
                  Activate Studio
                </button>
              )}
              {recorder.state === "previewing" && (
                <button onClick={recorder.startCountdown} className="h-12 lg:h-14 px-10 lg:px-12 flex items-center gap-2.5 rounded-xl lg:rounded-[20px] text-white font-bold text-xs lg:text-sm transition-all hover:scale-[1.05] active:scale-[0.95] shadow-lg" style={{ background: accentColor }}>
                  <Play className="h-4 lg:h-5 w-4 lg:w-5 fill-current" />
                  Start
                </button>
              )}
              {recorder.state === "recording" && (
                <button onClick={recorder.stopRecording} className="h-12 lg:h-14 px-10 lg:px-12 flex items-center gap-2.5 rounded-xl lg:rounded-[20px] bg-red-600 text-white font-bold text-xs lg:text-sm transition-all hover:scale-[1.05] active:scale-[0.95] shadow-lg animate-pulse">
                  <Square className="h-4 lg:h-5 w-4 lg:w-5 fill-current" />
                  Stop
                </button>
              )}
              {(isReview || recorder.state === "previewing") && (
                <button onClick={recorder.retake} className="w-12 lg:w-14 h-12 lg:h-14 flex items-center justify-center rounded-xl lg:rounded-[20px] border border-slate-100 bg-white text-slate-400 hover:text-slate-950 transition-all" title="Retake">
                  <RotateCcw className="h-4 lg:h-5 w-4 lg:w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isReview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[32px] w-full max-w-lg p-8 lg:p-12 shadow-2xl relative">
              <button onClick={() => recorder.retake()} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X className="h-6 w-6" /></button>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg"><Send className="h-6 w-6" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-950">Finish Submission</h3>
                  <p className="text-slate-400 text-xs font-medium">Just a few details to finalize.</p>
                </div>
              </div>
              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input placeholder="Jane Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-12 px-5 rounded-xl bg-slate-50 border-none outline-none focus:ring-1 ring-slate-100 transition-all text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address (Optional)</label>
                  <input placeholder="jane@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-12 px-5 rounded-xl bg-slate-50 border-none outline-none focus:ring-1 ring-slate-100 transition-all text-sm font-medium" />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => recorder.retake()} className="flex-1 h-12 rounded-xl border border-slate-100 text-slate-400 font-bold text-xs hover:bg-slate-50 transition-all">Retake</button>
                <button onClick={handleSubmit} disabled={submitting || !form.name.trim()} className="flex-[2] h-14 rounded-xl text-white font-bold text-sm shadow-xl shadow-emerald-500/10 disabled:opacity-20 transition-all" style={{ background: accentColor }}>
                  {submitting ? 'Sharing...' : 'Post Testimonial'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
