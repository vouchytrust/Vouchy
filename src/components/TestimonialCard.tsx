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
        className={`${fontMap[font]} transition-all duration-300`}
        style={containerStyle}
      >
        <div className="flex gap-4">
          <div className="shrink-0">
            {avatarSmall}
          </div>
          <div className="flex-1 min-w-0 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
               <div>
                 <div className="text-[14px] font-semibold tracking-tight" style={{ color: nameColor }}>{t.name}</div>
                 {showCompany && <div className="text-[12px] opacity-70 mt-0.5" style={{ color: companyColor }}>{t.company}</div>}
               </div>
               <div className="shrink-0 mt-0.5">
                 {stars}
               </div>
            </div>
            
            <div className="pt-1">
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
        </div>
      </motion.div>
    );
  }

  if (layout === "centered") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} transition-all duration-300 flex flex-col items-center text-center h-full justify-between backdrop-blur-md`}
        style={containerStyle}
      >
        <div className="flex-1 flex flex-col min-h-0 w-full mb-3">
           {showStars && <div className="flex justify-center mb-3 shrink-0">{stars}</div>}
           <div className="text-[15px] leading-relaxed relative flex flex-col flex-1 min-h-0" style={{ color: bodyColor }}>
              <div className="overflow-hidden relative flex-1 flex flex-col justify-center">
                 {t.content && contentRenderer(t.content, true)}
              </div>
              {t.type === "video" && <div className="mt-auto shrink-0 pt-3 flex justify-center w-full">{videoButton}</div>}
           </div>
        </div>
        
        <div className="flex flex-col items-center mt-auto pt-3 shrink-0 border-t w-full" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
           <div className="mb-2">{avatarSmall}</div>
           <div className="text-[13px] font-bold tracking-tight" style={{ color: nameColor }}>{t.name}</div>
           {showCompany && <div className="text-[11px] opacity-70 mt-0.5" style={{ color: companyColor }}>{t.company}</div>}
        </div>
      </motion.div>
    );
  }

  if (layout === "modern") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col relative overflow-hidden backdrop-blur-md`}
        style={containerStyle}
      >
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none transition-transform duration-700 hover:rotate-12 hover:scale-110">
           <Quote className="w-24 h-24 rotate-6" style={{ color: config.accent || nameColor }} />
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col min-h-0">
           <div className="mb-3">
              {stars}
           </div>
           
           <div className="text-[14.5px] leading-relaxed relative flex flex-col flex-1 min-h-0" style={{ color: bodyColor }}>
              <div className="overflow-hidden relative flex-1">
                 {t.content && contentRenderer(t.content)}
              </div>
              {t.type === "video" && <div className="mt-auto shrink-0 pt-3">{videoButton}</div>}
           </div>
        </div>
        
        <div className="mt-4 pt-3 border-t shrink-0 flex items-center gap-3 relative z-10" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
           {avatarSmall}
           <div className="min-w-0">
             <div className="text-[13px] font-bold truncate tracking-tight" style={{ color: nameColor }}>{t.name}</div>
             {showCompany && <div className="text-[11px] opacity-70 truncate mt-0.5" style={{ color: companyColor }}>{t.company}</div>}
           </div>
        </div>
      </motion.div>
    );
  }

  if (layout === "editorial") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group/editorial flex flex-col h-full relative overflow-hidden backdrop-blur-md`}
        style={{ ...containerStyle, borderLeftWidth: '4px', borderLeftColor: config.accent }}
      >
        {/* Subtle decorative quote */}
        <div className="absolute top-4 right-4 opacity-[0.04] pointer-events-none transition-transform duration-700 group-hover/editorial:scale-110 group-hover/editorial:-rotate-3">
          <Quote className="w-20 h-20" style={{ color: config.accent }} />
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative z-10 w-full sm:pl-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 shrink-0">
             <div className="flex items-center gap-3">
               <div className="shrink-0">{avatarSmall}</div>
               <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold tracking-tight" style={{ color: nameColor }}>{t.name}</span>
                  {showCompany && <span className="text-[10.5px] font-medium opacity-60 uppercase tracking-widest mt-0.5" style={{ color: companyColor }}>{t.company}</span>}
               </div>
             </div>
          </div>
          
          {/* Content */}
          <div className="text-[15px] leading-relaxed relative flex flex-col flex-1 min-h-0" style={{ color: bodyColor }}>
            <div className="overflow-hidden relative flex-1 italic opacity-95">
               {t.content && contentRenderer(t.content)}
            </div>
            {t.type === "video" && <div className="mt-auto shrink-0 pt-4 pb-1">{videoButton}</div>}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3.5 border-t shrink-0 flex items-center justify-between relative z-10 sm:pl-1" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
           <div className="flex items-center gap-2.5 opacity-90 transition-opacity group-hover/editorial:opacity-100">
              <span className="text-[10px] font-bold uppercase tracking-widest relative top-[1px]" style={{ color: config.accent }}>Verified</span>
              <div className="w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: config.accent }} />
              {showStars && <div className="scale-90 origin-left flex items-center">{stars}</div>}
           </div>
        </div>
      </motion.div>
    );
  }

  if (layout === "bubble") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} transition-all duration-300 group/bubble hover:-translate-y-1 flex flex-col h-full`}
      >
        {/* The Speech Bubble */}
        <div
          className="relative border shadow-sm transition-all duration-500 group-hover/bubble:shadow-xl flex flex-col flex-1 backdrop-blur-xl"
          style={{ ...containerStyle, borderRadius: '24px' }}
        >
          {/* Header row in bubble */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            {stars}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm" style={{ backgroundColor: config.accent + '15', borderColor: config.accent + '25' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: config.accent }} />
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: config.accent }}>Verified</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-h-0 text-[15px] leading-relaxed relative z-10 w-full" style={{ color: bodyColor }}>
            <div className="overflow-hidden relative flex-1">
              {contentRenderer(t.content)}
            </div>
            {t.type === "video" && <div className="mt-auto pt-4 shrink-0">{videoButton}</div>}
          </div>

          {/* Tail pointing down-left out of the bubble */}
          <div className="absolute -bottom-2.5 left-8 w-5 h-5 overflow-hidden rotate-45 border-r border-b backdrop-blur-xl z-10" style={{ backgroundColor: bgWithOpacity, borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
        </div>

        {/* Profile Section completely outside the bubble */}
        <div className="flex items-center gap-3 pt-5 pl-4 shrink-0 mt-auto transition-transform duration-500 group-hover/bubble:translate-x-1">
          <div className="shrink-0">{avatarSmall}</div>
          <div className="flex flex-col min-w-0">
            <div className="text-[13.5px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
            {showCompany && <div className="text-[11px] font-medium opacity-60 truncate mt-0.5" style={{ color: companyColor }}>{t.company}</div>}
          </div>
        </div>
      </motion.div>
    );
  }

  if (layout === "avatar-wall") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} h-full transition-all duration-300 pt-10`}
      >
        <div 
           className="text-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full relative backdrop-blur-lg group/wall"
           style={{ ...containerStyle, borderRadius: '24px' }}
        >
          {/* Floating Avatar */}
          <div className="absolute left-1/2 -top-10 -translate-x-1/2 transition-transform duration-500 group-hover/wall:scale-110 group-hover/wall:-translate-y-1 origin-bottom">
             {avatarLarge}
          </div>
          
          <div className="shrink-0 flex flex-col items-center pt-8 mb-4">
            <div className="text-[15px] font-bold tracking-tight truncate w-full px-2" style={{ color: nameColor }}>{t.name}</div>
            {showCompany && <div className="text-[11px] font-medium opacity-60 mt-1 truncate w-full px-2 uppercase tracking-widest" style={{ color: companyColor }}>{t.company}</div>}
          </div>

          <div className="flex-1 flex flex-col min-h-0 w-full px-2">
            <div className="text-[15px] leading-relaxed relative flex flex-col flex-1 min-h-0" style={{ color: bodyColor }}>
              <div className="overflow-hidden relative flex-1 flex flex-col justify-center items-center">
                {contentRenderer(t.content, true)}
              </div>
              {t.type === "video" && <div className="mt-auto shrink-0 pt-4 flex justify-center w-full">{videoButton}</div>}
            </div>
          </div>

          {/* Elegant separated absolute bottom footer for stars if present */}
          {showStars && (
            <div className="mt-5 shrink-0 flex justify-center items-center pb-2">
                <div className="px-4 py-1.5 rounded-full border shadow-sm flex gap-1 items-center" style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                  {stars}
                </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (layout === "masonry") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl break-inside-avoid mb-6 flex flex-col backdrop-blur-md relative overflow-hidden group/masonry`}
        style={containerStyle}
      >
        {/* Subtle top border highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover/masonry:opacity-100 transition-opacity duration-500" style={{ backgroundColor: config.accent }} />

        <div className="flex items-start gap-3 mb-5 shrink-0">
          <div className="shrink-0">{avatarSmall}</div>
          <div className="min-w-0 flex flex-col justify-center mt-0.5">
            <div className="text-[14px] font-bold tracking-tight" style={{ color: nameColor }}>{t.name}</div>
             {showCompany && <div className="text-[11.5px] font-medium opacity-60 uppercase tracking-widest mt-0.5 truncate" style={{ color: companyColor }}>{t.company}</div>}
          </div>
          <div className="ml-auto mt-0.5">
             {stars}
          </div>
        </div>

        <div className="flex-1 text-[15px] leading-relaxed flex flex-col" style={{ color: bodyColor }}>
          <div className="opacity-95 flex-1 relative z-10">
             {contentRenderer(t.content, false, true)}
          </div>
          {t.type === "video" && <div className="mt-4 shrink-0 pb-1">{videoButton}</div>}
        </div>
      </motion.div>
    );
  }

  if (layout === "video") {
    const isActuallyVideo = t.type === "video" && !!t.video_url;

    const ThumbnailContent = (
      <div className={`relative aspect-[4/5] sm:aspect-video flex flex-col items-center justify-center overflow-hidden w-full h-full group/thumbnail transition-all duration-700`} 
           style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.05)' }}>
        
        {/* Full-width Video/Image */}
        {isActuallyVideo ? (
          <video 
            src={`${t.video_url}#t=0.1`}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/thumbnail:opacity-100 transition-all duration-700 group-hover/thumbnail:scale-110"
            preload="metadata"
            muted
            playsInline
          />
        ) : t.avatar ? (
          <img src={t.avatar} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/thumbnail:opacity-100 transition-all duration-700 group-hover/thumbnail:scale-110" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 opacity-40">
             <Quote className="w-24 h-24 rotate-12" style={{ color: config.accent }} />
          </div>
        )}
        
        {/* Play Button Overlay */}
        {isActuallyVideo && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group-hover/thumbnail:scale-110 group-hover/thumbnail:rotate-[360deg] backdrop-blur-md border border-white/20" 
                 style={{ backgroundColor: config.accent + 'dd' }}>
              <Play className="w-7 h-7 text-white fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Info Overlay (Bottom) */}
        <div className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-2 group-hover/thumbnail:translate-y-0 transition-transform duration-500 z-20">
           <div className="flex items-center gap-3">
              {showAvatar && (
                 <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-lg" style={{ borderColor: config.accent + '40' }}>
                    {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-black/40 text-[10px] font-bold text-white">{t.initials}</div>}
                 </div>
              )}
              <div className="min-w-0 flex-1">
                 <p className="text-white font-bold text-[14px] truncate drop-shadow-md">{t.name}</p>
                 {showCompany && <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold truncate drop-shadow-sm">{t.company}</p>}
              </div>
              {showStars && (
                <div className="shrink-0 flex gap-0.5 opacity-90">
                   {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-2.5 w-2.5" style={{ color: j < t.rating ? config.starColor : 'rgba(255,255,255,0.2)', fill: j < t.rating ? config.starColor : "none" }} />
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Hover Highlight Border */}
        <div className="absolute inset-0 border-2 border-primary/0 group-hover/thumbnail:border-primary/40 transition-colors duration-500 pointer-events-none z-30" style={{ borderColor: config.accent + '00', groupHoverBorderColor: config.accent + '40' } as any} />
      </div>
    );

    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} transition-all duration-500 group/video h-full relative overflow-hidden`}
        style={{ ...containerStyle, padding: 0 }}
      >
        {isActuallyVideo ? (
          <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
            <DialogTrigger asChild>
               {ThumbnailContent}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black/95 border-none shadow-2xl z-[100]">
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                {isVideoOpen && (
                  <iframe
                    src={`${t.video_url}${t.video_url.includes('?') ? '&' : '?'}autoplay=1`}
                    className="absolute inset-0 w-full h-full border-none"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          ThumbnailContent
        )}
      </motion.div>
    );
  }

  // Default: Clean
  return (
    <motion.div
      {...anim}
      className={`${fontMap[font]} border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group/clean flex flex-col h-full relative overflow-hidden backdrop-blur-md`}
      style={containerStyle}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.02] rounded-bl-[100px] pointer-events-none transition-transform duration-700 group-hover/clean:scale-110" style={{ color: config.accent }} />
      
      <div className="flex-1 flex flex-col min-h-0 w-full relative z-10">
        <div className="flex items-center gap-1 mb-4 opacity-90 transition-opacity group-hover/clean:opacity-100 shrink-0">
           {stars}
        </div>
        
        <div className="text-[14.5px] leading-relaxed relative flex flex-col flex-1 min-h-0" style={{ color: bodyColor }}>
            <div className="overflow-hidden relative flex-1 opacity-95">
               {contentRenderer(t.content)}
            </div>
            {t.type === "video" && <div className="mt-auto shrink-0 pt-4 pb-1">{videoButton}</div>}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t shrink-0 flex items-center gap-3 relative z-10 transition-colors" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
         <div className="shrink-0">{avatarSmall}</div>
         <div className="min-w-0 flex flex-col justify-center">
            <div className="text-[13.5px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
            {showCompany && <div className="text-[11px] font-medium opacity-60 mt-0.5 uppercase tracking-widest truncate" style={{ color: companyColor }}>{t.company}</div>}
         </div>
      </div>
    </motion.div>
  );
}


