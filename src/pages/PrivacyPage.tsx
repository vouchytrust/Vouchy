import { motion } from "framer-motion";
import { VouchyLogo } from "@/components/VouchyLogo";
import { ChevronLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary relative overflow-x-hidden">
      {/* ── BACKGROUND ───────────────────────────────────────────── */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ 
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "40px 40px" 
        }} 
      />

      {/* ── NAVIGATION ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-[999] flex justify-center pointer-events-none p-4 md:p-6">
        <div className="w-full max-w-4xl pointer-events-auto flex items-center justify-between h-[58px] px-4 rounded-2xl bg-background/40 backdrop-blur-xl border border-border/10">
          <VouchyLogo variant="header" />
          <Link to="/" className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back Home
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Privacy Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Your data, <span className="text-primary italic">protected.</span>
            </h1>
            <p className="text-[14px] text-muted-foreground font-medium">
              Effective Date: March 14, 2026 • Last Updated: March 14, 2026
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
            prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:font-medium
            prose-strong:text-foreground prose-strong:font-bold
            prose-ul:text-muted-foreground prose-li:my-2">
            
            <p>
              At Vouchy Labs ("Vouchy," "we," "us," or "our"), we build Precision Social Proof Architecture to help brands showcase authentic human trust. We are committed to protecting the privacy of everyone who interacts with our services — whether you're a business collecting testimonials, a customer submitting a vouch, or a visitor viewing a Trust Page or widget.
            </p>

            <p>
              This Privacy Policy explains what information we collect, how we use it, who we share it with, and your choices. It applies to <strong>vouchy.click</strong>, the dashboard, Collectors, Trust Pages, embedded widgets, and related features.
            </p>

            <h2 className="text-2xl mt-12 mb-6">1. Information We Collect</h2>
            <ul>
              <li><strong>From business users (account holders):</strong> name, email, company name, payment information (handled securely by our payment processor), and usage data.</li>
              <li><strong>From testimonial givers:</strong> name, profile image, submitted text, video (including audio), and answers to guided questions. Submitting is voluntary and does not require an account.</li>
              <li><strong>From all visitors:</strong> IP address, browser/device type, pages viewed, timestamps, and performance metrics to keep everything fast and reliable.</li>
              <li><strong>Cookies & similar technologies:</strong> essential cookies for core functionality (sessions, dark mode) and analytics cookies to understand how public pages perform.</li>
            </ul>

            <h2 className="text-2xl mt-12 mb-6">2. How We Use Information</h2>
            <p>
              We use your information to deliver the service, host testimonials, and power our proprietary in-browser recording tools. This includes transcribing video/audio for quality assurance and applying AI-driven text enhancements when requested. We also use data to protect the platform from fraud and to communicate essential account updates.
            </p>

            <h2 className="text-2xl mt-12 mb-6">3. AI Features</h2>
            <p>
              Our AI tools use encrypted third-party providers (OpenAI/Anthropic). <strong>We do not use your personal testimonials to train third-party models.</strong> Providers are contractually prohibited from retaining your content beyond delivering the specific service requested.
            </p>

            <h2 className="text-2xl mt-12 mb-6">4. Trusted Service Providers</h2>
            <p>
              We do not sell personal information. We shared only necessary data with:
            </p>
            <ul>
              <li><strong>Supabase:</strong> For secure database and authentication.</li>
              <li><strong>Cloudflare R2:</strong> For ultra-fast, encrypted video storage.</li>
              <li><strong>Vercel:</strong> For performance monitoring and analytics.</li>
            </ul>

            <h2 className="text-2xl mt-12 mb-6">5. Your Rights & Contact</h2>
            <p>
              You have the right to access, correct, or delete your data at any time. Business users can manage this via the dashboard. For all other requests, please contact our privacy representative at:
            </p>
            <div className="p-6 rounded-2xl bg-card border border-border/50 text-center flex flex-col items-center gap-3 my-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">Official Support Email</span>
              <a href="mailto:vouchytrust@gmail.com" className="text-lg font-bold text-primary hover:underline">vouchytrust@gmail.com</a>
            </div>

            <p className="mt-16 text-sm italic text-muted-foreground">
              © 2026 Vouchy Labs — All rights reserved.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <VouchyLogo variant="minimal" />
          <div className="flex gap-8">
            <Link to="/terms" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Vouchy Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
