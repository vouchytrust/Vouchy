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
    <section id="pricing" className="relative py-20 lg:py-32 bg-background border-y border-border overflow-hidden min-h-screen flex flex-col justify-center" ref={ref}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative p-8 rounded-2xl flex flex-col border transition-all duration-300 ${plan.popular
                  ? "border-primary bg-primary/[0.02]"
                  : "border-border bg-transparent shadow-sm"
                }`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Plan content */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary px-2 py-0.5 rounded-full bg-primary/10">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-10 h-10 font-medium leading-relaxed">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground font-bold text-xs tracking-widest uppercase">{plan.period}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan === plan.name}
                className={`w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mb-10 ${plan.popular
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                    : "bg-muted text-foreground border border-border hover:bg-muted/80"}`}
              >
                {loadingPlan === plan.name ? (
                  <TbLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {plan.cta}
                    <TbArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Features List */}
              <ul className="space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <TbCheck className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span className="text-xs text-foreground/80 font-medium leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Pricing;
