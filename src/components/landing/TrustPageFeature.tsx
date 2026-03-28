import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link2, Globe2, LayoutGrid, Star, ShieldCheck } from "lucide-react";

const TrustPageFeature = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section className="relative py-16 md:py-24 px-6 overflow-hidden bg-background border-b border-border min-h-[80vh] flex flex-col justify-center" ref={containerRef}>
      {/* Background aesthetics */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Copy */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-6"
            >
              <Globe2 className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Instant Magic</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 text-foreground leading-[1.05]"
            >
              No developer? <br />
              <span className="text-primary font-medium">No problem.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed font-medium max-w-md"
            >
              Instantly generate a beautifully hosted, public Trust Page. Share your dedicated link and display your best testimonials exactly the way you want : <strong className="text-foreground">zero setup required.</strong>
            </motion.p>
          </div>

          {/* Right: Trust Page Visual */}
          <div className="relative h-[480px] lg:h-[600px] flex items-center justify-center">

            {/* The Main Mockup */}
            <motion.div
              style={{ y }}
              className="relative w-full max-w-[460px] rounded-2xl group/card bg-card/60 border border-primary/10 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              {/* Browser Header */}
              <div className="border-b border-primary/10 p-3 md:p-4 flex items-center justify-between bg-card/40 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400/80 shadow-sm" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400/80 shadow-sm" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400/80 shadow-sm" />
                </div>
                {/* Mock URL block */}
                <div className="flex-1 min-w-0 max-w-[200px] mx-2 md:mx-4 h-7 rounded-full bg-background/80 border border-border/50 flex items-center justify-center px-3 gap-2 shadow-inner">
                  <Link2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary/50 shrink-0 hidden sm:block" />
                  <span className="text-[9px] md:text-[10px] font-mono text-muted-foreground truncate font-medium">vouchy.click/t/brand</span>
                </div>
                <div className="h-7 px-2 md:px-3 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center gap-1.5 shadow-sm shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black tracking-widest text-primary uppercase hidden sm:inline-block">Live</span>
                  <span className="text-[9px] font-black tracking-widest text-primary uppercase sm:hidden">Go</span>
                </div>
              </div>

              {/* Page Content Mockup */}
              <div className="p-8 relative z-10 bg-gradient-to-b from-background/40 to-background/80 h-[360px] overflow-hidden">

                {/* Brand Header */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-primary to-primary/60 border border-primary/30 flex items-center justify-center mb-4 shadow-lg shadow-primary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 blur-md transform -skew-x-12 translate-x-4" />
                    <Globe2 className="w-6 h-6 text-white relative z-10" />
                  </div>
                  <div className="h-3.5 w-40 bg-foreground/90 rounded-full mb-3 shadow-sm" />
                  <div className="h-2 w-56 bg-muted-foreground/40 rounded-full" />
                </div>

                {/* Staggered Masonry Grid Mock */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.5 }}
                      className={`rounded-2xl border border-primary/5 bg-card/80 p-4 shadow-md backdrop-blur-sm ${i % 2 === 0 ? 'mt-4' : ''}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full shadow-inner ${i === 1 ? 'bg-blue-400' : i === 2 ? 'bg-emerald-400' : i === 3 ? 'bg-amber-400' : 'bg-purple-400'}`} />
                        <div className="space-y-1.5">
                          <div className="h-2 w-16 bg-foreground/80 rounded-full" />
                          {/* Stars */}
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Text Skeletons */}
                      <div className="space-y-2 mt-2">
                        <div className="h-1.5 w-full bg-muted-foreground/30 rounded-full" />
                        <div className="h-1.5 w-[90%] bg-muted-foreground/30 rounded-full" />
                        <div className="h-1.5 w-[70%] bg-muted-foreground/30 rounded-full" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Huge Background Glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[80px] pointer-events-none"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
              />

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustPageFeature;
