import { motion } from "framer-motion";
import { VouchyLogo } from "@/components/VouchyLogo";
import { ChevronLeft, Gavel } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsPage() {
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
                <Gavel className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Legal Terms</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Terms of <span className="text-primary italic">Service.</span>
            </h1>
            <p className="text-[14px] text-muted-foreground font-medium">
              Last Updated: March 14, 2026
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
            prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:font-medium
            prose-strong:text-foreground prose-strong:font-bold
            prose-ul:text-muted-foreground prose-li:my-2">
            
            <p>
              Welcome to Vouchy. These Terms govern your use of our platform — including the website, dashboard, Collectors, Trust Pages, widgets, video tools, AI features, and all related services. By using Vouchy (including viewing or submitting testimonials), you agree to these terms.
            </p>

            <h2 className="text-2xl mt-12 mb-6">1. Eligibility</h2>
            <p>
              You must be at least 18 years old (or have parental/guardian consent if younger) and able to form binding contracts. If you use the service on behalf of a business, you warrant that you have the authority to bind that entity.
            </p>

            <h2 className="text-2xl mt-12 mb-6">2. Your Content & Testimonials</h2>
            <ul>
              <li><strong>Ownership:</strong> Business users retain ownership of the testimonials they collect.</li>
              <li><strong>License from Submitters:</strong> By submitting a vouch, you grant Vouchy a worldwide, royalty-free license to host, display, and distribute your content across the Trust Pages and widgets chosen by the collector.</li>
              <li><strong>Public Nature:</strong> Once a testimonial is approved and published, it becomes publicly visible. Submitters understand that their content is intended for brand promotion.</li>
              <li><strong>Prohibited Content:</strong> No fraudulent, illegal, defamatory, or harmful material. We reserve the right to remove any content that violates these standards.</li>
            </ul>

            <h2 className="text-2xl mt-12 mb-6">3. AI Features</h2>
            <p>
              AI tools like "AI Magic" and "Assisted Scripting" are provided "as-is." While we strive for accuracy, AI outputs may contain errors. You are responsible for reviewing and approving all AI-modified content before publication.
            </p>

            <h2 className="text-2xl mt-12 mb-6">4. Subscription & Payments</h2>
            <p>
              Billing auto-renews according to your chosen plan. You can cancel at any time via the dashboard. Please note that AI credits refresh monthly and do not roll over. No refunds are provided except where required by law.
            </p>

            <h2 className="text-2xl mt-12 mb-6">5. Acceptable Use Policy</h2>
            <p>
              You agree not to misuse the service, reverse-engineer the underlying architecture, or violate third-party rights. Vouchy owns the platform, the "Blueprint" design system, and all non-user content.
            </p>

            <h2 className="text-2xl mt-12 mb-6">6. Disclaimers & Liability</h2>
            <p>
              Vouchy is provided without warranties of any kind. We are not liable for data loss, service interruptions, or misuse of testimonials by third parties. Our liability is limited to the amount paid by you in the 12 months prior to any claim.
            </p>

            <h2 className="text-2xl mt-12 mb-6">7. Contact & Support</h2>
            <p>
              For legal inquiries or account support, please reach out to our team:
            </p>
            <div className="p-6 rounded-2xl bg-card border border-border/50 text-center flex flex-col items-center gap-3 my-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">Official Support Email</span>
              <a href="mailto:vouchytrust@gmail.com" className="text-lg font-bold text-primary hover:underline">vouchytrust@gmail.com</a>
            </div>

            <p className="mt-16 text-sm italic text-muted-foreground">
              © 2026 Vouchy Labs — Precise Social Proof Architecture.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <VouchyLogo variant="minimal" />
          <div className="flex gap-8">
            <Link to="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Vouchy Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
