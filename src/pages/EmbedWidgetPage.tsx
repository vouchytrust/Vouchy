import { useState, useEffect, useLayoutEffect, useRef } from "react";
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
import { fetchSpaceBySlug, fetchTestimonialsBySpace, fetchWidgetById } from "@/lib/api";

import { TestimonialCard, CardConfig, TestimonialItem } from "@/components/TestimonialCard";
import { TrustBadgeWidget, ConstellationWidget } from "@/components/AggregateWidgets";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function MarqueeRow({ testimonials, config, reverse }: { testimonials: TestimonialItem[]; config: CardConfig; reverse?: boolean }) {
  const items = [...testimonials, ...testimonials];
  return (
    <div className="overflow-hidden w-full relative" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
      <motion.div
        className="flex gap-5 py-4 px-2"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        {items.map((t, i) => (
          <div key={i} className="shrink-0 w-[400px]">
            <TestimonialCard t={t} config={{ ...config, layout: "modern" }} index={0} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function EmbedWidgetPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [space, setSpace] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const [dbConfig, setDbConfig] = useState<any>(null);
  const [activeThemeOverride, setActiveThemeOverride] = useState<"light" | "dark" | null>(null);

  const baseSettings = dbConfig || {
    layout: searchParams.get("layout") || "clean",
    mediaFilter: searchParams.get("mediaFilter") || "all",
    minRating: parseInt(searchParams.get("minRating") || "0", 10),
    maxItems: parseInt(searchParams.get("max") || "50", 10),
    darkMode: searchParams.get("darkMode") === "true",
    radius: parseInt(searchParams.get("radius") || "12", 10),
    padding: parseInt(searchParams.get("padding") || "16", 10),
    font: searchParams.get("font") || "system",
    accent: decodeURIComponent(searchParams.get("accent") || "#3b82f6"),
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
    displayMode: searchParams.get("displayMode") || "grid",
    carouselVisible: parseInt(searchParams.get("carouselVisible") || "3", 10),
    navStyle: searchParams.get("navStyle") || "arrows",
    autoPlay: searchParams.get("autoPlay") === "true",
    autoPlaySpeed: parseInt(searchParams.get("autoPlaySpeed") || "3000", 10),
    navIconColor: decodeURIComponent(searchParams.get("navIconColor") || "#1a1a1a"),
    navBgColor: decodeURIComponent(searchParams.get("navBgColor") || "#ffffff"),
    containerBg: decodeURIComponent(searchParams.get("containerBg") || "transparent"),
  };

  // Priority: 1. activeThemeOverride (from postMessage) 2. searchParams theme 3. baseSettings darkMode
  const isDarkOverride = activeThemeOverride !== null ? activeThemeOverride === "dark" : (searchParams.get("theme") === "dark" ? true : (searchParams.get("theme") === "light" ? false : null));
  const isDark = isDarkOverride !== null ? isDarkOverride : baseSettings.darkMode;
  
  // High-priority dark mode theme calculation
  const getActiveConfig = () => {
    // If we have explicit sub-configs, use them
    if (isDark && baseSettings.dark) return { ...baseSettings, ...baseSettings.dark };
    if (!isDark && baseSettings.light) return { ...baseSettings, ...baseSettings.light };
    
    // Auto-adaptation if sub-configs are missing
    if (isDark) {
      return {
        ...baseSettings,
        cardBg: (baseSettings.cardBg && (baseSettings.cardBg.toLowerCase() === '#ffffff' || baseSettings.cardBg.toLowerCase() === '#fff' || baseSettings.cardBg === 'transparent')) ? '#1c1c1e' : baseSettings.cardBg,
        containerBg: (baseSettings.containerBg && (baseSettings.containerBg.toLowerCase() === '#ffffff' || baseSettings.containerBg.toLowerCase() === '#fff')) ? 'transparent' : baseSettings.containerBg,
        nameColor: (baseSettings.nameColor && baseSettings.nameColor.toLowerCase() === '#1a1a1a') ? '#FFFFFF' : baseSettings.nameColor,
        companyColor: (baseSettings.companyColor && baseSettings.companyColor.toLowerCase() === '#888888') ? '#9CA3AF' : baseSettings.companyColor,
        bodyColor: (baseSettings.bodyColor && baseSettings.bodyColor.toLowerCase() === '#666666') ? '#D1D5DB' : baseSettings.bodyColor,
        darkMode: true
      };
    } else {
      // Light mode forced adaptation (if it was otherwise dark)
      return {
        ...baseSettings,
        cardBg: (baseSettings.cardBg && (baseSettings.cardBg.toLowerCase() === '#1c1c1e' || baseSettings.cardBg.toLowerCase() === '#1a1a1b')) ? '#ffffff' : baseSettings.cardBg,
        containerBg: 'transparent',
        nameColor: (baseSettings.nameColor && (baseSettings.nameColor.toLowerCase() === '#ffffff' || baseSettings.nameColor.toLowerCase() === '#f5f5f7')) ? '#1a1a1a' : baseSettings.nameColor,
        companyColor: (baseSettings.companyColor && baseSettings.companyColor.toLowerCase() === '#9ca3af') ? '#888888' : baseSettings.companyColor,
        bodyColor: (baseSettings.bodyColor && baseSettings.bodyColor.toLowerCase() === '#d1d5db') ? '#666666' : baseSettings.bodyColor,
        darkMode: false
      }
    }
  };

  const activeColorTheme = getActiveConfig();

  const config: CardConfig = {
    layout: baseSettings.layout,
    darkMode: isDark,
    radius: baseSettings.radius,
    padding: baseSettings.padding,
    font: baseSettings.font,
    accent: activeColorTheme.accentColor || activeColorTheme.accent || baseSettings.accent,
    cardBg: activeColorTheme.cardBg || "#ffffff",
    nameColor: activeColorTheme.nameColor || "#1a1a1a",
    companyColor: activeColorTheme.companyColor || "#888888",
    bodyColor: activeColorTheme.bodyColor || "#666666",
    starColor: activeColorTheme.starColor || "#f59e0b",
    showStars: baseSettings.showStars,
    showAvatar: baseSettings.showAvatar,
    showCompany: baseSettings.showCompany,
    shadow: baseSettings.shadow,
    primaryBtnColor: activeColorTheme.primaryBtnColor || baseSettings.primaryBtnColor,
    containerBg: activeColorTheme.containerBg || "transparent",
  };

  // useLayoutEffect fires BEFORE the browser paints — reliable transparent background
  useLayoutEffect(() => {
    const s = 'transparent';
    const isActuallyDark = activeThemeOverride === "dark" || (!activeThemeOverride && baseSettings.darkMode);
    
    const html = document.documentElement;
    const body = document.body;
    
    html.classList.toggle('dark', !!isActuallyDark);
    html.classList.add('vouchy-embed-frame');
    
    [html, body].forEach(el => {
      el.style.setProperty('background', s, 'important');
      el.style.setProperty('background-color', s, 'important');
      el.style.overflow = 'hidden';
    });
  }, [activeThemeOverride, baseSettings.darkMode]);
  
  const layoutSettings = {
    displayMode: isMobile ? "carousel" : baseSettings.displayMode,
    carouselVisible: isMobile ? 1 : baseSettings.carouselVisible,
    navStyle: baseSettings.navStyle,
    autoPlay: baseSettings.autoPlay,
    autoPlaySpeed: baseSettings.autoPlaySpeed,
    navIconColor: activeColorTheme.navIconColor || baseSettings.navIconColor,
    navBgColor: activeColorTheme.navBgColor || baseSettings.navBgColor,
    maxItems: baseSettings.maxItems || baseSettings.max || 50,
    minRating: baseSettings.minRating || 0,
    mediaFilter: baseSettings.mediaFilter || "all"
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        window.parent.postMessage({ type: "vouchy-resize", height: Math.ceil(height) }, "*");
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [testimonials, loading]);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        let spaceIdToUse = "";
        let currentMinRating = layoutSettings.minRating;
        let currentMediaFilter = layoutSettings.mediaFilter;
        let currentMax = layoutSettings.maxItems;

        const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slug);
        let rawTestimonials: any[] = [];
        let finalMax = layoutSettings.maxItems;
        let finalMinRating = layoutSettings.minRating;
        let finalFilter = layoutSettings.mediaFilter;

        if (isUUID) {
          const widgetData = await fetchWidgetById(slug);
          if (widgetData) {
            setDbConfig(widgetData.config);
            setSpace(widgetData.spaces);
            rawTestimonials = widgetData.spaces?.testimonials || [];
            
            const c = widgetData.config as any;
            if (c.minRating !== undefined) finalMinRating = c.minRating;
            if (c.mediaFilter !== undefined) finalFilter = c.mediaFilter;
            if (c.maxItems !== undefined) finalMax = c.maxItems;
          }
        } else {
          const spaceData = await fetchSpaceBySlug(slug);
          setSpace(spaceData);
          rawTestimonials = await fetchTestimonialsBySpace(spaceData.id);
        }

        const mapped = rawTestimonials
          .filter(t => t.status === "approved" && t.rating >= finalMinRating)
          .filter(t => {
            if (finalFilter === "video") return t.type === "video";
            if (finalFilter === "text") return t.type === "text";
            return true;
          })
          .slice(0, finalMax)
          .map(t => ({
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
      } catch (err) { 
        console.error("Failed:", err); 
      } finally { 
        setLoading(false); 
      }
    }
    loadData();
  }, [slug]);

  useEffect(() => {
    // Attempt same-origin direct theme detection for immediate sync
    try {
      if (window.parent && window.parent.document) {
        const doc = window.parent.document.documentElement;
        const isParentDark = doc.classList.contains('dark') || doc.getAttribute('data-theme') === 'dark';
        setActiveThemeOverride(isParentDark ? 'dark' : 'light');
      }
    } catch (e) {
      // Cross-origin, rely on postMessage below
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'vouchy-theme-change') {
         const newTheme = event.data.theme === 'dark';
         setActiveThemeOverride(newTheme ? 'dark' : 'light');
      }
    };
    window.addEventListener('message', handleMessage);

    // Signal parent that we are ready so it re-sends the theme
    window.parent.postMessage({ type: 'vouchy-ready' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const visibleTestimonials = isExpanded ? testimonials : testimonials.slice(0, 6);
  const hasMore = testimonials.length > 6;

  const TRANSPARENT_STYLE = `
    html, body { 
      background: transparent !important; 
      background-color: transparent !important; 
      background-image: none !important;
      overflow: hidden !important; 
    }
  `;

  if (loading) return (
    <>
      <style>{TRANSPARENT_STYLE}</style>
      <div 
        ref={containerRef}
        className="min-h-[400px] flex items-center justify-center" 
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="w-8 h-8 border-2 border-current rounded-full animate-spin" style={{ borderColor: config.accent, borderTopColor: "transparent" }} />
      </div>
    </>
  );

  return (
    <>
      <style>{TRANSPARENT_STYLE}</style>
      <div 
        ref={containerRef}
        className={`w-full overflow-hidden ${config.darkMode ? "dark" : ""}`}
        style={{ backgroundColor: activeThemeOverride !== null ? 'transparent' : (config.darkMode ? 'transparent' : ((config.containerBg && config.containerBg !== 'transparent') ? config.containerBg : 'transparent')) }}
      >
      {config.layout === "marquee" ? (
        <div className="space-y-4 py-4">
          <MarqueeRow testimonials={testimonials.slice(0, Math.ceil(testimonials.length / 2))} config={config} />
          <MarqueeRow testimonials={testimonials.slice(Math.ceil(testimonials.length / 2))} config={config} reverse />
        </div>
      ) : config.layout === "badge" ? (
        <div className="flex justify-center p-4"><TrustBadgeWidget testimonials={testimonials} config={config} /></div>
      ) : config.layout === "constellation" ? (
        <ConstellationWidget testimonials={testimonials} config={config} />
      ) : config.layout === "masonry" ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 p-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} config={config} index={i} />
          ))}
        </div>
      ) : layoutSettings.displayMode === "carousel" ? (
        <div className="px-4">
          <Carousel
            orientation={(baseSettings.carouselOrientation || "horizontal") as "horizontal" | "vertical"}
            opts={{ 
              align: (baseSettings.carouselAlign || "start") as "start" | "center", 
              loop: baseSettings.carouselLoop !== false
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t, i) => (
                <CarouselItem
                  key={i}
                  className={`pl-4 ${
                    layoutSettings.carouselVisible === 1 ? "basis-full" :
                    layoutSettings.carouselVisible === 2 ? "basis-full sm:basis-1/2" :
                    layoutSettings.carouselVisible === 3 ? "basis-full sm:basis-1/2 lg:basis-1/3" : 
                    "basis-full sm:basis-1/2 lg:basis-1/4"
                  }`}
                >
                  <TestimonialCard t={t} config={config} index={i} />
                </CarouselItem>
              ))}
            </CarouselContent>

            {layoutSettings.navStyle === "arrows" && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <CarouselPrevious
                  className="static translate-y-0 h-9 w-9 rounded-full border shadow-sm transition-all hover:scale-105 active:scale-95"
                  style={{
                    color: layoutSettings.navIconColor,
                    backgroundColor: layoutSettings.navBgColor,
                    borderColor: `${layoutSettings.navIconColor}20`
                  }}
                />
                <CarouselNext
                  className="static translate-y-0 h-9 w-9 rounded-full border shadow-sm transition-all hover:scale-105 active:scale-95"
                  style={{
                    color: layoutSettings.navIconColor,
                    backgroundColor: layoutSettings.navBgColor,
                    borderColor: `${layoutSettings.navIconColor}20`
                  }}
                />
              </div>
            )}
            {layoutSettings.navStyle === "dots" && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <CarouselPrevious
                  className="static translate-y-0 h-7 w-7 rounded-full border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 p-0 shadow-none text-current"
                  style={{ color: layoutSettings.navIconColor }}
                />
                {testimonials.slice(0, Math.min(testimonials.length, 8)).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layoutSettings.navIconColor, opacity: 0.3 }} />
                ))}
                <CarouselNext
                  className="static translate-y-0 h-7 w-7 rounded-full border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 p-0 shadow-none text-current"
                  style={{ color: layoutSettings.navIconColor }}
                />
              </div>
            )}
          </Carousel>
        </div>
      ) : (
        <>
          {testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40">
              <p className="text-xs font-medium italic">No testimonials found for this space yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {visibleTestimonials.map((t, i) => (
                <TestimonialCard key={i} t={t} config={config} index={i} />
              ))}
            </div>
          )}
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
    </>
  );
}


