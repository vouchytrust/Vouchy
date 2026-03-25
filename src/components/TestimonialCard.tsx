import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Play, Quote, AlignLeft } from "lucide-react";
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
  const [showVideoText, setShowVideoText] = useState(false);

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
        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span className="text-xs font-semibold" style={{ color: companyColor }}>{t.initials}</span>
      )}
    </div>
  );

  const solidBgFallback = isTransparentBg ? (darkMode ? '#1c1c1e' : '#ffffff') : cardBg;

  const avatarLarge = showAvatar && (
    <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-4 shadow-lg relative" style={{ backgroundColor: solidBgFallback, borderColor: darkMode ? solidBgFallback : '#fff' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: starColor + "20" }} />
      {t.avatar ? (
        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover relative z-10" loading="lazy" />
      ) : (
        <span className="text-lg font-bold relative z-10" style={{ color: starColor }}>{t.initials}</span>
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

  const renderContentOrThumbnail = (centered = false, isMasonry = false) => {
    return (
      <div className={`relative h-full flex flex-col ${centered ? 'items-center' : ''} w-full`}>
        {contentRenderer(t.content, centered, isMasonry)}
        {t.type === 'video' && t.video_url && showVideoText && (
           <div className={`mt-3 w-full flex ${centered ? 'justify-center' : 'justify-start'}`}>
             <button onClick={(e) => { e.stopPropagation(); setShowVideoText(false); }} className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-80 hover:opacity-100 flex items-center gap-1.5 transition-opacity" style={{ color: config.accent }}>
               <Play className="w-3 h-3 fill-current" /> SHOW VIDEO POSTER
             </button>
           </div>
        )}
      </div>
    );
  };

  const anim = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" as const } };
  
  // Premium shared container classes
  const containerStyle = {
    borderRadius: `${radius}px`,
    padding: `${padding}px`,
    backgroundColor: bgWithOpacity,
    borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    boxShadow: shadow === 'none' ? 'none' : darkMode ? `0 8px 32px 0 rgba(0,0,0,0.3), inset 0 1px 1px 0 rgba(255,255,255,0.05)` : `0 8px 24px -8px rgba(0,0,0,0.08), inset 0 1px 1px 0 rgba(255,255,255,0.8)`
  };

  if (t.type === "video" && t.video_url && !showVideoText && layout !== "video") {
    const hasText = !!t.content && t.content.trim().length > 5;
    
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} relative w-full h-full min-h-[300px] overflow-hidden group/video-override shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col`}
        style={{ ...containerStyle, padding: 0 }}
      >
        <div className="absolute inset-0 bg-black/5 z-0" />
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogTrigger asChild>
            <div className="absolute inset-0 cursor-pointer overflow-hidden z-10" style={{ borderRadius: 'inherit' }}>
              <video src={`${t.video_url}#t=0.1`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/video-override:scale-105 opacity-90" preload="metadata" muted playsInline />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video-override:bg-black/10 transition-colors">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/20 transition-transform duration-500 group-hover/video-override:scale-110" style={{ backgroundColor: config.accent }}>
                  <Play className="w-6 h-6 text-white fill-current ml-1" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black/95 border-none shadow-2xl z-[100]">
            <div className="aspect-video w-full bg-black relative flex items-center justify-center">
              {isVideoOpen && <video src={t.video_url || ''} className="w-full h-full object-contain" controls autoPlay />}
            </div>
          </DialogContent>
        </Dialog>

        {hasText && (
          <div className="absolute top-4 right-4 z-30">
            <button onClick={(e) => { e.stopPropagation(); setShowVideoText(true); }} className="px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 shadow-sm text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 active:scale-95">
              <AlignLeft className="w-3 h-3" /> READ TEXT
            </button>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 pt-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-20">
           <div className="flex items-center gap-3">
              {showAvatar && (
                 <div className="w-11 h-11 rounded-full border-2 border-white/20 overflow-hidden shadow-lg shrink-0" style={{ borderColor: config.accent + '40' }}>
                    {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-black/40 text-[10px] font-bold text-white">{t.initials}</div>}
                 </div>
              )}
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                 <p className="text-white font-bold text-[15px] truncate drop-shadow-md tracking-tight leading-tight">{t.name}</p>
                 {showCompany && <p className="text-white/80 text-[10.5px] uppercase tracking-[0.15em] font-bold truncate drop-shadow-sm mt-0.5">{t.company}</p>}
              </div>
              {showStars && (
                <div className="shrink-0 flex gap-[2px] opacity-95">
                   {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5" style={{ color: j < t.rating ? starColor : 'rgba(255,255,255,0.2)', fill: j < t.rating ? starColor : "none" }} />
                   ))}
                </div>
              )}
           </div>
        </div>
        <div className="absolute inset-0 border pointer-events-none z-30" style={{ borderRadius: 'inherit', borderColor: 'rgba(255,255,255,0.1)' }} />
      </motion.div>
    );
  }

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
               {renderContentOrThumbnail()}
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
        className={`${fontMap[font]} border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl flex flex-col items-center text-center h-full relative overflow-hidden group/centered backdrop-blur-xl`}
        style={containerStyle}
      >
        <div className="absolute top-0 inset-x-0 h-32 opacity-10 pointer-events-none transition-opacity duration-700 group-hover/centered:opacity-20" style={{ background: `radial-gradient(ellipse at top, ${config.accent}, transparent 70%)` }} />

        <div className="shrink-0 transition-transform duration-500 group-hover/centered:scale-110 group-hover/centered:-translate-y-1 relative z-10 mt-1 mb-4">
           {showAvatar && (
             <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-sm" style={{ backgroundColor: solidBgFallback, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
               {t.avatar ? <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" loading="lazy" /> : <span className="text-sm font-bold" style={{ color: starColor }}>{t.initials}</span>}
             </div>
           )}
        </div>

        <div className="shrink-0 flex flex-col items-center mb-5 relative z-10 w-full px-2">
           <div className="text-[17px] font-black tracking-tight drop-shadow-sm w-full truncate" style={{ color: nameColor }}>{t.name}</div>
           {showCompany && <div className="text-[10.5px] font-bold opacity-60 mt-1 uppercase tracking-[0.2em] w-full truncate" style={{ color: companyColor }}>{t.company}</div>}
           
           <div className="mt-4 flex justify-center">
             <div className="flex gap-2 items-center px-4 py-1.5 rounded-full border shadow-inner transition-colors duration-500 group-hover/centered:border-opacity-30" style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)' }}>
               {showStars && stars}
               {showStars && <div className="w-px h-3 mx-1 opacity-20" style={{ backgroundColor: config.accent }} />}
               <span className="text-[9px] font-bold uppercase tracking-widest relative top-[0.5px]" style={{ color: config.accent }}>Verified</span>
             </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 w-full relative z-10 px-2 pb-1">
           <Quote className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 opacity-[0.03] transition-transform duration-500 group-hover/centered:scale-125 pointer-events-none" style={{ color: config.accent || bodyColor }} />
           <div className="text-[15px] leading-relaxed relative flex flex-col flex-1 min-h-0 italic font-medium" style={{ color: bodyColor }}>
              <div className="overflow-hidden relative flex-1 flex flex-col justify-center items-center opacity-95 group-hover/centered:opacity-100 transition-opacity">
                 {renderContentOrThumbnail(true)}
              </div>
           </div>
        </div>
      </motion.div>
    );
  }

  if (layout === "modern") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} border transition-all duration-500 hover:-translate-y-1 group/modern h-full flex flex-col relative overflow-hidden backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-opacity-50`}
        style={{ ...containerStyle, borderRadius: '20px', borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
      >
        <div className="absolute top-0 left-0 w-full h-[3px] opacity-70 group-hover/modern:opacity-100 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(90deg, ${config.accent}, transparent)` }} />
        <div className="absolute right-0 top-0 w-32 h-32 pointer-events-none opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: `radial-gradient(circle at center, ${config.accent} 1px, transparent 1px)`, backgroundSize: '8px 8px' }} />

        <div className="flex items-center gap-4 mb-5 relative z-10 shrink-0 mt-1">
           {showAvatar && (
             <div className="shrink-0 transition-transform duration-500 group-hover/modern:scale-110">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border shadow-sm ring-1 ring-black/5" style={{ backgroundColor: solidBgFallback, borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}>
                  {t.avatar ? <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" loading="lazy" /> : <span className="text-sm font-bold" style={{ color: starColor }}>{t.initials}</span>}
                </div>
             </div>
           )}
           
           <div className="flex-1 min-w-0">
             <div className="text-[15.5px] font-bold truncate tracking-tight" style={{ color: nameColor }}>{t.name}</div>
             {showCompany && <div className="text-[11px] font-semibold opacity-70 truncate mt-0.5 uppercase tracking-wider" style={{ color: companyColor }}>{t.company}</div>}
           </div>

           {showStars && (
             <div className="shrink-0 mb-auto">
               <div className="px-2.5 py-1.5 rounded-md border flex items-center gap-1 shadow-sm transition-colors group-hover/modern:bg-opacity-80" style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                 {stars}
               </div>
             </div>
           )}
        </div>
        
        <div className="text-[14.5px] leading-relaxed relative flex flex-col flex-1 min-h-0 z-10 px-1" style={{ color: bodyColor }}>
           <div className="overflow-hidden relative flex-1 opacity-95 group-hover/modern:opacity-100 transition-opacity">
              {renderContentOrThumbnail()}
           </div>
        </div>

        <Quote className="absolute bottom-3 right-4 w-20 h-20 opacity-[0.02] -rotate-6 transition-transform duration-700 group-hover/modern:rotate-0 group-hover/modern:scale-110 group-hover/modern:-translate-y-2 pointer-events-none" style={{ color: nameColor }} />
      </motion.div>
    );
  }

  if (layout === "editorial") {
    const editorialContainer = {
      padding: `${Math.max(padding, 24)}px`,
      backgroundColor: bgWithOpacity,
      borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      borderWidth: shadow === 'none' ? '0' : '1px',
    };

    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} flex flex-col h-full relative group/editorial transition-transform duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl`}
        style={editorialContainer}
      >
        <div className="w-12 h-1 mb-5 transition-all duration-500 group-hover/editorial:w-20" style={{ backgroundColor: config.accent }} />

        <div className="flex-1 flex flex-col min-h-0 relative z-10 w-full mb-6">
          <div className="relative h-full flex flex-col flex-1 min-h-0">
             <p className="text-[16px] leading-[1.7] font-serif opacity-95 line-clamp-5 group-hover/editorial:opacity-100 transition-opacity" style={{ color: bodyColor }}>
               <span className="text-[48px] float-left leading-[0.75] pr-2 pt-1.5 font-serif font-black" style={{ color: config.accent, opacity: 0.6 }}>"</span>
               {t.content}
             </p>
             {isLongText && (
               <button onClick={(e) => { e.stopPropagation(); setIsTextOpen(true); }} className="mt-3 text-[10px] uppercase tracking-[0.2em] font-bold inline-flex items-center w-fit transition-all hover:pl-2" style={{ color: config.accent }}>Read full story &rarr;</button>
             )}
             {t.type === 'video' && !!t.video_url && showVideoText && (
                <button onClick={(e) => { e.stopPropagation(); setShowVideoText(false); }} className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] opacity-80 hover:opacity-100 flex items-center gap-1.5 transition-opacity" style={{ color: config.accent }}>
                  <Play className="w-3 h-3 fill-current" /> SHOW VIDEO POSTER
                </button>
             )}
          </div>
        </div>

        {/* Full story dialog — must live in the same render tree as the trigger button */}
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
              <div className="flex items-center pb-3 border-b" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                {stars}
              </div>
              <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-serif" style={{ color: config.bodyColor }}>
                {t.content}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        <div className="w-full h-px mb-5 opacity-50" style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }} />

        <div className="shrink-0 flex items-center justify-between w-full mt-auto">
           <div className="flex items-center gap-3">
             <div className="shrink-0 grayscale group-hover/editorial:grayscale-0 transition-all duration-500">{avatarSmall}</div>
             <div className="flex flex-col min-w-0 font-sans">
                <span className="text-[12px] font-bold tracking-widest uppercase truncate w-full" style={{ color: nameColor }}>{t.name}</span>
                {showCompany && <span className="text-[10px] font-medium opacity-60 mt-0.5 uppercase tracking-wider truncate w-full" style={{ color: companyColor }}>{t.company}</span>}
             </div>
           </div>
           {showStars && (
             <div className="shrink-0 pl-3">
               {stars}
             </div>
           )}
        </div>
      </motion.div>
    );
  }

  if (layout === "bubble") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} transition-all duration-500 group/bubble flex flex-col h-full`}
      >
        <div
          className="relative border transition-all duration-500 flex flex-col flex-1 backdrop-blur-xl shadow-sm hover:shadow-lg hover:-translate-y-1"
          style={{ ...containerStyle, borderRadius: '24px' }}
        >
          {showStars && (
             <div className="mb-4 shrink-0 opacity-90 scale-95 origin-left">
               {stars}
             </div>
          )}

          <div className="flex-1 flex flex-col min-h-0 text-[14.5px] leading-relaxed relative z-10 w-full" style={{ color: bodyColor }}>
            <div className="overflow-hidden relative flex-1 opacity-95">
               <p className="text-[14px] leading-relaxed line-clamp-4" style={{ color: bodyColor }}>{t.content}</p>
               {isLongText && <button onClick={(e) => { e.stopPropagation(); setIsTextOpen(true); }} className="mt-1.5 font-bold text-[11px] inline-flex items-center gap-1 w-fit hover:opacity-80" style={{ color: config.accent }}>Read full story</button>}
               {t.type === 'video' && !!t.video_url && showVideoText && (
                  <button onClick={(e) => { e.stopPropagation(); setShowVideoText(false); }} className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] opacity-80 hover:opacity-100 flex items-center gap-1.5 transition-opacity" style={{ color: config.accent }}>
                    <Play className="w-3 h-3 fill-current" /> SHOW VIDEO POSTER
                  </button>
               )}
            </div>
          </div>

          {/* Simple downward tail */}
          <div className="absolute -bottom-2.5 left-8 w-5 h-5 rotate-45 border-r border-b z-10 pointer-events-none transition-colors duration-500" 
               style={{ backgroundColor: isTransparentBg ? (darkMode ? '#1c1c1e' : '#ffffff') : bgWithOpacity, borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
        </div>

        {/* Profile Details outside the bubble */}
        <div className="flex items-center gap-3.5 pt-6 pl-4 shrink-0 mt-auto transition-transform duration-500 group-hover/bubble:translate-x-1">
           <div className="shrink-0">
              {avatarSmall}
           </div>
           
           <div className="flex flex-col min-w-0">
             <div className="text-[14px] font-bold tracking-tight truncate" style={{ color: nameColor }}>{t.name}</div>
             {showCompany && <div className="text-[11px] font-medium opacity-60 truncate mt-0.5 uppercase tracking-wider" style={{ color: companyColor }}>{t.company}</div>}
           </div>
        </div>
      </motion.div>
    );
  }

  if (layout === "avatar-wall") {
    return (
      <motion.div
        {...anim}
        className={`${fontMap[font]} h-full transition-all duration-300 pt-12 pb-2 px-1`}
      >
        <div 
           className="text-center border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full relative group/wall"
           style={{ ...containerStyle, borderRadius: '28px', overflow: 'visible' }}
        >
          {/* Subtle Ambient Glow inside the top of the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-32 rounded-full blur-[50px] opacity-10 pointer-events-none transition-opacity duration-700 group-hover/wall:opacity-30" style={{ backgroundColor: config.accent }} />

          {/* Floating Avatar with Verified Badge */}
          <div className="absolute left-1/2 -top-12 -translate-x-1/2 transition-transform duration-500 group-hover/wall:scale-110 group-hover/wall:-translate-y-2 origin-bottom z-20">
             <div className="relative">
                {avatarLarge}
                <div 
                  className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-sm z-30 transition-transform duration-500 group-hover/wall:rotate-12" 
                  style={{ backgroundColor: config.accent, borderColor: darkMode ? cardBg : '#ffffff' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
             </div>
          </div>

          {/* Decorative Quote mark */}
          <div className="absolute top-8 right-6 opacity-[0.02] transition-transform duration-700 group-hover/wall:rotate-12 group-hover/wall:scale-125 z-0 pointer-events-none">
             <Quote className="w-20 h-20" style={{ color: config.accent || nameColor }} />
          </div>
          
          {/* Profile Details */}
          <div className="shrink-0 flex flex-col items-center pt-7 mb-5 relative z-10 w-full px-4">
            <div className="text-[17px] font-black tracking-tight truncate w-full" style={{ color: nameColor }}>{t.name}</div>
            {showCompany && <div className="text-[10.5px] font-bold opacity-60 mt-1.5 truncate w-full uppercase tracking-[0.15em]" style={{ color: companyColor }}>{t.company}</div>}
          </div>

          {/* Testimonial body */}
          <div className="flex-1 flex flex-col min-h-0 w-full px-5 relative z-10">
            <div className="text-[14.5px] leading-relaxed relative flex flex-col flex-1 min-h-0" style={{ color: bodyColor }}>
              <div className="overflow-hidden relative flex-1 flex flex-col justify-center items-center opacity-95 group-hover/wall:opacity-100 transition-opacity">
                {renderContentOrThumbnail(true)}
              </div>
            </div>
          </div>

          {/* Stylish Stars Pill */}
          {showStars && (
            <div className="mt-6 shrink-0 flex justify-center items-center pb-2 relative z-10">
                <div 
                  className="px-5 py-2 rounded-full flex gap-1 items-center transition-all duration-300 group-hover/wall:shadow-md border" 
                  style={{ 
                    backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)', 
                    borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
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
             {renderContentOrThumbnail(false, true)}
          </div>
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
          <img src={t.avatar} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/thumbnail:opacity-100 transition-all duration-700 group-hover/thumbnail:scale-110" loading="lazy" />
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
               {renderContentOrThumbnail()}
            </div>
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


