import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Hero,
  BentoGrid,
  HowItWorks,
  Pricing,
  CTA,
  ProductShowcase,
  TestimonialDesigns,
} from "@/components/landing";

const EMBED_SPACE = "lol-1772383756334";

const VouchyWidget = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const host = window.location.origin;
    const handler = (event: MessageEvent) => {
      if (
        event.origin === host &&
        event.data?.type === "vouchy-resize" &&
        event.data?.height &&
        iframeRef.current
      ) {
        iframeRef.current.style.height = `${event.data.height}px`;
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const params = new URLSearchParams({
    layout: "editorial",
    minRating: "0",
    max: "50",
    darkMode: "true",
    radius: "12",
    padding: "16",
    font: "system",
    accent: encodeURIComponent("#3b82f6"),
    cardBg: encodeURIComponent("#121212"),
    nameColor: encodeURIComponent("#f5f5f7"),
    companyColor: encodeURIComponent("#8e8e93"),
    bodyColor: encodeURIComponent("#aeaeb2"),
    starColor: encodeURIComponent("#0aa939"),
    showStars: "true",
    showAvatar: "true",
    showCompany: "true",
    shadow: "sm",
    displayMode: "grid",
    carouselVisible: "3",
    navStyle: "arrows",
    autoPlay: "false",
    autoPlaySpeed: "3000",
    navIconColor: encodeURIComponent("#ffffff"),
    navBgColor: encodeURIComponent("#2c2c2e"),
    primaryBtnColor: encodeURIComponent("#ffffff"),
    t: Date.now().toString(),
  });

  const src = `${window.location.origin}/embed/${EMBED_SPACE}?${params.toString()}`;

  return (
    <div className="w-full relative z-20 -mt-10 overflow-hidden">
      <iframe
        ref={iframeRef}
        src={src}
        style={{ width: "100%", border: "none", overflow: "hidden", background: "transparent", height: "650px" }}
        title="Vouchy testimonials"
      />
    </div>
  );
};

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary overflow-x-hidden relative">

      {/* Navigation — Wide Split Glassmorphism Header */}
      <nav className="fixed top-6 inset-x-0 z-[100] flex justify-center px-6 pointer-events-none">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }}
          className="w-full max-w-7xl h-16 bg-background/60 dark:bg-card/40 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_-15px_rgba(20,184,166,0.15),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[24px] flex items-center justify-between px-6 pointer-events-auto"
        >
          {/* LEFT: Logo Icon Section (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-1 justify-start">
            <Link
              to="/"
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:scale-105 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src="/src/assets/logo-icon.svg"
                alt="Vouchy"
                className="h-6 w-6 relative z-10 transition-transform duration-500 group-hover:rotate-6"
              />
            </Link>
          </div>

          {/* CENTER: Navigation Links (Always Visible, Focused on Mobile) */}
          <div className="flex-1 lg:flex-none flex items-center justify-center overflow-x-auto no-scrollbar py-2">
            {[
              { label: "Features", href: "#features" },
              { label: "Design", href: "#design-showcase" },
              { label: "Workflow", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
            ].map(({ label, href }, index, array) => (
              <div key={label} className="flex items-center">
                <a
                  href={href}
                  className="px-3 md:px-6 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground/70 hover:text-primary transition-all duration-300 relative group/nav h-12 flex items-center shrink-0"
                >
                  {label}
                  <motion.span
                    className="absolute bottom-2 left-3 md:left-6 right-3 md:right-6 h-[1.5px] bg-primary rounded-full scale-x-0 group-hover/nav:scale-x-100 transition-transform origin-center"
                  />
                </a>
                {index < array.length - 1 && (
                  <div className="h-3 w-px bg-primary/30 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* RIGHT: Actions Section (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-5">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/10"
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.div>
            </button>

            <Link
              to="/auth"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 hover:text-primary transition-colors"
            >
              Sign In
            </Link>

            <Button
              size="sm"
              className="vouchy-gradient-bg text-white hover:opacity-90 rounded-full px-6 h-10 text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.05] active:scale-[0.98] border-0"
              asChild
            >
              <Link to="/auth?mode=signup">Get Access</Link>
            </Button>
          </div>
        </motion.div>
      </nav>

      {/* Page Sections */}
      <main className="pt-24">
        <Hero />
        <VouchyWidget />
        <BentoGrid />
        <ProductShowcase />
        <TestimonialDesigns />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>

      {/* Footer */}
      <footer className="py-24 bg-background border-t border-border">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <img
                src="/src/assets/logo-horizontal.svg"
                alt="Vouchy"
                className="h-5 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 dark:invert"
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">
                Precision Social Proof Architecture.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex gap-12">
                <a href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-foreground transition-all">Privacy</a>
                <a href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-foreground transition-all">Terms</a>
                <a href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-foreground transition-all">Twitter</a>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
                © 2026 Vouchy Labs — All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
