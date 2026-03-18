import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TbArrowRight, TbCheck } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-12 lg:py-16 px-4 md:px-6 relative overflow-hidden bg-background min-h-screen flex flex-col justify-center">
      {/* Blueprint Grid Background */}
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

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="group relative px-8 py-10 md:py-16 text-center bg-card/30 border border-border/50 backdrop-blur-md rounded-2xl">
          {/* Precision Corners */}
          <div className="absolute -top-px -left-px w-14 h-14 border-t-[2px] border-l-[2px] border-primary/40 rounded-tl-2xl group-hover:border-primary transition-all duration-500" />
          <div className="absolute -top-px -right-px w-14 h-14 border-t-[2px] border-r-[2px] border-primary/40 rounded-tr-2xl group-hover:border-primary transition-all duration-500" />
          <div className="absolute -bottom-px -left-px w-14 h-14 border-b-[2px] border-l-[2px] border-primary/40 rounded-bl-2xl group-hover:border-primary transition-all duration-500" />
          <div className="absolute -bottom-px -right-px w-14 h-14 border-b-[2px] border-r-[2px] border-primary/40 rounded-br-2xl group-hover:border-primary transition-all duration-500" />

          {/* Floating Element */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-4 md:left-12 hidden md:block"
          >
            <div className="bg-card border border-border p-2 rounded-2xl shadow-lg rotate-[-6deg]">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://i.pravatar.cc/150?u=a" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">Join Now</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-8 max-w-4xl mx-auto leading-[1.1] text-foreground">
            Ready to start <br />
            <span className="text-primary font-medium">collecting reviews?</span>
          </h2>

          {/* Subhead */}
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Free to start. Takes five minutes to set up. Your first testimonial could be live today.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full bg-foreground text-background font-bold text-lg hover:bg-foreground/90 hover:scale-105 transition-all shadow-xl"
              onClick={() => navigate("/auth", { state: { mode: "signup" } })}
            >
              Get Started for Free
              <TbArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium px-4">
              <span className="flex items-center gap-1.5"><TbCheck className="text-primary" /> No credit card</span>
              <span className="flex items-center gap-1.5"><TbCheck className="text-primary" /> Cancel anytime</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
