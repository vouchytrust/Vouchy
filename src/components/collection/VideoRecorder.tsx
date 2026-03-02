import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Square, RotateCcw, Send, Mic, Star, Wand2,
  ScrollText, Play, Pause, ZoomIn, ZoomOut, X,
  Loader2, Sparkles, CircleDot, FileText, ArrowLeft, CheckCircle2
} from "lucide-react";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import { supabase } from "@/integrations/supabase/client";

interface VideoRecorderProps {
  spaceId: string;
  spaceUserId: string;
  accentColor: string;
  formFields: any[];
  isPaidSpace?: boolean;
  onBack?: () => void;
  onSuccess: () => void;
}

// ── Teleprompter overlay over the video ──────────────────────────────────────
function Teleprompter({ script, onClose, accentColor }: { script: string; onClose: () => void; accentColor: string }) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [speed, setSpeed] = useState(1.0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop += speed;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight < scrollHeight) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setIsScrolling(false);
    }
  }, [speed]);

  useEffect(() => {
    if (isScrolling) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, tick, isScrolling]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const toggleScroll = () => {
    if (isScrolling) { cancelAnimationFrame(rafRef.current); setIsScrolling(false); }
    else { setIsScrolling(true); rafRef.current = requestAnimationFrame(tick); }
  };

  const resetScroll = () => {
    cancelAnimationFrame(rafRef.current); setIsScrolling(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col overflow-hidden rounded-2xl"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(4px)" }}
    >
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }} />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 h-28 pointer-events-none z-10" style={{ bottom: 52, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }} />

      {/* Reading focus highlight bar */}
      <div className="absolute inset-x-0 pointer-events-none z-10" style={{ top: "50%", transform: "translateY(-50%)" }}>
        <div className="mx-8 h-[2.5em] rounded-xl" style={{
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}35`,
          boxShadow: `0 0 24px ${accentColor}15`
        }} />
      </div>

      {/* Scrollable text */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as any}
      >
        <div style={{ height: "42%" }} />
        <p
          className="px-10 text-center text-white font-semibold leading-loose"
          style={{ fontSize: `${fontSize}px`, lineHeight: 2.0, textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}
        >
          {script}
        </p>
        <div style={{ height: "48%" }} />
      </div>

      {/* Controls bar */}
      <div
        className="relative z-20 flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
        style={{ background: "rgba(0,0,0,0.75)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Reset */}
        <button onClick={resetScroll} title="Reset to top"
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Play/Pause */}
        <button
          onClick={toggleScroll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
          style={{ background: isScrolling ? "rgba(239,68,68,0.55)" : `${accentColor}99` }}
        >
          {isScrolling ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {isScrolling ? "Pause" : "Play"}
        </button>

        {/* Speed */}
        <div className="flex items-center gap-1 text-white/60">
          <span className="text-[10px] mr-0.5">Speed</span>
          <button onClick={() => setSpeed(s => Math.max(0.3, +(s - 0.3).toFixed(1)))}
            className="w-5 h-5 rounded-md hover:bg-white/15 flex items-center justify-center font-bold text-sm transition-all">−</button>
          <span className="text-[11px] w-6 text-center text-white/80">{speed}x</span>
          <button onClick={() => setSpeed(s => Math.min(5, +(s + 0.3).toFixed(1)))}
            className="w-5 h-5 rounded-md hover:bg-white/15 flex items-center justify-center font-bold text-sm transition-all">+</button>
        </div>

        {/* Font size */}
        <div className="flex items-center gap-1 text-white/60">
          <span className="text-[10px] mr-0.5">Size</span>
          <button onClick={() => setFontSize(s => Math.max(13, s - 2))}
            className="p-1 rounded-md hover:bg-white/15 transition-all"><ZoomOut className="h-3 w-3" /></button>
          <button onClick={() => setFontSize(s => Math.min(32, s + 2))}
            className="p-1 rounded-md hover:bg-white/15 transition-all"><ZoomIn className="h-3 w-3" /></button>
        </div>

        {/* Close */}
        <button onClick={onClose}
          className="ml-auto p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main VideoRecorder ───────────────────────────────────────────────────────
export default function VideoRecorder({
  spaceId, spaceUserId, accentColor, formFields, isPaidSpace = false, onBack, onSuccess
}: VideoRecorderProps) {
  const recorder = useVideoRecorder(120);

  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    formFields.forEach(f => { init[f.id] = f.type === "rating" ? 5 : ""; });
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [mainIdea, setMainIdea] = useState("");
  const [script, setScript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const progress = (recorder.elapsed / 120) * 100;
  const isLive = ["previewing", "countdown", "recording"].includes(recorder.state);

  const callAI = async (action: string, payload: Record<string, any>) => {
    const { data, error } = await supabase.functions.invoke("ai-processor", {
      body: { action, spaceOwnerId: spaceUserId, ...payload },
    });
    const err = data?.error || error?.message;
    if (err) throw new Error(err);
    return data.result as string;
  };

  const generateScript = async () => {
    if (!mainIdea.trim()) return;
    setGenerating(true); setScriptError(null);
    try { setScript(await callAI("generate_script", { mainIdea })); }
    catch (e: any) { setScriptError(e.message); }
    finally { setGenerating(false); }
  };

  const enhanceScript = async (style: string) => {
    if (!script.trim()) return;
    setEnhancing(style); setScriptError(null);
    try { setScript(await callAI("enhance_script", { text: script, style })); }
    catch (e: any) { setScriptError(e.message); }
    finally { setEnhancing(null); }
  };

  const handleSubmit = async () => {
    for (const f of formFields) {
      if (f.required && !formValues[f.id]) { setSubmitError(`Please fill in: ${f.label}`); return; }
    }
    if (!recorder.videoBlob) return;
    setSubmitting(true); setSubmitError(null);
    try {
      const fileName = `${spaceId}/${Date.now()}.webm`;
      const { error: upErr } = await supabase.storage.from("videos").upload(fileName, recorder.videoBlob, { contentType: "video/webm" });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("videos").getPublicUrl(fileName);
      const payload: any = { space_id: spaceId, user_id: spaceUserId, type: "video", video_url: urlData.publicUrl, video_duration: formatTime(recorder.elapsed), extra_fields: {}, content: "(video testimonial)", author_name: "Anonymous" };
      formFields.forEach(f => {
        const v = formValues[f.id];
        if (f.type === "name") payload.author_name = v;
        else if (f.type === "email") payload.author_email = v;
        else if (f.type === "rating") payload.rating = v;
        else if (f.type === "text") payload.content = v;
        else payload.extra_fields[f.label] = v;
      });
      const { error: insErr } = await supabase.from("testimonials").insert(payload);
      if (insErr) throw insErr;
      recorder.reset(); onSuccess();
    } catch (e: any) { setSubmitError(e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="w-full bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
      {/* Two-column grid: video | controls */}
      <div className="flex flex-col lg:flex-row min-h-0">

        {/* ── LEFT: Video ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-zinc-950 lg:rounded-l-2xl overflow-hidden">

          {/* Back button */}
          {onBack && (
            <div className="px-4 pt-3 pb-1">
              <button onClick={() => { recorder.reset(); onBack?.(); }}
                className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-[12px] transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            </div>
          )}

          {/* Camera viewport */}
          <div className="relative flex-1 min-h-[240px] lg:min-h-0" style={{ aspectRatio: "16/9" }}>
            {/* Live stream */}
            <video ref={recorder.attachVideoEl} autoPlay muted playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "scaleX(-1)", display: isLive ? "block" : "none" }} />

            {/* Idle placeholder */}
            {recorder.state === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}>
                  <Video className="h-7 w-7" style={{ color: accentColor }} />
                </div>
                <p className="text-white/40 text-sm">Camera preview will appear here</p>
              </div>
            )}

            {/* Countdown */}
            <AnimatePresence>
              {recorder.state === "countdown" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                  <AnimatePresence mode="wait">
                    <motion.span key={recorder.countdown}
                      initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                      className="text-8xl font-black text-white"
                      style={{ textShadow: `0 0 40px ${accentColor}` }}>
                      {recorder.countdown}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* REC badge */}
            {recorder.state === "recording" && (
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-xs font-mono font-bold">{formatTime(recorder.elapsed)}</span>
              </div>
            )}

            {/* Progress bar */}
            {recorder.state === "recording" && (
              <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-10">
                <motion.div className="h-full" animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "linear" }}
                  style={{ backgroundColor: accentColor }} />
              </div>
            )}

            {/* Teleprompter */}
            <AnimatePresence>
              {showTeleprompter && script && isLive && (
                <Teleprompter script={script} onClose={() => setShowTeleprompter(false)} accentColor={accentColor} />
              )}
            </AnimatePresence>

            {/* Review: video playback */}
            {recorder.state === "review" && recorder.videoUrl && (
              <video src={recorder.videoUrl} controls className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>

          {/* Camera controls below video */}
          <div className="px-4 py-3 flex items-center gap-2.5 flex-wrap">
            {recorder.state === "idle" && (
              <button onClick={recorder.startPreview}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
                style={{ background: accentColor }}>
                <Mic className="h-4 w-4" /> Enable Camera
              </button>
            )}
            {recorder.error && <p className="text-red-400 text-[11px] w-full">{recorder.error}</p>}

            {recorder.state === "previewing" && (
              <>
                {isPaidSpace && script && (
                  <button onClick={() => setShowTeleprompter(v => !v)}
                    className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-[12px] font-semibold border transition-all"
                    style={showTeleprompter
                      ? { borderColor: accentColor, color: accentColor, background: `${accentColor}12` }
                      : { borderColor: "rgba(255,255,255,.15)", color: "rgba(255,255,255,.5)", background: "rgba(255,255,255,.05)" }}>
                    <ScrollText className="h-3.5 w-3.5" /> Teleprompter
                  </button>
                )}
                <button onClick={recorder.startCountdown}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: accentColor }}>
                  <CircleDot className="h-4 w-4" /> Start Recording
                </button>
              </>
            )}

            {recorder.state === "recording" && (
              <>
                {isPaidSpace && script && (
                  <button onClick={() => setShowTeleprompter(v => !v)}
                    className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-[12px] font-semibold border transition-all"
                    style={showTeleprompter
                      ? { borderColor: accentColor, color: accentColor, background: `${accentColor}12` }
                      : { borderColor: "rgba(255,255,255,.15)", color: "rgba(255,255,255,.5)", background: "rgba(255,255,255,.05)" }}>
                    <ScrollText className="h-3.5 w-3.5" /> Teleprompter
                  </button>
                )}
                <button onClick={recorder.stopRecording}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold text-white transition-all"
                  style={{ background: "#ef4444" }}>
                  <Square className="h-4 w-4 fill-current" /> Stop
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Sidebar Panel ─────────────────────────────────────────── */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col border-t lg:border-t-0 lg:border-l border-border bg-card flex-shrink-0">

          {/* Panel title */}
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-[13px] font-semibold text-foreground">
              {recorder.state === "review" ? "Almost there" : recorder.state === "recording" ? "Recording..." : "Before you record"}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {recorder.state === "review" ? "Add your details and submit" : recorder.state === "recording" ? "Speak clearly and naturally" : "Prepare your testimonial"}
            </p>
          </div>

          {/* Panel body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* Idle / Previewing */}
            {(recorder.state === "idle" || recorder.state === "previewing") && (
              <>
                {/* AI Script */}
                {isPaidSpace && (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
                      <Sparkles className="h-3.5 w-3.5" style={{ color: accentColor }} />
                      <span className="text-[12px] font-semibold text-foreground">AI Script</span>
                      <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${accentColor}15`, color: accentColor }}>PRO</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex gap-2">
                        <input
                          placeholder="Your main point..."
                          value={mainIdea}
                          onChange={e => setMainIdea(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && generateScript()}
                          className="flex-1 h-8 px-3 text-[12px] rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                        <button onClick={generateScript} disabled={generating || !mainIdea.trim()}
                          className="h-8 px-3 rounded-lg text-[11px] font-semibold text-white flex items-center gap-1.5 transition-all disabled:opacity-50 hover:opacity-90"
                          style={{ background: accentColor }}>
                          {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                          {generating ? "..." : "Generate"}
                        </button>
                      </div>

                      {script && (
                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                          <textarea
                            value={script}
                            onChange={e => setScript(e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2.5 text-[12px] rounded-lg bg-background border border-border text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed"
                          />
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { key: "professional", label: "Professional" },
                              { key: "natural", label: "Natural" },
                              { key: "shorter", label: "Shorter" },
                              { key: "longer", label: "Longer" },
                            ].map(opt => (
                              <button key={opt.key} onClick={() => enhanceScript(opt.key)} disabled={!!enhancing}
                                className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all disabled:opacity-50 font-medium">
                                {enhancing === opt.key && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          {scriptError && <p className="text-[11px] text-destructive">{scriptError}</p>}
                        </motion.div>
                      )}
                      {!script && scriptError && <p className="text-[11px] text-destructive">{scriptError}</p>}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="rounded-xl border border-border p-4 space-y-2.5 bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tips</p>
                  {[
                    "Face a window for natural lighting",
                    "Speak naturally — authenticity wins",
                    "Keep it under 90 seconds",
                    "Look at the camera, not the screen",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                      <p className="text-[12px] text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Recording live stats */}
            {recorder.state === "recording" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">Elapsed</p>
                    <p className="text-xl font-black text-foreground font-mono">{formatTime(recorder.elapsed)}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">Left</p>
                    <p className="text-xl font-black text-foreground font-mono">{formatTime(120 - recorder.elapsed)}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Progress</span><span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
                      style={{ background: accentColor }} />
                  </div>
                </div>
              </div>
            )}

            {/* Review form */}
            {recorder.state === "review" && (
              <div className="space-y-3">
                {formFields.filter(f => f.type !== "rating" && f.type !== "text").map(field => (
                  <div key={field.id}>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">
                      {field.label}{field.required && <span className="text-destructive ml-0.5">*</span>}
                    </label>
                    <input
                      type={field.type === "email" ? "email" : "text"}
                      placeholder={field.label}
                      value={formValues[field.id] || ""}
                      onChange={e => setFormValues({ ...formValues, [field.id]: e.target.value })}
                      className="w-full h-9 px-3 text-[13px] rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                ))}

                {formFields.filter(f => f.type === "rating").map(field => (
                  <div key={field.id}>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-2">{field.label}</label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button key={i} onClick={() => setFormValues({ ...formValues, [field.id]: i + 1 })}
                          className="transition-transform hover:scale-110">
                          <Star className={`h-7 w-7 ${i < (formValues[field.id] || 0) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {submitError && <p className="text-[12px] text-destructive">{submitError}</p>}
              </div>
            )}
          </div>

          {/* Panel footer */}
          {recorder.state === "review" && (
            <div className="p-4 border-t border-border space-y-2">
              <button onClick={handleSubmit} disabled={submitting}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: accentColor }}>
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Send className="h-4 w-4" /> Submit Testimonial</>}
              </button>
              <button onClick={recorder.retake}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-xl text-[12px] font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-all">
                <RotateCcw className="h-3.5 w-3.5" /> Retake
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
