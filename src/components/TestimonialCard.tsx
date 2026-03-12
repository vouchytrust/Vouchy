import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Play, Quote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const fontMap: Record<string, string> = { system: "font-sans", inter: "font-sans", georgia: "font-serif", mono: "font-mono" };
export const shadowMap: Record<string, string> = { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg", xl: "shadow-xl" };

export interface CardConfig {
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
  primaryBtnColor?: string; // Optional for some viewers
  containerBg?: string;
}

export interface TestimonialItem {
  name: string;
  company: string;
  rating: number;
  content: string;
  avatar?: string | null;
  type: string;
  video_url?: string | null;
  initials: string;
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

export function TestimonialCard({ t, config, index }: { t: TestimonialItem; config: CardConfig; index: number }) {
  const { layout, darkMode, radius, padding, font, cardBg, nameColor, companyColor, bodyColor, starColor, showStars, showAvatar, showCompany, shadow } = config;

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isTextOpen, setIsTextOpen] = useState(false);

  const isTransparentBg = !cardBg || cardBg === 'transparent';
  const rgbBg = isTransparentBg ? null : (hexToRgb(cardBg) || (darkMode ? '28, 28, 30' : '255, 255, 255'));
  const bgWithOpacity = isTransparentBg ? 'transparent' : `rgba(${rgbBg}, ${darkMode ? 0.85 : 0.95})`;

  const stars = showStars && (
    <div className="flex gap-[3px]">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star key={j} className="h-3 w-3" style={{ color: j < t.rating ? starColor : (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), fill: j < t.rating ? starColor : "none" }} />
      ))}
    </div>
  );

  const avatarSmall = showAvatar && (
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2" style={{ backgroundColor: darkMode ? "hsl(240 4% 16%)" : "#f3f4f6", borderColor: config.accent + '30' }}>
      {t.avatar ? (
        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs font-semibold" style={{ color: companyColor }}>{t.initials}</span>
      )}
    </div>
  );

  const avatarLarge = showAvatar && (
    <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-4 shadow-lg" style={{ backgroundColor: starColor + "20", borderColor: darkMode ? cardBg : '#fff' }}>
      {t.avatar ? (
        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-lg font-bold" style={{ color: starColor }}>{t.initials}</span>
      )}
    </div>
  );

  const isLongText = t.content.length > 120;

  const contentRenderer = (text: string, centered = false, isMasonry = false) => (
    <div className={`relative h-full flex flex-col ${centered ? 'items-center' : ''}`}>
      <p
        className={`text-[13px] leading-relaxed opacity-95 ${centered ? 'text-center' : ''} ${isMasonry ? '' : 'line-clamp-4'}`}
        style={{ color: bodyColor }}
      >
        {t.content}
      </p>
      {isLongText && !isMasonry && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsTextOpen(true); }}
          className="mt-1.5 font-bold text-[11px] inline-flex items-center gap-1 w-fit transition-opacity hover:opacity-80"
          style={{ color: config.accent }}
        >
          Read full story
        </button>
      )}

      <Dialog open={isTextOpen} onOpenChange={setIsTextOpen}>
        <DialogContent className="max-w-md p-6 sm:rounded-2xl" style={{ backgroundColor: config.cardBg, color: config.nameColor }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-base font-semibold">
              {avatarSmall}
              <div className="flex flex-col text-left justify-center">
                <span className="text-sm font-bold leading-tight" style={{ color: config.nameColor }}>{t.name}</span>
                {showCompany && <span className="text-[11px] font-medium opacity-60 mt-0.5" style={{ color: config.companyColor }}>{t.company}</span>}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              {stars}
              {t.type === "video" && (
                <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: config.accent + '20', color: config.accent }}>Video</div>
              )}
            </div>
            <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: config.bodyColor }}>
              {t.content}
            </p>
            {t.type === "video" && videoButton}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const videoButton = t.type === "video" && t.video_url && (
    <div className="flex mt-3">
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogTrigger asChild>
          <button 
            className="flex items-center gap-2.5 px-4 py-2 rounded-full text-[12px] font-bold transition-all hover:scale-105 active:scale-95 shadow-sm border"
            style={{ 
              backgroundColor: config.accent + '15', 
              color: config.accent,
              borderColor: config.accent + '30'
            }}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: config.accent + '30' }}>
              <Play className="h-2.5 w-2.5 fill-current" />
            </div>
            Watch Video
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none ring-0 sm:rounded-2xl">
          <div className="aspect-video w-full h-full relative group bg-black">
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

  const anim = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" as const } };
  
  // Premium shared container classes
  const containerStyle = {
    borderRadius: `${radius}px`,
    padding: `${padding}px`,
    backgroundColor: bgWithOpacity,
    borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    boxShadow: shadow === 'none' ? 'none' : darkMode ? `0 8px 32px 0 rgba(0,0,0,0.3), inset 0 1px 1px 0 rgba(255,255,255,0.05)` : `0 8px 24px -8px rgba(0,0,0,0.08), inset 0 1px 1px 0 rgba(255,255,255,0.8)`
  };

  if (layout === "minimal") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} border-b transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]`}
        style={{ padding: `${padding}px 0`, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      >
        <div className="flex items-start gap-4">
          {avatarSmall}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[13px] font-bold tracking-tight" style={{ color: nameColor }}>{t.name}</span>
                {showCompany && <span className="text-[11px] font-medium opacity-60" style={{ color: companyColor }}>· {t.company}</span>}
              </div>
              <div>{stars}</div>
            </div>

            {t.type === "text" ? (
              contentRenderer(t.content)
            ) : (
              <div className="space-y-3">
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
      <motion.div {...anim} className={`${fontMap[font]} border-l-[4px] transition-all hover:-translate-y-1 flex flex-col h-[240px] relative overflow-hidden backdrop-blur-md`} 
        style={{ ...containerStyle, borderColor: config.accent }}>
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <Quote className="w-16 h-16" style={{ color: config.accent }} />
        </div>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">
          <div className="overflow-hidden mb-3">
            {contentRenderer(t.content)}
          </div>
          {t.type === "video" && <div className="mt-auto shrink-0 pb-2">{videoButton}</div>}
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t shrink-0 relative z-10" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
          {avatarSmall}
          <div className="min-w-0">
            <div className="text-[12px] font-bold truncate tracking-tight" style={{ color: nameColor }}>{t.name}</div>
            {showCompany && <div className="text-[10px] font-medium opacity-60 truncate mt-0.5" style={{ color: companyColor }}>{t.company}</div>}
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
        className={`${fontMap[font]} transition-all duration-300 group/bubble hover:-translate-y-1.5 h-full`}
      >
        <div
          className="relative border shadow-sm transition-all duration-500 group-hover/bubble:shadow-2xl flex flex-col h-[280px] backdrop-blur-xl"
          style={{
            ...containerStyle,
            borderRadius: '24px' // Hardcoded for bubble aesthetic
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            {stars}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border shadow-sm" style={{ backgroundColor: config.accent + '15', borderColor: config.accent + '25' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: config.accent }} />
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: config.accent }}>Verified</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="mt-1 overflow-hidden relative z-10 w-full">
              {contentRenderer(t.content)}
            </div>
            {t.type === "video" && <div className="mt-auto pt-3 shrink-0">{videoButton}</div>}
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-3 pt-3 mt-3 border-t shrink-0" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
            <div className="shrink-0">{avatarSmall}</div>
            <div className="flex flex-col min-w-0">
              <div className="text-[12px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
              {showCompany && <div className="text-[10px] font-medium opacity-60 truncate mt-0.5" style={{ color: companyColor }}>{t.company}</div>}
            </div>
          </div>

          {/* Tail */}
          <div className="absolute -bottom-2.5 left-10 w-5 h-5 overflow-hidden rotate-45 pointer-events-none backdrop-blur-xl z-[-1]">
            <div
              className="w-full h-full border-r border-b"
              style={{ backgroundColor: bgWithOpacity, borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}
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
        className={`${fontMap[font]} text-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col h-[280px] mt-8 relative backdrop-blur-lg`}
        style={containerStyle}
      >
        <div className="absolute left-1/2 -top-10 -translate-x-1/2">
           {avatarLarge}
        </div>
        <div className="shrink-0 flex flex-col items-center pt-8 mb-2">
          <div className="text-[13px] font-bold tracking-tight truncate w-full px-2" style={{ color: nameColor }}>{t.name}</div>
          {showCompany && <div className="text-[10.5px] font-medium opacity-60 mb-2 truncate w-full px-2" style={{ color: companyColor }}>{t.company}</div>}
          <div className="mb-2 bg-black/5 dark:bg-white/5 py-1 px-3 rounded-full">{stars}</div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-2">
          <div className="overflow-hidden">
            {contentRenderer(t.content, true)}
          </div>
          {t.type === "video" && <div className="mt-auto pt-2 flex justify-center shrink-0">{videoButton}</div>}
        </div>
      </motion.div>
    );
  }

  if (layout === "masonry") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl break-inside-avoid mb-6 flex flex-col backdrop-blur-md`}
        style={containerStyle}
      >
        <div className="flex items-center gap-3 mb-3 shrink-0">
          {avatarSmall}
          <div className="min-w-0">
            <div className="text-[13px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
            {showCompany && <div className="text-[11px] font-medium opacity-60 truncate mt-0.5" style={{ color: companyColor }}>{t.company}</div>}
          </div>
        </div>
        <div className="flex-1">
          {contentRenderer(t.content, false, true)}
          {t.type === "video" && <div className="mt-3 shrink-0">{videoButton}</div>}
        </div>
        <div className="mt-4 pt-3 border-t shrink-0 flex justify-between items-center" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
          {stars}
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.accent, opacity: 0.5 }} />
        </div>
      </motion.div>
    );
  }

  // Default: Clean
  return (
    <motion.div
      {...anim}
      className={`${fontMap[font]} border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group/card flex flex-col h-[240px] backdrop-blur-md relative`}
      style={containerStyle}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-bl-full pointer-events-none transition-opacity group-hover/card:opacity-[0.05]" style={{ color: config.accent }} />
      <div className="flex items-center gap-3 mb-3 shrink-0 relative z-10">
        {avatarSmall}
        <div className="min-w-0">
          <div className="text-[13px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
          {showCompany && <div className="text-[11px] font-medium opacity-60 truncate mt-0.5" style={{ color: companyColor }}>{t.company}</div>}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">
        <div className="overflow-hidden relative">
          {contentRenderer(t.content)}
        </div>
        {t.type === "video" && <div className="mt-auto shrink-0 pt-2">{videoButton}</div>}
      </div>
      <div className="mt-3 pt-3 border-t shrink-0 relative z-10" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
        {stars}
      </div>
    </motion.div>
  );
}
