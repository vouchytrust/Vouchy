import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { TbCheck, TbArrowRight, TbSparkles, TbLoader } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for trying out Vouchy",
    productId: null,
    features: [
      "50 text reviews",
      "1 active space",
      "No video reviews",
      "Powered by Vouchy badge",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    description: "The Essential plan for growing businesses",
    productId: "pdt_0NVVmIlZrdWC90xs1ZgOm",
    features: [
      "Unlimited text reviews",
      "500 video reviews limit",
      "3 active spaces",
      "200 AI Magic credits/mo",
      "Teleprompter included",
      "No Vouchy branding",
    ],
    cta: "Start Pro",
    popular: true,
  },
  {
    name: "Agency",
    price: "$45",
    period: "/mo",
    description: "The Studio plan for teams & agencies",
    productId: "pdt_0NVVmba1bevOgK6sfV8Wx",
    features: [
      "Unlimited text reviews",
      "1000 video reviews limit",
      "15 active spaces",
      "500 AI Magic credits/mo",
      "Full AI Suite access",
      "No Vouchy branding",
    ],
    cta: "Start Agency",
    popular: false,
  },
];

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    if (!plan.productId) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/auth", { state: { plan: plan.name, mode: "signup" } });
      }
      return;
    }

    if (!user) {
      navigate("/auth", { state: { plan: plan.name, mode: "signup" } });
      return;
    }

    setLoadingPlan(plan.name);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          productId: plan.productId,
          customerEmail: user.email,
          customerName: user.user_metadata?.full_name || user.email,
          returnUrl: `${window.location.origin}/dashboard?payment=success`,
        },
      });

      if (error) throw error;

      if (data?.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        throw new Error('No payment link received');
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to create checkout session. Please try again.",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="relative py-12 lg:py-16 bg-background border-y border-border overflow-hidden min-h-screen flex flex-col justify-center" ref={ref}>
      {/* Background structural lines */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`, 
          backgroundSize: '80px 80px' 
        }} 
      />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`, 
          backgroundSize: '20px 20px' 
        }} 
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 lg:mb-10 max-w-7xl mx-auto">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4"
            >
              <TbSparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Pricing</span>
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
            >
              Simple plans, <br />
              <span className="text-primary font-medium">no surprises.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-muted-foreground leading-relaxed max-w-sm font-light lg:text-right"
          >
            Start free and upgrade when you're ready. No hidden fees, no contracts.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`group relative p-6 rounded-2xl transition-all duration-500 flex flex-col bg-card/40 border border-border/50 backdrop-blur-sm ${
                plan.popular
                ? "scale-[1.02] z-10 ring-1 ring-primary/20"
                : ""
              }`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              {/* Precision Corners - Perfectly aligned with brand radius */}
              <div className={`absolute -top-px -left-px w-10 h-10 border-t-[1.5px] border-l-[1.5px] rounded-tl-2xl ${plan.popular ? 'border-primary/50' : 'border-primary/30'} group-hover:border-primary transition-all duration-500`} />
              <div className={`absolute -top-px -right-px w-10 h-10 border-t-[1.5px] border-r-[1.5px] rounded-tr-2xl ${plan.popular ? 'border-primary/50' : 'border-primary/30'} group-hover:border-primary transition-all duration-500`} />
              <div className={`absolute -bottom-px -left-px w-10 h-10 border-b-[1.5px] border-l-[1.5px] rounded-bl-2xl ${plan.popular ? 'border-primary/50' : 'border-primary/30'} group-hover:border-primary transition-all duration-500`} />
              <div className={`absolute -bottom-px -right-px w-10 h-10 border-b-[1.5px] border-r-[1.5px] rounded-br-2xl ${plan.popular ? 'border-primary/50' : 'border-primary/30'} group-hover:border-primary transition-all duration-500`} />

              {/* Tier Marker */}
              <div className="inline-flex items-center gap-2 mb-8 relative z-10">
                <div className={`px-2 py-0.5 rounded bg-foreground text-[8px] font-black uppercase tracking-widest ${plan.popular ? "text-background" : "text-background"}`}>
                  Tier 0{index + 1}
                </div>
                {plan.popular && (
                  <div className="px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest animate-pulse">
                    Gold Standard
                  </div>
                )}
              </div>

              {/* Plan content */}
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold mb-2 text-foreground tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-10 h-10 font-medium leading-relaxed">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground font-bold text-sm tracking-widest uppercase">{plan.period}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan === plan.name}
                className={`w-full group/btn relative h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 z-10 ${
                  plan.popular 
                  ? "bg-foreground text-background shadow-xl shadow-black/20 hover:scale-[1.03]" 
                  : "bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10"}`}
              >
                {loadingPlan === plan.name ? (
                  <TbLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {plan.cta}
                    <TbArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </>
                )}
                {/* Gloss Effect for Popular Card */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                )}
              </button>

              {/* Features Architecture */}
              <div className="mt-12 flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-primary/10" />
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/40">Specifications</p>
                  <div className="h-px flex-1 bg-primary/10" />
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/20 mt-1.5 shrink-0 transition-all group-hover:bg-primary/60 shadow-[0_0_8px_rgba(var(--primary),0.3)]" />
                      <span className="text-xs text-foreground/70 font-bold leading-snug tracking-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Structural Label */}
              <div className="mt-12 text-center relative z-10">
                <span className="text-[7px] font-mono text-primary/20 uppercase tracking-[0.5em]">Auth_Sys_Arc_{plan.name.slice(0, 3).toUpperCase()}</span>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Pricing;
