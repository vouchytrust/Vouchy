import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Star, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/contexts/AuthContext";
import { VouchyLogo } from "@/components/VouchyLogo";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, profile } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      if (profile && !profile.onboarding_completed) {
        navigate("/onboarding", { replace: true });
      } else if (profile) {
        if (profile.is_admin) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    }
  }, [session, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name } },
        });
        if (error) throw error;
        toast({ title: "Account created!", description: "Setting up your workspace..." });
        navigate("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        toast({ title: "Welcome back!" });
        // Navigation handled by useEffect
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <VouchyLogo className="mb-10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "signin"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-3xl font-bold text-foreground mb-2 tracking-[-0.04em]">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-[14px] text-muted-foreground mb-8 font-medium">
                {isSignUp ? "Start collecting testimonials in minutes." : "Sign in to your Vouchy dashboard."}
              </p>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 mb-4"
                onClick={async () => {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: `${window.location.origin}/onboarding`,
                      },
                    });
                    if (error) toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
                }}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or continue with email</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="name" placeholder="Jane Doe" className="pl-10 h-11" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="jane@company.com" className="pl-10 h-11" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground text-center mt-6">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right - Visual Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-background border-l border-border/40">
        
        {/* Subtle grid pattern - Brand consistent */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px" 
          }} 
        />

        {/* Brand Glow - Very subtle corner light */}
        <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-[20%] -left-[20%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Corner accents */}
        <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-primary/20" />
        <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-primary/20" />
        <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-primary/20" />
        <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-primary/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-14">

          {/* Top — logo + headline */}
          <div>
            <VouchyLogo className="mb-10" />

            <h2 className="text-4xl font-bold tracking-tighter text-foreground leading-[1.1] mb-4">
              Turn happy customers<br />
              into <span className="text-primary italic">your best asset.</span>
            </h2>
            <p className="text-[14px] text-muted-foreground font-medium leading-relaxed max-w-xs">
              Collect video and text testimonials, polish them with AI, and embed them anywhere in minutes.
            </p>
          </div>

          {/* Middle — floating testimonial cards */}
          <div className="relative h-[260px] my-8">
            {[
              {
                name: "Sarah M.", role: "Head of Marketing", avatar: "https://i.pravatar.cc/150?u=sm1",
                quote: "We got 40+ video reviews in a month. Vouchy is a game-changer.",
                delay: 0, y: 0, x: 0,
              },
              {
                name: "James O.", role: "Founder, BuildFast", avatar: "https://i.pravatar.cc/150?u=jo2",
                quote: "Conversion rate jumped 18% the week after embedding.",
                delay: 0.15, y: 80, x: 60,
              },
              {
                name: "Lena B.", role: "Growth Lead", avatar: "https://i.pravatar.cc/150?u=lb3",
                quote: "Customers actually enjoy leaving reviews. Drop-off is zero.",
                delay: 0.3, y: 165, x: 20,
              },
            ].map((t, i) => (
              <div
                key={i}
                className="absolute bg-background/90 backdrop-blur-sm border border-border/60 rounded-2xl p-4 shadow-lg w-[280px]"
                style={{ top: t.y, left: t.x }}
              >
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-[11px] text-foreground/80 font-medium leading-relaxed mb-3 line-clamp-2">"{t.quote}"</p>
                <div className="flex items-center gap-2">
                  <img src={t.avatar} alt={t.name} className="w-6 h-6 rounded-full border border-border" />
                  <div>
                    <p className="text-[10px] font-bold text-foreground leading-none">{t.name}</p>
                    <p className="text-[9px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom — brand strip */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30">
              Vouchy — Social Proof Platform
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
