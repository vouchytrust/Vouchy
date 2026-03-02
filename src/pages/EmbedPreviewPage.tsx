import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Play, Video, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/* ── Types ── */
interface TestimonialItem {
    name: string;
    company: string;
    rating: number;
    content: string;
    initials: string;
    type?: string;
    video_url?: string | null;
}

interface CardConfig {
    layout: string;
    darkMode: boolean;
    radius: number;
    padding: number;
    shadow: string;
    font: string;
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

function getInitials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

/* ── Card ── */
function TestimonialCard({ t, config, index }: { t: TestimonialItem; config: CardConfig; index: number }) {
    const { layout, darkMode, radius, padding, font, cardBg, nameColor, companyColor, bodyColor, starColor, showStars, showAvatar, showCompany, shadow } = config;

    const isVideo = t.type === "video";

    const videoThumbnail = isVideo && (
        <div className="relative aspect-video overflow-hidden" style={{ borderRadius: `${radius}px ${radius}px 0 0` }}>
            {t.video_url ? (
                <video
                    src={t.video_url}
                    preload="metadata"
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoadedMetadata={(e) => { e.currentTarget.currentTime = 0.5; }}
                />
            ) : (
                <div className="absolute inset-0" style={{ background: darkMode ? "hsl(240 4% 10%)" : "#f3f4f6" }} />
            )}
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="h-4 w-4 text-white ml-0.5" />
                </div>
            </div>
            <span className="absolute top-2 left-2 flex items-center gap-0.5 text-[9px] font-medium text-white bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                <Video className="h-2 w-2" /> Video
            </span>
        </div>
    );

    const stars = showStars && (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-3 w-3" style={{ color: j < t.rating ? starColor : "#e5e7eb", fill: j < t.rating ? starColor : "none" }} />
            ))}
        </div>
    );

    const avatar = showAvatar && (
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: darkMode ? "hsl(240 4% 16%)" : "#f3f4f6" }}>
            <span className="text-xs font-semibold" style={{ color: companyColor }}>{t.initials}</span>
        </div>
    );

    const anim = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.06, duration: 0.4 } };

    if (layout === "minimal") {
        return (
            <motion.div {...anim} className={`${fontMap[font]} border-b`} style={{ padding: `${padding}px 0`, borderColor: darkMode ? "#333" : "#e5e7eb" }}>
                <div className="flex items-start gap-3">
                    {avatar}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium" style={{ color: nameColor }}>{t.name}</span>
                            {showCompany && <span className="text-xs" style={{ color: companyColor }}>· {t.company}</span>}
                        </div>
                        {!isVideo && <p className="text-sm leading-relaxed mb-1.5" style={{ color: bodyColor }}>{t.content}</p>}
                        {isVideo && videoThumbnail}
                        {stars}
                    </div>
                </div>
            </motion.div>
        );
    }

    // Default grid card (clean)
    return (
        <motion.div {...anim} className={`${fontMap[font]} border ${shadowMap[shadow]} transition-all overflow-hidden`}
            style={{ borderRadius: `${radius}px`, backgroundColor: cardBg, borderColor: darkMode ? "hsl(240 4% 16%)" : "#e5e7eb" }}>
            {videoThumbnail}
            <div style={{ padding: `${padding}px` }}>
                <div className="flex items-center gap-2.5 mb-3">
                    {avatar}
                    <div>
                        <div className="text-sm font-medium leading-tight" style={{ color: nameColor }}>{t.name}</div>
                        {showCompany && <div className="text-xs mt-0.5" style={{ color: companyColor }}>{t.company}</div>}
                    </div>
                </div>
                <div className="mb-2">{stars}</div>
                {!isVideo && <p className="text-sm leading-relaxed" style={{ color: bodyColor }}>{t.content}</p>}
            </div>
        </motion.div>
    );
}

/* ── Main Page ── */
export default function EmbedPreviewPage() {
    const [params] = useSearchParams();

    const spaceId = params.get("spaceId") || "";
    const layout = params.get("layout") || "clean";
    const darkMode = params.get("dark") === "1";
    const radius = Number(params.get("radius") ?? 12);
    const padding = Number(params.get("padding") ?? 16);
    const shadow = params.get("shadow") || "sm";
    const font = params.get("font") || "system";
    const cardBg = params.get("cardBg") ? decodeURIComponent(params.get("cardBg")!) : (darkMode ? "#1a1a2e" : "#ffffff");
    const nameColor = params.get("nameColor") ? decodeURIComponent(params.get("nameColor")!) : (darkMode ? "#f1f5f9" : "#1a1a1a");
    const companyColor = params.get("companyColor") ? decodeURIComponent(params.get("companyColor")!) : "#888888";
    const bodyColor = params.get("bodyColor") ? decodeURIComponent(params.get("bodyColor")!) : (darkMode ? "#94a3b8" : "#666666");
    const starColor = params.get("starColor") ? decodeURIComponent(params.get("starColor")!) : "#f59e0b";
    const showStars = params.get("showStars") !== "0";
    const showAvatar = params.get("showAvatar") !== "0";
    const showCompany = params.get("showCompany") !== "0";

    const config: CardConfig = { layout, darkMode, radius, padding, shadow, font, cardBg, nameColor, companyColor, bodyColor, starColor, showStars, showAvatar, showCompany };

    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [spaceName, setSpaceName] = useState("");

    useEffect(() => {
        if (!spaceId) { setLoading(false); return; }
        (async () => {
            try {
                const [{ data: space }, { data: tData }] = await Promise.all([
                    supabase.from("spaces").select("name").eq("id", spaceId).single(),
                    supabase.from("testimonials").select("*").eq("space_id", spaceId).eq("status", "approved").order("created_at", { ascending: false }),
                ]);
                if (space) setSpaceName(space.name);
                const mapped = (tData || []).map((t: any) => ({
                    name: t.author_name,
                    company: t.author_company || "",
                    rating: t.rating,
                    content: t.content,
                    initials: getInitials(t.author_name),
                    type: t.type,
                    video_url: t.video_url || null,
                }));
                setTestimonials(mapped);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [spaceId]);

    const bg = darkMode ? "hsl(240 10% 4%)" : "#f8fafc";
    const textColor = darkMode ? "#f1f5f9" : "#1a1a1a";
    const subColor = darkMode ? "#64748b" : "#94a3b8";

    return (
        <div className="min-h-screen transition-colors duration-300" style={{ background: bg, fontFamily: "system-ui, sans-serif" }}>
            {/* Header bar */}
            <div className="border-b px-6 py-3 flex items-center gap-3" style={{ borderColor: darkMode ? "hsl(240 4% 16%)" : "#e2e8f0", background: darkMode ? "hsl(240 8% 6%)" : "#ffffff" }}>
                <img src="/src/assets/logo-icon.svg" alt="Vouchy Logo Icon" className="h-4 w-4" />
                <span className="text-xs font-semibold tracking-wide" style={{ color: textColor }}>
                    Vouchy Widget Preview{spaceName ? ` — ${spaceName}` : ""}
                </span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#3b82f6" + "20", color: "#3b82f6" }}>
                    {layout.charAt(0).toUpperCase() + layout.slice(1)} layout
                </span>
            </div>

            <div className="p-6 lg:p-10 max-w-6xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : !spaceId ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <FolderOpen className="h-12 w-12 mb-4" style={{ color: subColor }} />
                        <p className="text-base font-medium" style={{ color: textColor }}>No space selected</p>
                        <p className="text-sm mt-1" style={{ color: subColor }}>Go back to Widget Lab and select a space first.</p>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <FolderOpen className="h-12 w-12 mb-4" style={{ color: subColor }} />
                        <p className="text-base font-medium" style={{ color: textColor }}>No approved testimonials</p>
                        <p className="text-sm mt-1" style={{ color: subColor }}>Approve some testimonials in your dashboard to see them here.</p>
                    </div>
                ) : layout === "minimal" ? (
                    <div className="max-w-lg mx-auto">
                        {testimonials.map((t, i) => <TestimonialCard key={i} t={t} config={config} index={i} />)}
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((t, i) => <TestimonialCard key={i} t={t} config={config} index={i} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
