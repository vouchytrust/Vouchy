import { Sparkles, Link2, Mic2, Terminal, Settings2, ShieldCheck, Wand2, Globe2 } from "lucide-react";

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
    <div className="px-3 py-1 rounded-full bg-muted border border-border text-[7px] font-mono text-muted-foreground whitespace-nowrap overflow-hidden">
      vouchy.click/c/vouchy-rmxe
    </div>
    <div className="absolute top-4 right-4">
      <div className="w-2 h-2 rounded-full bg-primary/40" />
    </div>
  </div>
);

const VisualCapture = () => (
  <div className="relative w-full aspect-[16/10] rounded-xl border border-primary/10 bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center">
    <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
      <div className="w-2 h-2 rounded-full bg-red-500" />
    </div>
    <div className="flex gap-0.5 h-6 items-end">
      {[4, 8, 12, 8, 4].map((height, i) => (
        <div 
          key={i}
          style={{ height: `${height}px` }}
          className="w-1 bg-primary/40 rounded-full"
        />
      ))}
    </div>
    <Mic2 className="w-3 h-3 text-primary/40 mt-3" />
  </div>
);

const VisualRefine = () => (
  <div className="relative w-full aspect-[16/10] rounded-xl border border-primary/10 bg-card overflow-hidden p-3 flex flex-col justify-center">
    <div className="space-y-2">
      <div className="h-1.5 w-full bg-muted rounded-full" />
      <div className="h-1.5 w-full bg-muted rounded-full opacity-40" />
      <div className="h-1.5 w-3/4 bg-primary/20 rounded-full" />
      <Wand2 className="absolute top-3 right-3 w-4 h-4 text-primary" />
    </div>
    <div className="mt-4 flex items-center gap-2 px-1">
      <Sparkles className="w-3 h-3 text-primary" />
      <div className="text-[6px] font-bold text-primary/60 uppercase tracking-tighter">AI Assisted</div>
    </div>
  </div>
);

const VisualDeploy = () => (
  <div className="relative w-full aspect-[16/10] rounded-xl border border-primary/10 bg-background overflow-hidden p-2 pt-6 flex flex-col">
    <div className="absolute top-0 left-0 right-0 h-4 border-b border-primary/10 bg-muted/30 flex items-center px-2">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
      </div>
    </div>
    <div className="flex-1 flex flex-col gap-1 mt-2 font-mono text-[6px] text-primary/60">
      <div><span className="text-green-500">&gt;</span> deploy</div>
      <div>&nbsp;&nbsp;optimizing...</div>
      <div>&nbsp;&nbsp;✓ done</div>
    </div>
    <div className="h-6 rounded bg-card border border-border flex items-center px-2 gap-1">
      <Globe2 className="w-3 h-3 text-primary" />
      <div className="text-[6px] text-muted-foreground truncate">your-site.com</div>
    </div>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      title: "Create your space",
      description: "Set up a dedicated space for your testimonials with custom branding and collection settings.",
      visual: <VisualArchitect />,
    },
    {
      title: "Share your link",
      description: "Send customers a simple link to record or write their testimonial — no account required.",
      visual: <VisualLink />,
    },
    {
      title: "Capture testimonials",
      description: "Customers can record a video or write text. Our AI assistant helps them feel confident.",
      visual: <VisualCapture />,
    },
    {
      title: "AI crafts the script",
      description: "Our AI helps customers write compelling testimonials and suggests talking points for video.",
      visual: <VisualRefine />,
    },
    {
      title: "Deploy anywhere",
      description: "Copy one line of code and display beautiful testimonials on your website instantly.",
      visual: <VisualDeploy />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} 
      />
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Workflow</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            From zero to <span className="text-primary">trust</span> in minutes.
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Five simple steps to collect and display powerful social proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex-1 rounded-2xl border border-border/50 bg-card/50 p-4">
                <div className="mb-4">
                  <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.4em]">0{i + 1}</span>
                </div>
                {step.visual}
                <h3 className="text-base font-bold text-foreground mt-4 mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center py-2">
                  <div className="w-8 h-[1px] bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
