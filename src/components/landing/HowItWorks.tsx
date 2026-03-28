import { Layers2, ArrowUpRight, MessageSquare, PencilLine, Code2 } from "lucide-react";

// ── Shared icon frame ─────────────────────────────────────────────────────────
function IconFrame({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className="relative w-full aspect-[16/10] rounded-xl border border-border/60 bg-card overflow-hidden flex items-center justify-center">
      {/* Centre axis lines */}
      <span className="absolute inset-x-0 top-1/2 h-px bg-primary/[0.06]" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-primary/[0.06]" />
      {/* Icon */}
      <div className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
        accent
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
          : "bg-muted/70 border border-border/70 text-foreground"
      }`}>
        {children}
      </div>
    </div>
  );
}

// 01 — Create your space
const VisualArchitect = () => (
  <IconFrame>
    <Layers2 className="w-5 h-5" strokeWidth={1.5} />
  </IconFrame>
);

// 02 — Share your link
const VisualLink = () => (
  <IconFrame>
    <ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
  </IconFrame>
);

// 03 — Capture testimonials
const VisualCapture = () => (
  <IconFrame accent>
    <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
  </IconFrame>
);

// 04 — AI crafts the script
const VisualRefine = () => (
  <IconFrame>
    <PencilLine className="w-5 h-5" strokeWidth={1.5} />
  </IconFrame>
);

// 05 — Deploy anywhere
const VisualDeploy = () => (
  <IconFrame>
    <Code2 className="w-5 h-5" strokeWidth={1.5} />
  </IconFrame>
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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 lg:mb-10 max-w-7xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Workflow</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground leading-[1.1]">
              From zero to <br className="hidden lg:block" />
              <span className="text-primary font-medium">trust</span> in minutes.
            </h2>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm font-light lg:text-right">
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
