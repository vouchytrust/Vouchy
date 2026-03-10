import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Play, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchSpaceBySlug, fetchTestimonialsBySpace } from "@/lib/api";

const fontMap: Record<string, string> = { system: "font-sans", inter: "font-sans", georgia: "font-serif", mono: "font-mono" };
const shadowMap: Record<string, string> = { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg" };

interface CardConfig {
  layout: string;
  darkMode: boolean;
  radius: number;
  padding: number;
  font: string;
  accent: string;
  cardBg: string;
  nameColor: string;
  companyColor: string;
  bodyColor: string;
  starColor: string;
  showStars: boolean;
  showAvatar: boolean;
  showCompany: boolean;
  shadow: string;
  primaryBtnColor: string;
}

interface TestimonialItem {
  name: string;
  company: string;
  rating: number;
  content: string;
  avatar?: string;
  type: string;
  video_url?: string;
  initials: string;
}

function TestimonialCard({ t, config, index }: { t: TestimonialItem; config: CardConfig; index: number }) {
  const { layout, darkMode, radius, padding, font, cardBg, nameColor, companyColor, bodyColor, starColor, showStars, showAvatar, showCompany, shadow } = config;

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isTextOpen, setIsTextOpen] = useState(false);

  const stars = showStars && (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star key={j} className="h-2.5 w-2.5" style={{ color: j < t.rating ? starColor : "#e5e7eb", fill: j < t.rating ? starColor : "none" }} />
      ))}
    </div>
  );

  const avatarSmall = showAvatar && (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: darkMode ? "hsl(240 4% 16%)" : "#f3f4f6" }}>
      {t.avatar ? (
        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xs font-semibold" style={{ color: companyColor }}>{t.initials}</span>
      )}
    </div>
  );

  const avatarLarge = showAvatar && (
    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: starColor + "20" }}>
      {t.avatar ? (
        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-bold" style={{ color: starColor }}>{t.initials}</span>
      )}
    </div>
  );

  const isLongText = t.content.length > 100;

  const contentRenderer = (text: string, isItalic = false, centered = false, isMasonry = false) => (
    <div className={`relative h-full flex flex-col ${centered ? 'items-center' : ''}`}>
      <p
        className={`text-[12.5px] leading-relaxed opacity-90 ${isItalic ? 'italic' : ''} ${centered ? 'text-center' : ''} ${isMasonry ? '' : 'line-clamp-3'}`}
        style={{ color: bodyColor }}
      >
        {isItalic ? `"${t.content}"` : t.content}
      </p>
      {isLongText && !isMasonry && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsTextOpen(true); }}
          className="mt-1 text-primary hover:underline font-bold text-[10.5px] inline-flex items-center gap-0.5 w-fit"
        >
          Read more
        </button>
      )}

      <Dialog open={isTextOpen} onOpenChange={setIsTextOpen}>
        <DialogContent className="max-w-md p-6 sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              {avatarSmall}
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold leading-tight">{t.name}</span>
                {showCompany && <span className="text-[10px] font-medium opacity-50">{t.company}</span>}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/10">
              {stars}
              {t.type === "video" && (
                <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider">Video</div>
              )}
            </div>
            <p className="text-[14px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {t.content}
            </p>
            {t.type === "video" && videoButton}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const videoButton = t.type === "video" && t.video_url && (
    <div className="flex">
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-primary/[0.08] hover:bg-primary/[0.12] text-primary text-[11px] font-bold transition-all group/vbtn active:scale-95 border border-primary/20 shadow-sm">
            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="h-2 w-2 fill-current" />
            </div>
            Watch Video
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-none ring-0 sm:rounded-2xl">
          <div className="aspect-video w-full h-full">
            <video
              src={t.video_url}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const anim = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05, duration: 0.35 } };

  if (layout === "minimal") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} border-b border-border/30 transition-all duration-300 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]`}
        style={{ padding: `${padding}px 0` }}
      >
        <div className="flex items-start gap-4">
          {avatarSmall}
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-semibold tracking-tight" style={{ color: nameColor }}>{t.name}</span>
                {showCompany && <span className="text-[10.5px] opacity-60" style={{ color: companyColor }}>· {t.company}</span>}
              </div>
              <div className="mt-1">{stars}</div>
            </div>

            {t.type === "text" ? (
              contentRenderer(t.content)
            ) : (
              <div className="space-y-2.5">
                {t.content && contentRenderer(t.content)}
                {videoButton}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (layout === "editorial") {
    return (
      <motion.div {...anim} className={`${fontMap[font]} border-l-[3px] ${shadowMap[shadow]} transition-all hover:-translate-y-0.5 flex flex-col h-[220px]`} style={{ padding: `${padding}px`, backgroundColor: cardBg, borderColor: starColor }}>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="overflow-hidden mb-2">
            {contentRenderer(t.content, true)}
          </div>
          {t.type === "video" && <div className="mt-auto shrink-0 pb-1">{videoButton}</div>}
        </div>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/10 shrink-0">
          {avatarSmall}
          <div className="min-w-0">
            <div className="text-[11px] font-bold truncate" style={{ color: nameColor }}>{t.name}</div>
            {showCompany && <div className="text-[9px] opacity-50 truncate" style={{ color: companyColor }}>{t.company}</div>}
          </div>
          <div className="ml-auto shrink-0">{stars}</div>
        </div>
      </motion.div>
    );
  }

  if (layout === "bubble") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} transition-all duration-300 group/bubble hover:-translate-y-1 h-full`}
      >
        <div
          className="relative rounded-[24px] border p-4 shadow-sm transition-all duration-300 group-hover/bubble:shadow-xl border-border/40 flex flex-col h-[260px]"
          style={{
            backgroundColor: cardBg,
            borderColor: darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
            boxShadow: darkMode ? "0 10px 30px -10px rgba(0,0,0,0.5)" : "0 10px 30px -10px rgba(0,0,0,0.05)"
          }}
        >
          <div className="flex items-center justify-between mb-2.5 shrink-0">
            {stars}
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-vouchy-success/10 border border-vouchy-success/20">
              <div className="w-1 h-1 rounded-full bg-vouchy-success animate-pulse" />
              <span className="text-[8.5px] font-bold uppercase tracking-wider text-vouchy-success">Verified</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="mt-2 overflow-hidden relative z-10">
              {contentRenderer(t.content)}
            </div>
            {t.type === "video" && <div className="mt-auto pt-2 shrink-0">{videoButton}</div>}
          </div>

          <div className="flex items-center gap-2.5 pt-2.5 mt-2.5 border-t border-border/10 shrink-0">
            <div className="shrink-0">{avatarSmall}</div>
            <div className="flex flex-col min-w-0">
              <div className="text-[11.5px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
              {showCompany && <div className="text-[9.5px] font-medium opacity-50 truncate" style={{ color: companyColor }}>{t.company}</div>}
            </div>
          </div>

          <div className="absolute -bottom-2 left-8 w-4 h-4 overflow-hidden rotate-45 pointer-events-none">
            <div
              className="w-full h-full border-r border-b"
              style={{ backgroundColor: cardBg, borderColor: darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)" }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  if (layout === "avatar-wall") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} text-center ${shadowMap[shadow]} border transition-all hover:-translate-y-0.5 flex flex-col h-[260px] overflow-hidden`}
        style={{ borderRadius: `${radius}px`, padding: `${padding + 2}px`, backgroundColor: cardBg, borderColor: darkMode ? "#333" : "#e5e7eb" }}
      >
        <div className="shrink-0 flex flex-col items-center">
          <div className="mb-1.5">{avatarLarge}</div>
          <div className="text-[11.5px] font-bold tracking-tight truncate w-full px-2" style={{ color: nameColor }}>{t.name}</div>
          {showCompany && <div className="text-[9.5px] opacity-50 mb-1 truncate w-full px-2" style={{ color: companyColor }}>{t.company}</div>}
          <div className="mb-2">{stars}</div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="overflow-hidden">
            {contentRenderer(t.content, false, true)}
          </div>
          {t.type === "video" && <div className="mt-auto pt-1 flex justify-center shrink-0">{videoButton}</div>}
        </div>
      </motion.div>
    );
  }

  if (layout === "masonry") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} border ${shadowMap[shadow]} transition-all duration-300 hover:shadow-lg break-inside-avoid mb-4 flex flex-col`}
        style={{
          borderRadius: `${radius}px`,
          padding: `${padding}px`,
          backgroundColor: cardBg,
          borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"
        }}
      >
        <div className="flex items-center gap-2.5 mb-2.5 shrink-0">
          {avatarSmall}
          <div className="min-w-0">
            <div className="text-[12px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
            {showCompany && <div className="text-[9.5px] opacity-50 truncate" style={{ color: companyColor }}>{t.company}</div>}
          </div>
        </div>
        <div className="flex-1">
          {contentRenderer(t.content, false, false, true)}
          {t.type === "video" && <div className="mt-2 shrink-0">{videoButton}</div>}
        </div>
        <div className="mt-3 pt-2.5 border-t border-border/10 shrink-0">
          {stars}
        </div>
      </motion.div>
    );
  }

  // Default: Clean
  return (
    <motion.div
      {...anim}
      className={`${fontMap[font]} border ${shadowMap[shadow]} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group/card flex flex-col h-[220px]`}
      style={{
        borderRadius: `${radius}px`,
        padding: `${padding}px`,
        backgroundColor: cardBg,
        borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"
      }}
    >
      <div className="flex items-center gap-2.5 mb-2.5 shrink-0">
        {avatarSmall}
        <div className="min-w-0">
          <div className="text-[12px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
          {showCompany && <div className="text-[9.5px] opacity-50 truncate" style={{ color: companyColor }}>{t.company}</div>}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="overflow-hidden relative">
          {contentRenderer(t.content)}
        </div>
        {t.type === "video" && <div className="mt-auto shrink-0 pt-1">{videoButton}</div>}
      </div>
      <div className="mt-2 pt-2 border-t border-border/10 shrink-0">
        {stars}
      </div>
    </motion.div>
  );
}

function MarqueeRow({ testimonials, config, reverse }: { testimonials: TestimonialItem[]; config: CardConfig; reverse?: boolean }) {
  const items = [...testimonials, ...testimonials];
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-3"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {items.map((t, i) => (
          <div key={i} className="shrink-0 w-[350px]">
            <TestimonialCard t={t} config={{ ...config, layout: "clean" }} index={0} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function ViewTestimonialsPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [space, setSpace] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const layout = searchParams.get("layout") || "clean";
  const minRating = parseInt(searchParams.get("minRating") || "0", 10);
  const max = parseInt(searchParams.get("max") || "50", 10);

  const config: CardConfig = {
    layout,
    darkMode: searchParams.get("darkMode") === "true",
    radius: parseInt(searchParams.get("radius") || "12", 10),
    padding: parseInt(searchParams.get("padding") || "16", 10),
    font: searchParams.get("font") || "system",
    accent: decodeURIComponent(searchParams.get("accent") || "#10b981"),
    cardBg: decodeURIComponent(searchParams.get("cardBg") || "#ffffff"),
    nameColor: decodeURIComponent(searchParams.get("nameColor") || "#1a1a1a"),
    companyColor: decodeURIComponent(searchParams.get("companyColor") || "#888888"),
    bodyColor: decodeURIComponent(searchParams.get("bodyColor") || "#666666"),
    starColor: decodeURIComponent(searchParams.get("starColor") || "#f59e0b"),
    showStars: searchParams.get("showStars") !== "false",
    showAvatar: searchParams.get("showAvatar") !== "false",
    showCompany: searchParams.get("showCompany") !== "false",
    shadow: searchParams.get("shadow") || "sm",
    primaryBtnColor: decodeURIComponent(searchParams.get("primaryBtnColor") || "#3b82f6"),
  };

  const displayMode = searchParams.get("displayMode") || "grid";
  const carouselVisible = parseInt(searchParams.get("carouselVisible") || "3", 10);
  const navStyle = searchParams.get("navStyle") || "arrows";
  const autoPlay = searchParams.get("autoPlay") === "true";
  const autoPlaySpeed = parseInt(searchParams.get("autoPlaySpeed") || "3000", 10);
  const navIconColor = decodeURIComponent(searchParams.get("navIconColor") || "#1a1a1a");
  const navBgColor = decodeURIComponent(searchParams.get("navBgColor") || "#ffffff");

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const spaceData = await fetchSpaceBySlug(slug);
        setSpace(spaceData);
        const data = await fetchTestimonialsBySpace(spaceData.id);
        const mapped = (data as any[]).filter(t => t.status === "approved" && t.rating >= minRating).slice(0, max).map(t => ({
          name: t.author_name,
          company: t.author_company || "",
          rating: t.rating,
          content: t.content,
          avatar: t.author_avatar_url,
          type: t.type,
          video_url: t.video_url,
          initials: t.author_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2),
        }));
        setTestimonials(mapped);
      } catch (err) { console.error("Failed:", err); } finally { setLoading(false); }
    }
    loadData();
  }, [slug, minRating, max]);

  const visibleTestimonials = isExpanded ? testimonials : testimonials.slice(0, 6);
  const hasMore = testimonials.length > 6;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: config.darkMode ? "#0a0a0a" : "#f9fafb" }}>
      <div className="w-8 h-8 border-2 border-current rounded-full animate-spin" style={{ borderColor: config.accent, borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.darkMode ? "#0a0a0a" : "#f9fafb" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2" style={{ color: config.darkMode ? "#fff" : "#1a1a1a" }}>{space?.name || "Testimonials"}</h1>
          <p style={{ color: config.darkMode ? "#9ca3af" : "#6b7280" }}>{testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}</p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: config.darkMode ? "#9ca3af" : "#6b7280" }}>No testimonials yet.</p>
          </div>
        ) : layout === "marquee" ? (
          <div className="space-y-4">
            <MarqueeRow testimonials={testimonials.slice(0, Math.ceil(testimonials.length / 2))} config={config} />
            <MarqueeRow testimonials={testimonials.slice(Math.ceil(testimonials.length / 2))} config={config} reverse />
          </div>
        ) : layout === "masonry" ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} config={config} index={i} />
            ))}
          </div>
        ) : displayMode === "carousel" ? (
          <CarouselView 
            testimonials={testimonials} 
            config={config}
            carouselVisible={carouselVisible}
            navStyle={navStyle}
            navIconColor={navIconColor}
            navBgColor={navBgColor}
            autoPlay={autoPlay}
            autoPlaySpeed={autoPlaySpeed}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleTestimonials.map((t, i) => (
                <TestimonialCard key={i} t={t} config={config} index={i} />
              ))}
            </div>
            {hasMore && !isExpanded && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setIsExpanded(true)} 
                  className="flex items-center gap-2 px-5 py-2 rounded-full border transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[12px] font-semibold"
                  style={{ color: config.primaryBtnColor, borderColor: config.primaryBtnColor + "40" }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                  Show more ({testimonials.length - 6} more)
                </button>
              </div>
            )}
            {isExpanded && hasMore && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setIsExpanded(false)} 
                  className="flex items-center gap-2 px-5 py-2 rounded-full border transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[12px] font-semibold"
                  style={{ color: config.primaryBtnColor, borderColor: config.primaryBtnColor + "40" }}
                >
                  Show less
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CarouselView({ testimonials, config, carouselVisible, navStyle, navIconColor, navBgColor, autoPlay, autoPlaySpeed }: {
  testimonials: TestimonialItem[];
  config: CardConfig;
  carouselVisible: number;
  navStyle: string;
  navIconColor: string;
  navBgColor: string;
  autoPlay: boolean;
  autoPlaySpeed: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (autoPlay && testimonials.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / carouselVisible));
      }, autoPlaySpeed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoPlay, autoPlaySpeed, testimonials.length, carouselVisible]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / carouselVisible));
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + Math.ceil(testimonials.length / carouselVisible)) % Math.ceil(testimonials.length / carouselVisible));

  const visible = testimonials.slice(currentIndex * carouselVisible, (currentIndex + 1) * carouselVisible);

  return (
    <div>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${carouselVisible}, minmax(0, 1fr))` }}>
        {visible.map((t, i) => <TestimonialCard key={i} t={t} config={config} index={i} />)}
      </div>
      {navStyle !== "none" && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button onClick={prevSlide} className="w-9 h-9 rounded-full border" style={{ backgroundColor: navBgColor, color: navIconColor }}><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={nextSlide} className="w-9 h-9 rounded-full border" style={{ backgroundColor: navBgColor, color: navIconColor }}><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
