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

import { TestimonialCard, CardConfig, TestimonialItem, fontMap, shadowMap } from "@/components/TestimonialCard";

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
