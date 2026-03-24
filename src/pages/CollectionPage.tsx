import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Video, PenLine, Check, Send, ChevronLeft, Wand2 } from "lucide-react";
import VideoRecorder from "@/components/collection/VideoRecorder";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Space {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  profile?: {
    company_name?: string;
    brand_color?: string;
    logo_url?: string;
    plan?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const AI_ACTIONS = [
  { id: "polish",       label: "Polish",       hint: "Fix grammar & flow"   },
  { id: "short",        label: "Shorten",      hint: "Make it concise"      },
  { id: "exciting",     label: "Punch it up",  hint: "Add energy & impact"  },
  { id: "professional", label: "Professional", hint: "Formal business tone" },
  { id: "casual",       label: "Casual",       hint: "Make it friendly"     },
];

const FIELDS: [keyof { name: string; email: string; company: string; title: string }, string, boolean][] = [
  ["name",    "Full Name", true ],
  ["email",   "Email",     true ],
  ["company", "Company",   false],
  ["title",   "Job Title", false],
];

// ─────────────────────────────────────────────────────────────────────────────
// CollectionPage
// ─────────────────────────────────────────────────────────────────────────────
export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const [space, setSpace]             = useState<Space | null>(null);
  const [loading, setLoading]         = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [mode, setMode]               = useState<"choose" | "text" | "video" | "success">("choose");
  const [rating, setRating]           = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent]         = useState("");
  const [fields, setFields]           = useState({ name: "", email: "", company: "", title: "" });
  const [agreed, setAgreed]           = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [aiWorking, setAiWorking]     = useState<string | null>(null);
  const [aiUses, setAiUses]           = useState(0);

  // ── Data fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const { data: spaceData, error } = await supabase
          .from("spaces").select("*").eq("slug", slug).single();
        if (error || !spaceData) return setNotFound(true);
        const { data: profile } = await supabase
          .from("profiles").select("*").eq("user_id", spaceData.user_id).single();
        setSpace({ ...spaceData, profile });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // ── Derived values ──────────────────────────────────────────────────────────
  const accent      = space?.profile?.brand_color || "#18181b";
  const workspaceName = space?.profile?.company_name || space?.name || "Workspace";
  const logo        = space?.profile?.logo_url;
  const userPlan    = space?.profile?.plan?.toLowerCase() || "free";
  const isFree      = userPlan !== "pro" && userPlan !== "agency";

  // ── AI enhance ──────────────────────────────────────────────────────────────
  const handleEnhance = async (styleId: string) => {
    if (isFree) {
      toast({ title: "Pro Feature", description: "AI Enhancement is available on Pro and Agency plans.", variant: "default" });
      return;
    }
    if (!content.trim() || aiUses >= 3) {
      if (aiUses >= 3) toast({ title: "AI Limit Reached", description: "You can use AI polish up to 3 times per review." });
      return;
    }
    setAiUses(prev => prev + 1);
    setAiWorking(styleId);
    try {
      const { data } = await supabase.functions.invoke("ai-processor", {
        body: { action: "enhance_text", text: content, style: styleId, spaceOwnerId: space!.user_id },
      });
      if (data?.result) setContent(data.result);
    } catch (err: any) {
      toast({ title: "AI enhancement failed", variant: "destructive" });
    } finally {
      setAiWorking(null);
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ title: "Confirm your review is honest before submitting." });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("testimonials").insert({
        space_id:       space!.id,
        user_id:        space!.user_id,
        author_name:    fields.name,
        author_email:   fields.email,
        author_company: fields.company,
        author_title:   fields.title,
        content,
        rating,
        type:   "text",
        status: "pending",
      });
      if (error) throw error;
      setMode("success");
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Guards ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="h-[100svh] flex items-center justify-center bg-white">
      <div className="w-6 h-6 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="h-[100svh] flex flex-col items-center justify-center bg-white gap-3">
      <p className="text-sm font-semibold text-zinc-400 tracking-widest uppercase">Page not found</p>
    </div>
  );

  if (mode === "video") return (
    <VideoRecorder
      spaceId={space!.id}
      spaceUserId={space!.user_id}
      accentColor={accent}
      workspaceName={workspaceName}
      logoUrl={logo}
      questions={[]}
      onBack={() => setMode("choose")}
      onSuccess={() => setMode("success")}
      plan={space!.profile?.plan}
    />
  );

  // ─────────────────────────────────────────────────────────────────────────
  // CHOOSE SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (mode === "choose") return (
    <div className="min-h-[100svh] flex flex-col bg-zinc-50 antialiased relative selection:bg-zinc-200">
      
      {/* Subtle blueprint pattern background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} 
      />

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 relative z-10 w-full max-w-5xl mx-auto">
        
        {/* Main Card Wrapper */}
        <div className="w-full flex flex-col lg:flex-row bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_20px_60px_-15px_rgb(0,0,0,0.05)] overflow-hidden border border-zinc-100">
          
          {/* Brand/Hero Section */}
          <div className="lg:w-2/5 p-8 lg:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-zinc-100 bg-zinc-50/50 flex flex-col items-center lg:items-start justify-center text-center lg:text-left relative overflow-hidden">
            {/* Soft background glow based on brand color */}
            <div 
              className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
              style={{ backgroundColor: accent }}
            />

            {logo ? (
              <img
                src={logo}
                alt={workspaceName}
                className="object-contain mb-8 relative z-10"
                style={{ height: '56px', width: 'auto', maxWidth: '100%' }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm relative z-10"
                style={{ backgroundColor: accent }}
              >
                <span className="text-3xl font-black text-white select-none">
                  {workspaceName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.25em] mb-4 relative z-10">
              Share your experience
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-[1.15] mb-4 relative z-10 tracking-tight">
              We'd love to hear from you
            </h1>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed relative z-10 max-w-[280px]">
              Your feedback is incredibly valuable. How would you like to share your story with us today?
            </p>
          </div>

          {/* Options Section */}
          <div className="flex-1 p-6 lg:p-10 xl:p-12 flex flex-col sm:flex-row gap-5 lg:gap-6 bg-white justify-center items-stretch">
            
            {/* Video (Pro/Agency only) */}
            {!isFree && (
              <button
                onClick={() => setMode("video")}
                className="group flex-1 flex flex-col items-center justify-center rounded-3xl p-8 lg:p-10 transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 focus:outline-none relative overflow-hidden text-center border overflow-hidden"
                style={{ backgroundColor: accent, borderColor: 'rgba(255,255,255,0.1)' }}
              >
                {/* Glossy sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-16 h-16 rounded-[1.25rem] bg-white/10 flex items-center justify-center mb-6 shadow-inner backdrop-blur-md relative z-10 border border-white/20 group-hover:scale-110 transition-transform duration-500">
                  <Video className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight relative z-10">Record a Video</h3>
                <p className="text-xs text-white/75 font-medium mb-8 leading-relaxed relative z-10 max-w-[200px]">
                  The most impactful way to share your success. ~60 secs.
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 relative z-10">
                  {["Authentic", "Show Results", "Guided"].map(p => (
                    <span key={p} className="text-[9px] font-black text-white/80 uppercase tracking-widest bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                      {p}
                    </span>
                  ))}
                </div>
              </button>
            )}

            {/* Written */}
            <button
              onClick={() => setMode("text")}
              className={`group flex-1 flex flex-col items-center justify-center rounded-3xl p-8 lg:p-10 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl focus:outline-none border-2 border-zinc-100 bg-white hover:border-zinc-300 text-center relative overflow-hidden ${isFree ? "w-full min-h-[300px]" : ""}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-16 h-16 rounded-[1.25rem] bg-zinc-50 flex items-center justify-center mb-6 border border-zinc-100 shadow-sm relative z-10 group-hover:bg-white group-hover:shadow-md transition-all duration-500 group-hover:scale-110">
                <PenLine className="w-8 h-8 text-zinc-700" />
              </div>
              
              <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight relative z-10">Write a Review</h3>
              <p className="text-xs text-zinc-500 font-medium mb-8 leading-relaxed relative z-10 max-w-[200px]">
                Quick, structured, and easy to complete text feedback. ~2 mins.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 relative z-10">
                {["Private options", !isFree ? "AI Polish" : null, "Quick form"].filter(Boolean).map(p => (
                  <span key={p} className="text-[9px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-100 px-3 py-1.5 rounded-full transition-colors group-hover:bg-zinc-200 border border-transparent group-hover:border-zinc-300/30">
                    {p}
                  </span>
                ))}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      {isFree && (
        <footer className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-4 sm:gap-6 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.25em] z-20">
          <Link to="/privacy" className="hover:text-zinc-700 transition-colors">Privacy</Link>
          <span className="opacity-30">·</span>
          <a href="https://vouchy.click" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 transition-colors flex items-center gap-1.5">
            Powered by Vouchy
          </a>
          <span className="opacity-30">·</span>
          <Link to="/terms" className="hover:text-zinc-700 transition-colors">Terms</Link>
        </footer>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // SUCCESS SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (mode === "success") return (
    <div className="h-[100svh] flex flex-col items-center justify-center gap-6 bg-white antialiased px-6">
      {logo && (
        <img src={logo} alt={workspaceName} className="h-10 w-auto object-contain mb-2 opacity-60" />
      )}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: accent }}
      >
        <Check className="w-8 h-8 text-white" strokeWidth={3} />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Thank you!</h1>
        <p className="text-sm text-zinc-400">Your review is in — we really appreciate it.</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors underline underline-offset-4"
      >
        Submit another
      </button>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // WRITING FORM
  // Three zones: header (brand) / body (form, scrollable on mobile) / footer
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-[100svh] flex flex-col bg-white antialiased overflow-hidden text-zinc-900">

      {/* Header — brand is centred, back on left, mirror spacer on right */}
      <header className="shrink-0 flex items-center justify-between px-5 sm:px-8 h-16 border-b border-zinc-100">
        <button
          onClick={() => setMode("choose")}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Centred brand identity */}
        <div className="flex-1 flex justify-center items-center">
          {logo ? (
            <img
              src={logo}
              alt={workspaceName}
              className="object-contain"
              style={{ height: '36px', width: 'auto', maxWidth: '160px' }}
            />
          ) : (
            <span className="text-sm font-bold text-zinc-800">{workspaceName}</span>
          )}
        </div>

        <div className="w-16 shrink-0" /> {/* mirror of back button width */}
      </header>

      {/* Form body:
          Mobile  — stacks vertically, zone scrolls naturally
          Desktop — two columns, locked to viewport height            */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row lg:h-full">

          {/* LEFT — review content */}
          <div className="flex flex-col px-5 sm:px-8 pt-6 pb-6 lg:py-8 lg:flex-1 lg:min-h-0 gap-5 border-b border-zinc-100 lg:border-b-0 lg:border-r">
            {/* Star rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className="w-7 h-7 transition-colors"
                    style={{
                      fill:  (hoverRating || rating) >= i ? accent : "transparent",
                      color: (hoverRating || rating) >= i ? accent : "#D4D4D8",
                    }}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>

            {/* Textarea with guided prompt chips above */}
            <div className="flex flex-col relative lg:flex-1 lg:min-h-0 gap-3">
              {/* Prompt starters — click to seed the textarea */}
              {!content && (
                <div className="flex flex-wrap gap-2">
                  <p className="w-full text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Start with a prompt</p>
                  {[
                    "What I liked most was...",
                    "Before using this, I struggled with...",
                    "I'd recommend this because...",
                    "The biggest result I saw was...",
                  ].map(prompt => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setContent(prompt)}
                      className="text-[11px] font-medium text-zinc-500 bg-zinc-50 border border-zinc-100 hover:border-zinc-300 hover:text-zinc-800 hover:bg-white px-3 py-1.5 rounded-lg transition-all active:scale-95"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative lg:flex-1 lg:min-h-0">
                <textarea
                  required
                  placeholder="Share your experience..."
                  className="w-full min-h-[140px] lg:absolute lg:inset-0 lg:h-full text-base sm:text-lg font-medium text-zinc-900 bg-transparent outline-none resize-none placeholder:text-zinc-200 leading-relaxed"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>

              {/* Word count progress */}
              {content.length > 0 && (() => {
                const words = content.trim().split(/\s+/).filter(Boolean).length;
                const target = 50;
                const pct = Math.min((words / target) * 100, 100);
                const label = words < 20 ? "Keep going..." : words < 40 ? "Looking good" : words >= target ? "Great review!" : "Almost there";
                return (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">{label}</span>
                      <span className="text-[10px] font-semibold text-zinc-300">{words} words</span>
                    </div>
                    <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: pct === 100 ? accent : '#D4D4D8' }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* AI polish strip (Pro/Agency only) */}
            {!isFree && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[10px] font-semibold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Wand2 className="w-3 h-3" /> AI Polish
                  </p>
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                    {3 - aiUses} left
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {AI_ACTIONS.map(action => (
                    <button
                      key={action.id}
                      type="button"
                      disabled={!!aiWorking || !content.trim() || aiUses >= 3}
                      onClick={() => handleEnhance(action.id)}
                      title={action.hint}
                      className="h-8 px-4 rounded-full text-[11px] font-semibold border border-zinc-200 text-zinc-600 bg-white hover:border-zinc-900 hover:text-zinc-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
                    >
                      {aiWorking === action.id ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full border border-zinc-400 border-t-transparent animate-spin inline-block" />
                          {action.label}
                        </span>
                      ) : action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — author details + CTA */}
          <div className="flex flex-col justify-between px-5 sm:px-8 pt-6 pb-6 lg:py-8 lg:w-[400px] xl:w-[440px] shrink-0 gap-8">
            {/* Fields — always 2 columns since panel is fixed width on desktop */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6">
              {FIELDS.map(([key, label, req]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`field-${key}`}
                    className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest"
                  >
                    {label}
                    {req && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  <input
                    id={`field-${key}`}
                    required={req}
                    type={key === "email" ? "email" : "text"}
                    autoComplete={key === "email" ? "email" : key === "name" ? "name" : "off"}
                    value={fields[key as keyof typeof fields]}
                    onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-300 focus:border-zinc-900 outline-none transition-colors"
                    placeholder={label}
                  />
                </div>
              ))}
            </div>

            {/* CTA zone */}
            <div className="flex flex-col gap-4">
              {/* Honest confirmation */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  className="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    borderColor:      agreed ? accent : "#D4D4D8",
                    backgroundColor:  agreed ? accent : "transparent",
                    color:            agreed ? "#fff"  : "transparent",
                  }}
                >
                  <Check className="w-3 h-3" strokeWidth={3.5} />
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <span className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-600 transition-colors">
                  I confirm this review is honest and based on my real experience.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !agreed}
                className="w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-30 hover:brightness-110 focus:outline-none"
                style={{ backgroundColor: accent }}
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Post Review
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </form>

      {/* Footer */}
      {isFree && (
        <footer className="shrink-0 flex items-center justify-center h-10 gap-5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest border-t border-zinc-50">
          <Link to="/privacy" className="hover:text-zinc-500 transition-colors">Privacy</Link>
          <span>·</span>
          <span>Powered by Vouchy</span>
          <span>·</span>
          <Link to="/terms" className="hover:text-zinc-500 transition-colors">Terms</Link>
        </footer>
      )}
    </div>
  );
}