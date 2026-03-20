import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ExternalLink, ChevronLeft, ChevronRight, Link2, CheckCheck, Sun, Moon, TrendingUp, Award, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";
import { VouchyLogo } from "@/components/VouchyLogo";
import { TestimonialCard, TestimonialItem, CardConfig } from "@/components/TestimonialCard";

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
  user_id: string;
  profiles: {
    company_name: string | null;
    brand_color: string | null;
    logo_url: string | null;
  } | null;
}

// ─── Components ───────────────────────────────────────────────────────────────

function MarqueeRow({ testimonials, config, reverse }: { testimonials: TestimonialItem[]; config: CardConfig; reverse?: boolean }) {
  const items = [...testimonials, ...testimonials];
  return (
    <div className="overflow-hidden w-full relative">
      <motion.div
        className="flex gap-6"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {items.map((t, i) => (
          <div key={i} className="shrink-0 w-[300px] sm:w-[350px]">
            <TestimonialCard t={t} config={config} index={0} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, accent, darkMode }: { icon: any; label: string; value: string | number; accent: string; darkMode?: boolean }) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-2xl border backdrop-blur-md shadow-sm transition-all duration-300 ${darkMode ? 'bg-card/40 border-white/5' : 'bg-white/40 border-slate-200/50'}`}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5" style={{ backgroundColor: accent + '10' }}>
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>
      <div className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</div>
      <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>{label}</div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrustPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [space, setSpace] = useState<SpaceData | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Widget Customization Support
  const [widgetConfig, setWidgetConfig] = useState<any>(null);
  const PER_PAGE = 12;

  const handleCopyLink = () => {
    // Return shortest link (current URL)
    navigator.clipboard.writeText(window.location.origin + "/trust/" + slug).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        // 1. Fetch Space
        const { data: spaceData, error: spaceErr } = await supabase
          .from("spaces")
          .select("id, name, slug, form_config, user_id")
          .eq("slug", slug)
          .single();

        if (spaceErr || !spaceData) { setNotFound(true); return; }

        // 2. Fetch Profile for defaults
        const { data: profileData } = await supabase
          .from("profiles")
          .select("company_name, brand_color, logo_url")
          .eq("user_id", spaceData.user_id)
          .single();

        setSpace({ ...spaceData, profiles: profileData });

        // 3. Fetch approved testimonials
        const { data: testimonialsData } = await supabase
          .from("testimonials")
          .select("id, author_name, author_company, author_title, author_avatar_url, content, rating, type, video_url")
          .eq("space_id", spaceData.id)
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        setTestimonials((testimonialsData as Testimonial[]) || []);

        // 4. Fetch most recent Widget config for custom designs
        const { data: widgets } = await supabase
          .from("widgets")
          .select("*")
          .eq("space_id", spaceData.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (widgets && widgets.length > 0) {
          setWidgetConfig(widgets[0].config);
        }
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">Loading…</p>
        </div>
      </div>
    );
  }

  if (notFound || !space) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-6xl font-black text-muted/30">404</div>
        <p className="text-muted-foreground font-semibold text-sm">This trust page doesn't exist.</p>
        <Link to="/" className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline">
          Go to Vouchy →
        </Link>
      </div>
    );
  }

  const profileAccent = space.profiles?.brand_color || "#3b82f6";
  const companyName = space.profiles?.company_name || space.name;
  const logoUrl = space.profiles?.logo_url;
  
  // Custom design from searchParams (priority) or Widget Lab or profile defaults
  const layout = searchParams.get("layout") || widgetConfig?.layout || "modern";
  const accent = decodeURIComponent(searchParams.get("accent") || widgetConfig?.accentColor || profileAccent);
  
  const isDarkLink = searchParams.get("darkMode") === "true";
  const isWidgetDark = widgetConfig?.darkMode;
  const effectiveTheme = searchParams.has("darkMode") ? (isDarkLink ? "dark" : "light") : (widgetConfig ? (isWidgetDark ? "dark" : "light") : theme);

  const total = testimonials.length;
  const filtered = testimonials.filter(t => {
     const minRating = parseInt(searchParams.get("minRating") || String(widgetConfig?.minRating || 0), 10);
     const mediaFilter = searchParams.get("mediaFilter") || widgetConfig?.mediaFilter || "all";
     if (t.rating < minRating) return false;
     if (mediaFilter === "video") return t.type === "video";
     if (mediaFilter === "text") return t.type === "text";
     return true;
  });
  
  const visible = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  
  const avg = total > 0 ? (testimonials.reduce((s, t) => s + t.rating, 0) / total).toFixed(1) : "5.0";
  const fiveStars = testimonials.filter(t => t.rating === 5).length;
  const fiveStarPct = total > 0 ? Math.round((fiveStars / total) * 100) : 100;

  // Map everything to CardConfig
  const cardConfig: CardConfig = {
    layout: layout === "marquee" ? "modern" : layout,
    darkMode: effectiveTheme === "dark",
    accent: accent,
    radius: parseInt(searchParams.get("radius") || String(widgetConfig?.radius || 16), 10),
    padding: parseInt(searchParams.get("padding") || String(widgetConfig?.padding || 24), 10),
    shadow: searchParams.get("shadow") || widgetConfig?.shadow || "md",
    font: searchParams.get("font") || widgetConfig?.font || "inter",
    showStars: searchParams.get("showStars") !== "false" && widgetConfig?.showStars !== false,
    showAvatar: searchParams.get("showAvatar") !== "false" && widgetConfig?.showAvatar !== false,
    showCompany: searchParams.get("showCompany") !== "false" && widgetConfig?.showCompany !== false,
    starColor: decodeURIComponent(searchParams.get("starColor") || widgetConfig?.starColor || "#f59e0b"),
    cardBg: decodeURIComponent(searchParams.get("cardBg") || widgetConfig?.cardBg || (effectiveTheme === "dark" ? "hsl(var(--card))" : "#ffffff")),
    nameColor: decodeURIComponent(searchParams.get("nameColor") || widgetConfig?.nameColor || (effectiveTheme === "dark" ? "#ffffff" : "#0f172a")),
    bodyColor: decodeURIComponent(searchParams.get("bodyColor") || widgetConfig?.bodyColor || (effectiveTheme === "dark" ? "rgba(255,255,255,0.8)" : "#475569")),
    companyColor: decodeURIComponent(searchParams.get("companyColor") || widgetConfig?.companyColor || (effectiveTheme === "dark" ? "rgba(255,255,255,0.5)" : "#64748b")),
  };

  const mappedTestimonials: TestimonialItem[] = filtered.map(t => ({
    name: t.author_name,
    company: t.author_company || "",
    rating: t.rating,
    content: t.content,
    avatar: t.author_avatar_url,
    type: (t.type === "video" ? "video" : "text") as "video" | "text",
    video_url: t.video_url,
    initials: initials(t.author_name)
  }));

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${effectiveTheme === 'dark' ? 'bg-[#000000]' : 'bg-background'}`} data-theme={effectiveTheme}>
      {/* TOP ACCENT BAR */}
      <div 
        className="w-full h-1.5 shrink-0 relative z-[110] shadow-sm"
        style={{ backgroundColor: accent }}
      />

      {/* THEME TOGGLE (Only if not in hardcoded link mode) */}
      {!searchParams.has("darkMode") && !widgetConfig && (
        <div className="absolute top-6 right-6 z-[100]">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-10 h-10 rounded-2xl items-center justify-center bg-card/50 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-primary transition-all duration-300 shadow-sm"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      )}

      <div className="relative overflow-hidden pt-6">
        {/* Grid Background */}
        <div className={`absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.03] [mask-image:linear-gradient(to_bottom,black_60%,transparent)]`}
          style={{
            backgroundImage: `linear-gradient(${effectiveTheme === 'dark' ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${effectiveTheme === 'dark' ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="flex flex-col items-center text-center"
          >
            {logoUrl && (
              <div className={`mb-5 p-2 rounded-2xl border backdrop-blur-md shadow-sm ${effectiveTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/40 border-slate-200/50'}`}>
                <img src={logoUrl} alt={companyName} className="h-10 w-auto object-contain" />
              </div>
            )}

            <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6 max-w-4xl ${effectiveTheme === 'dark' ? 'text-white' : 'text-foreground'}`}>
              {!logoUrl && <span className="block text-muted-foreground text-xs uppercase tracking-[0.2em] mb-3">{companyName}</span>}
              <span className="opacity-60">What people say</span>
              <br />
              <span className="relative" style={{ color: accent }}>
                about us
                <span className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full opacity-60" style={{ backgroundColor: accent }} />
              </span>
            </h1>

            <p className={`text-lg sm:text-xl font-medium max-w-xl leading-relaxed mb-10 ${effectiveTheme === 'dark' ? 'text-white/60' : 'text-muted-foreground'}`}>
              Real stories from real customers. Every review is authentic and independently verified.
            </p>

            {/* Statistics Row */}
            {total > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 w-full max-w-3xl">
                <StatItem icon={Award} label="Total Reviews" value={total} accent={accent} darkMode={effectiveTheme === 'dark'} />
                <StatItem icon={TrendingUp} label="Average Rating" value={avg + " ★"} accent={accent} darkMode={effectiveTheme === 'dark'} />
                <StatItem icon={Users} label="5-Star Happy" value={fiveStarPct + "%"} accent={accent} darkMode={effectiveTheme === 'dark'} />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
                style={{ backgroundColor: accent, color: "white" }}
              >
                {copied ? <CheckCheck className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Page Link"}
              </button>

              <a
                href={`/collect/${space.slug}`}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl border backdrop-blur-sm font-semibold text-base transition-all hover:scale-[1.02] ${effectiveTheme === 'dark' ? 'bg-card/50 border-white/10 text-white hover:bg-card' : 'bg-card/50 border-border text-foreground hover:bg-card'}`}
              >
                <ExternalLink className="h-5 w-5 opacity-70" />
                Leave a Testimonial
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pb-32 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Quote className="h-12 w-12 text-muted/20" />
            <p className="text-muted-foreground font-semibold text-sm">No testimonials yet.</p>
          </div>
        ) : layout === "marquee" ? (
          <div className="space-y-6 pt-10">
            <MarqueeRow testimonials={mappedTestimonials.slice(0, Math.ceil(mappedTestimonials.length / 2))} config={cardConfig} />
            <MarqueeRow testimonials={mappedTestimonials.slice(Math.ceil(mappedTestimonials.length / 2))} config={cardConfig} reverse />
          </div>
        ) : (
          <>
            {/* Wall of Love with Layout Support */}
            <div className={`w-full ${layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
              {visible.map((t, i) => {
                const mapped: TestimonialItem = {
                  name: t.author_name,
                  company: t.author_company || "",
                  rating: t.rating,
                  content: t.content,
                  avatar: t.author_avatar_url,
                  type: (t.type === "video" ? "video" : "text") as "video" | "text",
                  video_url: t.video_url,
                  initials: initials(t.author_name)
                };
                return (
                  <div key={t.id} className={layout === 'masonry' ? "break-inside-avoid" : ""}>
                    <TestimonialCard 
                      t={mapped} 
                      config={t.type === "video" ? { ...cardConfig, layout: "video" } : cardConfig} 
                      index={i} 
                    />
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-16">
                <button
                  onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 0}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${effectiveTheme === 'dark' ? 'bg-card/50 border-white/10 text-white/60 hover:text-white' : 'bg-card/50 border-border text-muted-foreground hover:text-foreground'} disabled:opacity-30`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPage(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`h-2 rounded-full transition-all duration-300 ${i === page ? "w-6" : "w-2 bg-border"}`}
                      style={i === page ? { backgroundColor: accent } : {}}
                    />
                  ))}
                </div>

                <button
                  onClick={() => { setPage(p => Math.min(totalPages - 1, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages - 1}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${effectiveTheme === 'dark' ? 'bg-card/50 border-white/10 text-white/60 hover:text-white' : 'bg-card/50 border-border text-muted-foreground hover:text-foreground'} disabled:opacity-30`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-32 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30">Powered by</span>
            <VouchyLogo variant="minimal" />
          </div>
          <div className={`flex gap-8 opacity-40 ${effectiveTheme === 'dark' ? 'text-white' : 'text-foreground'}`}>
            <Link to="/privacy" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
