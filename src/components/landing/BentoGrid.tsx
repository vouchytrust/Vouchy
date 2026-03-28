import { motion } from "framer-motion";
import { TbMessage, TbPlayerPlayFilled, TbStarFilled, TbWand, TbMicrophone } from "react-icons/tb";
import { Sparkles } from "lucide-react";

/**
 * ARCHITECTURAL CORNER MARKERS
 */
const CardArchitecture = ({ id, light = false }: { id: string, light?: boolean }) => (
  <>
    {/* Micro-grid lines inside the card */}
    <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

    {/* Centre axis lines */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-primary/[0.03] pointer-events-none" />
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-primary/[0.03] pointer-events-none" />

    {/* Unit Identifier */}
    <div className={`absolute top-3.5 left-4 text-[7px] font-mono ${light ? 'text-background/30' : 'text-primary/30'} uppercase tracking-[0.45em] pointer-events-none select-none group-hover:text-primary/60 transition-colors`}>
      {id}
    </div>
  </>
);

const BentoGrid = () => {
  return (
    <section id="features" className="py-8 lg:py-12 bg-background relative overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header — Left title / Right description */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 lg:mb-10 max-w-7xl mx-auto">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4"
            >

              <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Features</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" as const }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground leading-[1.1]"
            >
              Everything you need <br />
              <span className="text-primary font-medium">in one place.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-base text-muted-foreground leading-relaxed max-w-sm font-light lg:text-right"
          >
            Collect, manage, and display testimonials without juggling multiple tools.
          </motion.p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">

          {/* Card 1: Dual-Mode Collection */}
          <motion.div
            className="lg:col-span-2 rounded-2xl p-5 transition-all duration-500 flex flex-col gap-3 relative group bg-card/40 border border-border/50 backdrop-blur-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <CardArchitecture id="01" />
            {/* Visual - inline, not absolute */}
            <div className="flex gap-3 h-[140px] mt-4 overflow-hidden rounded-2xl">
              <div className="flex-1 bg-card rounded-2xl border border-border/50 flex items-center justify-center relative overflow-hidden group-hover:-translate-x-1 transition-transform duration-500 shadow-xl">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                </div>
                <div className="absolute bottom-3 text-[8px] text-background/40 font-black uppercase tracking-[0.2em]">Video Intake</div>
              </div>
              <div className="flex-1 bg-muted/40 rounded-2xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center relative group-hover:translate-x-1 transition-transform duration-500">
                <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-sm mb-1.5 border border-border">
                  <TbMessage className="w-4 h-4 text-primary/60" />
                </div>
                <div className="w-12 h-0.5 bg-primary/10 rounded-full mb-1" />
                <div className="w-8 h-0.5 bg-primary/10 rounded-full" />
                <div className="absolute bottom-3 text-[8px] text-primary/40 font-black uppercase tracking-[0.2em]">Text Format</div>
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1 text-foreground tracking-tight">Video or text — their choice</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">Customers can record a quick video or type a written review. Whatever feels natural to them.</p>
            </div>
          </motion.div>

          {/* Card 2: AI Script Assistant */}
          <motion.div
            className="lg:col-span-2 rounded-2xl p-5 transition-all duration-500 flex flex-col gap-3 relative group bg-card/40 border border-border/50 backdrop-blur-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <CardArchitecture id="02" />
            {/* Visual */}
            <div className="h-[100px] mt-4 relative overflow-hidden rounded-2xl bg-primary/[0.02] border border-primary/5 flex items-center justify-center">
              <div className="w-32 bg-foreground rounded-xl p-3 shadow-xl transform rotate-[-3deg] group-hover:rotate-0 transition-all duration-700 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <TbMicrophone className="w-3 h-3 text-background/40" />
                  <div className="w-1 h-1 bg-red-500 rounded-full" />
                </div>
                <div className="space-y-1">
                  <div className="h-0.5 w-full bg-background/20 rounded-full" />
                  <div className="h-0.5 w-4/5 bg-background/10 rounded-full" />
                </div>
              </div>
              <div className="absolute top-3 right-3 w-7 h-7 bg-background rounded-xl shadow-lg flex items-center justify-center border border-primary/10">
                <TbWand className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-base font-bold mb-1 text-foreground tracking-tight">AI helps them say it right</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">A built-in teleprompter guides customers so they never freeze in front of the camera.</p>
            </div>
          </motion.div>

          {/* Card 3: Wall of Love */}
          <motion.div
            className="lg:col-span-2 rounded-2xl p-5 transition-all duration-500 flex flex-col gap-3 relative group bg-card/40 border border-border/50 backdrop-blur-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <CardArchitecture id="03" />
            {/* Visual - inline */}
            <div
              className="h-[140px] mt-4 overflow-hidden rounded-2xl"
              style={{
                maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)"
              }}
            >
              <div className="columns-2 gap-3 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`break-inside-avoid bg-muted/30 p-3 rounded-2xl border border-primary/5 ${i % 2 === 0 ? 'mt-4' : ''}`}>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, j) => <TbStarFilled key={j} className="w-2 h-2 text-yellow-500/80" />)}
                    </div>
                    {i === 2 ? (
                      <div className="aspect-video bg-muted/80 rounded-xl mb-1 relative overflow-hidden border border-primary/5">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TbPlayerPlayFilled className="w-4 h-4 text-primary/40" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 opacity-60">
                        <div className="h-0.5 w-full bg-primary/10 rounded-full" />
                        <div className="h-0.5 w-2/3 bg-primary/10 rounded-full" />
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-4 h-4 rounded-full bg-primary/10 border border-primary/10" />
                      <div className="h-0.5 w-8 bg-primary/10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1 text-foreground tracking-tight">Your wall of love</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">All your reviews in one place — videos, text, and ratings displayed beautifully.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
