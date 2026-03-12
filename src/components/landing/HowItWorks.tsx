import { motion } from "framer-motion";
import { Sparkles, Link2, Mic2, Terminal, Settings2, ShieldCheck, Wand2, Globe2 } from "lucide-react";

/**
 * MINI VISUAL COMPONENTS FOR THE 5-STEP PROTOCOL
 */

const VisualArchitect = () => (
  <div className="relative w-full aspect-[16/10] rounded-xl border border-primary/10 bg-card overflow-hidden p-3">
    <div className="w-full h-full border border-dashed border-primary/20 rounded-lg bg-primary/[0.02] flex flex-col p-2">
      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center mb-3">
        <Settings2 className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="space-y-2">
        <div className="h-1 w-full bg-primary/20 rounded-full" />
        <div className="h-1 w-2/3 bg-primary/20 rounded-full" />
        <div className="pt-2 flex gap-1">
          <div className="w-2 h-2 rounded bg-primary/30" />
          <div className="w-2 h-2 rounded bg-muted" />
        </div>
      </div>
    </div>
  </div>
);

const VisualLink = () => (
  <div className="relative w-full aspect-[16/10] rounded-xl border border-primary/10 bg-card overflow-hidden flex flex-col items-center justify-center">
    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3 border border-primary/10">
      <Link2 className="w-5 h-5 text-primary" />
    </div>
    <div className="px-3 py-1 rounded-full bg-muted border border-border text-[7px] font-mono text-muted-foreground">
      vouchy.app/ref/081
    </div>
    <motion.div 
      animate={{ x: [0, 4, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute top-4 right-4"
    >
      <div className="w-2 h-2 rounded-full bg-primary/40 animate-ping" />
    </motion.div>
  </div>
);

const VisualCapture = () => (
  <div className="relative w-full aspect-[16/10] rounded-xl border border-primary/10 bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center">
    <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
    </div>
    <div className="flex gap-0.5 h-6 items-end">
      {[1, 2, 3, 4, 5].map(i => (
        <motion.div 
          key={i}
          animate={{ height: [4, 16, 4] }}
          transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
          className="w-1 bg-primary/40 rounded-full"
        />
      ))}
    </div>
    <Mic2 className="w-3 w-3 text-primary/40 mt-3" />
  </div>
);

const VisualRefine = () => (
  <div className="relative w-full aspect-[16/10] rounded-xl border border-primary/10 bg-card overflow-hidden p-3 flex flex-col justify-center">
    <div className="space-y-2 relative">
      <div className="h-1.5 w-full bg-muted rounded-full" />
      <div className="h-1.5 w-full bg-muted rounded-full opacity-40" />
      <div className="h-1.5 w-3/4 bg-primary/20 rounded-full" />
      <Wand2 className="absolute -top-4 -right-2 w-4 h-4 text-primary animate-bounce" />
    </div>
    <div className="mt-4 flex justify-between items-center px-1">
      <ShieldCheck className="w-3 h-3 text-green-500/50" />
      <div className="text-[6px] font-bold text-primary/60 uppercase tracking-tighter">AI Polished</div>
    </div>
  </div>
);

const VisualDeploy = () => (
  <div className="relative w-full aspect-[16/10] rounded-xl border border-primary/10 bg-background overflow-hidden p-2 pt-6 flex flex-col">
    <div className="absolute top-0 left-0 right-0 h-4 border-b border-primary/10 bg-muted/30 flex items-center px-2">
      <Terminal className="w-2 h-2 text-primary/30" />
    </div>
    <div className="font-mono text-[7px] space-y-2 opacity-80 pt-2">
      <div className="text-primary/60">TRUST_INJECT: OK</div>
      <div className="p-1.5 rounded bg-primary/5 border border-primary/10 text-primary/80 line-clamp-2">
        &lt;vouch-widget id="ref-master" /&gt;
      </div>
    </div>
    <Globe2 className="w-12 h-12 text-primary/5 absolute -bottom-4 -right-4" />
  </div>
);

const steps = [
  {
    id: "01",
    tag: "Init",
    title: "Set up your space",
    desc: "Create a collector, add your questions, and make it look like yours.",
    visual: <VisualArchitect />,
    bullets: []
  },
  {
    id: "02",
    tag: "Route",
    title: "Share a link",
    desc: "Send a simple link to your customers — by email, SMS, or QR code.",
    visual: <VisualLink />,
    bullets: []
  },
  {
    id: "03",
    tag: "Intake",
    title: "They record or write",
    desc: "Customers leave a video or text review right in their browser. No app needed.",
    visual: <VisualCapture />,
    bullets: []
  },
  {
    id: "04",
    tag: "Sync",
    title: "Review and approve",
    desc: "AI cleans up the text. You approve what goes live.",
    visual: <VisualRefine />,
    bullets: []
  },
  {
    id: "05",
    tag: "Push",
    title: "Embed anywhere",
    desc: "Paste one line of code and your testimonials show up on your site instantly.",
    visual: <VisualDeploy />,
    bullets: []
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-8 lg:py-12 bg-background relative overflow-hidden flex flex-col justify-center">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-primary" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-primary" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-primary" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-primary" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 lg:mb-8 max-w-7xl mx-auto">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-2"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">How it works</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground leading-[1.1]"
            >
              Simple from start <br className="hidden md:block" />
              to <span className="text-primary">finish.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-base text-muted-foreground leading-relaxed max-w-sm font-light lg:text-right"
          >
            Go from zero to a live testimonial wall in minutes, not days.
          </motion.p>
        </div>

        {/* 5-Step Row Grid */}
        <div className="relative">
          {/* Horizontal Connection Bar */}
          <div className="absolute top-24 left-0 w-full h-px bg-primary/10 hidden lg:block -z-10" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 xl:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col p-4 rounded-2xl transition-all duration-500 bg-card/40 border border-border/50 backdrop-blur-sm"
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-primary/30 group-hover:border-primary/70 transition-all duration-500 group-hover:w-9 group-hover:h-9" />
                <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-primary/30 group-hover:border-primary/70 transition-all duration-500 group-hover:w-9 group-hover:h-9" />
                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-primary/30 group-hover:border-primary/70 transition-all duration-500 group-hover:w-9 group-hover:h-9" />
                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-primary/30 group-hover:border-primary/70 transition-all duration-500 group-hover:w-9 group-hover:h-9" />
                
                {/* Visual Header */}
                <div className="mb-4 relative">
                  <div className="transition-all duration-700 group-hover:scale-[1.05]">
                    {step.visual}
                  </div>
                  {/* Phase Marker */}
                  <div className="absolute -top-3 -left-2 px-2 py-0.5 rounded-md bg-background border border-primary/20 text-[8px] font-black text-primary uppercase tracking-widest shadow-xl">
                    Phase {step.id}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed font-light line-clamp-3">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}