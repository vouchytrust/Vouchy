import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { TestimonialItem, CardConfig, fontMap } from "./TestimonialCard";

/* ─── Shared Testimonial Pop-up ─────────────────────────────────── */
function TestimonialModal({
  t,
  config,
  onClose,
}: {
  t: TestimonialItem;
  config: CardConfig;
  onClose: () => void;
}) {
  const { darkMode, accent, starColor, nameColor, bodyColor, companyColor } = config;

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(24px) saturate(1.6)",
            WebkitBackdropFilter: "blur(24px) saturate(1.6)",
            backgroundColor: darkMode ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0.36)",
          }}
        />

        <motion.div
          className="relative max-w-[440px] w-full rounded-[32px] overflow-hidden shadow-2xl z-10"
          initial={{ scale: 0.85, opacity: 0, y: 32 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 32 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: darkMode ? "rgba(10,10,14,0.98)" : "rgba(255,255,255,0.99)",
            border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"}`,
            boxShadow: `
              0 0 100px -20px ${accent}25,
              0 32px 64px -16px rgba(0,0,0,0.5),
              inset 0 0 0 1px ${darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"}
            `,
          }}
        >
          {/* Top accent line with ambient bloom */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] blur-[1px] opacity-60 z-10" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          <div
            className="w-full h-[4px] shrink-0"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-20"
            style={{ backgroundColor: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)" }}
          >
            <X className="w-[15px] h-[15px]" style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)" }} />
          </button>

          <div className="p-7 pt-6">
            {/* Avatar + identity */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-[60px] h-[60px] rounded-2xl overflow-hidden shrink-0 shadow-md"
                style={{
                  backgroundColor: darkMode ? "#1c1c1e" : "#f4f4f5",
                  outline: `3px solid ${accent}28`,
                  outlineOffset: "2px",
                }}
              >
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-xl" style={{ color: accent }}>
                    {t.initials}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-[17px] leading-tight truncate" style={{ color: nameColor }}>{t.name}</p>
                {t.company && (
                  <p className="text-[13px] font-medium mt-[2px] truncate" style={{ color: companyColor }}>{t.company}</p>
                )}
                <div className="flex items-center gap-[2px] mt-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-[14px] h-[14px]" style={{ color: starColor, fill: j < t.rating ? starColor : "none" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Video */}
            {t.type === "video" && t.video_url && (
              <div className="relative mb-5 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9", backgroundColor: "#000" }}>
                <video src={t.video_url + "#t=0.1"} controls className="w-full h-full object-cover" preload="metadata" />
              </div>
            )}

            {/* Quote */}
            <div
              className="text-[52px] font-black leading-[0] mb-3 select-none"
              style={{ color: accent, opacity: 0.22 }}
            >
              &ldquo;
            </div>

            <p className="text-[15px] leading-[1.7] font-medium" style={{ color: bodyColor }}>
              {t.content}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Trust Badge Widget ─────────────────────────────────────────── */
export function TrustBadgeWidget({ testimonials, config }: { testimonials: TestimonialItem[]; config: CardConfig }) {
  const { darkMode, font, bodyColor, starColor, accent, nameColor } = config;
  const [selected, setSelected] = useState<TestimonialItem | null>(null);

  const MAX_SHOWN = 10;
  const displayItems = testimonials.slice(0, MAX_SHOWN);
  const overflow = testimonials.length - MAX_SHOWN;

  return (
    <>
      <div className="flex items-center justify-center p-4 w-full h-full">
        <div
          className={`${fontMap[font]} inline-flex items-center gap-3 py-[10px] px-5 rounded-full border shadow-sm transition-all hover:shadow-md backdrop-blur-md hover:-translate-y-px max-w-full overflow-hidden`}
          style={{
            backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)",
            borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          }}
        >
          {/* Stacked avatars */}
          <div className="flex -space-x-[12px] shrink-0">
            {displayItems.map((t, i) => (
              <motion.button
                key={i}
                type="button"
                whileHover={{ scale: 1.1, zIndex: 60 }}
                onClick={() => setSelected(t)}
                className="w-10 h-10 rounded-full border-2 overflow-hidden flex items-center justify-center font-bold text-[12px] relative cursor-pointer focus:outline-none"
                style={{
                  backgroundColor: darkMode ? "#1c1c1e" : "#f4f4f5",
                  borderColor: accent, // Matching constellation styling
                  color: accent,
                  zIndex: MAX_SHOWN - i,
                }}
              >
                {t.avatar ? (
                  <img src={t.avatar} alt="Reviewer" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span>{t.initials}</span>
                )}
              </motion.button>
            ))}
            {overflow > 0 && (
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-[11px] font-black shrink-0"
                style={{
                  backgroundColor: darkMode ? "#1c1c1e" : "#f4f4f5",
                  borderColor: accent, // Consistent borders
                  color: accent,
                  zIndex: 0,
                }}
              >
                +{overflow}
              </div>
            )}
          </div>

          {/* Stars + count */}
          <div className="flex flex-col items-start min-w-0 h-full justify-center">
            <div className="flex items-center gap-[1px] mb-[1px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-[14px] h-[14px]" style={{ fill: starColor, color: starColor }} />
              ))}
            </div>
            <p className="text-[12.5px] font-medium leading-tight opacity-70 whitespace-nowrap" style={{ color: bodyColor }}>
              from <span className="font-bold opacity-100" style={{ color: nameColor }}>{testimonials.length} reviews</span>
            </p>
          </div>
        </div>
      </div>

      {selected && <TestimonialModal t={selected} config={config} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ─── Constellation Widget ───────────────────────────────────────── */

// Avatar sizes by position index (felt and tuned carefully)
const CONSTELLATION_ITEMS = 7;
const AVATAR_SIZES =  [52, 40, 72, 100, 60, 44, 40];        // px
const AVATAR_TOPS  =  [52, 68,  38, 60,  36, 66, 46];       // % of track height
const AVATAR_GAPS  =  [0, 140, 260, 420, 590, 740, 880];    // px left offset within one cycle

// One cycle width = determines scroll speed and feel
const CYCLE_W = 980;
// Track height - Increased to prevent clipping
const TRACK_H = 320;

export function ConstellationWidget({ testimonials, config }: { testimonials: TestimonialItem[]; config: CardConfig }) {
  const { darkMode } = config;
  const [selected, setSelected] = useState<TestimonialItem | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const items = testimonials.slice(0, CONSTELLATION_ITEMS);
  // Duplicate items so the track is wide enough to always fill the viewport
  const loopItems = [...items, ...items, ...items];

  // Responsive: detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleClick = (t: TestimonialItem) => setSelected(t);
  const handleClose = () => setSelected(null);

  /* ── Mobile: render as trust badge ── */
  if (isMobile) {
    return <TrustBadgeWidget testimonials={testimonials} config={config} />;
  }

  /* ── Desktop: constellation ── */
  return (
    <>
      {/* Scrollable track — no bounding box, just a premium glass strip */}
      <div
        className="w-full select-none constell-track"
        style={{
          height: TRACK_H,
          overflowX: "auto",
          overflowY: "visible",
          position: "relative",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          background: darkMode 
            ? "linear-gradient(to bottom, transparent, rgba(255,255,255,0.01) 50%, transparent)" 
            : "linear-gradient(to bottom, transparent, rgba(0,0,0,0.01) 50%, transparent)",
        }}
      >
        {/* Hide webkit scrollbar with a style tag */}
        <style>{`.constell-track::-webkit-scrollbar { display: none; }`}</style>
        
        {/* Edge fade masks — even softer for better blending */}
        <div
          className="absolute inset-y-0 left-0 w-32 pointer-events-none z-20"
          style={{ background: `linear-gradient(to right, ${darkMode ? "hsl(240 10% 4%)" : "#fff"}, transparent)` }}
        />
        <div
          className="absolute inset-y-0 right-0 w-32 pointer-events-none z-20"
          style={{ background: `linear-gradient(to left, ${darkMode ? "hsl(240 10% 4%)" : "#fff"}, transparent)` }}
        />

        {/* Inner track */}
        <div
          className="relative flex-shrink-0"
          style={{ width: CYCLE_W * 3, height: TRACK_H }}
        >
          {loopItems.map((t, i) => {
            const slot   = i % CONSTELLATION_ITEMS;
            const cycle  = Math.floor(i / CONSTELLATION_ITEMS);
            const sz     = AVATAR_SIZES[slot];
            const topPct = AVATAR_TOPS[slot];
            const leftPx = AVATAR_GAPS[slot] + cycle * CYCLE_W;
            const topPx  = (TRACK_H * topPct) / 100;

            return (
              <motion.button
                type="button"
                key={i}
                onClick={() => handleClick(t)}
                onDragStart={(e) => e.preventDefault()}
                className="absolute group/av focus:outline-none"
                style={{
                  left: leftPx,
                  top: topPx,
                  width: sz,
                  height: sz,
                  x: "-50%", // Centering via motion props for stability
                  y: "-50%",
                  zIndex: 10,
                }}
                whileHover={{ scale: 1.08, zIndex: 40 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Interesting Minimal Detail: Dual expanding ring on hover */}
                <div
                  className="absolute inset-[-4px] rounded-full border-2 opacity-0 group-hover/av:opacity-30 group-hover/av:scale-110 transition-all duration-500 pointer-events-none"
                  style={{ borderColor: config.accent }}
                />
                
                {/* Avatar with accent border */}
                <div
                  className="w-full h-full rounded-full overflow-hidden shadow-lg transition-all duration-300 group-hover/av:shadow-accent/20"
                  style={{
                    border: `2px solid ${config.accent}`,
                    backgroundColor: darkMode ? "#1c1c1e" : "#f4f4f5",
                    boxShadow: `0 8px 24px -8px ${config.accent}40`,
                  }}
                >
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover grayscale-[0.2] group-hover/av:grayscale-0 transition-all duration-500" loading="lazy" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-black"
                      style={{ fontSize: Math.max(11, sz * 0.28), color: config.accent }}
                    >
                      {t.initials}
                    </div>
                  )}
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 opacity-0 group-hover/av:opacity-100 transition-all duration-200 pointer-events-none z-50 min-w-[120px] text-center">
                  <div
                    className="inline-block px-3 py-[7px] rounded-2xl shadow-xl border backdrop-blur-xl"
                    style={{
                      backgroundColor: darkMode ? "rgba(12,12,16,0.94)" : "rgba(255,255,255,0.96)",
                      borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                      boxShadow: `0 12px 32px -8px ${config.accent}20`,
                    }}
                  >
                    <span className="text-[12px] font-bold block truncate" style={{ color: config.nameColor }}>{t.name}</span>
                    <div className="flex items-center justify-center gap-[2px] mt-[3px]">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-[9px] w-[9px]" style={{ color: config.starColor, fill: j < t.rating ? config.starColor : "none" }} />
                      ))}
                    </div>
                    <p className="text-[9px] mt-[2px] font-semibold uppercase tracking-wide" style={{ color: config.bodyColor, opacity: 0.5 }}>
                      click to read
                    </p>
                  </div>
                  {/* Arrow */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-[4px] w-2 h-2 rotate-45 border-r border-b"
                    style={{
                      backgroundColor: darkMode ? "rgba(12,12,16,0.94)" : "rgba(255,255,255,0.96)",
                      borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {selected && <TestimonialModal t={selected} config={config} onClose={handleClose} />}

    </>
  );
}
