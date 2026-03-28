import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Video, Code2, Users, CheckCircle2, MessageSquare, Mic, Quote } from "lucide-react";
import { TbStarFilled, TbHeartFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Hero() {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section className="relative bg-background pt-12 pb-10 lg:pt-28 lg:pb-12 overflow-hidden z-10">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT: Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center lg:text-left max-w-4xl mx-auto lg:mx-0"
          >
            {/* Pill badge */}
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground mb-8 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">Sell with social proof.</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-bold tracking-tighter text-foreground mb-6 leading-[1.05]">
              <span className="lg:block lg:whitespace-nowrap">Let your customers</span>
              <span className="lg:flex lg:items-center lg:gap-4 lg:whitespace-nowrap mt-1">
                <span className="inline-flex items-center -space-x-4 align-middle transform translate-y-[-2px]">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="w-10 h-10 md:w-14 lg:w-16 border-4 border-background ring-1 ring-primary/20 overflow-hidden">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 10}`} alt={`User ${i}`} className="object-cover" loading="lazy" />
                      <AvatarFallback className="bg-muted text-muted-foreground text-[8px] font-black uppercase">U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </span>
                sell
              </span>
              <span className="lg:block lg:whitespace-nowrap mt-1">
                <> </>for <span className="text-primary">you.</span>
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-light">
              High-fidelity video and text proof that turns skeptical <br className="hidden md:block" />
              visitors into confident buyers automatically.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="h-14 px-8 rounded-2xl bg-foreground text-background text-base font-semibold hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl w-full sm:w-auto overflow-hidden group relative"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                Start Collecting for Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open("https://vouchy.click/c/vouchy", "_blank")}
                className="h-14 px-8 rounded-2xl text-foreground border-border hover:bg-muted text-base font-semibold w-full sm:w-auto overflow-hidden group/demo"
              >
                <div className="flex items-center gap-2 group-hover/demo:scale-105 transition-transform duration-300">
                  <Play className="w-4 h-4 fill-foreground" />
                  <span>Leave a Review</span>
                </div>
              </Button>
            </motion.div>
          </motion.div>

          {/* RIGHT: Creative Minimal Showcase */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative lg:h-[460px] flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[460px]">
              <div className="relative p-8 md:p-10 flex flex-col gap-6 z-10">
                {/* Precision Corners Reverted */}
                <div className="absolute -top-px -left-px w-10 h-10 border-t-[1.5px] border-l-[1.5px] border-primary/40 rounded-tl-2xl group-hover:border-primary transition-all duration-500" />
                <div className="absolute -top-px -right-px w-10 h-10 border-t-[1.5px] border-r-[1.5px] border-primary/40 rounded-tr-2xl group-hover:border-primary transition-all duration-500" />
                <div className="absolute -bottom-px -left-px w-10 h-10 border-b-[1.5px] border-l-[1.5px] border-primary/40 rounded-bl-2xl group-hover:border-primary transition-all duration-500" />
                <div className="absolute -bottom-px -right-px w-10 h-10 border-b-[1.5px] border-r-[1.5px] border-primary/40 rounded-br-2xl group-hover:border-primary transition-all duration-500" />

                {/* Conceptual Quote */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="pl-6 border-l border-primary/20 py-2"
                >
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(i => <TbStarFilled key={i} className="w-3 h-3 text-yellow-500/80" />)}
                  </div>
                  <p className="text-lg md:text-xl font-medium text-foreground tracking-tight leading-snug mb-3">
                    "It used to take weeks to get a case study. Now our customers record them on their phones in two minutes."
                  </p>

                </motion.div>

                {/* Secondary Minimal Testimonial */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="pl-6 border-l-[3px] border-primary mt-2 flex flex-col overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-primary/5 -z-10 backdrop-blur-md rounded-r-2xl" />
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">

                      <div className="space-y-1">

                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => <TbStarFilled key={i} className="w-2.5 h-2.5 text-yellow-500/80" />)}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                      "Vouchy's automation handles everything while you focus on building."
                    </p>

                  </div>
                </motion.div>

              </div>

              {/* Minimal geometric rings (Background) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-border/40 rounded-full border-dashed pointer-events-none"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-border/20 rounded-full pointer-events-none"
              />
            </div>
          </motion.div>


        </div>
      </div>
    </section>
  );
}
