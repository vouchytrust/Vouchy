import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Monitor, Tablet, Smartphone, Code, Star, Lock, ExternalLink,
  Copy, Check, LayoutGrid, Rows3, GalleryHorizontalEnd,
  MessageCircle, Users, Layers3, Quote,
  FolderOpen, Play, ChevronDown, Columns2, ChevronLeft, ChevronRight, Circle,
  Twitter, Facebook, Linkedin, Mail, Link2, AlignCenter, Type
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { fetchSpaces, fetchTestimonialsBySpace, upsertWidget } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

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
  { id: "centered", name: "Centered", icon: <AlignCenter className="h-3.5 w-3.5" />, free: true },
  { id: "modern", name: "Modern", icon: <Type className="h-3.5 w-3.5" />, free: false },
  { id: "editorial", name: "Editorial", icon: <Quote className="h-3.5 w-3.5" />, free: false },
  { id: "bubble", name: "Bubble", icon: <MessageCircle className="h-3.5 w-3.5" />, free: false },
  { id: "avatar-wall", name: "Avatar Wall", icon: <Users className="h-3.5 w-3.5" />, free: false },
  { id: "marquee", name: "Marquee", icon: <GalleryHorizontalEnd className="h-3.5 w-3.5" />, free: false },
  { id: "masonry", name: "Masonry", icon: <Layers3 className="h-3.5 w-3.5" />, free: false },
  { id: "video", name: "Video", icon: <Play className="h-3.5 w-3.5" />, free: false },
];

const devices = [
  { id: "desktop", icon: Monitor },
  { id: "tablet", icon: Tablet },
  { id: "mobile", icon: Smartphone },
];

import { TestimonialCard, CardConfig, TestimonialItem, fontMap, shadowMap } from "@/components/TestimonialCard";

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

/* ── Trust Page Preview Component (inline, no router) ── */
interface TrustPagePreviewProps {
  spaceName: string;
  logoUrl?: string;
  pageAccent: string;
  widgetAccent: string;
  testimonials: TestimonialItem[];
  cardConfig: CardConfig;
  lightColors: { accentColor: string; cardBg: string; containerBg: string; nameColor: string; companyColor: string; bodyColor: string; starColor: string; navIconColor: string; navBgColor: string; primaryBtnColor: string };
  darkColors: { accentColor: string; cardBg: string; containerBg: string; nameColor: string; companyColor: string; bodyColor: string; starColor: string; navIconColor: string; navBgColor: string; primaryBtnColor: string };
  layout: string;
  isDark: boolean;
  minRating: number;
  mediaFilter: string;
  maxItems: number;
}

function TrustPageMarqueeRow({ testimonials, config, reverse }: { testimonials: TestimonialItem[]; config: CardConfig; reverse?: boolean }) {
  const items = [...testimonials, ...testimonials];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        className="flex"
        style={{ gap: 8 }}
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {items.map((t, i) => (
          <div key={i} style={{ flexShrink: 0, width: 200 }}>
            <TestimonialCard t={t} config={{ ...config, layout: 'modern' }} index={0} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function TrustPagePreview({ spaceName, logoUrl, pageAccent, widgetAccent, testimonials, cardConfig, lightColors, darkColors, layout, isDark, minRating, mediaFilter, maxItems }: TrustPagePreviewProps) {
  // Apply exact same filters as TrustPage
  const filtered = testimonials
    .filter(t => t.rating >= minRating)
    .filter(t => {
      if (mediaFilter === "video") return t.type === "video";
      if (mediaFilter === "text") return t.type === "text";
      return true;
    })
    .slice(0, maxItems);

  const total = testimonials.length;
  const avg = total > 0 ? (testimonials.reduce((s, t) => s + t.rating, 0) / total).toFixed(1) : "5.0";
  const fiveStarPct = total > 0 ? Math.round((testimonials.filter(t => t.rating === 5).length / total) * 100) : 100;
  const bg = isDark ? '#000000' : '#f8fafc';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subColor = isDark ? 'rgba(255,255,255,0.5)' : '#64748b';
  const statBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)';
  const statBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';

  // Use the correct color palette based on theme (same as TrustPage cardConfig logic)
  const themeColors = isDark ? darkColors : lightColors;
  const previewCardConfig: CardConfig = {
    ...cardConfig,
    accent: widgetAccent,
    darkMode: isDark,
    cardBg: themeColors.cardBg,
    nameColor: themeColors.nameColor,
    companyColor: themeColors.companyColor,
    bodyColor: themeColors.bodyColor,
    starColor: themeColors.starColor,
    layout: layout === 'marquee' ? 'modern' : cardConfig.layout,
  };

  return (
    <div style={{ backgroundColor: bg, height: '100%', fontFamily: 'system-ui, sans-serif', overflow: 'auto', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 400, height: 300, borderRadius: '50%', background: pageAccent, filter: 'blur(80px)', opacity: isDark ? 0.1 : 0.14, pointerEvents: 'none', zIndex: 0 }} />
      {/* Top accent bar */}
      <div style={{ height: 3, backgroundColor: pageAccent, width: '100%', position: 'relative', zIndex: 2 }} />
      {/* Grid background pattern */}
      <div style={{ position: 'absolute', top: 3, left: 0, right: 0, height: 320, zIndex: 0, opacity: 0.05,
        backgroundImage: `linear-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent)',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent)' }} />

      {/* ── Hero: prominent centrepiece ── */}
      <div style={{ padding: '28px 24px 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        {logoUrl && (
          <div style={{ display: 'inline-flex', marginBottom: 12, padding: '6px', borderRadius: 14, border: `1px solid ${pageAccent}30`, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)', boxShadow: `0 6px 16px -8px ${pageAccent}50` }}>
            <img src={logoUrl} alt={spaceName} style={{ height: 36, width: 'auto', borderRadius: 8, objectFit: 'contain' }} />
          </div>
        )}
        {!logoUrl && <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: subColor, marginBottom: 8 }}>{spaceName}</p>}
        {/* Big headline */}
        <div style={{ fontWeight: 900, lineHeight: 1.0, color: textColor, fontSize: 28, opacity: 0.6, marginBottom: 2 }}>What people say</div>
        <div style={{ fontWeight: 900, color: pageAccent, lineHeight: 1.0, fontSize: 28, position: 'relative', display: 'inline-block', marginBottom: 14 }}>
          about us
          <div style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', height: 2, borderRadius: 2, backgroundColor: pageAccent, opacity: 0.4 }} />
        </div>
        {/* Subtitle */}
        <p style={{ fontSize: 10, color: subColor, marginBottom: 16, lineHeight: 1.5 }}>Real stories from real customers. Every review is authentic and independently verified.</p>
        {/* Stats row */}
        {total > 0 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            {[{ label: 'Total Reviews', value: String(total) }, { label: 'Average Rating', value: avg + ' ★' }, { label: '5-Star Happy', value: fiveStarPct + '%' }].map(s => (
              <div key={s.label} style={{ flex: 1, maxWidth: 90, padding: '8px 6px', borderRadius: 10, background: statBg, border: `1px solid ${statBorder}` }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: textColor, marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: subColor }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 6 }}>
          <div style={{ padding: '7px 16px', borderRadius: 12, backgroundColor: pageAccent, color: 'white', fontWeight: 700, fontSize: 11, boxShadow: `0 6px 18px -6px ${pageAccent}70` }}>Share Page Link</div>
          <div style={{ padding: '7px 16px', borderRadius: 12, border: `1px solid ${pageAccent}35`, fontWeight: 600, fontSize: 11, color: textColor }}>Leave a Review</div>
        </div>
      </div>

      {/* ── Testimonials: scaled down grid ── */}
      <div style={{ padding: '8px 12px 24px', position: 'relative', zIndex: 1 }}>
        {/* Scale wrapper: shrink cards so they don't dominate the preview */}
        <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center', marginBottom: '-28%' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: subColor, fontSize: 12 }}>No testimonials match filters</div>
          ) : layout === 'marquee' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <TrustPageMarqueeRow testimonials={filtered.slice(0, Math.ceil(filtered.length / 2))} config={previewCardConfig} />
              <TrustPageMarqueeRow testimonials={filtered.slice(Math.ceil(filtered.length / 2))} config={previewCardConfig} reverse />
            </div>
          ) : layout === 'masonry' ? (
            <div style={{ columns: 3, gap: 8, columnFill: 'balance' }}>
              {filtered.map((t, i) => (
                <div key={i} style={{ breakInside: 'avoid', marginBottom: 8 }}>
                  <TestimonialCard t={t} config={previewCardConfig} index={i} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {filtered.map((t, i) => (
                <TestimonialCard key={i} t={t} config={t.type === 'video' ? { ...previewCardConfig, layout: 'video' } : previewCardConfig} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function WidgetLabPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState("clean");
  const [device, setDevice] = useState("desktop");
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [embedType, setEmbedType] = useState<"script" | "iframe">("script");
  const [mobileTab, setMobileTab] = useState<"editor" | "live">("editor");
  const [displayMode, setDisplayMode] = useState<"grid" | "carousel">("grid");
  const [previewMode, setPreviewMode] = useState<"embed" | "trust">(() => {
    return (localStorage.getItem("vouchy_preview_mode") as "embed" | "trust") || "embed";
  });
  useEffect(() => {
    localStorage.setItem("vouchy_preview_mode", previewMode);
  }, [previewMode]);
  const [gridLimit, setGridLimit] = useState([6]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [carouselVisible, setCarouselVisible] = useState([3]);
  const [navStyle, setNavStyle] = useState<"arrows" | "dots" | "none">("arrows");
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState("3000");
  const [carouselLoop, setCarouselLoop] = useState(true);
  const [carouselOrientation, setCarouselOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [carouselAlign, setCarouselAlign] = useState<"start" | "center">("start");
  const [minRating, setMinRating] = useState(0);
  const [mediaFilter, setMediaFilter] = useState("all");
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
  const [workspaceBrandColor, setWorkspaceBrandColor] = useState("#3b82f6");
  const [workspaceCompanyName, setWorkspaceCompanyName] = useState("");
  const [workspaceLogoUrl, setWorkspaceLogoUrl] = useState("");

  const [cardRadius, setCardRadius] = useState([12]);
  const [cardPadding, setCardPadding] = useState([16]);

  // Handle auto-selection for Video Layout
  useEffect(() => {
    if (selectedLayout === "video") {
      setMediaFilter("video");
    }
  }, [selectedLayout]);
  const [editingTheme, setEditingTheme] = useState<"light" | "dark">("light");

  const [fontFamily, setFontFamily] = useState("system");
  const [cardShadow, setCardShadow] = useState("sm");
  const [showStars, setShowStars] = useState(true);
  const [showAvatar, setShowAvatar] = useState(true);
  const [showCompany, setShowCompany] = useState(true);
  const { toast } = useToast();

  const [lightColors, setLightColors] = useState({
    accentColor: "#3b82f6", cardBg: "#ffffff", containerBg: "transparent", nameColor: "#1a1a1a",
    companyColor: "#888888", bodyColor: "#666666", starColor: "#f59e0b",
    navIconColor: "#1a1a1a", navBgColor: "#ffffff", primaryBtnColor: "#1a1a1a",
  });
  const [darkColors, setDarkColors] = useState({
    accentColor: "#60a5fa", cardBg: "#1c1c1e", containerBg: "transparent", nameColor: "#f5f5f7",
    companyColor: "#8e8e93", bodyColor: "#aeaeb2", starColor: "#f59e0b",
    navIconColor: "#ffffff", navBgColor: "#2c2c2e", primaryBtnColor: "#ffffff",
  });

  const activeColors = editingTheme === "light" ? lightColors : darkColors;
  const updateColor = (key: keyof typeof lightColors, value: string) => {
    if (editingTheme === "light") setLightColors(prev => ({ ...prev, [key]: value }));
    else setDarkColors(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSpaces();
        const s = (data as any[]).map(d => ({ id: d.id, name: d.name, slug: d.slug, user_id: d.user_id }));
        setSpaces(s);
        if (s.length > 0) {
          setSelectedSpaceId(s[0].id);
          // Fetch workspace brand color from profiles
          if (s[0].user_id) {
            const { data: profile } = await (await import("@/integrations/supabase/client")).supabase
              .from("profiles").select("brand_color, company_name, logo_url").eq("user_id", s[0].user_id).single();
            if (profile) {
              setWorkspaceBrandColor(profile.brand_color || "#3b82f6");
              setWorkspaceCompanyName(profile.company_name || "");
              setWorkspaceLogoUrl(profile.logo_url || "");
            }
          }
        }
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
    layout: selectedLayout, darkMode: editingTheme === "dark", radius: cardRadius[0], padding: cardPadding[0],
    shadow: cardShadow, font: fontFamily, accent: activeColors.accentColor,
    cardBg: activeColors.cardBg, containerBg: activeColors.containerBg, nameColor: activeColors.nameColor, companyColor: activeColors.companyColor, bodyColor: activeColors.bodyColor, starColor: activeColors.starColor,
    showStars, showAvatar, showCompany,
  };

  const selectedSpace = spaces.find(s => s.id === selectedSpaceId);

  // Derived: apply filter + cap
  const visibleTestimonials = testimonials
    .filter(t => t.rating >= minRating)
    .filter(t => {
      if (mediaFilter === "video") return t.type === "video";
      if (mediaFilter === "text") return t.type === "text";
      return true;
    })
    .slice(0, maxItems[0]);

  // Using window.location.origin so embedded links work locally and in production
  const embedParams = new URLSearchParams({
    layout: selectedLayout,
    mediaFilter: mediaFilter,
    minRating: String(minRating),
    max: String(maxItems[0]),
    darkMode: String(editingTheme === "dark"),
    radius: String(cardRadius[0]),
    padding: String(cardPadding[0]),
    font: fontFamily,
    accent: encodeURIComponent(activeColors.accentColor),
    cardBg: encodeURIComponent(activeColors.cardBg),
    nameColor: encodeURIComponent(activeColors.nameColor),
    companyColor: encodeURIComponent(activeColors.companyColor),
    bodyColor: encodeURIComponent(activeColors.bodyColor),
    starColor: encodeURIComponent(activeColors.starColor),
    showStars: String(showStars),
    showAvatar: String(showAvatar),
    showCompany: String(showCompany),
    shadow: cardShadow,
    displayMode: displayMode,
    carouselVisible: String(carouselVisible[0]),
    navStyle: navStyle,
    autoPlay: String(autoPlay),
    autoPlaySpeed: autoPlaySpeed,
     navIconColor: encodeURIComponent(activeColors.navIconColor),
    navBgColor: encodeURIComponent(activeColors.navBgColor),
    primaryBtnColor: encodeURIComponent(activeColors.primaryBtnColor),
    containerBg: encodeURIComponent(activeColors.containerBg),
  });
  
  const embedUrl = `${window.location.origin}/embed/${selectedSpace?.slug || ""}?${embedParams.toString()}`;
  const viewUrl = `${window.location.origin}/view/${selectedSpace?.slug || ""}?${embedParams.toString()}`;

  const activeEmbedCode = embedType === "script" 
    ? `<script src="${window.location.origin}/embed.js" data-widget-id="[WIDGET_ID_GENERATED_ON_COPY]"></script>`
    : `<iframe src="${window.location.origin}/embed/[WIDGET_ID_GENERATED_ON_COPY]" width="100%" height="${selectedLayout === 'marquee' ? '300' : '650'}" style="border:none;overflow:hidden;background:transparent;"></iframe>`;

  const copyEmbed = async () => {
    if (!user || !selectedSpaceId) return;
    setSaving(true);
    try {
      const widget = await upsertWidget({
        space_id: selectedSpaceId,
        user_id: user.id,
        name: `${selectedSpace?.name || "Space"} Widget`,
        config: {
          layout: selectedLayout,
          mediaFilter,
          minRating,
          maxItems: maxItems[0],
          darkMode: editingTheme === "dark",
          radius: cardRadius[0],
          padding: cardPadding[0],
          font: fontFamily,
          showStars,
          showAvatar,
          showCompany,
          shadow: cardShadow,
          displayMode,
          carouselVisible: carouselVisible[0],
          navStyle,
          autoPlay,
          autoPlaySpeed: parseInt(autoPlaySpeed),
          carouselLoop,
          carouselOrientation,
          carouselAlign,
          light: lightColors,
          dark: darkColors,
          ...activeColors
        }
      });
      
      const scriptCode = `<script src="${window.location.origin}/embed.js" data-widget-id="${widget.id}"></script>`;
      const iframeCode = `<iframe src="${window.location.origin}/embed/${widget.id}" width="100%" height="${selectedLayout === 'marquee' ? '300' : '650'}" style="border:none;overflow:hidden;background:transparent;"></iframe>`;
      const finalEmbedCode = embedType === "script" ? scriptCode : iframeCode;

      await navigator.clipboard.writeText(finalEmbedCode);
      setCopied(true);
      toast({ title: "Widget saved & embed code copied!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to save widget", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const copyViewUrl = () => {
    navigator.clipboard.writeText(viewUrl);
    setCopied(true);
    toast({ title: "Full view URL copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = `${window.location.origin}/trust/${selectedSpace?.slug || ""}?${embedParams.toString()}`;
  const [shareCopied, setShareCopied] = useState(false);

  const copyShareLink = async () => {
    if (!user || !selectedSpaceId) return;
    setSaving(true);
    try {
      await upsertWidget({
        space_id: selectedSpaceId,
        user_id: user.id,
        name: `${selectedSpace?.name || "Space"} Widget`,
        config: {
          layout: selectedLayout,
          mediaFilter,
          minRating,
          maxItems: maxItems[0],
          darkMode: editingTheme === "dark",
          radius: cardRadius[0],
          padding: cardPadding[0],
          font: fontFamily,
          showStars,
          showAvatar,
          showCompany,
          shadow: cardShadow,
          displayMode,
          carouselVisible: carouselVisible[0],
          navStyle,
          autoPlay,
          autoPlaySpeed: parseInt(autoPlaySpeed),
          carouselLoop,
          carouselOrientation,
          carouselAlign,
          light: lightColors,
          dark: darkColors,
          ...activeColors
        }
      });
      // Copy the full URL with all widget params so TrustPage renders the correct design
      const fullShareUrl = `${window.location.origin}/t/${selectedSpace?.slug || ""}?${embedParams.toString()}`;
      await navigator.clipboard.writeText(fullShareUrl);
      setShareCopied(true);
      toast({ title: "Design saved & link copied!" });
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to save design", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const shareSocial = (platform: string) => {
    const shortUrl = `${window.location.origin}/t/${selectedSpace?.slug || ""}`;
    const text = encodeURIComponent(`Check out what people say about ${selectedSpace?.name || "us"}!`);
    const url = encodeURIComponent(shortUrl);
    let shareHref = "";
    
    if (platform === "twitter") shareHref = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    if (platform === "linkedin") shareHref = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    if (platform === "facebook") shareHref = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === "email") shareHref = `mailto:?subject=${text}&body=${url}`;
    
    if (shareHref) window.open(shareHref, "_blank", "width=600,height=400");
  };

  const currentLayout = layouts.find(l => l.id === selectedLayout);
  
  // Preview URL for live editing
  const previewUrl = `${window.location.origin}/t/${selectedSpace?.slug || ""}?${embedParams.toString()}`;

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
              <span className="text-[12px] text-foreground leading-tight">Editing Theme<br/><span className="text-[10px] text-muted-foreground font-normal">Switch to preview and edit custom colors</span></span>
              <div className="flex items-center gap-1 p-0.5 bg-muted rounded-md border border-border">
                <button onClick={() => setEditingTheme("light")} className={`px-2 py-1 rounded-[4px] text-[10px] font-bold ${editingTheme === "light" ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"}`}>Light</button>
                <button onClick={() => setEditingTheme("dark")} className={`px-2 py-1 rounded-[4px] text-[10px] font-bold ${editingTheme === "dark" ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"}`}>Dark</button>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3.5 pt-3 border-t border-border">
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Colors ({editingTheme})</p>
            {([
              { label: "Accent / Icons", key: "accentColor" },
              { label: "Card background", key: "cardBg" },
              { label: "Container background", key: "containerBg" },
              { label: "Name", key: "nameColor" },
              { label: "Company", key: "companyColor" },
              { label: "Testimonial", key: "bodyColor" },
              { label: "Stars", key: "starColor" },
              { label: "Nav arrows", key: "navIconColor" },
              { label: "Nav background", key: "navBgColor" },
              { label: "Main button", key: "primaryBtnColor" },
            ] as const).map(({ label, key }) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <Label className="text-[11px] text-muted-foreground whitespace-nowrap">{label}</Label>
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                  <div className="relative group shrink-0">
                    <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: activeColors[key as keyof typeof activeColors] }} />
                    <input
                      type="color"
                      value={activeColors[key as keyof typeof activeColors] === 'transparent' ? '#ffffff' : activeColors[key as keyof typeof activeColors]}
                      onChange={(e) => updateColor(key as keyof typeof lightColors, e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={activeColors[key as keyof typeof activeColors]}
                    onChange={(e) => updateColor(key as keyof typeof lightColors, e.target.value)}
                    className="w-16 h-6 px-1.5 text-[10px] font-mono bg-muted border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                    placeholder="#000000"
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
              <Label className="text-[11px] text-muted-foreground mb-2 block">Media format</Label>
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg mb-4">
                <button
                  onClick={() => { setMediaFilter("all"); setIsExpanded(false); }}
                  className={`flex-1 flex items-center justify-center py-1 rounded-md text-[10px] font-semibold transition-all ${mediaFilter === "all" ? "bg-background text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Both
                </button>
                <button
                  onClick={() => { setMediaFilter("video"); setIsExpanded(false); }}
                  className={`flex-1 flex items-center justify-center py-1 rounded-md text-[10px] font-semibold transition-all ${mediaFilter === "video" ? "bg-background text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Video Only
                </button>
                <button
                  onClick={() => { setMediaFilter("text"); setIsExpanded(false); }}
                  className={`flex-1 flex items-center justify-center py-1 rounded-md text-[10px] font-semibold transition-all ${mediaFilter === "text" ? "bg-background text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Text Only
                </button>
              </div>
            </div>
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
              <Button onClick={copyShareLink} variant="outline" className="w-full h-9 text-[13px] mt-2 gap-1.5 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                {shareCopied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                {shareCopied ? "Copied Link!" : "Copy Trust Page Link"}
              </Button>
              <div className="flex gap-2 mt-2">
                <Button onClick={copyViewUrl} variant="ghost" className="flex-1 h-9 text-[12px] gap-1.5 opacity-70 hover:opacity-100">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Widget URL
                </Button>
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center h-9 text-[12px] gap-1.5 px-3 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-center opacity-70 hover:opacity-100"
                >
                  <Monitor className="h-3.5 w-3.5" />
                  Open Trust Page
                </a>
              </div>
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
          <div className="flex items-center justify-between px-5 py-3 border-b border-border relative">
            <div className="flex items-center gap-3 w-1/3">
              {/* Device switcher */}
              <div className="flex items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">
                {devices.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDevice(d.id)}
                    className={`p-1.5 rounded-md transition-all duration-150 ${device === d.id
                      ? "bg-background text-foreground vouchy-shadow-xs border border-border/40"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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

            {/* Centered Preview Mode Switcher */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center p-0.5 bg-background/80 backdrop-blur-md rounded-[10px] border border-border/60 shadow-md z-[60] pointer-events-auto">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewMode("embed"); }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${previewMode === "embed" ? "bg-background text-foreground shadow border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Code className="h-3.5 w-3.5" /> Embed to Website
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewMode("trust"); }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${previewMode === "trust" ? "bg-background text-foreground shadow border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Link2 className="h-3.5 w-3.5" /> Trust Page
              </button>
            </div>

            <div className="flex items-center justify-end gap-1.5 w-1/3">
              {/* Share Page Button & Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-2xs gap-1.5 px-2 bg-background border border-border shadow-sm text-foreground hover:bg-muted font-medium transition-all"
                    disabled={!selectedSpace}
                  >
                    <Link2 className="h-3 w-3" />
                    Share Website
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-4 rounded-xl shadow-xl z-50 border border-border/60 backdrop-blur-md" align="end" sideOffset={8}>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Share Trust Page</p>
                      <p className="text-xs text-muted-foreground leading-snug">Share your beautiful public testimonials page with your audience.</p>
                    </div>
                    
                    {/* Social Buttons Row */}
                    <div className="grid grid-cols-4 gap-2">
                       <Button variant="outline" className="h-10 w-full hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-colors bg-background" onClick={() => shareSocial('twitter')} title="Share on Twitter"><Twitter className="h-4 w-4" /></Button>
                       <Button variant="outline" className="h-10 w-full hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-colors bg-background" onClick={() => shareSocial('linkedin')} title="Share on LinkedIn"><Linkedin className="h-4 w-4" /></Button>
                       <Button variant="outline" className="h-10 w-full hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-colors bg-background" onClick={() => shareSocial('facebook')} title="Share on Facebook"><Facebook className="h-4 w-4" /></Button>
                       <Button variant="outline" className="h-10 w-full hover:bg-muted transition-colors bg-background" onClick={() => shareSocial('email')} title="Share via Email"><Mail className="h-4 w-4" /></Button>
                    </div>

                    <div className="relative pt-1 flex items-center group">
                      <div className="absolute left-2.5 flex items-center pointer-events-none mt-1">
                        <Link2 className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      </div>
                      <input 
                        readOnly 
                        value={shareUrl} 
                        className="w-full text-[11px] h-9 pl-8 pr-16 bg-muted border border-border rounded-lg text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-shadow" 
                      />
                      <button 
                        onClick={copyShareLink}
                        className="absolute right-1.5 h-6 px-2 bg-background border border-border hover:bg-accent hover:text-foreground text-muted-foreground rounded text-[10px] font-bold transition-all mt-1"
                      >
                         {shareCopied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-2xs gap-1 text-muted-foreground hidden sm:flex"
                onClick={copyEmbed}
                disabled={testimonials.length === 0 || saving}
              >
                {saving ? (
                  <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                ) : copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {saving ? "Saving..." : "Embed"}
              </Button>
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
                <div className="flex-1 flex justify-center overflow-hidden">
                  <div className="px-6 py-1 rounded-lg bg-muted/60 border border-border text-2xs text-muted-foreground font-mono max-w-full truncate">
                    {previewMode === "trust" && selectedSpace?.slug
                      ? `${window.location.hostname}/t/${selectedSpace.slug}?layout=${selectedLayout}&darkMode=${editingTheme === "dark"}&accent=...`
                      : "yourwebsite.com"}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div 
                className={`flex-1 overflow-y-auto transition-colors duration-300`}
                style={{ backgroundColor: activeColors.containerBg === 'transparent' ? (editingTheme === "dark" ? "hsl(240 10% 4%)" : "white") : activeColors.containerBg }}
              >
                {previewMode === "trust" ? (
                  <TrustPagePreview
                    spaceName={workspaceCompanyName || selectedSpace?.name || "Your Brand"}
                    logoUrl={workspaceLogoUrl}
                    pageAccent={workspaceBrandColor}
                    widgetAccent={activeColors.accentColor}
                    testimonials={visibleTestimonials}
                    cardConfig={cardConfig}
                    lightColors={lightColors}
                    darkColors={darkColors}
                    layout={selectedLayout}
                    isDark={editingTheme === "dark"}
                    minRating={minRating}
                    mediaFilter={mediaFilter}
                    maxItems={maxItems[0]}
                  />
                ) : loadingTestimonials ? (
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
                      <div className={`gap-4 ${
                        device === 'mobile' ? 'columns-1' :
                        device === 'tablet' ? 'columns-2' :
                        'columns-1 md:columns-2 lg:columns-3'
                      }`}>
                        {visibleTestimonials.map((t, i) => (
                          <TestimonialCard key={i} t={t} config={cardConfig} index={i} />
                        ))}
                      </div>
                    ) : (displayMode === "carousel" || device === "mobile") ? (
                      <div className="space-y-4">
                        <Carousel
                          orientation={carouselOrientation}
                          opts={{ 
                            align: carouselAlign, 
                            loop: carouselLoop
                          }}
                          setApi={(api) => { carouselApiRef.current = api; }}
                          onMouseEnter={() => { isHoveringCarousel.current = true; }}
                          onMouseLeave={() => { isHoveringCarousel.current = false; }}
                          className={`w-full ${carouselOrientation === "vertical" ? "h-[500px]" : ""}`}
                        >
                          <CarouselContent className="-ml-3">
                            {visibleTestimonials.map((t, i) => (
                              <CarouselItem
                                key={i}
                                className={`pl-3 ${
                                  (device === "mobile" ? 1 : carouselVisible[0]) === 1 ? "basis-full" :
                                  (device === "mobile" ? 1 : carouselVisible[0]) === 2 ? "basis-full sm:basis-1/2" :
                                  (device === "mobile" ? 1 : carouselVisible[0]) === 3 ? "basis-full sm:basis-1/2 lg:basis-1/3" : 
                                  "basis-full sm:basis-1/2 lg:basis-1/4"
                                }`}
                              >
                                <TestimonialCard t={t} config={cardConfig} index={i} />
                              </CarouselItem>
                            ))}
                          </CarouselContent>

                          {navStyle === "arrows" && (
                            <div className="flex items-center justify-center gap-3 mt-8">
                              <CarouselPrevious
                                className="static translate-y-0 h-9 w-9 rounded-full border shadow-sm hover:brightness-110 active:scale-95 transition-all"
                                style={{
                                  color: activeColors.navIconColor,
                                  backgroundColor: activeColors.navBgColor,
                                  borderColor: editingTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                                }}
                              />
                              <CarouselNext
                                className="static translate-y-0 h-9 w-9 rounded-full border shadow-sm hover:brightness-110 active:scale-95 transition-all"
                                style={{
                                  color: activeColors.navIconColor,
                                  backgroundColor: activeColors.navBgColor,
                                  borderColor: editingTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                                }}
                              />
                            </div>
                          )}
                          {navStyle === "dots" && (
                            <div className="flex items-center justify-center gap-2 mt-5">
                              <CarouselPrevious
                                className="static translate-y-0 h-7 w-7 rounded-full border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 p-0 shadow-none text-current"
                                style={{ color: activeColors.navIconColor }}
                              />
                              {visibleTestimonials.slice(0, Math.min(visibleTestimonials.length, 8)).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeColors.navIconColor, opacity: 0.3 }} />
                              ))}
                              <CarouselNext
                                className="static translate-y-0 h-7 w-7 rounded-full border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 p-0 shadow-none text-current"
                                style={{ color: activeColors.navIconColor }}
                              />
                            </div>
                          )}
                        </Carousel>
                      </div>
                    ) : (
                      <div>
                        <div className={`grid gap-4 ${
                          device === 'mobile' ? 'grid-cols-1' :
                          device === 'tablet' ? 'grid-cols-2' :
                          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}>
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
                                color: activeColors.primaryBtnColor,
                                borderColor: activeColors.primaryBtnColor + "40"
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
                              style={{ color: activeColors.primaryBtnColor, borderColor: activeColors.primaryBtnColor + "40" }}
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
