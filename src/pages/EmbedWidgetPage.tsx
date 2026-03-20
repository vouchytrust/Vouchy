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

  const isDark = activeThemeOverride !== null ? activeThemeOverride === "dark" : (baseSettings.darkMode || false);
  const activeColorTheme = isDark ? (baseSettings.dark || baseSettings) : (baseSettings.light || baseSettings);

  const config: CardConfig = {
    layout: baseSettings.layout,
    darkMode: isDark,
    radius: baseSettings.radius,
    padding: baseSettings.padding,
    font: baseSettings.font,
    accent: activeColorTheme.accentColor || activeColorTheme.accent || baseSettings.accent,
    cardBg: activeColorTheme.cardBg || baseSettings.cardBg,
    nameColor: activeColorTheme.nameColor || baseSettings.nameColor,
    companyColor: activeColorTheme.companyColor || baseSettings.companyColor,
    bodyColor: activeColorTheme.bodyColor || baseSettings.bodyColor,
    starColor: activeColorTheme.starColor || baseSettings.starColor,
    showStars: baseSettings.showStars,
    showAvatar: baseSettings.showAvatar,
    showCompany: baseSettings.showCompany,
    shadow: baseSettings.shadow,
    primaryBtnColor: activeColorTheme.primaryBtnColor || baseSettings.primaryBtnColor,
    containerBg: activeColorTheme.containerBg || baseSettings.containerBg,
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

        if (isUUID) {
          try {
            const widgetData = await fetchWidgetById(slug);
            spaceIdToUse = widgetData.space_id;
            const c = widgetData.config as any;
            setDbConfig(c);
            
            const overrideTheme = searchParams.get("theme");
            if (overrideTheme === "dark") setActiveThemeOverride("dark");
            if (overrideTheme === "light") setActiveThemeOverride("light");

            currentMinRating = c.minRating !== undefined ? c.minRating : currentMinRating;
            currentMediaFilter = c.mediaFilter !== undefined ? c.mediaFilter : currentMediaFilter;
            currentMax = c.maxItems !== undefined ? c.maxItems : currentMax;
          } catch (e) {
            console.error("Failed to load widget config, falling back", e);
            const spaceData = await fetchSpaceBySlug(slug);
            setSpace(spaceData);
            spaceIdToUse = spaceData.id;
          }
        } else {
          const spaceData = await fetchSpaceBySlug(slug);
          setSpace(spaceData);
          spaceIdToUse = spaceData.id;
        }

        const data = await fetchTestimonialsBySpace(spaceIdToUse);
        const mapped = (data as any[])
          .filter(t => t.status === "approved" && t.rating >= currentMinRating)
          .filter(t => {
            if (currentMediaFilter === "video") return t.type === "video";
            if (currentMediaFilter === "text") return t.type === "text";
            return true;
          })
          .slice(0, currentMax)
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
        style={{ backgroundColor: (config.containerBg && config.containerBg !== 'transparent') ? config.containerBg : 'transparent' }}
      >
      {config.layout === "marquee" ? (
        <div className="space-y-4 py-4">
          <MarqueeRow testimonials={testimonials.slice(0, Math.ceil(testimonials.length / 2))} config={config} />
          <MarqueeRow testimonials={testimonials.slice(Math.ceil(testimonials.length / 2))} config={config} reverse />
        </div>
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


