import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Monitor, Tablet, Smartphone, Code, Star, Lock, ExternalLink,
  Copy, Check, LayoutGrid, Rows3, GalleryHorizontalEnd,
  MessageCircle, Users, Layers3, Quote,
  FolderOpen, Play, ChevronDown, Columns2, ChevronLeft, ChevronRight, Circle,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { fetchSpaces, fetchTestimonialsBySpace } from "@/lib/api";

/* ── Layout definitions ── */
interface Layout {
  id: string;
  name: string;
  icon: React.ReactNode;
  free: boolean;
}

const layouts: Layout[] = [
  { id: "clean", name: "Clean", icon: <LayoutGrid className="h-3.5 w-3.5" />, free: true },
  { id: "minimal", name: "Minimal", icon: <Rows3 className="h-3.5 w-3.5" />, free: true },
  { id: "editorial", name: "Editorial", icon: <Quote className="h-3.5 w-3.5" />, free: false },
  { id: "bubble", name: "Bubble", icon: <MessageCircle className="h-3.5 w-3.5" />, free: false },
  { id: "avatar-wall", name: "Avatar Wall", icon: <Users className="h-3.5 w-3.5" />, free: false },
  { id: "marquee", name: "Marquee", icon: <GalleryHorizontalEnd className="h-3.5 w-3.5" />, free: false },
  { id: "masonry", name: "Masonry", icon: <Layers3 className="h-3.5 w-3.5" />, free: false },
];

const devices = [
  { id: "desktop", icon: Monitor },
  { id: "tablet", icon: Tablet },
  { id: "mobile", icon: Smartphone },
];

interface TestimonialItem {
  name: string;
  company: string;
  rating: number;
  content: string;
  initials: string;
  avatar?: string | null;
  type: "text" | "video";
  video_url?: string | null;
}

/* ── Card config ── */
interface CardConfig {
  layout: string;
  darkMode: boolean;
  radius: number;
  padding: number;
  shadow: string;
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
}

const shadowMap: Record<string, string> = { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg" };
const fontMap: Record<string, string> = { system: "font-sans", inter: "font-sans", georgia: "font-serif", mono: "font-mono" };

function TestimonialCard({ t, config, index }: { t: TestimonialItem; config: CardConfig; index: number }) {
  const { layout, darkMode, radius, padding, font, cardBg, nameColor, companyColor, bodyColor, starColor, showStars, showAvatar, showCompany, shadow } = config;

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

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isTextOpen, setIsTextOpen] = useState(false);

  const isLongText = t.content.length > 100;
  const displayText = isLongText ? t.content.slice(0, 95) + "..." : t.content;

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
          {/* Header */}
          <div className="flex items-center justify-between mb-2.5 shrink-0">
            {stars}
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-vouchy-success/10 border border-vouchy-success/20">
              <div className="w-1 h-1 rounded-full bg-vouchy-success animate-pulse" />
              <span className="text-[8.5px] font-bold uppercase tracking-wider text-vouchy-success">Verified</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="mt-2 overflow-hidden relative z-10">
              {contentRenderer(t.content)}
            </div>
            {t.type === "video" && <div className="mt-auto pt-2 shrink-0">{videoButton}</div>}
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-2.5 pt-2.5 mt-2.5 border-t border-border/10 shrink-0">
            <div className="shrink-0">{avatarSmall}</div>
            <div className="flex flex-col min-w-0">
              <div className="text-[11.5px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
              {showCompany && <div className="text-[9.5px] font-medium opacity-50 truncate" style={{ color: companyColor }}>{t.company}</div>}
            </div>
          </div>

          {/* Tail */}
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

/* ── Marquee row ── */
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

/* ── Main ── */
export default function WidgetLabPage() {
  const [selectedLayout, setSelectedLayout] = useState("clean");
  const [device, setDevice] = useState("desktop");
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [embedType, setEmbedType] = useState<"script" | "iframe">("script");
  const [mobileTab, setMobileTab] = useState<"editor" | "live">("editor");
  const [displayMode, setDisplayMode] = useState<"grid" | "carousel">("grid");
  const [gridLimit, setGridLimit] = useState([6]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [carouselVisible, setCarouselVisible] = useState([3]);
  const [navStyle, setNavStyle] = useState<"arrows" | "dots" | "none">("arrows");
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState("3000");
  const [minRating, setMinRating] = useState(0);
  const [maxItems, setMaxItems] = useState([50]);
  const carouselApiRef = useRef<any>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringCarousel = useRef(false);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isHoveringCarousel.current && carouselApiRef.current) {
        carouselApiRef.current.scrollNext();
      }
    }, parseInt(autoPlaySpeed));
  }, [autoPlaySpeed]);

  useEffect(() => {
    if (autoPlay && displayMode === "carousel") {
      startAutoPlay();
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [autoPlay, autoPlaySpeed, displayMode, startAutoPlay]);

  const [spaces, setSpaces] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("");
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);

  const [cardRadius, setCardRadius] = useState([12]);
  const [cardPadding, setCardPadding] = useState([16]);
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [cardBg, setCardBg] = useState("#ffffff");
  const [nameColor, setNameColor] = useState("#1a1a1a");
  const [companyColor, setCompanyColor] = useState("#888888");
  const [bodyColor, setBodyColor] = useState("#666666");
  const [starColor, setStarColor] = useState("#f59e0b");
  const [showStars, setShowStars] = useState(true);
  const [showAvatar, setShowAvatar] = useState(true);
  const [showCompany, setShowCompany] = useState(true);
  const [fontFamily, setFontFamily] = useState("system");
  const [cardShadow, setCardShadow] = useState("sm");
  const [navIconColor, setNavIconColor] = useState("#1a1a1a");
  const [navBgColor, setNavBgColor] = useState("#ffffff");
  const [primaryBtnColor, setPrimaryBtnColor] = useState("#3b82f6");
  const { toast } = useToast();

  // Auto-apply dark/light color palette when dark mode is toggled
  useEffect(() => {
    if (darkMode) {
      setCardBg("#1c1c1e");
      setNameColor("#f5f5f7");
      setCompanyColor("#8e8e93");
      setBodyColor("#aeaeb2");
      setNavIconColor("#ffffff");
      setNavBgColor("#2c2c2e");
      setPrimaryBtnColor("#ffffff");
    } else {
      setCardBg("#ffffff");
      setNameColor("#1a1a1a");
      setCompanyColor("#888888");
      setBodyColor("#666666");
      setNavIconColor("#1a1a1a");
      setNavBgColor("#ffffff");
      setPrimaryBtnColor("#1a1a1a");
    }
  }, [darkMode]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSpaces();
        const s = (data as any[]).map(d => ({ id: d.id, name: d.name, slug: d.slug }));
        setSpaces(s);
        if (s.length > 0) setSelectedSpaceId(s[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSpaces(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedSpaceId) { setTestimonials([]); return; }
    async function load() {
      setLoadingTestimonials(true);
      try {
        const data = await fetchTestimonialsBySpace(selectedSpaceId);
        const mapped = (data as any[])
          .filter(t => t.status === "approved")
          .map(t => ({
            name: t.author_name,
            company: t.author_company || "",
            rating: t.rating,
            content: t.content,
            avatar: t.author_avatar_url,
            type: t.type as "text" | "video",
            video_url: t.video_url,
            initials: t.author_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2),
          }));
        setTestimonials(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTestimonials(false);
      }
    }
    load();
  }, [selectedSpaceId]);

  const cardConfig: CardConfig = {
    layout: selectedLayout, darkMode, radius: cardRadius[0], padding: cardPadding[0],
    shadow: cardShadow, font: fontFamily, accent: accentColor,
    cardBg, nameColor, companyColor, bodyColor, starColor,
    showStars, showAvatar, showCompany,
  };

  const selectedSpace = spaces.find(s => s.id === selectedSpaceId);

  // Derived: apply filter + cap
  const visibleTestimonials = testimonials
    .filter(t => t.rating >= minRating)
    .slice(0, maxItems[0]);

  // Using window.location.origin so embedded links work locally and in production
  const embedParams = new URLSearchParams({
    layout: selectedLayout,
    minRating: String(minRating),
    max: String(maxItems[0]),
    darkMode: String(darkMode),
    radius: String(cardRadius[0]),
    padding: String(cardPadding[0]),
    font: fontFamily,
    accent: encodeURIComponent(accentColor),
    cardBg: encodeURIComponent(cardBg),
    nameColor: encodeURIComponent(nameColor),
    companyColor: encodeURIComponent(companyColor),
    bodyColor: encodeURIComponent(bodyColor),
    starColor: encodeURIComponent(starColor),
    showStars: String(showStars),
    showAvatar: String(showAvatar),
    showCompany: String(showCompany),
    shadow: cardShadow,
    displayMode: displayMode,
    carouselVisible: String(carouselVisible[0]),
    navStyle: navStyle,
    autoPlay: String(autoPlay),
    autoPlaySpeed: autoPlaySpeed,
    navIconColor: encodeURIComponent(navIconColor),
    navBgColor: encodeURIComponent(navBgColor),
    primaryBtnColor: encodeURIComponent(primaryBtnColor),
  });
  
  const embedUrl = `${window.location.origin}/embed/${selectedSpace?.slug || ""}?${embedParams.toString()}`;
  const viewUrl = `${window.location.origin}/view/${selectedSpace?.slug || ""}?${embedParams.toString()}`;
  const scriptCode = `<script src="${window.location.origin}/embed.js" data-workspace="ws_demo" data-space="${selectedSpace?.slug || ""}" data-layout="${selectedLayout}" data-min-rating="${minRating}" data-max="${maxItems[0]}" data-dark-mode="${darkMode}" data-radius="${cardRadius[0]}" data-padding="${cardPadding[0]}" data-font="${fontFamily}" data-accent="${encodeURIComponent(accentColor)}" data-card-bg="${encodeURIComponent(cardBg)}" data-name-color="${encodeURIComponent(nameColor)}" data-company-color="${encodeURIComponent(companyColor)}" data-body-color="${encodeURIComponent(bodyColor)}" data-star-color="${encodeURIComponent(starColor)}" data-show-stars="${showStars}" data-show-avatar="${showAvatar}" data-show-company="${showCompany}" data-shadow="${cardShadow}" data-display-mode="${displayMode}" data-carousel-visible="${carouselVisible[0]}" data-nav-style="${navStyle}" data-auto-play="${autoPlay}" data-auto-play-speed="${autoPlaySpeed}" data-nav-icon-color="${encodeURIComponent(navIconColor)}" data-nav-bg-color="${encodeURIComponent(navBgColor)}" data-primary-btn-color="${encodeURIComponent(primaryBtnColor)}"></script>`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${selectedLayout === 'marquee' ? '300' : '650'}" style="border:none;overflow:hidden;background:transparent;"></iframe>`;

  const activeEmbedCode = embedType === "script" ? scriptCode : iframeCode;

  const copyEmbed = () => {
    navigator.clipboard.writeText(activeEmbedCode);
    setCopied(true);
    toast({ title: "Embed code copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  const copyViewUrl = () => {
    navigator.clipboard.writeText(viewUrl);
    setCopied(true);
    toast({ title: "Full view URL copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLayout = layouts.find(l => l.id === selectedLayout);

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-7rem)]">

      {/* ── Mobile tab toggle ── */}
      <div className="lg:hidden flex items-center justify-center px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-full w-full max-w-xs">
          <button
            onClick={() => setMobileTab("editor")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold transition-all duration-200 ${mobileTab === "editor"
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Code className="h-3.5 w-3.5" />
            Editor
          </button>
          <button
            onClick={() => setMobileTab("live")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold transition-all duration-200 ${mobileTab === "live"
              ? "bg-card text-foreground shadow-sm border border-border/60"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            Live View
          </button>
        </div>
      </div>

      {/* ── Left: Editor controls ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`w-full lg:w-72 shrink-0 flex-col border-b lg:border-b-0 lg:border-r border-border bg-card/50 overflow-hidden ${mobileTab === "editor" ? "flex" : "hidden lg:flex"
          }`}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center justify-between gap-2.5 mb-1">
            <h1 className="text-[17px] font-semibold text-foreground">Widget Design</h1>
          </div>
          <p className="text-2xs text-muted-foreground">Design and preview your embed widget.</p>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Source Collector */}
          <div>
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Source Collector</p>
            {loadingSpaces ? (
              <div className="h-8 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : spaces.length === 0 ? (
              <div className="text-center py-3 rounded-lg border border-dashed border-border">
                <FolderOpen className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground">No collectors yet</p>
                <a href="/dashboard/spaces" className="text-[10px] text-primary hover:underline">Create one</a>
              </div>
            ) : (
              <Select value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
                <SelectTrigger className="h-8 text-[12px]">
                  <SelectValue placeholder="Select a collector" />
                </SelectTrigger>
                <SelectContent>
                  {spaces.map(s => (
                    <SelectItem key={s.id} value={s.id} className="text-[12px]">{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Designs */}
          <div>
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Designs</p>
            <div className="grid grid-cols-3 gap-1">
              {layouts.map(l => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLayout(l.id)}
                  className={`relative flex flex-col items-center gap-1 p-2.5 rounded-lg text-center transition-all duration-150 ${selectedLayout === l.id
                    ? "bg-primary/[0.08] ring-1 ring-primary/30 text-foreground"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <span className={selectedLayout === l.id ? "text-primary" : ""}>{l.icon}</span>
                  <span className="text-[10px] font-medium leading-tight">{l.name}</span>
                  {!l.free && <Lock className="absolute top-1 right-1 h-2 w-2 text-muted-foreground/40" />}
                </button>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-3.5 pt-3 border-t border-border">
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Appearance</p>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground">Dark mode</span>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3.5 pt-3 border-t border-border">
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Colors</p>
            {([
              { label: "Card background", value: cardBg, set: setCardBg },
              { label: "Name", value: nameColor, set: setNameColor },
              { label: "Company", value: companyColor, set: setCompanyColor },
              { label: "Testimonial", value: bodyColor, set: setBodyColor },
              { label: "Stars", value: starColor, set: setStarColor },
              { label: "Nav arrows", value: navIconColor, set: setNavIconColor },
              { label: "Nav background", value: navBgColor, set: setNavBgColor },
              { label: "Main button", value: primaryBtnColor, set: setPrimaryBtnColor },
            ] as const).map(({ label, value, set }) => (
              <div key={label} className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">{label}</Label>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: value }} />
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0"
                  />
                </div>
              </div>
            ))}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[11px] text-muted-foreground">Border radius</Label>
                <span className="text-[10px] text-muted-foreground font-mono">{cardRadius[0]}px</span>
              </div>
              <Slider value={cardRadius} onValueChange={setCardRadius} min={0} max={24} step={2} className="w-full" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[11px] text-muted-foreground">Card padding</Label>
                <span className="text-[10px] text-muted-foreground font-mono">{cardPadding[0]}px</span>
              </div>
              <Slider value={cardPadding} onValueChange={setCardPadding} min={8} max={32} step={2} className="w-full" />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground mb-1.5 block">Shadow</Label>
              <Select value={cardShadow} onValueChange={setCardShadow}>
                <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-[11px]">None</SelectItem>
                  <SelectItem value="sm" className="text-[11px]">Small</SelectItem>
                  <SelectItem value="md" className="text-[11px]">Medium</SelectItem>
                  <SelectItem value="lg" className="text-[11px]">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground mb-1.5 block">Font</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="system" className="text-[11px]">System Default</SelectItem>
                  <SelectItem value="inter" className="text-[11px]">Inter</SelectItem>
                  <SelectItem value="georgia" className="text-[11px]">Georgia</SelectItem>
                  <SelectItem value="mono" className="text-[11px]">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Display Mode */}
          {selectedLayout !== "marquee" && selectedLayout !== "masonry" && (
            <div className="space-y-3 pt-3 border-t border-border">
              <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Display</p>
              {/* Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => { setDisplayMode("grid"); setIsExpanded(false); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${displayMode === "grid" ? "bg-background text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutGrid className="h-3 w-3" /> Grid
                </button>
                <button
                  onClick={() => setDisplayMode("carousel")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${displayMode === "carousel" ? "bg-background text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Columns2 className="h-3 w-3" /> Slider
                </button>
              </div>

              {displayMode === "grid" ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-[11px] text-muted-foreground">Initial rows shown</Label>
                    <span className="text-[10px] text-muted-foreground font-mono">{gridLimit[0]}</span>
                  </div>
                  <Slider value={gridLimit} onValueChange={(v) => { setGridLimit(v); setIsExpanded(false); }} min={1} max={12} step={1} className="w-full" />
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5">A "Show more" button appears if more testimonials exist.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-[11px] text-muted-foreground">Cards visible at once</Label>
                      <span className="text-[10px] text-muted-foreground font-mono">{carouselVisible[0]}</span>
                    </div>
                    <Slider value={carouselVisible} onValueChange={setCarouselVisible} min={1} max={4} step={1} className="w-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] text-muted-foreground">Auto-play</Label>
                    <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
                  </div>
                  {autoPlay && (
                    <div>
                      <Label className="text-[11px] text-muted-foreground mb-1.5 block">Speed</Label>
                      <div className="grid grid-cols-3 gap-1">
                        {([{ label: "Slow", val: "5000" }, { label: "Med", val: "3000" }, { label: "Fast", val: "1500" }]).map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => setAutoPlaySpeed(opt.val)}
                            className={`py-1.5 rounded-md text-[10.5px] font-semibold transition-all border ${autoPlaySpeed === opt.val ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-[11px] text-muted-foreground mb-2 block">Navigation style</Label>
                    <div className="grid grid-cols-3 gap-1">
                      {(["arrows", "dots", "none"] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => setNavStyle(opt)}
                          className={`py-1.5 rounded-md text-[10.5px] font-semibold transition-all border capitalize ${navStyle === opt ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filter */}
          <div className="space-y-3 pt-3 border-t border-border">
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Filter</p>
            <div>
              <Label className="text-[11px] text-muted-foreground mb-2 block">Minimum star rating</Label>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all border ${minRating === r ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
                  >
                    {r === 0 ? "All" : `${r}★`}
                  </button>
                ))}
              </div>
              {minRating > 0 && (
                <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                  Showing {testimonials.filter(t => t.rating >= minRating).length} of {testimonials.length}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[11px] text-muted-foreground">Max testimonials shown</Label>
                <span className="text-[10px] text-muted-foreground font-mono">{maxItems[0] >= 50 ? "All" : maxItems[0]}</span>
              </div>
              <Slider value={maxItems} onValueChange={setMaxItems} min={1} max={50} step={1} className="w-full" />
              <p className="text-[10px] text-muted-foreground/60 mt-1.5">Cap for the embedded widget.</p>
            </div>
          </div>

          {/* Content toggles */}
          <div className="space-y-3 pt-3 border-t border-border">
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Content</p>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground">Star ratings</span>
              <Switch checked={showStars} onCheckedChange={setShowStars} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground">Avatars</span>
              <Switch checked={showAvatar} onCheckedChange={setShowAvatar} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground">Company name</span>
              <Switch checked={showCompany} onCheckedChange={setShowCompany} />
            </div>
          </div>
        </div>

        {/* Footer: Get Embed Code */}
        <div className="p-4 border-t border-border">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full h-9 text-xs gap-1.5" disabled={testimonials.length === 0}>
                <Code className="h-3.5 w-3.5" /> Get Embed Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-base flex items-center justify-between pr-6">
                  Embed Widget
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-full mb-2">
                <button
                  onClick={() => setEmbedType("script")}
                  className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-[12px] font-semibold transition-all ${embedType === "script" ? "bg-background text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Vanilla JS / HTML
                </button>
                <button
                  onClick={() => setEmbedType("iframe")}
                  className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-[12px] font-semibold transition-all ${embedType === "iframe" ? "bg-background text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"}`}
                >
                  React / Next.js / Iframe
                </button>
              </div>

              {embedType === "iframe" && (
                <div className="text-[12px] text-muted-foreground bg-primary/5 rounded-lg p-3 border border-primary/20 flex gap-2">
                  <div className="shrink-0 mt-0.5"><Code className="w-4 h-4 text-primary" /></div>
                  <p>Most frameworks like React, Next.js, and Vue strip out dynamic `{'<script>'}` tags. Use this direct `{'<iframe>'}` snippet instead to guarantee it renders perfectly.</p>
                </div>
              )}

              <div className="bg-muted rounded-xl p-4 border border-border">
                <code className="text-[11px] text-foreground break-all leading-relaxed font-mono">
                  {activeEmbedCode}
                </code>
              </div>
              <Button onClick={copyEmbed} className="w-full h-9 text-[13px] mt-1 gap-1.5">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Embed Code"}
              </Button>
              <Button onClick={copyViewUrl} variant="outline" className="w-full h-9 text-[13px] mt-2 gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Copy Full View URL
              </Button>
              <a 
                href={viewUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center h-9 text-[13px] mt-2 gap-1.5 px-3 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-center"
              >
                Open Full View Page
              </a>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* ── Right: Preview ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className={`flex-1 flex-col min-w-0 bg-background ${mobileTab === "live" ? "flex" : "hidden lg:flex"}`}
      >
        {/* MOBILE: bold message only, no preview */}
        <div className="lg:hidden flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
          <Monitor className="h-12 w-12 text-muted-foreground/20 mb-5" />
          <p className="text-[16px] font-bold text-foreground leading-snug mb-2">
            Best previewed on desktop or tablet
          </p>
          <p className="text-[12px] text-muted-foreground max-w-[220px]">
            Open this page on a larger screen to see the live widget preview.
          </p>
        </div>

        {/* DESKTOP: full toolbar + browser preview */}
        <div className="hidden lg:flex flex-col flex-1 min-h-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              {/* Device switcher */}
              <div className="flex items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">
                {devices.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDevice(d.id)}
                    className={`p-1.5 rounded-md transition-all duration-150 ${device === d.id
                      ? "bg-background text-foreground vouchy-shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <d.icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
              {/* Layout badge */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-2xs font-medium gap-1 py-0.5">
                  {currentLayout?.icon}
                  {currentLayout?.name}
                </Badge>
                {currentLayout && !currentLayout.free && (
                  <Badge variant="outline" className="text-2xs py-0.5 text-primary border-primary/30">PRO</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-2xs gap-1 text-muted-foreground"
                onClick={copyEmbed}
                disabled={testimonials.length === 0}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                Copy
              </Button>
              <a
                href={selectedSpace ? viewUrl : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!selectedSpace}
                className={`flex items-center gap-1 h-7 px-2 text-2xs font-medium rounded-md transition-colors ${selectedSpace ? "text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer" : "text-muted-foreground/30 cursor-not-allowed pointer-events-none"}`}
              >
                <ExternalLink className="h-3 w-3" />
                Open
              </a>
            </div>
          </div>

          {/* Browser frame */}
          <div className="flex-1 p-4 overflow-hidden flex justify-center">
            <motion.div
              className="h-full rounded-xl border border-border bg-card overflow-hidden flex flex-col vouchy-shadow-sm"
              animate={{ maxWidth: device === "mobile" ? "375px" : device === "tablet" ? "768px" : "100%" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ width: "100%" }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/20">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--vouchy-warning))]/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--vouchy-success))]/20" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-6 py-1 rounded-lg bg-muted/60 border border-border text-2xs text-muted-foreground font-mono">
                    yourwebsite.com
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`flex-1 overflow-y-auto transition-colors duration-300 ${darkMode ? "bg-[hsl(240_10%_4%)]" : "bg-background"}`}>
                {loadingTestimonials ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : visibleTestimonials.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <FolderOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <h3 className="text-[14px] font-medium text-muted-foreground mb-1">
                      {spaces.length === 0 ? "No spaces yet" : minRating > 0 ? `No ${minRating}★+ testimonials` : "No approved testimonials"}
                    </h3>
                    <p className="text-[12px] text-muted-foreground/60 max-w-[240px]">
                      {spaces.length === 0
                        ? "Create a space and collect testimonials to preview your widget."
                        : minRating > 0
                          ? "Try lowering the minimum star rating filter."
                          : "Approve testimonials in the Testimonials page to see them here."}
                    </p>
                  </div>
                ) : (
                  <div className={device === "desktop" ? "p-8" : "p-4"}>
                    {selectedLayout === "marquee" ? (
                      <div className="space-y-3">
                        <MarqueeRow testimonials={visibleTestimonials.slice(0, Math.ceil(visibleTestimonials.length / 2))} config={cardConfig} />
                        <MarqueeRow testimonials={visibleTestimonials.slice(Math.ceil(visibleTestimonials.length / 2))} config={cardConfig} reverse />
                      </div>
                    ) : selectedLayout === "masonry" ? (
                      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                        {visibleTestimonials.map((t, i) => (
                          <TestimonialCard key={i} t={t} config={cardConfig} index={i} />
                        ))}
                      </div>
                    ) : displayMode === "carousel" ? (
                      <div className="space-y-4">
                        <Carousel
                          opts={{ align: "start", loop: true }}
                          setApi={(api) => { carouselApiRef.current = api; }}
                          onMouseEnter={() => { isHoveringCarousel.current = true; }}
                          onMouseLeave={() => { isHoveringCarousel.current = false; }}
                        >
                          <CarouselContent className="-ml-3">
                            {visibleTestimonials.map((t, i) => (
                              <CarouselItem
                                key={i}
                                className={`pl-3 ${carouselVisible[0] === 1 ? "basis-full" :
                                  carouselVisible[0] === 2 ? "basis-1/2" :
                                    carouselVisible[0] === 3 ? "basis-1/3" : "basis-1/4"
                                  }`}
                              >
                                <TestimonialCard t={t} config={cardConfig} index={i} />
                              </CarouselItem>
                            ))}
                          </CarouselContent>

                          {navStyle === "arrows" && (
                            <div className="flex items-center justify-center gap-3 mt-5">
                              <CarouselPrevious
                                className="static translate-y-0 h-9 w-9 rounded-full border shadow-sm hover:brightness-110 active:scale-95 transition-all"
                                style={{
                                  color: navIconColor,
                                  backgroundColor: navBgColor,
                                  borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                                }}
                              />
                              <CarouselNext
                                className="static translate-y-0 h-9 w-9 rounded-full border shadow-sm hover:brightness-110 active:scale-95 transition-all"
                                style={{
                                  color: navIconColor,
                                  backgroundColor: navBgColor,
                                  borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                                }}
                              />
                            </div>
                          )}
                          {navStyle === "dots" && (
                            <div className="flex items-center justify-center gap-2 mt-5">
                              <CarouselPrevious
                                className="static translate-y-0 h-7 w-7 rounded-full border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 p-0 shadow-none text-current"
                                style={{ color: navIconColor }}
                              />
                              {visibleTestimonials.slice(0, Math.min(visibleTestimonials.length, 8)).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: navIconColor, opacity: 0.3 }} />
                              ))}
                              <CarouselNext
                                className="static translate-y-0 h-7 w-7 rounded-full border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 p-0 shadow-none text-current"
                                style={{ color: navIconColor }}
                              />
                            </div>
                          )}
                        </Carousel>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(isExpanded ? visibleTestimonials : visibleTestimonials.slice(0, gridLimit[0])).map((t, i) => (
                            <TestimonialCard key={i} t={t} config={cardConfig} index={i} />
                          ))}
                        </div>
                        {!isExpanded && visibleTestimonials.length > gridLimit[0] && (
                          <div className="mt-6 flex justify-center">
                            <button
                              onClick={() => setIsExpanded(true)}
                              className="flex items-center gap-2 px-5 py-2 rounded-full border transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[12px] font-semibold"
                              style={{
                                color: primaryBtnColor,
                                borderColor: primaryBtnColor + "40"
                              }}
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                              Show more ({visibleTestimonials.length - gridLimit[0]} more)
                            </button>
                          </div>
                        )}
                        {isExpanded && visibleTestimonials.length > gridLimit[0] && (
                          <div className="mt-6 flex justify-center">
                            <button
                              onClick={() => setIsExpanded(false)}
                              className="flex items-center gap-2 px-5 py-2 rounded-full border transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[12px] font-semibold"
                              style={{ color: primaryBtnColor, borderColor: primaryBtnColor + "40" }}
                            >
                              Show less
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

