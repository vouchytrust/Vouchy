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
  ProductShowcase,
  TestimonialDesigns,
} from "@/components/landing";

import { TbStarFilled, TbSparkles } from "react-icons/tb";
import { VouchyLogo } from "@/components/VouchyLogo";



export default function LandingPage() {
  const { theme, setTheme } = useTheme();
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
    script.src = window.location.origin + "/embed.js";
    script.setAttribute("data-widget-id", "f5618c3c-22a1-40d6-b9b4-114fc7abb53b");
    script.async = true;

    container.appendChild(script);

    return () => {
      // Leave cleanup to the next mount to prevent flicker or race conditions
    };
  }, []);

  const navLinks = [
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
                ? "bg-background/80 dark:bg-card/70 backdrop-blur-2xl border-primary/20 shadow-[0_16px_48px_-12px_rgba(10,169,57,0.18),inset_0_1px_0_rgba(255,255,255,0.06)]"
                : "bg-background/40 dark:bg-card/30 backdrop-blur-xl border-primary/10 shadow-none"
              }
            `}
          >
            {/* ── LEFT: Logo + Wordmark ─────────────────────── */}
            <VouchyLogo variant="header" className="mr-4" />

            {/* ── CENTER: Nav pills ─────────────────────────── */}
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div className="relative flex items-center gap-0.5 px-1.5 py-1">
                {/* Sliding indicator */}
                <AnimatePresence>
                  {navLinks.map(({ label }) =>
                    label === activeLink ? (
                      <motion.div
                        key="indicator"
                        layoutId="nav-indicator"
                        className="absolute inset-y-1 rounded-full bg-primary/12 border border-primary/20"
                        style={{
                          left: `${navLinks.findIndex((l) => l.label === activeLink) * (100 / navLinks.length)}%`,
                          width: `calc(${100 / navLinks.length}% - 4px)`,
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 36 }}
                      />
                    ) : null
                  )}
                </AnimatePresence>

                {navLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => {
                      if (href === "#top") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                      setActiveLink(label);
                    }}
                    className={`
                      relative z-10 px-4 py-1.5 rounded-full text-[10.5px] font-bold uppercase tracking-[0.18em]
                      transition-colors duration-250 whitespace-nowrap select-none
                      ${activeLink === label
                        ? "text-primary"
                        : "text-muted-foreground/70 hover:text-foreground"
                      }
                    `}
                  >
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

              {/* Sign In */}
              <Link
                to="/auth"
                className="hidden md:flex items-center gap-1.5 px-3.5 h-9 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground/80 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/15 transition-all duration-250 whitespace-nowrap"
              >
                Sign In
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
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden mt-2 pb-safe"
              >
                <div className="relative bg-background/96 dark:bg-card/92 backdrop-blur-2xl border border-primary/20 rounded-2xl shadow-[0_30px_70px_-20px_rgba(10,169,57,0.18)] overflow-hidden">
                  {/* Vouchy corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-primary/50 rounded-tl-[4px]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-[1.5px] border-r-[1.5px] border-primary/50 rounded-tr-[4px]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[1.5px] border-l-[1.5px] border-primary/50 rounded-bl-[4px]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-primary/50 rounded-br-[4px]" />

                  {/* Header strip */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-primary/8">
                    <div className="flex items-center gap-2">
                      <img src="/logo-icon.svg" alt="" className="h-4 w-4 opacity-50" />
                      <span className="text-[9px] font-black font-mono text-primary/40 uppercase tracking-[0.45em]">Vouchy Navigation</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[8px] font-black text-primary/50 uppercase tracking-widest">Live</span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col gap-0.5">
                    {/* Nav links */}
                    {navLinks.map(({ label, href }, i) => (
                      <motion.a
                        key={label}
                        href={href}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => {
                          if (href === "#top") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                          setMenuOpen(false);
                          setActiveLink(label);
                        }}
                        className="flex items-center gap-3 h-12 px-4 rounded-xl group/link hover:bg-primary/5 border border-transparent hover:border-primary/12 transition-all duration-200"
                      >
                        <span className="text-[9px] font-black text-primary/20 font-mono group-hover/link:text-primary/50 transition-colors tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground group-hover/link:text-primary transition-colors flex-1">
                          {label}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-primary/0 group-hover/link:text-primary/40 transition-colors -translate-x-1 group-hover/link:translate-x-0 duration-200" />
                      </motion.a>
                    ))}

                    {/* Divider */}
                    <div className="my-2.5 flex items-center gap-3 px-1">
                      <div className="h-px flex-1 bg-border/50" />
                      <span className="text-[8px] font-black uppercase tracking-[0.45em] text-muted-foreground/35">Account</span>
                      <div className="h-px flex-1 bg-border/50" />
                    </div>

                    {/* Theme toggle */}
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/12 transition-all duration-200 group/theme w-full text-left"
                    >
                      <div className="relative w-7 h-7 rounded-lg flex items-center justify-center bg-primary/5 border border-primary/15 group-hover/theme:border-primary/35 transition-colors shrink-0">
                        {theme === "dark"
                          ? <Sun className="h-3.5 w-3.5 text-primary" />
                          : <Moon className="h-3.5 w-3.5 text-primary" />
                        }
                      </div>
                      <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground group-hover/theme:text-primary transition-colors">
                        {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                      </span>
                    </button>

                    {/* Sign In */}
                    <Link
                      to="/auth"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/12 transition-all duration-200 group/signin"
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black bg-primary/5 border border-primary/15 group-hover/signin:border-primary/35 transition-colors text-primary/60 shrink-0">
                        ↗
                      </div>
                      <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground group-hover/signin:text-primary transition-colors">
                        Sign In
                      </span>
                    </Link>

                    {/* Get Started CTA */}
                    <Link
                      to="/auth?mode=signup"
                      onClick={() => setMenuOpen(false)}
                      className="mt-1.5 relative flex items-center justify-between h-14 px-5 vouchy-gradient-bg text-white rounded-2xl shadow-[0_4px_20px_rgba(10,169,57,0.35)] hover:shadow-[0_6px_28px_rgba(10,169,57,0.45)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 overflow-hidden group/cta"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity" />
                      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-white/25 rounded-tl-lg" />
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-white/25 rounded-br-lg" />
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] relative z-10">Get Started Free</span>
                      <ArrowRight className="h-4 w-4 relative z-10 group-hover/cta:translate-x-0.5 transition-transform" />
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
        <ProductShowcase />
        <TestimonialDesigns />

        {/* Testimonials Embed */}
        <div className="container mx-auto px-6 max-w-7xl relative z-10 mb-12 py-16">
          <div className="flex flex-col items-center text-center">
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
              className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4"
            >
              Trusted by <span className="text-primary font-medium">builders</span> worldwide
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-sm md:text-base max-w-2xl font-medium leading-relaxed"
            >
              See why hundreds of companies choose Vouchy to collect, manage, and display their video testimonials.
            </motion.p>
          </div>
        </div>
        <div id="landing-widget-container" style={{ background: 'transparent' }}></div>

        <HowItWorks />
        <Pricing />
        <CTA />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">

          <VouchyLogo variant="minimal" />

          {/* Links + copyright */}
          <div className="flex items-center gap-6">
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
            <a
              href="https://twitter.com/vouchytrust"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/35 hover:text-muted-foreground transition-colors duration-200"
            >
              Twitter
            </a>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/25 whitespace-nowrap">
              © 2026 Vouchy Labs
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
}
