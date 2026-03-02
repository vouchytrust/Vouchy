import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Video, MessageSquareText, Layout, Sparkles, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  { icon: Video, title: "HD Video Testimonials", desc: "In-browser recorder with teleprompter and guided questions." },
  { icon: MessageSquareText, title: "Text Collection", desc: "Beautiful forms with AI-powered text enhancement." },
  { icon: Layout, title: "15+ Widget Layouts", desc: "From masonry to cinematic sliders — embed anywhere." },
  { icon: Sparkles, title: "AI-Powered", desc: "Script generation, text enhancement, video summaries." },
  { icon: Shield, title: "Moderation Pipeline", desc: "Approve, reject, or favorite — full control." },
  { icon: Star, title: "Brand Customization", desc: "Match your brand colors, fonts, and style." },
];

const plans = [
  { name: "Free", price: "$0", period: "/mo", features: ["10 testimonials", "1 space", "60s video", "Basic widgets"], cta: "Get Started" },
  { name: "Pro", price: "$29", period: "/mo", features: ["50 testimonials", "3 spaces", "180s video", "All widgets", "AI features", "Teleprompter"], cta: "Start Pro Trial", popular: true },
  { name: "Agency", price: "$79", period: "/mo", features: ["250 testimonials", "15 spaces", "300s video", "White-label", "500 AI credits", "Priority support"], cta: "Contact Sales" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src="/src/assets/logo-primary.svg" alt="Vouchy Logo" className="h-[42px] mt-1.5" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Testimonial Platform
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Collect & showcase{" "}
            <span className="vouchy-gradient-text">social proof</span>{" "}
            that converts
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Gather video and text testimonials, curate with AI, and embed stunning widgets on your website — in minutes.
          </motion.p>
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/auth?mode=signup">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="#features">See How It Works</Link>
            </Button>
          </motion.div>
        </div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="container mx-auto max-w-5xl mt-20"
        >
          <div className="rounded-xl border border-border bg-card vouchy-shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-vouchy-sunset/60" />
                <div className="w-3 h-3 rounded-full bg-vouchy-emerald/60" />
              </div>
              <div className="flex-1 text-center text-xs text-muted-foreground">vouchy.app/dashboard</div>
            </div>
            <div className="p-8 bg-muted/20">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[{ label: "Total Testimonials", val: "247" }, { label: "Avg. Rating", val: "4.8" }, { label: "Video Rate", val: "62%" }].map((s) => (
                  <div key={s.label} className="bg-card rounded-lg border border-border p-4">
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                    <div className="text-2xl font-bold text-foreground mt-1">{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-lg border border-border p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full vouchy-gradient-bg flex items-center justify-center text-sm font-semibold text-primary-foreground shrink-0">
                      {["JD", "SK", "AM", "LR"][i - 1]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className="h-3 w-3 fill-vouchy-sunset text-vouchy-sunset" />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {["Amazing product, transformed our workflow!", "Best testimonial tool I've ever used.", "Our conversions went up 40% after adding.", "Simple, beautiful, and incredibly effective."][i - 1]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Powerful tools to collect, manage, and showcase testimonials that drive results.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="group p-6 rounded-xl border border-border bg-card hover:vouchy-shadow-md transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">Start free. Upgrade when you're ready.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`relative p-8 rounded-xl border bg-card ${p.popular ? "border-primary vouchy-shadow-glow" : "border-border"}`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full vouchy-gradient-bg text-xs font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{p.price}</span>
                    <span className="text-muted-foreground">{p.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-vouchy-emerald shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={p.popular ? "default" : "outline"} asChild>
                  <Link to="/auth?mode=signup">{p.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to collect social proof?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join thousands of businesses using Vouchy to build trust and boost conversions.</p>
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/auth?mode=signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/src/assets/logo-icon.svg" alt="Vouchy Logo Icon" className="h-6 w-6" />
            <span className="font-semibold text-foreground">Vouchy</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Vouchy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
