import { motion } from "framer-motion";
import { TbVideo, TbMessage, TbCode, TbBolt, TbPlayerPlayFilled, TbTrendingUp, TbStarFilled, TbWand, TbMicrophone } from "react-icons/tb";

const BentoGrid = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4"
          >
            Capabilities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
          >
            All-in-one platform for <br />
            <span className="text-primary">social proof.</span>
          </motion.h2>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">

          {/* Card 1: Dual-Mode Collection */}
          <motion.div
            className="lg:col-span-3 bg-card rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-border flex flex-col justify-between h-[400px] overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-10 inset-x-10 h-[220px] flex gap-4">
              <div className="flex-1 bg-foreground rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:-translate-x-2 transition-transform duration-500">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                  <div className="w-6 h-6 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                </div>
                <div className="absolute bottom-3 text-[10px] text-background/60 font-medium">Video</div>
              </div>
              <div className="flex-1 bg-muted rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center relative group-hover:translate-x-2 transition-transform duration-500">
                <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-sm mb-2">
                  <TbMessage className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="w-16 h-1.5 bg-border rounded-full mb-1" />
                <div className="w-10 h-1.5 bg-border rounded-full" />
                <div className="absolute bottom-3 text-[10px] text-muted-foreground font-medium">Text</div>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Dual-Mode Collection</h3>
              <p className="text-muted-foreground text-sm">Give your customers the choice. They can record a quick video or type a thoughtful note.</p>
            </div>
          </motion.div>

          {/* Card 2: Wall of Love */}
          <motion.div
            className="lg:col-span-3 bg-card rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-border flex flex-col justify-between h-[400px] overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="absolute top-8 inset-x-10 h-[180px] flex flex-col gap-3 overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
              }}
            >
              <div className="columns-2 gap-3 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`break-inside-avoid bg-muted p-3 rounded-xl border border-border ${i % 2 === 0 ? 'mt-4' : ''}`}>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, j) => <TbStarFilled key={j} className="w-2 h-2 text-yellow-500" />)}
                    </div>
                    {i === 2 ? (
                      <div className="aspect-video bg-border rounded-lg mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TbPlayerPlayFilled className="w-4 h-4 text-muted-foreground drop-shadow-md" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-border rounded-full" />
                        <div className="h-1.5 w-2/3 bg-border rounded-full" />
                        <div className="h-1.5 w-4/5 bg-border rounded-full" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
                      <div className="h-1.5 w-12 bg-border rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-foreground">The Wall of Love</h3>
              <p className="text-muted-foreground text-sm">Mix video and text testimonials in a single, beautiful grid. It makes your social proof look dense and active.</p>
            </div>
          </motion.div>

          {/* Card 3: AI Script Assistant */}
          <motion.div
            className="lg:col-span-2 bg-card rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-border flex flex-col justify-between h-[320px] overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-[140px] relative overflow-hidden rounded-2xl bg-muted/60 border border-border p-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 bg-foreground rounded-xl p-4 shadow-xl transform rotate-[-3deg] group-hover:rotate-0 transition-all duration-500 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <TbMicrophone className="w-3 h-3 text-background/50" />
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-background font-medium leading-tight">"This product changed our workflow..."</p>
                    <p className="text-[11px] text-background/40 font-medium leading-tight blur-[0.5px]">It was incredibly easy to setup.</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-card rounded-full shadow-sm flex items-center justify-center border border-border">
                  <TbWand className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-xl font-bold mb-2 text-foreground">AI Script Assistant</h3>
              <p className="text-muted-foreground text-xs">Stuck? Our AI generates scripts and cues a teleprompter for perfect takes.</p>
            </div>
          </motion.div>

          {/* Card 4: Zero-Code Embed (Dark accent card — intentionally high contrast) */}
          <motion.div
            className="lg:col-span-2 bg-foreground rounded-[2.5rem] p-8 shadow-xl border border-border hover:opacity-95 transition-all duration-500 flex flex-col justify-between h-[320px] overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-[140px] bg-background/10 rounded-xl p-4 font-mono text-[10px] text-background/50 border border-background/10 overflow-hidden relative">
              <div className="absolute top-0 w-full h-6 bg-background/10 border-b border-background/10 flex items-center px-2 gap-1.5 left-0">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="mt-6 space-y-1 opacity-80 break-all">
                <p>&lt;<span className="text-blue-400">script</span></p>
                <p className="pl-2">src=<span className="text-primary/80">"https://vouchy.click/embed.js"</span></p>
                <p className="pl-2">data-id=<span className="text-yellow-400/80">"f985f44e..."</span></p>
                <p className="pl-2">defer</p>
                <p>&gt;&lt;/<span className="text-blue-400">script</span>&gt;</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-xl font-bold mb-2 text-background">Zero-Code Embed</h3>
              <p className="text-background/50 text-xs">One script for everything. Just paste a single line into your site.</p>
            </div>
          </motion.div>

          {/* Card 5: Lightning Fast */}
          <motion.div
            className="lg:col-span-2 bg-card rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-border flex flex-col justify-between h-[320px] overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="h-[140px] relative overflow-hidden rounded-2xl bg-muted/60 border border-border p-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-card shadow-sm border border-border flex items-center justify-center">
                  <TbCode className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <TbBolt className="w-4 h-4" />
                  Fast load
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-card border border-border p-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Embed</p>
                  <p className="mt-1 text-sm font-black text-foreground">1 line</p>
                </div>
                <div className="rounded-xl bg-card border border-border p-3">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Impact</p>
                  <p className="mt-1 text-sm font-black flex items-center gap-1 text-foreground">
                    <TbTrendingUp className="w-4 h-4 text-primary" />
                    Faster
                  </p>
                </div>
              </div>
              <div className="absolute -left-10 -top-12 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-xl font-bold mb-2 text-foreground">Install in minutes</h3>
              <p className="text-muted-foreground text-xs">Drop in a tiny script and publish. No rebuilds, no performance tradeoffs.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BentoGrid;