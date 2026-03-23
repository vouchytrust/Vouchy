import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ExternalLink, ChevronLeft, ChevronRight, Link2, CheckCheck, Sun, Moon, TrendingUp, Award, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";
import { VouchyLogo } from "@/components/VouchyLogo";
import { TestimonialCard, TestimonialItem, CardConfig } from "@/components/TestimonialCard";
import { PublicFooter } from "@/components/shared/PublicFooter";

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
    plan?: string | null;
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
  const [userTheme, setUserTheme] = useState<"light" | "dark" | null>(null);
  
  // Widget Customization Support
  const [widgetConfig, setWidgetConfig] = useState<any>(null);
  const PER_PAGE = 12;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/t/" + slug).then(() => {
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
          .from("profile_branding")
          .select("company_name, brand_color, logo_url, plan")
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

  // Workspace-level brand color (the "Theme")
  const pageAccent = space.profiles?.brand_color || "#3b82f6";
  const companyName = space.profiles?.company_name || space.name;
  const logoUrl = space.profiles?.logo_url;
  
  // Widget Customization (the "Cards")
  const layout = searchParams.get("layout") || widgetConfig?.layout || "modern";
  
  const widgetAccent = searchParams.get("accent") 
    ? decodeURIComponent(searchParams.get("accent")!) 
    : (widgetConfig?.accentColor || pageAccent);
  
  const isDarkLink = searchParams.get("darkMode") === "true";
  const isWidgetDark = widgetConfig?.darkMode;
  const initialTheme = searchParams.has("darkMode") ? (isDarkLink ? "dark" : "light") : (widgetConfig ? (isWidgetDark ? "dark" : "light") : theme);
  const effectiveTheme = userTheme || initialTheme;

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
  const fiveStarPct = total > 0 ? Math.round((testimonials.filter(t => t.rating === 5).length / total) * 100) : 100;
  // If the user manually overrides the theme via toggle, we discard the URL-provided static colors 
  // and load the corresponding full palette from the database config to prevent white cards on dark backgrounds.
  const usingInitialUrlTheme = !userTheme || userTheme === initialTheme;
  const urlColor = (param: string) => searchParams.get(param) ? decodeURIComponent(searchParams.get(param)!) : null;
  const dbColor = (param: string) => effectiveTheme === "dark" 
    ? (widgetConfig?.dark?.[param] || widgetConfig?.[param])
    : (widgetConfig?.light?.[param] || widgetConfig?.[param]);
    
  const getColor = (param: string, fallbackLight: string, fallbackDark: string) => {
    if (usingInitialUrlTheme && urlColor(param)) return urlColor(param)!;
    return dbColor(param) || (effectiveTheme === "dark" ? fallbackDark : fallbackLight);
  };

  // Map everything to CardConfig
  const cardConfig: CardConfig = {
    layout: layout === "marquee" ? "modern" : layout,
    darkMode: effectiveTheme === "dark",
    accent: widgetAccent,
    radius: parseInt(searchParams.get("radius") || String(widgetConfig?.radius || 16), 10),
    padding: parseInt(searchParams.get("padding") || String(widgetConfig?.padding || 24), 10),
    shadow: searchParams.get("shadow") || widgetConfig?.shadow || "md",
    font: searchParams.get("font") || widgetConfig?.font || "inter",
    showStars: searchParams.get("showStars") !== "false" && widgetConfig?.showStars !== false,
    showAvatar: searchParams.get("showAvatar") !== "false" && widgetConfig?.showAvatar !== false,
    showCompany: searchParams.get("showCompany") !== "false" && widgetConfig?.showCompany !== false,
    starColor: getColor("starColor", "#f59e0b", "#f59e0b"),
    cardBg: getColor("cardBg", "#ffffff", "hsl(var(--card))"),
    nameColor: getColor("nameColor", "#0f172a", "#ffffff"),
    bodyColor: getColor("bodyColor", "#475569", "rgba(255,255,255,0.8)"),
    companyColor: getColor("companyColor", "#64748b", "rgba(255,255,255,0.5)"),
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
    <div className={`min-h-screen font-sans transition-colors duration-300 ${effectiveTheme === 'dark' ? 'bg-[#000000]' : 'bg-[#f8fafc]'}`} data-theme={effectiveTheme}>
      {/* Page Hero uses Workspace Accent (pageAccent) */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
        <div 
          className="absolute left-1/2 -top-[200px] -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.12] dark:opacity-[0.08]" 
          style={{ backgroundColor: pageAccent }}
        />
        <div 
          className="absolute left-1/4 top-[100px] w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.08] dark:opacity-[0.05]" 
          style={{ backgroundColor: pageAccent }}
        />
      </div>

      {/* TOP ACCENT BAR uses Page Accent */}
      <div 
        className="w-full h-1.5 shrink-0 relative z-[110] shadow-sm"
        style={{ backgroundColor: pageAccent }}
      />

      {/* THEME TOGGLE */}
      <div className="absolute top-6 right-6 z-[100]">
        <button
          onClick={() => setUserTheme(effectiveTheme === "dark" ? "light" : "dark")}
          className="flex w-10 h-10 rounded-2xl items-center justify-center transition-all duration-300 shadow-sm"
          style={{
            backgroundColor: effectiveTheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
            border: `1px solid ${pageAccent}30`,
            color: effectiveTheme === "dark" ? "#ffffff" : "#0f172a",
            backdropFilter: "blur(12px)",
          }}
        >
          {effectiveTheme === "dark" ? <Sun className="h-[18px] w-[18px] opacity-80" /> : <Moon className="h-[18px] w-[18px] opacity-80" />}
        </button>
      </div>

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
              <div 
                className={`mb-6 p-2 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-500`}
                style={{ 
                  backgroundColor: effectiveTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)',
                  borderColor: pageAccent + '30',
                  boxShadow: `0 8px 20px -10px ${pageAccent}40`
                }}
              >
                <img src={logoUrl} alt={companyName} className="h-12 w-auto object-contain rounded-lg" />
              </div>
            )}

            <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6 max-w-4xl ${effectiveTheme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>
              {!logoUrl && <span className="block text-xs uppercase tracking-[0.2em] mb-3" style={{ color: effectiveTheme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b' }}>{companyName}</span>}
              <span className="opacity-60">What people say</span>
              <br />
              <span className="relative" style={{ color: pageAccent }}>
                about us
                <span className="absolute -bottom-2 left-0 w-full h-1 rounded-full opacity-40" style={{ backgroundColor: pageAccent }} />
              </span>
            </h1>

            <p className={`text-lg sm:text-xl font-medium max-w-xl leading-relaxed mb-10 ${effectiveTheme === 'dark' ? 'text-white/60' : 'text-[#475569]'}`}>
              Real stories from real customers. Every review is authentic and independently verified.
            </p>

            {/* Statistics Row uses Page Accent */}
            {total > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 w-full max-w-3xl">
                <StatItem icon={Award} label="Total Reviews" value={total} accent={pageAccent} darkMode={effectiveTheme === 'dark'} />
                <StatItem icon={TrendingUp} label="Average Rating" value={avg + " ★"} accent={pageAccent} darkMode={effectiveTheme === 'dark'} />
                <StatItem icon={Users} label="5-Star Happy" value={fiveStarPct + "%"} accent={pageAccent} darkMode={effectiveTheme === 'dark'} />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                style={{ 
                  backgroundColor: pageAccent, 
                  color: "white",
                  boxShadow: `0 10px 40px -12px ${pageAccent}70`
                }}
              >
                {copied ? <CheckCheck className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Page Link"}
              </button>

              <a
                href={`/c/${space.slug}`}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl border backdrop-blur-sm font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]`}
                style={{
                  borderColor: pageAccent + '30',
                  backgroundColor: effectiveTheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  color: effectiveTheme === 'dark' ? '#ffffff' : '#000000'
                }}
                onMouseEnter={(e) => {
                   e.currentTarget.style.borderColor = pageAccent;
                   e.currentTarget.style.backgroundColor = pageAccent + '08';
                }}
                onMouseLeave={(e) => {
                   e.currentTarget.style.borderColor = pageAccent + '30';
                   e.currentTarget.style.backgroundColor = effectiveTheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
                }}
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
                      style={i === page ? { backgroundColor: pageAccent } : {}}
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

        {/* Vouchy Public Footer */}
        <PublicFooter theme={effectiveTheme as "light" | "dark"} plan={space.profiles?.plan || "free"} />
      </div>
    </div>
  );
}
