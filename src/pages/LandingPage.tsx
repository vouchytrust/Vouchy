import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Sun, Moon, ArrowRight, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Hero,
  BentoGrid,
  HowItWorks,
  Pricing,
  CTA,
  TestimonialDesigns,
  TrustPageFeature,
} from "@/components/landing";

import { TbStarFilled, TbSparkles } from "react-icons/tb";
import { VouchyLogo } from "@/components/VouchyLogo";
import { useAuth } from "@/contexts/AuthContext";



export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const { session, profile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const container = document.getElementById('landing-widget-container');
    if (!container) return;

    // Remove any existing children to ensure a clean slate (handles React 18 strict mode double-invoke)
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = `${window.location.origin}/embed.js?v=` + Date.now();
    script.setAttribute("data-widget-id", "3169769a-52c1-4cb6-961c-1ea984f33464");
    script.setAttribute("data-theme", theme);
    script.async = true;

    container.appendChild(script);
  }, [theme]);

  // Load Tawk.to Only on Landing Page
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if Tawk is already loaded to avoid duplicates
      if (document.getElementById('tawk-script')) return;

      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.id = 'tawk-script';
      s1.async = true;
      s1.src = 'https://embed.tawk.to/69c0ee530ad9171c37866bca/1jkcq5uc6';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode?.insertBefore(s1, s0);
    }, 3000); // 3s delay for landing page feel

    return () => {
      clearTimeout(timer);
      // Optional: hide Tawk widget on leave if the platform supports it
      const tawkWidget = document.getElementById('tawk-chat-widget');
      if (tawkWidget) tawkWidget.style.display = 'none';
      if ((window as any).Tawk_API && (window as any).Tawk_API.hideWidget) {
        (window as any).Tawk_API.hideWidget();
      }
    };
  }, []);

  const navLinks: { label: string; href: string; external?: boolean }[] = [
    { label: "Home", href: "#top" },
    { label: "Features", href: "#features" },
    { label: "Design", href: "#design-showcase" },
    { label: "Workflow", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary overflow-x-hidden relative">

      {/* ── NAVIGATION ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-[999] flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl pointer-events-auto px-4 md:px-6"
        >
          {/* Bar */}
          <div
            className={`
              mt-4 md:mt-5 flex items-center h-[58px] md:h-[62px] px-3 md:px-4
              rounded-2xl border transition-all duration-500
              ${scrolled
                ? "bg-background border-primary/20 shadow-sm"
                : "bg-background border-transparent shadow-none"
              }
            `}
          >
            {/* ── LEFT: Logo + Wordmark ─────────────────────── */}
            <VouchyLogo variant="header" className="mr-4" />

            {/* ── CENTER: Nav pills ─────────────────────────── */}
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div className="relative flex items-center gap-1.5 px-1.5 py-1">
                {navLinks.map(({ label, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (href === "#top") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                      setActiveLink(label);
                    }}
                    className={`
                      relative px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.2em]
                      transition-colors duration-300 whitespace-nowrap select-none
                      ${activeLink === label
                        ? "text-primary"
                        : "text-muted-foreground/60 hover:text-foreground"
                      }
                    `}
                  >
                    {activeLink === label && !external && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-primary/[0.05] border border-primary/15 shadow-[0_2px_10px_-3px_rgba(10,169,57,0.1)] -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Actions ────────────────────────────── */}
            <div className="flex items-center gap-1 md:gap-2 ml-auto shrink-0">

              {/* Theme toggle (desktop) */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="hidden md:flex relative w-9 h-9 rounded-xl items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/6 border border-transparent hover:border-primary/15 transition-all duration-250 overflow-hidden"
              >
                <motion.span
                  key={theme}
                  initial={{ rotate: -30, scale: 0.6, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 30, scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  {theme === "dark" ? <Sun className="h-[17px] w-[17px]" /> : <Moon className="h-[17px] w-[17px]" />}
                </motion.span>
              </button>

              {/* Divider */}
              <div className="hidden md:block h-5 w-px bg-border/60 mx-1" />

              {/* Sign In / Dashboard */}
              <Link
                to={session ? (profile?.is_admin ? "/admin" : "/dashboard") : "/auth"}
                className="hidden md:flex items-center gap-1.5 px-3.5 h-9 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground/80 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/15 transition-all duration-250 whitespace-nowrap"
              >
                {session ? (profile?.is_admin ? "Admin Panel" : "Dashboard") : "Sign In"}
              </Link>

              {/* Get Access CTA */}
              <Link
                to="/auth?mode=signup"
                className="hidden md:flex items-center gap-2 pl-4 pr-3.5 h-9 rounded-full vouchy-gradient-bg text-white text-[10px] font-extrabold uppercase tracking-[0.18em] shadow-[0_0_20px_rgba(10,169,57,0.30)] hover:shadow-[0_0_28px_rgba(10,169,57,0.45)] hover:scale-[1.04] active:scale-[0.97] transition-all duration-200 whitespace-nowrap border-0"
              >
                Get Access
                <ArrowRight className="h-3 w-3 opacity-80" />
              </Link>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className="md:hidden relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/15 transition-all duration-250"
              >
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                    <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* ── MOBILE DRAWER ──────────────────────────────── */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="md:hidden mt-2 pb-safe"
              >
                <div className="bg-background/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden p-2">
                  <div className="flex flex-col gap-1">
                    {/* Nav links */}
                    {navLinks.map(({ label, href, external }, i) => (
                      <motion.a
                        key={label}
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        onClick={(e) => {
                          if (href === "#top") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                          setMenuOpen(false);
                          setActiveLink(label);
                        }}
                        className="flex items-center justify-between h-11 px-4 rounded-xl hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                          {label}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                      </motion.a>
                    ))}

                    <div className="h-px bg-border/40 my-2 mx-2" />

                    {/* Theme toggle */}
                    <button
                      onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark");
                        setMenuOpen(false); // Optional: close menu on theme switch
                      }}
                      className="flex items-center justify-between h-11 px-4 rounded-xl hover:bg-muted/50 transition-colors w-full"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors">
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </span>
                      {theme === "dark" ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
                    </button>

                    {/* Sign In */}
                    <Link
                      to="/auth"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between h-11 px-4 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground transition-colors">Sign In</span>
                    </Link>

                    {/* Get Started CTA */}
                    <Link
                      to="/auth?mode=signup"
                      onClick={() => setMenuOpen(false)}
                      className="mt-2 flex items-center justify-center h-12 vouchy-gradient-bg text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                    >
                      <span className="text-[11px] font-extrabold uppercase tracking-widest">Get Started Free</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </nav>

      {/* Page Sections */}
      <main className="pt-20">
        <Hero />

        <BentoGrid />
        <TrustPageFeature />
        <TestimonialDesigns />

        {/* Testimonials Embed */}
        <div className="container mx-auto px-6 max-w-7xl relative z-10 pb-4 pt-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 lg:mb-10 max-w-7xl mx-auto">
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4"
              >
                <TbSparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Social Proof</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground leading-[1.1]"
              >
                Trusted by <br className="hidden lg:block" />
                <span className="text-primary font-medium">builders</span> worldwide
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base text-muted-foreground leading-relaxed max-w-sm font-light lg:text-right"
            >
              See why hundreds of companies choose Vouchy to collect, manage, and display their video testimonials.
            </motion.p>
          </div>
        </div>
        
        {/* WIDGET CONTAINER */}
        <div className="container mx-auto px-6 max-w-7xl mb-24">
          <div 
            key={`widget-${theme}`} 
            id="landing-widget-container" 
            className="bg-transparent" 
            style={{ background: 'transparent' }}
          ></div>
        </div>

        <HowItWorks />
        <Pricing />
        <CTA />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container max-w-7xl mx-auto px-6 md:px-10 py-6 md:h-16 md:py-0 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

          <VouchyLogo variant="minimal" />

          {/* Links + copyright */}
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <Link
              to="/privacy"
              className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/35 hover:text-muted-foreground transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/35 hover:text-muted-foreground transition-colors duration-200"
            >
              Terms
            </Link>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/25 whitespace-nowrap">
              © 2026 Vouchy Labs
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
}
