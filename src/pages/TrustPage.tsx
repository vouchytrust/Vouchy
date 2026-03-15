import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, Quote, Shield, ExternalLink, ChevronLeft, ChevronRight, Link2, Copy, CheckCheck, TrendingUp, Users, Award, Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";
import { VouchyLogo } from "@/components/VouchyLogo";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string;
  author_name: string;
  author_company: string | null;
  author_title: string | null;
  author_avatar_url: string | null;
  content: string;
  rating: number;
  type: string;
  video_url: string | null;
}

interface SpaceData {
  id: string;
  name: string;
  slug: string;
  form_config: any;
  profiles: {
    company_name: string | null;
    brand_color: string | null;
    logo_url: string | null;
  } | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function StarRow({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          style={{ color: i < rating ? color : "rgba(0,0,0,0.12)", fill: i < rating ? color : "none" }}
        />
      ))}
    </div>
  );
}

// ─── Testimonial Card ────────────────────────────────────────────────────────

function TestimonyCard({ t, accent, index }: { t: Testimonial; accent: string; index: number }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isLong = t.content.length > 160;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: "easeOut" }}
      className="relative bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 group"
    >
      {/* Accent corner glow */}
      <div
        className="absolute top-0 right-0 w-28 h-28 rounded-bl-full opacity-[0.04] pointer-events-none transition-opacity group-hover:opacity-[0.07]"
        style={{ backgroundColor: accent }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 shrink-0 relative z-10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2 text-xs font-bold"
          style={{ borderColor: accent + "30", backgroundColor: accent + "12", color: accent }}
        >
          {t.author_avatar_url ? (
            <img src={t.author_avatar_url} alt={t.author_name} className="w-full h-full object-cover" />
          ) : (
            initials(t.author_name)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-slate-900 truncate">{t.author_name}</div>
          {(t.author_company || t.author_title) && (
            <div className="text-[11px] text-slate-400 font-medium truncate">
              {[t.author_title, t.author_company].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        <div className="shrink-0">
          <StarRow rating={t.rating} color={accent} />
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1">
        <Quote className="h-5 w-5 mb-1.5 opacity-10" style={{ color: accent }} />
        <p className={`text-[13px] leading-relaxed text-slate-600 ${isLong && !expanded ? "line-clamp-4" : ""}`}>
          {t.content}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-1.5 text-[11px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: accent }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Video button */}
      {t.type === "video" && t.video_url && (
        <div className="relative z-10">
          <button
            onClick={() => setVideoOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: accent + "12", color: accent, borderColor: accent + "25" }}
          >
            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accent + "30" }}>
              <Play className="h-2 w-2 fill-current" />
            </div>
            Watch Video
          </button>
          <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none sm:rounded-2xl">
              <div className="aspect-video w-full">
                <video src={t.video_url} className="w-full h-full object-contain" controls autoPlay />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </motion.div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ testimonials, accent }: { testimonials: Testimonial[]; accent: string }) {
  const total = testimonials.length;
  const avg = total > 0
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / total).toFixed(1)
    : "—";
  const fiveStars = testimonials.filter(t => t.rating === 5).length;
  const pct = total > 0 ? Math.round((fiveStars / total) * 100) : 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
      {[
        { label: "Total Reviews", value: total },
        { label: "Average Rating", value: avg + " ★" },
        { label: "5-Star Reviews", value: pct + "%" },
      ].map(stat => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-black text-slate-900" style={{ color: stat.label === "Average Rating" ? accent : undefined }}>
            {stat.value}
          </div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrustPage() {
  const { slug } = useParams<{ slug: string }>();
  const [space, setSpace] = useState<SpaceData | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState(false);
  const { theme, setTheme } = useTheme();
  const PER_PAGE = 9;

  const trustLink = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trustLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const { data: spaceData, error: spaceErr } = await supabase
          .from("spaces")
          .select("id, name, slug, form_config, user_id")
          .eq("slug", slug)
          .single();

        if (spaceErr || !spaceData) { setNotFound(true); return; }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("company_name, brand_color, logo_url")
          .eq("user_id", spaceData.user_id)
          .single();

        setSpace({ ...spaceData, profiles: profileData });

        const { data: testimonialsData } = await supabase
          .from("testimonials")
          .select("id, author_name, author_company, author_title, author_avatar_url, content, rating, type, video_url")
          .eq("space_id", spaceData.id)
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        setTestimonials((testimonialsData as Testimonial[]) || []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Loading…</p>
        </div>
      </div>
    );
  }

  if (notFound || !space) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4">
        <div className="text-6xl font-black text-slate-100">404</div>
        <p className="text-slate-400 font-semibold text-sm">This trust page doesn't exist.</p>
        <a href="/" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors border-b border-transparent hover:border-slate-900 pb-0.5">
          Go to Vouchy →
        </a>
      </div>
    );
  }

  const accent = space.profiles?.brand_color || "#3b82f6";
  const companyName = space.profiles?.company_name || space.name;
  const logoUrl = space.profiles?.logo_url;
  const spaceName = space.name;

  const visible = testimonials.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(testimonials.length / PER_PAGE);
  const total = testimonials.length;
  const avg = total > 0 ? (testimonials.reduce((s, t) => s + t.rating, 0) / total).toFixed(1) : null;
  const fiveStar = total > 0 ? Math.round((testimonials.filter(t => t.rating === 5).length / total) * 100) : null;

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-300">
      {/* TOP ACCENT BAR */}
      <div 
        className="w-full h-1.5 shrink-0 relative z-[110] shadow-sm"
        style={{ backgroundColor: accent }}
      />

      {/* ── THEME TOGGLE ── */}
      <div className="absolute top-6 right-6 z-[100]">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-10 h-10 rounded-2xl items-center justify-center bg-card/50 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-primary transition-all duration-300 shadow-sm"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={theme}
              initial={{ rotate: -30, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 30, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* ══════════════════════════════════════════
           HERO SECTION — Landing Style Redesign
          ══════════════════════════════════════════ */}
      <div className="relative overflow-hidden pt-6">
        {/* Landing Page Style Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.03] [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Global Accent Glow (Softer) */}
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[100%] h-[100%] rounded-full blur-[140px] pointer-events-none z-0"
          style={{ 
            background: `radial-gradient(circle at center, ${accent}15 0%, transparent 70%)` 
          }}
        />

        {/* Global Lighting Highlight */}
        <div 
          className="absolute top-0 left-0 w-full h-px opacity-10"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >


            {/* Logo */}
            {logoUrl && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-5 p-2 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 backdrop-blur-md shadow-sm"
              >
                <img src={logoUrl} alt={companyName} className="h-10 w-auto object-contain" />
              </motion.div>
            )}

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-foreground mb-6 max-w-4xl"
            >
              {!logoUrl && (
                <span className="block text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mb-3">
                  {companyName}
                </span>
              )}
              <span className="opacity-60">What people say</span>
              <br />
              <span
                className="relative"
                style={{ color: accent }}
              >
                about us
                {/* Underline glow */}
                <span
                  className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full opacity-60"
                  style={{ backgroundColor: accent }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-muted-foreground text-lg sm:text-xl font-medium max-w-xl leading-relaxed mb-12"
            >
              Real stories from real customers. Every review is authentic and independently verified.
            </motion.p>



            {/* ── Action Buttons Row ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {/* PRIMARY: Share as website link — glassmorphic widget */}
              <button
                onClick={handleCopyLink}
                className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl border font-bold text-base transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] backdrop-blur-sm overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accent}12, ${accent}08)`,
                  borderColor: accent + "25",
                  color: "white",
                  boxShadow: `0 8px 32px -8px ${accent}25`,
                }}
              >
                {/* Accent Fill (Full Background) */}
                <span className="absolute inset-0 pointer-events-none" style={{ backgroundColor: accent }} />
                
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      className="flex items-center gap-2 relative z-10"
                    >
                      <CheckCheck className="h-4 w-4 text-white" />
                      <span className="text-sm font-bold">Copied!</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      className="flex items-center gap-2 relative z-10"
                    >
                      <Link2 className="h-4 w-4 text-white/90" />
                      Share Page Link
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* SECONDARY: Leave a testimonial */}
              <a
                href={`/collect/${space.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-foreground font-semibold text-base hover:bg-card hover:border-border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <ExternalLink className="h-5 w-5 opacity-70" />
                Leave a Testimonial
              </a>
            </motion.div>


          </motion.div>
        </div>
      </div>
      {/* ── END HERO ── */}



      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pb-20 pt-10">

        {/* ── TESTIMONIALS GRID ── */}
        {testimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <Quote className="h-12 w-12 text-slate-200" />
            <p className="text-slate-400 font-semibold text-sm">No testimonials yet.</p>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {visible.map((t, i) => (
                  <TestimonyCard key={t.id} t={t} accent={accent} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 0}
                  className="w-10 h-10 rounded-xl border border-border bg-card/50 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex gap-1.5 items-center">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPage(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`h-2 rounded-full transition-all duration-300 ${i === page ? "w-6" : "w-2 bg-border hover:bg-muted-foreground/30"}`}
                      style={i === page ? { backgroundColor: accent, width: "24px" } : {}}
                    />
                  ))}
                </div>

                <button
                  onClick={() => { setPage(p => Math.min(totalPages - 1, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages - 1}
                  className="w-10 h-10 rounded-xl border border-border bg-card/50 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">Powered by</span>
            <VouchyLogo variant="minimal" />
          </div>
          <div className="flex gap-6 opacity-40">
            <Link to="/privacy" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
