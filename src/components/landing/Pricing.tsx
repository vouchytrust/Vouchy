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
      "10 testimonials total",
      "1 active space",
      "60 second video limit",
      "Vouchy branding",
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
      "50 testimonials total",
      "3 active spaces",
      "3 minute video limit",
      "200 AI Magic credits/mo",
      "Teleprompter included",
      "Custom logo branding",
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
      "250 testimonials total",
      "15 active spaces",
      "5 minute video limit",
      "500 AI Magic credits/mo",
      "Full AI Suite access",
      "Full white-label solution",
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
    <section id="pricing" className="relative py-24 lg:py-32 px-6 bg-muted/30 border-y border-border" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Simple, transparent <span className="text-primary">pricing</span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Upgrade as you grow. Transparent billing. No hidden fees.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative p-8 rounded-[2rem] bg-card border transition-all duration-300 h-full flex flex-col ${plan.popular
                ? "border-primary shadow-2xl shadow-primary/10 scale-105 z-10 ring-4 ring-primary/5"
                : "border-border hover:border-primary/20 hover:shadow-xl"
                }`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-full shadow-lg">
                    <TbSparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 h-10">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground font-medium">{plan.period}</span>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full group rounded-xl h-12 text-base font-bold mb-8 transition-all duration-300 ${plan.popular ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90" : "bg-muted text-foreground hover:bg-muted/80"}`}
                disabled={loadingPlan === plan.name}
              >
                {loadingPlan === plan.name ? (
                  <TbLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {plan.cta}
                    <TbArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Features */}
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Includes:</p>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <TbCheck className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-foreground/80 font-medium leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
